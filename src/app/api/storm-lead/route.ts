import { NextResponse } from "next/server";

/**
 * POST /api/storm-lead
 *
 * Intake endpoint for the /storm-v2 Storm Roofing Heroes landing page.
 * Upserts the submission as a contact in the SRH GoHighLevel sub-account
 * (services.leadconnectorhq.com, Version 2021-07-28).
 *
 * Env (never hardcoded, never echoed):
 *   GHL_SRH_LOCATION_API_KEY — sub-account API key
 *   GHL_SRH_LOCATION_ID     — sub-account location id
 *
 * Demo mode: if either env var is missing, the route returns ok:true
 * without calling GHL, so the page works in previews with no secrets.
 *
 * "What can we help with", property type, new-customer status, and the
 * heard-about source travel as slugified tags + the `source` field, so
 * no per-location custom-field IDs are needed.
 */

const GHL_BASE = "https://services.leadconnectorhq.com";

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);

const str = (v: unknown, max = 200): string =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 });
  }

  const name = str(body.name);
  const phone = str(body.phone, 30);
  if (!name || !phone) {
    return NextResponse.json({ ok: false, error: "name and phone required" }, { status: 400 });
  }

  const email = str(body.email);
  const address = str(body.address);
  const city = str(body.city, 60);
  const zip = str(body.zip, 12);
  const helpWith = str(body.helpWith, 60);
  const propertyType = str(body.propertyType, 20);
  const newCustomer = str(body.newCustomer, 5);
  const hearAbout = str(body.hearAbout, 60);

  const key = process.env.GHL_SRH_LOCATION_API_KEY;
  const locationId = process.env.GHL_SRH_LOCATION_ID;
  if (!key || !locationId) {
    // Demo mode — no SRH sub-account wired in this environment.
    return NextResponse.json({ ok: true, demo: true });
  }

  const [firstName, ...rest] = name.split(/\s+/);
  const tags = [
    "srh-web-lead",
    helpWith && `help-${slug(helpWith)}`,
    propertyType && `property-${slug(propertyType)}`,
    newCustomer === "no" ? "returning-customer" : "new-customer",
    hearAbout && `heard-${slug(hearAbout)}`,
  ].filter(Boolean) as string[];

  try {
    const r = await fetch(`${GHL_BASE}/contacts/upsert`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        Version: "2021-07-28",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        locationId,
        firstName,
        lastName: rest.join(" ") || undefined,
        phone,
        email: email || undefined,
        address1: address || undefined,
        city: city || undefined,
        postalCode: zip || undefined,
        source: "storm-v2 landing page",
        tags,
      }),
      cache: "no-store",
    });

    if (!r.ok) {
      // Never leak GHL error bodies (may include account details) to the client.
      console.error(`storm-lead: GHL upsert failed with status ${r.status}`);
      return NextResponse.json({ ok: false, error: "crm error" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("storm-lead: GHL unreachable", err instanceof Error ? err.message : "");
    return NextResponse.json({ ok: false, error: "crm unreachable" }, { status: 502 });
  }
}
