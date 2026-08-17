/**
 * ghl-custom-fields.ts — set custom field values on a GoHighLevel contact via
 * PUT /contacts/{contactId} (Shamil 2026-08-17).
 *
 * Why field IDs, not keys: empirically verified against the live API
 * (2026-08-17, see session log) — `customFields: [{key, fieldValue}]` (any
 * key form, incl. the full "contact.xxx" fieldKey, any Version header) is
 * SILENTLY IGNORED (HTTP 200, nothing written). Only
 * `customFields: [{id, fieldValue}]` with the dated `Version: 2021-07-28`
 * header actually persists. Note GHL's GET contact can lag a few seconds
 * before echoing the write — verify with a delay, never immediately.
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
 * Set custom field values on a contact, keyed by GHL field ID. Entries with
 * a missing id or empty value are dropped. No-op (logged) if creds/contactId
 * are missing or the API rejects it.
 */
export async function setContactCustomFields(opts: {
  key: string;
  contactId: string;
  fields: { id: string; value: string }[];
}): Promise<void> {
  const { key, contactId } = opts;
  const customFields = (opts.fields || [])
    .filter((f) => f.id && f.value)
    .map((f) => ({ id: f.id, fieldValue: f.value }));
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
