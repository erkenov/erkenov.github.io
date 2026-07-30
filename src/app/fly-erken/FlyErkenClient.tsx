"use client";

/**
 * FlyErkenClient — a CLONE of the live homepage (home-v8-draft/HomeV8Client)
 * with every section's content repurposed for Fly Erken Flight Academy, the
 * fictional Phoenix flight school demo (owner-approved rebuild 2026-07-30,
 * replacing the rejected /demo/flight-schools premium design as the
 * fly.erken.systems root).
 *
 * Inherited verbatim from the homepage so every live effect survives:
 *   - SphereScrollStage (Three.js cell-dragon canvas + dust)
 *   - The roaming Celly overlay: findEmptySpot auto-positioner, scroll-driven
 *     dragon-draw, on-stop fly-to-empty-spot, click-to-chat menu, chat-dock
 *     pin, the gooey cloud speech bubble.
 *   - Section / header / carousel / pricing-card / comparison-table patterns.
 *
 * What changed (per the owner's section-by-section brief):
 *   1. Hero: "Talk to us now" (voice / text chat / callback chooser) replaces
 *      "Try for free" everywhere; "Our services" replaces "See your industry";
 *      hero video = Pexels twilight-takeoff stock clip (muted loop + poster).
 *   2. Industries carousel → SERVICES carousel (6 flight-school services).
 *   3. "How it runs" → the STUDENT JOURNEY (intro flight → license), same
 *      sticky-column + phase-panel mechanic.
 *   4. "Your AI team" carousel → the AIRCRAFT FLEET carousel.
 *   5. Pricing cards → flight services; "Book now" scrolls to the embedded
 *      GHL booking calendar (SS2V1nuWEIbOlNrzyxpt).
 *   6. Stack-comparison table → "One academy, everything under one roof"
 *      fused with the Arizona advantage.
 *   7. Custom solutions → "Still have questions?" with the same contact
 *      chooser.
 *   8. Erken bot comes along: text chat = the same GHL widget; VOICE calls
 *      go through DemoVoiceWidget so Retell receives the Fly Erken
 *      dynamic variables and answers as the school's front desk.
 *
 * DEMO DISCLAIMER: the school is fictional; all prices/stats are invented.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check, Phone, X } from "lucide-react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { IconArrowNarrowLeft, IconArrowNarrowRight } from "@tabler/icons-react";
import { SphereScrollStage, type CellPositionInfo } from "@/components/SphereScrollStage";
import { CellDragonSprite } from "@/components/CellDragonSprite";
import ErkenChatWidget, {
  openErkenChat,
  useErkenChatOpen,
} from "@/components/ErkenChatWidget";
import DemoVoiceWidget from "@/app/demo/components/DemoVoiceWidget";
import CallbackModal from "@/app/demo/components/CallbackModal";
import { getDemoConfig } from "@/app/demo/config";

const ease = [0.16, 1, 0.3, 1] as const;

// The flight-school demo registry entry — source of truth for the business
// facts + the Retell dynamic variables (demo_business / demo_industry /
// demo_context) the voice agent needs to answer in character.
const FLY = getDemoConfig("flight-schools")!;
const PHONE_TEL = "+13252412460";
const PHONE_DISPLAY = FLY.business.phoneDisplay; // (325) 241-2460
const BOOKING_CALENDAR_ID = FLY.booking.calendarId!; // SS2V1nuWEIbOlNrzyxpt

declare global {
  interface Window {
    __startDemoVoiceCall?: () => void;
    __openDemoCallbackModal?: () => void;
  }
}

/* ================================================================== */
/* Contact chooser — the "Talk to us now" choice UI (voice / text /    */
/* callback). Opened from the header, the hero, service cards, and the */
/* Still-have-questions section via a window event so any child can    */
/* trigger the single instance living in FlyErkenClient.               */
/* ================================================================== */

const CONTACT_EVENT = "fly-erken:contact";

