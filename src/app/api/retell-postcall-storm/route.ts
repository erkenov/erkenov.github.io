import { NextResponse } from "next/server";
import { createStormRoofingOpportunity } from "@/lib/ghl-opportunity";
import { verifyRetellSignature, digitsAndPlus } from "@/lib/retell-webhook";

/**
 * POST /api/retell-postcall-storm — Retell's post-call webhook for the
 * Storm Roofing demo voice agent ("Riley").
 *
 * Ports n8n workflow "Retell Post-Call -> GHL (Storm Roofing Demo)"
 * (id RZnMEFgsbjRDNBeu, webhook path /retell-storm-to-ghl) 1:1 — same field
 * extraction, same GHL contact upsert, same 3-way opportunity pipeline-stage
 * branch. Full workflow definition + verdict recorded in
 * vault/04-tools/n8n-inventory-2026-07-21.md. n8n workflow left untouched
 * (rollback path) — old URL:
 * https://erkenov.app.n8n.cloud/webhook/retell-storm-to-ghl
 *
 * This is a SIBLING route to /api/retell-postcall (Discovery agent), not a
 * branch inside it — the two n8n flows share no field shape, no GHL
 * sub-account, and no opportunity logic; a shared config map would have
 * been just as much code with worse readability. Signature verification and
 * phone-digit cleanup ARE shared, via src/lib/retell-webhook.ts.
 *
 * IMPORTANT NAMING NOTE (2026-07-21): this is NOT the same "SRH" as
 * /api/storm-lead. That route serves the /storm-v2 landing page and targets
 * GHL_SRH_LOCATION_API_KEY / GHL_SRH_LOCATION_ID. This route ports the n8n
 * voice-agent workflow, which targets a DIFFERENT GHL sub-account —
 * confirmed by byte-exact match against the n8n workflow's hardcoded
 * locationId (LiXzAbEsFeDk4vcTDgv5) and PIT token: they equal
 * GHL_STORM_DEMO_LOCATION / GHL_STORM_DEMO_TOKEN, NOT the GHL_SRH_* vars.
 *
 * n8n's Filter node silently drops non-"call_analyzed" events (no response
 * node reached => Retell would see a timeout). We instead respond fast with
 * 200 {"status":"ignored"} for call_started/call_ended/etc.
 *
 * Env (Vercel):
 *   GHL_STORM_DEMO_TOKEN, GHL_STORM_DEMO_LOCATION — same PIT token/location
 *                                    the n8n workflow hardcoded (verified
 *                                    byte-equal 2026-07-21).
 *   RETELL_API_KEY                 — same key used for signature
 *                                    verification on /api/retell-postcall.
 *
 * CUTOVER STATUS (2026-07-21): no Retell agent in the account reachable via
 * RETELL_API_KEY has a webhook_url pointing at the n8n workflow this route
 * replaces, and none of that account's 3 agents are named/tagged for the
 * Storm Roofing demo ("Riley"). The demo agent likely lives in a separate
 * Retell workspace this key cannot see. Webhook cutover (n8n -> this route)
 * could NOT be performed — see the port report for detail. The route itself
 * is deployed and tested; wiring the actual agent to it is still open.
 */

const GHL_BASE = "https://services.leadconnectorhq.com";

type CustomAnalysisData = Record<string, unknown> & {
  caller_name?: string;
  callback_phone?: string;
  property_address?: string;
  roof_issue?: string;
  caller_intent?: string;
  urgency?: string;
  appointment_time?: string;
  appointment_booked?: boolean | string;
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

export async function POST(req: Request) {
  const rawBody = await req.text();

  const apiKey = (process.env.RETELL_API_KEY || "").trim();
  if (!verifyRetellSignature(rawBody, req.headers.get("x-retell-signature"), apiKey, "retell-postcall-storm")) {
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
  const propertyAddress = cad.property_address || "";
  const roofIssue = cad.roof_issue || "";
  const callerIntent = cad.caller_intent || "new_inspection";
  const urgency = cad.urgency || "";
  const appointmentBooked = String(cad.appointment_booked ?? false) === "true";

  const key = (process.env.GHL_STORM_DEMO_TOKEN || "").trim();
  const locationId = (process.env.GHL_STORM_DEMO_LOCATION || "").trim();
  if (!key || !locationId) {
    console.error("retell-postcall-storm: GHL_STORM_DEMO_TOKEN/GHL_STORM_DEMO_LOCATION not set — dropping lead");
    return NextResponse.json({ status: "ok", contactId: "none", note: "ghl not configured" });
  }

  let contactId = "";
  try {
    const upsertBody: Record<string, unknown> = {
      locationId,
      name: callerName,
      source: "AI Receptionist (Riley)",
      tags: ["ai-receptionist-lead", `roof-${urgency}`],
    };
    if (phone) upsertBody.phone = phone;
    if (propertyAddress) upsertBody.address1 = propertyAddress;

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
      console.error("retell-postcall-storm: GHL upsert failed", r.status, rawText.slice(0, 500));
    } else {
      const c = (d.contact as Record<string, unknown>) || d;
      contactId = (c?.id as string) || "";
    }
  } catch (e) {
    console.error("retell-postcall-storm: GHL upsert threw", e);
  }

  if (contactId) {
    try {
      await createStormRoofingOpportunity({
        key,
        locationId,
        contactId,
        name: `New roof lead: ${callerName} - ${roofIssue}`,
        appointmentBooked,
        callerIntent,
      });
    } catch (e) {
      console.error("retell-postcall-storm: opportunity step failed", e);
    }
  }

  return NextResponse.json({ status: "ok", contactId: contactId || "none" });
}
