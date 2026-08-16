import { NextResponse } from "next/server";

/**
 * POST /api/send-payment-link — called mid-call by the GHL Voice AI agent as
 * a Custom Action (Shamil 2026-08-16 strategy: the AI answers everything,
 * then texts the buyer the payment link). Upserts the contact by phone,
 * tags them, and sends the Payoneer link for the chosen plan via SMS from
 * the Erken Systems line.
 *
 * Body: { phone, firstName?, lastName?, email?, plan? } — plan ∈
 * "monthly" | "6-months" | "yearly" (default monthly).
 * ?dry=1 validates auth + upserts the contact but skips the SMS.
 */

const GHL_BASE = "https://services.leadconnectorhq.com";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const LINKS: Record<string, { label: string; url: string }> = {
  monthly: {
    label: "$97/mo monthly",
    url: "https://link.payoneer.com/Token?t=8CE04254DA3D431B978F0A31063187B2&src=tpl",
  },
  "6-months": {
    label: "$87/mo, 6 months",
    url: "https://link.payoneer.com/Token?t=D6878CB3F28949B7BD1A0609C3865B04&src=tpl",
  },
  yearly: {
    label: "$77/mo, yearly",
    url: "https://link.payoneer.com/Token?t=564C09FED5C144C58338A630D3ED832B&src=tpl",
  },
};

export async function POST(req: Request) {
  // Shared-secret guard (2026-08-16 security pass): without it this endpoint
  // is an open SMS relay on the Erken Systems line. The secret lives only in
  // the Vercel env + the GHL custom-action header config — never in the repo.
  const expected = process.env.GHL_ACTION_SECRET;
  if (!expected || req.headers.get("x-action-secret") !== expected) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  const dry = new URL(req.url).searchParams.get("dry") === "1";
  let body: {
    phone?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    plan?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 });
  }
  if (!body.phone) {
    return NextResponse.json({ ok: false, error: "phone required" }, { status: 400 });
  }

  const key = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!key || !locationId) {
    return NextResponse.json({ ok: false, error: "env missing" }, { status: 500 });
  }
  const headers = {
    Authorization: `Bearer ${key}`,
    Version: "2021-07-28",
    "Content-Type": "application/json",
    "User-Agent": UA,
  };
  const plan = LINKS[body.plan ?? ""] ?? LINKS.monthly;

  try {
    // 1) Upsert the contact (phone is the identity on a voice call).
    const up = await fetch(`${GHL_BASE}/contacts/upsert`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        locationId,
        phone: body.phone,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        source: "erken.systems voice agent",
        tags: ["voice-agent-buyer", `plan-${body.plan ?? "monthly"}`],
      }),
    });
    const upJson = (await up.json()) as { contact?: { id?: string } };
    const contactId = upJson?.contact?.id;
    if (!up.ok || !contactId) {
      return NextResponse.json({ ok: false, step: "upsert", ghl: up.status, detail: upJson });
    }
    if (dry) {
      return NextResponse.json({ ok: true, dry: true, contactId, plan: plan.label });
    }

    // 2) Send the payment link by SMS.
    const name = body.firstName ? ` ${body.firstName}` : "";
    const sms = await fetch(`${GHL_BASE}/conversations/messages`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        type: "SMS",
        contactId,
        message: `Hi${name}, Erken from Erken Systems here — as promised, your payment link (${plan.label}): ${plan.url}\n\nAfter the payment you'll fill one short onboarding form, then Shamil personally reviews it and calls you. Your system goes live in 7–10 days.`,
      }),
    });
    const smsJson = await sms.json().catch(() => ({}));
    return NextResponse.json({ ok: sms.ok, contactId, ghl: sms.status, detail: smsJson });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
