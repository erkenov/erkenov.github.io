"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef } from "react";
import { ArrowRight, Phone, Eye } from "lucide-react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Particles } from "@/components/ui/particles";
import { Highlight } from "@/components/ui/hero-highlight";

/**
 * Pinned, scroll-driven hero with three sequential scenes.
 *
 *   Scene 1 (0.00 – 0.33): "The phone rings" — universal business pain.
 *   Scene 2 (0.33 – 0.66): "The system answers" — restrained voice-agent reveal.
 *   Scene 3 (0.66 – 1.00): "The work lands" — laptop rotates open to show
 *                          a structured CRM record of what just happened.
 *
 *   Each scene's visual centerpiece is a pre-rendered MP4 clip whose
 *   `currentTime` is mapped to local scroll progress within the scene
 *   window (Dstafin / Apple AirPods Pro scrollytelling technique).
 *
 *   If video files are not present yet (`public/hero/scene-{1,2,3}.mp4`),
 *   the scene falls back to a poster gradient + the existing text overlay,
 *   so the site never visually breaks.
 *
 *   Positioning: see vault/05-decisions/2026-05-21-website-positioning-and-mvp-rebuild.md
 */
export function PinnedHero() {
  const ref = useRef<HTMLElement>(null);
  const scrollYProgress = useMotionValue(0);

  useEffect(() => {
    function compute() {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const top = window.scrollY + rect.top;
      const range = rect.height - window.innerHeight;
      if (range <= 0) {
        scrollYProgress.set(0);
        return;
      }
      const raw = (window.scrollY - top) / range;
      const clamped = Math.max(0, Math.min(1, raw));
      scrollYProgress.set(clamped);
    }
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, [scrollYProgress]);

  return (
    <section
      ref={ref}
      className="relative h-[280vh] bg-bg"
      aria-label="What happens when a customer contacts your business"
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        {/* Ambient layers — softer than before; the video is the focus now */}
        <AmbientBackgroundBeams progress={scrollYProgress} />
        <AmbientParticles progress={scrollYProgress} />
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-10" />
        <SceneGlow progress={scrollYProgress} />

        {/* Scenes */}
        <Scene1 progress={scrollYProgress} />
        <Scene2 progress={scrollYProgress} />
        <Scene3 progress={scrollYProgress} />

        {/* Scene indicator dots */}
        <SceneDots progress={scrollYProgress} />

        {/* Scroll hint shown only at very top */}
        <ScrollHint progress={scrollYProgress} />
      </div>
    </section>
  );
}

/* ============================================================== */
/*  Scroll-driven video — scrubs video.currentTime via progress   */
/* ============================================================== */

interface ScrollVideoProps {
  src: string;
  /** Scene's start/end as global scroll progress (0..1) */
  windowStart: number;
  windowEnd: number;
  progress: MotionValue<number>;
  poster?: string;
  className?: string;
  ariaLabel?: string;
}

function ScrollVideo({
  src,
  windowStart,
  windowEnd,
  progress,
  poster,
  className,
  ariaLabel,
}: ScrollVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Force preload — `preload="auto"` is just a hint, and Chrome often
    // downgrades it under data-saver / conservative heuristics on production
    // sites, leaving readyState at 0 (HAVE_NOTHING) until the user clicks.
    // Calling .load() explicitly bypasses that heuristic.
    video.load();
    // We scrub via currentTime; never let the element auto-play
    video.pause();
    const onCanPlay = () => video.pause();
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("play", onCanPlay);
    return () => {
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("play", onCanPlay);
    };
  }, []);

  useMotionValueEvent(progress, "change", (latest) => {
    const video = videoRef.current;
    if (!video) return;
    const seekable = video.seekable;
    let maxTime = 0;
    if (seekable && seekable.length > 0) {
      maxTime = seekable.end(seekable.length - 1);
    } else if (Number.isFinite(video.duration) && video.duration > 0) {
      maxTime = video.duration;
    }
    if (maxTime <= 0) return;
    const localProgress =
      (latest - windowStart) / Math.max(0.0001, windowEnd - windowStart);
    const clamped = Math.max(0, Math.min(1, localProgress));
    const targetTime = maxTime * clamped;
    if (Math.abs(video.currentTime - targetTime) > 0.03) {
      try {
        video.currentTime = targetTime;
      } catch {
        // Browser may throw if data for that frame isn't buffered yet.
        // Ignore — the next scroll tick will retry.
      }
    }
  });

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      muted
      playsInline
      preload="auto"
      // Never `autoPlay` — we scrub via currentTime instead
      className={className}
      aria-label={ariaLabel}
    />
  );
}

/* ============================================================== */
/*  Ambient glow that shifts hue across the three scenes           */
/* ============================================================== */

function SceneGlow({ progress }: { progress: MotionValue<number> }) {
  const x = useTransform(progress, [0, 0.5, 1], ["20%", "50%", "80%"]);
  const opacity = useTransform(progress, [0, 0.2, 0.8, 1], [0, 0.2, 0.2, 0.08]);
  return (
    <motion.div
      style={{ left: x, opacity }}
      className="pointer-events-none absolute top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent blur-[160px]"
      aria-hidden
    />
  );
}

