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

/**
 * Create an opportunity for a contact in the custom-solution request pipeline's
 * first stage (Shamil 2026-07-21) — same shape as createTrialOpportunity above,
 * for /api/custom-request's kind="custom-solution" requests only (rent-leads
 * applicants don't get an opportunity).
 *
 * Unlike the Trials pipeline, this one is addressed by ID, not resolved by
 * name: pipeline sMu9K2rRvmhX82wHAi7D ("Discovery Calls", soon renamed
 * "Custom Solutions") / first stage efd906cc-939f-4653-bfdc-91dec51ba826
 * ("New (uncalled)", soon renamed "Request") in location BSNXXkE5JiDxqdFxf1YV
 * — Shamil gave us the IDs directly since the pipeline already exists in the
 * GHL UI. Env-overridable like the rest of this file's creds pattern.
 *
 * Best-effort: any failure is logged and swallowed so a pipeline hiccup never
 * breaks the custom-request path.
 */
const CUSTOM_REQUEST_PIPELINE_ID = (process.env.GHL_CUSTOM_REQUEST_PIPELINE_ID || "sMu9K2rRvmhX82wHAi7D").trim();
const CUSTOM_REQUEST_STAGE_ID = (process.env.GHL_CUSTOM_REQUEST_STAGE_ID || "efd906cc-939f-4653-bfdc-91dec51ba826").trim();

export async function createCustomRequestOpportunity(opts: {
  key: string;
  locationId: string;
  contactId: string;
  name: string;
  monetaryValue?: number;
}): Promise<void> {
  const { key, locationId, contactId, name, monetaryValue } = opts;
  if (!key || !locationId || !contactId) return;

  try {
    const body: Record<string, unknown> = {
      pipelineId: CUSTOM_REQUEST_PIPELINE_ID,
      pipelineStageId: CUSTOM_REQUEST_STAGE_ID,
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
      console.error("ghl-opportunity: custom-request create failed", r.status, txt.slice(0, 300));
    }
  } catch (e) {
    console.error("ghl-opportunity: custom-request create threw", e);
  }
}

/**
 * Create an opportunity for the Storm Roofing demo voice agent ("Riley")
 * (Shamil 2026-07-21) — ports the 3-way pipeline-stage branch from n8n
 * workflow "Retell Post-Call -> GHL (Storm Roofing Demo)" (id
 * RZnMEFgsbjRDNBeu) exactly: appointmentBooked wins over callerIntent,
 * else falls to the default "new inquiry" stage. Pipeline/stage IDs are
 * hardcoded exactly as in the n8n "Create Opportunity" node (no name-lookup
 * — pipeline already exists in the SRH demo sub-account's GHL UI).
 *
 * Best-effort: any failure is logged and swallowed, matching every other
 * opportunity helper in this file.
 */
const STORM_PIPELINE_ID = (process.env.GHL_STORM_DEMO_PIPELINE_ID || "0onFN5AtCDGFSSOoroZe").trim();
const STORM_STAGE_APPOINTMENT_BOOKED =
  (process.env.GHL_STORM_DEMO_STAGE_BOOKED || "6d34daa2-c0b3-45ca-adb2-1f1ea239fa3e").trim();
const STORM_STAGE_READY_TO_PROCEED =
  (process.env.GHL_STORM_DEMO_STAGE_READY || "72dd3800-f402-4aa5-8ca9-e5b98f126645").trim();
const STORM_STAGE_NEW_INQUIRY =
  (process.env.GHL_STORM_DEMO_STAGE_NEW || "1c16a4b8-529d-4e64-af09-b7a1f3e9292c").trim();

export async function createStormRoofingOpportunity(opts: {
  key: string;
  locationId: string;
  contactId: string;
  name: string;
  appointmentBooked: boolean;
  callerIntent: string;
}): Promise<void> {
  const { key, locationId, contactId, name, appointmentBooked, callerIntent } = opts;
  if (!key || !locationId || !contactId) return;

  const pipelineStageId = appointmentBooked
    ? STORM_STAGE_APPOINTMENT_BOOKED
    : callerIntent === "ready_to_proceed"
      ? STORM_STAGE_READY_TO_PROCEED
      : STORM_STAGE_NEW_INQUIRY;

  try {
    const r = await fetch(`${GHL_BASE}/opportunities/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        Version: "2021-07-28",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        pipelineId: STORM_PIPELINE_ID,
        pipelineStageId,
        locationId,
        contactId,
        name: name.slice(0, 200),
        status: "open",
        monetaryValue: 0,
      }),
    });
    if (!r.ok) {
      const txt = await r.text().catch(() => "");
      console.error("ghl-opportunity: storm-roofing create failed", r.status, txt.slice(0, 300));
    }
  } catch (e) {
    console.error("ghl-opportunity: storm-roofing create threw", e);
  }
}
