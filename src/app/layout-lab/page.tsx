import type { Metadata } from "next";
import { Check, Play } from "lucide-react";

/**
 * /layout-lab — HIDDEN draft (Shamil 2026-09-29, second attempt): ONE
 * restrained What-you-get layout for visual review — problems LEFT ·
 * portrait video CENTER · solutions RIGHT, in the quiet About-Us-template
 * register he pointed at (the first 3-column attempt died of density —
 * reverted in d5b54c6). Restraint rules: no column sub-headings, quiet
 * small-type items, 4 solutions max, one muted line each, generous
 * whitespace, one accent color (sage), nothing but the section header +
 * the three columns.
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

/* Problems column = the reference's stat pattern (Shamil 2026-09-29):
   a BIG standout token in the title typeface + a 2–5-word muted label,
   big vertical gaps — no sentences. */
const PROBLEM_STATS = [
  { big: "First 3", label: "names on Google get the call" },
  { big: "40+", label: "directories show your old number" },
  { big: "0", label: "warnings when a customer hits your dead line" },
];

const SOLUTIONS = [
  "Google Business Profile, set up and managed",
  "Your info correct on 40+ directories, always",
  "Google & Meta ads bringing searchers to you",
  "A free online course that turns visitors into leads",
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

export default function LayoutLabPage() {
  return (
    <main>
      <p className="pt-10 text-center font-mono text-xs uppercase tracking-[0.18em] text-text-dim">
        Layout lab — draft, not linked anywhere
      </p>
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="mono-label">What you get — 1</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance text-accent sm:text-4xl md:text-5xl">
              Lead generation
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-text-muted">
              When locals search for what you do, your business is the one
              they find.
            </p>
          </div>
          <div className="mt-20 grid items-start gap-16 md:mt-24 md:grid-cols-[1fr_minmax(0,330px)_1fr] md:gap-14">
            {/* Problems — the reference stat pattern: BIG token in the
                title typeface + tiny muted label, huge gaps. No heading. */}
            <ul className="space-y-14 md:pt-4">
              {PROBLEM_STATS.map((p) => (
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
              {SOLUTIONS.map((s) => (
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
    </main>
  );
}
