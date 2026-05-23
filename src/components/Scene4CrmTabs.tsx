"use client";

/**
 * Scene4CrmTabs — animated tabs picker for the Lead Management scene.
 *
 * Three tabs = the three CRM tiers Shamil offers: Google Sheets,
 * GoHighLevel, and the Erken Systems platform (white-label GHL).
 *
 * Each tab now renders a live React mockup of its dashboard so the
 * viewer sees the platform, not just bullet text:
 *  - Google Sheets → Scene4SheetsMockup (fake spreadsheet pipeline)
 *  - GoHighLevel  → Scene4PipelineMockup brand="ghl" (fake kanban)
 *  - Erken Systems → Scene4PipelineMockup brand="erken" (same kanban,
 *    Erken logo in the chrome — visually communicates the "same engine,
 *    your brand" pitch)
 */

import { Tabs } from "@/components/ui/tabs";
import { Scene4SheetsMockup } from "@/components/Scene4SheetsMockup";
import { Scene4PipelineMockup } from "@/components/Scene4PipelineMockup";

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
  mockup,
}: {
  bg: string;
  label: string;
  tagline: string;
  bullets: string[];
  mockup: React.ReactNode;
}) {
  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-2xl p-6 md:p-8 grid grid-rows-[auto_1fr] gap-4"
      style={{ background: bg }}
    >
      {/* Header block: label + tagline */}
      <div>
        <div className="mono-label text-text-dim">{label}</div>
        <h3
          className="mt-2 text-xl md:text-2xl font-bold tracking-tight text-text"
          style={{ letterSpacing: "-0.025em", lineHeight: 1.15 }}
        >
          {tagline}
        </h3>
      </div>

      {/* Body: two-column on md+, mockup left, bullets right */}
      <div className="flex flex-col md:flex-row gap-5 md:gap-6 min-h-0">
        <div className="md:basis-[58%] flex items-center justify-center min-w-0">
          {mockup}
        </div>
        <ul className="md:basis-[42%] space-y-1.5 text-sm md:text-[15px] text-text-muted">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-2">
              <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-accent" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const TIERS: TierContent[] = [
  {
    title: "Erken Systems platform",
    value: "erken",
    content: (
      <TierPanel
        bg="#EFC7BC"
        label="Branded · all-in-one"
        tagline="Erken Systems platform — branded, pre-configured, fully managed."
        bullets={[
          "Pipelines, calendars, SMS, email, funnels — all in one branded login",
          "Set up and configured for your operation by the time you log in",
          "Native integrations with Retell, Zapier, Stripe — wire any tool you use",
          "All-in pricing — setup, software, and a year of platform access in one transparent fee",
          "Best for: businesses that want it to just work without learning a new platform",
        ]}
        mockup={<Scene4PipelineMockup brand="erken" />}
      />
    ),
  },
  {
    title: "GoHighLevel",
    value: "ghl",
    content: (
      <TierPanel
        bg="#F2D9A0"
        label="Industry standard"
        tagline="GoHighLevel — full agency CRM, you sign up directly."
        bullets={[
          "Pipelines, tags, calendars, SMS, email, funnels — all in one tool",
          "You own the account and the data. I configure it; you keep the keys.",
          "Native integrations with Retell, Zapier, Stripe — wire any tool you use",
          "Best for: businesses that want a known-quantity platform with a million tutorials",
        ]}
        mockup={<Scene4PipelineMockup brand="ghl" />}
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
        mockup={<Scene4SheetsMockup />}
      />
    ),
  },
];

export function Scene4CrmTabs() {
  return (
    <div className="relative h-[32rem] w-full md:h-[38rem]">
      <Tabs
        tabs={TIERS}
        containerClassName="mb-4 justify-center"
        contentClassName="h-[28rem] md:h-[34rem]"
      />
    </div>
  );
}
