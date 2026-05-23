"use client";

/**
 * Scene2VoiceAgentVisual — atmospheric "AI voice agent making a call"
 * card art for the Lead Generation Apple Cards Carousel.
 *
 * Renders a stylized phone-call interface: dark background, sage waveform
 * pulse, live transcript snippet, status pill. The aim is "looks like a
 * real product screen at a glance" without being a literal phone screenshot.
 */

import { motion } from "motion/react";

export function Scene2VoiceAgentVisual() {
  return (
    <div className="absolute inset-0 flex flex-col justify-end px-5 pb-6 bg-gradient-to-b from-[#0d1f17] via-[#11261c] to-[#091912]">
      {/* Decorative concentric pulse rings around the call icon */}
      <div className="absolute inset-x-0 top-[42%] flex items-center justify-center">
        <PulseRing delay={0} />
        <PulseRing delay={0.8} className="absolute" />
        <PulseRing delay={1.6} className="absolute" />
      </div>

      {/* Outbound call status pill — pushed below the card title block
          which occupies roughly the first ~140px from the top */}
      <div className="absolute top-40 left-5 inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm px-2.5 py-1 border border-white/15">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-[#C76B58] opacity-75 animate-ping" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#C76B58]" />
        </span>
        <span className="text-[10px] font-medium tracking-wider uppercase text-white/85">
          Outbound · live
        </span>
      </div>

      {/* Erken Systems mark in corner — also pushed below the title block */}
      <div className="absolute top-40 right-5 flex items-center gap-1.5">
        <div className="w-5 h-5 rounded-full bg-[#7ea687] flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#C76B58]" />
        </div>
        <span className="text-[10px] font-medium text-white/70">Erken · AI agent</span>
      </div>

      {/* Phone call display — contact + waveform */}
      <div className="relative z-10 mb-3">
        <div className="text-[11px] text-white/55 uppercase tracking-wider font-mono">
          Calling
        </div>
        <div className="mt-1 text-base font-semibold text-white tracking-tight">
          Maya Chen
        </div>
        <div className="text-[12px] text-white/65">
          Apex Auto · Austin TX · +1 (512) 555-0142
        </div>
      </div>

      {/* Waveform bars */}
      <div className="relative z-10 mb-4 flex items-end gap-0.5 h-10">
        {Array.from({ length: 36 }).map((_, i) => (
          <Bar key={i} index={i} />
        ))}
      </div>

      {/* Live transcript snippet */}
      <div className="relative z-10 space-y-1.5 mb-3">
        <TranscriptLine speaker="Agent" text="Hi Maya — I'm calling on behalf of Apex Auto's online booking system…" />
        <TranscriptLine speaker="Maya" text="Oh, hi. Yeah — is this about the brake check?" />
        <TranscriptLine speaker="Agent" text="Yes. I can book you in for Thursday at 9am or Friday at 2pm. Which works?" />
      </div>

      {/* Duration + state */}
      <div className="relative z-10 flex items-center justify-between text-[11px] text-white/55 font-mono">
        <span>01:42</span>
        <span>Booking · 87% confidence</span>
      </div>
    </div>
  );
}

function PulseRing({ delay, className = "" }: { delay: number; className?: string }) {
  return (
    <motion.div
      className={`w-32 h-32 rounded-full border-2 border-[#7ea687]/40 ${className}`}
      initial={{ scale: 0.5, opacity: 0.6 }}
      animate={{ scale: [0.5, 1.6, 1.6], opacity: [0.6, 0, 0] }}
      transition={{
        duration: 2.4,
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
