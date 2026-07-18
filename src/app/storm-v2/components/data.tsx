/**
 * All SRH copy + demo data in one place.
 *
 * ⚠ DEMO CLIENT — Storm Roofing Heroes is a fictional Dallas roofing company
 * used to demo this landing-page + CRM snapshot. Every number, event, and
 * name below is plausible-but-invented placeholder data, sized deliberately
 * modest (neighborhood-scale, not stadium-scale). Replace with the real
 * client's verified numbers before any production use.
 */

export type PropertyType = "residential" | "commercial";

export const PHONE_DISPLAY = "(325) 241-2460";
export const PHONE_TEL = "+13252412460";

/* Credibility wall — hard-proof checklist */
export const PROOF_POINTS = [
  "500+ roofs restored across DFW since 2016",
  "5.0 rating across 51 Google reviews",
  "3-year workmanship warranty on every job",
  "35+ years of combined insurance-claim experience",
  "24/7 storm response line — a crew, not a call center",
  "Licensed and insured in the State of Texas",
];

/* Six service cards — KPost's grid, SRH's offerings */
export const SERVICES: { icon: string; title: string; line: string }[] = [
  {
    icon: "house",
    title: "Residential Roof Replacement",
    line: "Full tear-off and re-roof — shingle, metal, or tile — finished in days, not weeks.",
  },
  {
    icon: "wrench",
    title: "Emergency Roof Repair",
    line: "Tarp-out and leak stop within hours, so one storm doesn't become a ceiling repair.",
  },
  {
    icon: "hail",
    title: "Storm & Hail Restoration",
    line: "Free inspection after every hail line — we document damage the adjuster can't argue with.",
  },
  {
    icon: "doc",
    title: "Insurance Claim Support",
    line: "We meet your adjuster on the roof and speak their language. You pay your deductible, period.",
  },
  {
    icon: "warehouse",
    title: "Commercial Roofing",
    line: "TPO, modified bitumen, and metal for retail, office, and light industrial — minimal downtime.",
  },
  {
    icon: "calendar",
    title: "Maintenance Plans",
    line: "Twice-a-year inspections that catch $200 problems before they become $20,000 ones.",
  },
];

/* Territory band */
export const CITIES = [
  "Dallas",
  "Fort Worth",
  "Plano",
  "Frisco",
  "McKinney",
  "Arlington",
  "Irving",
  "Richardson",
  "Garland",
  "Denton",
];

export const PROPERTY_TYPES_SERVED = [
  "Single-family homes",
  "Townhomes & HOAs",
  "Retail & office",
  "Warehouses & light industrial",
  "Churches & schools",
  "Multifamily",
];

/* Story section — SRH-scale proof (neighborhood-scale, not stadium-scale) */
export const STORM_RECORD = [
  {
    stat: "63 roofs",
    label: "inspected in 10 days after the May 2024 Richardson hail line",
  },
  {
    stat: "48 hours",
    label: "longest any tarp-out waited during the 2023 Fort Worth wind event",
  },
  {
    stat: "14 roofs",
    label: "on a single street in Lake Highlands — neighbors talk when the work holds up",
  },
];

/* Form option lists */
export const HELP_OPTIONS = [
  "Roof replacement",
  "Roof repair / leak",
  "Storm or hail damage",
  "Insurance claim help",
  "Commercial roofing",
  "Maintenance plan",
  "Something else",
];

export const HEARD_OPTIONS = [
  "Google search",
  "Referral from a neighbor or friend",
  "Saw our yard sign or truck",
  "Facebook / Instagram",
  "Door hanger",
  "Other",
];
