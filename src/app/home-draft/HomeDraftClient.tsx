"use client";

/**
 * HomeDraftClient — the actual restructured homepage content.
 * See page.tsx for the section-order rationale. Reuses SceneIndustriesCarousel,
 * CellDragonSprite, ErkenChatWidget/ErkenVoiceWidget from the live component
 * library. The heavy scroll-driven 3D orchestration from preview-v7
 * (SphereScrollStage, the roaming-Celly auto-positioner, MacbookFrame3D) is
 * intentionally NOT ported here — this draft is about section order and
 * copy, not effects parity.
 *
 * v2 (Shamil review round): header simplified to logo + Pricing anchor +
 * persistent "Try for free"; hero gets a one-line price tease + a video
 * placeholder frame (founder video, not built yet) instead of the sprite;
 * "Try for free" CTA repeats after Industries / Pipeline / Meet Erken; the
 * full 3-tier pricing section moved late (right before the closing
 * Custom-solutions + Get-leads offers, appears once); NEW Custom solutions
 * section owns the "Don't want to set it up yourself?" framing (mirrors
 * /start's CustomSolutionsCard); Get leads reframed with its own honest
 * angle + a "coming soon" tone matching /start's inactive GetLeadsCard
 * (no dead-end CTA — links to /start where the coming-soon card lives).
 *
 * Layout rhythm: alternating visual side where a section pairs text with a
 * visual — hero puts the video placeholder on the RIGHT, Meet Erken puts
 * the sprite on the LEFT, so the two visual beats alternate sides as you
 * scroll (matches the pattern Shamil likes on the live page). Industries
 * and Pipeline are grid/carousel layouts (not a single text+visual pair)
 * so the alternating rule doesn't apply there. Custom solutions and Get
 * leads are text-only offer blocks — no visual to alternate.
 *
 * v3 (Shamil live-scroll review): restored the full nav link set in the
 * header (a one-link menu "looked weird" — pruning decided later); fixed a
 * z-index bug where SceneIndustriesCarousel's closed-card arrow buttons
 * (z-40) rendered on top of the sticky header because the header was also
 * z-40 and lost the later-DOM-order tiebreak — header is now z-50, matching
 * the live site's Header.tsx; added FloatingErken, a persistent fixed-corner
 * sprite so Erken is visible from page load (previously only appeared at
 * the Meet Erken section once the hero sprite was swapped for the video
 * placeholder in v2 — Shamil scrolled partway and asked "where did the
 * Erken go").
 *
 * v4 (Shamil live review, pipeline section): the flat 4-card grid read as
 * "unfinished." Added two alternative treatments behind a draft-only
 * toggle (Variant A / Variant B pills, not part of the proposed final
 * design) so Shamil can compare them side by side — no second carousel,
 * per his explicit note.
 *
 * v5 (Shamil post-review verdicts):
 *  - Pipeline: Variant A won. Removed Variant B + the toggle entirely.
 *    Upgraded A's node icons to inline-SVG flat illustrations (soft
 *    rounded shapes, sage/clay/cream + a neutral, ~96px) — a small scene
 *    per step instead of a glyph, in the style of GoHighLevel's snapshot
 *    marketplace cards / Canva flat-illustration sets.
 *  - Meet Erken: the three buttons (Download for free / Try it on this
 *    page / Try for free) now sit in one row, same size/rhythm, wrapping
 *    on mobile — replaces the separate trailing TryForFreeCta, which read
 *    as a redundant fourth button stacked right below the other two.
 *  - Pricing: full /start-style plan cards (complete "What's included"
 *    feature list per tier, no email form — that's /start's job — a
 *    per-card CTA button to /start). Supersedes an earlier "compact tease
 *    card" pass; Shamil's call: seeing everything included beats a tease.
 *    Monthly gets a "Default" outline tag (it's the anchor price used
 *    everywhere else on the page), Yearly gets a filled "Best value" badge.
 *  - Get leads: the "See it on our plans page" text link is now a proper
 *    button, same CTA language as the rest of the page.
 *  - Footer removed (Shamil's call — parked earlier, now decided).
 *  - Erken is no longer a static sprite. FloatingErken (fixed-corner,
 *    non-roaming) is REPLACED by RoamingErken (./RoamingErken.tsx) — a
 *    faithful port of the live homepage's roaming/auto-positioning Celly,
 *    click-to-chat menu, and chat-dock behavior. See that file's header
 *    comment for exactly what was ported verbatim vs. the two named
 *    simplifications (no WebGL dust-trail canvas, no per-section offset
 *    table) that a true SphereScrollStage port would require.
 *    `data-celly-avoid` is now tagged on every section's main content
 *    block so the ported findEmptySpot() auto-positioner has real
 *    geometry to avoid, same as production.
 */

