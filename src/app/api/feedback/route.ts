import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/api-guard";
import { createContactTask } from "@/lib/ghl-task";
import { addContactTags } from "@/lib/ghl-tags";

/**
 * POST /api/feedback — bug reports / suggestions / human-help requests from
 * the Erken extension, forwarded to Shamil's Telegram AND persisted into
 * GoHighLevel (Shamil 2026-07-21 — previously Telegram-only, nothing was
 * stored; pings scroll off).
 *
 * GHL step (best-effort, fully independent of the Telegram send — `ok`
 * below reflects the Telegram result exactly as before; a GHL hiccup never
 * fails the request or blocks the Telegram ping):
 *   1. upsert a contact when the payload carries a valid email. The
 *      extension currently sends none (kind, message, url, title only — see
 *      ErkenVoiceWidget.tsx's auto-error call and the extension's bug/idea/
 *      help submits), so in practice every submission lands on a single
 *      catch-all contact, "Extension Feedback Inbox"
 *      <feedback-inbox@erken.systems> — there's no free-floating-note GHL
 *      API without a contact, so a catch-all contact is how everything stays
 *      queryable in one place. If the extension ever starts sending its
 *      own `email`/`name`, that person's own contact is upserted instead.
 *   2. tag it: extension-bug / feedback / help-request per kind (kind
 *      "error" — the site's own auto-telemetry on a dead voice call, see
 *      ErkenVoiceWidget.tsx — and any other kind fall back to "feedback").
 *      Added via the additive /contacts/{id}/tags endpoint, never via
 *      upsert's `tags` field — upsert REPLACES the array instead of merging
 *      it, which would wipe whatever tags the contact already had (Shamil
 *      2026-07-21, see ghl-tags.ts).
 *   3. attach the message as a note.
 *   4. kind "help" ONLY: also create a same-day GHL task assigned to the
 *      account owner (src/lib/ghl-task.ts) so a human-help ask isn't just a
 *      Telegram ping. bug/idea get no task — a weekly digest workflow is
 *      planned inside GHL itself, not in this codebase.
 *
 * Same signup-scoped creds/location as /api/custom-request and /api/signup
 * (GHL_SIGNUP_API_KEY/GHL_API_KEY, GHL_SIGNUP_LOCATION_ID/GHL_LOCATION_ID —
 * location BSNXXkE5JiDxqdFxf1YV).
 *
 * Env (Vercel): TELEGRAM_BOT_TOKEN + TELEGRAM_OWNER_CHAT (unchanged), plus
 * the GHL vars above (already set for the other routes).
 */

const GHL_BASE = "https://services.leadconnectorhq.com";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const CATCH_ALL_EMAIL = "feedback-inbox@erken.systems";
const CATCH_ALL_NAME = "Extension Feedback Inbox";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

const LABEL: Record<string, string> = {
  bug: "🐞 BUG REPORT",
  idea: "💡 SUGGESTION",
  help: "🆘 HELP REQUEST",
};

const TAG: Record<string, string> = {
  bug: "extension-bug",
  idea: "feedback",
  help: "help-request",
};

