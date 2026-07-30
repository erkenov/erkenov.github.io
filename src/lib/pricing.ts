/**
 * Shared platform pricing constants (owner-decided pricing restructure,
 * 2026-07-30) — single source of truth for both erken.systems pricing
 * surfaces: the homepage pricing section (src/app/home-v8-draft/
 * HomeV8Client.tsx) and the actual signup flow (src/app/start/page.tsx).
 * Edit the numbers here once, both pages stay in sync.
 *
 * Three cards total:
 *   1. Platform — PLATFORM_BASE_MONTHLY/mo, with a billing-period selector.
 *      Each period only needs `perMonth` edited below — the billed total and
 *      the discount percentage shown next to it are DERIVED (see
 *      billingPeriodMath), so a price change can't drift out of sync with
 *      its own math.
 *   2. Complete system — COMPLETE_SYSTEM_PRICE/mo, closes on a call (no
 *      self-serve form), included list in COMPLETE_SYSTEM_FEATURES.
 *   3. Custom solutions — its own ask-flow, no pricing constant needed here.
 *
 * ⚠️ 2026-07-30: the 6-month ($87/mo) and yearly ($78/mo) numbers are
 * PLACEHOLDERS the coordinator picked as clean ~10%/~20% roundings off the
 * $97 monthly base — NOT owner-approved figures. Shamil: change `perMonth`
 * on the rows below to whatever you actually want to charge; the billed
 * total and the "save X%" copy on both pages recalculate automatically.
 */

export type BillingPeriodId = "monthly" | "6-months" | "yearly";

export const PLATFORM_BASE_MONTHLY = 97;

export const PLATFORM_BILLING_PERIODS: {
  id: BillingPeriodId;
  label: string;
  months: number;
  /** The only number to edit per row — everything else derives from it. */
  perMonth: number;
}[] = [
  { id: "monthly", label: "Monthly", months: 1, perMonth: 97 },
  { id: "6-months", label: "6 months", months: 6, perMonth: 87 },
  { id: "yearly", label: "Yearly", months: 12, perMonth: 78 },
];

/** Billed total for the period + the % discount off the monthly base. */
export function billingPeriodMath(period: (typeof PLATFORM_BILLING_PERIODS)[number]) {
  const billedTotal = period.perMonth * period.months;
  const discountPct = Math.round((1 - period.perMonth / PLATFORM_BASE_MONTHLY) * 100);
  return { billedTotal, discountPct };
}

/** Human "billed monthly" / "$522 billed every 6 months — save 10%" note. */
export function billingPeriodNote(period: (typeof PLATFORM_BILLING_PERIODS)[number]) {
  if (period.months === 1) return "billed monthly";
  const { billedTotal, discountPct } = billingPeriodMath(period);
  const cadence = period.months === 12 ? "yearly" : `every ${period.months} months`;
  return `$${billedTotal.toLocaleString()} billed ${cadence}${discountPct > 0 ? ` — save ${discountPct}%` : ""}`;
}

// Same platform at every billing period — the price difference is only the
// prepay term. Shared by the Platform card on both erken.systems (homepage
// pricing section) and /start (the actual signup flow).
export const PLATFORM_FEATURES = [
  "CRM + pipelines",
  "Calendars + booking",
  "Automations + follow-ups",
  "AI voice receptionist",
  "Reputation + review management",
  "Erken assistant included (beta)",
];

export const COMPLETE_SYSTEM_PRICE = 297;

// Compressed from the canonical capability list (vault/04-tools/
// platform-capability-list.md, approved 2026-07-29).
export const COMPLETE_SYSTEM_FEATURES = [
  "Professional website, built for you",
  "AI voice receptionist, answering 24/7",
  "Web chat agent on your site",
  "Missed-call text-back",
  "Booking calendar with reminders",
  "CRM pipeline + one unified inbox",
  "Automations bundle (reminders, no-show recovery, nurture, reviews, reactivation)",
  "Google review collection",
  "Invoicing + reporting dashboard",
  "Mobile app",
];

// Owner addition, 2026-07-30: a prepay perk on the Complete-system card
// only. Kept as facts + one computed total (not hand-typed) so the prepay
// total can't drift if COMPLETE_SYSTEM_PRICE ever changes.
export const COMPLETE_SYSTEM_PREPAY_MONTHS = 3;
export const COMPLETE_SYSTEM_PREPAY_TOTAL = COMPLETE_SYSTEM_PRICE * COMPLETE_SYSTEM_PREPAY_MONTHS; // $891
export const COMPLETE_SYSTEM_PREPAY_PERK = "Google Business Profile optimization";
export const COMPLETE_SYSTEM_PREPAY_PERK_VALUE = 300;
