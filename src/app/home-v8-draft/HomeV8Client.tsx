"use client";

/**
 * HomeV8Client — a COPY of the live homepage (preview-v7) restructured to
 * the approved /home-draft order (2026-07-20). See ./page.tsx for the
 * section-order rationale.
 *
 * 2026-08-16 (owner ruling, Shamil — final): the Erkenbot assistant
 * experience is REMOVED from the homepage — the roaming Celly overlay, the
 * SphereScrollStage particle/dragon stage, and the Retell voice widget are
 * all gone. The page is a plain document now; GHL's own chat bubble (loaded
 * by ErkenChatWidget) is the chat launcher.
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
 *   - Hero keeps the live founder video + gains the price tease. (The
 *     "See your industry" secondary button was removed 2026-08-13, Shamil.)
 *   - Meet Erken section removed 2026-07-30 (Erkenbot retired as a
 *     downloadable product; it stays only as this site's assistant).
 *   - 2026-08-13 (owner pre-launch pass): hero headline/body rewritten to
 *     sell the platform + receptionist without pitching the Erken
 *     assistant; every generic "Get started" CTA now SCROLLS to #pricing
 *     (reversal of the 2026-08-12 straight-to-payment ruling — one button
 *     can't pick between three payment links); only the per-tier pricing
 *     cards link to Payoneer.
 *   - Added: full /start-style pricing cards, Custom solutions, Get leads
 *     door. Added a sticky DraftHeader (logo / Industries / How it works /
 *     Pricing / persistent Try-for-free), z-50. (2026-07-21: dust canvas/
 *     Celly/bubble now sit ABOVE the header — see the stacking comment
 *     right above <DraftHeader /> below — so the header no longer clips
 *     them; it's still fully clickable since those layers are
 *     pointer-events-none except the bubble, which stays topmost.)
 *   - No footer.
 *   - sectionCount lowered to the new section count; sectionYOverrides
 *     dropped and SCENE_OFFSETS collapsed to a generic default (the old
 *     per-scene offsets were calibrated to the OLD order; the on-stop
 *     findEmptySpot auto-positioner is what actually places Celly, so a
 *     generic anchor is correct here — see the SCENE_OFFSETS note below).
 */

import { useEffect, useState, Fragment } from "react";
import { motion } from "framer-motion";
import { Check, ChevronDown, Phone } from "lucide-react";
import { IconArrowNarrowLeft, IconArrowNarrowRight } from "@tabler/icons-react";
import { INTEGRATION_LOGOS } from "./integration-logos";
import { STACK_LOGOS } from "./stack-logos";
import { Scene1IntroVideo } from "@/components/Scene1IntroVideo";
import { SceneIndustriesCarousel } from "@/components/SceneIndustriesCarousel";
import ProductSections from "@/components/ProductSections";
import Faq from "@/components/Faq";
import Process from "@/components/Process";
import WhyUs from "@/components/WhyUs";
import ErkenChatWidget, { openErkenChat } from "@/components/ErkenChatWidget";
import {
  PLATFORM_BASE_MONTHLY,
  PLATFORM_BILLING_PERIODS,
  PLATFORM_FEATURES,
  PAYMENT_LINKS,
  billingPeriodNote,
  type BillingPeriod,
} from "@/lib/pricing";

const ease = [0.16, 1, 0.3, 1] as const;

