import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/api-guard";

/**
 * POST /api/transcribe — speech-to-text for the Erken guide extension.
 *
 * The extension records a short voice question (Telegram-style: tap mic →
 * record → tap to send), base64-encodes the audio, and posts it here. We hand
 * it to OpenAI Whisper and return { text }. The spoken REPLY half (Shimmer TTS)
 * lives in /api/guide, so this only covers the user's INPUT.
 *
 * Body: { audio: <base64>, mime?: "audio/webm" }
 * Key: OPENAI_API_KEY (Vercel env). CORS open (chrome-extension origin), rate-limited.
 */

export const runtime = "nodejs";

const STT_MODEL = "whisper-1";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function POST(req: Request) {
  if (!rateLimit(`stt:${clientIp(req)}`, 60, 60 * 60_000)) {
    return NextResponse.json({ text: "", error: "rate limit" }, { status: 429, headers: CORS });
  }
  const key = (process.env.OPENAI_API_KEY || "").trim();
  if (!key) return NextResponse.json({ text: "", error: "not configured" }, { status: 500, headers: CORS });

  let body: { audio?: string; mime?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ text: "", error: "bad request" }, { status: 400, headers: CORS }); }
  const b64 = String(body.audio || "");
  if (!b64) return NextResponse.json({ text: "", error: "no audio" }, { status: 400, headers: CORS });

  // guard against oversized uploads (~base64 inflates ~33%); ~8MB of audio is plenty for a question
  if (b64.length > 11_000_000) return NextResponse.json({ text: "", error: "audio too large" }, { status: 413, headers: CORS });

  const mime = String(body.mime || "audio/webm");
  const ext = mime.includes("ogg") ? "ogg" : mime.includes("mp4") || mime.includes("mp3") ? "mp4" : "webm";

  try {
    const buf = Buffer.from(b64, "base64");
    const form = new FormData();
    form.append("file", new Blob([buf], { type: mime }), `audio.${ext}`);
    form.append("model", STT_MODEL);
    const r = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}` }, // no Content-Type — fetch sets the multipart boundary
      body: form,
    });
    if (!r.ok) return NextResponse.json({ text: "", error: "stt " + r.status }, { status: 502, headers: CORS });
    const d = await r.json();
    return NextResponse.json({ text: String(d.text || "").trim() }, { headers: CORS });
  } catch {
    return NextResponse.json({ text: "", error: "transcription failed" }, { status: 502, headers: CORS });
  }
}
