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
      {/* Decorative concentric pulse rings around the call icon —
          each ring is offset by ~1.7s for an even rhythm at the new
          5-second cycle. Three rings at staggered phases keep the
          visual filled without packing too dense. */}
      <div className="absolute inset-x-0 top-[42%] flex items-center justify-center">
        <PulseRing delay={0} />
        <PulseRing delay={1.7} className="absolute" />
        <PulseRing delay={3.4} className="absolute" />
      </div>

      {/* Erken Systems mark in upper-right corner. On a terracotta
          background the mark's terracotta dot would disappear, so the
          inner dot uses cream here while the outer stays sage. */}
      <div className="absolute top-10 right-5 flex items-center gap-1.5">
        <div className="w-5 h-5 rounded-full bg-[#7ea687] flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#F5F1E8]" />
        </div>
        <span className="text-[10px] font-medium text-white/85">Erken · AI agent</span>
      </div>

      {/* Caller ID — Shamil's real Retell number as the OUTBOUND caller.
          Visitor sees this, calls it, reaches the live agent. */}
      <div className="relative z-10 mb-3">
        <div className="text-[11px] text-white/55 uppercase tracking-wider font-mono">
          Outbound call
        </div>
        <div className="mt-1 text-lg font-bold text-white tracking-tight tabular-nums">
          +1 (901) 633-1400
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
        <TranscriptLine speaker="Agent" text="Sam from Erken Systems. Quick question — how are you handling missed calls right now? I help shops capture leads that would otherwise go to voicemail." />
      </div>

      {/* Footer state — duration removed; just the confidence indicator
          to keep the product-like polish */}
      <div className="relative z-10 flex items-center justify-end text-[11px] text-white/55 font-mono">
        <span>Qualifying · 91% confidence</span>
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
