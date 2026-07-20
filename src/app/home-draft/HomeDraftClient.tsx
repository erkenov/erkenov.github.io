"use client";

/**
 * HomeDraftClient — the actual restructured homepage content.
 * See page.tsx for the section-order rationale. Reuses SceneIndustriesCarousel,
 * CellDragonSprite, ErkenChatWidget/ErkenVoiceWidget from the live component
 * library. The heavy scroll-driven 3D orchestration from preview-v7
 * (SphereScrollStage, the roaming-Celly auto-positioner, MacbookFrame3D) is
 * intentionally NOT ported here — this draft is about section order and
 * copy, not effects parity. Hero uses a static sprite instead.
 */

import { motion } from "framer-motion";
import { CellDragonSprite } from "@/components/CellDragonSprite";
import { SceneIndustriesCarousel } from "@/components/SceneIndustriesCarousel";
import ErkenChatWidget, { openErkenChat } from "@/components/ErkenChatWidget";
import ErkenVoiceWidget from "@/components/ErkenVoiceWidget";

const ease = [0.16, 1, 0.3, 1] as const;

const CHROME_EXTENSION_URL =
  "https://chromewebstore.google.com/detail/erken/mggcbjggcbdpmbglbodkadgmpapcmelc";

function SectionKicker({ children }: { children: React.ReactNode }) {
  return <div className="mono-label">{children}</div>;
}

/* ------------------------------------------------------------------ */
/* Header + Footer — light, minimal, matches the live token system.   */
/* Kept local to this draft rather than reusing src/components/Header  */
/* + Footer, which still carry stale dark-theme / old-positioning copy */
/* ("AI receptionist for auto repair shops") not touched by this task. */
/* ------------------------------------------------------------------ */
function DraftHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-8">
        <a href="/" className="font-mono text-sm font-medium tracking-tight uppercase text-text">
          erken<span className="text-accent"> </span>systems
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#industries" className="text-sm text-text-muted transition-colors hover:text-text">
            Industries
          </a>
          <a href="#pipeline" className="text-sm text-text-muted transition-colors hover:text-text">
            How it works
          </a>
          <a href="#pricing" className="text-sm text-text-muted transition-colors hover:text-text">
            Pricing
          </a>
        </nav>
        <a
          href="/start"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg transition-all hover:bg-accent-hover"
        >
          Try for free
        </a>
      </div>
    </header>
  );
}