export function openFlyContact(anchorEl?: HTMLElement | null) {
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

/** Close the apple-cards Card modal from inside its content (it listens for
 *  Escape on window), then run a follow-up once the page can scroll again. */
function closeCardModal(after?: () => void) {
  window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  if (after) setTimeout(after, 80);
}

function scrollToBooking() {
  document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
}

/* ================================================================== */
/* Hero video — free stock GA-trainer footage (Pexels #17118523 +      */
/* #17118515, a Cessna 172's takeoff roll then climb-out — small       */
/* flight-school aircraft ONLY, owner's rule: no airliners/jets),      */
/* joined to a 24s muted autoplay loop at 2.5 MB with a poster         */
/* fallback. No text overlays on the video (owner's rule): clean       */
/* footage, nothing burned over it.                                    */
/* ================================================================== */
function FlightHeroVideo() {
  return (
    <div className="relative w-full max-w-[40rem] overflow-hidden rounded-2xl bg-black shadow-2xl aspect-video">
      <video
        src="/fly-erken/hero.mp4"
        poster="/fly-erken/hero-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="A Cessna trainer taking off and climbing out"
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
  kicker: "Fly Erken Flight Academy",
  headline: "Your first takeoff is closer than you think.",
  body: "Discovery flights, private pilot training, and a clear path to the left seat — out of Deer Valley Airport in Phoenix. Arizona gives you 300+ clear-sky flying days a year and wide-open desert practice airspace, so lessons actually happen. And the instructor who flies with you is the one who answers the phone.",
  priceTease: "Discovery flights $199. Most students solo in under three months.",
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
            onClick={(e) => openFlyContact(e.currentTarget)}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-medium text-bg transition-all hover:bg-accent-hover"
          >
            Talk to us now →
          </button>
          <a
            href="#services"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-medium text-text transition-all hover:border-border-strong hover:bg-surface"
          >
            Our services
          </a>
        </div>
      </div>
      {/* Media — same right-anchored wrapper the homepage hero uses. */}
      {isMobile ? (
        <div data-celly-avoid className="mt-10 w-full">
          <FlightHeroVideo />
        </div>
      ) : (
        <div
          data-celly-avoid
          className="absolute inset-y-[8vh] right-[4vw] left-[48vw] 2xl:left-auto 2xl:w-[50%] hidden md:flex items-center justify-center pointer-events-auto"
        >
          <FlightHeroVideo />
        </div>
      )}
    </section>
  );
}

/* ================================================================== */
/* Celly bubble copy — flight-school front-desk voice.                 */
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
      "Hi, I'm Erken — Fly Erken's front desk. I can answer anything about discovery flights, training, or the fleet, and book you in. Ask away.",
    widthRem: 22,
    paddingVw: 9,
    paddingVh: 11,
  },
  {
    text: "Hi, I'm Erken — the front desk here. Ask me anything about learning to fly.",
    widthRem: 17,
    paddingVw: 7,
    paddingVh: 7,
  },
  {
    text: "Questions about flying? Ask me.",
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
function FlyHeader() {
  return (
    <header
      data-celly-avoid
      className="sticky top-0 z-50 w-full border-b border-border/60 bg-bg/85 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-8">
        <a href="/" className="font-mono text-sm font-medium uppercase tracking-tight text-text">
          fly<span className="text-accent"> </span>erken
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#services" className="text-sm text-text-muted transition-colors hover:text-text">
            Our services
          </a>
          <a href="#journey" className="text-sm text-text-muted transition-colors hover:text-text">
            Student journey
          </a>
          <a href="#fleet" className="text-sm text-text-muted transition-colors hover:text-text">
            The fleet
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
            onClick={(e) => openFlyContact(e.currentTarget)}
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
/* SERVICES — the homepage "Built for your industry" Apple-card        */
/* carousel, cards = the academy's six services.                       */
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
          onClick={() => closeCardModal(scrollToBooking)}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-medium text-white transition-transform duration-200 hover:scale-[1.02]"
        >
          Book now <span aria-hidden>→</span>
        </button>
        <button
          type="button"
          onClick={() => closeCardModal(() => openFlyContact())}
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
    category: "Start here · $199",
    title: "Discovery Flight",
    photo: "/demo/flight-schools/cockpit-lesson.jpg",
    story:
      "A 45-minute intro lesson where you take the controls with an instructor beside you. It's a real lesson, not a sightseeing ride — the flight goes in your logbook and counts toward your license. Bring a passenger, take photos, and land knowing whether this is your thing.",
    included: [
      "30-minute ground briefing",
      "45 minutes in the air",
      "You fly the controls",
      "A real logbook entry",
      "Bring one passenger along",
      "Written training plan after you land",
    ],
    note: "No medical certificate needed for a discovery flight. If you enroll, the $199 credits toward your training.",
  },
  {
    category: "Study first · start online",
    title: "Ground School",
    photo: "/demo/flight-schools/student-smile.jpg",
    story:
      "The classroom side of flying — airspace, weather, aerodynamics, and everything on the FAA written exam. Start online tonight at your own pace, then join the live evening classes that run every eight weeks. Passing the written early is the cheapest flight time you'll ever save.",
    included: [
      "Online modules at your own pace",
      "Live evening classes",
      "FAA written exam prep",
      "Practice exams until you're ready",
      "Instructor Q&A between classes",
    ],
    note: "You can start ground school before your first flight — many students do both in the same month.",
  },
  {
    category: "Zero to certificate",
    title: "Full Flight Training — Private Pilot",
    photo: "/demo/flight-schools/preflight-hangar.jpg",
    story:
      "The full course from zero hours to certificated private pilot. One instructor stays with you from first lesson to checkride, your schedule lives online, and your progress is tracked against a written syllabus — so you always know what the next lesson is and what it costs.",
    included: [
      "One instructor, first lesson to checkride",
      "Written syllabus with cost tracking",
      "Online scheduling, real availability",
      "Flight time billed as flown",
      "Checkride prep included",
      "Ground school bundled in",
    ],
    note: "Flying twice a week, most students solo in 2–3 months and finish in 8–12 months.",
  },
  {
    category: "Professional path",
    title: "Career Track",
    photo: "/demo/flight-schools/airline-captain.jpg",
    story:
      "For students aiming at the airlines or professional flying: private, instrument, and commercial on one continuous plan, then build paid hours instructing with us. We map the whole path — ratings, hour requirements, timeline — before you commit to any of it.",
    included: [
      "Private → Instrument → Commercial path",
      "One written plan across all ratings",
      "Hour-building options after commercial",
      "Instructor pathway for graduates",
      "Honest timeline and cost mapping up front",
    ],
    note: "Every career is different — the first step is a planning session with an instructor, not a contract.",
  },
  {
    category: "Make it affordable",
    title: "Financing",
    photo: "/demo/flight-schools/fleet-cessna.jpg",
    story:
      "Flight training is more affordable than most people assume — and you don't pay for it all at once. You pay per lesson as you fly, and for bigger programs we walk you through the real financing options and help with the paperwork, so the money question never grounds the flying.",
    included: [
      "Pay per lesson — no big deposits",
      "Help comparing student loan options",
      "Block-rate discounts on flight time",
      "Written cost breakdown before you start",
      "Spend tracked against your plan every lesson",
    ],
    note: "We're a flight school, not a lender — we help you find and apply for financing, and we keep your costs visible the whole way.",
  },
  {
    category: "College credit",
    title: "University Partnership",
    photo: "/demo/flight-schools/sunset-pilots.jpg",
    story:
      "Fly here while you study. Through our partner university program in the Phoenix metro, your flight training can count toward an aviation degree — a common route for students who want the airline hiring advantages of a degree and the flying done at a small school that knows their name.",
    included: [
      "Training aligned to a degree path",
      "College credit for flight ratings",
      "Financial-aid friendly structure",
      "Same instructors, same fleet",
      "Advising session to map credits",
    ],
    note: "Details depend on your program — bring your degree plan to the advising session and we'll map it together.",
  },
];

function FlyServicesCarousel() {
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
            onClick={(e) => openFlyContact(e.currentTarget)}
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
          <SectionKicker>Our services</SectionKicker>
          <h2
            className="mt-3 text-3xl font-bold tracking-tight md:text-5xl"
            style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
          >
            From first flight to the left seat.
          </h2>
          <p className="mt-4 text-base text-text-muted md:text-lg">
            Every card is a real program at the academy — open one to see what&apos;s
            inside, what it costs, and how to book it.
          </p>
        </motion.div>
      </div>
      <div data-celly-avoid className="mt-4">
        <FlyServicesCarousel />
      </div>
    </section>
  );
}

