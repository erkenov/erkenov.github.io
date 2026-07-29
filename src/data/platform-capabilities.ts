/**
 * Platform capability list — canonical, same for every industry.
 *
 * Source of truth: vault/04-tools/platform-capability-list.md (approved by
 * Shamil 2026-07-29). Feeds the "Everything included" section rendered
 * inside every opened industry card on the homepage carousel, under the
 * existing five-step story. Single shared data source so the content is
 * never pasted per-industry — the platform is the same behind every card.
 */

export type CapabilityGroup = {
  label: string;
  items: string[];
};

export const CAPABILITY_GROUPS: CapabilityGroup[] = [
  {
    label: "Getting found",
    items: [
      "Professional website, built for you",
      "Google Business Profile — set up and managed, so you show up on Maps",
      "Automated review requests after every job",
    ],
  },
  {
    label: "Never missing a lead",
    items: [
      "AI voice receptionist, answering 24/7",
      "Web chat agent on the site",
      "Missed-call text-back — an unanswered ring becomes a conversation",
      "Speed-to-lead — form fills answered in seconds, not hours",
    ],
  },
  {
    label: "Running the business",
    items: [
      "Online booking calendar with reminders — cuts no-shows",
      "CRM pipeline — every lead in a stage, none forgotten",
      "One inbox for calls, texts, email, Facebook/Instagram, Google, and web chat",
    ],
  },
  {
    label: "Growing without effort",
    items: ["Email + SMS campaigns for offers"],
  },
  {
    label: "Money & visibility",
    items: [
      "Invoicing + text-to-pay — get paid faster",
      "Reporting dashboard — calls answered, leads, bookings",
      "Mobile app — run it all from your pocket",
    ],
  },
];

export type Automation = {
  /** What the automation is called. */
  name: string;
  /** The problem it solves, stated plainly. */
  problem: string;
};

/** Rendered as its own expandable sub-list under "Growing without effort" —
 *  each automation named together with the problem it solves. */
export const AUTOMATIONS: Automation[] = [
  { name: "Appointment reminders", problem: "cuts no-shows" },
  { name: "No-show recovery", problem: "rebooks lost appointments" },
  { name: "Lead nurture sequences", problem: "warms cold leads automatically" },
  { name: "Review requests", problem: "grows your reputation on autopilot" },
  {
    name: "Database reactivation",
    problem:
      "texts your old customer list awake — costs nothing, books real jobs (the sleeper hit)",
  },
];