import { motion } from "framer-motion";
import { Play, Check } from "lucide-react";
import { CellDragonSprite } from "@/components/CellDragonSprite";
import { SceneIndustriesCarousel } from "@/components/SceneIndustriesCarousel";
import { openErkenChat } from "@/components/ErkenChatWidget";
import RoamingErken from "./RoamingErken";

const ease = [0.16, 1, 0.3, 1] as const;

const CHROME_EXTENSION_URL =
  "https://chromewebstore.google.com/detail/erken/mggcbjggcbdpmbglbodkadgmpapcmelc";

function SectionKicker({ children }: { children: React.ReactNode }) {
  return <div className="mono-label">{children}</div>;
}

/** Repeated CTA row — used after Industries, Pipeline, and Meet Erken so the
 *  trial offer stays close by without the visitor having to scroll back up. */
function TryForFreeCta({ label = "Try for free" }: { label?: string }) {
  return (
    <div className="mt-12 flex justify-center">
      <a
        href="/start"
        className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-base font-medium text-bg transition-all hover:bg-accent-hover hover:scale-[1.02]"
      >
        {label} →
      </a>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Header + Footer — light, minimal, matches the live token system.   */
/* Kept local to this draft rather than reusing src/components/Header  */
/* + Footer, which still carry stale dark-theme / old-positioning copy */
/* not touched by this task.                                          */
/* ------------------------------------------------------------------ */
function DraftHeader() {
  return (
    // z-50 (not z-40): matches the live site's Header.tsx sticky z-index.
    // Bug found in Shamil's live scroll review: at z-40 the header tied
    // with SceneIndustriesCarousel's z-40 arrow buttons, and later-DOM-order
    // won, so the arrows rendered on top of the menu while scrolling. z-50
    // clears every z-index used inside the carousel's closed-card view
    // (arrows z-40, edge fade z-[1000] is a non-interactive decorative
    // overlay contained within the carousel's own box, badges z-50 only
    // inside card thumbnails) except the industry-detail modal (z-[200]),
    // which SHOULD cover the header when open — that's expected, not a bug.
    <header data-celly-avoid className="sticky top-0 z-50 w-full border-b border-border/60 bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-8">
        <a href="/" className="font-mono text-sm font-medium tracking-tight uppercase text-text">
          erken<span className="text-accent"> </span>systems
        </a>
        {/* Restored (Shamil live review): a one-link menu looked wrong.
            Full original link set is back; pruning gets decided later. */}
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

/* ------------------------------------------------------------------ */
/* Section 1 — Hero. Visual on the RIGHT (video placeholder frame).   */
/* ------------------------------------------------------------------ */
function HeroVideoPlaceholder() {
  return (
    <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-surface to-surface-2">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/90 text-bg shadow-sm">
          <Play size={22} fill="currentColor" strokeWidth={0} className="ml-0.5" />
        </div>
        <span className="font-mono text-xs uppercase tracking-[0.08em] text-text-dim">
          Founder video — coming
        </span>
      </div>
      {/* Faint corner framing so the placeholder still reads as a deliberate
          16:9 video frame, not a broken image, before the real clip lands. */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-border-strong/40" aria-hidden />
    </div>
  );
}

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
          data-celly-avoid
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
            out loud.
          </p>
          {/* One-line price tease (Shamil v2): the only pricing mention until
              the full 3-tier section late in the page. */}
          <p className="mt-3 font-mono text-sm text-accent">
            $97 a month. First week free.
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
          data-celly-avoid
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease, delay: 0.15 }}
          className="flex w-full shrink-0 justify-center md:w-auto"
        >
          <HeroVideoPlaceholder />
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
          data-celly-avoid
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
      <div data-celly-avoid className="mt-4">
        <SceneIndustriesCarousel />
      </div>
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <TryForFreeCta />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section 3 — Pipeline proof. v5: Variant A (the connected stepper)   */
/* won Shamil's side-by-side review; Variant B + the toggle are gone.  */
/* Node icons upgraded to inline-SVG flat illustrations — see the      */
/* Illustration* components below, shared 3-tone palette + neutral.    */
/* ------------------------------------------------------------------ */

// Shared illustration palette — matches the brand tokens used elsewhere
// on the site (sage accent, clay badge color, cream surfaces) plus one
// neutral for card/column backdrops. Hardcoded hex (not CSS var()) so the
// SVGs render correctly regardless of how the browser resolves custom
// properties inside inline SVG presentation attributes.
const ILLO_SAGE = "#7ea687";
const ILLO_CLAY = "#a8503f";
const ILLO_CREAM = "#F5F1E8";
const ILLO_NEUTRAL = "#D4CDB8";

/** Shared rounded backdrop every step illustration sits on — keeps the
 *  four scenes reading as one consistent set. */
function IllustrationBackdrop({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 120 120" className="h-20 w-20 md:h-24 md:w-24" aria-hidden>
      <rect x="1" y="1" width="118" height="118" rx="28" fill={ILLO_CREAM} stroke={ILLO_NEUTRAL} strokeWidth="1.5" />
      {children}
    </svg>
  );
}

/** Step 1 — lead generation: a megaphone with radiating captured leads. */
function IllustrationLeadGen() {
  return (
    <IllustrationBackdrop>
      <path d="M40 46 L74 34 L74 78 L40 66 Z" fill={ILLO_CLAY} />
      <rect x="28" y="50" width="14" height="12" rx="4" fill={ILLO_CLAY} />
      <rect x="70" y="30" width="7" height="52" rx="3.5" fill={ILLO_SAGE} />
      <circle cx="90" cy="40" r="4.5" fill={ILLO_SAGE} />
      <circle cx="98" cy="53" r="3.5" fill={ILLO_SAGE} opacity="0.75" />
      <circle cx="102" cy="67" r="2.5" fill={ILLO_SAGE} opacity="0.5" />
    </IllustrationBackdrop>
  );
}

/** Step 2 — lead capture: a phone answering into an active chat bubble. */
function IllustrationLeadCapture() {
  return (
    <IllustrationBackdrop>
      <rect x="30" y="26" width="30" height="54" rx="10" fill={ILLO_SAGE} />
      <rect x="36" y="34" width="18" height="32" rx="4" fill={ILLO_CREAM} />
      <rect x="60" y="48" width="32" height="24" rx="9" fill={ILLO_CLAY} />
      <path d="M64 70 L58 78 L70 72 Z" fill={ILLO_CLAY} />
      <circle cx="69" cy="60" r="2.4" fill={ILLO_CREAM} />
      <circle cx="77" cy="60" r="2.4" fill={ILLO_CREAM} />
      <circle cx="85" cy="60" r="2.4" fill={ILLO_CREAM} />
    </IllustrationBackdrop>
  );
}

/** Step 3 — lead management: a tiny pipeline board with staged cards. */
function IllustrationLeadMgmt() {
  return (
    <IllustrationBackdrop>
      <rect x="22" y="28" width="24" height="64" rx="6" fill={ILLO_NEUTRAL} opacity="0.55" />
      <rect x="50" y="28" width="24" height="64" rx="6" fill={ILLO_NEUTRAL} opacity="0.55" />
      <rect x="78" y="28" width="24" height="64" rx="6" fill={ILLO_NEUTRAL} opacity="0.55" />
      <rect x="26" y="34" width="16" height="11" rx="3" fill={ILLO_SAGE} />
      <rect x="54" y="34" width="16" height="11" rx="3" fill={ILLO_CLAY} />
      <rect x="54" y="49" width="16" height="11" rx="3" fill={ILLO_SAGE} />
      <rect x="82" y="34" width="16" height="11" rx="3" fill={ILLO_CLAY} />
      <rect x="82" y="49" width="16" height="11" rx="3" fill={ILLO_CLAY} />
      <rect x="82" y="64" width="16" height="11" rx="3" fill={ILLO_SAGE} />
    </IllustrationBackdrop>
  );
}

/** Step 4 — the control panel: a small dashboard with a bar chart + a
 *  live-status dot. */
function IllustrationControlPanel() {
  return (
    <IllustrationBackdrop>
      <rect x="24" y="26" width="72" height="56" rx="8" fill={ILLO_NEUTRAL} opacity="0.45" />
      <circle cx="84" cy="36" r="4" fill={ILLO_SAGE} />
      <rect x="34" y="56" width="9" height="18" rx="2.5" fill={ILLO_SAGE} />
      <rect x="47" y="48" width="9" height="26" rx="2.5" fill={ILLO_CLAY} />
      <rect x="60" y="40" width="9" height="34" rx="2.5" fill={ILLO_SAGE} />
      <rect x="73" y="52" width="9" height="22" rx="2.5" fill={ILLO_CLAY} />
    </IllustrationBackdrop>
  );
}

const PIPELINE_STEPS = [
  {
    step: "01",
    kicker: "Lead generation",
    title: "Where your next ten customers come from.",
    body: "Funnels, forms, a social planner, and review automation that grows your rating. Miss a call and an instant text-back brings the lead back before they dial a competitor.",
    Illustration: IllustrationLeadGen,
  },
  {
    step: "02",
    kicker: "Lead capture",
    title: "Every channel answered.",
    body: "Phone, inbox, DMs, forms — all wired into one pipeline. The AI voice receptionist picks up in two rings. Web chat books appointments. Nothing goes to voicemail.",
    Illustration: IllustrationLeadCapture,
  },
  {
    step: "03",
    kicker: "Lead management",
    title: "Every lead tracked, every follow-up automated.",
    body: "Your branded CRM, your pipeline, your automation. Leads get scored, routed, and followed up — no manual touchpoints, no lead left waiting.",
    Illustration: IllustrationLeadMgmt,
  },
  {
    step: "04",
    kicker: "The control panel",
    title: "Your whole operation, one screen.",
    body: "Calls, chats, forms, emails, deals — all visible in one dashboard. Workflow automation runs underneath. You see where every customer is. You read the dashboard.",
    Illustration: IllustrationControlPanel,
  },
];

/** The winning treatment: 4 illustrated nodes joined by a connecting
 *  line — horizontal row + line on desktop, vertical stack + line on
 *  mobile (375px). */
function PipelineStepper() {
  return (
    <div data-celly-avoid className="mt-12 flex flex-col gap-10 md:flex-row md:items-start md:gap-0">
      {PIPELINE_STEPS.map((s, i) => {
        const isLast = i === PIPELINE_STEPS.length - 1;
        return (
          <motion.div
            key={s.step}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease, delay: i * 0.1 }}
            className="relative flex flex-1 flex-row items-start gap-4 md:flex-col md:items-center md:px-3 md:text-center"
          >
            {/* Connector to the next node — vertical on mobile (down from
                the illustration), horizontal on desktop (across, through
                the row). */}
            {!isLast && (
              <>
                <div
                  className="absolute left-10 top-20 h-[calc(100%-3.5rem)] w-px bg-border md:hidden"
                  aria-hidden
                />
                <div
                  className="absolute top-10 left-1/2 hidden h-px w-full bg-border md:top-12 md:block"
                  aria-hidden
                />
              </>
            )}
            <div className="relative z-10 shrink-0">
              <s.Illustration />
            </div>
            <div className="md:mt-4">
              <div className="font-mono text-xs uppercase tracking-widest text-text-dim">
                {s.step} · {s.kicker}
              </div>
              <h3 className="mt-1 text-base font-semibold leading-snug text-text" style={{ letterSpacing: "-0.01em" }}>
                {s.title}
              </h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-text-muted">{s.body}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function PipelineSection() {
  return (
    <section id="pipeline" data-section="pipeline" className="border-t border-border/40 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <motion.div
          data-celly-avoid
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

        <PipelineStepper />

        <TryForFreeCta />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section 4 — Meet Erken. Visual on the LEFT (alternates from hero). */
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
        <div data-celly-avoid className="grid gap-12 md:grid-cols-2 md:items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease }}
            className="flex justify-center md:order-1 md:justify-start"
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
            className="md:order-2"
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
            {/* v5: all three buttons in one row, same size/rhythm, wrap on
                mobile — was two buttons here plus a separate trailing
                TryForFreeCta stacked right below, which read as a
                redundant fourth button. Download stays the one accent-
                filled button (the primary free-extension CTA); the other
                two are bordered secondaries so the row doesn't turn into
                three competing accent buttons. */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
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
              <a
                href="/start"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3.5 text-base font-medium text-text transition-all hover:border-border-strong hover:bg-surface"
              >
                Try for free →
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section 5 — Pricing. Moved late per Shamil v2 review — appears once, */
/* right before the closing Custom-solutions/Get-leads offers, after   */
/* the trial CTA has already repeated three times above.               */
/*                                                                      */
/* v5 addendum: full /start-style plan cards, not a compact tease row — */
/* Shamil's call: showing everything included right on the homepage    */
/* beats a tease. Same card language as /start's PlanCard (border, tier */
/* name, large price, note, "What's included" list) minus the email    */
/* capture form — each card's CTA just sends you to /start.            */
/* ------------------------------------------------------------------ */

// Mirrors /start's PLAN_FEATURES exactly — same platform, every tier,
// the only difference is the prepay term.
const PLAN_FEATURES = [
  "CRM + pipelines",
  "Calendars + booking",
  "Automations + follow-ups",
  "AI voice receptionist",
  "Reputation + review management",
  "Erken assistant included",
  "Free first week",
];

const PRICE_TIERS: {
  label: string;
  price: string;
  note: string;
  badge?: "default" | "best-value";
}[] = [
  { label: "Monthly", price: "$97/mo", note: "billed monthly", badge: "default" },
  { label: "6 months", price: "$87/mo", note: "$522 once — save 10%" },
  { label: "Yearly", price: "$81/mo", note: "$970 once — 2 months free", badge: "best-value" },
];

function PlanCardTease({ tier }: { tier: (typeof PRICE_TIERS)[number] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease }}
      whileHover={{ y: -2 }}
      className={`relative flex flex-col rounded-2xl border bg-surface p-8 transition-colors duration-200 ${
        tier.badge === "default"
          ? "border-2 border-accent hover:border-accent-hover"
          : "border-border hover:border-border-strong"
      }`}
    >
      {tier.badge === "default" && (
        <span className="absolute right-6 top-6 rounded-full border border-accent px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.05em] text-accent">
          Default
        </span>
      )}
      {tier.badge === "best-value" && (
        <span className="absolute right-6 top-6 rounded-full bg-accent px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.05em] text-bg">
          Best value
        </span>
      )}
      <h3 className="text-lg font-semibold text-text">{tier.label}</h3>
      <div className="mt-2">
        <span className="text-3xl font-bold tracking-tight text-text" style={{ letterSpacing: "-0.03em" }}>
          {tier.price}
        </span>
        <span className="ml-2 text-xs text-text-dim">{tier.note}</span>
      </div>
      <p className="mt-4 font-mono text-xs uppercase tracking-[0.05em] text-text-dim">
        What&apos;s included
      </p>
      <ul className="mt-2 flex-1 space-y-1.5 text-sm text-text-muted">
        {PLAN_FEATURES.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={2.5} />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <a
        href="/start"
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-bg transition-all hover:bg-accent-hover hover:scale-[1.02]"
      >
        Start with {tier.label.toLowerCase()} →
      </a>
    </motion.div>
  );
}

function PricingSection() {
  return (
    <section id="pricing" data-section="pricing" className="border-t border-border/40 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <motion.div
          data-celly-avoid
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
            Same platform, every tier — the only difference is the prepay term.
          </p>
        </motion.div>

        <div data-celly-avoid className="mt-10 grid gap-6 md:grid-cols-3">
          {PRICE_TIERS.map((t) => (
            <PlanCardTease key={t.label} tier={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section 6 — Custom solutions (NEW, Shamil v2). Owns the "don't want */
/* to set it up yourself" framing — mirrors /start's CustomSolutionsCard. */
/* ------------------------------------------------------------------ */
function CustomSolutionsSection() {
  return (
    <section id="custom-solutions" data-section="custom-solutions" className="border-t border-border/40 py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-6 text-center md:px-8">
        <motion.div
          data-celly-avoid
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease }}
        >
          <SectionKicker>Custom solutions</SectionKicker>
          <h2
            className="mt-3 text-3xl font-bold tracking-tight md:text-5xl"
            style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
          >
            Don&apos;t want to set it up yourself?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-text-muted md:text-lg">
            Describe what you need — we configure your platform for you and send
            you an offer. Custom automations, custom pipelines, any platform
            configuration — tell us what you&apos;re trying to do and we&apos;ll
            assess it.
          </p>
          <div className="mt-8 flex justify-center">
            <a
              href="/start"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-base font-medium text-bg transition-all hover:bg-accent-hover hover:scale-[1.02]"
            >
              Get a custom offer →
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section 7 — Get leads (REFRAMED, Shamil v2). Its own honest angle — */
/* this is for companies that want customers, not software. Coming    */
/* soon: matches /start's inactive GetLeadsCard tone. No dead-end CTA —*/
/* links to /start where the coming-soon card lives.                   */
/* ------------------------------------------------------------------ */
function GetLeadsSection() {
  return (
    <section id="get-leads" data-section="get-leads" className="border-t border-border/40 py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-6 text-center md:px-8">
        <motion.div
          data-celly-avoid
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease }}
        >
          <span className="inline-block rounded-full bg-[var(--clay)] px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.05em] text-bg">
            Coming soon
          </span>
          <h2
            className="mt-4 text-3xl font-bold tracking-tight md:text-5xl"
            style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
          >
            You don&apos;t want software — you want customers.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-text-muted md:text-lg">
            We run and market our own lead-generating sites in your industry.
            Partner with us and we hand you live leads — delivered by phone —
            for a share of the revenue.
          </p>
          <p className="mt-4 text-sm text-text-dim">This offer isn&apos;t live yet.</p>
          {/* v5 addendum: was a plain text link — now a proper button, same
              CTA language as the rest of the page. Still routes to /start,
              where it lands on the real inactive "Coming soon" card
              (GetLeadsCard) — not a dead end, just not a live signup here. */}
          <div className="mt-6 flex justify-center">
            <a
              href="/start"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-base font-medium text-bg transition-all hover:bg-accent-hover hover:scale-[1.02]"
            >
              See it on our plans page →
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
      <MeetErkenSection />
      <PricingSection />
      <CustomSolutionsSection />
      <GetLeadsSection />
      {/* Footer removed (Shamil's call, v5). RoamingErken mounts
          ErkenChatWidget + ErkenVoiceWidget itself — see that file. */}
      <RoamingErken />
    </main>
  );
}
