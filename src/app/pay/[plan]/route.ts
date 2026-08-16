import { NextResponse } from "next/server";
import { PAYMENT_LINKS } from "@/lib/pricing";

/**
 * GET /pay/[plan] — stable short payment URLs (Shamil 2026-08-16).
 *
 * The Payoneer token links live in ONE place (src/lib/pricing.ts →
 * PAYMENT_LINKS). These redirects are what the chat bot, the voice agent's
 * SMS action, and any marketing material point at — when Shamil regenerates
 * a Payoneer link, only pricing.ts changes; every published URL keeps
 * working. /pay/monthly | /pay/6-months | /pay/yearly, /pay → monthly.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ plan: string }> }
) {
  const { plan } = await params;
  const url = PAYMENT_LINKS[plan as keyof typeof PAYMENT_LINKS];
  if (!url) return NextResponse.redirect(new URL("/#pricing", _req.url));
  return NextResponse.redirect(url, 302);
}
