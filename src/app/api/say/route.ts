import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/api-guard";

/**
 * POST /api/say — tiny text-to-speech passthrough for the Erken extension.
 *
 * The "Meet the Platform" walkthrough has fixed explanation text that should be
 * read in the premium Shimmer voice (not the robotic browser voice). The
 * extension sends { text } and gets back { audio } (base64 mp3) to play.
 *
 * Key: OPENAI_API_KEY (Vercel env). Rate-limited per IP. Returns audio:null on
 * any failure so the caller falls back to browser speech.
 */

const TTS_MODEL = "gpt-4o-mini-tts";
const TTS_VOICE = "shimmer";
const MAX = 1200; // chars per request (a single explanation)

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function POST(req: Request) {
  if (!rateLimit(`say:${clientIp(req)}`, 120, 60 * 60_000)) {
    return NextResponse.json({ audio: null, error: "limit" }, { status: 429, headers: CORS });
  }
  const okey = (process.env.OPENAI_API_KEY || "").trim();
  if (!okey) return NextResponse.json({ audio: null, error: "not configured" }, { status: 500, headers: CORS });

  let body: { text?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ audio: null, error: "bad request" }, { status: 400, headers: CORS }); }
  const text = (body.text || "").trim().slice(0, MAX);
  if (!text) return NextResponse.json({ audio: null, error: "no text" }, { status: 400, headers: CORS });

  try {
    const r = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: { Authorization: `Bearer ${okey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: TTS_MODEL, voice: TTS_VOICE, input: text, response_format: "mp3" }),
    });
    if (!r.ok) return NextResponse.json({ audio: null, error: "tts " + r.status }, { status: 502, headers: CORS });
    const buf = Buffer.from(await r.arrayBuffer());
    return NextResponse.json({ audio: buf.toString("base64") }, { headers: CORS });
  } catch {
    return NextResponse.json({ audio: null, error: "tts failed" }, { headers: CORS });
  }
}
