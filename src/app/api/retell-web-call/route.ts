import { NextResponse } from "next/server";

// Creates a Retell web call server-side so the secret RETELL_API_KEY never
// reaches the browser. Returns a short-lived access_token the browser SDK
// uses to start the in-browser voice call with Erken (the site voice agent).
const AGENT_ID = "agent_cca2ee6a721faf88d9beda90b8"; // Shamil AI Discovery v1 (conversation-flow; feeds GHL CRM via n8n webhook)

export async function POST() {
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