function AmbientBackgroundBeams({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.1, 0.5, 0.8], [0.45, 0.45, 0.3, 0.1]);
  return (
    <motion.div
      style={{ opacity }}
      className="pointer-events-none absolute inset-0"
      aria-hidden
    >
      <BackgroundBeams />
    </motion.div>
  );
}

function AmbientParticles({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.2, 0.7, 1], [0.4, 0.4, 0.25, 0.2]);
  return (
    <motion.div
      style={{ opacity }}
      className="pointer-events-none absolute inset-0"
      aria-hidden
    >
      <Particles
        className="absolute inset-0"
        quantity={60}
        color="#ff7849"
        size={0.5}
        staticity={40}
      />
    </motion.div>
  );
}

/* ============================================================== */
/*  Scene 1 — The phone rings                                      */
/* ============================================================== */

function Scene1({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.05, 0.3, 0.4], [1, 1, 1, 0]);
  const yText = useTransform(progress, [0, 0.3], [0, -60]);
  const videoOpacity = useTransform(progress, [0, 0.05, 0.3, 0.4], [0.85, 1, 1, 0]);
  const videoScale = useTransform(progress, [0, 0.3], [1.02, 1]);

  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0 flex flex-col items-center justify-center px-6"
    >
      <motion.div
        style={{ opacity: videoOpacity, scale: videoScale }}
        className="absolute inset-0 flex items-center justify-center"
        aria-hidden
      >
        <ScrollVideo
          src="/hero/scene-1.mp4"
          windowStart={0}
          windowEnd={0.33}
          progress={progress}
          className="h-full w-full object-cover opacity-90"
          ariaLabel="A phone ringing on a business owner's desk"
        />
        {/* Dark vignette so text reads cleanly */}
        <div className="absolute inset-0 bg-gradient-to-b from-bg/40 via-transparent to-bg/80" />
      </motion.div>

      <motion.div
        style={{ y: yText }}
        className="relative z-10 mx-auto max-w-4xl text-center"
      >
        <div className="mono-label inline-block">Scene 01 — the work hours</div>
        <h1
          className="mt-5 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl"
          style={{ letterSpacing: "-0.03em", lineHeight: 1.05 }}
        >
          The phone keeps ringing
          <span className="block">
            while you&apos;re <Highlight className="text-text">doing the work.</Highlight>
          </span>
        </h1>
        <p className="mt-6 mx-auto max-w-xl text-lg text-text-muted">
          New customers. Existing customers. Suppliers. Spam. Every call is a context switch. Every missed one is a leak.
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ============================================================== */
/*  Scene 2 — The system answers                                   */
/* ============================================================== */