async function persistToGhl(opts: {
  kind: string;
  message: string;
  url: string;
  title: string;
  email: string;
  name: string;
}): Promise<void> {
  const { kind, message, url, title, email, name } = opts;
  const key = (process.env.GHL_SIGNUP_API_KEY || process.env.GHL_API_KEY || "").trim();
  const locationId = (process.env.GHL_SIGNUP_LOCATION_ID || process.env.GHL_LOCATION_ID || "").trim();
  if (!key || !locationId) return;

  const useEmail = email || CATCH_ALL_EMAIL;
  let firstName = "";
  let lastName = "";
  if (email) {
    const parts = name.split(/\s+/).filter(Boolean);
    firstName = parts[0] || "";
    lastName = parts.slice(1).join(" ");
  } else {
    firstName = CATCH_ALL_NAME;
  }
  const tag = TAG[kind] || "feedback";

  let contactId = "";
  try {
    // NOTE: no `tags` here (Shamil 2026-07-21) — /contacts/upsert REPLACES
    // the contact's tags array instead of merging it, so this upsert would
    // silently wipe tags an earlier funnel already set (e.g. the catch-all
    // inbox contact accumulates bug/idea/help tags over time; a real
    // person's contact could carry trial-signup or custom-solution-request).
    // Tags are added separately below via the additive
    // /contacts/{id}/tags endpoint (see ghl-tags.ts).
    const upsertBody: Record<string, unknown> = {
      locationId,
      email: useEmail,
      source: "Erken extension feedback",
    };
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
      console.error("feedback: GHL upsert failed", r.status);
      return;
    }
    const d = (await r.json().catch(() => ({}))) as Record<string, unknown>;
    const c = (d.contact as Record<string, unknown>) || d;
    contactId = (c?.id as string) || "";
  } catch (e) {
    console.error("feedback: GHL upsert threw", e);
    return;
  }
  if (!contactId) return;

  // tag (best-effort — never fail the request over a tagging hiccup)
  try {
    await addContactTags({ key, locationId, contactId, tags: [tag] });
  } catch (e) {
    console.error("feedback: GHL tag failed", e);
  }

  // note (best-effort — a note hiccup shouldn't block the task step below)
  try {
    const noteBits = [
      `Kind: ${kind}`,
      `Message: ${message}`,
      title ? `Page: ${title}` : "",
      url ? `URL: ${url}` : "",
    ].filter(Boolean);
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
  } catch (e) {
    console.error("feedback: GHL note failed", e);
  }

  // kind "help" only — a same-day task so it doesn't just sit as a note.
  if (kind === "help") {
    try {
      const who = name || email || "extension user";
      await createContactTask({
        key,
        locationId,
        contactId,
        title: `HELP REQUEST: ${who}`,
      });
    } catch (e) {
      console.error("feedback: GHL task failed", e);
    }
  }
}

export async function POST(req: Request) {
  if (!rateLimit(`fb:${clientIp(req)}`, 6, 60 * 60_000)) {
    return NextResponse.json({ ok: false, error: "limit" }, { status: 429, headers: CORS });
  }
  const token = (process.env.TELEGRAM_BOT_TOKEN || "").trim();
  const chat = (process.env.TELEGRAM_OWNER_CHAT || "").trim();
  if (!token || !chat) return NextResponse.json({ ok: false }, { status: 500, headers: CORS });

  let body: { kind?: string; message?: string; url?: string; title?: string; email?: string; name?: string };
  try { body = await req.json(); } catch {
    return NextResponse.json({ ok: false }, { status: 400, headers: CORS });
  }
  const message = (body.message || "").slice(0, 1500).trim();
  if (!message) return NextResponse.json({ ok: false }, { status: 400, headers: CORS });

  const kind = (body.kind || "").trim();
  const url = (body.url || "").slice(0, 300).trim();
  const title = (body.title || "").slice(0, 120).trim();
  // Not sent by the extension today — accepted defensively in case it ever
  // grows an identity field. See persistToGhl's catch-all-contact fallback.
  const rawEmail = (body.email || "").trim().toLowerCase().slice(0, 200);
  const email = EMAIL_RE.test(rawEmail) ? rawEmail : "";
  const name = (body.name || "").trim().slice(0, 200);

  const text =
    `${LABEL[kind] || "📨 FEEDBACK"} — Erken extension\n\n` +
    `${message}\n\n` +
    `page: ${title}\n${url}`;

  // Independent of the Telegram send below — never lets a GHL hiccup fail
  // the request or delay/block the Telegram ping.
  const ghlPromise = persistToGhl({ kind, message, url, title, email, name }).catch((e) =>
    console.error("feedback: GHL step failed", e)
  );

  const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chat, text }),
  });

  // Awaited so the serverless instance doesn't freeze mid-request, but its
  // outcome never changes the response below.
  await ghlPromise;

  return NextResponse.json({ ok: r.ok }, { headers: CORS });
}
