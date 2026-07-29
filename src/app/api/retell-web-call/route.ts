import { NextResponse } from "next/server";
import { clientIp, originAllowed, rateLimit } from "@/lib/api-guard";

// Creates a Retell web call server-side so the secret RETELL_API_KEY never
// reaches the browser. Returns a short-lived access_token the browser SDK
// uses to start the in-browser voice call with Erken (the site voice agent).
const AGENT_ID = "agent_cca2ee6a721faf88d9beda90b8"; // Shamil AI Discovery (web) — conversation-flow agent: business AI-automation assessment + leave-a-message, web-helper persona (rewritten phone->web 2026-06-17), 5-min cap, leads -> n8n retell-to-ghl -> GoHighLevel. Swapped 2026-06-17 from the native GHL-pitch bot agent_366d0925268245e195b394ac58 (kept for revert). Phone +19016331400 detached from this agent. Pre-edit Retell snapshots in vault/06-memory/retell-snapshots/.

// Hard daily spend cap (USD) for the public bot. Retell only BILLS — it won't
// auto-stop — so the ceiling lives here (like the old bridge did). We sum the
// agent's REAL combined_cost from Retell for today; past the cap, new callers get
// a 429 the frontend turns into "leave your email". (Shamil 2026-06-14)
const DAILY_CAP_USD = 100;
let _spend = { at: 0, cents: 0 };

async function todaySpendCents(key: string): Promise<number> {
  const now = Date.now();
  if (now - _spend.at < 60_000) return _spend.cents; // cache 60s (per instance; each reads Retell truth)
  const midnight = new Date();
  midnight.setUTCHours(0, 0, 0, 0);
  try {
    const res = await fetch("https://api.retellai.com/v2/list-calls", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        filter_criteria: { agent_id: [AGENT_ID], start_timestamp: { lower_threshold: midnight.getTime() } },
        limit: 1000,
        sort_order: "descending",
      }),
    });
    if (!res.ok) return _spend.cents;
    const calls = (await res.json()) as Array<{ call_cost?: { combined_cost?: number } }>;
    let cents = 0;
    for (const c of calls) cents += c?.call_cost?.combined_cost || 0;
    _spend = { at: now, cents };
    return cents;
  } catch {
    return _spend.cents;
  }
}

/**
 * Optional caller context (added for /demo/[industry] pages, 2026-07-29):
 * the POST body may carry { dynamic_variables: Record<string,string> },
 * forwarded to Retell as retell_llm_dynamic_variables so the agent knows
 * which demo business it is answering for. Sanitized hard — the body is
 * public-visitor input: max 8 keys, string values only, capped lengths.
 * The homepage widget still POSTs with no body; that path is unchanged.
 */
function sanitizeDynamicVariables(raw: unknown): Record<string, string> | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const out: Record<string, string> = {};
  let n = 0;
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof v !== "string") continue;
    if (!/^[a-z0-9_]{1,40}$/i.test(k)) continue;
    out[k] = v.slice(0, 600);
    if (++n >= 8) break;
  }
  return n > 0 ? out : undefined;
}

export async function POST(req: Request) {
  // Every token minted here opens a paid Retell call — gate it.
  if (!originAllowed(req)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const ip = clientIp(req);
  // Per-visitor cap only (3/hr) — stops one person hammering. NO global/hour cap:
  // different visitors are potential clients, and the whole reason they came is to
  // try the bot; blocking them = an unimpressed lead. The real cost backstop is the
  // hard SPEND CAP set in the Retell dashboard + the 5-min per-call limit, not an
  // hourly request ceiling. (Shamil 2026-06-14)
  if (!rateLimit(`call:${ip}`, 3, 60 * 60_000)) {
    return NextResponse.json(
      { error: "You've reached the limit for now — please leave your email and Shamil will reach out." },
      { status: 429 },
    );
  }
  const key = process.env.RETELL_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "RETELL_API_KEY not set" }, { status: 500 });
  }
  // Hard daily spend ceiling — past $100 of real Retell spend today, stop opening
  // new calls (the frontend shows the leave-your-email fallback).
  if (await todaySpendCents(key) >= DAILY_CAP_USD * 100) {
    return NextResponse.json(
      { error: "daily_cap", message: "Erken's had a busy day! Leave your email and Shamil will reach out personally." },
      { status: 429 },
    );
  }
  const dynamicVariables = sanitizeDynamicVariables(
    (await req.json().catch(() => null))?.dynamic_variables,
  );
  const r = await fetch("https://api.retellai.com/v2/create-web-call", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      agent_id: AGENT_ID,
      ...(dynamicVariables ? { retell_llm_dynamic_variables: dynamicVariables } : {}),
    }),
  });
  if (!r.ok) {
    return NextResponse.json({ error: await r.text() }, { status: 502 });
  }
  const d = await r.json();
  return NextResponse.json({ access_token: d.access_token, call_id: d.call_id });
}
