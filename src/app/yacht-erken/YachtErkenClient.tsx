"use client";

/**
 * YachtErkenClient — replicates the approved sky-erken pilot pattern (a
 * CLONE of the live homepage / home-v8-draft / HomeV8Client, via
 * /fly-erken), with every section's content repurposed for Erken Yacht
 * Charters, a fictional Fort Lauderdale, FL charter company and ASA sailing
 * school (REPLICATION, 2026-08-03).
 *
 * Inherited verbatim from the homepage (via fly-erken/sky-erken) so every
 * live effect survives:
 *   - SphereScrollStage (Three.js cell-dragon canvas + dust)
 *   - The roaming Celly overlay: findEmptySpot auto-positioner, scroll-driven
 *     dragon-draw, on-stop fly-to-empty-spot, click-to-chat menu, chat-dock
 *     pin, the gooey cloud speech bubble.
 *   - Section / header / carousel / pricing-card / comparison-table patterns.
 *
 * What changed (mirroring the pilot's section-by-section mapping):
 *   1. Hero: "Talk to us now" (voice / text chat / callback chooser); hero
 *      visual = the existing repo yachting photo (no new stock footage
 *      sourced for this replication).
 *   2. Industries carousel → CHARTERS & COURSES carousel (6 marina services,
 *      content pulled from the existing src/app/demo/configs/yacht.ts
 *      registry).
 *   3. "How it runs" → THE CHARTER DAY (inquire → instant quote & deposit →
 *      confirm & prep → board → return & rebook), same sticky-column +
 *      phase-panel mechanic. This section carries the real differentiator
 *      research found for yacht charters: an instant quote that beats
 *      broker response time, and direct booking that skips the 15-20%
 *      broker commission (see vault Notes/problem-solution.md).
 *   4. "Your AI team" carousel → THE FLEET & CREW carousel.
 *   5. Pricing cards → charter & course tiers; "Book now" scrolls to the
 *      embedded GHL booking calendar.
 *   6. Stack-comparison table → "One marina, everything included" fused
 *      with the Fort Lauderdale advantage strip.
 *   7. Custom solutions → "Still have questions?" with the same contact
 *      chooser.
 *   8. Erken bot comes along: text chat = the same GHL widget; VOICE calls
 *      go through DemoVoiceWidget so Retell receives the Erken Yacht
 *      Charters dynamic variables and answers as the marina's front desk.
 *
 * DEMO DISCLAIMER: the charter company is fictional; all prices/stats are
 * invented.
 */

import { useCallback, useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Check,
  Phone,
  X,
  Anchor,
  ShieldCheck,
  CalendarCheck,
  Users,
} from "lucide-react";
import { Carousel, Card, CardModalContext } from "@/components/ui/apple-cards-carousel";
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

// The yacht demo registry entry — source of truth for the business
// facts + the Retell dynamic variables (demo_business / demo_industry /
// demo_context) the voice agent needs to answer in character.
const YACHT = getDemoConfig("yacht")!;
const PHONE_TEL = "+18887996065";
const PHONE_DISPLAY = YACHT.business.phoneDisplay;
// NOTE (flag for Shamil's review): yacht.ts reuses the SAME shared demo
// GHL calendar as flight-schools/skydiving (SS2V1nuWEIbOlNrzyxpt) — there
// is no dedicated Erken Yacht Charters calendar yet. Fine for a
// click-through demo, but a real per-industry calendar should probably
// exist before this goes to a live prospect.
const BOOKING_CALENDAR_ID = YACHT.booking.calendarId!;

declare global {
  interface Window {
    __startDemoVoiceCall?: () => void;
    __openDemoCallbackModal?: () => void;
    __prewarmDemoCallbackModal?: () => void;
  }
}

/* ================================================================== */
/* Contact chooser — the "Talk to us now" choice UI (voice / text /    */
/* callback). Opened from the header, the hero, service cards, and the */
/* Still-have-questions section via a window event so any child can    */
/* trigger the single instance living in YachtErkenClient.               */
/* ================================================================== */

const CONTACT_EVENT = "yacht-erken:contact";

