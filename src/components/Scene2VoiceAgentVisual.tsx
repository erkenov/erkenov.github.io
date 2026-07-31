"use client";

/**
 * Scene2VoiceAgentVisual — atmospheric "AI voice agent making a call"
 * card art for the Lead Generation Apple Cards Carousel.
 *
 * Renders a stylized phone-call interface: dark background, sage waveform
 * pulse, COLD-outbound transcript snippet, prominent caller ID showing
 * Shamil's real Retell number (so a visitor calling it reaches the
 * actual AI agent — the mockup IS the demo).
 *
 * Edits 2026-05-23:
 *  - Removed redundant "Outbound · live" badge (already implied by the
 *    card category, title, and "Outbound" caller label)
 *  - Removed fake call duration timer in the bottom-left
 *  - Removed the separate "Try it live" CTA block — Shamil's number is
 *    now the prominent caller-ID instead of the prospect's number
 *  - Erken corner mark moved higher
 *  - Transcript rewritten for COLD outbound (prospect doesn't know the
 *    caller), pitching the Erken Systems platform itself — the agent
 *    selling the platform that built the agent
 */

import { motion } from "motion/react";

export function Scene2VoiceAgentVisual() {
  return (
    <div className="absolute inset-0 flex flex-col justify-end px-5 pb-6 bg-gradient-to-br from-[#D88573] via-[#C76B58] to-[#A0533F]">
      {/* Caller ID — Shamil's real Retell number as the OUTBOUND caller.
          "Outbound call" label removed 2026-05-25 (Shamil): redundant
          with the card category "Outbound · voice". */}
      <div className="relative z-10 mb-3">
        <div className="text-lg font-bold text-white tracking-tight tabular-nums">
          +1 (888) 799-6065
        </div>
        <div className="text-[12px] text-white/65">
          → Apex Auto · Austin TX
        </div>
      </div>

      {/* Waveform bars */}
      <div className="relative z-10 mb-4 flex items-end gap-0.5 h-10">
        {Array.from({ length: 36 }).map((_, i) => (
          <Bar key={i} index={i} />
        ))}
      </div>

      {/* Live transcript — cold outbound, pitching Erken Systems
          platform itself. The agent doesn't assume the prospect knows
          who's calling. */}
      <div className="relative z-10 space-y-1.5 mb-3">
        <TranscriptLine speaker="Agent" text="Hi — am I speaking with Maya at Apex Auto?" />
        <TranscriptLine speaker="Maya" text="Yes, this is Maya. Who's this?" />
        <TranscriptLine speaker="Agent" text="This is Erken. Quick question — how are you handling missed calls right now? I help shops capture leads that would otherwise go to voicemail." />
      </div>

    </div>
  );
}

function PulseRing({ delay, className = "" }: { delay: number; className?: string }) {
  // Slow, wide pulse. Earlier version had a "spike" at the birth of each
  // ring because opacity jumped from 0 (between cycles) to 0.55 (first
  // keyframe) instantly. Fix: opacity now ramps 0 → 0.55 → 0 over the
  // cycle so both birth and death are soft fades. Expansion bumped to
  // 4x so the ring always extends past the card edges before
  // disappearing.
  return (
    <motion.div
      className={`w-32 h-32 rounded-full border-2 border-[#F5F1E8]/45 ${className}`}
      initial={{ scale: 0.4, opacity: 0 }}
      animate={{
        scale: [0.4, 1.0, 4.0, 4.0],
        opacity: [0, 0.55, 0, 0],
      }}
      transition={{
        duration: 5.0,
        delay,
        repeat: Infinity,
        ease: "easeOut",
        times: [0, 0.18, 0.9, 1],
      }}
    />
  );
}

function Bar({ index }: { index: number }) {
  // Heights vary in a wave-like pattern + the bar pulses subtly so the
  // waveform appears alive.
  const base = 6 + Math.abs(Math.sin(index * 0.6)) * 26;
  return (
    <motion.div
      className="w-[3px] rounded-full bg-[#F5F1E8]/75"
      style={{ height: base }}
      animate={{ height: [base, base * 0.4, base, base * 1.1, base] }}
      transition={{
        duration: 1.8,
        delay: index * 0.04,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

function TranscriptLine({ speaker, text }: { speaker: string; text: string }) {
  const isAgent = speaker === "Agent";
  return (
    <div className="flex items-start gap-2 text-[11px] leading-snug">
      <span
        className={`shrink-0 font-mono text-[9px] uppercase tracking-wider mt-0.5 ${
          isAgent ? "text-[#F5F1E8]" : "text-[#FFD898]"
        }`}
      >
        {speaker}
      </span>
      <span className="text-white/80">{text}</span>
    </div>
  );
}
