"use client";

/**
 * Scene2LinkedInVisual — "LinkedIn outreach (white-collar)" card art
 * for the Lead Generation Apple Cards Carousel.
 *
 * Stylized LinkedIn-message thread targeting B2B / professional-services
 * prospects (the niche LinkedIn outreach actually serves). Olive brand
 * background to match the channel's assigned palette color.
 */

import { motion } from "motion/react";

type LiTurn = {
  speaker: "agent" | "prospect";
  text: string;
};

const THREAD: LiTurn[] = [
  {
    speaker: "agent",
    text: "Hi Daniel — saw TechFlow is hiring two demand-gen roles. Have you considered an outbound-ops layer before the next hire?",
  },
  {
    speaker: "prospect",
    text: "Possibly. What's your angle?",
  },
  {
    speaker: "agent",
    text: "I build the system — AI voice agent, scrapers, CRM wiring — that the demand-gen team would build themselves over 6 months. Done in 3 weeks. Want a 15-min Zoom?",
  },
  {
    speaker: "prospect",
    text: "Sure, send a calendar link",
  },
];

export function Scene2LinkedInVisual() {
  return (
    <div className="absolute inset-0 flex flex-col px-5 pb-6 pt-32 bg-gradient-to-br from-[#C2D389] via-[#A8B86C] to-[#7B8D44]">
      {/* Erken badge moved to card's topRightOverlay slot. */}

      {/* Stats header */}
      <div className="relative z-10 mb-3">
        <div className="text-[11px] text-white/80 uppercase tracking-wider font-mono">
          Outbound · B2B services
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2">
          <Stat label="Connects" value="142" />
          <Stat label="Replied" value="34" tint="#F5F1E8" emphasize />
          <Stat label="Booked" value="9" tint="#F5F1E8" emphasize />
        </div>
      </div>

      {/* Prospect profile pill — the person being messaged */}
      <div className="relative z-10 mb-2 flex items-center gap-2 rounded-md bg-white/15 border border-white/25 px-2 py-1.5 backdrop-blur-sm">
        <div className="w-7 h-7 rounded-full bg-[#7B8D44] border border-white/35 flex items-center justify-center text-[10px] font-bold text-[#F5F1E8]">
          DM
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-semibold text-white tracking-tight truncate">
            Daniel Mitchell
          </div>
          <div className="text-[9px] text-white/80 truncate">
            CTO · TechFlow · Austin TX · 2nd
          </div>
        </div>
        <span className="rounded-full bg-[#F5F1E8]/25 border border-[#F5F1E8]/45 px-1.5 py-0.5 text-[8px] font-bold tracking-wider uppercase text-[#F5F1E8]">
          Connected
        </span>
      </div>

      {/* Message thread */}
      <div className="relative z-10 flex-1 space-y-1.5 mb-3">
        {THREAD.map((turn, i) => (
          <LiBubble key={i} turn={turn} delay={i * 0.12} />
        ))}
      </div>

      {/* Footer */}
      <div className="relative z-10 flex items-center justify-between text-[10px] text-white/80 font-mono">
        <span>↳ Calendar sent</span>
        <span>Accept rate · 41%</span>
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

function LiBubble({ turn, delay }: { turn: LiTurn; delay: number }) {
  const isAgent = turn.speaker === "agent";
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={`flex ${isAgent ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[88%] rounded-lg px-2.5 py-1.5 ${
          isAgent
            ? "bg-[#F5F1E8] text-[#2a2722]"
            : "bg-white/18 text-white border border-white/25"
        }`}
      >
        <div className="text-[10px] leading-snug">{turn.text}</div>
      </div>
    </motion.div>
  );
}
