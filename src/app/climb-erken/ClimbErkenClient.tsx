"use client";

/**
 * ClimbErkenClient — a CLONE of the owner-approved /sky-erken pilot (itself
 * a clone of the live homepage's SphereScrollStage/Celly mechanics), with
 * every section's content repurposed for Erken Climbing Co., a fictional
 * Phoenix, AZ climbing gym and guide service (REPLICATION, 2026-08-03).
 *
 * Inherited verbatim from the pilot so every live effect survives:
 *   - SphereScrollStage (Three.js cell-dragon canvas + dust)
 *   - The roaming Celly overlay: findEmptySpot auto-positioner, scroll-driven
 *     dragon-draw, on-stop fly-to-empty-spot, click-to-chat menu, chat-dock
 *     pin, the gooey cloud speech bubble.
 *   - Section / header / carousel / pricing-card / comparison-table patterns.
 *
 * What changed (mirroring sky-erken's section-by-section mapping):
 *   1. Hero: "Talk to us now" (voice / text chat chooser); hero
 *      visual = the existing repo climbing photo.
 *   2. Industries carousel → PROGRAMS carousel (6 gym services, content
 *      pulled from the existing src/app/demo/configs/climbing.ts registry).
 *   3. "How it runs" → THE MEMBER JOURNEY (intro class → belay cert →
 *      membership → renewal billing → digital waiver before arrival), same
 *      sticky-column + phase-panel mechanic. This section carries the real
 *      differentiator research found for climbing gyms: the intro-to-
 *      membership funnel, renewal billing, and digital waivers before
 *      arrival (see vault Notes/problem-solution.md — revenue flat since
 *      2023 while costs rise across the industry).
 *   4. "Your AI team" carousel → THE WALL & GEAR carousel.
 *   5. Pricing cards → membership tiers; "Book now" scrolls to the embedded
 *      GHL booking calendar.
 *   6. Stack-comparison table → "One gym, everything included" fused with
 *      the Thomas Road advantage strip.
 *   7. "Still have questions?" contact section with the same contact
 *      chooser.
 *   8. Erken bot comes along: text chat = the same GHL widget; VOICE calls
 *      go through DemoVoiceWidget so Retell receives the Erken Climbing Co.
 *      dynamic variables and answers as the gym's front desk 24/7.
 *
 * DEMO DISCLAIMER: the gym is fictional; all prices/stats are invented.
 */

import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check, Phone, X } from "lucide-react";
import { Carousel, Card, CardModalContext } from "@/components/ui/apple-cards-carousel";
import { IconArrowNarrowLeft, IconArrowNarrowRight } from "@tabler/icons-react";
import { SphereScrollStage, type CellPositionInfo } from "@/components/SphereScrollStage";
import { CellDragonSprite } from "@/components/CellDragonSprite";
import ErkenChatWidget, {
  openErkenChat,
  useErkenChatOpen,
} from "@/components/ErkenChatWidget";
import DemoVoiceWidget from "@/app/demo/components/DemoVoiceWidget";
import { getDemoConfig } from "@/app/demo/config";
import Link from "next/link";

const ease = [0.16, 1, 0.3, 1] as const;

// The climbing demo registry entry — source of truth for the business
// facts + the Retell dynamic variables (demo_business / demo_industry /
// demo_context) the voice agent needs to answer in character.
const CLIMB = getDemoConfig("climbing")!;
const PHONE_TEL = "+18887996065";
const PHONE_DISPLAY = CLIMB.business.phoneDisplay;
// NOTE (flag for Shamil's review): climbing.ts reuses the SAME shared demo
// GHL calendar as skydiving/flight-schools (SS2V1nuWEIbOlNrzyxpt) — there is
// no dedicated Erken Climbing Co. calendar yet. Fine for a click-through
// replication, flagged for a real/distinct calendar later.
const BOOKING_CALENDAR_ID = CLIMB.booking.calendarId!;

declare global {
  interface Window {
    __startDemoVoiceCall?: () => void;
  }
}

/* ================================================================== */
/* Contact chooser — the "Talk to us now" choice UI (voice / text).    */
/* Opened from the header, the hero, service cards, and the            */
/* Still-have-questions section via a window event so any child can    */
/* trigger the single instance living in ClimbErkenClient.               */
/* ================================================================== */

const CONTACT_EVENT = "climb-erken:contact";

export function openClimbContact(anchorEl?: HTMLElement | null) {
  if (typeof window === "undefined") return;
  let x = window.innerWidth / 2;
  let y = window.innerHeight * 0.4;
  if (anchorEl) {
    const r = anchorEl.getBoundingClientRect();
    const half = 150;
    x = Math.max(half, Math.min(window.innerWidth - half, r.left + r.width / 2));
    y = r.bottom;
  }
  window.dispatchEvent(new CustomEvent(CONTACT_EVENT, { detail: { x, y, anchored: Boolean(anchorEl) } }));
}

function scrollToBooking() {
  document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
}

/* ================================================================== */
/* Hero visual — a single existing repo photo. A quiet Ken-Burns       */
/* scale-in gives it some life without looping motion (design-system   */
/* rule: no infinite breathing/looping decoration).                     */
/* ================================================================== */
const HERO_IMAGE = "/industries/card-climbing-photo.jpg";

