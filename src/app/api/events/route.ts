import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/api-guard";

/**
 * POST /api/events — the "mailbox" for Erkenbot usage analytics.
 *
 * The v1.1.0 extension fires fire-and-forget events here (session_start,
 * ask, session_end, errors…) with shape:
 *   { event, session_id, data: { url, ... }, ts, version }
 *
 * What happens to a letter:
 *   1. error-ish events  → instant Telegram ping (same envs as /api/feedback)
 *   2. everything        → forwarded to the n8n webhook (N8N_EVENTS_WEBHOOK
 *      env) which writes into the GHL data hub — the workflow gets built
 *      WITH Shamil in the n8n UI (creation is UI-only). Until that env is
 *      set, non-error events pass through unsaved — acceptable while v1.1
 *      sits in store review and has zero installs.
 *
 * CORS is required: the MV3 service worker's cross-origin fetch from the
 * extension is CORS-gated (v1.1 host permissions cover GHL only).
 */

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function POST(req: Request) {
  // generous limit — sessions emit several events; abusers still get cut off
  if (!rateLimit(`ev:${clientIp(req)}`, 120, 60 * 60_000)) {
    return NextResponse.json({ ok: false, error: "limit" }, { status: 429, headers: CORS });
  }

  let body: {
    event?: string;
    session_id?: string;
    data?: Record<string, unknown>;
    ts?: string;
    version?: string;
  };
  try { body = await req.json(); } catch {
    return NextResponse.json({ ok: false }, { status: 400, headers: CORS });
  }
  const event = (body.event || "").slice(0, 60).trim();
  if (!event) return NextResponse.json({ ok: false }, { status: 400, headers: CORS });

  const payload = {
    event,
    session_id: String(body.session_id || "").slice(0, 32),
    data: body.data && typeof body.data === "object" ? body.data : {},
    ts: String(body.ts || new Date().toISOString()).slice(0, 40),
    version: String(body.version || "").slice(0, 20),
    received_at: new Date().toISOString(),
  };

  // 1 · errors ring the bell immediately (best-effort)
  if (/error|fail|crash/i.test(event)) {
    const token = (process.env.TELEGRAM_BOT_TOKEN || "").trim();
    const chat = (process.env.TELEGRAM_OWNER_CHAT || "").trim();
    if (token && chat) {
      try {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chat,
            text:
              `⚠️ BOT EVENT: ${event}\n\n` +
              JSON.stringify(payload.data).slice(0, 800) +
              `\n\nsession ${payload.session_id} · v${payload.version}`,
          }),
        });
      } catch {}
    }
  }

  // 2 · forward everything to the hub pipeline (n8n → GHL) when wired
  const hook = (process.env.N8N_EVENTS_WEBHOOK || "").trim();
  if (hook) {
    try {
      await fetch(hook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {}
  }

  // 3 · forward everything to PostHog product analytics (server-side capture).
  // phc_ is a public write-only ingest key — fine to send from the server. Host
  // defaults to the US cloud; override with POSTHOG_HOST. Best-effort.
  const phKey = (process.env.POSTHOG_KEY || "").trim();
  if (phKey) {
    const phHost = (process.env.POSTHOG_HOST || "https://us.i.posthog.com").replace(/\/$/, "");
    try {
      await fetch(`${phHost}/capture/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: phKey,
          event: payload.event,
          distinct_id: payload.session_id || "anonymous",
          timestamp: payload.ts,
          properties: {
            ...payload.data,
            // $ip = the REAL visitor's IP (from x-forwarded-for) so PostHog
            // resolves true geography. Without it, server-side events geo-locate
            // to the datacenter (the confusing "Virginia" Shamil saw). $current_url
            // / $referrer light up PostHog's web-analytics views.
            $ip: clientIp(req),
            $current_url: (payload.data?.url as string) || undefined,
            $referrer: (payload.data?.referrer as string) || undefined,
            $lib: payload.version === "site" ? "erken-website" : "erken-extension",
            extension_version: payload.version,
            session_id: payload.session_id,
            received_at: payload.received_at,
          },
        }),
      });
    } catch {}
  }

  return NextResponse.json({ ok: true }, { headers: CORS });
}