function DraftFooter() {
  return (
    <footer className="border-t border-border/40 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="font-mono text-sm font-medium text-text">
          erken<span className="text-accent"> </span>systems
        </div>
        <div className="flex items-center gap-6 text-xs text-text-dim">
          <a href="mailto:shamil.erkenovv@gmail.com" className="transition-colors hover:text-text">
            shamil.erkenovv@gmail.com
          </a>
          <span>© {new Date().getFullYear()} Erken Systems</span>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Section 1 — Hero                                                   */
/* ------------------------------------------------------------------ */
function HeroSection() {
  return (
    <section
      id="hero"
      data-section="hero"
      className="relative overflow-hidden px-6 py-20 md:px-12 md:py-28"
    >
      <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden />
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-12 md:flex-row md:items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="max-w-xl text-center md:text-left"
        >
          <SectionKicker>Erken Systems</SectionKicker>
          <h1
            className="mt-4 text-4xl font-bold tracking-tight md:text-6xl"
            style={{ letterSpacing: "-0.03em", lineHeight: 1.1 }}
          >
            One platform runs your business. Erken teaches you how.
          </h1>
          <p className="mt-6 text-base leading-relaxed text-text-muted md:text-lg">
            If you can answer your phone, you can run this. Every business runs the
            same pipeline — leads come in, get captured, get tracked, get reported
            on. The platform runs all four steps. And Erken, the assistant living on
            every screen, shows you the right button and walks you through any task,
            out loud. $97 a month after a free week. The assistant is free.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row md:justify-start">
            <a
              href="/start"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-base font-medium text-bg transition-all hover:bg-accent-hover hover:scale-[1.02]"
            >
              Try for free →
            </a>
            <a
              href="#industries"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3.5 text-base font-medium text-text transition-all hover:border-border-strong hover:bg-surface"
            >
              See your industry
            </a>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease, delay: 0.15 }}
          className="shrink-0"
        >
          <CellDragonSprite scale={1.15} pointDirection="left" />
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section 2 — Industries (moved up: the self-identification hook)   */
/* ------------------------------------------------------------------ */
function IndustriesSection() {
  return (
    <section id="industries" data-section="industries" className="border-t border-border/40 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease }}
          className="max-w-2xl"
        >
          <SectionKicker>Built for your industry</SectionKicker>
          <h2
            className="mt-3 text-3xl font-bold tracking-tight md:text-5xl"
            style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
          >
            Find your business below.
          </h2>
          <p className="mt-4 text-base text-text-muted md:text-lg">
            Every card shows the pipeline pre-configured for that industry —
            voice scripts, intake forms, pipeline stages, automations, already
            set up before you log in.
          </p>
        </motion.div>
      </div>
      <div className="mt-4">
        <SceneIndustriesCarousel />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section 3 — Pipeline proof, compressed to four compact cards       */
/* ------------------------------------------------------------------ */
const PIPELINE_STEPS = [
  {
    step: "01",
    kicker: "Lead generation",
    title: "Where your next ten customers come from.",
    body: "Funnels, forms, a social planner, and review automation that grows your rating. Miss a call and an instant text-back brings the lead back before they dial a competitor.",
  },
  {
    step: "02",
    kicker: "Lead capture",
    title: "Every channel answered.",
    body: "Phone, inbox, DMs, forms — all wired into one pipeline. The AI voice receptionist picks up in two rings. Web chat books appointments. Nothing goes to voicemail.",
  },
  {
    step: "03",
    kicker: "Lead management",
    title: "Every lead tracked, every follow-up automated.",
    body: "Your branded CRM, your pipeline, your automation. Leads get scored, routed, and followed up — no manual touchpoints, no lead left waiting.",
  },
  {
    step: "04",
    kicker: "The control panel",
    title: "Your whole operation, one screen.",
    body: "Calls, chats, forms, emails, deals — all visible in one dashboard. Workflow automation runs underneath. You see where every customer is. You read the dashboard.",
  },
];

function PipelineSection() {
  return (
    <section id="pipeline" data-section="pipeline" className="border-t border-border/40 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease }}
          className="max-w-2xl"
        >
          <SectionKicker>How it runs</SectionKicker>
          <h2
            className="mt-3 text-3xl font-bold tracking-tight md:text-5xl"
            style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
          >
            Every lead — captured, tracked, reported. Automatically.
          </h2>
          <p className="mt-4 text-base text-text-muted md:text-lg">
            The same four-step pipeline runs underneath every business on Erken.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PIPELINE_STEPS.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, ease, delay: i * 0.08 }}
              className="flex flex-col rounded-2xl border border-border bg-surface p-6"
            >
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-2xl font-bold text-accent tabular-nums" style={{ letterSpacing: "-0.02em" }}>
                  {s.step}
                </span>
                <span className="mono-label">{s.kicker}</span>
              </div>
              <h3 className="mt-3 text-lg font-semibold leading-snug text-text" style={{ letterSpacing: "-0.01em" }}>
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section 4 — Pricing tease                                          */
/* ------------------------------------------------------------------ */
const PRICE_TIERS = [
  { label: "Monthly", price: "$97/mo", note: "billed monthly" },
  { label: "6 months", price: "$87/mo", note: "$522 once — save 10%" },
  { label: "Yearly", price: "$81/mo", note: "$970 once — 2 months free" },
];

function PricingTeaseSection() {
  return (
    <section id="pricing" data-section="pricing" className="border-t border-border/40 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease }}
          className="max-w-2xl"
        >
          <SectionKicker>Pricing</SectionKicker>
          <h2
            className="mt-3 text-3xl font-bold tracking-tight md:text-5xl"
            style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
          >
            $97 a month. First week free. Prepay and save.
          </h2>
          <p className="mt-4 text-base text-text-muted md:text-lg">
            One flat price for the whole platform. No setup fee, no per-minute
            charges, no surprise tiers.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease, delay: 0.1 }}
          className="mt-10 grid gap-4 sm:grid-cols-3"
        >
          {PRICE_TIERS.map((t) => (
            <div key={t.label} className="rounded-2xl border border-border bg-surface p-6 text-center">
              <div className="mono-label">{t.label}</div>
              <div className="mt-2 text-3xl font-bold tracking-tight text-text" style={{ letterSpacing: "-0.03em" }}>
                {t.price}
              </div>
              <div className="mt-1 text-xs text-text-dim">{t.note}</div>
            </div>
          ))}
        </motion.div>

        <div className="mt-8 flex justify-center">
          <a
            href="/start"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-base font-medium text-bg transition-all hover:bg-accent-hover hover:scale-[1.02]"
          >
            See all plans →
          </a>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section 5 — Meet Erken                                             */
/* ------------------------------------------------------------------ */
const ERKEN_BULLETS = [
  { emoji: "🗣️", bold: "Ask it anything", rest: " — by voice or chat, about the platform or your business" },
  { emoji: "👉", bold: "Shows you the exact button", rest: " — walks you through any task on screen, out loud, step by step" },
  { emoji: "🧠", bold: "Remembers you", rest: " — your business, your setup, where you left off" },
  { emoji: "⚡", bold: "Actions on the way", rest: " — soon it won't just guide, it'll do the task for you" },
  { emoji: "🧩", bold: "Already in your browser", rest: " — free extension, installs in one click" },
];

function MeetErkenSection() {
  return (
    <section id="meet-erken" data-section="meet-erken" className="border-t border-border/40 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease }}
            className="flex justify-center md:justify-start"
          >
            <div title="Chat with Erken">
              <CellDragonSprite
                scale={1.1}
                pointDirection="right"
                onClick={() => openErkenChat()}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease, delay: 0.1 }}
          >
            <SectionKicker>Meet Erken</SectionKicker>
            <h2
              className="mt-3 text-3xl font-bold tracking-tight md:text-5xl"
              style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
            >
              The assistant that teaches you the platform.
            </h2>
            <div className="mt-6 flex flex-col gap-2.5 text-sm leading-relaxed text-text-muted md:text-base">
              {ERKEN_BULLETS.map((b) => (
                <div key={b.bold}>
                  <span aria-hidden>{b.emoji}</span>{" "}
                  <b className="text-text">{b.bold}</b>
                  {b.rest}
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row">
              <a
                href={CHROME_EXTENSION_URL}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-base font-medium text-bg transition-all hover:bg-accent-hover hover:scale-[1.02]"
              >
                Download for free
              </a>
              <button
                type="button"
                onClick={() => openErkenChat()}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-6 py-3.5 text-base font-medium text-text transition-all hover:border-border-strong hover:bg-surface"
              >
                Try it on this page
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section 6 — Get leads door (second audience)                       */
/* ------------------------------------------------------------------ */
function GetLeadsSection() {
  return (
    <section id="get-leads" data-section="get-leads" className="border-t border-border/40 py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-6 text-center md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease }}
        >
          <SectionKicker>Don&apos;t want to build it yourself?</SectionKicker>
          <h2
            className="mt-3 text-3xl font-bold tracking-tight md:text-5xl"
            style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
          >
            We&apos;ll hand you the leads instead.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-text-muted md:text-lg">
            We run and market our own lead-generating sites in your industry.
            Partner with us and we hand you live leads — delivered by phone —
            for a share of the revenue.
          </p>
          <div className="mt-8 flex justify-center">
            <a
              href="/start"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-base font-medium text-bg transition-all hover:bg-accent-hover hover:scale-[1.02]"
            >
              Get leads →
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function HomeDraftClient() {
  return (
    <main className="min-h-screen bg-bg text-text">
      <DraftHeader />
      <HeroSection />
      <IndustriesSection />
      <PipelineSection />
      <PricingTeaseSection />
      <MeetErkenSection />
      <GetLeadsSection />
      <DraftFooter />
      <ErkenChatWidget />
      <ErkenVoiceWidget />
    </main>
  );
}
