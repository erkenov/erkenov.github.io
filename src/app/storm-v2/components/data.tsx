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

/* Six service cards — KPost's grid, SRH's offerings.
   Photos: Unsplash license (free commercial use, no attribution required),
   downloaded to /public/storm-v2/. Source photo ids for traceability:
   residential 1566071634551-224a639a1c7d · repair 1635424825057-7fb6dcd651ef ·
   storm 1488226941561-6d7a806ae42a · insurance 1450101499163-c8848c66ca85 ·
   commercial 1602193458517-db6caca8f1fe · maintenance 1744044155829-610dded4cead ·
   storm-band 1527519717877-1811d652ef60 */
export const SERVICES: { photo: string; alt: string; title: string; line: string }[] = [
  {
    photo: "/storm-v2/residential.jpg",
    alt: "Shingle roof of a family home in afternoon light",
    title: "Residential Roof Replacement",
    line: "Full tear-off and re-roof — shingle, metal, or tile — finished in days, not weeks.",
  },
  {
    photo: "/storm-v2/repair.jpg",
    alt: "Roofer in safety harness fastening shingles on a pitched roof",
    title: "Emergency Roof Repair",
    line: "Tarp-out and leak stop within hours, so one storm doesn't become a ceiling repair.",
  },
  {
    photo: "/storm-v2/storm.jpg",
    alt: "Dark storm front rolling over a lit building at dusk",
    title: "Storm & Hail Restoration",
    line: "Free inspection after every hail line — we document damage the adjuster can't argue with.",
  },
  {
    photo: "/storm-v2/insurance.jpg",
    alt: "Homeowner signing insurance claim paperwork with a pen",
    title: "Insurance Claim Support",
    line: "We meet your adjuster on the roof and speak their language. You pay your deductible, period.",
  },
  {
    photo: "/storm-v2/commercial.jpg",
    alt: "Standing-seam metal roof of a commercial building under clouds",
    title: "Commercial Roofing",
    line: "TPO, modified bitumen, and metal for retail, office, and light industrial — minimal downtime.",
  },
  {
    photo: "/storm-v2/maintenance.jpg",
    alt: "Close-up of a clogged gutter line against a blue sky",
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
