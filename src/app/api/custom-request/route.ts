import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/api-guard";
import { createCustomRequestOpportunity } from "@/lib/ghl-opportunity";

/**
 * POST /api/custom-request — the /start page's "beyond the platform" asks:
 * custom GoHighLevel/snapshot work (typed form or a transcribed voice
 * message) and the rent-leads partnership apply form.
 *
 * Modeled directly on /api/signup: upserts a GHL contact (signup-scoped
 * creds, same env fallback), best-effort drops the request text onto the
 * contact as a note, best-effort drops kind="custom-solution" requests into
 * the custom-request pipeline as an opportunity (Shamil 2026-07-21 — mirrors
 * the Trials-pipeline step in /api/signup; rent-leads applicants don't get
 * one), and best-effort pings Shamil's Telegram with the full message so a
 * request never sits unseen.
 *
 * Body: { email, kind: "custom-solution" | "rent-leads", message?, channel?,
 *         phone?, company?, name? }
 *
 * `name` (Shamil 2026-07-20, Batch 12): a single free-text field on the
 * form, no separate first/last inputs. GHL's contact upsert takes
 * firstName/lastName (or a combined name) — we split on the first space:
 * everything before it is firstName, everything after is lastName (a
 * single-word name just becomes firstName with no lastName). Good enough
 * for "Jane Smith" / "Jane" without adding a second input field.
 * Env (Vercel): GHL_SIGNUP_API_KEY/GHL_API_KEY, GHL_SIGNUP_LOCATION_ID/
 * GHL_LOCATION_ID, TELEGRAM_BOT_TOKEN, TELEGRAM_OWNER_CHAT (all already set
 * for /api/signup).
 */

const GHL_BASE = "https://services.leadconnectorhq.com";

export async function POST(req: Request) {
  if (!rateLimit(`custom-request:${clientIp(req)}`, 10, 60 * 60_000)) {
    return NextResponse.json({ ok: false, error: "limit" }, { status: 429 });
  }

  let body: {
    email?: string;
    kind?: string;
    message?: string;
    channel?: string;
    phone?: string;
    company?: string;
    name?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad request" }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase().slice(0, 200);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid email" }, { status: 400 });
  }

  const KIND_IDS = ["custom-solution", "rent-leads"] as const;
  const kind = KIND_IDS.includes(body.kind as (typeof KIND_IDS)[number])
    ? (body.kind as (typeof KIND_IDS)[number])
    : "custom-solution";
  const message = (body.message || "").trim().slice(0, 4000);
  const channel = (body.channel || "").trim().slice(0, 40);
  const phone = (body.phone || "").trim().slice(0, 40);
  const company = (body.company || "").trim().slice(0, 200);
  const name = (body.name || "").trim().slice(0, 200);
  const nameParts = name.split(/\s+/).filter(Boolean);
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ");

  // Same signup-scoped creds as /api/signup — trial + request contacts both
  // land in the Erken Systems sub-account, not the generic GHL_* dashboard
  // location.
  const key = (process.env.GHL_SIGNUP_API_KEY || process.env.GHL_API_KEY || "").trim();
  const locationId = (process.env.GHL_SIGNUP_LOCATION_ID || process.env.GHL_LOCATION_ID || "").trim();
  if (!key || !locationId) {
    return NextResponse.json({ ok: false, error: "not configured" }, { status: 500 });
  }

  const tags = kind === "rent-leads" ? ["rent-leads-applicant"] : ["custom-solution-request"];

  // 1 · contact into the hub
  const upsertBody: Record<string, unknown> = {
    locationId,
    email,
    tags,
    source: "erken.systems /start",
  };
  if (phone) upsertBody.phone = phone;
  if (company) upsertBody.companyName = company;
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

  // 1b · pull the contact id out of the upsert response once — the note and
  // opportunity steps below both need it, and a fetch Response body can only
  // be read once.
  let contactId = "";
  try {
    const d = (await r.json().catch(() => ({}))) as Record<string, unknown>;
    const c = (d.contact as Record<string, unknown>) || d;
    contactId = (c?.id as string) || "";
  } catch (e) {
    console.error("custom-request: contact id parse failed", e);
  }

  // 1c · drop the request text onto the contact as a note (best-effort —
  // never fail the request over a note hiccup, same pattern as the
  // opportunity step in /api/signup).
  try {
    const noteBits = [
      `Kind: ${kind}`,
      name ? `Name: ${name}` : "",
      channel ? `Channel: ${channel}` : "",
      phone ? `Phone: ${phone}` : "",
      company ? `Company/industry: ${company}` : "",
      message ? `Message: ${message}` : "",
    ].filter(Boolean);
    if (contactId && noteBits.length) {
      await fetch(`${GHL_BASE}/contacts/${contactId}/notes`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          Version: "2021-07-28",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ body: noteBits.join("\n") }),
      });
    }
  } catch (e) {
    console.error("custom-request: note step failed", e);
  }

  // 1d · drop custom-solution requests into the pipeline (best-effort — never
  // fail the request over a pipeline hiccup). rent-leads applicants skip this.
  if (kind === "custom-solution") {
    try {
      if (contactId) {
        await createCustomRequestOpportunity({
          key,
          locationId,
          contactId,
          name: `Custom: ${name || email}`,
        });
      }
    } catch (e) {
      console.error("custom-request: opportunity step failed", e);
    }
  }

  // 2 · ping Shamil (best-effort — a Telegram hiccup must not fail the request)
  const token = (process.env.TELEGRAM_BOT_TOKEN || "").trim();
  const chat = (process.env.TELEGRAM_OWNER_CHAT || "").trim();
  if (token && chat) {
    try {
      const title = kind === "rent-leads" ? "🏘️ RENT-LEADS APPLICANT" : "🛠️ CUSTOM SOLUTION REQUEST";
      // Name prepended ahead of the title (Shamil 2026-07-20, Batch 12) —
      // Telegram's push-notification preview shows only the first line, so
      // leading with the name (when given) makes the who-is-this legible
      // without opening the app.
      const lines = [
        name || "",
        title,
        "",
        email,
        channel ? `Channel: ${channel}` : "",
        phone ? `Phone: ${phone}` : "",
        company ? `Company/industry: ${company}` : "",
        message ? `\n${message}` : "",
      ].filter(Boolean);
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chat, text: lines.join("\n") }),
      });
    } catch {}
  }

  return NextResponse.json({ ok: true });
}
