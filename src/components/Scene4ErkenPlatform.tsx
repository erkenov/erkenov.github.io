"use client";

/**
 * Scene4ErkenPlatform — single-panel showcase of the Erken Systems
 * platform, replacing the old three-tier tabs (Erken / GoHighLevel /
 * Google Sheets).
 *
 * Pivot 2026-05-24 (Shamil): the website is now selling HIS platform,
 * not offering alternative CRM tiers. Other tools (HubSpot, Pipedrive,
 * GHL, Sheets) are referenced only as migration sources, not as choices.
 *
 * Layout: branded pipeline mockup on the left, value bullets on the
 * right, with a tagline at the top and a migration line at the bottom.
 */

import { Scene4PipelineMockup } from "@/components/Scene4PipelineMockup";

const BULLETS = [
  "Pipelines, calendars, SMS, email, funnels — all in one branded login",
  "Set up and configured for your operation by the time you log in",
  "Native integrations with Retell, Zapier, Stripe — wire any tool you use",
  "All-in pricing — setup, software, and a year of platform access in one transparent fee",
  "Built for businesses that want it to just work, no platform learning curve",
];

export function Scene4ErkenPlatform() {
  return (
    <div
      className="relative w-full rounded-2xl p-6 md:p-8 md:h-[38rem] md:overflow-hidden md:grid md:grid-rows-[auto_1fr_auto] gap-4"
      style={{ background: "#EFC7BC" }}
    >
      {/* Header — label + tagline */}
      <div>
        <div className="mono-label text-text-dim">Branded · all-in-one</div>
        <h3
          className="mt-2 text-xl md:text-2xl font-bold tracking-tight text-text"
          style={{ letterSpacing: "-0.025em", lineHeight: 1.15 }}
        >
          The Erken Systems platform — branded, pre-configured, fully managed.
        </h3>
      </div>

      {/* Body — mockup left, bullets right */}
      <div className="flex flex-col md:flex-row gap-5 md:gap-6 min-h-0">
        <div className="md:basis-[58%] flex items-center justify-center min-w-0">
          <Scene4PipelineMockup brand="erken" />
        </div>
        <ul className="md:basis-[42%] space-y-1.5 text-sm md:text-[15px] text-text-muted">
          {BULLETS.map((b) => (
            <li key={b} className="flex items-start gap-2">
              <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-accent" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer — migration callout (kept compact, single line) */}
      <div className="pt-3 border-t border-text-muted/15">
        <p className="text-xs md:text-sm text-text-muted/85">
          <span className="font-semibold">Already on HubSpot, Pipedrive, or GoHighLevel?</span>{" "}
          Same operator — I migrate your contacts, pipelines, and workflows over.
        </p>
      </div>
    </div>
  );
}
