import { NextResponse } from "next/server";
import { addContactTags } from "@/lib/ghl-tags";

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
  if (!key || !locationId) {
    return NextResponse.json({ ok: true, ghl: "skipped: env missing" });
  }

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
    const contactId = d?.contact?.id;
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
    return NextResponse.json({ ok: true, ghl: res.status });
  } catch (e) {
    return NextResponse.json({ ok: true, ghl: `error: ${String(e)}` });
  }
}
