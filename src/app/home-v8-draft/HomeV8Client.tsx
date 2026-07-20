"use client";

/**
 * HomeV8Client — a COPY of the live homepage (preview-v7) restructured to
 * the approved /home-draft order (2026-07-20). See ./page.tsx for the
 * section-order rationale.
 *
 * What is inherited verbatim from preview-v7 (so every live effect survives):
 *   - SphereScrollStage (Three.js fixed cell-dragon canvas + dust)
 *   - The roaming Celly overlay: findEmptySpot auto-positioner,
 *     scroll-driven dragon-draw, on-stop fly-to-empty-spot, click-to-chat
 *     menu (Text/Voice/Feedback/Roadmap/What's new), chat-dock pin, the
 *     gooey cloud speech bubble.
 *
 * What changed from preview-v7:
 *   - The four full-screen pipeline step scenes (SECTIONS[1..4] with
 *     Scene2Channels / Scene3LeadCaptureCarousel / Scene4LeadMgmtCarousel /
 *     MacbookFrame3D) are REPLACED by a HubSpot-style sticky-column
 *     pipeline section (Shamil-approved mid-build 2026-07-20): a pinned
 *     left story column + a right-side stack of PHASE PANELS modeled on the
 *     customer-growth pipeline (Capture / Nurture / Close / fans /
 *     win-back). All phases are always expanded (rev-3), each showing its
 *     full checklist in a 2-col grid. Flat-SVG phase icons, home-draft style.
 *   - Industries moved UP to 2nd (right after the hero).
 *   - Hero keeps the live founder video + gains the price tease and a
 *     "See your industry" secondary button.
 *   - Meet Erken → five sell bullets + three CTAs in one row.
 *   - Added: full /start-style pricing cards, Custom solutions, Get leads
 *     door. Added a sticky DraftHeader (logo / Industries / How it works /
 *     Pricing / persistent Try-for-free), z-50 above everything.
 *   - No footer.
 *   - sectionCount lowered to the new section count; sectionYOverrides
 *     dropped and SCENE_OFFSETS collapsed to a generic default (the old
 *     per-scene offsets were calibrated to the OLD order; the on-stop
 *     findEmptySpot auto-positioner is what actually places Celly, so a
 *     generic anchor is correct here — see the SCENE_OFFSETS note below).
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { SphereScrollStage, type CellPositionInfo } from "@/components/SphereScrollStage";
import { Scene1IntroVideo } from "@/components/Scene1IntroVideo";
import { SceneIndustriesCarousel } from "@/components/SceneIndustriesCarousel";
import { CellDragonSprite } from "@/components/CellDragonSprite";
import ErkenChatWidget, {
  openErkenChat,
  useErkenChatOpen,
} from "@/components/ErkenChatWidget";
import ErkenVoiceWidget from "@/components/ErkenVoiceWidget";

const ease = [0.16, 1, 0.3, 1] as const;

const CHROME_EXTENSION_URL =
  "https://chromewebstore.google.com/detail/erken/mggcbjggcbdpmbglbodkadgmpapcmelc";

// v8 restructure: only the HERO stays as an L/R Section. The four
// full-screen pipeline step scenes that used to follow it are replaced by
// the compressed illustrated PipelineStepper below. The hero keeps the
// live founder video (Scene1IntroVideo) and gains a one-line price tease +
// a "See your industry" secondary button (home-draft additions).
const SECTIONS = [
  {
    side: "left" as const,
    kicker: "Erken Systems",
    headline: "One platform runs your business. Erken teaches you how.",
    body: "If you can answer your phone, you can run this. Every business runs the same pipeline — leads come in, get captured, get tracked, get reported on. The platform runs all four steps. And Erken — the assistant living on every screen — shows you the right button and walks you through any task, out loud. The assistant is free.",
    cta: "Try for free",
    priceTease: "$97 a month. First week free.",
    secondaryCta: { label: "See your industry", href: "#industries" },
  },
];

type SectionProps = typeof SECTIONS[number] & {
  media?: React.ReactNode;
  /** Full wrapper className for the absolute media container. Default is
   *  set for the 3D MacBook (large transparent canvas extending past the
   *  section). Compact HTML media (carousel/tabs) should override with a
   *  tighter wrapper that sits within the section bounds. */
  mediaWrapperClassName?: string;
  /** Whether the media wrapper should mark itself as a Celly-avoid zone.
   *  Default true (compact opaque media like cards/carousels need it).
   *  Set false for sparse 3D scenes (MacBook) where Celly can safely
   *  float over the transparent canvas — otherwise the wrapper's 90%-wide
   *  bounding box leaves no room for Celly in the section (Shamil round
   *  43). */
  mediaAvoidCelly?: boolean;
};

const DEFAULT_MEDIA_WRAPPER = (isLeft: boolean) =>
  `absolute -top-[55vh] -bottom-[10vh] ${isLeft ? "-right-12" : "-left-12"} hidden md:flex md:w-[90%] items-center justify-center px-2 lg:px-4 pointer-events-none`;

function Section({
  kicker,
  headline,
  body,
  side,
  cta,
  priceTease,
  secondaryCta,
  media,
  mediaWrapperClassName,
  mediaAvoidCelly = true,
  isMobile = false,
  stacked = false,
  heroBackground = false,
}: SectionProps & { isMobile?: boolean; stacked?: boolean; heroBackground?: boolean }) {
  const isLeft = side === "left";
  const wrapperClass = mediaWrapperClassName ?? DEFAULT_MEDIA_WRAPPER(isLeft);
  return (
    // When media is stacked under the text the section must NOT be a flex
    // row — otherwise the w-full media lands BESIDE the text column and
    // overflows the viewport (2026-06-10 responsive QA).
    <section
      className={`relative px-6 md:px-12 py-10 ${heroBackground ? "overflow-hidden " : ""}${
        stacked && media
          ? "md:py-16"
          : "md:min-h-screen md:flex md:items-center md:py-0"
      }`}
    >
      {/* Hero background (home-draft port): a soft top radial glow + the faint
          tile grid, both under the content (and under the fixed 3D dust
          canvas at z-45). aria-hidden, non-interactive. */}
      {heroBackground && (
        <>
          <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden />
          <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        </>
      )}
      {/* 2026-06-10 responsive fix (Shamil: keep side-by-side at EVERY
          width, never stack): the column takes 44% instead of 50% so the
          media wrapper can anchor at the 48vw line without ever crossing
          it, and the type scales down on narrow laptops/tablets instead
          of overflowing into the media. */}
      <div
        data-celly-avoid
        className={`relative z-30 w-full md:w-[44%] ${isLeft ? "md:mr-auto" : "md:ml-auto"} max-w-xl`}
      >
        <div className="mono-label">{kicker}</div>
        <h2
          className="mt-3 text-3xl md:text-4xl xl:text-5xl font-bold tracking-tight"
          style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
        >
          {headline}
        </h2>
        <p className="mt-5 text-base xl:text-lg text-text-muted leading-relaxed">
          {body}
        </p>
        {/* One-line price tease (home-draft v2): the only pricing mention
            until the full 3-tier section late in the page. */}
        {priceTease && (
          <p className="mt-3 font-mono text-sm text-accent">{priceTease}</p>
        )}
        {(cta || secondaryCta) && (
          <div className="mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            {cta && (
              /* CTA → the /start trial funnel (was the voice call —
                 repositioned 2026-06-12: the site sells the products, Celly
                 handles talking) */
              <a
                href="/start"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-medium text-bg transition-all hover:bg-accent-hover"
              >
                {cta} →
              </a>
            )}
            {secondaryCta && (
              /* Secondary "See your industry" → scrolls to #industries
                 (home-draft addition). */
              <a
                href={secondaryCta.href}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-medium text-text transition-all hover:border-border-strong hover:bg-surface"
              >
                {secondaryCta.label}
              </a>
            )}
          </div>
        )}
      </div>
      {/* STACKED media — rendered OUTSIDE the text column so it breaks
          out of the max-w-xl cap and spans the full section width.
          (Shamil 2026-05-25: especially needed for the MacBook 3D
          scene that has no side text on mobile.)
          2026-06-10: now also used on TABLET + SMALL-LAPTOP widths —
          the absolute side-by-side wrappers mathematically overlap the
          text column below ~1280px (responsive QA: text painted over
          carousel cards on every width 768–1640), so those widths stack
          text-then-media instead. */}
      {media && (isMobile || stacked) && (
        <div
          {...(mediaAvoidCelly ? { "data-celly-avoid": "" } : {})}
          className="mt-10 w-full"
        >
          {media}
        </div>
      )}
      {media && !isMobile && !stacked && (
        <div
          {...(mediaAvoidCelly ? { "data-celly-avoid": "" } : {})}
          className={wrapperClass}
        >
          {media}
        </div>
      )}
    </section>
  );
}

// Celly's introduction copy — three variants for adaptive sizing
// (Shamil 2026-05-24 round 14). Auto-positioner picks the largest
// variant that fits without overlapping content. If even SHORT doesn't
// fit, bubble is hidden entirely.
type BubbleVariant = {
  text: string;
  widthRem: number;
  paddingVw: number;
  paddingVh: number;
};
const CELLY_VARIANTS: BubbleVariant[] = [
  {
    // LONG — full pitch
    text:
      "Hi, I'm Erken. Shamil built this site with me — I'm wired into everything he knows. Every project, every system, every lesson from ten years of building. Ask me anything about him, his work, or what we'd build for you.",
    widthRem: 22,
    paddingVw: 9,
    paddingVh: 11,
  },
  {
    // MEDIUM — condensed
    text:
      "Hi, I'm Erken. I'm Shamil's assistant — I know every project, every system, every lesson. Ask me anything.",
    widthRem: 17,
    paddingVw: 7,
    paddingVh: 7,
  },
  {
    // SHORT — one-liner
    text: "Hi, I'm Erken. Ask me anything.",
    widthRem: 12,
    paddingVw: 5,
    paddingVh: 4,
  },
];
const CELLY_INTRO = CELLY_VARIANTS[0].text; // initial / fallback

const SCROLL_STOP_DELAY_MS = 700; // wait this long after scrolling stops before showing the bubble

/**
 * Find an empty spot in the viewport for Celly (or the bubble) to land
 * when scroll stops. Queries all elements with the data-celly-avoid
 * attribute, gets their bounding rects, then samples a coarse grid of
 * candidate positions and scores each by how empty the surrounding
 * space is + how close it is to a "preferred" anchor.
 *
 * Shamil 2026-05-24 round 11: this replaces hand-tuned per-scene
 * positions. Every section just tags its content elements with
 * data-celly-avoid and the auto-positioner picks the empty corner.
 */
type AvoidRect = { left: number; right: number; top: number; bottom: number };