export function openYachtContact(anchorEl?: HTMLElement | null) {
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
/* Hero visual — a single existing repo photo (no new stock footage    */
/* sourced for this replication; fly-erken's video rotation needs      */
/* several distinct clips we don't have for yacht charters yet). A     */
/* quiet Ken-Burns scale-in gives it some life without looping motion   */
/* (design-system rule: no infinite breathing/looping decoration).     */
/* ================================================================== */
const HERO_IMAGE = "/industries/card-yachting-photo.jpg";

function YachtHeroImage() {
  return (
    <div className="relative w-full max-w-[40rem] overflow-hidden rounded-2xl bg-black shadow-2xl aspect-video">
      <motion.img
        src={HERO_IMAGE}
        alt="Sailing yacht underway off the coast of Fort Lauderdale"
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
  kicker: "Erken Yacht Charters",
  headline: "An instant quote, before you book someone else's boat.",
  body: "Day and multi-day charters, ASA-certified sailing courses, and a boat club membership out of Bahia Mar Marina. Message any hour and our AI front desk checks live fleet availability and quotes your date on the spot — no waiting overnight while the boat down the dock answers first.",
  priceTease: "Day charters from $895. Confirmed with a deposit, same conversation.",
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
            onClick={(e) => openYachtContact(e.currentTarget)}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-medium text-bg transition-all hover:bg-accent-hover"
          >
            Talk to us now →
          </button>
          <a
            href="#services"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-medium text-text transition-all hover:border-border-strong hover:bg-surface"
          >
            Charters & courses
          </a>
        </div>
      </div>
      {/* Media — same right-anchored wrapper the homepage hero uses. */}
      {isMobile ? (
        <div data-celly-avoid className="mt-10 w-full">
          <YachtHeroImage />
        </div>
      ) : (
        <div
          data-celly-avoid
          className="absolute inset-y-[8vh] right-[4vw] left-[48vw] 2xl:left-auto 2xl:w-[50%] hidden md:flex items-center justify-center pointer-events-auto"
        >
          <YachtHeroImage />
        </div>
      )}
    </section>
  );
}

/* ================================================================== */
/* Celly bubble copy — marina front-desk voice.                        */
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
      "Hi, I'm Erken — Erken Yacht's front desk. I can quote a charter, walk you through ASA courses, or check the boat club, and book you in. Ask away.",
    widthRem: 22,
    paddingVw: 9,
    paddingVh: 11,
  },
  {
    text: "Hi, I'm Erken — the front desk here. Ask me anything about chartering the fleet.",
    widthRem: 17,
    paddingVw: 7,
    paddingVh: 7,
  },
  {
    text: "Questions about a charter? Ask me.",
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
function YachtHeader() {
  return (
    <header
      data-celly-avoid
      className="sticky top-0 z-50 w-full border-b border-border/60 bg-bg/85 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-8">
        <Link href="/" className="font-mono text-sm font-medium uppercase tracking-tight text-text">
          yacht<span className="text-accent"> </span>erken
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#services" className="text-sm text-text-muted transition-colors hover:text-text">
            Charters & courses
          </a>
          <a href="#journey" className="text-sm text-text-muted transition-colors hover:text-text">
            The charter day
          </a>
          <a href="#gear" className="text-sm text-text-muted transition-colors hover:text-text">
            Fleet & crew
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
            onClick={(e) => openYachtContact(e.currentTarget)}
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
/* CHARTERS & COURSES — the homepage "Built for your industry"         */
/* Apple-card carousel, cards = the marina's six offerings, each with  */
/* its own subject-matched stock photo.                                 */
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
          onClick={() => openYachtContact()}
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
    category: "Half-day or full-day · from $895",
    title: "Day Charter",
    photo: "/yacht-erken/day-charter-sailboat-sunset.jpg",
    story:
      "A licensed captain and crew take you out for a sunset sail or a full day on the water, up to 12 guests. No experience needed — you're a guest, not the crew, unless you want to be.",
    included: [
      "Licensed captain and crew included",
      "Fuel and basic beverages included",
      "Up to 12 guests",
      "Sunset, half-day, and full-day options",
      "Catering and water-toy add-ons available",
      "Confirmed with a deposit the same conversation",
    ],
    note: "Weekends and holidays book out weeks ahead in season — weekday charters often have same-week openings.",
  },
  {
    category: "3–7 nights",
    title: "Multi-Day Charter",
    photo: "/yacht-erken/multi-day-charter-tropical-yacht.jpg",
    story:
      "Crewed charters through the Keys or the Bahamas, fully provisioned with a captain and chef. You show up with a bag; the boat, the route, and the meals are handled.",
    included: [
      "3 to 7 night itineraries",
      "Captain and chef included",
      "Full provisioning arranged for you",
      "Keys or Bahamas routing",
      "Custom itinerary planning",
    ],
    note: "Most multi-day charters are quoted and deposited within a day of the first inquiry.",
  },
  {
    category: "Fastest path to your own boat",
    title: "ASA Sailing Courses",
    photo: "/yacht-erken/sailing-course-lesson.jpg",
    story:
      "Basic Keelboat through Coastal Navigation, taught aboard our training fleet by ASA-certified instructors. Most students feel ready to sail on their own by the end of the weekend.",
    included: [
      "Six ASA course levels available",
      "ASA-certified instructors",
      "Training fleet included in course fee",
      "Weekend and weekday course dates",
      "Certification recognized nationwide",
    ],
  },
  {
    category: "Sail without owning",
    title: "Boat Club Membership",
    photo: "/yacht-erken/boat-club-marina.jpg",
    story:
      "Unlimited access to a fleet of boats without the cost of ownership. Maintenance, docking, and insurance are all included — you just show up and cast off.",
    included: [
      "Unlimited fleet access",
      "Maintenance, docking, and insurance included",
      "No slip fees or haul-out costs",
      "Members-only booking calendar",
    ],
  },
  {
    category: "Full-boat buyouts",
    title: "Corporate & Event Charters",
    photo: "/yacht-erken/corporate-event-yacht-party.jpg",
    story:
      "Proposals, celebrations, and corporate team days. We block the boat for your group and coordinate catering through our team, so the day runs without you managing vendors.",
    included: [
      "Full-boat buyout for your group",
      "Custom catering coordination",
      "Scheduled around your event date",
      "Dedicated point of contact",
    ],
  },
  {
    category: "Certified sailors",
    title: "Captained Bareboat Add-On",
    photo: "/yacht-erken/captained-bareboat-helm.jpg",
    story:
      "Certified sailors can charter bareboat on their own certification, or add a licensed captain for local knowledge and peace of mind in unfamiliar waters.",
    included: [
      "Bareboat available to certified sailors",
      "Optional licensed captain add-on",
      "Local-waters knowledge on request",
      "Certification verified before departure",
    ],
  },
];

function YachtServicesCarousel() {
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
            onClick={(e) => openYachtContact(e.currentTarget)}
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
          <SectionKicker>Charters & courses</SectionKicker>
          <h2
            className="mt-3 text-3xl font-bold tracking-tight md:text-5xl"
            style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
          >
            From a sunset sail to your own captain&apos;s license.
          </h2>
          <p className="mt-4 text-base text-text-muted md:text-lg">
            Every card is a real offering at the marina — open one to see what&apos;s
            inside, what it costs, and how to book it.
          </p>
        </motion.div>
      </div>
      <div data-celly-avoid className="mt-4">
        <YachtServicesCarousel />
      </div>
    </section>
  );
}

