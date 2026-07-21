import { NextResponse } from "next/server";
import { createCustomRequestOpportunity } from "@/lib/ghl-opportunity";
import { verifyRetellSignature, digitsAndPlus } from "@/lib/retell-webhook";

/**
 * POST /api/retell-postcall — Retell's post-call webhook for the Discovery
 * agent (`agent_cca2ee6a721faf88d9beda90b8`, "Shamil AI Discovery v1").
 *
 * Ports n8n workflow "Retell Post-Call -> GHL Bypass" (id 5bqvpTRHAD7HwFve,
 * webhook path /retell-to-ghl) 1:1 — same field extraction, same GHL contact
 * upsert (fixed custom-field IDs), same opportunity creation. Full workflow
 * definition + verdict recorded in
 * vault/04-tools/n8n-inventory-2026-07-21.md. n8n workflow left untouched
 * (rollback path) — old URL: https://erkenov.app.n8n.cloud/webhook/retell-to-ghl
 *
 * ONE behavioral addition vs the n8n flow: n8n did NOT verify the webhook
 * signature at all. This route does — `x-retell-signature` header, format
 * `v={timestampMs},d={hexDigest}`, digest = HMAC-SHA256(rawBody + timestamp,
 * RETELL_API_KEY), 5-minute replay window, constant-time compare. Per
 * docs.retellai.com/features/secure-webhook. If RETELL_API_KEY isn't set,
 * verification is skipped (logged) rather than hard-failing — matches this
 * repo's "never let a webhook silently die on missing config" convention
 * (see capture-lead, storm-lead).
 *
 * n8n's Filter node silently drops non-"call_analyzed" events (no response
 * node reached => Retell would see a timeout). We instead respond fast with
 * 200 {"status":"ignored"} for call_started/call_ended/etc.
 *
 * Env (Vercel — all already set for other routes on this site):
 *   GHL_API_KEY, GHL_LOCATION_ID   — same PIT token/location the n8n
 *                                    workflow hardcoded (verified byte-equal
 *                                    2026-07-21).
 *   RETELL_API_KEY                 — already set for /api/retell-web-call
 *                                    (same agent_id).
 */

const GHL_BASE = "https://services.leadconnectorhq.com";

// name -> GHL custom-field id, exactly as in the n8n "GHL Upsert Contact" node.
const CUSTOM_FIELD_IDS: Record<string, string> = {
  businessDescription: "Yo5s501DAFs0PWDPJMTe",
  teamSize: "RuqtYSBm4pAR5kOFL2DF",
  dailyRoutineTasks: "829oFsMFopQXd9kZDoHz",
  currentTools: "lyMWy3g27f4N4PRfY6dl",
  biggestFriction: "ATvRrJ06L0Y2gfXbUWhS",
  digDetails: "g2fbtz9KxfZ2lBPo6Vrl",
  priorAttempts: "3VI1XxNyRBJYQ1gmCzdE",
  urgency: "jmTW9H0iNC2uf06KUyhn",
  decisionMaker: "vooW45PZwQIGHW7ZWEES",
  solutionsPitched: "pIfwJKRFcut6Or62LRXE",
  priceRangePitched: "2EYnzDJhiIVBrepj5v2O",
  additionalMessageForShamil: "uqJXCPp99EnNmA4oGsEN",
  preferredCallbackTime: "dZbH2pbbb6mt95HFapV0",
  priorityForCallback: "9yb7mnNjJdI2Vxu4wklw",
  emotionalTone: "A9HfbxGD29s4MNJjxIes",
  callerReactionToPitch: "Pej62VxcqlKYfvUM55yK",
};

type CustomAnalysisData = Record<string, unknown> & {
  caller_name?: string;
  company_name?: string;
  best_email?: string;
  callback_phone?: string;
  business_description?: string;
  team_size?: string;
  daily_routine_tasks?: string;
  current_tools?: string;
  biggest_friction?: string;
  dig_details?: string;
  prior_attempts?: string;
  urgency?: string;
  decision_maker?: string;
  solutions_pitched?: string;
  price_range_pitched?: string;
  additional_message_for_shamil?: string;
  preferred_callback_time?: string;
  priority_for_callback?: string;
  caller_emotional_tone?: string;
  emotional_tone?: string;
  caller_reaction_to_pitch?: string;
};

type RetellCall = {
  call_id?: string;
  from_number?: string;
  call_analysis?: {
    call_summary?: string;
    custom_analysis_data?: CustomAnalysisData;
  };
};

type RetellWebhookBody = {
  event?: string;
  call?: RetellCall;
};

