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
  solutions?: { lead: string; text: string }[];
  /** Two quiet sub-groups with tiny muted uppercase labels (Lead
      management's 14 items — Shamil 2026-09-29). */
  solutionGroups?: { label: string; items: { lead: string; text: string }[] }[];
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
      {
        lead: "Google Business Profile, set up and managed",
        text: "The map pack is the biggest free source of local customers — we claim it, optimize it, keep it alive.",
      },
      {
        lead: "Your info correct on 40+ directories",
        text: "Name, address, phone, hours — synced everywhere and kept correct. No more dead old numbers.",
      },
      {
        lead: "Google Ads",
        text: "First position when someone nearby searches for exactly what you do.",
      },
      {
        lead: "Facebook & Instagram ads",
        text: "Lead forms that sync straight into your CRM — nothing gets lost.",
      },
      {
        lead: "A free online course as a magnet",
        text: "Visitors start learning in the browser — and starting with you makes continuing with you the natural choice.",
      },
      {
        lead: "QR codes on every surface",
        text: "Trucks, business cards, flyers, posters — every physical thing becomes a lead channel.",
      },
      {
        lead: "SEO foundations",
        text: "The slow, long game — we set it up right from day one so it compounds.",
      },
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
      {
        lead: "A website and funnels built to capture",
        text: "Every page turns visitors into contacts, not just a pretty brochure.",
      },
      {
        lead: "Web chat on your site",
        text: "Visitors ask, you answer — or the auto-reply does.",
      },
      {
        lead: "Missed-call text-back, instant",
        text: "Can't pick up — the caller gets a text in seconds, before they dial a competitor.",
      },
      {
        lead: "AI receptionist answering 24/7",
        text: "Every call answered, day and night, booked straight into your calendar.",
      },
      {
        lead: "Social DMs in one inbox",
        text: "Facebook and Instagram messages land in one place, with auto-replies.",
      },
      {
        lead: "Free course sign-up",
        text: "They register for the free course — and you have the contact.",
      },
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
    solutionGroups: [
      {
        label: "Win them over",
        items: [
          {
            lead: "Every inquiry answered in under a minute",
            text: "Speed wins — the first business to respond usually gets the customer.",
          },
          {
            lead: "Quotes followed up until a yes or no",
            text: "No estimate dies forgotten — the system chases it politely to an answer.",
          },
          {
            lead: "Nurture sequences",
            text: "The not-yet-ready get convincing follow-up until they are.",
          },
          {
            lead: "Appointment reminders",
            text: "No-shows drop hard with two timed texts.",
          },
          {
            lead: "No-show rebooking",
            text: "They miss it — a new slot is offered automatically.",
          },
        ],
      },
      {
        label: "Keep them",
        items: [
          {
            lead: "Post-service check-ins",
            text: "A timed, personal-feeling touch after the job.",
          },
          {
            lead: "Loyalty system",
            text: "Bonuses and benefits that grow the more they use you.",
          },
          {
            lead: "Win-back texts",
            text: "Customers who go quiet get the right nudge at the right moment.",
          },
          {
            lead: "Open-slot alerts",
            text: "A canceled slot goes out to the list — first reply takes it.",
          },
          {
            lead: "Mass reschedule",
            text: "Weather or sick days — new slots offered in one blast.",
          },
          {
            lead: "A private community",
            text: "Your customers keep each other engaged between visits.",
          },
          {
            lead: "Milestone touches",
            text: "Birthdays, anniversaries, key dates — remembered automatically.",
          },
          {
            lead: "Memberships & paid courses",
            text: "Continuous service, recurring revenue.",
          },
          {
            lead: "Text-to-pay",
            text: "The invoice arrives by SMS; paying takes a minute.",
          },
        ],
      },
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
      {
        lead: "Review requests timed to the happy moment",
        text: "Asked right after the win — feeding your Google ranking.",
      },
      {
        lead: "You get pinged, you reply personally",
        text: "The moment a review lands, you know. Your personal reply is the marketing.",
      },
      {
        lead: "Referral asks, automatic",
        text: "Sent at the high moment, without you remembering.",
      },
      {
        lead: "Referral rewards tied to loyalty",
        text: "The referrer gets a bonus automatically — and a referral is a ready-made new lead.",
      },
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
      {
        lead: "One dashboard — calls, leads, reviews",
        text: "Everything the system did, visible at a glance.",
      },
      {
        lead: "Call logs and recordings",
        text: "Every call saved — hear what your customers actually ask for.",
      },
      {
        lead: "Which channel produces customers",
        text: "See what actually pays; stop funding what doesn't.",
      },
      {
        lead: "A monthly picture of what's working",
        text: "Numbers you can act on, not vanity charts.",
      },
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
          {/* Solutions — the {lead, text} pattern back (Shamil 2026-09-29),
              but kept QUIET: small semibold lead + a tiny muted one-sentence
              explanation under it, generous gaps. No heading. Long lists
              (Lead management's 14) split into sub-groups under tiny muted
              uppercase labels, slightly tighter gaps inside a group. */}
          <div className="space-y-8 md:pt-2">
            {(section.solutionGroups ?? [
              { label: null, items: section.solutions ?? [] },
            ]).map((g) => (
              <div key={g.label ?? "all"}>
                {g.label && (
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-text-dim">
                    {g.label}
                  </p>
                )}
                <ul className={`space-y-6 ${g.label ? "mt-4" : ""}`}>
                  {g.items.map((s) => (
                    <li key={s.lead} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-text">{s.lead}</p>
                        <p className="mt-1 text-xs leading-relaxed text-text-muted">
                          {s.text}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
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
