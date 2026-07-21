/**
 * ghl-task.ts — create a GoHighLevel task on a contact, assigned to the
 * account owner (Shamil 2026-07-21, built for /api/feedback's kind="help"
 * requests — a human-help ask needs more than a Telegram ping that scrolls
 * away).
 *
 * Design mirrors ghl-opportunity.ts: resolve the owner by role at call time
 * instead of hardcoding a user id (env-overridable via GHL_OWNER_USER_ID for
 * when auto-resolution picks the wrong person), cached for the lifetime of
 * the serverless instance. Best-effort throughout — any failure is logged
 * and swallowed so a GHL hiccup never breaks the caller's request.
 */

const GHL_BASE = "https://services.leadconnectorhq.com";

type GhlUser = { id: string; roles?: { role?: string; type?: string } };

let cachedOwnerId: string | null | undefined; // undefined = not yet resolved this instance

async function resolveOwnerUserId(key: string, locationId: string): Promise<string | null> {
  const envOverride = (process.env.GHL_OWNER_USER_ID || "").trim();
  if (envOverride) return envOverride;
  if (cachedOwnerId !== undefined) return cachedOwnerId;

  try {
    const r = await fetch(`${GHL_BASE}/users/?locationId=${locationId}`, {
      headers: { Authorization: `Bearer ${key}`, Version: "2021-07-28", Accept: "application/json" },
    });
    if (!r.ok) {
      console.error("ghl-task: users fetch failed", r.status);
      cachedOwnerId = null;
      return null;
    }
    const d = (await r.json().catch(() => ({}))) as { users?: GhlUser[] };
    const users = d.users || [];
    // Prefer an account-level admin (the sub-account owner); fall back to
    // whoever's first rather than leaving the task unassigned.
    const owner =
      users.find((u) => u.roles?.role === "admin" && u.roles?.type === "account") ||
      users.find((u) => u.roles?.role === "admin") ||
      users[0];
    cachedOwnerId = owner?.id || null;
    return cachedOwnerId;
  } catch (e) {
    console.error("ghl-task: resolve owner failed", e);
    cachedOwnerId = null;
    return null;
  }
}

/**
 * Create a task on a contact, due same-day, assigned to the resolved
 * account owner (or unassigned if resolution fails — still visible on the
 * contact either way). No-op (logged) if creds/contactId missing.
 */
export async function createContactTask(opts: {
  key: string;
  locationId: string;
  contactId: string;
  title: string;
  dueDate?: string; // ISO 8601; defaults to right now (same calendar day)
}): Promise<void> {
  const { key, locationId, contactId, title } = opts;
  if (!key || !locationId || !contactId) return;

  const dueDate = opts.dueDate || new Date().toISOString();
  const assignedTo = await resolveOwnerUserId(key, locationId);

  try {
    const body: Record<string, unknown> = {
      title: title.slice(0, 200),
      dueDate,
      completed: false,
    };
    if (assignedTo) body.assignedTo = assignedTo;

    const r = await fetch(`${GHL_BASE}/contacts/${contactId}/tasks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        Version: "2021-07-28",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!r.ok) {
      const txt = await r.text().catch(() => "");
      console.error("ghl-task: create failed", r.status, txt.slice(0, 300));
    }
  } catch (e) {
    console.error("ghl-task: create threw", e);
  }
}
