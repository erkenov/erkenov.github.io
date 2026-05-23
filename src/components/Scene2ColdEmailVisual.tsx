"use client";

/**
 * Scene2ColdEmailVisual — "cold email at scale" card art for the Lead
 * Generation Apple Cards Carousel.
 *
 * Activity-feed style dashboard: campaign-wide counters at the top
 * (sent / opened / replied), then a live feed of recent events with
 * contact name, status pill, and a brief snippet — replies show the
 * actual reply text, opens show count, sends/delivers show queue
 * status. Dark cohesive aesthetic matching the other Scene 2 cards.
 */

import { motion } from "motion/react";

type ActivityKind = "REPLIED" | "OPENED" | "DELIVERED" | "SCHEDULED" | "UNSUB";

type ActivityRow = {
  kind: ActivityKind;
  name: string;
  business: string;
  detail: string;
  time: string;
};

const ACTIVITY: ActivityRow[] = [
  {
    kind: "REPLIED",
    name: "Maya",
    business: "Apex Auto",
    detail: '"Yeah, let\'s chat. What times next week?"',
    time: "12m",
  },
  {
    kind: "REPLIED",
    name: "Daniel",
    business: "Lonestar Auto",
    detail: '"Sure, send the demo link"',
    time: "34m",
  },
  {
    kind: "OPENED",
    name: "Tom",
    business: "West 6th Garage",
    detail: "opened 3x today",
    time: "1h",
  },
  {
    kind: "OPENED",
    name: "Carlos",
    business: "South Lamar Motors",
    detail: "opened · clicked demo link",
    time: "1h",
  },
  {
    kind: "REPLIED",
    name: "Priya",
    business: "Eastside Auto Pros",
    detail: '"Interested — call me Friday afternoon"',
    time: "2h",
  },
  {
    kind: "DELIVERED",
    name: "Lara",
    business: "ZipCar Repair",
    detail: "inbox · waiting",
    time: "2h",
  },
  {
    kind: "OPENED",
    name: "Marcus",
    business: "Bee Cave Service",
    detail: "opened 2x",
    time: "3h",
  },
  {
    kind: "SCHEDULED",
    name: "Anna",
    business: "Downtown Motors",
    detail: "send · tomorrow 09:00",
    time: "—",
  },
  {
    kind: "UNSUB",
    name: "Yusuf",
    business: "Riverside Tires",
    detail: "opted out",
    time: "3h",
  },
];

export function Scene2ColdEmailVisual() {
  return (
    <div className="absolute inset-0 flex flex-col px-5 pb-6 pt-32 bg-gradient-to-br from-[#9bbea4] via-[#7ea687] to-[#4f6f5a]">
      {/* Erken badge — white pill style for consistent visibility */}
      <div className="absolute top-10 right-5 z-30 flex items-center gap-1.5 rounded-full bg-white/95 px-2 py-1 shadow-md">
        <div className="w-4 h-4 rounded-full bg-[#7ea687] flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-[#C76B58]" />
        </div>
        <span className="text-[10px] font-semibold text-[#2a2722]">Erken · outreach</span>
      </div>

      {/* Campaign header */}
      <div className="relative z-10 mb-3">
        <div className="text-[11px] text-white/55 uppercase tracking-wider font-mono">
          Campaign · Q1 Austin auto shops
        </div>

        {/* Counter row */}
        <div className="mt-2 grid grid-cols-3 gap-2">
          <Stat label="Sent" value="247" />
          <Stat label="Opened" value="142" tint="#FFD898" />
          <Stat label="Replied" value="23" tint="#F5F1E8" emphasize />
        </div>
      </div>

      {/* Activity feed */}
      <div className="relative z-10 flex-1 space-y-1 mb-3">
        {ACTIVITY.map((row, i) => (
          <ActivityRowView key={`${row.name}-${row.kind}`} row={row} delay={i * 0.08} />
        ))}
      </div>

      {/* Footer — sender reputation + warmth */}
      <div className="relative z-10 flex items-center justify-between text-[10px] text-white/55 font-mono">
        <span>Warmth · 97%</span>
        <span>Reply rate · 9.3%</span>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tint,
  emphasize,
}: {
  label: string;
  value: string;
  tint?: string;
  emphasize?: boolean;
}) {
  return (
    <div className="rounded-md bg-white/[0.04] border border-white/10 px-2 py-1.5">
      <div className="text-[8px] uppercase tracking-wider text-white/55 font-mono">{label}</div>
      <div
        className={`mt-0.5 tabular-nums font-bold tracking-tight ${
          emphasize ? "text-base" : "text-sm"
        }`}
        style={{ color: tint ?? "#FFFFFF" }}
      >
        {value}
      </div>
    </div>
  );
}

// Pill colors recalibrated for the sage-green card background — sage
// labels would disappear into the bg, so REPLIED is now cream-emphatic;
// OPENED keeps the warm-gold accent.
const KIND_STYLES: Record<ActivityKind, { bg: string; text: string; label: string }> = {
  REPLIED:   { bg: "bg-[#F5F1E8]/25 border border-[#F5F1E8]/45", text: "text-[#F5F1E8]", label: "★ REPLIED" },
  OPENED:    { bg: "bg-[#E89F1F]/25 border border-[#E89F1F]/55", text: "text-[#FFD898]", label: "OPENED" },
  DELIVERED: { bg: "bg-white/10 border border-white/20",         text: "text-white/75", label: "DELIVERED" },
  SCHEDULED: { bg: "bg-white/10 border border-white/20",         text: "text-white/60", label: "SCHEDULED" },
  UNSUB:     { bg: "bg-white/5 border border-white/15",          text: "text-white/40", label: "UNSUB" },
};

function ActivityRowView({ row, delay }: { row: ActivityRow; delay: number }) {
  const muted = row.kind === "UNSUB" || row.kind === "SCHEDULED" || row.kind === "DELIVERED";
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
      className="flex items-start gap-2 rounded-md bg-white/[0.04] px-2 py-1.5"
    >
      {/* envelope icon */}
      <div className="shrink-0 mt-0.5">
        <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M4 6 H20 V18 H4 Z M4 6 L12 13 L20 6"
            fill="none"
            stroke="#F5F1E8"
            strokeOpacity={muted ? 0.4 : 0.95}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className={`shrink-0 rounded-full px-1.5 py-0.5 text-[8px] font-bold tracking-wider uppercase ${KIND_STYLES[row.kind].bg} ${KIND_STYLES[row.kind].text}`}
          >
            {KIND_STYLES[row.kind].label}
          </span>
          <span className={`text-[10px] font-semibold tracking-tight truncate ${muted ? "text-white/55" : "text-white"}`}>
            {row.name} · {row.business}
          </span>
          <span className="ml-auto text-[9px] text-white/40 font-mono shrink-0">{row.time}</span>
        </div>
        <div className="mt-0.5 text-[10px] text-white/55 leading-tight truncate italic">
          {row.detail}
        </div>
      </div>
    </motion.div>
  );
}
