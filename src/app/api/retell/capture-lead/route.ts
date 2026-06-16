import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/api-guard";
import { createTrialOpportunity } from "@/lib/ghl-opportunity";

/**
 * POST /api/retell/capture-lead — custom-function webhook for the website voice
 * bot ("Erken Public Site Bot", Retell-native retell-llm).
 *
 * Retell calls this when the bot has an email to capture. Two intents:
 *   • "access"  → they want the free week of the system. The email IS the login,
 *                 so we upsert a trial contact (same path as the /start form) and
 *                 ping Shamil to provision their sub-account.
 *   • "message" → a buyer / partnership / question for Shamil. Upsert + attach the
 *                 message as a note, ping Shamil.
 *
 * Replaces the GoHighLevel logic that used to live in erken_public_bridge.py
 * (the laptop bridge). The brain now runs natively on Retell — no laptop.
 *
 * Retell's default payload is { name, call, args }; "args only" mode sends the
 * arg object at top level. We handle both. Reply body is any JSON; Retell feeds
 * it back to the LLM (15k char cap), so `message` guides what the bot says next.
 *
 * Env (Vercel, already set for the other routes): GHL_SIGNUP_API_KEY /
 * GHL_SIGNUP_LOCATION_ID (fall back to GHL_API_KEY / GHL_LOCATION_ID),
 * TELEGRAM_BOT_TOKEN, TELEGRAM_OWNER_CHAT. Optional RETELL_FN_SECRET — if set,
 * the request must carry ?k=<secret> (configured in the Retell tool URL).
 */

const GHL_BASE = "https://services.leadconnectorhq.com";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Args = {
  email?: string;
  name?: string;
  business?: string;
  message?: string;
  intent?: string; // "access" | "message"
};

export async function POST(req: Request) {
  // Public webhook — rate-limit hard, and (if configured) require the shared key.
  if (!rateLimit(`capture:${clientIp(req)}`, 8, 60 * 60_000) || !rateLimit("capture:all", 60, 60 * 60_000)) {
    return NextResponse.json({ success: false, message: "Rate limited — take a message instead." }, { status: 429 });
  }
  const secret = (process.env.RETELL_FN_SECRET || "").trim();
  if (secret) {
    const url = new URL(req.url);
    if (url.searchParams.get("k") !== secret) {
      return NextResponse.json({ success: false, message: "forbidden" }, { status: 403 });
    }
  }

  let raw: Record<string, unknown>;
  try { raw = await req.json(); } catch {
    return NextResponse.json({ success: false, message: "bad request" }, { status: 400 });
  }
  // Retell default mode wraps args under `args`; "args only" mode is flat.
  const a = (raw.args && typeof raw.args === "object" ? raw.args : raw) as Args;

  const email = (a.email || "").trim().toLowerCase().slice(0, 200);
  const name = (a.name || "").trim().slice(0, 120);
  const business = (a.business || "").trim().slice(0, 200);
  const message = (a.message || "").trim().slice(0, 1000);
  const intent = (a.intent || "").trim().toLowerCase() === "message" ? "message" : "access";

  if (!EMAIL_RE.test(email)) {
    // Tell the LLM to slow down and confirm the email letter by letter, then retry.
    return NextResponse.json({
      success: false,
      message:
        "I didn't catch a valid email. Ask the visitor to repeat it slowly, letter by letter, read it back to confirm, then call capture_lead again.",
    });
  }

  const key = (process.env.GHL_SIGNUP_API_KEY || process.env.GHL_API_KEY || "").trim();
  const locationId = (process.env.GHL_SIGNUP_LOCATION_ID || process.env.GHL_LOCATION_ID || "").trim();
  if (!key || !locationId) {
    // Don't fail the call — Shamil still gets the Telegram ping below as backup.
    console.error("capture-lead: GHL creds missing");
  }

  const tags =
    intent === "message"
      ? ["website-voice", "erken-bot", "contact-shamil"]
      : ["website-voice", "erken-bot", "trial-signup", "crm-trial"];

  let contactId = "";
  if (key && locationId) {
    try {
      const upsert: Record<string, unknown> = {
        locationId,
        email,
        source: "Website Erken voice bot",
        tags,
      };
      if (name) {
        const parts = name.split(/\s+/);
        upsert.firstName = parts[0];
        if (parts.length > 1) upsert.lastName = parts.slice(1).join(" ");
      }
      const r = await fetch(`${GHL_BASE}/contacts/upsert`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          Version: "2021-07-28",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(upsert),
      });
      if (r.ok) {
        const d = await r.json().catch(() => ({} as Record<string, unknown>));
        const c = (d.contact as Record<string, unknown>) || d;
        contactId = (c?.id as string) || "";
      }
    } catch (e) {
      console.error("capture-lead upsert failed:", e);
    }

    // Attach a note when there's a business or message worth keeping.
    if (contactId && (business || message)) {
      try {
        const note = `[Website Erken voice bot] Intent: ${intent}. Business: ${business || "—"}. Message: ${message || "—"}`;
        await fetch(`${GHL_BASE}/contacts/${contactId}/notes`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            Version: "2021-07-28",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ body: note }),
        });
      } catch (e) {
        console.error("capture-lead note failed:", e);
      }
    }

    // Put the lead in the Trials pipeline so it's visible, not just a contact.
    if (contactId) {
      const label = name || business || email;
      const oppName = intent === "message" ? `Inquiry: ${label}` : `Trial: ${label}`;
      await createTrialOpportunity({ key, locationId, contactId, name: oppName });
    }
  }

  // Ping Shamil so nothing sits unnoticed (best-effort).
  const token = (process.env.TELEGRAM_BOT_TOKEN || "").trim();
  const chat = (process.env.TELEGRAM_OWNER_CHAT || "").trim();
  if (token && chat) {
    const head = intent === "message" ? "💬 WEBSITE BOT — MESSAGE FOR YOU" : "🚀 WEBSITE BOT — FREE-WEEK SIGNUP";
    const lines = [
      head,
      "",
      `Email: ${email}`,
      name ? `Name: ${name}` : "",
      business ? `Business: ${business}` : "",
      message ? `Message: ${message}` : "",
      "",
      intent === "message" ? "Reach out." : "Set up their sub-account access + reach out.",
    ].filter(Boolean);
    try {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chat, text: lines.join("\n") }),
      });
    } catch {}
  }

  const message_back =
    intent === "message"
      ? "Got it — I've passed that to Shamil with your email, and he'll get back to you. Anything else?"
      : "Perfect — you're on the list for free access. Shamil will set you up and email you shortly. Anything else I can help with?";

  return NextResponse.json({ success: true, message: message_back });
}