// v8 restructure: only the HERO stays as an L/R Section. The four
// full-screen pipeline step scenes that used to follow it are replaced by
// the compressed illustrated PipelineStepper below. The hero keeps the
// live founder video (Scene1IntroVideo) and gains a one-line price tease
// (home-draft additions; the "See your industry" button was removed
// 2026-08-13).
const SECTIONS = [
  {
    side: "left" as const,
    kicker: "Erken Systems",
    headline: "Websites & AI receptionists for service businesses",
    body: "Here's the truth: most small businesses lose customers to a missed call or a website that doesn't work on a phone. We build you a site that gets found on Google, and an AI receptionist that answers every call, text, and chat — 24/7. No miracles, no fluff. You commit to using it — it never lets a lead slip.",
    cta: "Get started",
    priceTease: "Platform from $77 a month.",
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
        {cta && (
          <div className="mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            {cta && (
              /* Primary CTA scrolls to the pricing section (owner ruling,
                 2026-08-13 — reversal of the 2026-08-12 straight-to-payment
                 ruling: one "Get started" button can't pick between three
                 billing periods, so it sends visitors to the plan cards,
                 and each card carries its own payment link). The "Talk to
                 us" ghost button beside it opens the Erken chat so the
                 talk-to-a-human path stays obvious. */
              <a
                href="#pricing"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-medium text-bg transition-all hover:bg-accent-hover"
              >
                {cta} →
              </a>
            )}
            <button
              type="button"
              onClick={() => openErkenChat()}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-medium text-text transition-all hover:border-border-strong hover:bg-surface"
            >
              Talk to us
            </button>
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

/* ================================================================== */
/* Ported section content from /home-draft (the approved restructure). */
/* (The data-celly-avoid tags below are inert leftovers from the        */
/* retired Celly auto-positioner — harmless, kept to avoid diff churn.) */
/* ================================================================== */

function SectionKicker({ children }: { children: React.ReactNode }) {
  return <div className="mono-label">{children}</div>;
}

/** Sticky header — logo + Industries / How it works / Pricing anchors +
 *  persistent "Talk to us" (opens the Erken chat) + "Get started" which
 *  scrolls to #pricing (owner ruling, 2026-08-13 — reversal of the
 *  2026-08-12 straight-to-payment ruling: the visitor picks a plan on the
 *  pricing cards, each with its own payment link).
 *  z-50 (not z-40) matches the live Header.tsx
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
          {/* Products dropdown (Shamil 2026-08-16, Stone Systems nav
              pattern): hover/focus menu of the four product anchors in
              the "What you get" block (ids live in ProductSections.tsx). */}
          <div className="group relative">
            <button
              type="button"
              className="flex items-center gap-1 text-sm text-text-muted transition-colors hover:text-text"
            >
              Products
              <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
            </button>
            <div className="invisible absolute top-full left-0 pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <div className="w-64 rounded-xl border border-border bg-surface p-2 shadow-lg">
                {[
                  ["Website", "#product-website"],
                  ["AI receptionist", "#product-receptionist"],
                  ["Review engine", "#product-reviews"],
                  ["Campaigns & referrals", "#product-campaigns"],
                ].map(([label, href]) => (
                  <a
                    key={href}
                    href={href}
                    className="block rounded-lg px-3 py-2 text-sm text-text-muted transition-colors hover:bg-surface-2 hover:text-text"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <a href="#industries" className="text-sm text-text-muted transition-colors hover:text-text">
            Industries
          </a>
          <a href="#pipeline" className="text-sm text-text-muted transition-colors hover:text-text">
            How it works
          </a>
          <a href="#pricing" className="text-sm text-text-muted transition-colors hover:text-text">
            Pricing
          </a>
          {/* Desktop: plain tel: link (the Retell in-browser voice call was
              removed with Erkenbot 2026-08-16). Mobile keeps the icon-button
              tel: link just below (native dialer is correct there). */}
          <a
            href="tel:+18887996065"
            className="flex items-center gap-1.5 font-mono text-sm text-text-muted transition-colors hover:text-text"
          >
            <Phone className="h-3.5 w-3.5" />
            (888) 799-6065
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="tel:+18887996065"
            aria-label="Call (888) 799-6065"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-muted transition-colors hover:border-border-strong hover:text-text md:hidden"
          >
            <Phone className="h-4 w-4" />
          </a>
          <button
            type="button"
            onClick={() => openErkenChat()}
            className="rounded-lg px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:text-text"
          >
            Talk to us
          </button>
          <a
            href="#pricing"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg transition-all hover:bg-accent-hover"
          >
            Get started
          </a>
        </div>
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
      {/* Carousel + ONE centered control cluster directly under it: the two
          (heavier) arrows then the CTAs, as a single row (rev-3 live fix —
          the arrows were easy to miss and the CTA floated like an orphan
          below). The arrows hide on mobile (finger-scroll); the buttons
          stay centered at both widths. */}
      <div data-celly-avoid className="mt-4">
        <SceneIndustriesCarousel
          arrowsPosition="center"
          arrowsTrailing={
            <>
              <a
                href="#pricing"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-base font-medium text-bg transition-all hover:bg-accent-hover hover:scale-[1.02]"
              >
                Get started →
              </a>
              <button
                type="button"
                onClick={() => openErkenChat()}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3.5 text-base font-medium text-text transition-all hover:border-border-strong hover:bg-surface"
              >
                Talk to us
              </button>
              <a
                href="/trades"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3.5 text-base font-medium text-text transition-all hover:border-border-strong hover:bg-surface"
              >
                All industries
              </a>
            </>
          }
        />
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

// Phase icons redrawn for the 1-second "name-the-concept" test (Shamil).
// Same flat sage/clay/cream style.

// A small 5-point star centered at the origin (outer r 7, inner r 2.8) — used
// by the Fans icon; placed via a translate transform.
const STAR_D =
  "M0 -7 L1.65 -2.26 L6.66 -2.16 L2.66 0.87 L4.11 5.66 L0 2.8 L-4.11 5.66 L-2.66 0.87 L-6.66 -2.16 L-1.65 -2.26 Z";

/** CAPTURE — a VERTICAL funnel with lead-dots falling into it. */
function IllustrationCapture() {
  return (
    <IllustrationBackdrop>
      {/* leads falling in */}
      <circle cx="46" cy="34" r="4" fill={ILLO_CLAY} />
      <circle cx="60" cy="28" r="4.5" fill={ILLO_CLAY} />
      <circle cx="74" cy="34" r="4" fill={ILLO_CLAY} />
      {/* vertical funnel */}
      <path d="M32 48 L88 48 L66 76 L66 90 L54 90 L54 76 Z" fill={ILLO_SAGE} />
      {/* rim highlight */}
      <rect x="32" y="46" width="56" height="5" rx="2.5" fill={ILLO_NEUTRAL} />
      {/* captured lead coming out the bottom */}
      <circle cx="60" cy="102" r="4.5" fill={ILLO_CLAY} />
    </IllustrationBackdrop>
  );
}

/** NURTURE — a small plant growing, with water drops above (tending/growth). */
function IllustrationNurture() {
  return (
    <IllustrationBackdrop>
      {/* water drops */}
      <circle cx="48" cy="30" r="3" fill={ILLO_SAGE} opacity="0.65" />
      <circle cx="60" cy="26" r="3.5" fill={ILLO_SAGE} opacity="0.65" />
      <circle cx="72" cy="30" r="3" fill={ILLO_SAGE} opacity="0.65" />
      {/* pot */}
      <path d="M46 78 L74 78 L70 94 L50 94 Z" fill={ILLO_CLAY} />
      <rect x="45" y="74" width="30" height="6" rx="3" fill={ILLO_NEUTRAL} />
      {/* stem */}
      <path d="M60 74 V50" stroke={ILLO_SAGE} strokeWidth="4" strokeLinecap="round" />
      {/* leaves */}
      <path d="M60 62 Q46 58 46 44 Q58 46 60 62 Z" fill={ILLO_SAGE} />
      <path d="M60 56 Q74 52 74 40 Q63 42 60 56 Z" fill={ILLO_SAGE} />
    </IllustrationBackdrop>
  );
}

/** CLOSE — a signed document with a bold green check (deal done). */
function IllustrationClose() {
  return (
    <IllustrationBackdrop>
      {/* paper */}
      <rect x="36" y="26" width="44" height="58" rx="6" fill="#FFFFFF" stroke={ILLO_NEUTRAL} strokeWidth="2" />
      {/* text lines */}
      <rect x="44" y="36" width="28" height="4" rx="2" fill={ILLO_NEUTRAL} />
      <rect x="44" y="46" width="28" height="4" rx="2" fill={ILLO_NEUTRAL} />
      <rect x="44" y="56" width="18" height="4" rx="2" fill={ILLO_NEUTRAL} />
      {/* signature */}
      <path d="M44 70 q5 -7 10 0 t10 0" stroke={ILLO_CLAY} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* bold check badge */}
      <circle cx="82" cy="82" r="16" fill={ILLO_SAGE} />
      <path d="M74 82 L80 88 L91 75" stroke="#FFFFFF" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </IllustrationBackdrop>
  );
}

/** TURN CUSTOMERS INTO FANS — a row of 5 stars above a happy face. */
function IllustrationFans() {
  return (
    <IllustrationBackdrop>
      {[34, 46, 58, 70, 82].map((cx) => (
        <path key={cx} d={STAR_D} transform={`translate(${cx} 40)`} fill={ILLO_CLAY} />
      ))}
      <circle cx="60" cy="78" r="18" fill={ILLO_SAGE} />
      <circle cx="53" cy="74" r="2.6" fill={ILLO_CREAM} />
      <circle cx="67" cy="74" r="2.6" fill={ILLO_CREAM} />
      <path d="M52 82 Q60 90 68 82" stroke={ILLO_CREAM} strokeWidth="3" fill="none" strokeLinecap="round" />
    </IllustrationBackdrop>
  );
}

/** WIN BACK OLD CUSTOMERS — a person with a strong returning-loop arrow. */
function IllustrationWinback() {
  return (
    <IllustrationBackdrop>
      {/* person */}
      <circle cx="58" cy="58" r="8" fill={ILLO_CLAY} />
      <path d="M45 86 Q45 70 58 70 Q71 70 71 86 Z" fill={ILLO_CLAY} />
      {/* returning loop arrow sweeping over the top */}
      <path d="M86 70 A29 29 0 1 0 55 30" fill="none" stroke={ILLO_SAGE} strokeWidth="4.5" strokeLinecap="round" />
      {/* arrowhead pointing back down toward the person */}
      <path d="M55 30 L63 27 M55 30 L58 38" stroke={ILLO_SAGE} strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
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
    Illustration: IllustrationCapture,
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
    Illustration: IllustrationNurture,
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
    Illustration: IllustrationClose,
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
    Illustration: IllustrationFans,
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
    Illustration: IllustrationWinback,
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
                  href="#pricing"
                  className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-base font-medium text-bg transition-all hover:bg-accent-hover hover:scale-[1.02]"
                >
                  Get started →
                </a>
                <a
                  href="#pricing"
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3.5 text-base font-medium text-text transition-all hover:border-border-strong hover:bg-surface"
                >
                  See pricing
                </a>
                <button
                  type="button"
                  onClick={() => openErkenChat()}
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3.5 text-base font-medium text-text transition-all hover:border-border-strong hover:bg-surface"
                >
                  Talk to us
                </button>
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

/* ---- Pricing — owner-approved restructure (2026-08-12): FOUR cards — the
 * Platform as THREE separate billing-period cards (Monthly $97, 6 months
 * $87/mo, Yearly $77/mo — same PLATFORM_FEATURES on each, differing only in
 * price + derived billing note). The Complete-system AND Custom-solutions
 * cards are removed everywhere. Numbers/features come from
 * src/lib/pricing.ts, the single source shared with /start so both pages
 * can't drift out of sync.
 *
 * No "Try for free" / free-trial language. Each period card's CTA is
 * "Get started" and links to /start, where that period's actual signup
 * form lives. The 6-months card carries the emphasized treatment (accent
 * border + "Most popular" badge) that the old Complete-system card had. */
function PlatformPeriodCardHome({ period }: { period: BillingPeriod }) {
  const emphasized = period.id === "6-months";
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease }}
      whileHover={{ y: -2 }}
      className={`relative flex flex-col rounded-2xl bg-surface p-8 transition-colors duration-200 ${
        emphasized
          ? "border-2 border-accent hover:border-accent-hover"
          : "border border-border hover:border-border-strong"
      }`}
    >
      {emphasized && (
        <span className="absolute right-6 top-6 rounded-full bg-accent px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.05em] text-bg">
          Most popular
        </span>
      )}
      <h3 className="text-lg font-semibold text-text">{period.label}</h3>
      <div className="mt-4">
        <span className="text-3xl font-bold tracking-tight text-text" style={{ letterSpacing: "-0.03em" }}>
          ${period.perMonth}/mo
        </span>
        <span className="ml-2 text-xs text-text-dim">{billingPeriodNote(period)}</span>
      </div>
      <p className="mt-4 font-mono text-xs uppercase tracking-[0.05em] text-text-dim">
        What&apos;s included
      </p>
      <ul className="mt-2 flex-1 space-y-1.5 text-sm text-text-muted">
        {PLATFORM_FEATURES.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={2.5} />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <a
        href={PAYMENT_LINKS[period.id]}
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-bg transition-all hover:bg-accent-hover hover:scale-[1.02]"
      >
        Get started →
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
            One platform. Pick how you pay.
          </h2>
          <p className="mt-4 text-base text-text-muted md:text-lg">
            Everything included from ${PLATFORM_BASE_MONTHLY}/mo — pay less
            per month when you prepay.
          </p>
        </motion.div>

        <div data-celly-avoid className="mt-10 grid gap-6 md:grid-cols-3">
          {PLATFORM_BILLING_PERIODS.map((p) => (
            <PlatformPeriodCardHome key={p.id} period={p} />
          ))}
        </div>
        {/* Usage-cost disclosure (owner ask, 2026-08-12): voice minutes are
            pass-through, so heavy call volume never surprises anyone. No
            per-minute number — rates change. */}
        <p className="mt-6 max-w-2xl text-xs leading-relaxed text-text-dim">
          AI voice minutes are billed separately at cost — you only pay for
          what you use, so a busy month never brings a surprise bill.
        </p>
      </div>
    </section>
  );
}

// Get-leads / "you want customers" section REMOVED from the homepage entirely
// (rev-3 addendum): it was a coming-soon dead end here. The real inactive
// "Coming soon" GetLeadsCard still lives on /start (untouched).

/* ================================================================== */
/* ROUND 3 sections (grounded in vault/03-research/2026-07-20-ghl-       */
/* integrations-and-ai-lineup.md). Brand-neutral: never name the         */
/* underlying platform vendor. Honest ranges only.                      */
/* ================================================================== */

/* ---- AI section — modeled beat-for-beat on HubSpot's Breeze "Built-in AI
 * agents that work for you 24/7" section: a bright-but-subtle colorful warm
 * wash (theirs peach→pink; ours a peach/sage/gold wash on cream), headline
 * top-left + promise top-right, and an auto-advancing card carousel (center
 * card raised + white, side cards tinted + recessed, side arrows, dots,
 * pause on hover/focus) with the mini UI vignettes inside. AI lineup reframed
 * brand-neutral per the research (Voice AI → AI phone agent, Conversation AI
 * → AI chat agent, Reviews AI → AI review replies). Copy stays no-hard-claims
 * (billing/included decision still open). Between pipeline and Meet Erken. -- */
// Minimal vignettes (Shamil: HubSpot's are ONE clean floating mini-window,
// not several stacked pieces). Each returns a single small window; the card
// provides the tinted padded backdrop it floats on.
function VignettePhone() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/15 text-base">📞</span>
      <div className="text-left text-xs leading-tight">
        <div className="font-semibold text-text">Call booked</div>
        <div className="text-text-dim">Tue · 2:00 PM</div>
      </div>
    </div>
  );
}
function VignetteChat() {
  return (
    <div className="max-w-[12rem] rounded-2xl rounded-bl-sm bg-accent px-3.5 py-2.5 text-left text-xs leading-snug text-bg">
      Yes — I can book you Friday at 10 AM.
    </div>
  );
}
function VignetteReview() {
  return (
    <div className="text-center">
      <div className="text-sm tracking-[0.18em] text-accent">★★★★★</div>
      <div className="mt-1.5 text-xs text-text">&ldquo;Thank you, Maria!&rdquo;</div>
    </div>
  );
}

const AI_CARDS: { title: string; desc: string; Vignette: () => React.ReactElement }[] = [
  {
    title: "AI phone agent",
    desc: "Answers every call in two rings, checks your live calendar, and books the job — day or night.",
    Vignette: VignettePhone,
  },
  {
    title: "AI chat agent",
    desc: "Replies on web chat, SMS, and DMs, qualifies the lead, and books the appointment in the same thread.",
    Vignette: VignetteChat,
  },
  {
    title: "AI review replies",
    desc: "Responds to every Google and Facebook review in your voice — on autopilot or one tap to approve.",
    Vignette: VignetteReview,
  },
];

/* HubSpot-Breeze-style auto-advancing carousel: the active card sits raised
 * and white in the CENTER, the others tinted + recessed to the sides. Auto-
 * rotates on a timer, pauses on hover/focus, side arrows + dots for manual
 * control. On mobile only the center card shows (sides fade out). Respects
 * prefers-reduced-motion (no auto-advance; arrows/dots still work). */
function AICarousel() {
  const n = AI_CARDS.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const t = setInterval(() => setActive((a) => (a + 1) % n), 3800);
    return () => clearInterval(t);
  }, [paused, n]);

  const go = (dir: number) => setActive((a) => (a + dir + n) % n);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Taller deck so the PORTRAIT cards dominate the section by size. */}
      <div className="relative mx-auto flex h-[460px] max-w-4xl items-center justify-center md:h-[480px]">
        {AI_CARDS.map((card, i) => {
          const offset = (((i - active) % n) + n) % n; // 0=center,1=right,n-1=left
          const slot = offset === 0 ? "center" : offset === 1 ? "right" : "left";
          const isCenter = slot === "center";
          const sideX = slot === "right" ? "64%" : "-64%";
          // Drive the deck with plain CSS transforms + transitions (framer's
          // `animate` object wasn't applying transforms reliably here). Mobile
          // hides the side cards via a media-query class (max-md:opacity-0) —
          // more reliable than a JS isMobile flag.
          const transform = isCenter
            ? "translateX(0) scale(1)"
            : `translateX(${sideX}) scale(0.82)`;
          return (
            <div
              key={card.title}
              className={`absolute w-[280px] transition-[transform,opacity] duration-500 sm:w-[300px] ${
                isCenter ? "opacity-100" : "opacity-[0.55] max-md:opacity-0"
              }`}
              style={{
                zIndex: isCenter ? 20 : 10,
                transform,
                transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
              }}
              aria-hidden={!isCenter}
            >
              {/* Vertical PORTRAIT card (~3:4), phone-screen proportions. */}
              <div
                className={
                  isCenter
                    ? "flex h-[420px] flex-col rounded-2xl border border-border bg-surface p-5 shadow-[0_26px_70px_-24px_rgba(126,166,135,0.6)]"
                    : "flex h-[420px] flex-col rounded-2xl border border-border bg-surface-2 p-5 shadow-sm"
                }
              >
                {/* Minimal vignette: ONE floating mini-window centered on a
                    tinted backdrop, generous padding. */}
                <div className="flex flex-1 items-center justify-center rounded-xl border border-border/50 bg-gradient-to-br from-surface-2 to-[#f0ece0]">
                  <div className="rounded-2xl border border-border bg-surface px-5 py-4 shadow-md">
                    <card.Vignette />
                  </div>
                </div>
                <h3
                  className="mt-4 text-base font-semibold text-text"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {card.title}
                </h3>
                <p className={`mt-1.5 text-sm leading-relaxed ${isCenter ? "text-text-muted" : "text-text-dim"}`}>
                  {card.desc}
                </p>
                {/* Learn more link removed (Shamil 2026-07-30): the AI-team
                    cards carry just their vignette + info, no button. */}
              </div>
            </div>
          );
        })}

        {/* Side arrows */}
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous AI agent"
          className="absolute left-0 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface text-text shadow-md transition-colors hover:border-border-strong hover:bg-surface-2 md:left-2"
        >
          <IconArrowNarrowLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next AI agent"
          className="absolute right-0 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface text-text shadow-md transition-colors hover:border-border-strong hover:bg-surface-2 md:right-2"
        >
          <IconArrowNarrowRight className="h-5 w-5" />
        </button>
      </div>

      {/* Dots */}
      <div className="mt-6 flex justify-center gap-2">
        {AI_CARDS.map((c, i) => (
          <button
            key={c.title}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Show ${c.title}`}
            aria-current={i === active}
            className={`h-2 rounded-full transition-all ${
              i === active ? "w-6 bg-accent" : "w-2 bg-border hover:bg-border-strong"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function AISection() {
  return (
    <section
      id="ai"
      className="relative overflow-hidden py-20 md:py-28"
      // HubSpot-Breeze-style bright-but-subtle COLORFUL warm wash, translated
      // to our palette: soft peach (warm clay-light) + sage + a touch of gold
      // over cream. Bright and popping, not cluttered (rev-3 addendum).
      style={{
        background:
          "radial-gradient(58% 80% at 14% 8%, rgba(232,155,122,0.24), transparent 60%)," +
          "radial-gradient(54% 74% at 88% 14%, rgba(126,166,135,0.24), transparent 62%)," +
          "radial-gradient(52% 62% at 62% 96%, rgba(242,201,76,0.14), transparent 62%)," +
          "linear-gradient(180deg, #FBF7EF 0%, var(--bg) 100%)",
      }}
    >
      {/* Compact heading block (Shamil: the CAROUSEL must dominate by size —
          keep the type tight so the eye lands on the cards first). */}
      <div className="relative mx-auto max-w-6xl px-6 md:px-8">
        <div className="grid gap-x-8 gap-y-2 md:grid-cols-2 md:items-end">
          <motion.div
            data-celly-avoid
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease }}
          >
            <SectionKicker>Your AI team</SectionKicker>
            <h2
              className="mt-2 text-2xl font-bold tracking-tight md:text-3xl"
              style={{ letterSpacing: "-0.02em", lineHeight: 1.15 }}
            >
              Built-in AI that works for you 24/7.
            </h2>
          </motion.div>
          <motion.p
            data-celly-avoid
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease, delay: 0.1 }}
            className="max-w-md text-sm leading-relaxed text-text-muted md:text-base"
          >
            Chat, calls, reviews, content, and workflows — a whole AI team,
            included and working together from day one. It answers, books,
            replies, and writes while you run the business.
          </motion.p>
        </div>

        <div data-celly-avoid className="mt-8">
          <AICarousel />
        </div>

        <p data-celly-avoid className="mt-8 text-center text-sm text-text-muted">
          Also included: <b className="text-text">an AI content writer</b>,{" "}
          <b className="text-text">AI-assisted page building</b>, and an{" "}
          <b className="text-text">AI workflow assistant</b>.
        </p>
        <p className="mt-2 text-center text-xs text-text-dim">
          Included on every plan — with pay-as-you-go and unlimited AI tiers as you scale.
        </p>
      </div>
    </section>
  );
}