function ClimbHeroImage() {
  return (
    <div className="relative w-full max-w-[40rem] overflow-hidden rounded-2xl bg-black shadow-2xl aspect-video">
      <motion.img
        src={HERO_IMAGE}
        alt="Climber working a bouldering problem at Erken Climbing Co."
        initial={{ opacity: 0, scale: 1.06 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease }}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}

/* ================================================================== */
/* Hero section — same L/R Section pattern as the homepage hero.       */
/* ================================================================== */

const HERO = {
  side: "left" as const,
  kicker: "Erken Climbing Co.",
  headline: "Climb your first wall today, no experience needed.",
  body: "Bouldering and top-rope walls, intro classes, and guided outdoor trips into the Superstitions, out of Phoenix, AZ. A digital waiver before you arrive and a front desk that answers 24/7 turn a first-timer into a member fast.",
  priceTease: "Intro classes $35. Most first-timers book inside a day.",
};

function HeroSection({ isMobile }: { isMobile: boolean }) {
  return (
    <section className="relative overflow-hidden px-6 py-10 md:min-h-screen md:flex md:items-center md:px-12 md:py-0">
      <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden />
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div data-celly-avoid className="relative z-30 w-full max-w-xl md:mr-auto md:w-[44%]">
        <div className="mono-label">{HERO.kicker}</div>
        <h1
          className="mt-3 text-3xl font-bold tracking-tight md:text-4xl xl:text-5xl"
          style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
        >
          {HERO.headline}
        </h1>
        <p className="mt-5 text-base leading-relaxed text-text-muted xl:text-lg">{HERO.body}</p>
        <p className="mt-3 font-mono text-sm text-accent">{HERO.priceTease}</p>
        <div className="mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={(e) => openClimbContact(e.currentTarget)}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-medium text-bg transition-all hover:bg-accent-hover"
          >
            Talk to us now →
          </button>
          <a
            href="#services"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-medium text-text transition-all hover:border-border-strong hover:bg-surface"
          >
            Our programs
          </a>
        </div>
      </div>
      {/* Media — same right-anchored wrapper the homepage hero uses. */}
      {isMobile ? (
        <div data-celly-avoid className="mt-10 w-full">
          <ClimbHeroImage />
        </div>
      ) : (
        <div
          data-celly-avoid
          className="absolute inset-y-[8vh] right-[4vw] left-[48vw] 2xl:left-auto 2xl:w-[50%] hidden md:flex items-center justify-center pointer-events-auto"
        >
          <ClimbHeroImage />
        </div>
      )}
    </section>
  );
}

/* ================================================================== */
/* Celly bubble copy — gym front-desk voice.                           */
/* ================================================================== */
type BubbleVariant = {
  text: string;
  widthRem: number;
  paddingVw: number;
  paddingVh: number;
};
const CELLY_VARIANTS: BubbleVariant[] = [
  {
    text:
      "Hi, I'm Erken. This whole site is a live demo built by Erken Systems — in it I play Erken Climbing Co.'s front desk so you can test me. Want to know more about this demo, the automations, or the voice agent? Ask away.",
    widthRem: 22,
    paddingVw: 9,
    paddingVh: 11,
  },
  {
    text:
      "Hi, I'm Erken — this site is a live demo. Ask me anything about the demo, the automations, or the voice agent behind it.",
    widthRem: 17,
    paddingVw: 7,
    paddingVh: 7,
  },
  {
    text: "Curious how this demo works? Ask me.",
    widthRem: 12,
    paddingVw: 5,
    paddingVh: 4,
  },
];
const CELLY_INTRO = CELLY_VARIANTS[0].text;

const SCROLL_STOP_DELAY_MS = 700;

/* ================================================================== */
/* findEmptySpot — copied verbatim from HomeV8Client (the auto-        */
/* positioner that parks Celly + her bubble in empty viewport zones).  */
/* ================================================================== */
type AvoidRect = { left: number; right: number; top: number; bottom: number };

function findEmptySpot(opts: {
  preferredXVw: number;
  preferredYVh: number;
  paddingVw: number;
  paddingVh: number;
  extraAvoidRects?: AvoidRect[];
  avoidBuffer?: number;
  maxDistFromAnchor?: number;
  distancePenaltyWeight?: number;
}): { xVw: number; yVh: number; minDist: number } {
  if (typeof window === "undefined") {
    return { xVw: opts.preferredXVw, yVh: opts.preferredYVh, minDist: 0 };
  }
  const vw = window.innerWidth / 100;
  const vh = window.innerHeight / 100;
  const avoidEls = document.querySelectorAll<HTMLElement>("[data-celly-avoid]");
  const avoidRects: AvoidRect[] = [];
  avoidEls.forEach((el) => {
    const r = el.getBoundingClientRect();
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
  const buffer = opts.avoidBuffer ?? 2;
  const penalty = opts.distancePenaltyWeight ?? 0.3;
  const GX = 24;
  const GY = 16;
  let bestStrict = { xVw: 0, yVh: 0, score: -Infinity, minDist: 0 };
  let bestSoft = { xVw: opts.preferredXVw, yVh: opts.preferredYVh, score: -Infinity, minDist: 0 };
  for (let gx = 0; gx <= GX; gx++) {
    for (let gy = 0; gy <= GY; gy++) {
      const cxVw = (gx / GX) * 100;
      const cyVh = (gy / GY) * 100;
      if (cxVw - opts.paddingVw < 2 || cxVw + opts.paddingVw > 98) continue;
      if (cyVh - opts.paddingVh < 2 || cyVh + opts.paddingVh > 98) continue;
      const dxPref = cxVw - opts.preferredXVw;
      const dyPref = cyVh - opts.preferredYVh;
      const distToPref = Math.sqrt(dxPref * dxPref + dyPref * dyPref);
      if (opts.maxDistFromAnchor !== undefined && distToPref > opts.maxDistFromAnchor) continue;
      let minDist = 100;
      let maxPenetration = 0;
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
        const score = minDist - distToPref * penalty;
        if (score > bestStrict.score) {
          bestStrict = { xVw: cxVw, yVh: cyVh, score, minDist };
        }
      } else {
        const score = -maxPenetration - distToPref * penalty - 1000;
        if (score > bestSoft.score) {
          bestSoft = { xVw: cxVw, yVh: cyVh, score, minDist: 0 };
        }
      }
    }
  }
  const best = bestStrict.score > -Infinity ? bestStrict : bestSoft;
  return { xVw: best.xVw, yVh: best.yVh, minDist: best.minDist };
}

function SectionKicker({ children }: { children: React.ReactNode }) {
  return <div className="mono-label">{children}</div>;
}

/* ---- Sticky header — same pattern as the homepage DraftHeader. ---- */
function ClimbHeader() {
  return (
    <header
      data-celly-avoid
      className="sticky top-0 z-50 w-full border-b border-border/60 bg-bg/85 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-8">
        <Link href="/" className="font-mono text-sm font-medium uppercase tracking-tight text-text">
          climb<span className="text-accent"> </span>erken
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#services" className="text-sm text-text-muted transition-colors hover:text-text">
            Our programs
          </a>
          <a href="#journey" className="text-sm text-text-muted transition-colors hover:text-text">
            The member journey
          </a>
          <a href="#gear" className="text-sm text-text-muted transition-colors hover:text-text">
            Wall & gear
          </a>
          <a href="#pricing" className="text-sm text-text-muted transition-colors hover:text-text">
            Pricing
          </a>
          {/* Desktop: the number starts the in-browser voice call with the
              AI front desk (same pattern as the homepage header phone). */}
          <button
            type="button"
            onClick={() => window.__startDemoVoiceCall?.()}
            className="flex items-center gap-1.5 font-mono text-sm text-text-muted transition-colors hover:text-text"
          >
            <Phone className="h-3.5 w-3.5" />
            {PHONE_DISPLAY}
          </button>
        </nav>
        <div className="flex items-center gap-3">
          <a
            href={`tel:${PHONE_TEL}`}
            aria-label={`Call ${PHONE_DISPLAY}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-muted transition-colors hover:border-border-strong hover:text-text md:hidden"
          >
            <Phone className="h-4 w-4" />
          </a>
          <button
            type="button"
            onClick={(e) => openClimbContact(e.currentTarget)}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg transition-all hover:bg-accent-hover"
          >
            Talk to us now
          </button>
        </div>
      </div>
    </header>
  );
}

/* ================================================================== */
/* PROGRAMS — the homepage "Built for your industry" Apple-card        */
/* carousel, cards = the gym's six programs, each with a real stock    */
/* photo matching its subject.                                         */
/* ================================================================== */

function ServicePhoto({ src }: { src: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
  );
}

/** Opened-card body: short story + what's included + booking/contact CTAs. */
function ServiceBody({
  story,
  included,
  note,
}: {
  story: string;
  included: string[];
  note?: string;
}) {
  // Real close handler for the card modal we're rendered inside of (see
  // CardModalContext in apple-cards-carousel.tsx) — replaces a prior
  // synthetic-Escape-keydown approach that didn't actually close the card.
  const { close } = useContext(CardModalContext);
  const bookNow = () => {
    close();
    // Let the close animation finish and the page scroll lock (body
    // overflow) release before scrolling to the booking section.
    setTimeout(scrollToBooking, 80);
  };
  return (
    <div className="space-y-7 text-base leading-relaxed text-text-muted">
      <p className="text-[15px] md:text-base">{story}</p>
      <div>
        <div className="mono-label mb-3 text-xs text-text-dim">What&apos;s included</div>
        <ul className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
          {included.map((it) => (
            <li key={it} className="flex items-start gap-2 text-[15px] leading-snug">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={2.5} />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      </div>
      {note && (
        <div className="border-t border-text-muted/15 pt-5">
          <div className="mono-label mb-1 text-xs text-text-dim">Good to know</div>
          <p className="text-[15px] md:text-base">{note}</p>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3 border-t border-text-muted/15 pt-6">
        <button
          type="button"
          onClick={bookNow}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-medium text-white transition-transform duration-200 hover:scale-[1.02]"
        >
          Book now <span aria-hidden>→</span>
        </button>
        <button
          type="button"
          onClick={() => openClimbContact()}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 font-medium text-text transition-colors hover:border-border-strong hover:bg-surface"
        >
          Talk to us now
        </button>
      </div>
    </div>
  );
}

const SERVICES = [
  {
    category: "Start here · $35",
    title: "Intro to Climbing Class",
    photo: "/climb-erken/intro-class-indoor.jpg",
    story:
      "A 90-minute class covering basic movement, gym etiquette, and safety, with gear included. No experience or partner required — a digital waiver signed before you arrive means no paperwork line at check-in.",
    included: [
      "90-minute class, gear included",
      "Digital waiver signed before arrival",
      "No experience or partner required",
      "Staff member on hand the entire class",
      "Bouldering unlocked right after",
      "Confirmed instantly online",
    ],
    note: "Most first-timers become members the same week — the front desk answers 24/7 to keep the funnel moving.",
  },
  {
    category: "Required for top-rope",
    title: "Belay Certification",
    photo: "/climb-erken/belay-certification.jpg",
    story:
      "A required course for members who want to top-rope climb with a partner. Pass the belay test and you're certified for life at our gym.",
    included: [
      "One-time course and test",
      "Certified for life at our gym",
      "Tying in, belaying, and communication commands",
      "Booked online, confirmed instantly",
    ],
  },
  {
    category: "Half-day and full-day",
    title: "Guided Outdoor Trips",
    photo: "/climb-erken/guided-outdoor-trip.jpg",
    story:
      "Half-day and full-day guided climbs in the Superstition Mountains for members ready to move outdoors, led by AMGA-certified guides.",
    included: [
      "AMGA-certified guides",
      "Half-day and full-day options",
      "Graded by difficulty",
      "Gear provided for the trip",
    ],
  },
  {
    category: "Ages 8–18",
    title: "Youth Climbing Team",
    photo: "/climb-erken/youth-climbing-team.jpg",
    story:
      "A competitive team program for climbers ages 8–18, training three days a week toward regional competitions.",
    included: [
      "Three training days a week",
      "Regional competition prep",
      "Digital waivers handled per season",
      "Renewal billing handled automatically",
    ],
  },
  {
    category: "Groups up to 15",
    title: "Birthday Parties & Groups",
    photo: "/climb-erken/birthday-group-party.jpg",
    story:
      "Two-hour private party packages with a dedicated staff belayer and party room, for groups of up to 15.",
    included: [
      "Two-hour private party block",
      "Dedicated staff belayer",
      "Party room included",
      "Booked online, confirmed instantly",
    ],
  },
  {
    category: "Day passes & first-timers",
    title: "Gear Rental",
    photo: "/climb-erken/gear-rental.jpg",
    story:
      "Shoes, harnesses, and chalk bags available for day passes and first-timers, sanitized between every use.",
    included: [
      "Shoes, harness, and chalk bag",
      "Sanitized between every use",
      "Included with every intro class",
      "Available for day passes",
    ],
  },
];

function ClimbServicesCarousel() {
  const items = SERVICES.map((s, i) => (
    <Card
      key={s.title}
      index={i}
      card={{
        src: s.photo,
        title: s.title,
        category: s.category,
        visual: <ServicePhoto src={s.photo} />,
        content: <ServiceBody story={s.story} included={s.included} note={s.note} />,
      }}
    />
  ));
  return (
    <div className="w-full">
      <Carousel
        items={items}
        arrowsPosition="center"
        arrowsTrailing={
          <button
            type="button"
            onClick={(e) => openClimbContact(e.currentTarget)}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-base font-medium text-bg transition-all hover:bg-accent-hover hover:scale-[1.02]"
          >
            Talk to us now →
          </button>
        }
      />
    </div>
  );
}

function ServicesSection() {
  return (
    <section id="services" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <motion.div
          data-celly-avoid
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease }}
          className="max-w-2xl"
        >
          <SectionKicker>Our programs</SectionKicker>
          <h2
            className="mt-3 text-3xl font-bold tracking-tight md:text-5xl"
            style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
          >
            From your first hold to your first real crag.
          </h2>
          <p className="mt-4 text-base text-text-muted md:text-lg">
            Every card is a real program at the gym — open one to see what&apos;s
            inside, what it costs, and how to book it.
          </p>
        </motion.div>
      </div>
      <div data-celly-avoid className="mt-4">
        <ClimbServicesCarousel />
      </div>
    </section>
  );
}

/* ================================================================== */
/* THE MEMBER JOURNEY — the homepage "How it runs" sticky-column        */
/* section, phases = intro class to renewed membership. Same flat-SVG   */
/* icon style, same sage/clay/cream palette as the rest of the          */
/* erken.systems site (the site's OWN accent tokens, not a per-industry */
/* brand color — see globals.css --accent/--clay — matching             */
/* sky-erken's approach). Phases 2 and 4 are deliberate: research       */
/* (vault Notes/problem-solution.md) found digital waivers before       */
/* arrival and renewal billing are the two genuine climbing-gym pain    */
/* points our stack actually solves — revenue has been flat industry-   */
/* wide since 2023 while costs keep rising.                             */
/* ================================================================== */
const ILLO_SAGE = "#7ea687";
const ILLO_CLAY = "#a8503f";
const ILLO_CREAM = "#F5F1E8";
const ILLO_NEUTRAL = "#D4CDB8";

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

/** BOOK — a calendar with a mountain-peak mark. */
function IlloBookIntro() {
  return (
    <IllustrationBackdrop>
      <rect x="26" y="30" width="68" height="58" rx="8" fill="#FFFFFF" stroke={ILLO_NEUTRAL} strokeWidth="2" />
      <rect x="26" y="30" width="68" height="16" rx="8" fill={ILLO_SAGE} />
      <rect x="36" y="24" width="6" height="12" rx="3" fill={ILLO_CLAY} />
      <rect x="78" y="24" width="6" height="12" rx="3" fill={ILLO_CLAY} />
      {/* tiny mountain-peak mark on the grid, standing in for the booked slot */}
      <path d="M40 76 L54 54 L64 66 L74 50 L86 76 Z" fill={ILLO_CLAY} />
    </IllustrationBackdrop>
  );
}

/** DIGITAL WAIVER — a document with a signature checkmark. */
function IlloDigitalWaiver() {
  return (
    <IllustrationBackdrop>
      <rect x="38" y="26" width="44" height="60" rx="5" fill={ILLO_NEUTRAL} />
      <rect x="46" y="38" width="28" height="4" rx="2" fill="#FFFFFF" />
      <rect x="46" y="48" width="28" height="4" rx="2" fill="#FFFFFF" />
      <rect x="46" y="58" width="18" height="4" rx="2" fill="#FFFFFF" />
      <circle cx="72" cy="72" r="14" fill={ILLO_CLAY} />
      <path d="M65 72 L70 78 L80 66" stroke={ILLO_CREAM} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </IllustrationBackdrop>
  );
}

/** INTRO CLASS — a climber on a bouldering wall. */
function IlloClimbClass() {
  return (
    <IllustrationBackdrop>
      <circle cx="60" cy="34" r="9" fill={ILLO_CLAY} />
      <path d="M60 43 L60 70 M60 50 L44 62 M60 55 L78 46 M60 70 L48 92 M60 70 L72 90" stroke={ILLO_CLAY} strokeWidth="4" strokeLinecap="round" fill="none" />
      <circle cx="44" cy="62" r="4" fill={ILLO_SAGE} />
      <circle cx="78" cy="46" r="4" fill={ILLO_SAGE} />
      <circle cx="48" cy="92" r="4" fill={ILLO_SAGE} />
      <circle cx="72" cy="90" r="4" fill={ILLO_SAGE} />
    </IllustrationBackdrop>
  );
}

/** MEMBERSHIP & RENEWAL — a card with a rebilling arrow. */
function IlloMembershipRenewal() {
  return (
    <IllustrationBackdrop>
      <rect x="28" y="42" width="64" height="42" rx="7" fill={ILLO_NEUTRAL} />
      <rect x="28" y="52" width="64" height="8" fill={ILLO_SAGE} />
      <rect x="36" y="68" width="24" height="6" rx="3" fill="#FFFFFF" />
      {/* renewal arrow looping back */}
      <path d="M78 78 A16 16 0 1 0 76 92" stroke={ILLO_CLAY} strokeWidth="2.5" fill="none" strokeDasharray="1 5" strokeLinecap="round" />
      <path d="M70 90 L76 92 L74 86" stroke={ILLO_CLAY} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </IllustrationBackdrop>
  );
}

/** GUIDED TRIP & REVIEW — a mountain range with a 5-star rating above. */
function IlloTripReview() {
  return (
    <IllustrationBackdrop>
      <path d="M28 84 L46 56 L58 70 L74 44 L92 84 Z" fill={ILLO_SAGE} />
      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={i}
          transform={`translate(${34 + i * 13} 24) scale(0.9)`}
          d="M6 0 L7.8 4.2 L12.4 4.4 L8.8 7.4 L10 12 L6 9.4 L2 12 L3.2 7.4 L-0.4 4.4 L4.2 4.2 Z"
          fill={ILLO_CLAY}
        />
      ))}
    </IllustrationBackdrop>
  );
}

const JOURNEY: {
  name: string;
  tagline: string;
  Illustration: () => React.ReactElement;
  items: string[];
}[] = [
  {
    name: "Book an intro class",
    tagline: "Answered 24/7, not just office hours",
    Illustration: IlloBookIntro,
    items: [
      "Book online or call — answered around the clock",
      "Class size and skill level reviewed with you",
      "Text confirmation with what to bring",
      "First-timer questions answered before you arrive",
    ],
  },
  {
    name: "Digital waiver, before you arrive",
    tagline: "No paperwork line at check-in",
    Illustration: IlloDigitalWaiver,
    items: [
      "Waiver link sent the moment you book",
      "Signed digitally, before you walk in",
      "Parent/guardian waivers for youth programs",
      "No clipboard queue at the front desk",
    ],
  },
  {
    name: "The intro class",
    tagline: "Chalk on your hands before it's dry",
    Illustration: IlloClimbClass,
    items: [
      "90-minute class on movement, safety, and etiquette",
      "Staff member on hand the entire time",
      "Bouldering unlocked right after class",
      "Belay certification booked in the same visit",
    ],
  },
  {
    name: "Membership & renewal billing",
    tagline: "The funnel from first-timer to member, automated",
    Illustration: IlloMembershipRenewal,
    items: [
      "Renewal billing handled automatically",
      "Failed-payment follow-up before a membership lapses",
      "Youth team season renewals handled the same way",
      "No manual invoice-chasing",
    ],
  },
  {
    name: "Guided trip and review",
    tagline: "From the gym wall to the Superstitions",
    Illustration: IlloTripReview,
    items: [
      "Repetitive front-desk questions answered 24/7",
      "Guided outdoor trips booked online",
      "A review request goes out the same day, not weeks later",
      "Rebook the next trip or class on the spot",
    ],
  },
];

function JourneyPhases() {
  return (
    <div data-celly-avoid className="flex flex-col gap-4">
      {JOURNEY.map((phase, i) => (
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
              <div className="text-base font-semibold text-text" style={{ letterSpacing: "-0.01em" }}>
                {phase.name}
              </div>
              <div className="mt-0.5 text-xs text-text-muted md:text-sm">{phase.tagline}</div>
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

function JourneySection() {
  return (
    <section id="journey" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div className="grid gap-10 md:grid-cols-2 md:items-start md:gap-12 lg:gap-16">
          <div className="md:sticky md:top-24 md:self-start">
            <motion.div
              data-celly-avoid
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, ease }}
            >
              <SectionKicker>The member journey</SectionKicker>
              <h2
                className="mt-3 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
                style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
              >
                From your first intro class to a real membership.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-text-muted md:text-lg">
                Every member here walks the same five stages — from a booked
                intro class to renewal billing that just works. You always
                know what&apos;s next, and the paperwork is done before you arrive.
              </p>
              <p className="mt-3 text-base leading-relaxed text-text-muted md:text-lg">
                No clipboard queue at check-in, no chasing a lapsed membership.
              </p>
              <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={(e) => openClimbContact(e.currentTarget)}
                  className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-base font-medium text-bg transition-all hover:bg-accent-hover hover:scale-[1.02]"
                >
                  Talk to us now →
                </button>
                <a
                  href="#pricing"
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3.5 text-base font-medium text-text transition-all hover:border-border-strong hover:bg-surface"
                >
                  See pricing
                </a>
              </div>
            </motion.div>
          </div>
          <div className="w-full">
            <JourneyPhases />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* WALL & GEAR — the homepage "Your AI team" carousel mechanic, cards   */
/* = the wall and the gear you'll wear. Same warm wash, portrait        */
/* cards, auto-rotate.                                                  */
/* ================================================================== */

const GEAR: {
  title: string;
  spec: string;
  desc: string;
  photo?: string;
}[] = [
  {
    title: "18,000 sq ft Climbing Surface",
    spec: "Bouldering and top-rope · every skill level",
    desc: "Bouldering and top-rope walls across 18,000 square feet, not a single cramped room — routes reset regularly so regulars always have something new.",
    photo: "/climb-erken/gym-wall-surface.jpg",
  },
  {
    title: "Rental Harness & Shoes",
    spec: "Sanitized between every use · all sizes",
    desc: "The same harness and shoes your first-timers rent, sized and checked before every class — a borrowed harness never means a guessed harness.",
    photo: "/climb-erken/rental-shoes.jpg",
  },
  {
    title: "Belay & Auto-Belay Stations",
    spec: "Auto-belay and top-rope · certified staff on floor",
    desc: "Built for learning, not showing off — auto-belay stations for solo climbers and top-rope stations for certified partners, staff on the floor the whole time.",
    photo: "/climb-erken/belay-stations.jpg",
  },
  {
    title: "Route-Setting Crew",
    spec: "Regular resets · all grades represented",
    desc: "Two ways to keep climbing interesting — regular route resets across all grades, and a setting crew that climbs the routes themselves before they open.",
    photo: "/climb-erken/route-setting-holds.jpg",
  },
];

/** Flat climbing-wall silhouette used when a gear card has no photo. */
function GearGlyph({ variant }: { variant: number }) {
  if (variant === 0) {
    // climbing wall with holds
    return (
      <svg viewBox="0 0 200 120" className="h-24 w-full" aria-hidden>
        <rect x="30" y="16" width="140" height="90" rx="6" fill="none" stroke={ILLO_SAGE} strokeWidth="4" />
        <circle cx="60" cy="40" r="6" fill={ILLO_CLAY} />
        <circle cx="110" cy="30" r="6" fill={ILLO_CLAY} />
        <circle cx="140" cy="55" r="6" fill={ILLO_CLAY} />
        <circle cx="80" cy="70" r="6" fill={ILLO_CLAY} />
        <circle cx="120" cy="90" r="6" fill={ILLO_CLAY} />
      </svg>
    );
  }
  if (variant === 1) {
    // harness
    return (
      <svg viewBox="0 0 200 120" className="h-24 w-full" aria-hidden>
        <rect x="60" y="30" width="80" height="26" rx="13" fill="none" stroke={ILLO_SAGE} strokeWidth="5" />
        <path d="M70 56 L70 90 M130 56 L130 90" stroke={ILLO_SAGE} strokeWidth="5" strokeLinecap="round" />
        <circle cx="100" cy="43" r="6" fill={ILLO_CLAY} />
      </svg>
    );
  }
  if (variant === 2) {
    // auto-belay
    return (
      <svg viewBox="0 0 200 120" className="h-24 w-full" aria-hidden>
        <rect x="90" y="14" width="20" height="20" rx="4" fill={ILLO_SAGE} />
        <path d="M100 34 L100 90" stroke={ILLO_CLAY} strokeWidth="3" strokeDasharray="2 6" />
        <circle cx="100" cy="98" r="8" fill={ILLO_CLAY} />
      </svg>
    );
  }
  // route markers
  return (
    <svg viewBox="0 0 200 120" className="h-24 w-full" aria-hidden>
      <rect x="60" y="20" width="10" height="10" rx="2" fill={ILLO_SAGE} />
      <rect x="100" y="45" width="10" height="10" rx="2" fill={ILLO_CLAY} />
      <rect x="130" y="70" width="10" height="10" rx="2" fill={ILLO_SAGE} />
      <rect x="80" y="90" width="10" height="10" rx="2" fill={ILLO_CLAY} />
      <path d="M65 30 L105 50 L135 75 L85 95" stroke={ILLO_NEUTRAL} strokeWidth="2" fill="none" strokeDasharray="3 4" />
    </svg>
  );
}

function GearCarousel() {
  const n = GEAR.length;
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
      <div className="relative mx-auto flex h-[460px] max-w-4xl items-center justify-center md:h-[480px]">
        {GEAR.map((card, i) => {
          const offset = (((i - active) % n) + n) % n; // 0=center, 1=right, n-1=left, else back
          const slot =
            offset === 0 ? "center" : offset === 1 ? "right" : offset === n - 1 ? "left" : "back";
          const isCenter = slot === "center";
          const transform =
            slot === "center"
              ? "translateX(0) scale(1)"
              : slot === "right"
                ? "translateX(64%) scale(0.82)"
                : slot === "left"
                  ? "translateX(-64%) scale(0.82)"
                  : "translateX(0) scale(0.7)";
          const opacityClass =
            slot === "center"
              ? "opacity-100"
              : slot === "back"
                ? "opacity-0"
                : "opacity-[0.55] max-md:opacity-0";
          return (
            <div
              key={card.title}
              className={`absolute w-[280px] transition-[transform,opacity] duration-500 sm:w-[300px] ${opacityClass}`}
              style={{
                zIndex: isCenter ? 20 : slot === "back" ? 0 : 10,
                transform,
                transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
                pointerEvents: slot === "back" ? "none" : undefined,
              }}
              aria-hidden={!isCenter}
            >
              <div
                className={
                  isCenter
                    ? "flex h-[420px] flex-col rounded-2xl border border-border bg-surface p-5 shadow-[0_26px_70px_-24px_rgba(126,166,135,0.6)]"
                    : "flex h-[420px] flex-col rounded-2xl border border-border bg-surface-2 p-5 shadow-sm"
                }
              >
                <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-surface-2 to-[#f0ece0]">
                  {card.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={card.photo}
                      alt={card.title}
                      className="absolute inset-0 h-full w-full object-cover"
                      draggable={false}
                    />
                  ) : (
                    <GearGlyph variant={i} />
                  )}
                </div>
                <h3 className="mt-4 text-base font-semibold text-text" style={{ letterSpacing: "-0.01em" }}>
                  {card.title}
                </h3>
                <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.05em] text-text-dim">
                  {card.spec}
                </p>
                <p className={`mt-1.5 text-sm leading-relaxed ${isCenter ? "text-text-muted" : "text-text-dim"}`}>
                  {card.desc}
                </p>
              </div>
            </div>
          );
        })}

        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous item"
          className="absolute left-0 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface text-text shadow-md transition-colors hover:border-border-strong hover:bg-surface-2 md:left-2"
        >
          <IconArrowNarrowLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next item"
          className="absolute right-0 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface text-text shadow-md transition-colors hover:border-border-strong hover:bg-surface-2 md:right-2"
        >
          <IconArrowNarrowRight className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {GEAR.map((c, i) => (
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

function GearSection() {
  return (
    <section
      id="gear"
      className="relative overflow-hidden py-20 md:py-28"
      style={{
        background:
          "radial-gradient(58% 80% at 14% 8%, rgba(232,155,122,0.24), transparent 60%)," +
          "radial-gradient(54% 74% at 88% 14%, rgba(126,166,135,0.24), transparent 62%)," +
          "radial-gradient(52% 62% at 62% 96%, rgba(242,201,76,0.14), transparent 62%)," +
          "linear-gradient(180deg, #FBF7EF 0%, var(--bg) 100%)",
      }}
    >
      <div className="relative mx-auto max-w-6xl px-6 md:px-8">
        <div className="grid gap-x-8 gap-y-2 md:grid-cols-2 md:items-end">
          <motion.div
            data-celly-avoid
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease }}
          >
            <SectionKicker>Wall & gear</SectionKicker>
            <h2
              className="mt-2 text-2xl font-bold tracking-tight md:text-3xl"
              style={{ letterSpacing: "-0.02em", lineHeight: 1.15 }}
            >
              18,000 square feet, checked before every class.
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
            Rental gear is sanitized between every use, routes get reset
            regularly, and belay stations are staffed the whole time.
          </motion.p>
        </div>

        <div data-celly-avoid className="mt-8">
          <GearCarousel />
        </div>

        <p data-celly-avoid className="mt-8 text-center text-sm text-text-muted">
          Every first-timer rents the full kit <b className="text-text">shoes, harness, and chalk bag</b> —
          included with your intro class.
        </p>
      </div>
    </section>
  );
}

/* ================================================================== */
/* PRICING — the homepage /start-style plan cards, tiers = the gym's   */
/* programs. "Book now" scrolls to the booking calendar embedded       */
/* right below.                                                        */
/* ================================================================== */

const PRICE_TIERS: {
  label: string;
  price: string;
  note: string;
  badge?: string;
  badgeSolid?: boolean;
  features: string[];
}[] = [
  {
    label: "Intro to Climbing Class",
    price: "$35",
    note: "one time · 90-minute class",
    badge: "Start here",
    badgeSolid: true,
    features: [
      "No experience required",
      "Gear included",
      "Digital waiver signed before arrival",
      "Bouldering unlocked right after",
      "Confirmed instantly online",
    ],
  },
  {
    label: "Guided Outdoor Trips",
    price: "from $175",
    note: "half-day and full-day · AMGA guides",
    features: [
      "AMGA-certified guides",
      "Graded by difficulty",
      "Gear provided for the trip",
      "Booked around your schedule",
      "Recommended after belay certification",
    ],
  },
  {
    label: "Youth Climbing Team",
    price: "$189/mo",
    note: "ages 8–18 · regional competitions",
    badge: "Ongoing membership",
    features: [
      "Three training days a week",
      "Regional competition prep",
      "Renewal billing handled automatically",
      "Season waivers handled digitally",
      "No manual invoice-chasing",
    ],
  },
];

function PlanCard({ tier }: { tier: (typeof PRICE_TIERS)[number] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease }}
      whileHover={{ y: -2 }}
      className={`relative flex flex-col rounded-2xl border bg-surface p-8 transition-colors duration-200 ${
        tier.badgeSolid
          ? "border-2 border-accent hover:border-accent-hover"
          : "border-border hover:border-border-strong"
      }`}
    >
      {tier.badge && !tier.badgeSolid && (
        <span className="absolute right-6 top-6 rounded-full border border-accent px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.05em] text-accent">
          {tier.badge}
        </span>
      )}
      {tier.badge && tier.badgeSolid && (
        <span className="absolute right-6 top-6 rounded-full bg-accent px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.05em] text-bg">
          {tier.badge}
        </span>
      )}
      <h3 className={`text-lg font-semibold text-text ${tier.badge ? "pr-36" : ""}`}>{tier.label}</h3>
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
        {tier.features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={2.5} />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={scrollToBooking}
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-bg transition-all hover:bg-accent-hover hover:scale-[1.02]"
      >
        Book now →
      </button>
    </motion.div>
  );
}

function PricingSection() {
  return (
    <section id="pricing" className="pt-20 md:pt-28">
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
            Start at $35. Know every cost before you sign up.
          </h2>
          <p className="mt-4 text-base text-text-muted md:text-lg">
            Fixed class pricing, no surprise add-ons at check-in — and
            renewal billing never catches you off guard.
          </p>
        </motion.div>

        <div data-celly-avoid className="mt-10 grid gap-6 md:grid-cols-3">
          {PRICE_TIERS.map((t) => (
            <PlanCard key={t.label} tier={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- Booking — the real GHL calendar, embedded (same calendar the
 * voice agent books into). "Book now" buttons scroll here. ---- */
const EMBED_SCRIPT_SRC = "https://link.msgsndr.com/js/form_embed.js";

function BookingSection() {
  const [calendarLoaded, setCalendarLoaded] = useState(false);
  const [calendarFailed, setCalendarFailed] = useState(false);
  // Live content height of the GHL widget, reported by the widget itself
  // (see the message listener below). Null until the first report arrives.
  const [frameHeight, setFrameHeight] = useState<number | null>(null);

  useEffect(() => {
    if (document.querySelector(`script[src="${EMBED_SCRIPT_SRC}"]`)) return;
    const s = document.createElement("script");
    s.src = EMBED_SCRIPT_SRC;
    s.async = true;
    document.body.appendChild(s);
  }, []);

  // If the GHL iframe never fires `load` (ad blockers commonly kill
  // leadconnectorhq/msgsndr requests outright, and the GHL API itself can
  // be slow/down), fall back to a plain contact CTA instead of leaving the
  // fixed-size wrapper below rendered as a blank void the same color as
  // the page background — a failed iframe doesn't shrink its container,
  // so that void was both the "missing calendar" and the "huge empty gap"
  // bug in one: a live-size box with nothing visibly in it.
  useEffect(() => {
    if (calendarLoaded) return;
    const t = setTimeout(() => setCalendarFailed(true), 15000);
    return () => clearTimeout(t);
  }, [calendarLoaded]);

  // The widget posts its real content height via the iframe-resizer
  // protocol: "[iFrameSizer]<iframeId>:<height>:<width>:<trigger>"
  // (e.g. 607px for the bare month grid, ~681px once a date's time slots
  // expand, ~950px for the name/email/phone details form — measured live
  // 2026-08-04). We track it and size the iframe + wrapper to match, so
  // the section never shows dead canvas below the widget (the "huge gap"
  // bug: a fixed 900px pin × 1.4 scale left ~400px of empty space under
  // the 607px month view) and never clips the taller details form.
  // Reports under 400px are transient init states and get ignored.
  useEffect(() => {
    const prefix = `[iFrameSizer]booking-${BOOKING_CALENDAR_ID}:`;
    const onMsg = (e: MessageEvent) => {
      if (typeof e.data !== "string" || !e.data.startsWith(prefix)) return;
      const h = parseFloat(e.data.split(":")[1]);
      if (Number.isFinite(h) && h >= 400 && h < 4000) setFrameHeight(h);
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  return (
    <section id="booking" className="scroll-mt-20 pb-10 pt-16 md:pb-14 md:pt-20">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <motion.div
          data-celly-avoid
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease }}
          className="mx-auto max-w-2xl text-center"
        >
          <SectionKicker>Book a class</SectionKicker>
          <h2
            className="mt-3 text-2xl font-bold tracking-tight md:text-4xl"
            style={{ letterSpacing: "-0.02em", lineHeight: 1.15 }}
          >
            Pick a real class time, waiver included.
          </h2>
          <p className="mt-3 text-base text-text-muted">
            Grab an open slot and you&apos;re confirmed instantly — you&apos;ll get
            a text and email with the waiver link and what to bring. Prefer
            to talk first? The voice assistant books the same calendar.
          </p>
        </motion.div>
        {calendarFailed ? (
          <div
            data-celly-avoid
            className="mx-auto mt-10 max-w-md rounded-2xl border border-border bg-surface p-8 text-center"
          >
            <p className="text-base text-text-muted">
              The live calendar didn&apos;t load. Call, text, or talk to our AI
              front desk instead — same calendar either way.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <a
                href={`tel:${PHONE_TEL}`}
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-medium text-bg transition-all hover:bg-accent-hover"
              >
                <Phone className="h-4 w-4" /> {PHONE_DISPLAY}
              </a>
              <button
                type="button"
                onClick={() => openClimbContact()}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 font-medium text-text transition-colors hover:border-border-strong hover:bg-surface"
              >
                Talk to us now
              </button>
            </div>
          </div>
        ) : (
          /* GHL always paints its classic calendar widget small on its own
             white canvas at any iframe size (confirmed: GET /calendars/{id}
             exposes no appearance/backgroundColor field to recolor it — no
             widget-embed query param for it either). So instead of sizing
             the iframe up (which just adds white space), we render it at
             its natural width and scale the whole thing up with CSS so the
             calendar grid itself dominates the section. No card/border/
             shadow around it — the widget's own chrome is the only chrome. */
          <div data-celly-avoid className="mt-10">
            {/* form_embed.js (loaded above) is an iframe-resizer: it
                rewrites this iframe's INLINE
                height on a 32ms interval / on any DOM mutation inside the
                widget (hovering a time slot counts). Inline style beats the
                Tailwind h-[...] classes, so picking a date + moving the mouse
                made the calendar shrink-loop and collapse. An !important rule
                outranks inline styles — but a FIXED pin left dead canvas
                under the short month view and clipped the tall details
                form. So the pin is now dynamic: the message listener above
                tracks the widget's own reported content height and we pin
                to exactly that. The wrapper reserves height × the CSS scale
                (transform doesn't affect layout), with a small buffer. */}
            {(() => {
              const h = Math.round(frameHeight ?? 880);
              return (
                <style>{`
                  #booking-${BOOKING_CALENDAR_ID} { height: ${h}px !important; }
                  #booking-frame-wrap {
                    height: ${Math.round(h * 1.05) + 8}px;
                    transition: height 0.25s ease;
                  }
                  @media (min-width: 768px) {
                    #booking-frame-wrap { height: ${Math.round(h * 1.4) + 8}px; }
                  }
                `}</style>
              );
            })()}
            <div
              id="booking-frame-wrap"
              className="relative mx-auto w-[315px] md:w-[645px]"
            >
              <iframe
                src={`https://api.leadconnectorhq.com/widget/booking/${BOOKING_CALENDAR_ID}`}
                className="absolute inset-x-0 top-0 mx-auto h-[880px] w-[300px] origin-top scale-[1.05] rounded-2xl border-0 md:h-[900px] md:w-[460px] md:scale-[1.4]"
                style={{ background: "#F5F1E8" }}
                id={`booking-${BOOKING_CALENDAR_ID}`}
                scrolling="no"
                title="Book an intro class"
                onLoad={() => setCalendarLoaded(true)}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ================================================================== */
/* ONE GYM — the homepage "replace your whole stack" table mechanic,    */
/* repurposed: everything a member usually juggles across providers     */
/* lives under one roof on Thomas Road, fused with the gym's advantage  */
/* strip.                                                               */
/* ================================================================== */

const ROOF_ROWS: { cat: string; elsewhere: string }[] = [
  { cat: "Intro classes & belay certification", elsewhere: "A gym with rotating instructors" },
  { cat: "Digital waivers, before arrival", elsewhere: "A clipboard queue at check-in" },
  { cat: "A heads-up before your membership lapses", elsewhere: "A membership that lapses without a word" },
  { cat: "Reviews & trip photos", elsewhere: "An email that never gets sent" },
  { cat: "Youth team & group scheduling", elsewhere: "Phone tag with six different people" },
  { cat: "Front desk, 24/7", elsewhere: "Voicemail and phone tag" },
];

const ELOY_POINTS = [
  "18,000 sq ft of climbing surface",
  "AMGA-certified guides on staff",
  "Your front desk answers 24/7",
];

function CragSection() {
  return (
    <section id="one-roof" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <motion.div
          data-celly-avoid
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease }}
          className="max-w-2xl"
        >
          <SectionKicker>One gym</SectionKicker>
          <h2
            className="mt-3 text-3xl font-bold tracking-tight md:text-5xl"
            style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
          >
            Everything under one roof.
          </h2>
          <p className="mt-4 text-base text-text-muted md:text-lg">
            Classes, waivers, renewal billing, and reviews — one gym on
            Thomas Road, one schedule, one team that knows your name.
          </p>
        </motion.div>

        {/* Gym advantage strip */}
        <div data-celly-avoid className="mt-8 flex flex-wrap gap-3">
          {ELOY_POINTS.map((p) => (
            <span
              key={p}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 font-mono text-xs uppercase tracking-[0.05em] text-text-muted"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
              {p}
            </span>
          ))}
        </div>

        {/* DESKTOP — highlighted-column table (same mechanic as the
            homepage stack table: accent Included column + overhang CTA). */}
        <div data-celly-avoid className="relative mb-24 mt-10 hidden md:block">
          <div className="grid grid-cols-[1.2fr_2fr_170px] overflow-hidden rounded-t-2xl rounded-bl-2xl shadow-[0_18px_50px_-24px_rgba(42,38,32,0.35)]">
            <div className="bg-[var(--accent-soft)] px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.08em] text-text">
              What you need
            </div>
            <div className="bg-[var(--accent-soft)] px-3 py-3.5 font-mono text-[11px] uppercase tracking-[0.08em] text-text">
              How it usually goes
            </div>
            <div className="flex items-center justify-center bg-accent px-3 py-3.5 font-mono text-[11px] uppercase tracking-[0.08em] text-white">
              At Erken Climbing
            </div>

            {ROOF_ROWS.map((row, i) => {
              const zebra = i % 2 === 1 ? "bg-surface-2/60" : "bg-surface";
              const bt = i > 0 ? "border-t border-border/50" : "";
              return (
                <div key={row.cat} className="contents">
                  <div className={`flex items-center px-6 py-3.5 font-semibold text-text ${zebra} ${bt}`}>
                    {row.cat}
                  </div>
                  <div className={`flex items-center px-3 py-3.5 text-sm text-text-muted ${zebra} ${bt}`}>
                    {row.elsewhere}
                  </div>
                  <div className={`flex items-center justify-center bg-accent ${i > 0 ? "border-t border-white/15" : ""}`}>
                    <Check className="h-5 w-5 text-white" strokeWidth={3} />
                  </div>
                </div>
              );
            })}

            {/* Totals row */}
            <div className="flex items-center border-t-2 border-border bg-[var(--accent-soft)] px-6 py-5 text-sm font-semibold text-text">
              The usual way
            </div>
            <div className="flex flex-col justify-center border-t-2 border-border bg-[var(--accent-soft)] px-3 py-5">
              <div className="text-lg font-bold tracking-tight text-[var(--clay)]">
                Five providers, five schedules
              </div>
              <div className="text-[11px] text-text-dim">and nobody tracking the whole picture</div>
            </div>
            <div className="flex flex-col items-center justify-center border-t-2 border-white/25 bg-accent py-5 text-white">
              <div className="text-2xl font-bold tracking-tight" style={{ letterSpacing: "-0.02em" }}>
                One roof
              </div>
              <div className="text-[11px] font-medium text-white/85">on Thomas Road</div>
            </div>
          </div>
          {/* Overhang — accent column extends past the table, CTA inside. */}
          <div className="absolute right-0 top-full w-[170px] rounded-b-2xl bg-accent px-3 pb-4 pt-3 text-center shadow-[0_18px_40px_-16px_rgba(126,166,135,0.85)]">
            <button
              type="button"
              onClick={scrollToBooking}
              className="inline-flex w-full items-center justify-center gap-1 rounded-lg bg-white px-3 py-2.5 text-xs font-semibold text-accent shadow-sm transition-transform hover:scale-[1.02]"
            >
              Book a class →
            </button>
            <div className="mt-1.5 text-[11px] text-white/90">$35 · intro class</div>
          </div>
        </div>

        {/* MOBILE — stacked rows + accent footer card. */}
        <div data-celly-avoid className="mt-10 md:hidden">
          <div className="overflow-hidden rounded-2xl border border-border">
            {ROOF_ROWS.map((row, i) => (
              <div key={row.cat} className={`px-5 py-4 ${i > 0 ? "border-t border-border/50" : ""}`}>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-text">{row.cat}</span>
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent">
                    <Check className="h-3 w-3 text-white" strokeWidth={3} />
                  </span>
                </div>
                <div className="mt-1 text-sm text-text-muted">Usually: {row.elsewhere.toLowerCase()}</div>
              </div>
            ))}
          </div>
          <div
            className="relative mt-4 overflow-hidden rounded-2xl p-6 text-white shadow-[0_18px_44px_-18px_rgba(126,166,135,0.75)]"
            style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-hover))" }}
          >
            <div className="text-3xl font-bold tracking-tight" style={{ letterSpacing: "-0.03em" }}>
              One roof.
            </div>
            <div className="mt-1 text-sm text-white/90">
              Classes, waivers, renewal billing, and reviews — all on
              Thomas Road.
            </div>
            <button
              type="button"
              onClick={scrollToBooking}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-accent shadow-sm transition-transform hover:scale-[1.02]"
            >
              Book your intro class →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---- Still have questions? — the homepage Custom-solutions slot,
 * with the same contact-choice UI as the hero. ---- */
function QuestionsSection() {
  return (
    <section id="questions" className="py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-6 text-center md:px-8">
        <motion.div
          data-celly-avoid
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease }}
        >
          <SectionKicker>Still have questions?</SectionKicker>
          <h2
            className="mt-3 text-3xl font-bold tracking-tight md:text-5xl"
            style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
          >
            Talk to us — any hour, any way.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-text-muted md:text-lg">
            Belay certification, membership pricing, what to bring — ask
            anything. The front desk answers around the clock, even when
            every route setter is up on the wall.
          </p>
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={(e) => openClimbContact(e.currentTarget)}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-base font-medium text-bg transition-all hover:bg-accent-hover hover:scale-[1.02]"
            >
              Talk to us now →
            </button>
          </div>
          <p className="mt-4 font-mono text-sm text-text-muted">
            or call {PHONE_DISPLAY}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ---- Demo attribution — one quiet line (the gym is fictional). ---- */
function DemoNote() {
  return (
    <div className="pb-8 pt-4 text-center">
      <p className="px-6 text-xs text-text-dim">
        Erken Climbing Co. is a fictional climbing gym — this site is a live
        demo built by{" "}
        <a href="https://erken.systems" className="underline decoration-border underline-offset-2 transition-colors hover:text-text-muted">
          Erken Systems
        </a>
        . All prices and stats are example content.
      </p>
    </div>
  );
}

/* ================================================================== */
/* Page component — SphereScrollStage + Celly plumbing cloned from     */
/* the sky-erken pilot, with the climbing gym sections inside.                   */
/* ================================================================== */
export default function ClimbErkenClient() {
  const spriteContainerRef = useRef<HTMLDivElement>(null);
  const bubbleContainerRef = useRef<HTMLDivElement>(null);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  // Celly's Text/Voice menu (voice = the Erken Climbing Co. front-desk agent).
  const [choiceMenu, setChoiceMenu] = useState<{ x: number; y: number } | null>(null);
  const closeChoiceMenu = () => setChoiceMenu(null);
  const openChoiceMenu = (anchorEl?: HTMLElement | null) => {
    const el = anchorEl ?? spriteContainerRef.current;
    if (el) {
      const r = el.getBoundingClientRect();
      const half = 120;
      const x = Math.max(half, Math.min(window.innerWidth - half, r.left + r.width / 2));
      setChoiceMenu({ x, y: r.top + r.height * 0.28 });
    } else {
      setChoiceMenu({ x: window.innerWidth / 2, y: window.innerHeight * 0.5 });
    }
  };
  // The "Talk to us now" chooser (voice / text).
  const [contactMenu, setContactMenu] = useState<{ x: number; y: number; anchored: boolean } | null>(null);
  useEffect(() => {
    const onOpen = (e: Event) => {
      const d = (e as CustomEvent).detail as { x: number; y: number; anchored: boolean };
      setContactMenu(d);
    };
    window.addEventListener(CONTACT_EVENT, onOpen);
    return () => window.removeEventListener(CONTACT_EVENT, onOpen);
  }, []);
  useEffect(() => {
    if (!contactMenu) return;
    const close = () => setContactMenu(null);
    window.addEventListener("scroll", close, { passive: true, once: true });
    return () => window.removeEventListener("scroll", close);
  }, [contactMenu]);

  const chatOpen = useErkenChatOpen();
  const chatFreezeRef = useRef(false);
  useEffect(() => {
    chatFreezeRef.current = chatOpen;
  }, [chatOpen]);
  useEffect(() => {
    if (!choiceMenu) return;
    const close = () => closeChoiceMenu();
    window.addEventListener("scroll", close, { passive: true, once: true });
    return () => window.removeEventListener("scroll", close);
  }, [choiceMenu]);
  const stoppedRef = useRef(false);
  const lastCellOpacityRef = useRef(1);
  const lastNaturalPosRef = useRef({ xVw: 50, yVh: 50 });
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
  const lastCellWorldPosRef = useRef<{ x: number; y: number } | null>(null);
  const dragonHeadWorldPosRef = useRef<{ x: number; y: number } | null>(null);
  const cellAnimRafRef = useRef<number | null>(null);
  const cameraParamsRef = useRef({ cameraZ: 2.9, fovDeg: 50 });
  const [pointDirection, setPointDirection] = useState<"left" | "right">("right");
  const lastSideRef = useRef<"left" | "right">("right");
  const lastDesiredDirectionRef = useRef<"left" | "right">("right");
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const compute = () => setIsMobile(window.innerWidth < 768);
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  // ── Chat dock (verbatim from HomeV8Client) ─────────────────────────
  useEffect(() => {
    if (!chatOpen) return;
    if (typeof window !== "undefined" && window.innerWidth < 768) return;
    const el = spriteContainerRef.current;
    const DOCK_X_VW = 72;
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
        refs.prevXRef.current = wx;
        refs.prevYRef.current = wy;
        refs.nextXRef.current = wx;
        refs.nextYRef.current = wy;
        refs.transitionProgressRef.current = 1;
        refs.segProgressRef.current = 0.5;
        refs.scaleRef.current = 1;
        refs.sphereOpacityRef.current = 1;
        refs.streamOpacityRef.current = 0;
      }
      raf = requestAnimationFrame(pin);
    };
    raf = requestAnimationFrame(pin);
    return () => cancelAnimationFrame(raf);
  }, [chatOpen]);

  const [activeVariant, setActiveVariant] = useState<BubbleVariant | null>(CELLY_VARIANTS[0]);

  // ── Scroll-stop auto-positioning (verbatim from HomeV8Client) ──────
  useEffect(() => {
    stoppedRef.current = bubbleVisible;
    const el = spriteContainerRef.current;
    const bubbleEl = bubbleContainerRef.current;
    if (el) {
      const mobile = typeof window !== "undefined" && window.innerWidth < 768;
      const restOpacity = mobile ? 1 : bubbleVisible ? 1 : 0;
      el.style.setProperty("--celly-rest-opacity", String(restOpacity));
      el.style.setProperty("--celly-hover-opacity", "1");
      el.style.opacity = "var(--celly-rest-opacity)";
    }
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
    if (bubbleVisible && el && bubbleEl && !chatOpen) {
      if (lastSideRef.current !== lastDesiredDirectionRef.current) {
        lastSideRef.current = lastDesiredDirectionRef.current;
        setPointDirection(lastDesiredDirectionRef.current);
      }
      if (window.innerWidth < 768) {
        const fixedXVw = 14;
        const fixedYVh = 72;
        const pastHero = window.scrollY > window.innerHeight * 0.6;
        bubbleEl.style.display = pastHero ? "none" : "";
        el.style.left = `${fixedXVw}vw`;
        el.style.top = `${fixedYVh}vh`;
        el.style.transform = "translate(-50%, -50%) scale(0.6)";
        const variant = { ...CELLY_VARIANTS[2], widthRem: 8 };
        setActiveVariant(variant);
        bubbleEl.style.right = "auto";
        bubbleEl.style.bottom = "auto";
        bubbleEl.style.left = `${fixedXVw + 7}vw`;
        bubbleEl.style.top = `${fixedYVh - 13}vh`;
        bubbleEl.style.transform = "translate(-50%, -50%)";
        bubbleEl.style.width = `${variant.widthRem}rem`;
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
      const natural = lastNaturalPosRef.current;
      const cellyTarget = findEmptySpot({
        preferredXVw: natural.xVw,
        preferredYVh: natural.yVh,
        paddingVw: 4,
        paddingVh: 5,
        distancePenaltyWeight: 0,
      });
      el.style.left = `${cellyTarget.xVw}vw`;
      el.style.top = `${cellyTarget.yVh}vh`;
      const MIN_SCALE = 0.6;
      const scaleFromSpace = MIN_SCALE;
      el.style.transform = `translate(-50%, -50%) scale(${scaleFromSpace})`;

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
      const remToVw = 16 / Math.max(1, window.innerWidth / 100);
      const remToVh = 16 / Math.max(1, window.innerHeight / 100);
      const VISIBLE_HALF_W_REM = 3.4;
      const VISIBLE_HALF_H_REM = 5.0;
      const cellyHalfVw = VISIBLE_HALF_W_REM * scaleFromSpace * remToVw;
      const cellyHalfVh = VISIBLE_HALF_H_REM * scaleFromSpace * remToVh;
      const FIT_THRESHOLD = 2;
      const MAX_BUBBLE_DIST_FROM_CELLY = 20;
      let chosenVariant: BubbleVariant | null = null;
      let chosenTarget = { xVw: 50, yVh: 50, minDist: 0 };

      const buildCellyAvoid = (variant: BubbleVariant): AvoidRect => {
        const bubbleHalfWVw = (variant.widthRem / 2) * remToVw;
        const bubbleHalfHVh = ((variant.widthRem * 0.45) / 2) * remToVh;
        const EXTRA_GAP_VH = 4;
        return {
          left: cellyTarget.xVw - cellyHalfVw - bubbleHalfWVw,
          right: cellyTarget.xVw + cellyHalfVw + bubbleHalfWVw,
          top: cellyTarget.yVh - cellyHalfVh - bubbleHalfHVh - EXTRA_GAP_VH,
          bottom: cellyTarget.yVh + cellyHalfVh + bubbleHalfHVh + EXTRA_GAP_VH,
        };
      };

      const variants = [{ ...CELLY_VARIANTS[2], widthRem: isMobile ? 8 : 9 }];
      for (const variant of variants) {
        const cellyAvoid = buildCellyAvoid(variant);
        const target = findEmptySpot({
          preferredXVw: cellyTarget.xVw,
          preferredYVh:
            cellyTarget.yVh - cellyHalfVh - ((variant.widthRem * 0.45) / 2) * remToVh - 8,
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
            cellyTarget.yVh - cellyHalfVh - ((chosenVariant.widthRem * 0.45) / 2) * remToVh - 8,
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

      requestAnimationFrame(() => {
        if (!bubbleEl) return;
        const rect = bubbleEl.getBoundingClientRect();
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
          const newXVw = chosenTarget.xVw + dxPx / vw;
          const newYVh = chosenTarget.yVh + dyPx / vh;
          bubbleEl.style.left = `${newXVw}vw`;
          bubbleEl.style.top = `${newYVh}vh`;
        }
      });

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
        const startX =
          dragonHeadWorldPosRef.current?.x ??
          lastCellWorldPosRef.current?.x ??
          refs.xRef.current;
        const startY =
          dragonHeadWorldPosRef.current?.y ??
          lastCellWorldPosRef.current?.y ??
          refs.yRef.current;
        dragonHeadWorldPosRef.current = null;
        if (cellAnimRafRef.current !== null) {
          cancelAnimationFrame(cellAnimRafRef.current);
          cellAnimRafRef.current = null;
        }
        refs.prevXRef.current = startX;
        refs.prevYRef.current = startY;
        refs.nextXRef.current = targetX;
        refs.nextYRef.current = targetY;
        refs.segProgressRef.current = 0;
        refs.transitionProgressRef.current = 1;
        refs.streamOpacityRef.current = 1;
        refs.scaleRef.current = 0;
        refs.sphereOpacityRef.current = 0;
        const FLY_MS = 400;
        const EXPAND_MS = 250;
        const animStart = performance.now();
        const tick = (now: number) => {
          const elapsed = now - animStart;
          const flyT = Math.min(1, elapsed / FLY_MS);
          refs.segProgressRef.current = flyT;
          refs.xRef.current = startX + (targetX - startX) * flyT;
          refs.yRef.current = startY + (targetY - startY) * flyT;
          if (elapsed >= FLY_MS) {
            const expandT = Math.min(1, (elapsed - FLY_MS) / EXPAND_MS);
            refs.scaleRef.current = expandT;
            refs.sphereOpacityRef.current = expandT;
            refs.streamOpacityRef.current = 1 - expandT;
          }
          if (elapsed < FLY_MS + EXPAND_MS) {
            cellAnimRafRef.current = requestAnimationFrame(tick);
          } else {
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

  // ── Scroll listener / dragon-draw (verbatim from HomeV8Client) ─────
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let scrollStartY: number | null = null;
    const CELL_VISIBILITY_THRESHOLD = 0.2;
    const showBubbleIfCellVisible = () => {
      if (lastCellOpacityRef.current > CELL_VISIBILITY_THRESHOLD) {
        setBubbleVisible(true);
      }
      scrollStartY = null;
    };
    const onScroll = () => {
      if (chatFreezeRef.current) return;
      if (scrollStartY === null) scrollStartY = window.scrollY;
      setBubbleVisible(false);
      const isMobileNow = typeof window !== "undefined" && window.innerWidth < 768;
      if (isMobileNow) {
        const refs = cellRefsRef.current;
        if (refs) {
          const { cameraZ, fovDeg } = cameraParamsRef.current;
          const halfFovRad = (fovDeg / 2) * (Math.PI / 180);
          const verticalHalf = cameraZ * Math.tan(halfFovRad);
          const aspect =
            window.innerHeight > 0 ? window.innerWidth / window.innerHeight : 16 / 9;
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
      const refs = cellRefsRef.current;
      const last = lastCellWorldPosRef.current;
      if (refs && last && scrollStartY !== null) {
        const { cameraZ, fovDeg } = cameraParamsRef.current;
        const halfFovRad = (fovDeg / 2) * (Math.PI / 180);
        const verticalHalf = cameraZ * Math.tan(halfFovRad);
        const pxToWorldY = (verticalHalf * 2) / window.innerHeight;
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

  // ── handleCellMove (verbatim from HomeV8Client, generic offsets) ───
  const handleCellMove = useCallback((pos: CellPositionInfo) => {
    const el = spriteContainerRef.current;
    if (!el) return;
    const halfFovRad = (pos.fovDeg / 2) * (Math.PI / 180);
    const verticalHalf = pos.cameraZ * Math.tan(halfFovRad);
    const aspect =
      typeof window !== "undefined" && window.innerHeight > 0
        ? window.innerWidth / window.innerHeight
        : 16 / 9;
    const horizontalHalf = verticalHalf * aspect;
    const SCENE_OFFSETS: Record<number, { xPushIn: number; yOffset: number; pointOverride?: "left" | "right" }> = {
      0: { xPushIn: 0.55, yOffset: 0 },
    };
    const sceneOffset = SCENE_OFFSETS[pos.sectionIndex] ?? { xPushIn: 0.55, yOffset: 0 };
    const { xPushIn, yOffset, pointOverride } = sceneOffset;
    const cellySide = pos.worldX < 0 ? -1 : 1;
    const desiredDirection: "left" | "right" =
      pointOverride ?? (cellySide < 0 ? "left" : "right");
    lastDesiredDirectionRef.current = desiredDirection;
    const cellyWorldX = pos.worldX - cellySide * xPushIn;
    const cellyWorldY = pos.worldY + yOffset;
    const xVw = 50 + (cellyWorldX / (2 * horizontalHalf)) * 100;
    const yVh = 50 - (cellyWorldY / (2 * verticalHalf)) * 100;
    lastNaturalPosRef.current = { xVw, yVh };
    cameraParamsRef.current = { cameraZ: pos.cameraZ, fovDeg: pos.fovDeg };
    lastCellOpacityRef.current = 1;
    const mobile = typeof window !== "undefined" && window.innerWidth < 768;
    const restOpacity = mobile ? 1 : stoppedRef.current ? 1 : 0;
    el.style.setProperty("--celly-rest-opacity", String(restOpacity));
    el.style.setProperty("--celly-hover-opacity", "1");
    el.style.opacity = "var(--celly-rest-opacity)";
  }, []);

  return (
    <>
    {/* --d-* theme vars for the reused demo components (DemoVoiceWidget),
        mapped to this site's own cream/sage palette
        (identical to fly-erken's — same site skin, different content). */}
    <style>{`
      :root {
        --d-bg: #F5F1E8;
        --d-surface: #FFFFFF;
        --d-surface2: #FAF6EC;
        --d-border: #D4CDB8;
        --d-text: #2A2620;
        --d-text-muted: #6B655B;
        --d-text-dim: #9B9485;
        --d-accent: #7ea687;
        --d-accent-soft: rgba(126, 166, 135, 0.12);
      }
    `}</style>
    <ClimbHeader />
    <SphereScrollStage
      // 7 top-level sections: hero, services, journey, gear,
      // pricing+booking, one-roof, questions. Cosmetic — the on-stop
      // findEmptySpot auto-positioner owns Celly's resting spot.
      sectionCount={7}
      showDust
      dustZIndex={52}
      freezeRef={chatFreezeRef}
      onCellPositionChange={handleCellMove}
      onCellRefsReady={(refs) => {
        cellRefsRef.current = refs;
        if (typeof window !== "undefined" && window.innerWidth < 768) {
          const cameraZ = 2.2;
          const fovDeg = 50;
          const halfFovRad = (fovDeg / 2) * (Math.PI / 180);
          const verticalHalf = cameraZ * Math.tan(halfFovRad);
          const aspect =
            window.innerHeight > 0 ? window.innerWidth / window.innerHeight : 16 / 9;
          const horizontalHalf = verticalHalf * aspect;
          refs.xRef.current = ((14 - 50) / 100) * (2 * horizontalHalf);
          refs.yRef.current = ((50 - 72) / 100) * (2 * verticalHalf);
          refs.scaleRef.current = 1;
          refs.sphereOpacityRef.current = 1;
          refs.streamOpacityRef.current = 0;
        }
      }}
      hideInnerCellCore
      disableScrollDrivenShape
      straightTrail
      hideTrail={isMobile}
    >
      {/* 1. HERO — climbing photo + Contact-us-now chooser. */}
      <HeroSection isMobile={isMobile} />

      {/* 2. PROGRAMS — the industry-carousel mechanic, one card per program. */}
      <ServicesSection />

      {/* 3. THE JUMP DAY — sticky-column phase panels. */}
      <JourneySection />

      {/* 4. AIRCRAFT & GEAR — the AI-team carousel mechanic. */}
      <GearSection />

      {/* 5. PRICING + the real GHL booking calendar right below. */}
      <PricingSection />
      <BookingSection />

      {/* 6. ONE GYM — the stack-table mechanic + Thomas Road advantage. */}
      <CragSection />

      {/* 7. STILL HAVE QUESTIONS — same contact chooser as the hero. */}
      <QuestionsSection />

      <DemoNote />

      {/* Trailing space so scroll has room to finish its tween. */}
      <div className="h-[10vh]" />
    </SphereScrollStage>

    {/* Roaming Celly overlay — identical plumbing to the homepage. */}
    <div
      ref={spriteContainerRef}
      aria-hidden={false}
      className="celly-container fixed z-[51] pointer-events-none"
      style={{
        left: "30vw",
        top: "50vh",
        transform: "translate(-50%, -50%) scale(0.7)",
        transformOrigin: "center",
        transition: "opacity 0.25s ease-out, transform 0.3s ease-out",
      }}
    >
      <CellDragonSprite
        scale={1}
        pointDirection={pointDirection}
        showOuterShell={false}
        bubbleText={null}
        onClick={() => {
          openChoiceMenu();
        }}
      />
    </div>
    <ErkenChatWidget />
    {/* Voice widget = the DEMO variant: every call carries the Erken Climbing Co.
        dynamic variables so the Retell agent answers as this gym's
        front desk. */}
    <DemoVoiceWidget config={CLIMB} />

    {/* Celly's Text/Voice menu. */}
    {choiceMenu && (
      <>
        <div className="fixed inset-0 z-[55]" aria-hidden onClick={closeChoiceMenu} />
        <div
          role="menu"
          aria-label="How would you like to talk to the front desk?"
          className="fixed z-[56] flex flex-col gap-1 rounded-2xl border border-white/15 bg-black/80 p-2 shadow-2xl backdrop-blur-md"
          style={{
            left: choiceMenu.x,
            top: choiceMenu.y,
            transform: choiceMenu.y < 140 ? "translate(-50%, 12%)" : "translate(-50%, -115%)",
          }}
        >
          <button
            role="menuitem"
            onClick={() => {
              closeChoiceMenu();
              openErkenChat();
            }}
            className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm text-white transition-colors hover:bg-white/15"
          >
            <span aria-hidden className="text-base">💬</span> Text chat
          </button>
          <button
            role="menuitem"
            onClick={() => {
              closeChoiceMenu();
              window.__startDemoVoiceCall?.();
            }}
            className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm text-white transition-colors hover:bg-white/15"
          >
            <span aria-hidden className="text-base">🎙️</span> Voice chat
          </button>
        </div>
      </>
    )}

    {/* Contact-us-now chooser — voice / text chat. */}
    {contactMenu && (
      <>
        {/* z-index sits above the apple-cards Card modal (z-[200]/[210]) so
            "Talk to us now" from an OPEN service card layers the chooser
            over the still-open card instead of closing it (owner fix,
            2026-07-30). */}
        <div className="fixed inset-0 z-[215] bg-black/20" aria-hidden onClick={() => setContactMenu(null)} />
        <div
          role="menu"
          aria-label="Contact Erken Climbing Co."
          className="fixed z-[216] flex w-[280px] flex-col gap-1 rounded-2xl border border-white/15 bg-black/85 p-2 shadow-2xl backdrop-blur-md"
          style={
            contactMenu.anchored
              ? {
                  left: contactMenu.x,
                  top: Math.min(contactMenu.y + 8, window.innerHeight - 240),
                  transform: "translateX(-50%)",
                }
              : { left: "50%", top: "40%", transform: "translate(-50%, -50%)" }
          }
        >
          <div className="flex items-center justify-between px-3 pb-1 pt-1">
            <span className="text-xs text-white/55">Contact Erken Climbing Co.</span>
            <button
              type="button"
              aria-label="Close"
              onClick={() => setContactMenu(null)}
              className="rounded-full p-1 text-white/40 transition-colors hover:text-white/90"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <button
            role="menuitem"
            onClick={() => {
              setContactMenu(null);
              window.__startDemoVoiceCall?.();
            }}
            className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm text-white transition-colors hover:bg-white/15"
          >
            <span aria-hidden className="text-base">🎙️</span>
            <span>
              Voice — talk right now
              <span className="block text-xs text-white/50">The front desk picks up instantly</span>
            </span>
          </button>
          <button
            role="menuitem"
            onClick={() => {
              setContactMenu(null);
              openErkenChat();
            }}
            className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm text-white transition-colors hover:bg-white/15"
          >
            <span aria-hidden className="text-base">💬</span>
            <span>
              Text chat
              <span className="block text-xs text-white/50">Type your question, get answers</span>
            </span>
          </button>
        </div>
      </>
    )}

    <style>{`
      .celly-container:hover,
      .celly-container:focus-within {
        opacity: var(--celly-hover-opacity, 1) !important;
      }
      body.erken-chat-open [aria-label="Talk to Celly"] {
        opacity: 0 !important;
        pointer-events: none !important;
      }
    `}</style>

    {/* SVG gooey filter for the cloud bubble (same as the homepage). */}
    <svg aria-hidden className="fixed pointer-events-none" style={{ width: 0, height: 0, position: "fixed" }}>
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

    {/* Celly's cloud speech bubble (same gooey-cloud pattern). */}
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
      className="fixed z-[53] cursor-pointer"
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
      <div className="absolute inset-0" style={{ filter: "url(#cloud-goo)" }}>
        {(() => {
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
                  className="absolute rounded-full bg-white"
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
                className="absolute rounded-full bg-white"
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
                className="absolute rounded-full bg-white"
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
      <div className={`relative z-10 ${isMobile ? "px-4 py-4" : "px-6 py-5"}`}>
        <div className={`${isMobile ? "text-[11px]" : "text-[12px]"} leading-relaxed text-neutral-800`}>
          {activeVariant?.text ?? CELLY_INTRO}
        </div>
      </div>
    </div>
    </>
  );
}
