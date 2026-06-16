import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/api-guard";

/**
 * POST /api/memory — maintains the extension bot's two per-user memory files.
 *
 * The bot stores its memory LOCALLY (chrome.storage) and sends it to /api/guide
 * on every message. At the END of a conversation it calls THIS route ONCE with
 * the current files + the recent exchange; one cheap Haiku call rewrites the two
 * files (keeping each under the cap) and the extension saves the result back.
 * One call per conversation, not per message — keeps it cheap. (Shamil 2026-06-15)
 *
 * In:  { profile?, progress?, transcript? }
 * Out: { profile, progress }  (each <= CAP chars)
 */

const MODEL = "claude-haiku-4-5";
const CAP = 1400;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function POST(req: Request) {
  if (!rateLimit(`memory:${clientIp(req)}`, 30, 60 * 60_000)) {
    return NextResponse.json({ error: "rate limit" }, { status: 429, headers: CORS });
  }
  const akey = (process.env.ANTHROPIC_API_KEY || "").trim();
  if (!akey) return NextResponse.json({ error: "not configured" }, { status: 500, headers: CORS });

  let body: { profile?: string; progress?: string; transcript?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad request" }, { status: 400, headers: CORS }); }

  const profile = String(body.profile || "").slice(0, CAP);
  const progress = String(body.progress || "").slice(0, CAP);
  const transcript = String(body.transcript || "").slice(0, 4000);
  if (!transcript.trim()) {
    // nothing happened — return the files unchanged
    return NextResponse.json({ profile, progress }, { headers: CORS });
  }

  const sys =
    "You maintain a user's MEMORY for a friendly assistant bot. You are given two current memory files and the latest conversation. " +
    "Rewrite the two files so they stay accurate and useful. " +
    "PROFILE = stable facts about the user: their name, their business/industry, their role, and preferences (e.g. how they like to be addressed). Changes rarely. " +
    "PROGRESS = what they've done and where they are: tasks completed, what they're working on now, current goals, where they got stuck. Updates often. " +
    "Rules: only record genuinely useful, durable facts the user actually stated or clearly implied — never invent or guess. Keep each file tight and skimmable (bullet-style lines are fine). " +
    `Each file MUST stay under ${CAP} characters; if needed, drop the least useful older lines. If nothing new belongs in a file, return it unchanged. ` +
    'Reply with STRICT JSON only, no prose or fences: {"profile": "<text>", "progress": "<text>"}.';

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": akey, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 900,
        system: sys,
        messages: [{
          role: "user",
          content: `CURRENT PROFILE FILE:\n${profile || "(empty)"}\n\nCURRENT PROGRESS FILE:\n${progress || "(empty)"}\n\nLATEST CONVERSATION:\n${transcript}`,
        }],
      }),
    });
    if (!r.ok) return NextResponse.json({ profile, progress }, { headers: CORS }); // on failure, keep old files
    const data = await r.json();
    const text = (data.content || []).filter((c: { type: string }) => c.type === "text").map((c: { text: string }) => c.text).join("").trim();
    const m = text.match(/\{[\s\S]*\}/);
    if (!m) return NextResponse.json({ profile, progress }, { headers: CORS });
    const parsed = JSON.parse(m[0]) as { profile?: string; progress?: string };
    return NextResponse.json({
      profile: String(parsed.profile ?? profile).slice(0, CAP),
      progress: String(parsed.progress ?? progress).slice(0, CAP),
    }, { headers: CORS });
  } catch {
    return NextResponse.json({ profile, progress }, { headers: CORS });
  }
}
