import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/api-guard";
import { createTrialOpportunity } from "@/lib/ghl-opportunity";

/**
 * POST /api/signup — the /start trial form (ONE field: email).
 *
 * Zero-friction by design (Shamil 2026-06-12): email is the minimum needed to
 * create the contact in GoHighLevel (the client-data hub) and reach out to set
 * up their CRM access. Business name / payment details get asked during that
 * conversation — after they've already said yes.
 *
 * Does two things:
 *   1. Upserts the contact into GHL (tags: trial-signup, crm-trial).
 *   2. Pings Shamil's Telegram so a signup never sits unnoticed.
 *
 * Env (Vercel): GHL_API_KEY, GHL_LOCATION_ID, TELEGRAM_BOT_TOKEN,
 * TELEGRAM_OWNER_CHAT (all already set for the other routes).
 */

const GHL_BASE = "https://services.leadconnectorhq.com";

export async function POST(req: Request) {
  if (!rateLimit(`signup:${clientIp(req)}`, 5, 60 * 60_000)) {
    return NextResponse.json({ ok: false, error: "limit" }, { status: 429 });
  }

  let body: { email?: string };
  try { body = await req.json(); } catch {
    return NextResponse.json({ ok: false, error: "bad request" }, { status: 400 });
  }
  const email = (body.email || "").trim().toLowerCase().slice(0, 200);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid email" }, { status: 400 });
  }

  // Signup-specific credentials: the generic GHL_API_KEY/GHL_LOCATION_ID on
  // Vercel are scoped to the CLIENT balance-dashboard location — trial signups
  // must land in the Erken Systems sub-account instead (found 2026-06-12 when
  // the live test's contact appeared in the wrong location).
  const key = (process.env.GHL_SIGNUP_API_KEY || process.env.GHL_API_KEY || "").trim();
  const locationId = (process.env.GHL_SIGNUP_LOCATION_ID || process.env.GHL_LOCATION_ID || "").trim();
  if (!key || !locationId) {
    return NextResponse.json({ ok: false, error: "not configured" }, { status: 500 });
  }

  // 1 · contact into the hub
  const r = await fetch(`${GHL_BASE}/contacts/upsert`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      Version: "2021-07-28",
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      locationId,
      email,
      tags: ["trial-signup", "crm-trial"],
      source: "erken.systems /start",
    }),
  });
  if (!r.ok) {
    return NextResponse.json({ ok: false, error: "hub" }, { status: 502 });
  }

  // 1b · drop the lead into the Trials pipeline (best-effort — never fail the signup)
  try {
    const d = (await r.json().catch(() => ({}))) as Record<string, unknown>;
    const c = (d.contact as Record<string, unknown>) || d;
    const contactId = (c?.id as string) || "";
    if (contactId) {
      await createTrialOpportunity({ key, locationId, contactId, name: `Trial: ${email}` });
    }
  } catch (e) {
    console.error("signup: opportunity step failed", e);
  }

  // 2 · ping Shamil (best-effort — a Telegram hiccup must not fail the signup)
  const token = (process.env.TELEGRAM_BOT_TOKEN || "").trim();
  const chat = (process.env.TELEGRAM_OWNER_CHAT || "").trim();
  if (token && chat) {
    try {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chat,
          text: `🚀 NEW CRM TRIAL SIGNUP\n\n${email}\n\nContact is in GoHighLevel (tags: trial-signup, crm-trial). Set up their access + reach out.`,
        }),
      });
    } catch {}
  }

  return NextResponse.json({ ok: true });
}
