import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/api-guard";

/**
 * POST /api/feedback — bug reports / suggestions / human-help requests from
 * the Erken extension, forwarded straight to Shamil's Telegram.
 *
 * Env (Vercel): TELEGRAM_BOT_TOKEN + TELEGRAM_OWNER_CHAT (his chat id).
 */

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

const LABEL: Record<string, string> = {
  bug: "🐞 BUG REPORT",
  idea: "💡 SUGGESTION",
  help: "🆘 HELP REQUEST",
};

export async function POST(req: Request) {
  if (!rateLimit(`fb:${clientIp(req)}`, 6, 60 * 60_000)) {
    return NextResponse.json({ ok: false, error: "limit" }, { status: 429, headers: CORS });
  }
  const token = (process.env.TELEGRAM_BOT_TOKEN || "").trim();
  const chat = (process.env.TELEGRAM_OWNER_CHAT || "").trim();
  if (!token || !chat) return NextResponse.json({ ok: false }, { status: 500, headers: CORS });

  let body: { kind?: string; message?: string; url?: string; title?: string };
  try { body = await req.json(); } catch {
    return NextResponse.json({ ok: false }, { status: 400, headers: CORS });
  }
  const message = (body.message || "").slice(0, 1500).trim();
  if (!message) return NextResponse.json({ ok: false }, { status: 400, headers: CORS });

  const text =
    `${LABEL[body.kind || ""] || "📨 FEEDBACK"} — Erken extension\n\n` +
    `${message}\n\n` +
    `page: ${(body.title || "").slice(0, 120)}\n${(body.url || "").slice(0, 300)}`;

  const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chat, text }),
  });
  return NextResponse.json({ ok: r.ok }, { headers: CORS });
}
