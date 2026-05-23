"use client";

/**
 * Scene4CrmTabs — animated tabs picker for the Lead Management scene.
 *
 * Three tabs = the three CRM tiers Shamil offers: Google Sheets, GoHighLevel,
 * and the Erken Systems platform (white-label GHL).
 *
 * Each tab body is a placeholder card for now — to be replaced with real
 * CRM mockups (screenshots of pipeline view, contact list, etc.) once
 * those are produced.
 */

import { Tabs } from "@/components/ui/tabs";

type TierContent = {
  title: string;
  value: string;
  content: React.ReactNode;
};

function TierPanel({
  bg,
  label,
  tagline,
  bullets,
}: {
  bg: string;
  label: string;
  tagline: string;
  bullets: string[];
}) {
  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-2xl p-8 md:p-12"
      style={{ background: bg }}
    >
      <div className="mono-label text-text-dim">{label}</div>
      <h3 className="mt-3 text-2xl md:text-4xl font-bold tracking-tight text-text" style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}>
        {tagline}
      </h3>
      <ul className="mt-6 space-y-2 text-base md:text-lg text-text-muted">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2">
            <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-accent" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const TIERS: TierContent[] = [
  {
    title: "Erken Systems platform",
    value: "erken",
    content: (
      <TierPanel
        bg="#EDE6D2"
        label="Branded · all-in-one"
        tagline="Erken Systems platform — branded, pre-configured, fully managed."
        bullets={[
          "Same engine under the hood, but pre-tuned for the four-step pipeline",
          "C R M, calendar, email, S M S, follow-up workflows — all in one branded login",
          "Setup is included in the build; you don't see GoHighLevel anywhere",
          "Best for: clients who want it to just work without learning a CRM",
        ]}
      />
    ),
  },
  {
    title: "GoHighLevel",
    value: "ghl",
    content: (
      <TierPanel
        bg="#F0EBDC"
        label="Industry standard"
        tagline="GoHighLevel — full agency CRM, you sign up directly."
        bullets={[
          "Pipelines, tags, calendars, SMS, email, funnels — all in one tool",
          "You own the account and the data. I configure it; you keep the keys.",
          "Native integrations with Retell, Zapier, Stripe — wire any tool you use",
          "Best for: businesses that want a known-quantity platform with a million tutorials",
        ]}
      />
    ),
  },
  {
    title: "Google Sheets",
    value: "sheets",
    content: (
      <TierPanel
        bg="#D8E1D0"
        label="Lean · no lock-in"
        tagline="Google Sheets — fast, free, no platform lock-in."
        bullets={[
          "Lead in, lead out — one source of truth in a spreadsheet you already understand",
          "Apps Script glue connects to your forms, voice calls, email — no separate tool to learn",
          "Cheapest path to a working pipeline. Upgrade later if you need more.",
          "Best for: solo operators, side-businesses, MVP stage",
        ]}
      />
    ),
  },
];

export function Scene4CrmTabs() {
  return (
    <div className="relative h-[28rem] w-full md:h-[34rem]">
      <Tabs
        tabs={TIERS}
        containerClassName="mb-4 justify-center"
        contentClassName="h-[24rem] md:h-[30rem]"
      />
    </div>
  );
}