function Scene2({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(
    progress,
    [0.28, 0.4, 0.62, 0.72],
    [0, 1, 1, 0]
  );
  const videoOpacity = useTransform(
    progress,
    [0.28, 0.4, 0.62, 0.72],
    [0, 1, 1, 0]
  );
  const slideUp = useTransform(progress, [0.3, 0.5], [40, 0]);

  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0 flex items-center justify-center px-6"
    >
      <motion.div
        style={{ opacity: videoOpacity }}
        className="absolute inset-0 flex items-center justify-center"
        aria-hidden
      >
        <ScrollVideo
          src="/hero/scene-2.mp4"
          windowStart={0.33}
          windowEnd={0.66}
          progress={progress}
          className="h-full w-full object-cover opacity-90"
          ariaLabel="The system answering the call, transcript building live"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/40 via-transparent to-bg/80" />
      </motion.div>

      <motion.div
        style={{ y: slideUp }}
        className="relative z-10 mx-auto max-w-4xl text-center"
      >
        <div className="mono-label inline-block">Scene 02 — same minute</div>
        <h2
          className="mt-5 text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl"
          style={{ letterSpacing: "-0.03em", lineHeight: 1.1 }}
        >
          The system picks up.
          <span className="block text-accent">
            Within two rings.
          </span>
        </h2>
        <p className="mt-6 mx-auto max-w-xl text-lg text-text-muted">
          A voice agent that knows your business. Asks the right questions.
          Sounds like a person, not a robot. Works at 2 AM the same way it works at 2 PM.
        </p>

        <div className="mx-auto mt-8 max-w-md rounded-2xl border border-border bg-surface/80 p-6 backdrop-blur text-left">
          <div className="flex items-center justify-between">
            <div className="mono-label">Live transcript</div>
            <div className="flex items-center gap-2 text-xs text-text-dim">
              <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
              On call
            </div>
          </div>
          <div className="mt-4 space-y-3 text-sm">
            <Line
              role="ai"
              text="Thanks for calling — what can I help your business with today?"
            />
            <Line role="caller" text="I&apos;m looking to book an appointment." />
            <Line
              role="ai"
              text="Got it. What kind of service, and when works for you?"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ============================================================== */
/*  Scene 3 — The work lands in the system                         */
/* ============================================================== */

function Scene3({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(
    progress,
    [0.62, 0.74, 0.95, 1],
    [0, 1, 1, 1]
  );
  const videoOpacity = useTransform(
    progress,
    [0.62, 0.74, 0.95, 1],
    [0, 1, 1, 1]
  );
  const cardY = useTransform(progress, [0.62, 0.8], [60, 0]);
  const checkScale = useTransform(progress, [0.78, 0.88], [0, 1]);

  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0 flex items-center justify-center px-6"
    >
      <motion.div
        style={{ opacity: videoOpacity }}
        className="absolute inset-0 flex items-center justify-center"
        aria-hidden
      >
        <ScrollVideo
          src="/hero/scene-3.mp4"
          windowStart={0.66}
          windowEnd={1}
          progress={progress}
          className="h-full w-full object-cover opacity-90"
          ariaLabel="A laptop revealing a CRM dashboard with the new contact recorded"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/40 via-transparent to-bg/80" />
      </motion.div>

      <div className="relative z-10 grid w-full max-w-6xl grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-20">
        {/* Left: Booking confirmation card */}
        <motion.div style={{ y: cardY }} className="relative">
          <div className="relative mx-auto max-w-md rounded-3xl border border-border bg-surface p-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="mono-label">Lead recorded</div>
              <motion.div
                style={{ scale: checkScale }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-accent"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </motion.div>
            </div>
            <div className="mt-6 space-y-2">
              <Row label="Contact" value="James — new lead" />
              <Row label="Source" value="Inbound call, 5:48 PM" />
              <Row label="Intent" value="Service appointment" />
              <Row label="Status" value="Booked — tomorrow 8 AM" highlight />
            </div>
            <div className="mt-6 rounded-xl border border-border bg-bg/60 p-4">
              <div className="text-xs text-text-dim">Confirmation sent</div>
              <div className="mt-1 text-sm text-text">
                Booked for Tue 8 AM. Address sent via SMS. Calendar updated. Owner notified.
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: Closing text + CTA */}
        <motion.div style={{ y: cardY }} className="relative z-10">
          <div className="mono-label">Scene 03 — the call ended</div>
          <h2
            className="mt-3 text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl"
            style={{ letterSpacing: "-0.03em", lineHeight: 1.1 }}
          >
            The work landed.
            <span className="block text-accent">
              You never touched your phone.
            </span>
          </h2>
          <p className="mt-5 text-base text-text-muted md:text-lg">
            One booked job pays for the whole system for a month.
            Everything after that is margin you didn&apos;t have before.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href="#demo"
              className="group inline-flex w-fit items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-accent px-6 py-3.5 text-base font-medium text-bg transition-all hover:bg-accent-hover hover:scale-[1.02]"
            >
              <Phone className="h-4 w-4" strokeWidth={2.25} />
              Hear it work
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                strokeWidth={2.25}
              />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex w-fit items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-border bg-surface/60 px-6 py-3.5 text-base font-medium text-text transition-all hover:border-border-strong hover:bg-surface"
            >
              <Eye className="h-4 w-4" strokeWidth={2.25} />
              See what I build
            </a>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ============================================================== */
/*  Atoms                                                          */
/* ============================================================== */

function Line({ role, text }: { role: "caller" | "ai"; text: string }) {
  return (
    <div className="flex gap-3">
      <div
        className={`shrink-0 font-mono text-xs uppercase tracking-wider ${
          role === "ai" ? "text-accent" : "text-text-dim"
        }`}
        style={{ width: 46 }}
      >
        {role === "ai" ? "AI" : "You"}
      </div>
      <div className={role === "ai" ? "text-text" : "text-text-muted"}>
        {text}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-xs uppercase tracking-wider text-text-dim">
        {label}
      </span>
      <span
        className={`text-right text-sm font-medium ${
          highlight ? "text-accent" : "text-text"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function SceneDots({ progress }: { progress: MotionValue<number> }) {
  const dot1 = useTransform(progress, [0, 0.33], [1, 0.3]);
  const dot2 = useTransform(progress, [0.2, 0.33, 0.66], [0.3, 1, 0.3]);
  const dot3 = useTransform(progress, [0.55, 0.7, 1], [0.3, 1, 1]);
  return (
    <div className="absolute right-6 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-3 md:right-10">
      <motion.div style={{ opacity: dot1 }} className="h-2 w-2 rounded-full bg-accent" />
      <motion.div style={{ opacity: dot2 }} className="h-2 w-2 rounded-full bg-accent" />
      <motion.div style={{ opacity: dot3 }} className="h-2 w-2 rounded-full bg-accent" />
    </div>
  );
}

function ScrollHint({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.05], [1, 0]);
  return (
    <motion.div
      style={{ opacity }}
      className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 text-xs uppercase tracking-widest text-text-dim"
    >
      Scroll
      <span className="ml-2 inline-block animate-bounce">↓</span>
    </motion.div>
  );
}
