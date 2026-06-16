import { NextResponse } from "next/server";
import { clientIp, originAllowed, rateLimit } from "@/lib/api-guard";

// Creates a Retell web call server-side so the secret RETELL_API_KEY never
// reaches the browser. Returns a short-lived access_token the browser SDK
// uses to start the in-browser voice call with Erken (the site voice agent).
const AGENT_ID = "agent_366d0925268245e195b394ac58"; // Erken Public Site Bot (native) — retell-llm (claude-4.5-haiku), 3-min cap, leads -> /api/retell/capture-lead -> GoHighLevel. Replaced the laptop bridge (old custom-llm agent agent_758d5b0c75ba4091b0fbdb4e8a, kept dormant for revert). Old Discovery agent agent_cca2ee6a721faf88d9beda90b8 still on the phone line.

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
  const r = await fetch("https://api.retellai.com/v2/create-web-call", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ agent_id: AGENT_ID }),
  });
  if (!r.ok) {
    return NextResponse.json({ error: await r.text() }, { status: 502 });
  }
  const d = await r.json();
  return NextResponse.json({ access_token: d.access_token, call_id: d.call_id });
}
