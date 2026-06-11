import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/api-guard";

/**
 * POST /api/summarize — companion-mode brain for the Erken extension.
 *
 * The extension sends { text, title, url } (the visible text of whatever page
 * the user clicked Erken on — user-initiated via activeTab). Returns
 * { say } — a short spoken-style summary read aloud by the creature.
 *
 * Free-tier cost control: per-IP rate limits (in-memory, per instance) +
 * input capped server-side. Haiku at ~12K chars ≈ fractions of a cent.
 */

const MODEL = "claude-haiku-4-5";
const MAX_INPUT = 14000; // chars of page text we accept

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  // 5/hour + 15/day per IP — generous for humans, hostile to loops
  if (!rateLimit(`sum:${ip}`, 5, 60 * 60_000) || !rateLimit(`sumday:${ip}`, 15, 24 * 60 * 60_000)) {
    return NextResponse.json(
      { error: "limit", say: "I've hit my free summary limit for today — try me again tomorrow." },
      { status: 429, headers: CORS },
    );
  }
  const akey = (process.env.ANTHROPIC_API_KEY || "").trim();
  if (!akey) return NextResponse.json({ error: "not configured" }, { status: 500, headers: CORS });

  let body: { text?: string; title?: string; url?: string };
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400, headers: CORS });
  }
  const text = (body.text || "").slice(0, MAX_INPUT);
  if (text.length < 200) {
    return NextResponse.json(
      { say: "There isn't much readable text on this page for me to summarize." },
      { headers: CORS },
    );
  }

  const sys =
    "You are Erken, a friendly on-screen companion. The user clicked you on a " +
    "web page and asked for the gist. Summarize the page in 3-5 short sentences " +
    "of natural SPOKEN English — it will be read aloud. Lead with what the page " +
    "IS (article, product, docs, profile...), then the key points a busy person " +
    "wants. No headers, no lists, no markdown, no URLs. If the text looks like a " +
    "login wall or cookie notice, say there's not much to read here yet.";

  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": akey, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({
      model: MODEL, max_tokens: 300, system: sys,
      messages: [{ role: "user", content: `Page title: ${body.title || "(unknown)"}\n\nPage text:\n${text}` }],
    }),
  });
  if (!r.ok) return NextResponse.json({ error: "ai " + r.status }, { status: 502, headers: CORS });
  const data = await r.json();
  const say = (data.content || [])
    .filter((c: { type: string }) => c.type === "text")
    .map((c: { text: string }) => c.text)
    .join("")
    .trim();
  return NextResponse.json({ say }, { headers: CORS });
}
