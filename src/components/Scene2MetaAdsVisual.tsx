"use client";

/**
 * Scene2MetaAdsVisual — "Meta Business AI on Facebook / Instagram" card
 * art for the Lead Generation Apple Cards Carousel.
 *
 * Stylized Instagram-DM-style conversation showing the AI agent
 * answering a question that came in from a Meta ad and booking the
 * appointment. Sun-gold brand background to match the channel's
 * assigned palette color.
 */

import { motion } from "motion/react";

type DmTurn = {
  speaker: "prospect" | "agent";
  text: string;
  time: string;
};

const DM_THREAD: DmTurn[] = [
  { speaker: "prospect", text: "Hi — do you do brake inspections?", time: "9:14 AM" },
  { speaker: "agent",    text: "Yes! Free brake checks all month. Want to book?", time: "9:14 AM" },
  { speaker: "prospect", text: "Yeah — does Friday work?",                       time: "9:15 AM" },
  { speaker: "agent",    text: "Friday 2pm just opened. Confirmed?",             time: "9:15 AM" },
  { speaker: "prospect", text: "Yes please 🙏",                                  time: "9:16 AM" },
];

export function Scene2MetaAdsVisual() {
  return (
    <div className="absolute inset-0 flex flex-col px-5 pb-6 pt-32 bg-gradient-to-br from-[#F2B85E] via-[#E89F1F] to-[#B7771A]">
      {/* Erken badge — white pill style for consistent visibility */}
      <div className="absolute top-10 right-5 z-30 flex items-center gap-1.5 rounded-full bg-white/95 px-2 py-1 shadow-md">
        <div className="w-4 h-4 rounded-full bg-[#7ea687] flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-[#C76B58]" />
        </div>
        <span className="text-[10px] font-semibold text-[#2a2722]">Erken · Meta AI</span>
      </div>

      {/* Header — explicitly "inbound from ad" so it's clear this is
          NOT cold DM outreach (which Meta bans). The prospect saw an
          ad and sent the first message. */}
      <div className="relative z-10 mb-3">
        <div className="text-[11px] text-white/85 uppercase tracking-wider font-mono">
          Inbound DM · Instagram ad
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2">
          <Stat label="Ad → DMs" value="184" />
          <Stat label="Agent replied" value="142" emphasize />
          <Stat label="Booked" value="38" tint="#F5F1E8" emphasize />
        </div>
      </div>

      {/* "Sourced from ad" pill above the thread */}
      <div className="relative z-10 mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 border border-white/25 px-2 py-0.5 backdrop-blur-sm self-start">
        <svg width="10" height="10" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="#F5F1E8" strokeWidth="2" />
          <circle cx="12" cy="12" r="4" fill="none" stroke="#F5F1E8" strokeWidth="2" />
          <circle cx="17.5" cy="6.5" r="1.2" fill="#F5F1E8" />
        </svg>
        <span className="text-[9px] font-medium tracking-wider uppercase text-white/85">
          ↑ from your Friday brake-check ad
        </span>
      </div>

      {/* DM thread — Instagram-style chat bubbles. Prospect sends
          first (inbound from ad) → agent replies → books. */}
      <div className="relative z-10 flex-1 space-y-1.5 mb-3">
        {DM_THREAD.map((turn, i) => (
          <DmBubble key={i} turn={turn} delay={i * 0.1} />
        ))}
      </div>

      {/* Footer */}
      <div className="relative z-10 flex items-center justify-between text-[10px] text-white/85 font-mono">
        <span>↳ Auto-booked to CRM</span>
        <span>Reply rate · 77%</span>
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
    <div className="rounded-md bg-white/15 border border-white/25 px-2 py-1.5 backdrop-blur-sm">
      <div className="text-[8px] uppercase tracking-wider text-white/70 font-mono">{label}</div>
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

function DmBubble({ turn, delay }: { turn: DmTurn; delay: number }) {
  const isAgent = turn.speaker === "agent";
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={`flex ${isAgent ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-2.5 py-1.5 ${
          isAgent
            ? "bg-[#F5F1E8] text-[#2a2722] rounded-br-md"
            : "bg-white/20 text-white border border-white/25 rounded-bl-md"
        }`}
      >
        <div className="text-[10.5px] leading-snug">{turn.text}</div>
      </div>
    </motion.div>
  );
}