function findEmptySpot(opts: {
  preferredXVw: number;
  preferredYVh: number;
  /** Approximate sprite half-size in vw — used to keep candidate
   *  positions clear of viewport edges by this margin. */
  paddingVw: number;
  paddingVh: number;
  /** Extra rects to avoid beyond what's in the DOM (e.g. Celly herself
   *  when positioning the bubble — bubble should avoid her body). */
  extraAvoidRects?: AvoidRect[];
  /** Inflate every avoid rect by this many vw on all sides before the
   *  inside-rect check. Gives the chosen spot some breathing room from
   *  content edges. Default = 2vw. */
  avoidBuffer?: number;
  /** Hard cap: reject any candidate further than this many vw from the
   *  preferred anchor. Used to keep bubble near Celly. */
  maxDistFromAnchor?: number;
  /** Weight on the distance-to-anchor penalty. Higher = pickier about
   *  proximity to the anchor. Default = 0.3. */
  distancePenaltyWeight?: number;
}): { xVw: number; yVh: number; minDist: number } {
  if (typeof window === "undefined") {
    return { xVw: opts.preferredXVw, yVh: opts.preferredYVh, minDist: 0 };
  }
  const vw = window.innerWidth / 100;
  const vh = window.innerHeight / 100;
  // Pull avoid rects from the DOM.
  const avoidEls = document.querySelectorAll<HTMLElement>("[data-celly-avoid]");
  const avoidRects: AvoidRect[] = [];
  avoidEls.forEach((el) => {
    const r = el.getBoundingClientRect();
    // Only count elements at least partially visible in the viewport
    if (r.bottom < 0 || r.top > window.innerHeight) return;
    if (r.right < 0 || r.left > window.innerWidth) return;
    avoidRects.push({
      left: r.left / vw,
      right: r.right / vw,
      top: r.top / vh,
      bottom: r.bottom / vh,
    });
  });
  if (opts.extraAvoidRects) {
    avoidRects.push(...opts.extraAvoidRects);
  }
  // Sample a denser 25x17 grid of candidate positions and score each
  // (was 13x9 — Shamil round 47: too coarse to find the narrow ~6-8vw
  // gaps between content columns in Step 1/2/3 layouts, so Celly was
  // falling back to her preferred position which landed on body text).
  // Avoid rects are INFLATED by avoidBuffer so the chosen spot has
  // breathing room from any content edge.
  const buffer = opts.avoidBuffer ?? 2;
  const penalty = opts.distancePenaltyWeight ?? 0.3;
  const GX = 24;
  const GY = 16;
  // Strict-pass best (no avoid-rect overlap). Used when we find at
  // least one truly empty candidate.
  let bestStrict = { xVw: 0, yVh: 0, score: -Infinity, minDist: 0 };
  // Soft-pass best — best candidate even if it overlaps avoid rects,
  // scored by how SHALLOWLY it penetrates (smaller penetration = better).
  // Used as a fallback when no strict candidate exists.
  let bestSoft = { xVw: opts.preferredXVw, yVh: opts.preferredYVh, score: -Infinity, minDist: 0 };
  for (let gx = 0; gx <= GX; gx++) {
    for (let gy = 0; gy <= GY; gy++) {
      const cxVw = (gx / GX) * 100;
      const cyVh = (gy / GY) * 100;
      // Skip candidates too close to viewport edge.
      if (cxVw - opts.paddingVw < 2 || cxVw + opts.paddingVw > 98) continue;
      if (cyVh - opts.paddingVh < 2 || cyVh + opts.paddingVh > 98) continue;
      // Hard distance cap from anchor (used for the bubble to stay near
      // Celly).
      const dxPref = cxVw - opts.preferredXVw;
      const dyPref = cyVh - opts.preferredYVh;
      const distToPref = Math.sqrt(dxPref * dxPref + dyPref * dyPref);
      if (opts.maxDistFromAnchor !== undefined && distToPref > opts.maxDistFromAnchor) continue;
      // For each avoid rect, compute either:
      //   distance OUTSIDE the inflated rect (positive — strict pass)
      //   OR penetration depth INSIDE the rect (positive — soft pass)
      let minDist = 100;       // smallest "outside" distance
      let maxPenetration = 0;  // deepest "inside" penetration across all rects
      let inside = false;
      for (const r of avoidRects) {
        const inflLeft = r.left - buffer;
        const inflRight = r.right + buffer;
        const inflTop = r.top - buffer;
        const inflBottom = r.bottom + buffer;
        const dx = Math.max(inflLeft - cxVw, 0, cxVw - inflRight);
        const dy = Math.max(inflTop - cyVh, 0, cyVh - inflBottom);
        const dyAsVw = dy * (window.innerHeight / window.innerWidth);
        const d = Math.sqrt(dx * dx + dyAsVw * dyAsVw);
        if (d === 0) {
          // Inside this rect — measure how deep (distance from candidate
          // to the NEAREST rect edge).
          inside = true;
          const penLeft = cxVw - inflLeft;
          const penRight = inflRight - cxVw;
          const penTop = cyVh - inflTop;
          const penBottom = inflBottom - cyVh;
          const nearestEdge = Math.min(penLeft, penRight, penTop, penBottom);
          if (nearestEdge > maxPenetration) maxPenetration = nearestEdge;
        } else if (d < minDist) {
          minDist = d;
        }
      }
      if (!inside) {
        // Strict candidate — score normally.
        const score = minDist - distToPref * penalty;
        if (score > bestStrict.score) {
          bestStrict = { xVw: cxVw, yVh: cyVh, score, minDist };
        }
      } else {
        // Soft candidate — score by NEGATIVE penetration (shallower
        // overlap is better). Distance-to-anchor penalty still applies
        // so it prefers nearby fallbacks. Subtract a big constant so
        // even the best soft score is worse than any strict score.
        const score = -maxPenetration - distToPref * penalty - 1000;
        if (score > bestSoft.score) {
          bestSoft = { xVw: cxVw, yVh: cyVh, score, minDist: 0 };
        }
      }
    }
  }
  // Prefer the strict candidate. Fall back to soft if no strict found.
  const best = bestStrict.score > -Infinity ? bestStrict : bestSoft;
  return { xVw: best.xVw, yVh: best.yVh, minDist: best.minDist };
}

/* ================================================================== */
/* Ported section content from /home-draft (the approved restructure). */
/* These render INSIDE the SphereScrollStage children so the live       */
/* cell-dragon canvas + roaming Celly pass over them natively. Every    */
/* main content block keeps its data-celly-avoid tag so the on-stop     */
/* findEmptySpot() auto-positioner has real geometry to avoid.          */
/* ================================================================== */

function SectionKicker({ children }: { children: React.ReactNode }) {
  return <div className="mono-label">{children}</div>;
}

/** Repeated CTA row — used after Industries, Pipeline, and Meet Erken so
 *  the trial offer stays close by without scrolling back up. */
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

/** Sticky header — logo + Industries / How it works / Pricing anchors +
 *  persistent "Try for free". z-50 (not z-40) matches the live Header.tsx
 *  and clears SceneIndustriesCarousel's z-40 arrow buttons (the carousel
 *  arrow stacking bug from Shamil's live review). Tagged data-celly-avoid
 *  so Celly never parks under it. */
