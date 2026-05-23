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
    <div className="absolute inset-0 flex flex-col justify-end px-5 pb-6 bg-gradient-to-b from-[#0d1f17] via-[#11261c] to-[#091912]">
      {/* Decorative concentric pulse rings around the call icon —
          each ring is offset by ~1.3s so the cycle reads as a calm,
          breathing rhythm rather than a rapid sonar ping */}
      <div className="absolute inset-x-0 top-[42%] flex items-center justify-center">
        <PulseRing delay={0} />
        <PulseRing delay={1.3} className="absolute" />
        <PulseRing delay={2.6} className="absolute" />
      </div>

      {/* Erken Systems mark in upper-right corner — moved higher now that
          the redundant status pill is gone */}
      <div className="absolute top-10 right-5 flex items-center gap-1.5">
        <div className="w-5 h-5 rounded-full bg-[#7ea687] flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#C76B58]" />
        </div>
        <span className="text-[10px] font-medium text-white/70">Erken · AI agent</span>
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
  // Slower, wider pulse — was firing every 0.8s and only expanding 1.6x,
  // which read as aggressive. Now ~4s cycle expanding to 2.5x for a
  // calmer "breathing" feel.
  return (
    <motion.div
      className={`w-32 h-32 rounded-full border-2 border-[#7ea687]/40 ${className}`}
      initial={{ scale: 0.4, opacity: 0.55 }}
      animate={{ scale: [0.4, 2.5, 2.5], opacity: [0.55, 0, 0] }}
      transition={{
        duration: 4.0,
        delay,
        repeat: Infinity,
        ease: "easeOut",
        times: [0, 0.85, 1],
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
      className="w-[3px] rounded-full bg-[#7ea687]/70"
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
          isAgent ? "text-[#7ea687]" : "text-[#E89F1F]"
        }`}
      >
        {speaker}
      </span>
      <span className="text-white/80">{text}</span>
    </div>
  );
}
