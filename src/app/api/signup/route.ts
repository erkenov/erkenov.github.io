import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/api-guard";
import { createTrialOpportunity } from "@/lib/ghl-opportunity";
import { addContactTags } from "@/lib/ghl-tags";

/**
 * POST /api/signup — the /start trial form (email required; phone and name
 * both optional, name added Shamil 2026-07-21).
 *
 * Zero-friction by design (Shamil 2026-06-12): email is the minimum needed to
 * create the contact in GoHighLevel (the client-data hub) and reach out to set
 * up their CRM access. Business name / payment details get asked during that
 * conversation — after they've already said yes. Phone and name are
 * low-friction optional extras, not requirements.
 *
 * `name` (Shamil 2026-07-21): a single free-text field, same split pattern
 * as /api/custom-request — first space divides firstName from lastName, a
 * single-word name becomes firstName only. Missing name changes nothing.
 *
 * Does two things:
 *   1. Upserts the contact into GHL (phone and name included when given),
 *      then additively tags it (trial-signup, crm-trial, plan-<plan>) via
 *      /contacts/{id}/tags — never via upsert's `tags` field, which REPLACES
 *      the array instead of merging it (Shamil 2026-07-21, see ghl-tags.ts).
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

  let body: { email?: string; plan?: string; phone?: string; name?: string };
  try { body = await req.json(); } catch {
    return NextResponse.json({ ok: false, error: "bad request" }, { status: 400 });
  }
  const email = (body.email || "").trim().toLowerCase().slice(0, 200);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid email" }, { status: 400 });
  }
  // Optional callback number (Shamil 2026-07-20) — loose validation only,
  // same pattern as /api/custom-request: trim + cap length, no format check.
  const phone = (body.phone || "").trim().slice(0, 40);
  // Optional name (Shamil 2026-07-21) — same split pattern as
  // /api/custom-request: first space divides firstName from lastName.
  const name = (body.name || "").trim().slice(0, 200);
  const nameParts = name.split(/\s+/).filter(Boolean);
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ");
  // Prepay tier from the /start selector (2026-07-08). Whitelisted; anything
  // else (including old clients sending no plan) falls back to monthly.
  const PLAN_IDS = ["monthly", "6-months", "yearly"] as const;
  const plan = PLAN_IDS.includes(body.plan as (typeof PLAN_IDS)[number])
    ? (body.plan as (typeof PLAN_IDS)[number])
    : "monthly";

  // Signup-specific credentials: the generic GHL_API_KEY/GHL_LOCATION_ID on
  // Vercel are scoped to the CLIENT balance-dashboard location — trial signups
  // must land in the Erken Systems sub-account instead (found 2026-06-12 when
  // the live test's contact appeared in the wrong location).
  const key = (process.env.GHL_SIGNUP_API_KEY || process.env.GHL_API_KEY || "").trim();
  const locationId = (process.env.GHL_SIGNUP_LOCATION_ID || process.env.GHL_LOCATION_ID || "").trim();
  if (!key || !locationId) {
    return NextResponse.json({ ok: false, error: "not configured" }, { status: 500 });
  }

  // 1 · contact into the hub. NOTE: no `tags` here (Shamil 2026-07-21) —
  // /contacts/upsert REPLACES the contact's tags array instead of merging
  // it, so a later upsert here would silently wipe tags earlier funnels
  // already set (e.g. custom-solution-request). Tags are added separately
  // below via the additive /contacts/{id}/tags endpoint (see ghl-tags.ts).
  const upsertBody: Record<string, unknown> = {
    locationId,
    email,
    source: "erken.systems /start",
  };
  if (phone) upsertBody.phone = phone;
  if (firstName) upsertBody.firstName = firstName;
  if (lastName) upsertBody.lastName = lastName;

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
  if (!r.ok) {
    return NextResponse.json({ ok: false, error: "hub" }, { status: 502 });
  }

  // 1a · pull the contact id out of the upsert response once — the tag and
  // opportunity steps below both need it, and a fetch Response body can only
  // be read once.
  let contactId = "";
  try {
    const d = (await r.json().catch(() => ({}))) as Record<string, unknown>;
    const c = (d.contact as Record<string, unknown>) || d;
    contactId = (c?.id as string) || "";
  } catch (e) {
    console.error("signup: contact id parse failed", e);
  }

  // 1b · add this signup's tags additively (best-effort — never fail the
  // signup over a tagging hiccup).
  try {
    if (contactId) {
      await addContactTags({
        key,
        locationId,
        contactId,
        tags: ["trial-signup", "crm-trial", `plan-${plan}`],
      });
    }
  } catch (e) {
    console.error("signup: tag step failed", e);
  }

  // 1c · drop the lead into the Trials pipeline (best-effort — never fail the signup)
  try {
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
          text: `🚀 NEW CRM TRIAL SIGNUP\n\n${email}${phone ? `\nPhone: ${phone}` : ""}\nPlan chosen: ${plan}\n\nContact is in GoHighLevel (tags: trial-signup, crm-trial, plan-${plan}). Set up their access + reach out.`,
        }),
      });
    } catch {}
  }

  return NextResponse.json({ ok: true });
}