/* ================================================================== */
/* THE CHARTER DAY — the homepage "How it runs" sticky-column section, */
/* phases = inquire to rebooked-next-season. Same flat icon-tile style, */
/* same sage/clay/cream palette as the rest of the erken.systems site   */
/* (this is the site's OWN accent tokens, not a per-industry brand      */
/* color — see globals.css --accent/--clay — matching the pilot's       */
/* approach). Icon tiles replace the pilot's hand-drawn path art (one   */
/* consistent visual language across every replicated industry).       */
/* Phases 2 and 5 are deliberate: research (vault Notes/problem-        */
/* solution.md) found beating broker response time with an instant      */
/* quote, and bringing past guests back directly, are the two genuine   */
/* charter-business pain points our stack actually solves.              */
/* ================================================================== */
const ILLO_SAGE = "#7ea687";
const ILLO_CLAY = "#a8503f";
const ILLO_CREAM = "#F5F1E8";
const ILLO_NEUTRAL = "#D4CDB8";

function IlloTile({
  Icon,
}: {
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number; color?: string }>;
}) {
  return (
    <div
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[28%] border"
      style={{ background: ILLO_CREAM, borderColor: ILLO_NEUTRAL }}
    >
      <Icon className="h-5 w-5" strokeWidth={2} color={ILLO_CLAY} />
    </div>
  );
}

