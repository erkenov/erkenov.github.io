import type { Metadata } from "next";
import { Check, Play } from "lucide-react";

/**
 * /layout-lab — HIDDEN draft (Shamil 2026-09-29): all FIVE What-you-get
 * sections in the approved restrained layout ("definitely way better") —
 * 3 stat problems LEFT · portrait video CENTER · 4 quiet check-items
 * RIGHT — stacked so he can refresh and scroll through them. Data-driven:
 * one sections array, one visual component, no copy-pasted layouts.
 *
 * Restraint rules (the first 3-column attempt died of density — reverted
 * in d5b54c6): no column sub-headings, big stat token + 2–5-word muted
 * label, one muted line per solution, generous whitespace, one accent
 * color (sage), no sectionLoss strips, no badges, no buttons. Video
 * captions are just "Video coming" (Shamil flagged the wordy one).
 *
 * Purely additive: no existing page/component/section is touched or
 * imported — the VideoSlot look is re-created from the same design tokens
 * so this lab can never break the live sections.
 *
 * noindex: review draft, not linked anywhere, not meant to be crawled.
 */
export const metadata: Metadata = {
  title: "Erken Systems — Layout Lab (Internal Draft)",
  description:
    "Draft layout for the What-you-get sections. Not the live site.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

type LabSection = {
  title: string;
  framing: string;
  stats: { big: string; label: string }[];
  solutions: string[];
};

const LAB_SECTIONS: LabSection[] = [
  {
    title: "Lead generation",
    framing: "When locals search for what you do, your business is the one they find.",
    stats: [
      { big: "First 3", label: "names on Google get the call" },
      { big: "40+", label: "directories show your old number" },
      { big: "0", label: "warnings when a customer hits your dead line" },
    ],
    solutions: [
      "Google Business Profile, set up and managed",
      "Your info correct on 40+ directories, always",
      "Google & Meta ads bringing searchers to you",
      "A free online course that turns visitors into leads",
    ],
  },
  {
    title: "Lead capture",
    framing: "Every visitor, caller, and DM becomes a contact — before the moment cools.",
    stats: [
      { big: "8 of 10", label: "voicemail callers dial the next business" },
      { big: "5 min", label: "before a fresh inquiry goes cold" },
      { big: "24/7", label: "customers call on their schedule, not yours" },
    ],
    solutions: [
      "A website and funnels built to capture",
      "Missed-call text-back, instant",
      "AI receptionist answering 24/7",
      "Web chat and social DMs in one inbox",
    ],
  },
  {
    title: "Lead management",
    framing: "Every lead and every customer held — none of them slip away.",
    stats: [
      { big: "Most quotes", label: "die without a single follow-up" },
      { big: "No-shows", label: "paid hours left empty" },
      { big: "2 weeks", label: "of silence and a customer drifts away" },
    ],
    solutions: [
      "Every inquiry answered in under a minute",
      "Quotes followed up until a yes or no",
      "Reminders, rebooking, and open-slot alerts",
      "Loyalty, win-backs, and memberships",
    ],
  },
  {
    title: "Reviews & referrals",
    framing: "Happy customers produce the next ones.",
    stats: [
      { big: "Unhappy", label: "customers review on their own — happy ones don't" },
      { big: "1 ask", label: "at the right moment is all a referral takes" },
      { big: "No system", label: "happy customers, no new leads" },
    ],
    solutions: [
      "Review requests timed to the happy moment",
      "You get pinged, you reply personally",
      "Referral asks, automatic",
      "Referral rewards tied to loyalty",
    ],
  },
  {
    title: "See it working",
    framing: "The proof, on one screen.",
    stats: [
      { big: "Guessing", label: "is the default without numbers" },
      { big: "0", label: "idea which channel actually pays" },
      { big: "1 screen", label: "is all it takes to know" },
    ],
    solutions: [
      "One dashboard — calls, leads, reviews",
      "Call logs and recordings",
      "Which channel produces customers",
      "A monthly picture of what's working",
    ],
  },
];

/** Portrait variant of ProductSections' VideoSlot look (light theme):
    same border/gradient/amber-play treatment, ~3/4 aspect. Caption kept
    to just "Video coming" (Shamil 2026-09-29). */
function PortraitVideoSlot() {
  return (
    <div className="group relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-surface to-surface-2">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-amber-400/40 bg-amber-400/10 transition group-hover:bg-amber-400/20">
          <Play className="h-6 w-6 fill-amber-400 text-amber-400" />
        </div>
        <p className="text-center font-mono text-xs tracking-[0.18em] uppercase text-text-muted">
          Video coming
        </p>
      </div>
    </div>
  );
}

function LabSectionBlock({
  n,
  section,
}: {
  n: number;
  section: LabSection;
}) {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="mono-label">What you get — {n}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance text-accent sm:text-4xl md:text-5xl">
            {section.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-text-muted">
            {section.framing}
          </p>
        </div>
        <div className="mt-20 grid items-start gap-16 md:mt-24 md:grid-cols-[1fr_minmax(0,330px)_1fr] md:gap-14">
          {/* Problems — the reference stat pattern: BIG token in the
              title typeface + tiny muted label, huge gaps. No heading. */}
          <ul className="space-y-14 md:pt-4">
            {section.stats.map((p) => (
              <li key={p.big}>
                <p className="text-4xl font-semibold tracking-tight text-text md:text-5xl">
                  {p.big}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-text-muted">
                  {p.label}
                </p>
              </li>
            ))}
          </ul>
          {/* Center — the portrait video gets its room. */}
          <div className="mx-auto w-full max-w-[330px]">
            <PortraitVideoSlot />
          </div>
          {/* Solutions — quieter still: small check + ONE muted line
              per item, nothing else. */}
          <ul className="space-y-5 md:pt-2">
            {section.solutions.map((s) => (
              <li key={s} className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span className="text-sm leading-relaxed text-text-muted">
                  {s}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default function LayoutLabPage() {
  return (
    <main>
      <p className="pt-10 text-center font-mono text-xs uppercase tracking-[0.18em] text-text-dim">
        Layout lab — draft, not linked anywhere
      </p>
      {LAB_SECTIONS.map((s, i) => (
        <LabSectionBlock key={s.title} n={i + 1} section={s} />
      ))}
    </main>
  );
}
