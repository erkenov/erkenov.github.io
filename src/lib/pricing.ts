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
 * ⚠️ 2026-07-30: the Platform 6-month ($87/mo) and yearly ($78/mo) numbers
 * are PLACEHOLDERS the coordinator picked as clean ~10%/~20% roundings off
 * the $97 monthly base — NOT owner-approved figures. Same for the
 * Complete-system 6-month ($267/mo) and yearly ($237/mo) rows added
 * 2026-07-31 (same ~10%/~20% roundings off $297). Shamil: change `perMonth`
 * on the rows below to whatever you actually want to charge; the billed
 * total and the "save X%" copy on both pages recalculate automatically.
 */

export type BillingPeriodId = "monthly" | "6-months" | "yearly";

export type BillingPeriod = {
  id: BillingPeriodId;
  label: string;
  months: number;
  /** The only number to edit per row — everything else derives from it. */
  perMonth: number;
};

export const PLATFORM_BASE_MONTHLY = 97;

export const PLATFORM_BILLING_PERIODS: BillingPeriod[] = [
  { id: "monthly", label: "Monthly", months: 1, perMonth: 97 },
  { id: "6-months", label: "6 months", months: 6, perMonth: 87 },
  { id: "yearly", label: "Yearly", months: 12, perMonth: 78 },
];

/** Billed total for the period + the % discount off that card's monthly
 *  base. `baseMonthly` defaults to the Platform base so existing Platform
 *  call sites stay unchanged; the Complete-system card passes its own. */
export function billingPeriodMath(period: BillingPeriod, baseMonthly: number = PLATFORM_BASE_MONTHLY) {
  const billedTotal = period.perMonth * period.months;
  const discountPct = Math.round((1 - period.perMonth / baseMonthly) * 100);
  return { billedTotal, discountPct };
}

/** Human "billed monthly" / "$522 billed every 6 months — save 10%" note. */
export function billingPeriodNote(period: BillingPeriod, baseMonthly: number = PLATFORM_BASE_MONTHLY) {
  if (period.months === 1) return "billed monthly";
  const { billedTotal, discountPct } = billingPeriodMath(period, baseMonthly);
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

// Billing-period selector rows for the Complete-system card (owner ask,
// 2026-07-31 — "monthly, six months, and yearly, same as Platform").
// ⚠️ 6-month/yearly perMonth are coordinator placeholders (~10%/~20% off
// $297) — see the header warning; edit perMonth only, the rest derives.
export const COMPLETE_SYSTEM_BILLING_PERIODS: BillingPeriod[] = [
  { id: "monthly", label: "Monthly", months: 1, perMonth: COMPLETE_SYSTEM_PRICE },
  { id: "6-months", label: "6 months", months: 6, perMonth: 267 },
  { id: "yearly", label: "Yearly", months: 12, perMonth: 237 },
];

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
