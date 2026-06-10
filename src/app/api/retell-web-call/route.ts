import { NextResponse } from "next/server";
import { clientIp, originAllowed, rateLimit } from "@/lib/api-guard";

// Creates a Retell web call server-side so the secret RETELL_API_KEY never
// reaches the browser. Returns a short-lived access_token the browser SDK
// uses to start the in-browser voice call with Erken (the site voice agent).
const AGENT_ID = "agent_758d5b0c75ba4091b0fbdb4e8a"; // Erken Public Site Bot (custom-llm -> erken_public_bridge.py; Haiku; 3-min hard cap; $30/day ceiling enforced in the bridge; leads -> GoHighLevel). Old Discovery agent agent_cca2ee6a721faf88d9beda90b8 still on the phone line.

export async function POST(req: Request) {
  // Every token minted here opens a paid Retell call — gate it.
  if (!originAllowed(req)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const ip = clientIp(req);
  if (!rateLimit(`call:${ip}`, 3, 60 * 60_000) || !rateLimit("call:all", 30, 60 * 60_000)) {
    return NextResponse.json(
      { error: "Too many calls right now — please try again later or leave a message." },
      { status: 429 },
    );
  }
  const key = process.env.RETELL_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "RETELL_API_KEY not set" }, { status: 500 });
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
