/**
 * ghl-tags.ts — add tags to a GoHighLevel contact WITHOUT clobbering its
 * existing ones (Shamil 2026-07-21, found by the end-to-end test: a
 * "custom-solution-request" tag got wiped when the same contact later hit
 * /api/feedback, then wiped again by /api/signup — each route was sending
 * `tags` on /contacts/upsert, and upsert REPLACES the tags array instead of
 * merging it. Confirmed against GHL's own docs/changelog: "Add Tags API will
 * append" vs. upsert/update "will replace, not append to the list of tags").
 *
 * This is dangerous because workflows are tag-gated — losing a tag like
 * "trial-signup" or "custom-solution-request" on a later, unrelated upsert
 * could silently restart or misroute automation for a real client.
 *
 * Fix: never send `tags` on /contacts/upsert. Upsert the contact first
 * (create/update everything else), then call addContactTags with the
 * intended tags — GHL's additive POST /contacts/{contactId}/tags endpoint,
 * not a fetch-then-union of the existing array. Preferred over fetch-union
 * because it's a single call with no read-then-write race window between
 * concurrent requests for the same contact.
 *
 * Best-effort throughout — any failure is logged and swallowed so a tagging
 * hiccup never breaks the caller's request, same as ghl-opportunity.ts and
 * ghl-task.ts.
 */

const GHL_BASE = "https://services.leadconnectorhq.com";

/**
 * Add `tags` to a contact, additively — existing tags on the contact are
 * left untouched. No-op (logged) if creds/contactId/tags are missing or the
 * API rejects it.
 */
export async function addContactTags(opts: {
  key: string;
  locationId: string;
  contactId: string;
  tags: string[];
}): Promise<void> {
  const { key, contactId } = opts;
  const tags = (opts.tags || []).filter(Boolean);
  if (!key || !contactId || !tags.length) return;

  try {
    const r = await fetch(`${GHL_BASE}/contacts/${contactId}/tags`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        Version: "2021-07-28",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ tags }),
    });
    if (!r.ok) {
      const txt = await r.text().catch(() => "");
      console.error("ghl-tags: add failed", r.status, txt.slice(0, 300));
    }
  } catch (e) {
    console.error("ghl-tags: add threw", e);
  }
}
