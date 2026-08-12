/**
 * Shared platform pricing constants — single source of truth for the
 * erken.systems pricing surfaces: the homepage pricing section
 * (src/app/home-v8-draft/HomeV8Client.tsx), the signup flow
 * (src/app/start/page.tsx), and the /receptionist funnel. Edit the numbers
 * here once, every page stays in sync.
 *
 * Owner-approved pricing restructure, 2026-08-12: the "Complete system"
 * offer is REMOVED everywhere — and by a same-day addendum, the "Custom
 * solutions" card is removed everywhere too. What remains is exactly THREE
 * cards — the Platform as three separate billing-period cards:
 *   1. Monthly — $97/mo
 *   2. 6 months — $87/mo
 *   3. Yearly — $77/mo
 * (all owner-approved figures). Same PLATFORM_FEATURES on each card; they
 * differ only in price and the billing note. Only `perMonth` needs editing
 * per row — the billed total and the "save X%" copy are DERIVED (see
 * billingPeriodMath / billingPeriodNote), so a price change can't drift
 * out of sync with its own math.
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
  { id: "yearly", label: "Yearly", months: 12, perMonth: 77 },
];

/** Billed total for the period + the % discount off the monthly base. */
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
