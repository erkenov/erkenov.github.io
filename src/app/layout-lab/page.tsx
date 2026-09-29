import type { Metadata } from "next";
import { Check, Play } from "lucide-react";

/**
 * /layout-lab — HIDDEN draft (Shamil 2026-09-29): a visual comparison page
 * for a proposed What-you-get section layout — three columns on desktop
 * (problems | portrait video | solutions), stacking left → video → right
 * on mobile. Two stacked variants with IDENTICAL Lead-generation content,
 * differing only in which side the problems column sits on.
 *
 * Purely additive: no existing page/component/section is touched or
 * imported — the VideoSlot look and the {lead, text} bullet style are
 * re-created here from the same design tokens (globals.css) so this lab
 * can never break the live sections.
 *
 * noindex: review draft, not linked anywhere, not meant to be crawled.
 */
export const metadata: Metadata = {
  title: "Erken Systems — Layout Lab (Internal Draft)",
  description:
    "Draft layout comparison for the What-you-get sections. Not the live site.",
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

const PROBLEMS = [
  {
    big: "The first few names",
    caption:
      "Most people pick from the first few results they see. If you're not on that shortlist, the search never reaches you.",
  },
  {
    big: "A dead phone number",
    caption:
      "Directories show your old number. Customers call it, think you're closed, dial a competitor — and you never find out.",
  },
  {
    big: "Competitors on top",
    caption:
      "When locals search for exactly what you do, someone else's ad sits above your name.",
  },
];

/* Same content as SECTIONS["lead-generation"] in
   src/components/ProductSections.tsx, shortened to lead + one sentence. */
const SOLUTIONS = [
  {
    lead: "Google Business Profile, set up and managed.",
    text: "The map pack at the top of local search is the biggest free lead channel you have — claimed, filled out, kept active.",
  },
  {
    lead: "Your details correct everywhere.",
    text: "Name, address, phone, and hours synced to 40+ directories like Yelp, Bing, and Apple Maps — no customer ever calls a dead old number.",
  },
  {
    lead: "First position on Google.",
    text: "When someone searches exactly what you do, your ad is the first thing they see.",
  },
  {
    lead: "Facebook & Instagram ads.",
    text: "Lead forms send every inquiry straight into your CRM the moment it's filled out.",
  },
  {
    lead: "A free course as a magnet.",
    text: "Visitors start learning in the browser — starting with you makes continuing with you the natural choice.",
  },
  {
    lead: "QR codes in the physical world.",
    text: "Trucks, cards, flyers, posters — one scan takes a stranger straight into your funnel.",
  },
];

/** Portrait variant of ProductSections' VideoSlot look (light theme):
    same border/gradient/amber-play/mono-label treatment, ~3/4 aspect. */
function PortraitVideoSlot() {
  return (
    <div className="group relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-surface to-surface-2">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-amber-400/40 bg-amber-400/10 transition group-hover:bg-amber-400/20">
          <Play className="h-6 w-6 fill-amber-400 text-amber-400" />
        </div>
        <p className="text-center font-mono text-xs tracking-[0.18em] uppercase text-text-muted">
          Video coming — Shamil walks through a real lead-generation setup
        </p>
      </div>
    </div>
  );
}

function ProblemsColumn() {
  return (
    <div>
      <h3 className="text-lg font-semibold tracking-tight text-text">
        What it costs you
      </h3>
      <ul className="mt-6 space-y-8">
        {PROBLEMS.map((p) => (
          <li key={p.big}>
            <p className="text-2xl font-semibold tracking-tight text-[var(--clay)]">
              {p.big}
            </p>
            <p className="mt-2 leading-relaxed text-text-muted">{p.caption}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SolutionsColumn() {
  return (
    <div>
      <h3 className="text-lg font-semibold tracking-tight text-text">
        What we set up for you
      </h3>
      <ul className="mt-6 space-y-6">
        {SOLUTIONS.map((b) => (
          <li key={b.lead} className="flex items-start gap-3">
            <Check className="mt-1 h-5 w-5 shrink-0 text-amber-700" />
            <div className="flex-1">
              <p className="text-lg font-semibold text-amber-700">{b.lead}</p>
              <p className="mt-1.5 leading-relaxed text-text-muted">{b.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MockSection({
  label,
  problemsFirst,
}: {
  label: string;
  problemsFirst: boolean;
}) {
  /* Column order is the ONLY difference between the two variants. The DOM
     order is also the mobile stacking order: left column → video → right
     column. */
  const left = problemsFirst ? <ProblemsColumn /> : <SolutionsColumn />;
  const right = problemsFirst ? <SolutionsColumn /> : <ProblemsColumn />;
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <p className="mono-label text-xs">{label}</p>
        <div className="mt-6 text-center">
          <p className="mono-label">What you get — 1</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance text-accent sm:text-4xl md:text-5xl">
            Lead generation
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-text-muted md:text-lg">
            When locals search for what you do, your business is the one they
            find — on Google, on maps, and everywhere else they look.
          </p>
        </div>
        <div className="mt-16 grid items-start gap-12 md:grid-cols-[1fr_minmax(0,280px)_1fr] md:gap-10">
          <div>{left}</div>
          <div className="mx-auto w-full max-w-xs md:max-w-none">
            <PortraitVideoSlot />
          </div>
          <div>{right}</div>
        </div>
      </div>
    </section>
  );
}

export default function LayoutLabPage() {
  return (
    <main>
      <p className="pt-8 text-center font-mono text-xs uppercase tracking-[0.18em] text-text-dim">
        Layout lab — draft, not linked anywhere
      </p>
      <MockSection
        label="Variant 1 — Problems left · Solutions right"
        problemsFirst={true}
      />
      <div className="mx-auto max-w-6xl px-6">
        <div className="border-t border-border/60" />
      </div>
      <MockSection
        label="Variant 2 — Solutions left · Problems right"
        problemsFirst={false}
      />
    </main>
  );
}