/* ================================================================== */
/* STUDENT JOURNEY — the homepage "How it runs" sticky-column section, */
/* phases = first call to license in hand. Same flat-SVG icon style.   */
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

/** INTRO FLIGHT — a small plane lifting off a runway line. */
function IlloIntroFlight() {
  return (
    <IllustrationBackdrop>
      {/* runway */}
      <rect x="24" y="86" width="52" height="6" rx="3" fill={ILLO_NEUTRAL} />
      <rect x="30" y="88" width="8" height="2" rx="1" fill={ILLO_CREAM} />
      <rect x="46" y="88" width="8" height="2" rx="1" fill={ILLO_CREAM} />
      {/* climb path */}
      <path d="M34 84 Q56 76 78 52" stroke={ILLO_SAGE} strokeWidth="3.5" strokeDasharray="1 7" strokeLinecap="round" fill="none" />
      {/* plane silhouette climbing */}
      <g transform="translate(78 46) rotate(-24)">
        <path d="M-14 0 L12 0 L18 -3 L12 2 L-14 4 Z" fill={ILLO_CLAY} />
        <path d="M-4 0 L-10 -10 L-6 -10 L2 0 Z" fill={ILLO_CLAY} />
        <path d="M-12 2 L-18 8 L-14 8 L-8 3 Z" fill={ILLO_CLAY} />
      </g>
    </IllustrationBackdrop>
  );
}