/* ---- Stack-comparison table ("replace your whole stack"). Real tool LOGOS
 * (Simple Icons where available, text chip otherwise) + a single defensible
 * per-category price + Included check. Expanded to the FULL honest set of
 * categories the platform genuinely replaces (14 rows), each priced at a
 * defensible current point — NOT premium picks — so the summed total lands
 * where the math lands (~$1,191/mo) and answers "why not $1,876": a bigger
 * honest total from counting ALL replaced categories, not inflated per-row
 * numbers. Each column's TOTAL sits under its own column (struck total under
 * the price column, $97 under Included). Placed after pricing. ---- */
const STACK_ROWS: { cat: string; tools: string[]; price: number }[] = [
  { cat: "CRM", tools: ["HubSpot", "Pipedrive"], price: 45 },
  { cat: "Email marketing", tools: ["Mailchimp", "ActiveCampaign"], price: 65 },
  { cat: "Funnels & landing pages", tools: ["ClickFunnels", "Leadpages"], price: 147 },
  { cat: "Appointment booking", tools: ["Calendly", "Acuity"], price: 25 },
  { cat: "Reviews & reputation", tools: ["Podium", "Birdeye"], price: 199 },
  { cat: "SMS & phone system", tools: ["Twilio", "SimpleTexting"], price: 75 },
  { cat: "Website & hosting", tools: ["WordPress"], price: 45 },
  { cat: "Automations", tools: ["Zapier", "Make", "n8n"], price: 49 },
  { cat: "Courses & memberships", tools: ["Kajabi", "Teachable"], price: 149 },
  { cat: "Communities", tools: ["Circle", "Skool"], price: 89 },
  { cat: "Call tracking", tools: ["CallRail"], price: 75 },
  { cat: "Document signing", tools: ["DocuSign", "PandaDoc"], price: 50 },
  { cat: "Branded mobile app", tools: ["Custom app"], price: 99 },
  { cat: "Analytics & dashboards", tools: ["Google Analytics", "Databox"], price: 79 },
];
const STACK_TOTAL = STACK_ROWS.reduce((s, r) => s + r.price, 0); // 1191

