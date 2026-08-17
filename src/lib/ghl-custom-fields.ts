/**
 * ghl-custom-fields.ts — set custom field values on a GoHighLevel contact by
 * field KEY, via PUT /contacts/{contactId} (Shamil 2026-08-17).
 *
 * Why keys, not ids: GHL's update-contact schema takes customFields as
 * objects with `id` OR `key` (docs: "Pass either id or key of custom field")
 * plus `fieldValue` (the newer, preferred name; `field_value` is deprecated).
 * Keys keep call sites free of opaque GHL field ids — no extra env vars, and
 * the field name in the sub-account is the contract.
 *
 * Only the listed fields are touched: PUT updates the properties present in
 * the body, so sending just `customFields` does not clobber the contact's
 * other data (tags are NOT sent here — upsert/update `tags` replaces the
 * whole array, see ghl-tags.ts for that trap).
 *
 * Best-effort throughout — any failure is logged and swallowed so a write
 * hiccup never breaks the caller's request, same as ghl-tags.ts,
 * ghl-opportunity.ts and ghl-task.ts.
 */

const GHL_BASE = "https://services.leadconnectorhq.com";

/**
 * Set custom field values on a contact, keyed by field key (e.g.
 * "payment_link"). Entries with a missing key or empty value are dropped.
 * No-op (logged) if creds/contactId are missing or the API rejects it.
 */
export async function setContactCustomFields(opts: {
  key: string;
  contactId: string;
  fields: { key: string; value: string }[];
}): Promise<void> {
  const { key, contactId } = opts;
  const customFields = (opts.fields || [])
    .filter((f) => f.key && f.value)
    .map((f) => ({ key: f.key, fieldValue: f.value }));
  if (!key || !contactId || !customFields.length) return;

  try {
    const r = await fetch(`${GHL_BASE}/contacts/${contactId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${key}`,
        Version: "2021-07-28",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ customFields }),
    });
    if (!r.ok) {
      const txt = await r.text().catch(() => "");
      console.error("ghl-custom-fields: set failed", r.status, txt.slice(0, 300));
    }
  } catch (e) {
    console.error("ghl-custom-fields: set threw", e);
  }
}
