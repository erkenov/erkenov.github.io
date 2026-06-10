import { NextResponse } from "next/server";

/**
 * GET /api/balance?locationId=...
 *
 * Powers the client Balance dashboard (embedded in GoHighLevel as a Custom
 * Menu Link). Two data sources, both with safe fallbacks so the page never
 * hard-fails:
 *
 *   1. LEDGER (prepaid top-ups + usage drawdowns) — a Google Sheet the agency
 *      publishes to the web as CSV (env BALANCE_SHEET_CSV_URL). Columns:
 *        date, locationId, type (topup|usage|adjust), amount, note
 *      Balance = sum(topup) + sum(adjust) − sum(usage).  No auth (published CSV).
 *
 *   2. LIVE ACTIVITY — pulled live from the client's own GoHighLevel sub-account
 *      via the API (GHL_API_KEY), proving the dashboard is wired to their real
 *      platform. v1 returns conversation count for the current month; v2 will
 *      compute billable minutes from call records and auto-deduct from balance.
 *
 * Never throws to the client — every branch returns JSON.
 */

const GHL_BASE = "https://services.leadconnectorhq.com";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

type LedgerRow = { date: string; type: string; amount: number; note: string };

function parseCsv(text: string): string[][] {
  // Minimal CSV parser (handles quoted fields + commas inside quotes).
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (c === "\r") { /* ignore */ }
    else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

/**
 * Locations allowed to use this dashboard. The locationId rides in a public
 * iframe URL, so without this check anyone could read any client's data with
 * the agency's master key (IDOR). Comma-separated env BALANCE_ALLOWED_LOCATIONS,
 * falling back to the agency's own GHL_LOCATION_ID. Empty allowlist = fail closed.
 */
function allowedLocations(): Set<string> {
  const raw = process.env.BALANCE_ALLOWED_LOCATIONS || process.env.GHL_LOCATION_ID || "";
  return new Set(raw.split(",").map((s) => s.trim()).filter(Boolean));
}

async function loadLedger(locationId: string, singleTenant: boolean): Promise<LedgerRow[] | null> {
  const url = process.env.BALANCE_SHEET_CSV_URL;
  if (!url) return null;
  try {
    const r = await fetch(url, { headers: { "User-Agent": UA }, cache: "no-store" });
    if (!r.ok) return null;
    const rows = parseCsv(await r.text());
    if (rows.length < 2) return [];
    const header = rows[0].map((h) => h.trim().toLowerCase());
    const idx = (name: string) => header.indexOf(name);
    const iDate = idx("date"), iLoc = idx("locationid"), iType = idx("type");
    const iAmt = idx("amount"), iNote = idx("note");
    // A sheet without a locationId column can't scope rows per client — only
    // safe while there's a single allowed location (fail closed otherwise).
    if (iLoc < 0 && !singleTenant) return [];
    return rows.slice(1)
      .filter((r) => r.length > 1)
      .filter((r) => iLoc < 0 || (r[iLoc] || "").trim() === locationId)
      .map((r) => ({
        date: (r[iDate] || "").trim(),
        type: (r[iType] || "").trim().toLowerCase(),
        amount: parseFloat((r[iAmt] || "0").replace(/[^0-9.\-]/g, "")) || 0,
        note: (r[iNote] || "").trim(),
      }));
  } catch {
    return null;
  }
}

async function liveActivity(locationId: string): Promise<{ conversations: number } | null> {
  const key = process.env.GHL_API_KEY;
  if (!key || !locationId) return null;
  try {
    const r = await fetch(
      `${GHL_BASE}/conversations/search?locationId=${encodeURIComponent(locationId)}&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${key}`,
          Version: "2021-07-28",
          Accept: "application/json",
          "User-Agent": UA,
        },
        cache: "no-store",
      },
    );
    if (!r.ok) return null;
    const d = await r.json();
    return { conversations: typeof d.total === "number" ? d.total : 0 };
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const locationId = searchParams.get("locationId") || process.env.GHL_LOCATION_ID || "";

  const allowed = allowedLocations();
  if (!allowed.has(locationId)) {
    return NextResponse.json({ error: "unknown location" }, { status: 403 });
  }

  const [ledger, activity] = await Promise.all([
    loadLedger(locationId, allowed.size === 1),
    liveActivity(locationId),
  ]);

  const rows = ledger ?? [];
  const sum = (t: string) => rows.filter((r) => r.type === t).reduce((a, r) => a + r.amount, 0);
  const toppedUp = sum("topup") + sum("adjust");
  const used = sum("usage");
  const remaining = toppedUp - used;

  return NextResponse.json({
    locationId,
    currency: "USD",
    configured: ledger !== null,        // false → no sheet wired yet
    toppedUp,
    used,
    remaining,
    ledger: rows.slice(-12).reverse(),  // most recent first, capped
    liveActivity: activity,             // null if GHL unreachable
    connected: activity !== null,       // true → live-wired to the GHL account
    rates: {
      voicePerMin: Number(process.env.BALANCE_RATE_VOICE_MIN ?? 0.15),
      smsEach: Number(process.env.BALANCE_RATE_SMS ?? 0.03),
    },
  });
}