function DraftHeader() {
  return (
    <header
      data-celly-avoid
      className="sticky top-0 z-50 w-full border-b border-border/60 bg-bg/85 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-8">
        <a
          href="/"
          className="font-mono text-sm font-medium tracking-tight uppercase text-text"
        >
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

/* ---- Industries (moved up to 2nd — the self-identification hook) ---- */
function IndustriesSection() {
  return (
    <section id="industries" className="py-20 md:py-28">
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

/* ---- Pipeline section (HubSpot-style sticky-column, v8 mid-build change,
 * Shamil-approved 2026-07-20). LEFT column pins (CSS sticky) with the story;
 * the RIGHT column is a stack of always-expanded phase panels (Capture /
 * Nurture / Close / fans / win-back), each showing its full checklist in a
 * 2-col grid. Replaces the Variant-A stepper, the capability-card grid, and
 * the earlier accordion.
 *
 * Flat-SVG illustrations (soft rounded shapes, sage/clay/cream + neutral)
 * serve as the phase icons. Palette hardcoded (not CSS var()) so the SVGs
 * render correctly inside inline presentation attributes. */
const ILLO_SAGE = "#7ea687";
const ILLO_CLAY = "#a8503f";
const ILLO_CREAM = "#F5F1E8";
const ILLO_NEUTRAL = "#D4CDB8";

/** Shared rounded backdrop. Default size is the compact ~44px used by the
 *  capability cards; pass className to override. */
function IllustrationBackdrop({
  children,
  className = "h-11 w-11 shrink-0",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
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

/** Lead management / pipeline: a tiny pipeline board with staged cards. */
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

/** Automations / re-engage — three connected nodes (a small flow graph). */
function IllustrationAutomations() {
  return (
    <IllustrationBackdrop>
      <path d="M40 44 H80" stroke={ILLO_NEUTRAL} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M44 51 L58 74" stroke={ILLO_NEUTRAL} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M76 51 L62 74" stroke={ILLO_NEUTRAL} strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="40" cy="44" r="10" fill={ILLO_SAGE} />
      <circle cx="80" cy="44" r="10" fill={ILLO_NEUTRAL} />
      <circle cx="60" cy="80" r="10" fill={ILLO_CLAY} />
    </IllustrationBackdrop>
  );
}

/** Reputation + reviews — a five-point star. */
function IllustrationReviews() {
  return (
    <IllustrationBackdrop>
      <path
        d="M60 30 L66.5 49.1 L86.6 49.4 L70.5 61.4 L76.5 80.7 L60 69 L43.5 80.7 L49.5 61.4 L33.4 49.4 L53.5 49.1 Z"
        fill={ILLO_CLAY}
      />
    </IllustrationBackdrop>
  );
}

/** Conversation / nurture — two chat bubbles going back and forth. */
function IllustrationAssistant() {
  return (
    <IllustrationBackdrop>
      <rect x="26" y="32" width="50" height="34" rx="12" fill={ILLO_SAGE} />
      <path d="M36 64 L33 78 L48 66 Z" fill={ILLO_SAGE} />
      <circle cx="40" cy="49" r="3.2" fill={ILLO_CREAM} />
      <circle cx="51" cy="49" r="3.2" fill={ILLO_CREAM} />
      <circle cx="62" cy="49" r="3.2" fill={ILLO_CREAM} />
      <rect x="64" y="60" width="30" height="26" rx="10" fill={ILLO_CLAY} />
      <path d="M86 84 L90 95 L75 86 Z" fill={ILLO_CLAY} />
    </IllustrationBackdrop>
  );
}

// The customer-growth pipeline as phases (the model the underlying platform's
// own homepage uses — Capture / Nurture / Close / Evangelize / Reactivate).
// We resell full platform sub-accounts, so every capability the platform
// lists genuinely exists for our clients — these are the FULL per-phase
// lists (rev-3 reverses the earlier conservative trim), rewritten in
// plain-operator English with ZERO platform-vendor mentions.
//
// DROPPED THIS PASS: nothing. The earlier draft trimmed the payments/close
// stack (invoicing, estimates & proposals, payments, upsells/downsells,
// memberships & courses, text/tap-to-pay, gift cards, loyalty), affiliate/
// referral tracking, ringless voicemail, mobile app, content AI, webinar &
// ad tooling, biz-card scanner, QR codes — all now RESTORED because the
// sub-account genuinely includes them. PRUNE-LATER CANDIDATES (flag for
// Shamil, not yet removed): "Business-card scanner" and "QR codes" (niche);
// "Prospecting Tool" was omitted as too vague to promise. Keep this note in
// sync as we prune with him.
const PHASES: {
  name: string;
  tagline: string;
  Illustration: () => React.ReactElement;
  items: string[];
}[] = [
  {
    name: "Capture",
    tagline: "Get more leads in the door",
    Illustration: IllustrationLeadGen,
    items: [
      "Websites & landing pages",
      "Sales funnels",
      "Webinar funnels",
      "Forms & surveys",
      "Quizzes",
      "AI voice receptionist",
      "Web chat widget",
      "Missed-call text-back",
      "Call tracking",
      "Inbound texts & DMs",
      "Social media planner",
      "Google & Facebook ads",
      "QR codes",
      "Business-card scanner",
    ],
  },
  {
    name: "Nurture",
    tagline: "Turn interest into trust",
    Illustration: IllustrationAssistant,
    items: [
      "One unified inbox",
      "Text, Messenger, IG & WhatsApp",
      "Conversation AI replies",
      "Sales pipelines",
      "Workflows & automations",
      "Booking calendars",
      "Appointment reminders",
      "Saved reply snippets",
      "Ringless voicemail drops",
      "Automated outbound calls",
      "Mobile app + video messages",
    ],
  },
  {
    name: "Close",
    tagline: "Turn conversations into customers",
    Illustration: IllustrationLeadMgmt,
    items: [
      "Lead scoring",
      "Estimates & proposals",
      "Invoicing",
      "Card payments built in",
      "Text-to-pay links",
      "Tap-to-pay on your phone",
      "Paid booking calendars",
      "Order forms",
      "Upsells & downsells",
      "One-click upsell funnels",
      "Memberships & courses",
      "Gift cards",
      "Loyalty programs",
    ],
  },
  {
    name: "Turn customers into fans",
    tagline: "Reviews that bring the next one in",
    Illustration: IllustrationReviews,
    items: [
      "Automated review requests",
      "Reputation management",
      "AI review replies",
      "Website review widgets",
      "Video review capture",
      "Referral & affiliate tracking",
      "Auto-post reviews to social",
      "Recommendation automations",
      "Customer communities",
      "Loyalty rewards",
    ],
  },
  {
    name: "Win back old customers",
    tagline: "Get back on their radar",
    Illustration: IllustrationAutomations,
    items: [
      "Email, SMS & WhatsApp blasts",
      "Smart lists & segmenting",
      "Automated birthday campaigns",
      "Seasonal campaigns",
      "Reactivation templates",
      "Newsletter automation",
      "Content AI for copy",
      "Loyalty programs",
    ],
  },
];

/** Static, always-expanded phase panels (Shamil's rev-3 call: no accordion —
 *  every phase shows its full checklist at once). Each phase's items render
 *  in a 2-column grid so five fully-open phases don't become one mile-long
 *  column beside the sticky-left story. Each panel still fades in on scroll
 *  (whileInView) for the smooth feel, but nothing collapses. Mobile: phases
 *  stack full-width; the item grid stays 2-col (items are short) but drops
 *  to 1 col on the very narrowest widths. */
function PipelinePhases() {
  return (
    <div data-celly-avoid className="flex flex-col gap-4">
      {PHASES.map((phase, i) => (
        <motion.div
          key={phase.name}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45, ease, delay: i * 0.05 }}
          className="rounded-2xl border border-border bg-surface p-5"
        >
          <div className="flex items-center gap-4">
            <phase.Illustration />
            <div>
              <div
                className="text-base font-semibold text-text"
                style={{ letterSpacing: "-0.01em" }}
              >
                {phase.name}
              </div>
              <div className="mt-0.5 text-xs text-text-muted md:text-sm">
                {phase.tagline}
              </div>
            </div>
          </div>
          <ul className="mt-4 grid grid-cols-1 gap-x-5 gap-y-2 border-t border-dashed border-border pt-4 min-[420px]:grid-cols-2">
            {phase.items.map((it) => (
              <li key={it} className="flex items-start gap-2 text-sm leading-snug text-text-muted">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" strokeWidth={2.5} />
                <span>{it}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}

/** HubSpot-style two-column pipeline section: sticky story on the left, the
 *  always-expanded phase panels on the right. */
function PipelineSection() {
  return (
    <section id="pipeline" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div className="grid gap-10 md:grid-cols-2 md:items-start md:gap-12 lg:gap-16">
          {/* LEFT — the story, pinned below the header while the cards
              scroll past. Plain CSS sticky; top offset clears the sticky
              header. On mobile it's a normal (non-sticky) leading block. */}
          <div className="md:sticky md:top-24 md:self-start">
            <motion.div
              data-celly-avoid
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, ease }}
            >
              <SectionKicker>How it runs</SectionKicker>
              <h2
                className="mt-3 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
                style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
              >
                One pipeline runs it all.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-text-muted md:text-lg">
                Every customer moves through the same five stages — from first
                click to a repeat visit. The whole platform runs each one
                underneath your business, so you never stitch tools together.
                You just watch it work.
              </p>
              <p className="mt-3 text-base leading-relaxed text-text-muted md:text-lg">
                Open a stage to see what runs inside it.
              </p>
              <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <a
                  href="/start"
                  className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-base font-medium text-bg transition-all hover:bg-accent-hover hover:scale-[1.02]"
                >
                  Try for free →
                </a>
                <a
                  href="#pricing"
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3.5 text-base font-medium text-text transition-all hover:border-border-strong hover:bg-surface"
                >
                  See pricing
                </a>
              </div>
            </motion.div>
          </div>

          {/* RIGHT — phase accordion (full width; stacks + taps to expand
              on mobile). */}
          <div className="w-full">
            <PipelinePhases />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---- Meet Erken — live centered section, updated to 5 sell bullets +
 * three CTAs in one row (Download for free / Try it on this page / Try for
 * free). ---- */
const ERKEN_BULLETS = [
  { emoji: "🗣️", bold: "Ask it anything", rest: " — by voice or chat, about the platform or your business" },
  { emoji: "👉", bold: "Shows you the exact button", rest: " — walks you through any task on screen, out loud, step by step" },
  { emoji: "🧠", bold: "Remembers you", rest: " — your business, your setup, where you left off" },
  { emoji: "⚡", bold: "Actions on the way", rest: " — soon it won't just guide, it'll do the task for you" },
  { emoji: "🧩", bold: "Already in your browser", rest: " — free extension, installs in one click" },
];

function MeetErkenSection({
  onSpriteClick,
}: {
  onSpriteClick: (anchorEl: HTMLElement | null) => void;
}) {
  return (
    <section id="meet-erken" className="relative px-6 md:px-12 pt-24 md:pt-36 pb-16 md:pb-24">
      {/* Sprite to the LEFT of the text (rev-3 live corrections). flex row on
          md+; md:items-center vertically centers the sprite against the WHOLE
          text block (header → buttons row inclusive), so her vertical center
          sits at the middle of that block. Stacks (sprite on top, centered)
          on mobile. */}
      <div
        data-celly-avoid
        className="relative z-30 mx-auto flex max-w-3xl flex-col items-center gap-6 text-center md:flex-row md:items-center md:gap-8 md:text-left"
      >
        {/* A static, section-embedded Erken (rev-3 addendum — the section had
            text + buttons but no Erken herself). Same pattern /start uses:
            a modest second CellDragonSprite whose click opens the FULL bot
            menu (Text / Voice / Feedback / Roadmap / What's new / extension)
            anchored beside it — reuses the roaming Celly's openChoiceMenu via
            the onSpriteClick prop (rev-3 live correction: was opening the raw
            chat). Independent of the page-level roaming Celly (which auto-
            hides/repositions), so no conflict. The sprite's own hover float +
            eye-follow come from CellDragonSprite and stay. */}
        <div
          role="button"
          tabIndex={0}
          title="Chat with Erken"
          aria-label="Chat with Erken"
          onClick={(e) => onSpriteClick(e.currentTarget)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onSpriteClick(e.currentTarget);
          }}
          // md:-ml-[75px] shifts her ~75px (≈2cm) further left than the plain
          // gap-8 spacing (rev-3 live correction, supersedes the earlier 1cm).
          // Vertical alignment is handled by the row's md:items-center.
          className="shrink-0 cursor-pointer md:-ml-[75px]"
        >
          <CellDragonSprite scale={0.5} pointDirection="right" />
        </div>
        <div className="flex-1">
        <SectionKicker>Meet Erken</SectionKicker>
        <h2
          className="mt-3 text-3xl md:text-5xl font-bold tracking-tight"
          style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
        >
          The assistant who teaches you the whole platform.
        </h2>
        <div className="mt-6 flex flex-col gap-2.5 text-left text-sm leading-relaxed text-text-muted md:text-base">
          {ERKEN_BULLETS.map((b) => (
            <div key={b.bold}>
              <span aria-hidden>{b.emoji}</span>{" "}
              <b className="text-text">{b.bold}</b>
              {b.rest}
            </div>
          ))}
        </div>
        {/* Three CTAs in one row (Download stays the one accent-filled
            primary; the other two are bordered secondaries so the row
            doesn't become three competing accent buttons). Wraps on mobile. */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:justify-start">
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
        </div>
      </div>
    </section>
  );
}

/* ---- Pricing — full /start-style plan cards (no email form; each CTA
 * routes to /start). Mirrors /start's PLAN_FEATURES exactly. ---- */
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
      {/* All three cards share the same CTA label (rev-3 addendum): the old
          "Start with {tier}" duplicated the card header. Still → /start. */}
      <a
        href="/start"
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-bg transition-all hover:bg-accent-hover hover:scale-[1.02]"
      >
        Try for free →
      </a>
    </motion.div>
  );
}

function PricingSection() {
  return (
    <section id="pricing" className="py-20 md:py-28">
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

/* ---- Custom solutions (owns the "don't want to set it up yourself"
 * framing — mirrors /start's CustomSolutionsCard). ---- */
function CustomSolutionsSection() {
  return (
    <section id="custom-solutions" className="py-20 md:py-28">
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
            {/* Deep-links straight to the Custom solutions card on /start
                (rev-3 addendum 2) so the visitor doesn't land at the top of
                the plan cards and have to hunt for it. */}
            <a
              href="/start#custom-solutions"
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

// Get-leads / "you want customers" section REMOVED from the homepage entirely
// (rev-3 addendum): it was a coming-soon dead end here. The real inactive
// "Coming soon" GetLeadsCard still lives on /start (untouched).

export default function HomeV8Client() {
  // (rev-3 complete: always-expanded phases, fuller lists, sprite left +
  // vertically centered, hero bg, no dividers, get-leads removed, 16:9 demo.)
  // Sprite container we'll move imperatively (60fps onUpdate calls would
  // thrash React if we used setState).
  const spriteContainerRef = useRef<HTMLDivElement>(null);
  // Bubble container — sibling of the sprite (NOT inside the flipped
  // sprite frame), so its position math isn't mirrored when Celly faces
  // left. Positioned upper-LEFT of Celly in screen space.
  const bubbleContainerRef = useRef<HTMLDivElement>(null);
  // Bubble visibility — true when user has stopped scrolling for the
  // SCROLL_STOP_DELAY window, false the instant scroll begins again.
  const [bubbleVisible, setBubbleVisible] = useState(false);
  // Text/Voice choice menu shown when Celly is clicked, anchored to her
  // current screen position. Text → opens the chat; Voice → starts the call.
  const [choiceMenu, setChoiceMenu] = useState<{ x: number; y: number } | null>(
    null,
  );
  // Sub-panel inside the choice menu (mirrors the extension menu — Shamil
  // 2026-06-12): Feedback (any feedback → /api/feedback → his Telegram) and
  // Roadmap (where Erken is going). null = the plain Text/Voice menu.
  const [menuPanel, setMenuPanel] = useState<"feedback" | "roadmap" | "whatsnew" | null>(null);
  const [fbText, setFbText] = useState("");
  const [fbState, setFbState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const closeChoiceMenu = () => {
    setChoiceMenu(null);
    setMenuPanel(null);
    setFbText("");
    setFbState("idle");
  };
  const sendSiteFeedback = async () => {
    const message = fbText.trim();
    if (!message || fbState === "sending") return;
    setFbState("sending");
    try {
      const r = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "idea",
          message,
          url: window.location.href,
          title: document.title,
        }),
      });
      setFbState(r.ok ? "sent" : "error");
    } catch {
      setFbState("error");
    }
  };
  // Opens the Text/Voice/Feedback/Roadmap/What's-new/extension menu. Anchors
  // to the roaming Celly by default; pass an element (e.g. the section-
  // embedded Meet-Erken sprite) to anchor the same menu beside it instead —
  // same pattern /start's Erken card uses (rev-3 live correction: the section
  // sprite must open this FULL menu, not the raw chat widget).
  const openChoiceMenu = (anchorEl?: HTMLElement | null) => {
    setMenuPanel(null);
    const el = anchorEl ?? spriteContainerRef.current;
    if (el) {
      const r = el.getBoundingClientRect();
      // Keep the (center-anchored) menu within the viewport sides so it can't
      // clip off the left/right edges when Celly roams to a corner.
      const half = 120;
      const x = Math.max(half, Math.min(window.innerWidth - half, r.left + r.width / 2));
      setChoiceMenu({ x, y: r.top + r.height * 0.28 });
    } else {
      setChoiceMenu({ x: window.innerWidth / 2, y: window.innerHeight * 0.5 });
    }
  };
  // True while the GHL chat panel is open. When open, the roaming Celly
  // (+ her bubble) is hidden via the body.erken-chat-open CSS rule below,
  // and a second, docked Celly is rendered beside the chat panel.
  const chatOpen = useErkenChatOpen();
  // Mirrors chatOpen into a ref so SphereScrollStage's onUpdate can freeze
  // scroll-driven cell movement while Celly is docked at the chat.
  const chatFreezeRef = useRef(false);
  useEffect(() => {
    chatFreezeRef.current = chatOpen;
  }, [chatOpen]);
  // Close the Text/Voice menu the moment the user scrolls — otherwise it
  // stays stranded where Celly used to be after she repositions on stop.
  useEffect(() => {
    if (!choiceMenu) return;
    const close = () => closeChoiceMenu();
    window.addEventListener("scroll", close, { passive: true, once: true });
    return () => window.removeEventListener("scroll", close);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choiceMenu]);
  // Mirror of bubbleVisible into a ref so the 60fps handleCellMove
  // callback (deps: []) can read the latest value without re-creating.
  // Drives Celly's opacity in the same scroll-stop logic as the bubble.
  const stoppedRef = useRef(false);
  // Last cell opacity from handleCellMove — needed because when scrolling
  // stops, handleCellMove STOPS firing, so we need this value to
  // re-compute Celly's opacity in the bubbleVisible useEffect below.
  const lastCellOpacityRef = useRef(1);
  // Last "natural" Celly position from handleCellMove, used by the
  // auto-positioner as the anchor when finding an empty spot on stop.
  const lastNaturalPosRef = useRef({ xVw: 50, yVh: 50 });
  // Cell-dragon refs received from SphereScrollStage on mount. Used
  // to FORCE the cell's world position AND fully-expanded state when
  // Celly auto-positions after scroll stops (Shamil 2026-05-24 round
  // 17-18: "dragon cell follows Celly + dust fully expands at her spot
  // regardless of scroll math").
  const cellRefsRef = useRef<{
    xRef: React.MutableRefObject<number>;
    yRef: React.MutableRefObject<number>;
    scaleRef: React.MutableRefObject<number>;
    sphereOpacityRef: React.MutableRefObject<number>;
    streamOpacityRef: React.MutableRefObject<number>;
    prevXRef: React.MutableRefObject<number>;
    prevYRef: React.MutableRefObject<number>;
    nextXRef: React.MutableRefObject<number>;
    nextYRef: React.MutableRefObject<number>;
    transitionProgressRef: React.MutableRefObject<number>;
    segProgressRef: React.MutableRefObject<number>;
  } | null>(null);
  // Tracks the cell's last WORLD position so the trail-fly animation
  // has a starting point on the next scroll-stop.
  const lastCellWorldPosRef = useRef<{ x: number; y: number } | null>(null);
  // Tracks the dragon's CURRENT HEAD position during scroll. Used as
  // the launch point for the on-stop fly-to-new-spot animation (Shamil
  // round 23 — head is the "pen tip" by the time scroll ends).
  const dragonHeadWorldPosRef = useRef<{ x: number; y: number } | null>(null);
  // Active animation handle (so we can cancel if a new stop fires
  // mid-animation).
  const cellAnimRafRef = useRef<number | null>(null);
  // Camera params captured from the last cell position event — needed
  // to project Celly's screen-space (vw/vh) back to world coords.
  const cameraParamsRef = useRef({ cameraZ: 2.9, fovDeg: 50 });
  // Celly's facing direction (state) + tracking refs. Declared BEFORE
  // the useEffect below because that effect uses setPointDirection on
  // scroll-stop. Moving these declarations later in the source caused
  // a TDZ error.
  const [pointDirection, setPointDirection] = useState<"left" | "right">("right");
  const lastSideRef = useRef<"left" | "right">("right");
  const lastDesiredDirectionRef = useRef<"left" | "right">("right");
  // Mobile flag — drives bubble-variant cap (SHORT only) and smaller
  // cloud puffs / tighter padding. Initial false → matches SSR; set
  // truthy after mount so we never mismatch on first paint.
  const [isMobile, setIsMobile] = useState(false);
  // Viewport width — drives per-scene media stacking: the absolute
  // side-by-side media wrappers only have room beside the max-w-xl text
  // column from ~1280px up (MacBook 3D scene: ~1536px). Below that the
  // Section stacks media under the text (2026-06-10 responsive QA fix).
  const [viewportW, setViewportW] = useState(1920);
  useEffect(() => {
    const compute = () => {
      setIsMobile(window.innerWidth < 768);
      setViewportW(window.innerWidth);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);
  // ── Chat dock ──────────────────────────────────────────────────────
  // While the GHL chat is open, pin the REAL Celly — her sprite, the 3D
  // dragon cell, and the dust — to a fixed spot beside the chat panel,
  // re-applying every frame so scroll can't drag her away. Reuses the
  // same vw/vh→world projection the mobile-pin branch uses (round 17-18).
  // On close, the RAF stops and normal roaming resumes. Desktop only —
  // on mobile the chat panel is full-screen.
  useEffect(() => {
    if (!chatOpen) return;
    if (typeof window !== "undefined" && window.innerWidth < 768) return;
    const el = spriteContainerRef.current;
    const DOCK_X_VW = 72; // left of the bottom-right chat panel (tunable)
    const DOCK_Y_VH = 76;
    let raf = 0;
    const pin = () => {
      if (el) {
        el.style.left = `${DOCK_X_VW}vw`;
        el.style.top = `${DOCK_Y_VH}vh`;
        el.style.transform = "translate(-50%, -50%) scale(0.62)";
        el.style.opacity = "1";
      }
      const refs = cellRefsRef.current;
      if (refs) {
        const { cameraZ, fovDeg } = cameraParamsRef.current;
        const verticalHalf = cameraZ * Math.tan((fovDeg / 2) * (Math.PI / 180));
        const aspect =
          window.innerHeight > 0 ? window.innerWidth / window.innerHeight : 16 / 9;
        const horizontalHalf = verticalHalf * aspect;
        const wx = ((DOCK_X_VW - 50) / 100) * (2 * horizontalHalf);
        const wy = ((50 - DOCK_Y_VH) / 100) * (2 * verticalHalf);
        refs.xRef.current = wx;
        refs.yRef.current = wy;
        // Pin the trail refs to the dock too, so no stray dragon/stream
        // lingers or animates at her old spot while scrolling.
        refs.prevXRef.current = wx;
        refs.prevYRef.current = wy;
        refs.nextXRef.current = wx;
        refs.nextYRef.current = wy;
        refs.transitionProgressRef.current = 1;
        refs.segProgressRef.current = 0.5;
        refs.scaleRef.current = 1;
        refs.sphereOpacityRef.current = 1; // dust stays visible (even mid-scroll)
        refs.streamOpacityRef.current = 0;
      }
      raf = requestAnimationFrame(pin);
    };
    raf = requestAnimationFrame(pin);
    return () => cancelAnimationFrame(raf);
  }, [chatOpen]);
  // Active bubble variant — adaptive (LONG/MEDIUM/SHORT). Auto-positioner
  // picks the largest variant that fits in the available empty zone on
  // stop. Null = no variant fits, bubble is hidden entirely.
  const [activeVariant, setActiveVariant] = useState<BubbleVariant | null>(
    CELLY_VARIANTS[0],
  );
  useEffect(() => {
    stoppedRef.current = bubbleVisible;
    const el = spriteContainerRef.current;
    const bubbleEl = bubbleContainerRef.current;
    // Re-apply Celly's opacity — 0 when scrolling, 1 when stopped.
    // Mobile (Shamil 2026-05-25): always 1, she stays visible during scroll.
    if (el) {
      const mobile = typeof window !== "undefined" && window.innerWidth < 768;
      const restOpacity = mobile ? 1 : bubbleVisible ? 1 : 0;
      el.style.setProperty("--celly-rest-opacity", String(restOpacity));
      el.style.setProperty("--celly-hover-opacity", "1");
      el.style.opacity = "var(--celly-rest-opacity)";
    }
    // Scroll-start: smoothly shrink Celly's body to invisible over
    // ~200ms (Shamil round 27), then start dragon-trail at her last
    // position. The shrink RAF tweens scaleRef + sphereOpacityRef from
    // their current values down to 0. Skipped on mobile — there's no
    // trail (hideTrail={isMobile}) and the dust cloud should stay
    // visible around Celly at all times. (Shamil 2026-05-25 evening.)
    const isMobileNow = typeof window !== "undefined" && window.innerWidth < 768;
    if (cellRefsRef.current && !bubbleVisible && !isMobileNow && !chatOpen) {
      const refs = cellRefsRef.current;
      if (cellAnimRafRef.current !== null) {
        cancelAnimationFrame(cellAnimRafRef.current);
        cellAnimRafRef.current = null;
      }
      const startScale = refs.scaleRef.current;
      const startOpacity = refs.sphereOpacityRef.current;
      const SHRINK_MS = 220;
      const t0 = performance.now();
      const last = lastCellWorldPosRef.current;
      const shrinkTick = (now: number) => {
        const t = Math.min(1, (now - t0) / SHRINK_MS);
        refs.scaleRef.current = startScale * (1 - t);
        refs.sphereOpacityRef.current = startOpacity * (1 - t);
        if (t < 1) {
          cellAnimRafRef.current = requestAnimationFrame(shrinkTick);
        } else {
          refs.scaleRef.current = 0;
          refs.sphereOpacityRef.current = 0;
          cellAnimRafRef.current = null;
          // After shrink, set trail to visible at last position. The
          // scroll listener will keep updating prev/next based on scroll.
          if (last) {
            refs.streamOpacityRef.current = 1;
            refs.transitionProgressRef.current = 1;
            refs.segProgressRef.current = 0.5;
            refs.prevXRef.current = last.x;
            refs.prevYRef.current = last.y;
            refs.nextXRef.current = last.x;
            refs.nextYRef.current = last.y;
          }
        }
      };
      cellAnimRafRef.current = requestAnimationFrame(shrinkTick);
    }
    // Auto-position Celly + bubble in empty zones on scroll-stop. This
    // is now the ONLY place Celly's position and pointDirection update
    // (handleCellMove is detached — Shamil 2026-05-24 round 13).
    if (bubbleVisible && el && bubbleEl && !chatOpen) {
      // 1. Apply the desired pointing direction (only changes once per stop).
      if (lastSideRef.current !== lastDesiredDirectionRef.current) {
        lastSideRef.current = lastDesiredDirectionRef.current;
        setPointDirection(lastDesiredDirectionRef.current);
      }
      // Mobile (Shamil 2026-05-25): pin Celly to the bottom-LEFT corner.
      // No findEmptySpot, no scale-from-space — she sits in one fixed
      // place across all sections. Bubble still auto-positions above her.
      if (window.innerWidth < 768) {
        const fixedXVw = 14;
        // Shamil 2026-05-30: raised 94 → 85 → 72 so the bot clears the iOS
        // Safari bottom toolbar (address bar + tabs) even when expanded.
        // Static vh (not dvh) on purpose — dvh made the bot jiggle as the
        // bar animated (tried + reverted earlier).
        const fixedYVh = 72;
        // 2026-06-10 (responsive QA): past the hero the full-width text
        // column occupies the 59–72vh band, so the pinned bubble sat
        // directly on headings/body at almost every scroll stop. Show the
        // intro bubble on the hero only; Celly herself stays pinned.
        const pastHero = window.scrollY > window.innerHeight * 0.6;
        bubbleEl.style.display = pastHero ? "none" : "";
        el.style.left = `${fixedXVw}vw`;
        el.style.top = `${fixedYVh}vh`;
        el.style.transform = "translate(-50%, -50%) scale(0.6)";
        // Tighter bubble: narrower variant (text re-wraps to fewer chars
        // per line but font stays the same), and sits closer to Celly.
        const variant = { ...CELLY_VARIANTS[2], widthRem: 8 };
        setActiveVariant(variant);
        bubbleEl.style.right = "auto";
        bubbleEl.style.bottom = "auto";
        bubbleEl.style.left = `${fixedXVw + 7}vw`;
        bubbleEl.style.top = `${fixedYVh - 13}vh`;
        bubbleEl.style.transform = "translate(-50%, -50%)";
        bubbleEl.style.width = `${variant.widthRem}rem`;
        // Pin the cell-dragon (the dust cloud) to Celly's screen position
        // too (Shamil 2026-05-25 evening). Without this the cell renders
        // wherever the scroll math wants, and Celly looks isolated from
        // her dust. Project Celly's (vw, vh) into the camera's world
        // coordinates and write directly to the refs.
        if (cellRefsRef.current) {
          const refs = cellRefsRef.current;
          const { cameraZ, fovDeg } = cameraParamsRef.current;
          const halfFovRad = (fovDeg / 2) * (Math.PI / 180);
          const verticalHalf = cameraZ * Math.tan(halfFovRad);
          const aspect =
            typeof window !== "undefined" && window.innerHeight > 0
              ? window.innerWidth / window.innerHeight
              : 16 / 9;
          const horizontalHalf = verticalHalf * aspect;
          const targetX = ((fixedXVw - 50) / 100) * (2 * horizontalHalf);
          const targetY = ((50 - fixedYVh) / 100) * (2 * verticalHalf);
          if (cellAnimRafRef.current !== null) {
            cancelAnimationFrame(cellAnimRafRef.current);
            cellAnimRafRef.current = null;
          }
          refs.xRef.current = targetX;
          refs.yRef.current = targetY;
          refs.scaleRef.current = 1;
          refs.sphereOpacityRef.current = 1;
          refs.streamOpacityRef.current = 0;
          lastCellWorldPosRef.current = { x: targetX, y: targetY };
        }
        return;
      }
      // 2. Find empty spot for Celly. paddingVw/Vh = HALF her sprite at
      //    the SMALLEST scale we'd allow — so finder considers more
      //    candidates. Actual scale is then derived from minDist.
      const natural = lastNaturalPosRef.current;
      const cellyTarget = findEmptySpot({
        preferredXVw: natural.xVw,
        preferredYVh: natural.yVh,
        paddingVw: 4,
        paddingVh: 5,
        // Round 49 (Shamil): drop penalty all the way to 0 — the 0.05
        // version was still letting some scenes land Celly inside text.
        // With 0 weight, the algorithm picks the position with maximum
        // empty space, period, regardless of distance from the cell-
        // dragon's natural Y. Trade-off: she may land in spots that
        // feel slightly disconnected from where the cell-dragon's
        // dust cloud actually is, but it guarantees no content overlap.
        distancePenaltyWeight: 0,
      });
      el.style.left = `${cellyTarget.xVw}vw`;
      el.style.top = `${cellyTarget.yVh}vh`;
      // Celly's SCALE adapts to available empty space (Shamil round
      // 46). When the scene is tight (e.g. Step 4 where the laptop
      // hogs the canvas), minDist is small → Celly shrinks so she
      // (and her bubble) fit beside the obstacle. When there's plenty
      // of room she stays at max scale. Clamped so she's never too
      // small to see or too big to fit.
      // Mobile got half the size 2026-05-25 afternoon; same evening Shamil
      // applied the same shrink to desktop ("50% of what she is now").
      // Both viewports now share these bounds.
      // Shamil 2026-05-30: lock Celly to her smallest size — never grow
      // with available space (was an adaptive 0.6–1.0 scaleFromSpace).
      const MIN_SCALE = 0.6;
      const scaleFromSpace = MIN_SCALE;
      el.style.transform = `translate(-50%, -50%) scale(${scaleFromSpace})`;

      // VIEWPORT EDGE CLAMP for Celly herself (Shamil 2026-05-24 round
      // 44 — sprite was getting clipped, especially head, when
      // findEmptySpot picked a spot near a viewport edge that didn't
      // account for the sprite's full scaled half-size). Same approach
      // as the bubble clamp below: measure post-layout and shove back
      // in if any edge would clip.
      requestAnimationFrame(() => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const vw = window.innerWidth / 100;
        const vh = window.innerHeight / 100;
        const SAFE_MARGIN_PX = 12;
        let dxPx = 0;
        let dyPx = 0;
        if (rect.left < SAFE_MARGIN_PX) dxPx = SAFE_MARGIN_PX - rect.left;
        else if (rect.right > window.innerWidth - SAFE_MARGIN_PX)
          dxPx = window.innerWidth - SAFE_MARGIN_PX - rect.right;
        if (rect.top < SAFE_MARGIN_PX) dyPx = SAFE_MARGIN_PX - rect.top;
        else if (rect.bottom > window.innerHeight - SAFE_MARGIN_PX)
          dyPx = window.innerHeight - SAFE_MARGIN_PX - rect.bottom;
        if (dxPx !== 0 || dyPx !== 0) {
          const newXVw = cellyTarget.xVw + dxPx / vw;
          const newYVh = cellyTarget.yVh + dyPx / vh;
          el.style.left = `${newXVw}vw`;
          el.style.top = `${newYVh}vh`;
        }
      });
      // 3. Find empty spot for bubble — must stay NEAR Celly (Shamil
      //    2026-05-24 round 16: bubble was wandering to opposite corners).
      //    Hard cap of 25vw from Celly, plus much heavier distance
      //    penalty so the finder strongly prefers nearby spots.
      //
      //    Round 47 (Shamil hypothesis confirmed): the avoid rect uses
      //    Celly's CENTER, but the check only verifies the bubble's
      //    CENTER is outside the rect — bubble body can still extend
      //    INTO Celly's space, covering her head. Fixes:
      //      (a) Convert rem→vh/vw using actual viewport (was treating
      //          rem-values as vh/vw directly, undersizing by ~30%).
      //      (b) Inflate the avoid rect by the BUBBLE's half-size per
      //          variant, so the bubble's body can't reach Celly's body.
      //    The CellDragonSprite container is 13rem × 13rem at scale 1.
      //    Inside it sits a 5.5×9.5rem body (button) + dangling hands.
      //    We use a visible half-extent that covers head+body+hands.
      const remToVw = 16 / Math.max(1, window.innerWidth / 100);
      const remToVh = 16 / Math.max(1, window.innerHeight / 100);
      const VISIBLE_HALF_W_REM = 3.4; // half of widest part (hands flare ~6.8rem at scale 1)
      const VISIBLE_HALF_H_REM = 5.0; // half of tallest part — covers head dome at top
      const cellyHalfVw = VISIBLE_HALF_W_REM * scaleFromSpace * remToVw;
      const cellyHalfVh = VISIBLE_HALF_H_REM * scaleFromSpace * remToVh;
      const FIT_THRESHOLD = 2;
      // Re-tuned (Shamil 2026-05-25 late evening): at 12 the bubble had
      // nowhere to go on Section 0 (Erken intro — text on left, Celly
      // on left) and the soft fallback landed it on top of Celly. 20vw
      // gives findEmptySpot enough room to escape her avoid rect while
      // still keeping the bubble visually tethered to her.
      const MAX_BUBBLE_DIST_FROM_CELLY = 20;
      let chosenVariant: BubbleVariant | null = null;
      let chosenTarget = { xVw: 50, yVh: 50, minDist: 0 };

      const buildCellyAvoid = (variant: BubbleVariant): AvoidRect => {
        // Bubble body extents — half-width straight from widthRem, half-
        // height estimated as ~45% of widthRem (cloud shape with text
        // wrap roughly proportional to width). Plus an extra 4vh top/
        // bottom padding so the bubble doesn't sit right on her head
        // even when math is generous (Shamil round 48 still seeing
        // touching).
        const bubbleHalfWVw = (variant.widthRem / 2) * remToVw;
        const bubbleHalfHVh = (variant.widthRem * 0.45 / 2) * remToVh;
        const EXTRA_GAP_VH = 4;
        return {
          left: cellyTarget.xVw - cellyHalfVw - bubbleHalfWVw,
          right: cellyTarget.xVw + cellyHalfVw + bubbleHalfWVw,
          top: cellyTarget.yVh - cellyHalfVh - bubbleHalfHVh - EXTRA_GAP_VH,
          bottom: cellyTarget.yVh + cellyHalfVh + bubbleHalfHVh + EXTRA_GAP_VH,
        };
      };

      // SHORT-only on both viewports (Shamil 2026-05-25 evening): the
      // long pitch never landed visually — bubble too big, copy felt
      // sales-y. The one-liner reads cleaner and matches mobile.
      // Width re-tuned: at 9rem the desktop bubble read like a "poem"
      // (text wrapping to too many lines). Back up to 11rem; paired
      // with smaller 12px text below.
      const variants = [
        { ...CELLY_VARIANTS[2], widthRem: isMobile ? 8 : 9 },
      ];
      for (const variant of variants) {
        const cellyAvoid = buildCellyAvoid(variant);
        const target = findEmptySpot({
          preferredXVw: cellyTarget.xVw,
          // Bias the preferred Y so it lands ABOVE her head, not just
          // 16vh above her center.
          preferredYVh:
            cellyTarget.yVh - cellyHalfVh - (variant.widthRem * 0.45 / 2) * remToVh - 8,
          paddingVw: variant.paddingVw,
          paddingVh: variant.paddingVh,
          extraAvoidRects: [cellyAvoid],
          maxDistFromAnchor: MAX_BUBBLE_DIST_FROM_CELLY,
          distancePenaltyWeight: 1.2,
        });
        if (target.minDist >= FIT_THRESHOLD) {
          chosenVariant = variant;
          chosenTarget = target;
          break;
        }
      }
      if (!chosenVariant) {
        chosenVariant = variants[variants.length - 1];
        const cellyAvoid = buildCellyAvoid(chosenVariant);
        chosenTarget = findEmptySpot({
          preferredXVw: cellyTarget.xVw,
          preferredYVh:
            cellyTarget.yVh -
            cellyHalfVh -
            (chosenVariant.widthRem * 0.45 / 2) * remToVh -
            8,
          paddingVw: chosenVariant.paddingVw,
          paddingVh: chosenVariant.paddingVh,
          extraAvoidRects: [cellyAvoid],
          maxDistFromAnchor: MAX_BUBBLE_DIST_FROM_CELLY,
          distancePenaltyWeight: 1.2,
        });
      }
      setActiveVariant(chosenVariant);
      bubbleEl.style.right = "auto";
      bubbleEl.style.bottom = "auto";
      bubbleEl.style.left = `${chosenTarget.xVw}vw`;
      bubbleEl.style.top = `${chosenTarget.yVh}vh`;
      bubbleEl.style.transform = "translate(-50%, -50%)";
      bubbleEl.style.width = `${chosenVariant.widthRem}rem`;

      // VIEWPORT EDGE CLAMP (Shamil 2026-05-24 round 42). In tight
      // scenes like Step 4 where the laptop dominates and Celly gets
      // jammed near a viewport edge, findEmptySpot's paddingVw can be
      // under-estimated (the bubble's rendered width includes padding
      // and text wrap that exceeds the declared `widthRem`). Measure
      // the bubble AFTER layout and shove it back inside if it spills
      // off the page. We prefer staying in-bounds over staying perfectly
      // centered relative to Celly.
      requestAnimationFrame(() => {
        if (!bubbleEl) return;
        const rect = bubbleEl.getBoundingClientRect();
        const vw = window.innerWidth / 100;
        const vh = window.innerHeight / 100;
        const SAFE_MARGIN_PX = 12; // keep this many px from each edge
        let dxPx = 0;
        let dyPx = 0;
        if (rect.left < SAFE_MARGIN_PX) dxPx = SAFE_MARGIN_PX - rect.left;
        else if (rect.right > window.innerWidth - SAFE_MARGIN_PX)
          dxPx = window.innerWidth - SAFE_MARGIN_PX - rect.right;
        if (rect.top < SAFE_MARGIN_PX) dyPx = SAFE_MARGIN_PX - rect.top;
        else if (rect.bottom > window.innerHeight - SAFE_MARGIN_PX)
          dyPx = window.innerHeight - SAFE_MARGIN_PX - rect.bottom;
        if (dxPx !== 0 || dyPx !== 0) {
          const newXVw = chosenTarget.xVw + dxPx / vw;
          const newYVh = chosenTarget.yVh + dyPx / vh;
          bubbleEl.style.left = `${newXVw}vw`;
          bubbleEl.style.top = `${newYVh}vh`;
        }
      });

      // 4. Animate cell-dragon flying from its LAST position to Celly's
      //    new spot, then expanding (Shamil 2026-05-24 round 20 — path 3).
      //    Three phases: (a) trail flies prev→new over 400ms, (b) cell
      //    expands at new spot over 250ms, (c) trail fades out over 200ms
      //    (overlaps with expand).
      if (cellRefsRef.current) {
        const refs = cellRefsRef.current;
        const { cameraZ, fovDeg } = cameraParamsRef.current;
        const halfFovRad = (fovDeg / 2) * (Math.PI / 180);
        const verticalHalf = cameraZ * Math.tan(halfFovRad);
        const aspect =
          typeof window !== "undefined" && window.innerHeight > 0
            ? window.innerWidth / window.innerHeight
            : 16 / 9;
        const horizontalHalf = verticalHalf * aspect;
        const targetX = ((cellyTarget.xVw - 50) / 100) * (2 * horizontalHalf);
        const targetY = ((50 - cellyTarget.yVh) / 100) * (2 * verticalHalf);
        // Starting position = dragon's CURRENT HEAD if there was scroll
        // (pen-tip where drawing ended), otherwise last cell pos, or
        // current refs as final fallback. Shamil round 23.
        // (Rounds 45 + 46 reverted at Shamil's request — neither
        // tail-anchor variant felt right. Coming back to this another
        // day; not urgent.)
        const startX =
          dragonHeadWorldPosRef.current?.x ??
          lastCellWorldPosRef.current?.x ??
          refs.xRef.current;
        const startY =
          dragonHeadWorldPosRef.current?.y ??
          lastCellWorldPosRef.current?.y ??
          refs.yRef.current;
        // Clear head ref — next scroll will set it again.
        dragonHeadWorldPosRef.current = null;
        // Cancel any in-flight animation so we don't have two updating
        // the same refs.
        if (cellAnimRafRef.current !== null) {
          cancelAnimationFrame(cellAnimRafRef.current);
          cellAnimRafRef.current = null;
        }
        // Setup phase A: trail from start to target, cell invisible.
        refs.prevXRef.current = startX;
        refs.prevYRef.current = startY;
        refs.nextXRef.current = targetX;
        refs.nextYRef.current = targetY;
        refs.segProgressRef.current = 0;
        refs.transitionProgressRef.current = 1;
        refs.streamOpacityRef.current = 1;
        refs.scaleRef.current = 0;
        refs.sphereOpacityRef.current = 0;
        // Run the animation. Total budget ~600ms.
        const FLY_MS = 400;
        const EXPAND_MS = 250;
        const animStart = performance.now();
        const tick = (now: number) => {
          const elapsed = now - animStart;
          // Trail position progress 0..1 over first FLY_MS.
          const flyT = Math.min(1, elapsed / FLY_MS);
          refs.segProgressRef.current = flyT;
          // Cell xRef/yRef track the trail's leading point — lerp from
          // start to target. So when trail finishes, cell is at target.
          refs.xRef.current = startX + (targetX - startX) * flyT;
          refs.yRef.current = startY + (targetY - startY) * flyT;
          // After fly finishes, expand cell + fade trail.
          if (elapsed >= FLY_MS) {
            const expandT = Math.min(1, (elapsed - FLY_MS) / EXPAND_MS);
            refs.scaleRef.current = expandT;
            refs.sphereOpacityRef.current = expandT;
            refs.streamOpacityRef.current = 1 - expandT;
          }
          if (elapsed < FLY_MS + EXPAND_MS) {
            cellAnimRafRef.current = requestAnimationFrame(tick);
          } else {
            // Done — snap final values.
            refs.scaleRef.current = 1;
            refs.sphereOpacityRef.current = 1;
            refs.streamOpacityRef.current = 0;
            refs.xRef.current = targetX;
            refs.yRef.current = targetY;
            cellAnimRafRef.current = null;
            lastCellWorldPosRef.current = { x: targetX, y: targetY };
          }
        };
        cellAnimRafRef.current = requestAnimationFrame(tick);
      }
    }
  }, [bubbleVisible, isMobile, chatOpen]);
  // (pointDirection state + lastSideRef + lastDesiredDirectionRef
  //  moved to top of component to avoid TDZ error in the stop-handler
  //  useEffect above.)
  // Bubble tail corner state was used when the bubble followed Celly
  // around. With bubble fixed at top (Shamil 2026-05-24 round 8), tail
  // is hardcoded at bottom-center pointing down. State kept around as
  // commented-out reference for future tail-tracking work.

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let scrollStartY: number | null = null;
    const CELL_VISIBILITY_THRESHOLD = 0.2;
    const showBubbleIfCellVisible = () => {
      if (lastCellOpacityRef.current > CELL_VISIBILITY_THRESHOLD) {
        setBubbleVisible(true);
      }
      scrollStartY = null; // reset for next scroll
    };
    const onScroll = () => {
      // Chat docked: the dock pin owns the cell; ignore scroll entirely so
      // the dust doesn't slide off to the old scroll-driven spot.
      if (chatFreezeRef.current) return;
      if (scrollStartY === null) scrollStartY = window.scrollY;
      setBubbleVisible(false);
      // Mobile (Shamil 2026-05-25 evening): skip the dragon-draw logic.
      // The trail is hidden on mobile (`hideTrail` prop) and Celly is
      // pinned, so we DON'T want the cell-dragon's world Y to slide with
      // scroll — that's what was making the dust appear to "stay where
      // it was" while the page scrolled past it.
      const isMobileNow =
        typeof window !== "undefined" && window.innerWidth < 768;
      if (isMobileNow) {
        // Pin the cell-dragon to Celly's bottom-left spot DURING scroll
        // too, not just on stop (Shamil 2026-05-25 evening). Otherwise
        // the cell sits at its initial center-left position with scale
        // 0.9 dust filling most of the viewport — Shamil's "dust expands
        // to full page" complaint. Re-applies on every scroll tick.
        const refs = cellRefsRef.current;
        if (refs) {
          const { cameraZ, fovDeg } = cameraParamsRef.current;
          const halfFovRad = (fovDeg / 2) * (Math.PI / 180);
          const verticalHalf = cameraZ * Math.tan(halfFovRad);
          const aspect =
            window.innerHeight > 0
              ? window.innerWidth / window.innerHeight
              : 16 / 9;
          const horizontalHalf = verticalHalf * aspect;
          const targetX = ((14 - 50) / 100) * (2 * horizontalHalf);
          const targetY = ((50 - 72) / 100) * (2 * verticalHalf);
          refs.xRef.current = targetX;
          refs.yRef.current = targetY;
          refs.scaleRef.current = 1;
          refs.sphereOpacityRef.current = 1;
          refs.streamOpacityRef.current = 0;
        }
        if (timer) clearTimeout(timer);
        timer = setTimeout(showBubbleIfCellVisible, SCROLL_STOP_DELAY_MS);
        return;
      }
      // Dragon DRAWS in scroll direction (Shamil round 22): trail tail
      // anchored at Celly's last spot, head extends in scroll direction
      // proportional to scroll delta. The further you scroll, the
      // longer the dragon.
      const refs = cellRefsRef.current;
      const last = lastCellWorldPosRef.current;
      if (refs && last && scrollStartY !== null) {
        const { cameraZ, fovDeg } = cameraParamsRef.current;
        const halfFovRad = (fovDeg / 2) * (Math.PI / 180);
        const verticalHalf = cameraZ * Math.tan(halfFovRad);
        const pxToWorldY = (verticalHalf * 2) / window.innerHeight;
        // Round 26 (Shamil): DRAW_RATE bumped to 1.0 and cap removed.
        // At 1.0 with no cap, the math becomes: tailY moves UP at scroll
        // rate, headY stays at last.y constant in world coords — i.e.
        // head stays FIXED at Celly's original viewport position while
        // tail recedes up into the page. Dragon length grows continuously
        // with scroll, head always visible.
        const DRAW_RATE = 1.0;
        const rawScrollDeltaPx = window.scrollY - scrollStartY;
        const pageOffsetWorld = rawScrollDeltaPx * pxToWorldY;
        const drawDeltaPx = rawScrollDeltaPx * DRAW_RATE;
        const drawWorldY = -drawDeltaPx * pxToWorldY;
        refs.prevXRef.current = last.x;
        refs.prevYRef.current = last.y + pageOffsetWorld;
        refs.nextXRef.current = last.x;
        refs.nextYRef.current = last.y + pageOffsetWorld + drawWorldY;
        refs.segProgressRef.current = 0.5;
        refs.streamOpacityRef.current = 1;
        refs.xRef.current = last.x;
        refs.yRef.current = last.y + pageOffsetWorld;
        // Don't write scaleRef/sphereOpacityRef here — the shrink RAF
        // animation in the bubbleVisible useEffect handles those.
        dragonHeadWorldPosRef.current = {
          x: last.x,
          y: last.y + pageOffsetWorld + drawWorldY,
        };
      }
      if (timer) clearTimeout(timer);
      timer = setTimeout(showBubbleIfCellVisible, SCROLL_STOP_DELAY_MS);
    };
    timer = setTimeout(showBubbleIfCellVisible, SCROLL_STOP_DELAY_MS);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timer) clearTimeout(timer);
    };
  }, []);

  // Convert the cell's 3D world position to a screen position and slap it
  // onto the sprite container's style. Camera is fov=50 looking down -Z at
  // a sphere at world y=0; the screen half-width in world units is
  // cameraZ * tan(fov/2). We then map worldX → 50vw ± offset.
  const handleCellMove = useCallback((pos: CellPositionInfo) => {
    const el = spriteContainerRef.current;
    if (!el) return;
    // Three.js perspective camera: `fov` is the VERTICAL fov. The vertical
    // half-height in world units at the cell's z=0 plane is:
    //    verticalHalf = cameraZ * tan(fov/2)
    // The horizontal half-width depends on viewport aspect ratio:
    //    horizontalHalf = verticalHalf * (viewport width / viewport height)
    // Missing the aspect multiplier was why Celly was landing way off to
    // the side — the math was treating the screen as square.
    const halfFovRad = (pos.fovDeg / 2) * (Math.PI / 180);
    const verticalHalf = pos.cameraZ * Math.tan(halfFovRad);
    const aspect =
      typeof window !== "undefined" && window.innerHeight > 0
        ? window.innerWidth / window.innerHeight
        : 16 / 9;
    const horizontalHalf = verticalHalf * aspect;
    // Per-section Celly placement tweaks (Shamil 2026-05-24, walking through
    // each scene). xPushIn = how far to push toward viewport center from
    // the cell's worldX (in world units, positive = toward center).
    // yOffset = vertical nudge in world units (positive = down).
    // These are per scene because each scene's content layout has different
    // "empty corners" inside the dust cloud where Celly fits without
    // covering text or cards.
    // Section indices: 0 hero, 1 lead gen, 2 lead capture, 3 lead mgmt,
    // 4 control panel, 5 industries (added 2026-05-24 round 2).
    //
    // ORCHESTRATION RESET (Shamil 2026-05-24 round 2): cell-dragon now
    // lifts to upper-half of viewport in SphereScrollStage (sectionY=0.4),
    // and follows the alternating L/R pattern (same side as text). That
    // means Celly naturally sits in the upper-LEFT corner for even-index
    // scenes and upper-RIGHT for odd-index scenes, ABOVE the text. No
    // need for the old per-scene yOffset tricks to lift her individually.
    //
    // xPushIn reset to 0 for all scenes so Celly sits AT the cell's
    // natural position. pointOverride still used where she needs to
    // point at something on the opposite side (e.g. the laptop).
    // xPushIn restored to 0.55 (Shamil 2026-05-24 round 3): with cell
    // lifted to Y=+0.4, the Y lift alone doesn't clear the text column
    // horizontally — Celly still overlapped the headline because her
    // body width straddles the text column edge. Pushing her 0.55 world
    // units toward center moves her past the text edge so she sits in
    // the upper-corner-but-clear-of-text zone. Matches the "before was
    // perfect" position Shamil called out for Hero.
    // Per-scene Celly + bubble placement. Each scene has its own "empty
    // zone" where Celly can sit without covering content.
    // - xPushIn (world units): push Celly toward viewport center from
    //   the cell's natural left/right edge. 0.55 ≈ clear of text column.
    // - yOffset (world units, Three.js Y is UP): negative pushes Celly
    //   DOWN on screen from the cell's lifted Y=+0.4 default.
    // - pointOverride: force a facing direction.
    // - bubble: per-scene override for bubble position + tail corner.
    //   rightOffsetVw positive = bubble to LEFT of Celly. bottomOffsetVh
    //   positive = bubble ABOVE Celly. tailCorner = which corner of the
    //   bubble has the tail (and which direction it points). Tail should
    //   point TOWARD Celly's screen position.
    //     "tl" = top-left, points up-left
    //     "tr" = top-right, points up-right
    //     "bl" = bottom-left, points down-left
    //     "br" = bottom-right, points down-right
    // Bubble offsets — rightOffsetVw positive = bubble's RIGHT edge that
    // many vw to the LEFT of Celly's center (bubble is to Celly's left).
    // Negative = bubble to Celly's right. bottomOffsetVh positive =
    // bubble ABOVE Celly's center. tailCorner kept in type for future
    // (currently unused since bubble is cloud-shaped without a tail).
    type TailCorner = "tl" | "tr" | "bl" | "br" | "none";
    // Default = bubble ABOVE Celly (centered horizontally on her, sitting
    // above her head). rightOffsetVw=-6 puts bubble's right edge ~6vw to
    // the right of Celly's center, which combined with bubble width ~12vw
    // centers it on Celly. bottomOffsetVh=8 puts its bottom edge 8vh
    // above Celly's center — clear of her body, above section text.
    const DEFAULT_BUBBLE: {
      rightOffsetVw: number;
      bottomOffsetVh: number;
      tailCorner: TailCorner;
    } = { rightOffsetVw: -6, bottomOffsetVh: 8, tailCorner: "none" };
    const SCENE_OFFSETS: Record<
      number,
      {
        xPushIn: number;
        yOffset: number;
        pointOverride?: "left" | "right";
        bubble?: {
          rightOffsetVw: number;
          bottomOffsetVh: number;
          tailCorner: TailCorner;
        };
      }
    > = {
      // v8 restructure: the OLD per-scene offsets were hand-calibrated to
      // the OLD section order (Hero / Lead-gen / Capture / Mgmt / Control /
      // Industries). That order no longer exists — the four step scenes are
      // gone. These offsets only bias the "natural anchor" fed to
      // findEmptySpot(), and Celly's actual landing spot is chosen by that
      // auto-positioner (penalty 0 — it ignores the anchor for her position
      // entirely and just picks the emptiest gap between data-celly-avoid
      // blocks). So a single generic default across all sections is correct
      // here — every remaining section tags its content data-celly-avoid,
      // which is what actually drives placement. Hero keeps its upper-left
      // bias; all other indices fall through to the same value below.
      0: { xPushIn: 0.55, yOffset: 0 },
    };
    const sceneOffset = SCENE_OFFSETS[pos.sectionIndex] ?? {
      xPushIn: 0.55,
      yOffset: 0,
    };
    const { xPushIn, yOffset, pointOverride, bubble: bubbleOffset } = sceneOffset;
    const cellySide = pos.worldX < 0 ? -1 : 1; // -1 = cell on left, +1 = cell on right
    // Update facing direction via React state ONLY when side actually
    // flips. Default rule: cell on left → Celly points LEFT (toward text
    // on left). Cell on right → points RIGHT. Per-scene pointOverride
    // beats the default rule.
    const desiredDirection: "left" | "right" =
      pointOverride ?? (cellySide < 0 ? "left" : "right");
    // 2026-05-24 round 13: pointDirection update DISABLED during scroll
    // (Celly was flipping back and forth as the cell-dragon swept L/R).
    // Direction change now happens only on scroll-stop via the
    // bubbleVisible useEffect, where it's a single stable update per stop.
    // (Tracked here so the stop-handler can read the latest desired direction.)
    lastDesiredDirectionRef.current = desiredDirection;
    const cellyWorldX = pos.worldX - cellySide * xPushIn;
    const cellyWorldY = pos.worldY + yOffset; // positive yOffset = down on screen
    const xVw = 50 + (cellyWorldX / (2 * horizontalHalf)) * 100;
    // Map world y ∈ [-verticalHalf, +verticalHalf] to viewport %
    const yVh = 50 - (cellyWorldY / (2 * verticalHalf)) * 100;
    // Record natural position for auto-positioner to use as anchor on stop.
    lastNaturalPosRef.current = { xVw, yVh };
    // Capture camera params for the screen→world projection on stop.
    cameraParamsRef.current = { cameraZ: pos.cameraZ, fovDeg: pos.fovDeg };
    // 2026-05-24 round 13 (Shamil): position updates DISABLED during
    // scroll. Celly was flapping around chasing the cell-dragon's L/R
    // motion. Now her position is only updated on scroll-STOP via the
    // bubbleVisible useEffect. Between stops, she stays put.
    // Celly's opacity (Shamil 2026-05-24 round 17): FULLY HIDDEN during
    // scroll. Was translucent at 55%; now goes to 0 so she completely
    // disappears mid-scroll, leaving just the dragon-trail visual. Fades
    // back to full opacity when scroll stops at her new auto-position.
    lastCellOpacityRef.current = 1;
    // Mobile: Celly is always visible (she's pinned bottom-left, no scroll fade).
    const mobile = typeof window !== "undefined" && window.innerWidth < 768;
    const restOpacity = mobile ? 1 : stoppedRef.current ? 1 : 0;
    const hoverOpacity = 1;
    el.style.setProperty("--celly-rest-opacity", String(restOpacity));
    el.style.setProperty("--celly-hover-opacity", String(hoverOpacity));
    el.style.opacity = "var(--celly-rest-opacity)";
    // Scale: Celly REPLACES the inner cell core (3D sphereGeometry radius
    // 0.55, so diameter 1.1 in world units). The on-screen pixel diameter
    // of that sphere is roughly:
    //    pxDiameter = (1.1 / (2 * verticalHalf)) * viewportHeight
    // Celly's CSS body is 24 (Tailwind) = 6rem ≈ 96px when scale=1.
    // We compute the exact pixel scale needed to match the 3D sphere size.
    // Scale + position + bubble positioning REMOVED from handleCellMove
    // (Shamil 2026-05-24 round 15). Celly's size, position, and the
    // bubble's position are all computed at scroll-stop based on
    // available empty space. handleCellMove now only records the
    // natural anchor + sets opacity. Suppress unused-var lint:
    void bubbleOffset;
  }, []);

  return (
    <>
    {/* Sticky header — z-50 above the fixed cell-dragon canvas (z-45) and
        the roaming Celly (z-40). Lives OUTSIDE the stage so it sticks to
        the viewport top across the whole document. */}
    <DraftHeader />
    <SphereScrollStage
      // v8: 7 top-level sections (hero, industries, pipeline, meet-erken,
      // pricing, custom-solutions, get-leads). sectionCount is mostly
      // cosmetic now — during scroll the cell is invisible (dragon trail
      // only) and on scroll-stop the findEmptySpot auto-positioner owns
      // Celly's resting spot regardless of the peak count.
      sectionCount={7}
      showDust
      freezeRef={chatFreezeRef}
      onCellPositionChange={handleCellMove}
      onCellRefsReady={(refs) => {
        cellRefsRef.current = refs;
        // On mobile, immediately pin the cell to Celly's bottom-left
        // spot so the very first frame doesn't show a giant center-left
        // dust cloud (Shamil 2026-05-25 evening).
        if (typeof window !== "undefined" && window.innerWidth < 768) {
          // Use the SphereScrollStage mobile camera defaults — exact
          // params live in cameraParamsRef which the page populates on
          // the first onCellPositionChange tick.
          const cameraZ = 2.2;
          const fovDeg = 50;
          const halfFovRad = (fovDeg / 2) * (Math.PI / 180);
          const verticalHalf = cameraZ * Math.tan(halfFovRad);
          const aspect =
            window.innerHeight > 0
              ? window.innerWidth / window.innerHeight
              : 16 / 9;
          const horizontalHalf = verticalHalf * aspect;
          refs.xRef.current = ((14 - 50) / 100) * (2 * horizontalHalf);
          refs.yRef.current = ((50 - 72) / 100) * (2 * verticalHalf);
          refs.scaleRef.current = 1;
          refs.sphereOpacityRef.current = 1;
          refs.streamOpacityRef.current = 0;
        }
      }}
      // hide the 3D cell-core — Celly is the visual stand-in for it.
      hideInnerCellCore
      // Round 19 (Shamil): disable the old per-segment shrink/expand
      // math. Page now owns the cell entirely via onCellRefsReady.
      disableScrollDrivenShape
      // Round 23: straight dragon — no bend, no sin arc — matches the
      // pen-drawing-down-the-page mental model.
      straightTrail
      // Mobile (Shamil 2026-05-25): trailing dragon disabled. Keep just
      // the cell/dust cloud around Celly — no chasing snake of particles.
      hideTrail={isMobile}
      // sectionYOverrides dropped for v8: the old {1: -0.8} pushed the
      // cloud to the bottom-right for the Step-1 Lead-Gen scene, which no
      // longer exists. Every remaining section uses the default +0.4 lift.
    >
      {/* 1. HERO — the LIVE hero Section (kept), with its real founder
          intro video (Scene1IntroVideo). home-draft additions layered in
          via the Section component: the price tease line + the secondary
          "See your industry" button (both live on SECTIONS[0]).
          NOTE: the live hero already ships the REAL founder video, so it is
          kept here instead of downgrading to home-draft's "Founder video —
          coming" placeholder — see the worker report. */}
      <Section
        isMobile={isMobile}
        stacked={false}
        heroBackground
        {...SECTIONS[0]}
        media={<Scene1IntroVideo />}
        // Same right-anchored media wrapper the live hero (scene 0) used, so
        // the video sits opposite the left text column at every md+ width.
        mediaWrapperClassName="absolute inset-y-[8vh] right-[4vw] left-[48vw] 2xl:left-auto 2xl:w-[50%] hidden md:flex items-center justify-center pointer-events-auto"
        mediaAvoidCelly={true}
      />

      {/* 2. Industries — moved UP to 2nd (self-identification hook). */}
      <IndustriesSection />

      {/* 3. Pipeline — HubSpot-style sticky-column section: pinned left
          story + right-side always-expanded phase panels (Capture/Nurture/
          Close/fans/win-back). Replaces the four full-screen step scenes
          (Scene2/3/4 + MacbookFrame3D). */}
      <PipelineSection />

      {/* 4. Meet Erken — live centered section, five sell bullets + three
          CTAs in one row. */}
      <MeetErkenSection onSpriteClick={openChoiceMenu} />

      {/* 5. Pricing — full /start-style plan cards (CTAs → /start). */}
      <PricingSection />

      {/* 6. Custom solutions (from home-draft). */}
      <CustomSolutionsSection />

      {/* Get-leads / "you want customers" section REMOVED from the homepage
          (rev-3 addendum: it was a coming-soon dead end here; the real
          inactive card still lives on /start). */}

      {/* No footer (Shamil's call, home-draft v5). */}

      {/* Trailing space so scroll has room to finish its tween */}
      <div className="h-[20vh]" />
    </SphereScrollStage>

    {/* AI character overlay — sits ABOVE the 3D cell-dragon canvas and
        TRACKS the cell-dragon's screen position as the user scrolls.
        SphereScrollStage fires onCellPositionChange every onUpdate; we
        translate world→screen and write directly to this container's
        CSS (no React re-renders at 60fps). The CellDragonSprite renders
        without its own scale — parent scales/positions it instead. */}
    <div
      ref={spriteContainerRef}
      aria-hidden={false}
      className="celly-container fixed z-40 pointer-events-none"
      style={{
        // Initial position before first onUpdate fires — section 0 left.
        left: "30vw",
        top: "50vh",
        transform: "translate(-50%, -50%) scale(0.7)",
        transformOrigin: "center",
        // Round 27 (Shamil): removed position transitions. Celly was
        // visibly "travelling" from old to new spot during the on-stop
        // animation. Now position snaps; only opacity + transform
        // (scale) animate. She appears AT the new spot, not animated
        // toward it.
        transition: "opacity 0.25s ease-out, transform 0.3s ease-out",
      }}
    >
      <CellDragonSprite
        scale={1}
        pointDirection={pointDirection}
        showOuterShell={false}
        // Bubble moved OUTSIDE the sprite (see sibling div below) so its
        // position math isn't affected by sprite's horizontal flip.
        bubbleText={null}
        onClick={() => {
          openChoiceMenu();
        }}
      />
    </div>
    {/* Docked Celly — appears beside the GHL chat panel (always
        bottom-right) while the chat is open, so it reads as "you're
        chatting with Celly." The roaming Celly is hidden via CSS above.
        Hidden on mobile, where the chat panel is full-screen. */}
    <ErkenChatWidget />
    <ErkenVoiceWidget />
    {/* Text/Voice choice menu — appears at Celly when she's clicked. */}
    {choiceMenu && (
      <>
        <div
          className="fixed inset-0 z-[55]"
          aria-hidden
          onClick={closeChoiceMenu}
        />
        <div
          role="menu"
          aria-label="How would you like to talk to Erken?"
          className="fixed z-[56] flex flex-col gap-1 rounded-2xl border border-white/15 bg-black/80 p-2 shadow-2xl backdrop-blur-md"
          style={{
            left: choiceMenu.x,
            top: choiceMenu.y,
            // Open ABOVE Celly normally; when she's near the top of the page the
            // menu would be clipped behind the browser bar, so flip it to open
            // BELOW her instead. (~260px ≈ tallest panel height + margin.)
            transform: choiceMenu.y < 260
              ? "translate(-50%, 12%)"
              : "translate(-50%, -115%)",
          }}
        >
          {menuPanel === null && (
            <>
              <div className="px-3 pb-1 pt-1 text-xs text-white/55">
                Talk to Erken
              </div>
              <button
                role="menuitem"
                onClick={() => {
                  closeChoiceMenu();
                  openErkenChat();
                }}
                className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm text-white transition-colors hover:bg-white/15"
              >
                <span aria-hidden className="text-base">
                  💬
                </span>{" "}
                Text chat
              </button>
              <button
                role="menuitem"
                onClick={() => {
                  closeChoiceMenu();
                  window.__startErkenVoiceCall?.();
                }}
                className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm text-white transition-colors hover:bg-white/15"
              >
                <span aria-hidden className="text-base">
                  🎙️
                </span>{" "}
                Voice chat
              </button>
              <div className="mx-2 h-px bg-white/10" aria-hidden />
              <button
                role="menuitem"
                onClick={() => setMenuPanel("feedback")}
                className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm text-white transition-colors hover:bg-white/15"
              >
                <span aria-hidden className="text-base">
                  📝
                </span>{" "}
                Feedback
              </button>
              <button
                role="menuitem"
                onClick={() => setMenuPanel("roadmap")}
                className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm text-white transition-colors hover:bg-white/15"
              >
                <span aria-hidden className="text-base">
                  🗺️
                </span>{" "}
                Roadmap
              </button>
              <button
                role="menuitem"
                onClick={() => setMenuPanel("whatsnew")}
                className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm text-white transition-colors hover:bg-white/15"
              >
                <span aria-hidden className="text-base">
                  ✨
                </span>{" "}
                What&apos;s new
              </button>
              {/* LIVE on the Chrome Web Store since 2026-06-12 🎉 */}
              <a
                role="menuitem"
                href="https://chromewebstore.google.com/detail/erken/mggcbjggcbdpmbglbodkadgmpapcmelc"
                target="_blank"
                rel="noopener"
                className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm text-white transition-colors hover:bg-white/15"
              >
                <span aria-hidden className="text-base">
                  🧩
                </span>{" "}
                Add the browser extension
              </a>
            </>
          )}
          {menuPanel === "roadmap" && (
            <div className="w-[280px] px-3 py-2 text-sm text-white">
              <button
                onClick={() => setMenuPanel(null)}
                className="mb-2 flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/15"
              >
                <span aria-hidden>←</span> Back to main menu
              </button>
              <div className="pb-1.5 text-xs text-white/55">
                Where Erken is going
              </div>
              <div className="flex flex-col gap-1.5 leading-snug">
                <div>
                  🧠 <b>Memory is here</b> — Erken remembers you, your
                  business, and where you left off. It keeps getting smarter
                  over time.
                </div>
                <div>
                  ⚡ <b>Actions are coming</b> — Erken won&apos;t just show
                  you the button, it will do the task for you, right in your
                  account.
                </div>
                <div>
                  🌐 <b>Works on the Erken platform today</b> — expanding to
                  Zapier, QuickBooks, and the popular apps you already
                  connect
                </div>
                <div>
                  🧰 <b>Universal helpers on the way</b> — summarize any page,
                  size up a competitor, quick market research
                </div>
                <div>
                  💬 <b>Real conversation</b> — talk back-and-forth by voice,
                  not one question at a time
                </div>
                <div>
                  🖥️ <b>A desktop companion</b> — Erken on your screen,
                  working across every app you use, not just this one
                </div>
              </div>
              <div className="mt-2 border-t border-white/10 pt-2 text-xs text-white/55">
                Your vote decides what Erken learns next — tell us via{" "}
                <button
                  onClick={() => setMenuPanel("feedback")}
                  className="underline decoration-white/40 underline-offset-2 transition-colors hover:text-white/90"
                >
                  📝 Feedback
                </button>
                .
              </div>
            </div>
          )}
          {menuPanel === "whatsnew" && (
            <div className="w-[280px] px-3 py-2 text-sm text-white">
              <button
                onClick={() => setMenuPanel(null)}
                className="mb-2 flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/15"
              >
                <span aria-hidden>←</span> Back to main menu
              </button>
              <div className="pb-1.5 text-xs text-white/55">
                What&apos;s new in Erken
              </div>
              <div className="flex flex-col gap-1.5 leading-snug">
                <div>
                  🧭 <b>Meet the Platform</b> — a guided tour of everything the
                  platform can do
                </div>
                <div>
                  📂 Erken now <b>opens the menu for you</b> so it can point
                  things out
                </div>
                <div>
                  🚩 <b>&ldquo;Wrong instruction&rdquo; button</b> — flag Erken
                  if it points at the wrong spot
                </div>
                <div>🔊 Smoother step-by-step voice walkthroughs</div>
              </div>
              <div className="mt-2 border-t border-white/10 pt-2 text-xs text-white/55">
                Got an idea or found a bug? Tell us via{" "}
                <button
                  onClick={() => setMenuPanel("feedback")}
                  className="underline decoration-white/40 underline-offset-2 transition-colors hover:text-white/90"
                >
                  📝 Feedback
                </button>
                .
              </div>
            </div>
          )}
          {menuPanel === "feedback" && (
            <div className="w-[280px] px-3 py-2">
              <button
                onClick={() => setMenuPanel(null)}
                className="mb-2 flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/15"
              >
                <span aria-hidden>←</span> Back to main menu
              </button>
              <div className="pb-1.5 text-xs text-white/55">
                Your feedback — bugs, ideas, anything
              </div>
              {fbState === "sent" ? (
                <div className="py-2 text-sm text-white">
                  ✅ Got it — passed along. Thank you!
                </div>
              ) : (
                <>
                  <textarea
                    value={fbText}
                    onChange={(e) => setFbText(e.target.value)}
                    rows={3}
                    autoFocus
                    className="w-full resize-none rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40 outline-none focus:border-white/30"
                    placeholder="Tell us…"
                  />
                  <button
                    onClick={sendSiteFeedback}
                    disabled={fbState === "sending" || !fbText.trim()}
                    className="mt-1.5 w-full rounded-xl bg-white/15 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/25 disabled:opacity-40"
                  >
                    {fbState === "sending"
                      ? "Sending…"
                      : fbState === "error"
                        ? "Couldn't send — try again"
                        : "Send"}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </>
    )}
    {/* Bump Celly to full opacity when the cursor is on her. */}
    <style>{`
      .celly-container:hover,
      .celly-container:focus-within {
        opacity: var(--celly-hover-opacity, 1) !important;
      }
      /* While the chat is open, only Celly's intro bubble steps aside —
         the real Celly herself flies to the chat dock (pinned via the
         chat-dock effect), so we do NOT hide .celly-container. */
      body.erken-chat-open [aria-label="Talk to Celly"] {
        opacity: 0 !important;
        pointer-events: none !important;
      }
    `}</style>

    {/* SVG "gooey" filter for the cloud bubble. Defined once at the
        document level so the bubble can reference it via filter: url(#).
        How it works: Gaussian blur softens all input shapes; the color
        matrix then sharpens the alpha channel back, creating a metaballs
        / blob effect where overlapping shapes melt into ONE continuous
        silhouette. This is what gives the cloud its smooth merged edges
        instead of looking like a grid of circles. */}
    <svg
      aria-hidden
      className="fixed pointer-events-none"
      style={{ width: 0, height: 0, position: "fixed" }}
    >
      <defs>
        <filter id="cloud-goo" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 22 -10
            "
            result="goo"
          />
        </filter>
      </defs>
    </svg>

    {/* Celly's speech bubble — Shamil 2026-05-24 round 12: REAL CLOUD
        via SVG gooey filter. Many overlapping white circles inside a
        filtered container melt into ONE continuous blob silhouette.
        Text sits in a SEPARATE sibling on top (NOT inside the filtered
        container, otherwise text would be blurred too). */}
    <div
      ref={bubbleContainerRef}
      role="button"
      tabIndex={bubbleVisible ? 0 : -1}
      aria-label="Talk to Celly"
      onClick={() => {
        openChoiceMenu();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          openChoiceMenu();
        }
      }}
      className="fixed z-50 cursor-pointer"
      style={{
        width: "22rem",
        right: "100vw",
        bottom: "100vh",
        opacity: bubbleVisible ? 1 : 0,
        transition: "opacity 0.3s ease-out",
        pointerEvents: bubbleVisible ? "auto" : "none",
        filter: "drop-shadow(0 8px 14px rgba(0, 0, 0, 0.18))",
      }}
    >
      {/* Container with gooey filter — puffs inside get merged */}
      <div
        className="absolute inset-0"
        style={{ filter: "url(#cloud-goo)" }}
      >
        {(() => {
          // Cloud-shaped distribution: wider than tall, with extra puffs
          // top and bottom to give cloud-like scalloped edges.
          // Mobile (Shamil 2026-05-25): puffs scaled down so the cloud
          // hugs the short text instead of ballooning around it.
          // Bubble cloud puffs shrink on both viewports now that the SHORT
          // variant + smaller widthRem is universal. Desktop 0.7 keeps
          // the cloud silhouette but tightens it around the text.
          const PUFF_SCALE = isMobile ? 0.4 : 0.7;
          const puffs: React.ReactNode[] = [];
          const ROWS = 4;
          const COLS = 7;
          for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
              const offsetX = (r % 2) * (50 / (COLS - 1));
              const xPct = (c / (COLS - 1)) * 100 + offsetX - 7;
              const yPct = 20 + (r / (ROWS - 1)) * 60;
              puffs.push(
                <div
                  key={`fill-${r}-${c}`}
                  className="absolute bg-white rounded-full"
                  style={{
                    width: `${80 * PUFF_SCALE}px`,
                    height: `${80 * PUFF_SCALE}px`,
                    left: `${xPct}%`,
                    top: `${yPct}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              );
            }
          }
          const topPuffs = [
            { x: 12, y: 5, size: 70 },
            { x: 28, y: -2, size: 90 },
            { x: 45, y: 0, size: 100 },
            { x: 62, y: -3, size: 95 },
            { x: 80, y: 5, size: 75 },
          ];
          topPuffs.forEach((p, i) => {
            puffs.push(
              <div
                key={`top-${i}`}
                className="absolute bg-white rounded-full"
                style={{
                  width: `${p.size * PUFF_SCALE}px`,
                  height: `${p.size * PUFF_SCALE}px`,
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            );
          });
          const botPuffs = [
            { x: 15, y: 92, size: 65 },
            { x: 35, y: 98, size: 80 },
            { x: 55, y: 100, size: 85 },
            { x: 78, y: 92, size: 70 },
          ];
          botPuffs.forEach((p, i) => {
            puffs.push(
              <div
                key={`bot-${i}`}
                className="absolute bg-white rounded-full"
                style={{
                  width: `${p.size * PUFF_SCALE}px`,
                  height: `${p.size * PUFF_SCALE}px`,
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            );
          });
          return puffs;
        })()}
      </div>
      {/* Text content — SEPARATE sibling, NOT inside the goo filter.
          Sits on top of the merged cloud silhouette. Copy is the active
          variant chosen by the auto-positioner (LONG/MEDIUM/SHORT
          depending on available space). */}
      <div className={`relative z-10 ${isMobile ? "px-4 py-4" : "px-6 py-5"}`}>
        <div className={`${isMobile ? "text-[11px]" : "text-[12px]"} leading-relaxed text-neutral-800`}>
          {activeVariant?.text ?? CELLY_INTRO}
        </div>
      </div>
    </div>
    </>
  );
}
