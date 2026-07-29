"use client";

/**
 * EverythingIncluded — compact "Everything included" section rendered
 * inside every opened industry card, UNDER the existing five-step story
 * (IndustryBodySteps in SceneIndustriesCarousel.tsx). Approved by Shamil
 * 2026-07-29: the platform is the same behind every industry, so this is
 * one shared block, data-driven from src/data/platform-capabilities.ts —
 * never pasted per-card.
 *
 * Visual language matches the existing opened-card content exactly: same
 * mono-label kicker, text-muted body, hairline border-top divider, accent
 * bullet dots — no new surface/panel styles introduced. The automations
 * list is the one collapsible piece (named with the problem each solves),
 * collapsed by default to keep the section compact under an already-long
 * five-step story.
 */

import { useState } from "react";
import { IconChevronDown } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { CAPABILITY_GROUPS, AUTOMATIONS } from "@/data/platform-capabilities";

export function EverythingIncluded() {
  const [automationsOpen, setAutomationsOpen] = useState(false);

  return (
    <div className="mt-8 pt-8 border-t border-text-muted/15">
      <div className="mono-label text-text-dim text-xs mb-1">Everything included</div>
      <p className="mt-1 mb-6 text-[15px] md:text-base text-text-muted leading-relaxed">
        Same platform behind every industry — nothing extra to buy, nothing extra to configure.
      </p>

      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        {CAPABILITY_GROUPS.map((group) => (
          <div key={group.label}>
            <h5
              className="text-sm font-semibold text-text mb-2"
              style={{ letterSpacing: "-0.01em" }}
            >
              {group.label}
            </h5>
            <ul className="space-y-1.5">
              {group.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-[14px] text-text-muted leading-relaxed">
                  <span className="mt-[7px] inline-block h-1 w-1 shrink-0 rounded-full bg-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* Automations sub-list nests under "Growing without effort" —
                its own expandable/collapsible block, each automation named
                with the problem it solves. */}
            {group.label === "Growing without effort" && (
              <div className="mt-3 rounded-xl border border-text-muted/15">
                <button
                  type="button"
                  onClick={() => setAutomationsOpen((open) => !open)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                  aria-expanded={automationsOpen}
                >
                  <span className="text-[14px] font-semibold text-text">
                    Automations ({AUTOMATIONS.length})
                  </span>
                  <IconChevronDown
                    size={16}
                    stroke={2}
                    className={cn(
                      "text-text-dim shrink-0 transition-transform duration-200",
                      automationsOpen && "rotate-180",
                    )}
                  />
                </button>
                {automationsOpen && (
                  <ul className="space-y-3 px-4 pb-4">
                    {AUTOMATIONS.map((a) => (
                      <li key={a.name} className="flex items-start gap-2 text-[14px] leading-relaxed">
                        <span className="mt-[7px] inline-block h-1 w-1 shrink-0 rounded-full bg-accent" />
                        <span>
                          <span className="font-medium text-text">{a.name}</span>
                          <span className="text-text-muted"> — {a.problem}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