/** Same spoken-email cleanup as the n8n "Extract Fields" node. */
function normalizeSpokenEmail(raw: string | undefined): string {
  let e = (raw || "").toLowerCase().trim();
  e = e
    .replace(/\s+at\s+/g, "@")
    .replace(/\s+dot\s+/g, ".")
    .replace(/g\s*mail/g, "gmail")
    .replace(/y\s*mail/g, "yahoo")
    .replace(/hot\s*mail/g, "hotmail")
    .replace(/out\s*look/g, "outlook")
    .replace(/i\s*cloud/g, "icloud")
    .replace(/\s+/g, "");
  return /^[\w.+-]+@[\w-]+\.[\w-]+$/.test(e) ? e : "";
}

export async function POST(req: Request) {
  const rawBody = await req.text();

  const apiKey = (process.env.RETELL_API_KEY || "").trim();
  if (!verifyRetellSignature(rawBody, req.headers.get("x-retell-signature"), apiKey, "retell-postcall")) {
    return NextResponse.json({ status: "invalid signature" }, { status: 401 });
  }

  let body: RetellWebhookBody;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ status: "bad json" }, { status: 400 });
  }

  // Mirrors the n8n "Only call_analyzed" Filter node — call_started/
  // call_ended/etc. are acknowledged but do no work.
  if (body.event !== "call_analyzed") {
    return NextResponse.json({ status: "ignored", event: body.event || null });
  }

  const call = body.call || {};
  const cad: CustomAnalysisData = call.call_analysis?.custom_analysis_data || {};

  const callbackPhone = digitsAndPlus(cad.callback_phone);
  const phone = digitsAndPlus(call.from_number) || callbackPhone;
  const callerName = cad.caller_name || "Unknown";
  const callerEmail = normalizeSpokenEmail(cad.best_email);
  const companyName = cad.company_name || "";

  const fields: Record<string, string> = {
    businessDescription: cad.business_description || "",
    teamSize: cad.team_size || "",
    dailyRoutineTasks: cad.daily_routine_tasks || "",
    currentTools: cad.current_tools || "",
    biggestFriction: cad.biggest_friction || "",
    digDetails: cad.dig_details || "",
    priorAttempts: cad.prior_attempts || "",
    urgency: cad.urgency || "",
    decisionMaker: cad.decision_maker || "",
    solutionsPitched: cad.solutions_pitched || "",
    priceRangePitched: cad.price_range_pitched || "",
    additionalMessageForShamil: cad.additional_message_for_shamil || "",
    preferredCallbackTime: cad.preferred_callback_time || "",
    priorityForCallback: cad.priority_for_callback || "",
    emotionalTone: cad.caller_emotional_tone || cad.emotional_tone || "",
    callerReactionToPitch: cad.caller_reaction_to_pitch || "",
  };

  const key = (process.env.GHL_API_KEY || "").trim();
  const locationId = (process.env.GHL_LOCATION_ID || "").trim();
  if (!key || !locationId) {
    console.error("retell-postcall: GHL_API_KEY/GHL_LOCATION_ID not set — dropping lead");
    return NextResponse.json({ status: "ok", contactId: "none", note: "ghl not configured" });
  }

  const customFields = Object.entries(fields)
    .filter(([, v]) => v)
    .map(([name, v]) => ({ id: CUSTOM_FIELD_IDS[name], field_value: v }));

  let contactId = "";
  try {
    const upsertBody: Record<string, unknown> = {
      locationId,
      firstName: callerName,
      companyName,
      source: "Retell Discovery Agent",
      tags: ["inbound-lead", "retell-discovery"],
      customFields,
    };
    if (phone) upsertBody.phone = phone;
    if (callerEmail) upsertBody.email = callerEmail;

    const r = await fetch(`${GHL_BASE}/contacts/upsert`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        Version: "2021-07-28",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(upsertBody),
    });
    const rawText = await r.text();
    let d: Record<string, unknown> = {};
    try {
      d = JSON.parse(rawText);
    } catch {
      /* non-JSON error body, fall through with rawText logged below */
    }
    if (!r.ok) {
      console.error("retell-postcall: GHL upsert failed", r.status, rawText.slice(0, 500));
    } else {
      const c = (d.contact as Record<string, unknown>) || d;
      contactId = (c?.id as string) || "";
    }
  } catch (e) {
    console.error("retell-postcall: GHL upsert threw", e);
  }

  if (contactId) {
    try {
      await createCustomRequestOpportunity({
        key,
        locationId,
        contactId,
        name: `Discovery call: ${callerName} (${companyName})`,
      });
    } catch (e) {
      console.error("retell-postcall: opportunity step failed", e);
    }
  }

  return NextResponse.json({ status: "ok", contactId: contactId || "none" });
}
