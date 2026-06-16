/**
 * ghl-opportunity.ts — create a GoHighLevel opportunity in the "Trials" pipeline.
 *
 * Why this exists: the website voice bot (api/retell/capture-lead) and the /start
 * signup form (api/signup) both create a CONTACT but used to stop there — leads
 * never reached the pipeline (found 2026-06-16: John Doe contact existed, zero
 * opportunities). This adds the missing step.
 *
 * Design: we resolve the pipeline + first stage by NAME at call time instead of
 * hardcoding IDs, because the PIT token can't create pipelines via API (401 "not
 * authorized for this scope") — the pipeline is made in the GHL UI. Name-lookup
 * means the code ships now and self-activates the moment a "Trials" pipeline
 * exists, with no redeploy. Low signup volume makes the extra GET negligible.
 *
 * Best-effort: any failure is logged and swallowed so a pipeline hiccup never
 * breaks the signup/contact path.
 */

const GHL_BASE = "https://services.leadconnectorhq.com";
const PIPELINE_NAME = (process.env.GHL_TRIALS_PIPELINE || "Trials").trim();

type Pipeline = { id: string; name: string; stages?: { id: string; name: string; position?: number }[] };

// Cache the resolved pipeline for the lifetime of the serverless instance.
let cached: { pipelineId: string; stageId: string } | null = null;

async function resolveTrialsPipeline(key: string, locationId: string): Promise<{ pipelineId: string; stageId: string } | null> {
  if (cached) return cached;
  try {
    const r = await fetch(`${GHL_BASE}/opportunities/pipelines?locationId=${locationId}`, {
      headers: { Authorization: `Bearer ${key}`, Version: "2021-07-28", Accept: "application/json" },
    });
    if (!r.ok) {
      console.error("ghl-opportunity: pipelines fetch failed", r.status);
      return null;
    }
    const d = (await r.json().catch(() => ({}))) as { pipelines?: Pipeline[] };
    const pipelines = d.pipelines || [];
    const p =
      pipelines.find((x) => x.name?.trim().toLowerCase() === PIPELINE_NAME.toLowerCase()) || null;
    if (!p || !p.stages?.length) {
      console.error(`ghl-opportunity: "${PIPELINE_NAME}" pipeline not found or has no stages (make it in the GHL UI)`);
      return null;
    }
    const stages = [...p.stages].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
    cached = { pipelineId: p.id, stageId: stages[0].id };
    return cached;
  } catch (e) {
    console.error("ghl-opportunity: resolve failed", e);
    return null;
  }
}

/**
 * Create an opportunity for a contact in the Trials pipeline's first stage.
 * No-op (logged) if creds missing, pipeline absent, or the API rejects it.
 */
export async function createTrialOpportunity(opts: {
  key: string;
  locationId: string;
  contactId: string;
  name: string;
  monetaryValue?: number;
}): Promise<void> {
  const { key, locationId, contactId, name, monetaryValue } = opts;
  if (!key || !locationId || !contactId) return;

  const resolved = await resolveTrialsPipeline(key, locationId);
  if (!resolved) return;

  try {
    const body: Record<string, unknown> = {
      pipelineId: resolved.pipelineId,
      pipelineStageId: resolved.stageId,
      locationId,
      contactId,
      name: name.slice(0, 200),
      status: "open",
    };
    if (typeof monetaryValue === "number") body.monetaryValue = monetaryValue;

    const r = await fetch(`${GHL_BASE}/opportunities/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        Version: "2021-07-28",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!r.ok) {
      const txt = await r.text().catch(() => "");
      console.error("ghl-opportunity: create failed", r.status, txt.slice(0, 300));
    }
  } catch (e) {
    console.error("ghl-opportunity: create threw", e);
  }
}
