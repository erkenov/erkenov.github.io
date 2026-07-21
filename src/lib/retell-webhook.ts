import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * retell-webhook.ts — shared helpers for Retell post-call webhook routes.
 *
 * Factored out 2026-07-21 while porting the second n8n Retell->GHL flow
 * (Storm Roofing demo, n8n workflow RZnMEFgsbjRDNBeu) so the signature
 * verification logic isn't duplicated between /api/retell-postcall
 * (Discovery agent) and /api/retell-postcall-storm (Storm Roofing demo
 * agent) — same HMAC scheme, different downstream field mapping/GHL
 * targets per route.
 */

const SIGNATURE_MAX_AGE_MS = 5 * 60_000;

/**
 * Verify Retell's HMAC-SHA256 webhook signature (`x-retell-signature`
 * header, format `v={timestampMs},d={hexDigest}`, digest =
 * HMAC-SHA256(rawBody + timestamp, RETELL_API_KEY), 5-minute replay
 * window, constant-time compare). Per docs.retellai.com/features/secure-webhook.
 *
 * Returns true if verified, or if verification could not be performed
 * because `apiKey` is unset (logged, not fatal — matches this repo's
 * fail-open-but-log convention for missing config on best-effort steps).
 * Returns false only when a key IS configured and the signature is present
 * but invalid/expired/malformed — that's the actual "someone is spoofing
 * Retell" case.
 */
export function verifyRetellSignature(
  rawBody: string,
  header: string | null,
  apiKey: string,
  logPrefix: string
): boolean {
  const key = (apiKey || "").trim();
  if (!key) {
    console.error(`${logPrefix}: RETELL_API_KEY not set — skipping signature verification`);
    return true;
  }
  if (!header) {
    console.error(`${logPrefix}: missing x-retell-signature header`);
    return false;
  }
  const match = header.match(/v=(\d+),d=([0-9a-fA-F]+)/);
  if (!match) {
    console.error(`${logPrefix}: malformed x-retell-signature header`);
    return false;
  }
  const [, timestampStr, digestHex] = match;
  const timestamp = Number(timestampStr);
  if (!Number.isFinite(timestamp) || Math.abs(Date.now() - timestamp) > SIGNATURE_MAX_AGE_MS) {
    console.error(`${logPrefix}: signature timestamp outside allowed window`);
    return false;
  }
  const expected = createHmac("sha256", key).update(rawBody + timestampStr).digest("hex");
  const expectedBuf = Buffer.from(expected, "hex");
  const gotBuf = Buffer.from(digestHex, "hex");
  if (expectedBuf.length !== gotBuf.length) return false;
  try {
    return timingSafeEqual(expectedBuf, gotBuf);
  } catch {
    return false;
  }
}

/** Strip everything but digits and a leading "+" — same as n8n's phone cleanup. */
export const digitsAndPlus = (s: string | undefined) => (s || "").replace(/[^\d+]/g, "");