/** GROUND SCHOOL — an open book with a compass rose above it. */
function IlloGroundSchool() {
  return (
    <IllustrationBackdrop>
      {/* compass dot */}
      <circle cx="60" cy="34" r="9" fill="none" stroke={ILLO_CLAY} strokeWidth="3" />
      <path d="M60 27 V41 M53 34 H67" stroke={ILLO_CLAY} strokeWidth="2.5" strokeLinecap="round" />
      {/* open book */}
      <path d="M28 58 Q44 50 60 58 L60 92 Q44 84 28 92 Z" fill={ILLO_SAGE} />
      <path d="M92 58 Q76 50 60 58 L60 92 Q76 84 92 92 Z" fill={ILLO_SAGE} opacity="0.75" />
      <path d="M36 64 Q46 59 54 63 M36 72 Q46 67 54 71 M66 63 Q74 59 84 64 M66 71 Q74 67 84 72" stroke={ILLO_CREAM} strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </IllustrationBackdrop>
  );
}

/** FLIGHT HOURS — a clock face with a plane sweeping around it. */
function IlloFlightHours() {
  return (
    <IllustrationBackdrop>
      <circle cx="60" cy="62" r="24" fill="none" stroke={ILLO_SAGE} strokeWidth="4" />
      <path d="M60 62 L60 46 M60 62 L72 68" stroke={ILLO_SAGE} strokeWidth="4" strokeLinecap="round" />
      {/* sweeping plane */}
      <g transform="translate(88 34) rotate(18)">
        <path d="M-12 0 L10 0 L15 -2.5 L10 2 L-12 3.5 Z" fill={ILLO_CLAY} />
        <path d="M-3 0 L-8 -8 L-5 -8 L1 0 Z" fill={ILLO_CLAY} />
      </g>
      <path d="M30 40 A38 38 0 0 1 76 28" stroke={ILLO_CLAY} strokeWidth="2.5" strokeDasharray="1 6" strokeLinecap="round" fill="none" />
    </IllustrationBackdrop>
  );
}