const JOURNEY: {
  name: string;
  tagline: string;
  Illustration: () => React.ReactElement;
  items: string[];
}[] = [
  {
    name: "Inquire, any hour",
    tagline: "Answered 24/7, not just marina office hours",
    Illustration: () => <IlloTile Icon={Phone} />,
    items: [
      "Message or call — answered around the clock",
      "Date, guest count, and boat preference reviewed with you",
      "Text confirmation the moment you inquire",
      "First-timer questions answered before you commit",
    ],
  },
  {
    name: "Instant quote & deposit",
    tagline: "Quoted before the boat down the dock answers",
    Illustration: () => <IlloTile Icon={CalendarCheck} />,
    items: [
      "Live fleet availability checked in real time",
      "Quote delivered on the spot, not the next morning",
      "Deposit link sent the moment you confirm",
      "Your date is held the second the deposit clears",
    ],
  },
  {
    name: "Confirm and prep",
    tagline: "Dock details before you even leave home",
    Illustration: () => <IlloTile Icon={ShieldCheck} />,
    items: [
      "Dock slip and check-in time texted ahead",
      "Captain briefed on your itinerary in advance",
      "Catering or add-ons confirmed before boarding day",
      "Your captain knows your name at the dock",
    ],
  },
  {
    name: "Board and sail",
    tagline: "The rest is just enjoying the water",
    Illustration: () => <IlloTile Icon={Anchor} />,
    items: [
      "Safety briefing dockside before departure",
      "Captain and crew handle the boat",
      "Sunset, half-day, or full-day, as booked",
      "Fixed all-in pricing — no fuel surcharge surprise",
    ],
  },
  {
    name: "Return and rebook",
    tagline: "A review request goes out the same day, not weeks later",
    Illustration: () => <IlloTile Icon={Users} />,
    items: [
      "Debrief with your captain back at the dock",
      "A review request goes out same-day",
      "Past guests get reactivated next season automatically",
      "Rebook your next charter or a course on the spot",
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
              <SectionKicker>The charter day</SectionKicker>
              <h2
                className="mt-3 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
                style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
              >
                From the first message to back on the dock.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-text-muted md:text-lg">
                Every guest walks the same five stages — from the first
                inquiry to a debrief back at the dock. You always know what
                happens next, and you never wait overnight for a quote.
              </p>
              <p className="mt-3 text-base leading-relaxed text-text-muted md:text-lg">
                No broker commission, no chasing a review weeks later.
              </p>
              <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={(e) => openYachtContact(e.currentTarget)}
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
/* FLEET & CREW — the homepage "Your AI team" carousel mechanic,       */
/* cards = the boats and crew standing behind every charter. Same warm  */
/* wash, portrait cards, auto-rotate.                                   */
/* ================================================================== */

const GEAR: {
  title: string;
  spec: string;
  desc: string;
  photo: string;
}[] = [
  {
    title: "Charter Fleet",
    spec: "6 boats · sail & power · up to 12 guests",
    desc: "A six-boat fleet ranging from a sunset-sail sloop to a full crewed power yacht, all inspected and provisioned before every charter leaves the dock.",
    photo: "/yacht-erken/fleet-sailboats-bay.jpg",
  },
  {
    title: "USCG-Licensed Captains",
    spec: "Licensed on every crewed charter · local waters",
    desc: "Every crewed charter and multi-day trip runs with a USCG-licensed captain who knows these waters and briefs your itinerary before you step aboard.",
    photo: "/yacht-erken/captain-navigating-yacht.jpg",
  },
  {
    title: "ASA Training Fleet",
    spec: "Dedicated course boats · all six ASA levels",
    desc: "A separate training fleet built for instruction, not showing off — forgiving handling and a certified instructor aboard for every course level.",
    photo: "/yacht-erken/training-sailboat-keelboat.jpg",
  },
  {
    title: "Boat Club Fleet",
    spec: "Member-only hours · maintenance included",
    desc: "The same well-kept fleet, available to boat club members without the cost of ownership — maintenance, docking, and insurance handled for you.",
    photo: "/yacht-erken/club-fleet-marina-sunset.jpg",
  },
];

/** Flat glyph used as fallback when a fleet card has no photo — sail, captain, training, club. */
function GearGlyph({ variant }: { variant: number }) {
  if (variant === 0) {
    // sailboat
    return (
      <svg viewBox="0 0 200 120" className="h-24 w-full" aria-hidden>
        <path d="M30 86 L170 86 L150 96 L50 96 Z" fill={ILLO_SAGE} />
        <path d="M100 86 L100 20 L146 86 Z" fill={ILLO_SAGE} opacity="0.85" />
        <path d="M96 86 L96 30 L64 86 Z" fill={ILLO_SAGE} opacity="0.6" />
        <rect x="98" y="86" width="4" height="10" fill={ILLO_CLAY} />
      </svg>
    );
  }
  if (variant === 1) {
    // captain's wheel
    return (
      <svg viewBox="0 0 200 120" className="h-24 w-full" aria-hidden>
        <circle cx="100" cy="60" r="34" fill="none" stroke={ILLO_SAGE} strokeWidth="6" />
        <circle cx="100" cy="60" r="8" fill={ILLO_CLAY} />
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <line
            key={deg}
            x1={100 + 8 * Math.cos((deg * Math.PI) / 180)}
            y1={60 + 8 * Math.sin((deg * Math.PI) / 180)}
            x2={100 + 40 * Math.cos((deg * Math.PI) / 180)}
            y2={60 + 40 * Math.sin((deg * Math.PI) / 180)}
            stroke={ILLO_CLAY}
            strokeWidth="4"
            strokeLinecap="round"
          />
        ))}
      </svg>
    );
  }
  if (variant === 2) {
    // graduation-style course pennant
    return (
      <svg viewBox="0 0 200 120" className="h-24 w-full" aria-hidden>
        <path d="M60 30 V96" stroke={ILLO_SAGE} strokeWidth="4" strokeLinecap="round" />
        <path d="M60 32 L140 46 L60 60 Z" fill={ILLO_CLAY} />
      </svg>
    );
  }
  // club membership card
  return (
    <svg viewBox="0 0 200 120" className="h-24 w-full" aria-hidden>
      <rect x="46" y="34" width="108" height="52" rx="8" fill="none" stroke={ILLO_SAGE} strokeWidth="5" />
      <circle cx="72" cy="60" r="10" fill={ILLO_CLAY} />
      <path d="M96 52 h44 M96 68 h30" stroke={ILLO_CLAY} strokeWidth="4" strokeLinecap="round" />
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
            <SectionKicker>Fleet & crew</SectionKicker>
            <h2
              className="mt-2 text-2xl font-bold tracking-tight md:text-3xl"
              style={{ letterSpacing: "-0.02em", lineHeight: 1.15 }}
            >
              Six boats, licensed captains, one marina.
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
            Every boat is inspected before it leaves the dock, every crewed
            charter runs with a licensed captain, and the fleet calendar
            shows real availability, not a guess.
          </motion.p>
        </div>

        <div data-celly-avoid className="mt-8">
          <GearCarousel />
        </div>

        <p data-celly-avoid className="mt-8 text-center text-sm text-text-muted">
          Boat club members get the same fleet, <b className="text-text">maintenance and insurance included</b> —
          no cost of ownership.
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
    label: "Day Charter",
    price: "from $895",
    note: "half or full day · up to 12 guests",
    badge: "Start here",
    badgeSolid: true,
    features: [
      "Licensed captain and crew included",
      "Fuel and basic beverages included",
      "Sunset, half-day, and full-day options",
      "Confirmed with a deposit the same day",
      "Catering add-ons available",
      "Quoted instantly, any hour",
    ],
  },
  {
    label: "ASA Sailing Courses",
    price: "from $595",
    note: "six levels · training fleet included",
    features: [
      "Basic Keelboat through Coastal Navigation",
      "ASA-certified instructors",
      "Training fleet included in course fee",
      "Weekend and weekday dates",
      "Certification recognized nationwide",
      "Most students sail solo by weekend's end",
    ],
  },
  {
    label: "Corporate & Event Charters",
    price: "custom quote",
    note: "full-boat buyout · your event date",
    badge: "Full-boat buyout",
    features: [
      "Dedicated boat for your group",
      "Custom catering coordination",
      "Scheduled around your event date",
      "Dedicated point of contact",
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
            Start at $895. Know every cost before you board.
          </h2>
          <p className="mt-4 text-base text-text-muted md:text-lg">
            All-in charter pricing, no fuel surcharge surprises at
            check-in — and no 15-20% broker commission baked into the quote.
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
          <SectionKicker>Get a quote</SectionKicker>
          <h2
            className="mt-3 text-2xl font-bold tracking-tight md:text-4xl"
            style={{ letterSpacing: "-0.02em", lineHeight: 1.15 }}
          >
            Pick a real time on our fleet calendar.
          </h2>
          <p className="mt-3 text-base text-text-muted">
            Grab an open slot and you&apos;re confirmed instantly — you&apos;ll get
            a text and email with dock details and check-in time.
            Prefer to talk first? The voice assistant books the same
            calendar.
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
                onClick={() => openYachtContact()}
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
            {/* form_embed.js (loaded above, and also needed by the callback
                modal) is an iframe-resizer: it rewrites this iframe's INLINE
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
                title="Book a charter"
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
/* ONE MARINA — the homepage "replace your whole stack" table           */
/* mechanic, repurposed: everything a charter guest usually juggles     */
/* across providers lives under one roof at Bahia Mar, fused with the   */
/* Fort Lauderdale advantage strip.                                     */
/* ================================================================== */

const ROOF_ROWS: { cat: string; elsewhere: string }[] = [
  { cat: "Day & multi-day charters", elsewhere: "A broker taking 15-20% off the top" },
  { cat: "Instant quotes", elsewhere: "An overnight wait while a rival marina answers first" },
  { cat: "ASA sailing courses", elsewhere: "A separate school, a separate booking system" },
  { cat: "Boat club membership", elsewhere: "Buying a boat you'll use six weekends a year" },
  { cat: "Past-guest reactivation", elsewhere: "A guest who never hears from you again" },
  { cat: "Front desk & deposits", elsewhere: "Voicemail and phone tag" },
];

const FTL_POINTS = [
  "Direct booking, no broker commission",
  "Instant quotes, any hour",
  "Your captain answers the phone",
];

function DesertSection() {
  return (
    <section id="one-marina" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <motion.div
          data-celly-avoid
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease }}
          className="max-w-2xl"
        >
          <SectionKicker>One marina</SectionKicker>
          <h2
            className="mt-3 text-3xl font-bold tracking-tight md:text-5xl"
            style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
          >
            Everything under one roof.
          </h2>
          <p className="mt-4 text-base text-text-muted md:text-lg">
            Charters, courses, the boat club, and reviews — one marina at
            Bahia Mar, one calendar, one team that knows your name.
          </p>
        </motion.div>

        {/* Fort Lauderdale advantage strip */}
        <div data-celly-avoid className="mt-8 flex flex-wrap gap-3">
          {FTL_POINTS.map((p) => (
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
              At Erken Yacht
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
                A broker, a commission, a wait
              </div>
              <div className="text-[11px] text-text-dim">and nobody tracking the whole picture</div>
            </div>
            <div className="flex flex-col items-center justify-center border-t-2 border-white/25 bg-accent py-5 text-white">
              <div className="text-2xl font-bold tracking-tight" style={{ letterSpacing: "-0.02em" }}>
                One roof
              </div>
              <div className="text-[11px] font-medium text-white/85">at Bahia Mar Marina</div>
            </div>
          </div>
          {/* Overhang — accent column extends past the table, CTA inside. */}
          <div className="absolute right-0 top-full w-[170px] rounded-b-2xl bg-accent px-3 pb-4 pt-3 text-center shadow-[0_18px_40px_-16px_rgba(126,166,135,0.85)]">
            <button
              type="button"
              onClick={scrollToBooking}
              className="inline-flex w-full items-center justify-center gap-1 rounded-lg bg-white px-3 py-2.5 text-xs font-semibold text-accent shadow-sm transition-transform hover:scale-[1.02]"
            >
              Get a quote →
            </button>
            <div className="mt-1.5 text-[11px] text-white/90">from $895 · day charters</div>
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
              Charters, courses, the boat club, and reviews — all at Bahia
              Mar Marina.
            </div>
            <button
              type="button"
              onClick={scrollToBooking}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-accent shadow-sm transition-transform hover:scale-[1.02]"
            >
              Get your charter quote →
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
            Fleet availability, deposits, what happens if weather cancels —
            ask anything. The front desk answers around the clock, even when
            every captain is out on the water.
          </p>
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={(e) => openYachtContact(e.currentTarget)}
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

/* ---- Demo attribution — one quiet line (the charter company is fictional). ---- */
function DemoNote() {
  return (
    <div className="pb-8 pt-4 text-center">
      <p className="px-6 text-xs text-text-dim">
        Erken Yacht Charters is a fictional charter company — this site is a
        live demo built by{" "}
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
/* HomeV8Client, with the skydiving sections inside.                   */
/* ================================================================== */
export default function YachtErkenClient() {
  const spriteContainerRef = useRef<HTMLDivElement>(null);
  const bubbleContainerRef = useRef<HTMLDivElement>(null);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  // Celly's Text/Voice menu (voice = the Erken Yacht front-desk agent).
  const [choiceMenu, setChoiceMenu] = useState<{ x: number; y: number } | null>(null);
  const closeChoiceMenu = () => setChoiceMenu(null);
  const openChoiceMenu = (anchorEl?: HTMLElement | null) => {
    // Both Celly's click-menu and the "Talk to us now" chooser below offer
    // "Request a callback" — prewarm the GHL iframe the moment either menu
    // opens (not only on the actual callback click) so by the time the
    // visitor picks it, the form has usually already loaded and the modal
    // opens at its final size instead of visibly resizing (owner fix,
    // 2026-07-30 — see CallbackModal.tsx's prewarm machinery).
    window.__prewarmDemoCallbackModal?.();
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
      // Same prewarm as Celly's click-menu (see openChoiceMenu above) — this
      // chooser also offers "Request a callback".
      window.__prewarmDemoCallbackModal?.();
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
    {/* --d-* theme vars for the reused demo components (DemoVoiceWidget +
        CallbackModal), mapped to this site's own cream/sage palette
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
    <YachtHeader />
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
      {/* 1. HERO — yacht photo + Contact-us-now chooser. */}
      <HeroSection isMobile={isMobile} />

      {/* 2. CHARTERS & COURSES — the industry-carousel mechanic. */}
      <ServicesSection />

      {/* 3. THE CHARTER DAY — sticky-column phase panels. */}
      <JourneySection />

      {/* 4. FLEET & CREW — the AI-team carousel mechanic. */}
      <GearSection />

      {/* 5. PRICING + the real GHL booking calendar right below. */}
      <PricingSection />
      <BookingSection />

      {/* 6. ONE MARINA — the stack-table mechanic + FTL advantage. */}
      <DesertSection />

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
    {/* Voice widget = the DEMO variant: every call carries the Erken Yacht
        Charters dynamic variables so the Retell agent answers as this
        marina's front desk. CallbackModal = the GHL "Request a Callback"
        form. */}
    <DemoVoiceWidget config={YACHT} />
    <CallbackModal config={YACHT} />

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

    {/* Contact-us-now chooser — voice / text chat / request a callback. */}
    {contactMenu && (
      <>
        {/* z-index sits above the apple-cards Card modal (z-[200]/[210]) so
            "Talk to us now" from an OPEN service card layers the chooser
            over the still-open card instead of closing it (owner fix,
            2026-07-30). */}
        <div className="fixed inset-0 z-[215] bg-black/20" aria-hidden onClick={() => setContactMenu(null)} />
        <div
          role="menu"
          aria-label="Contact Erken Yacht"
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
            <span className="text-xs text-white/55">Contact Erken Yacht</span>
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
