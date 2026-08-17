import { NextResponse } from "next/server";
import { addContactTags } from "@/lib/ghl-tags";
import { setContactCustomFields } from "@/lib/ghl-custom-fields";

/**
 * POST /api/lead — pricing-card lead capture (Shamil 2026-08-16).
 *
 * The pricing cards collect first name, last name, phone, email (all
 * mandatory) BEFORE sending the buyer to the Payoneer link. Phone+email =
 * not losing the lead; first+last name = identifying the payer (Payoneer
 * shows us only the name). This route upserts the contact into the Erken
 * Systems GHL sub-account with tags marking them a website pricing lead.
 *
 * Never hard-fails: if GHL is unreachable we still return ok so the buyer
 * always reaches the payment page (the lead is lost, the sale is not).
 *
 * Per-customer payment links (2026-08-17): Payoneer links are one-time
 * payable, so after the GHL upsert we check the next unused link out of the
 * Google Apps Script ledger (PAYMENT_LEDGER_URL) and hand it back as
 * paymentUrl. Ledger hiccup → paymentUrl: null and the frontend falls back
 * to the static /pay/{plan} link — the never-hard-fail contract holds.
 * The issued link is also written to the contact's `payment_link` custom
 * field in GHL (best-effort, see ghl-custom-fields.ts).
 */

const GHL_BASE = "https://services.leadconnectorhq.com";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

export async function POST(req: Request) {
  let body: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    plan?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 });
  }

  const { firstName, lastName, phone, email, plan } = body;
  if (!firstName || !lastName || !phone || !email) {
    return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });
  }

  const key = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;
  let ghl: number | string = "skipped: env missing";
  let contactId: string | undefined;

  if (key && locationId) {
    try {
      // Upsert WITHOUT tags in the body — upsert's tags field REPLACES the
      // contact's whole tag array (2026-07-21 lesson, see ghl-tags.ts). Tags
      // go on additively after we have the contact id.
      const res = await fetch(`${GHL_BASE}/contacts/upsert`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          Version: "2021-07-28",
          "Content-Type": "application/json",
          "User-Agent": UA,
        },
        body: JSON.stringify({
          locationId,
          firstName,
          lastName,
          phone,
          email,
          source: "erken.systems pricing card",
        }),
      });
      const d = (await res.json().catch(() => ({}))) as { contact?: { id?: string } };
      contactId = d?.contact?.id;
      if (contactId) {
        try {
          await addContactTags({
            key,
            locationId,
            contactId,
            tags: ["website-pricing-lead", ...(plan ? [`plan-${plan}`] : [])],
          });
        } catch {
          // Tagging hiccup must not fail the redirect.
        }
      }
      ghl = res.status;
    } catch (e) {
      ghl = `error: ${String(e)}`;
    }
  }

  const paymentUrl = await checkoutPaymentLink(plan, email, `${firstName} ${lastName}`);

  // Stamp the issued link on the contact so GHL knows exactly which one-time
  // Payoneer URL this buyer got (2026-08-17). payment_link_id is NOT written:
  // the ledger returns only the URL, and a Payoneer link URL
  // (link.payoneer.com/Token?t=<32-hex-token>&src=tpl) carries no numeric id
  // to extract — there is nothing to derive it from. Best-effort: a write
  // failure must never keep the buyer from the payment page.
  // GHL quirk: custom-field writes only persist by field ID (keys are
  // silently ignored) — the ID comes from env GHL_CF_PAYMENT_LINK_ID.
  const paymentLinkFieldId = process.env.GHL_CF_PAYMENT_LINK_ID;
  if (paymentUrl && key && contactId && paymentLinkFieldId) {
    try {
      await setContactCustomFields({
        key,
        contactId,
        fields: [{ id: paymentLinkFieldId, value: paymentUrl }],
      });
    } catch {
      // Custom-field hiccup must not fail the redirect.
    }
  }

  return NextResponse.json({ ok: true, ghl, paymentUrl });
}

/**
 * Check the next unused one-time Payoneer link out of the Google Apps Script
 * ledger (it marks the link provided to this buyer). Returns null on any
 * failure or when the ledger isn't configured — the frontend then falls back
 * to the static /pay/{plan} link, so a ledger hiccup never blocks a sale.
 */
async function checkoutPaymentLink(
  plan: string | undefined,
  email: string,
  name: string
): Promise<string | null> {
  const ledgerUrl = process.env.PAYMENT_LEDGER_URL;
  if (!ledgerUrl) return null;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(ledgerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "checkout",
        secret: process.env.LEDGER_SECRET,
        plan,
        email,
        name,
      }),
      signal: ctrl.signal,
    });
    const d = (await res.json().catch(() => ({}))) as { ok?: boolean; url?: string };
    return d.ok && d.url ? d.url : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
