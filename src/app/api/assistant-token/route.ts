import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { clientIp, originAllowed, rateLimit } from "@/lib/api-guard";

// Mints a Retell web-call token for SHAMIL'S PERSONAL voice assistant (the
// Claude bridge agent) — NOT the public site sales agent. Locked behind a
// shared secret (ASSISTANT_VOICE_SECRET) so randoms can't talk to his
// assistant or run up the Retell bill. Secret + RETELL_API_KEY stay server-side.
const AGENT_ID = "agent_17b52d7bbcd5ae78374f24746a"; // Shamil Voice Bridge (Claude)

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export async function POST(req: Request) {
  // This is a password endpoint — throttle guesses hard.
  if (!originAllowed(req)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (!rateLimit(`tok:${clientIp(req)}`, 5, 15 * 60_000)) {
    return NextResponse.json({ error: "too many attempts" }, { status: 429 });
  }
  const key = process.env.RETELL_API_KEY;
  const secret = process.env.ASSISTANT_VOICE_SECRET;
  if (!key) return NextResponse.json({ error: "RETELL_API_KEY not set" }, { status: 500 });
  if (!secret) return NextResponse.json({ error: "assistant secret not configured" }, { status: 500 });

  let provided = "";
  try {
    const body = await req.json();
    provided = (body?.secret || "").toString();
  } catch {}
  if (!safeEqual(provided, secret)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const r = await fetch("https://api.retellai.com/v2/create-web-call", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ agent_id: AGENT_ID }),
  });
  if (!r.ok) return NextResponse.json({ error: await r.text() }, { status: 502 });
  const d = await r.json();
  return NextResponse.json({ access_token: d.access_token, call_id: d.call_id });
}