/** CHECKRIDE — a clipboard checklist with a bold check badge. */
function IlloCheckride() {
  return (
    <IllustrationBackdrop>
      <rect x="38" y="26" width="44" height="60" rx="6" fill="#FFFFFF" stroke={ILLO_NEUTRAL} strokeWidth="2" />
      <rect x="50" y="21" width="20" height="9" rx="3" fill={ILLO_NEUTRAL} />
      <path d="M45 42 L49 46 L55 38" stroke={ILLO_SAGE} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="60" y="40" width="16" height="4" rx="2" fill={ILLO_NEUTRAL} />
      <path d="M45 56 L49 60 L55 52" stroke={ILLO_SAGE} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="60" y="54" width="16" height="4" rx="2" fill={ILLO_NEUTRAL} />
      <circle cx="80" cy="82" r="15" fill={ILLO_SAGE} />
      <path d="M73 82 L78 87 L88 76" stroke="#FFFFFF" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </IllustrationBackdrop>
  );
}

/** LICENSE — a winged certificate badge. */
function IlloLicense() {
  return (
    <IllustrationBackdrop>
      {/* wings */}
      <path d="M52 58 Q34 50 24 56 Q34 62 52 64 Z" fill={ILLO_CLAY} />
      <path d="M68 58 Q86 50 96 56 Q86 62 68 64 Z" fill={ILLO_CLAY} />
      {/* badge */}
      <circle cx="60" cy="60" r="16" fill={ILLO_SAGE} />
      <circle cx="60" cy="60" r="10" fill="none" stroke={ILLO_CREAM} strokeWidth="2" />
      <path
        d="M60 53 L61.8 57.4 L66.5 57.6 L62.9 60.6 L64.1 65.1 L60 62.5 L55.9 65.1 L57.1 60.6 L53.5 57.6 L58.2 57.4 Z"
        fill={ILLO_CREAM}
      />
      {/* ribbons */}
      <path d="M54 74 L50 92 L58 86 L60 94 L62 86 L70 92 L66 74 Z" fill={ILLO_CLAY} opacity="0.85" />
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
    name: "Intro call & discovery flight",
    tagline: "Fly first, decide after",
    Illustration: IlloIntroFlight,
    items: [
      "Call or book online — answered 24/7",
      "30-minute ground briefing",
      "45 minutes at the controls",
      "Logbook entry number one",
      "Written training plan + cost breakdown",
      "Your instructor assigned",
    ],
  },
  {
    name: "Ground school",
    tagline: "The knowledge side, on your schedule",
    Illustration: IlloGroundSchool,
    items: [
      "Start online the same week",
      "Airspace, weather, aerodynamics",
      "Live evening classes",
      "Practice exams until comfortable",
      "FAA written passed early",
    ],
  },
  {
    name: "Flight hours",
    tagline: "Two lessons a week, one syllabus",
    Illustration: IlloFlightHours,
    items: [
      "One instructor start to finish",
      "Every lesson briefed before engine start",
      "First solo around 15 hours",
      "Cross-country flights",
      "Night flying",
      "Progress tracked against the syllabus",
    ],
  },
  {
    name: "Checkride",
    tagline: "No surprises at hour forty",
    Illustration: IlloCheckride,
    items: [
      "Mock checkride with a second instructor",
      "Oral-exam drilling",
      "Fixed-price prep — no surprise hours",
      "Examiner scheduled for you",
    ],
  },
  {
    name: "License in hand",
    tagline: "Now the sky is yours",
    Illustration: IlloLicense,
    items: [
      "Private pilot certificate",
      "Rent the fleet as a member",
      "Instrument rating next, if you want it",
      "Career track to the airlines",
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
              <SectionKicker>The student journey</SectionKicker>
              <h2
                className="mt-3 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
                style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
              >
                From first call to license in hand.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-text-muted md:text-lg">
                Every pilot here walks the same five stages — from the first
                phone call to a checkride handshake. You always know which
                stage you&apos;re in, what it costs, and what comes next.
              </p>
              <p className="mt-3 text-base leading-relaxed text-text-muted md:text-lg">
                No guesswork, no surprise hours, no stalled progress.
              </p>
              <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={(e) => openFlyContact(e.currentTarget)}
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
/* THE FLEET — the homepage "Your AI team" carousel mechanic, cards =  */
/* the training aircraft. Same warm wash, portrait cards, auto-rotate. */
/* ================================================================== */

const FLEET: {
  title: string;
  spec: string;
  desc: string;
  photo?: string;
}[] = [
  {
    title: "Cessna 152",
    spec: "2 seats · ~110 kt · the classic first trainer",
    desc: "Light, honest, and famously forgiving — the airplane half the world's pilots soloed in. Perfect for early lessons and cheap solo hours.",
  },
  {
    title: "Cessna 172 Skyhawk",
    spec: "4 seats · ~120 kt · the world's default trainer",
    desc: "Our workhorse for private and instrument training. Stable, roomy enough for a back-seat observer, and everywhere — so your checkride examiner knows it too.",
    photo: "/demo/flight-schools/fleet-cessna.jpg",
  },
  {
    title: "Piper Archer",
    spec: "4 seats · ~125 kt · low-wing cross-country platform",
    desc: "The low-wing counterpart for students who want variety before their license — and a steady instrument platform for the next rating.",
    photo: "/demo/flight-schools/hero-hangar.jpg",
  },
  {
    title: "Flight Simulator",
    spec: "Full panel · logs sim time · a fraction of the hourly rate",
    desc: "Procedures, instrument scans, and emergency drills on the ground — pause mid-maneuver, rewind, repeat. The cheapest hours in your logbook.",
    photo: "/demo/flight-schools/cockpit-checkout.jpg",
  },
];

/** Flat plane silhouette used when a fleet card has no photo. */
function FleetPlaneGlyph() {
  return (
    <svg viewBox="0 0 200 120" className="h-24 w-full" aria-hidden>
      <path d="M30 66 L138 66 L166 52 L146 70 L30 76 Z" fill={ILLO_SAGE} />
      <path d="M84 66 L60 26 L74 26 L104 66 Z" fill={ILLO_SAGE} opacity="0.8" />
      <path d="M42 70 L20 92 L34 92 L58 73 Z" fill={ILLO_SAGE} opacity="0.8" />
      <circle cx="166" cy="52" r="4" fill={ILLO_CLAY} />
    </svg>
  );
}

function FleetCarousel() {
  const n = FLEET.length;
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
        {FLEET.map((card, i) => {
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
                    <FleetPlaneGlyph />
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
          aria-label="Previous aircraft"
          className="absolute left-0 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface text-text shadow-md transition-colors hover:border-border-strong hover:bg-surface-2 md:left-2"
        >
          <IconArrowNarrowLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next aircraft"
          className="absolute right-0 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface text-text shadow-md transition-colors hover:border-border-strong hover:bg-surface-2 md:right-2"
        >
          <IconArrowNarrowRight className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {FLEET.map((c, i) => (
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

function FleetSection() {
  return (
    <section
      id="fleet"
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
            <SectionKicker>The fleet</SectionKicker>
            <h2
              className="mt-2 text-2xl font-bold tracking-tight md:text-3xl"
              style={{ letterSpacing: "-0.02em", lineHeight: 1.15 }}
            >
              Honest trainers, maintained on our own hangar floor.
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
            Maintenance happens in-house, schedules live online, and an
            airplane is ready when you are — that&apos;s the whole point of a
            small fleet run by the people who fly it.
          </motion.p>
        </div>

        <div data-celly-avoid className="mt-8">
          <FleetCarousel />
        </div>

        <p data-celly-avoid className="mt-8 text-center text-sm text-text-muted">
          Certificated pilots rent the fleet <b className="text-text">wet, with online scheduling</b> —
          same-day checkouts for current members.
        </p>
      </div>
    </section>
  );
}

/* ================================================================== */
/* PRICING — the homepage /start-style plan cards, tiers = the         */
/* academy's flight services. "Book now" scrolls to the booking        */
/* calendar embedded right below.                                      */
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
    label: "Discovery Flight",
    price: "$199",
    note: "one time · 45 minutes",
    badge: "Start here",
    features: [
      "You fly the controls",
      "Instructor beside you",
      "Real logbook entry",
      "Counts toward your license",
      "Bring one passenger",
      "Written training plan after",
    ],
  },
  {
    label: "Ground School",
    price: "$349",
    note: "online + live evening classes",
    features: [
      "Start online tonight",
      "Live classes every eight weeks",
      "FAA written exam prep",
      "Practice exams included",
      "Instructor Q&A between classes",
      "Yours until you pass",
    ],
  },
  {
    label: "Private Pilot Program",
    price: "from $11,900",
    note: "flight time billed as flown",
    badge: "Most popular",
    badgeSolid: true,
    features: [
      "One instructor, start to checkride",
      "Written syllabus + cost tracking",
      "Ground school bundled in",
      "Online scheduling, real availability",
      "Checkride prep included",
      "Financing help available",
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
            Start at $199. Know every cost before hour one.
          </h2>
          <p className="mt-4 text-base text-text-muted md:text-lg">
            Flight time is billed as flown — and we publish your full written
            cost breakdown after the discovery flight, then track your spend
            against it every lesson.
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
  useEffect(() => {
    if (document.querySelector(`script[src="${EMBED_SCRIPT_SRC}"]`)) return;
    const s = document.createElement("script");
    s.src = EMBED_SCRIPT_SRC;
    s.async = true;
    document.body.appendChild(s);
  }, []);

  return (
    <section id="booking" className="scroll-mt-20 pb-20 pt-16 md:pb-28 md:pt-20">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <motion.div
          data-celly-avoid
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease }}
          className="mx-auto max-w-2xl text-center"
        >
          <SectionKicker>Book a flight</SectionKicker>
          <h2
            className="mt-3 text-2xl font-bold tracking-tight md:text-4xl"
            style={{ letterSpacing: "-0.02em", lineHeight: 1.15 }}
          >
            Pick a real time on our calendar.
          </h2>
          <p className="mt-3 text-base text-text-muted">
            Grab an open slot and you&apos;re on the schedule instantly — you&apos;ll get
            a text and email with the details. Prefer to talk first? The voice
            assistant books the same calendar.
          </p>
        </motion.div>
        <div
          data-celly-avoid
          className="mx-auto mt-10 max-w-xl rounded-2xl border border-border bg-surface p-4 md:p-6"
        >
          <iframe
            src={`https://api.leadconnectorhq.com/widget/booking/${BOOKING_CALENDAR_ID}`}
            style={{
              width: "100%",
              height: "760px",
              minHeight: "560px",
              border: "none",
              borderRadius: "8px",
              background: "#FFFFFF",
            }}
            id={`booking-${BOOKING_CALENDAR_ID}`}
            scrolling="no"
            title="Book a discovery flight"
          />
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* ONE ROOF — the homepage "replace your whole stack" table mechanic,  */
/* repurposed: everything a student usually juggles across providers   */
/* lives under one roof at Deer Valley, fused with the Arizona         */
/* advantage strip.                                                    */
/* ================================================================== */

const ROOF_ROWS: { cat: string; elsewhere: string }[] = [
  { cat: "Flight training", elsewhere: "A big academy with rotating instructors" },
  { cat: "Ground school", elsewhere: "A separate online course vendor" },
  { cat: "Aircraft & maintenance", elsewhere: "A rental club with its own waitlist" },
  { cat: "Financing help", elsewhere: "Loan paperwork you figure out alone" },
  { cat: "Career path", elsewhere: "An out-of-state pipeline program" },
  { cat: "Front desk & scheduling", elsewhere: "Voicemail and phone tag" },
];

const ARIZONA_POINTS = [
  "300+ clear-sky flying days a year",
  "Wide-open desert practice airspace",
  "Your instructor answers the phone",
];

function OneRoofSection() {
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
          <SectionKicker>One academy</SectionKicker>
          <h2
            className="mt-3 text-3xl font-bold tracking-tight md:text-5xl"
            style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
          >
            Everything under one roof.
          </h2>
          <p className="mt-4 text-base text-text-muted md:text-lg">
            Training, aircraft, financing help, and a career path — one campus
            at Deer Valley, one schedule, one team that knows your name.
          </p>
        </motion.div>

        {/* Arizona advantage strip */}
        <div data-celly-avoid className="mt-8 flex flex-wrap gap-3">
          {ARIZONA_POINTS.map((p) => (
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
              At Fly Erken
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
              <div className="text-[11px] font-medium text-white/85">at Deer Valley Airport</div>
            </div>
          </div>
          {/* Overhang — accent column extends past the table, CTA inside. */}
          <div className="absolute right-0 top-full w-[170px] rounded-b-2xl bg-accent px-3 pb-4 pt-3 text-center shadow-[0_18px_40px_-16px_rgba(126,166,135,0.85)]">
            <button
              type="button"
              onClick={scrollToBooking}
              className="inline-flex w-full items-center justify-center gap-1 rounded-lg bg-white px-3 py-2.5 text-xs font-semibold text-accent shadow-sm transition-transform hover:scale-[1.02]"
            >
              Book a flight →
            </button>
            <div className="mt-1.5 text-[11px] text-white/90">$199 · 45 minutes</div>
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
              Training, aircraft, financing help, and a career path — all at
              Deer Valley Airport.
            </div>
            <button
              type="button"
              onClick={scrollToBooking}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-accent shadow-sm transition-transform hover:scale-[1.02]"
            >
              Book a discovery flight →
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
            Costs, timelines, the medical, whether you&apos;ll fit in a 152 —
            ask anything. The front desk answers around the clock, even when
            every instructor is up in the air.
          </p>
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={(e) => openFlyContact(e.currentTarget)}
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

/* ---- Demo attribution — one quiet line (the school is fictional). ---- */
function DemoNote() {
  return (
    <div className="pb-8 pt-4 text-center">
      <p className="px-6 text-xs text-text-dim">
        Fly Erken Flight Academy is a fictional school — this site is a live
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
/* HomeV8Client, with the flight-school sections inside.               */
/* ================================================================== */
export default function FlyErkenClient() {
  const spriteContainerRef = useRef<HTMLDivElement>(null);
  const bubbleContainerRef = useRef<HTMLDivElement>(null);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  // Celly's Text/Voice menu (voice = the Fly Erken front-desk agent).
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
  // The "Talk to us now" chooser (voice / text / callback).
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    {/* --d-* theme vars for the reused demo components (DemoVoiceWidget +
        CallbackModal), mapped to this site's own cream/sage palette. */}
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
    <FlyHeader />
    <SphereScrollStage
      // 7 top-level sections: hero, services, journey, fleet,
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
      {/* 1. HERO — flight video + Contact-us-now chooser. */}
      <HeroSection isMobile={isMobile} />

      {/* 2. SERVICES — the industry-carousel mechanic, one card per service. */}
      <ServicesSection />

      {/* 3. STUDENT JOURNEY — sticky-column phase panels. */}
      <JourneySection />

      {/* 4. THE FLEET — the AI-team carousel mechanic. */}
      <FleetSection />

      {/* 5. PRICING + the real GHL booking calendar right below. */}
      <PricingSection />
      <BookingSection />

      {/* 6. ONE ROOF — the stack-table mechanic + Arizona advantage. */}
      <OneRoofSection />

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
    {/* Voice widget = the DEMO variant: every call carries the Fly Erken
        dynamic variables so the Retell agent answers as this school's
        front desk. CallbackModal = the GHL "Request a Callback" form. */}
    <DemoVoiceWidget config={FLY} />
    <CallbackModal config={FLY} />

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
          <div className="px-3 pb-1 pt-1 text-xs text-white/55">Talk to the front desk</div>
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

    {/* Contact-us-now chooser — voice / text chat / request a callback. */}
    {contactMenu && (
      <>
        <div className="fixed inset-0 z-[57] bg-black/20" aria-hidden onClick={() => setContactMenu(null)} />
        <div
          role="menu"
          aria-label="Contact Fly Erken"
          className="fixed z-[58] flex w-[280px] flex-col gap-1 rounded-2xl border border-white/15 bg-black/85 p-2 shadow-2xl backdrop-blur-md"
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
            <span className="text-xs text-white/55">Contact Fly Erken</span>
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
          <button
            role="menuitem"
            onClick={() => {
              setContactMenu(null);
              window.__openDemoCallbackModal?.();
            }}
            className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm text-white transition-colors hover:bg-white/15"
          >
            <span aria-hidden className="text-base">📞</span>
            <span>
              Request a callback
              <span className="block text-xs text-white/50">We call you back to book</span>
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