/** A tool as a uniform pill: a real logo (Simple Icons vendored) when we have
 *  the mark, otherwise a monogram square (first letter) so text-only tools
 *  carry the same visual weight and the column reads uniform. */
function ToolMark({ name }: { name: string }) {
  const logo = STACK_LOGOS[name];
  const initial = (name.replace(/[^A-Za-z0-9]/g, "")[0] || "•").toUpperCase();
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-2 px-2 py-1 text-xs font-medium text-text-muted"
      title={name}
    >
      {logo ? (
        <svg viewBox="0 0 24 24" role="img" aria-label={name} className="h-3.5 w-3.5 shrink-0" fill={logo.color}>
          <title>{name}</title>
          <path d={logo.path} />
        </svg>
      ) : (
        <span
          aria-hidden
          className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px] bg-text-dim/20 text-[8px] font-bold text-text-dim"
        >
          {initial}
        </span>
      )}
      {name}
    </span>
  );
}

function StackComparisonSection() {
  return (
    <section id="replace-your-stack" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <motion.div
          data-celly-avoid
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease }}
          className="max-w-2xl"
        >
          <SectionKicker>Replace your whole stack</SectionKicker>
          <h2
            className="mt-3 text-3xl font-bold tracking-tight md:text-5xl"
            style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
          >
            One platform instead of fourteen subscriptions.
          </h2>
          <p className="mt-4 text-base text-text-muted md:text-lg">
            Everything below is included — platform and AI receptionist under
            one login, one bill, from $77/mo.
          </p>
        </motion.div>

        {/* DESKTOP — the CATEGORY rows show every tool/category the platform
            replaces, with the struck DIY total next to the single Platform
            price. One CSS grid guarantees row alignment across all four
            columns. 2026-08-12 (owner ask): with the Complete System column
            gone, the PLATFORM column carries the emphasis treatment the
            accent column used to have — solid accent bg, white text, and
            the rounded overhang below the table holding the "Get started"
            CTA (→ /start). The totals row's two prices share one structure
            (same size, items-end) so their baselines line up. */}
        <div data-celly-avoid className="relative mb-24 mt-10 hidden md:block">
          <div className="grid grid-cols-[1.15fr_1.6fr_0.65fr_150px] overflow-hidden rounded-t-2xl rounded-bl-2xl shadow-[0_18px_50px_-24px_rgba(42,38,32,0.35)]">
            {/* Header */}
            <div className="bg-[var(--accent-soft)] px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.08em] text-text">Category</div>
            <div className="bg-[var(--accent-soft)] px-3 py-3.5 font-mono text-[11px] uppercase tracking-[0.08em] text-text">The tools you&apos;d buy</div>
            <div className="bg-[var(--accent-soft)] px-3 py-3.5 font-mono text-[11px] uppercase tracking-[0.08em] text-text">Price on its own</div>
            <div className="flex items-center justify-center bg-accent px-3 py-3.5 text-center font-mono text-[11px] uppercase tracking-[0.08em] text-white">
              Platform ${PLATFORM_BASE_MONTHLY}
            </div>

            {/* Category rows — every category included in the Platform. */}
            {STACK_ROWS.map((row, i) => {
              const zebra = i % 2 === 1 ? "bg-surface-2/60" : "bg-surface";
              return (
                <Fragment key={row.cat}>
                  <div className={`flex items-center px-6 py-3.5 font-semibold text-text ${zebra} border-t border-border/50`}>{row.cat}</div>
                  <div className={`flex items-center px-3 py-3.5 ${zebra} border-t border-border/50`}>
                    <div className="flex flex-wrap gap-1.5">
                      {row.tools.map((t) => (
                        <ToolMark key={t} name={t} />
                      ))}
                    </div>
                  </div>
                  <div className={`flex items-center px-3 py-3.5 text-sm font-semibold text-text-muted ${zebra} border-t border-border/50`}>
                    ${row.price}/mo
                  </div>
                  <div className="flex items-center justify-center border-t border-white/15 bg-accent">
                    <Check className="h-5 w-5 text-white" strokeWidth={3} />
                  </div>
                </Fragment>
              );
            })}

            {/* Totals row — both price cells use the SAME inner structure
                (items-end row, identical size classes) so the struck stack
                total and the Platform price sit on one baseline. */}
            <div className="flex items-center border-t-2 border-border bg-[var(--accent-soft)] px-6 py-5 text-sm font-semibold text-text">
              The whole stack
            </div>
            <div className="border-t-2 border-border bg-[var(--accent-soft)]" />
            <div className="flex flex-col justify-center border-t-2 border-border bg-[var(--accent-soft)] px-3 py-5">
              <div className="flex items-end gap-1">
                <span className="text-2xl font-bold tracking-tight text-[var(--clay)] line-through decoration-[var(--clay)]/70 decoration-2 md:text-3xl" style={{ letterSpacing: "-0.02em" }}>
                  ${STACK_TOTAL.toLocaleString()}
                </span>
                <span className="mb-0.5 text-sm font-medium text-text-dim">/mo</span>
              </div>
              <div className="text-[11px] text-text-dim">billed separately</div>
            </div>
            <div className="flex flex-col items-center justify-center border-t-2 border-white/25 bg-accent py-5 text-white">
              <div className="flex items-end gap-1">
                <span className="text-2xl font-bold tracking-tight md:text-3xl" style={{ letterSpacing: "-0.02em" }}>
                  ${PLATFORM_BASE_MONTHLY}
                </span>
                <span className="mb-0.5 text-sm font-medium text-white/85">/mo</span>
              </div>
              <div className="text-[11px] font-medium text-white/85">all included</div>
            </div>
          </div>
          {/* Overhang — the Platform's accent column extends past the
              table's bottom with the CTA inside (same treatment the old
              accent column had; now "Get started" → /start). */}
          <div className="absolute right-0 top-full w-[150px] rounded-b-2xl bg-accent px-3 pb-4 pt-3 text-center shadow-[0_18px_40px_-16px_rgba(126,166,135,0.85)]">
            <a
              href="#pricing"
              className="inline-flex w-full items-center justify-center gap-1 rounded-lg bg-white px-3 py-2.5 text-xs font-semibold text-accent shadow-sm transition-transform hover:scale-[1.02]"
            >
              Get started →
            </a>
          </div>
        </div>

        {/* MOBILE — stacked rows + a full-width green footer card (the
            included-check treatment collapses to a footer so stacking never
            breaks). */}
        <div data-celly-avoid className="mt-10 md:hidden">
          <div className="overflow-hidden rounded-2xl border border-border">
            {STACK_ROWS.map((row, i) => (
              <div key={row.cat} className={`px-5 py-4 ${i > 0 ? "border-t border-border/50" : ""}`}>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-text">{row.cat}</span>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-sm font-semibold text-text-muted">${row.price}/mo</span>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent">
                      <Check className="h-3 w-3 text-white" strokeWidth={3} />
                    </span>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {row.tools.map((t) => (
                    <ToolMark key={t} name={t} />
                  ))}
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between border-t-2 border-border bg-[var(--accent-soft)] px-5 py-4">
              <span className="text-sm font-semibold text-text">The whole stack</span>
              <span className="text-2xl font-bold tracking-tight text-[var(--clay)] line-through decoration-[var(--clay)]/70 decoration-2">
                ${STACK_TOTAL.toLocaleString()}
                <span className="ml-1 text-sm font-normal">/mo</span>
              </span>
            </div>
          </div>
          {/* Green footer card — the Platform's price vs the struck stack
              total, with the same "Get started" → /start CTA the desktop
              accent-column overhang carries. */}
          <div
            className="relative mt-4 overflow-hidden rounded-2xl p-6 text-white shadow-[0_18px_44px_-18px_rgba(126,166,135,0.75)]"
            style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-hover))" }}
          >
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold tracking-tight" style={{ letterSpacing: "-0.03em" }}>
                ${PLATFORM_BASE_MONTHLY}
              </span>
              <span className="mb-1 text-base font-medium text-white/85">/mo, everything included</span>
            </div>
            <div className="mt-1 text-sm text-white/90">
              About <b>${(STACK_TOTAL - PLATFORM_BASE_MONTHLY).toLocaleString()} a month</b> back in
              your pocket.
            </div>
            <a
              href="#pricing"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-accent shadow-sm transition-transform hover:scale-[1.02]"
            >
              Get started →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---- Integrations marquee (last section — no footer). Right-to-left CSS
 * ticker of REAL brand LOGOS (inline-vendored Simple Icons paths, brand
 * colors on cream) — logos only, no name labels (Shamil's call). Duplicated
 * track for a seamless loop, pause on hover, reduced-motion fallback = a
 * static centered wrap. Only research-confirmed native brands (no TikTok/
 * Yext/Clio); Webhooks uses a neutral generic glyph. ---- */
function IntegrationsMarquee() {
  return (
    <section id="integrations" className="pt-20 pb-10 md:pt-28 md:pb-14">
      <div className="mx-auto max-w-3xl px-6 text-center md:px-8">
        <SectionKicker>Integrations</SectionKicker>
        <h2
          className="mx-auto mt-3 max-w-2xl text-2xl font-bold tracking-tight md:text-4xl"
          style={{ letterSpacing: "-0.02em", lineHeight: 1.15 }}
        >
          Works with the tools you already use — plus 1,500+ more through our
          marketplace and Zapier.
        </h2>
      </div>

      <div
        className="v8mq mt-10 w-full overflow-hidden"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 7%, black 93%, transparent)",
          maskImage:
            "linear-gradient(to right, transparent, black 7%, black 93%, transparent)",
        }}
      >
        <div className="v8mq-track flex w-max items-center">
          {/* 4 copies + a -25% (one-copy) loop so ≥3 copies always cover the
              viewport at any width (13 tiles ≈ 1040px < a wide viewport, so
              a 2-copy / -50% loop showed an empty tail — Shamil's bug). */}
          {[
            ...INTEGRATION_LOGOS,
            ...INTEGRATION_LOGOS,
            ...INTEGRATION_LOGOS,
            ...INTEGRATION_LOGOS,
          ].map((logo, i) => (
            <div
              key={i}
              className="mr-4 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-border bg-surface shadow-sm"
              title={logo.name}
            >
              <svg
                viewBox="0 0 24 24"
                role="img"
                aria-label={logo.name}
                className="h-8 w-8"
                fill={logo.color}
              >
                <title>{logo.name}</title>
                <path d={logo.path} />
              </svg>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        /* 4 copies in the track; translate exactly one copy (-25%) so the
           reset is seamless and ≥3 copies always cover the viewport. */
        .v8mq-track { animation: v8mq-scroll 48s linear infinite; will-change: transform; }
        .v8mq:hover .v8mq-track { animation-play-state: paused; }
        @keyframes v8mq-scroll { from { transform: translateX(0); } to { transform: translateX(-25%); } }
        @media (prefers-reduced-motion: reduce) {
          .v8mq { overflow: visible; -webkit-mask-image: none; mask-image: none; }
          .v8mq-track { animation: none; width: 100%; flex-wrap: wrap; justify-content: center; gap: 0.75rem; }
        }
      `}</style>
    </section>
  );
}

export default function HomeV8Client() {
  // Erkenbot/Celly + particle stage removed 2026-08-16 — plain page now,
  // GHL bubble is the chat launcher. The only remaining dynamic bit is the
  // mobile/viewport flag below, which drives Section's media stacking.
  const [isMobile, setIsMobile] = useState(false);
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

  return (
    <>
    {/* Sticky header — z-50. Lives OUTSIDE <main> so it sticks to the
        viewport top across the whole document. */}
    <DraftHeader />
    {/* Erkenbot/Celly + particle stage removed 2026-08-16 — plain page now,
        GHL bubble is the chat launcher. */}
    <main>
      {/* 1. HERO — the LIVE hero Section (kept), with its real founder
          intro video (Scene1IntroVideo). home-draft addition layered in
          via the Section component: the price tease line (on SECTIONS[0]).
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

      {/* 2. Product sections — "What you get" block (website → receptionist
          → reviews → campaigns) — src/components/ProductSections.tsx;
          Shamil 2026-08-13: Stone Systems' alternating text/media rhythm,
          our honest copy. Media side = uniform video slots since
          2026-08-16 (founder videos come later). */}
      <ProductSections theme="light" />

      {/* 3. Why us — right after the product block (Shamil 2026-08-13:
          "fair questions" follows "keep them coming back"). */}
      <WhyUs theme="light" />

      {/* 4. Pricing — moved right after Why us (Shamil 2026-08-13). Owner-
          approved 3-card restructure (2026-08-12): three Platform
          billing-period cards (Monthly / 6 months / Yearly), all in one
          grid. */}
      <PricingSection />

      {/* 4b. Process — "What working with us looks like" 3-step timeline
              (Shamil 2026-08-16, modeled on Stone Systems' process
              section, our voice). */}
      <Process theme="light" />

      {/* 5. Industries — right after pricing (Shamil 2026-08-13, second
          move same day: was between pipeline and AI). */}
      <IndustriesSection />

      {/* 6. Pipeline — HubSpot-style sticky-column section: pinned left
          story + right-side always-expanded phase panels (Capture/Nurture/
          Close/fans/win-back). Replaces the four full-screen step scenes
          (Scene2/3/4 + MacbookFrame3D). */}
      <PipelineSection />

      {/* 7. AI section (ROUND 3) — "Built-in AI that works for you 24/7". */}
      <AISection />

      {/* 8. Stack-comparison table (ROUND 3) — replace-your-stack. */}
      <StackComparisonSection />

      {/* 9. FAQ (Shamil 2026-08-16) — Stone Systems' five-question FAQ,
             rewritten in our honest voice (src/components/Faq.tsx). */}
      <Faq theme="light" />

      {/* 10. Integrations marquee (ROUND 3) — LAST section (no footer). */}
      <IntegrationsMarquee />

      {/* Get-leads / "you want customers" section REMOVED from the homepage
          (rev-3 addendum: it was a coming-soon dead end here; the real
          inactive card still lives on /start). */}

      {/* No footer (Shamil's call, home-draft v5). */}

      {/* Trailing space so scroll has room to finish its tween. Halved
          (rev-3 addendum: the gap under the integrations marquee read too
          big). */}
      <div className="h-[10vh]" />
    </main>

    <ErkenChatWidget />
    </>
  );
}
