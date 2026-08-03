"use client";

/**
 * CafeErkenClient — a CLONE of the live homepage (home-v8-draft/HomeV8Client),
 * following the exact same pattern as /sky-erken (the approved pilot) and
 * /fly-erken, with every section's content repurposed for Café Erken, a
 * fictional chef-owned restaurant + catering business in Phoenix, AZ
 * (REPLICATION build, 2026-08-03 — reachable as the cafe.erken.systems root;
 * the older black-and-orange /demo/cafe page stays reachable directly at
 * /demo/cafe).
 *
 * Inherited verbatim from the homepage (via sky-erken) so every live effect
 * survives:
 *   - SphereScrollStage (Three.js cell-dragon canvas + dust)
 *   - The roaming Celly overlay: findEmptySpot auto-positioner, scroll-driven
 *     dragon-draw, on-stop fly-to-empty-spot, click-to-chat menu, chat-dock
 *     pin, the gooey cloud speech bubble.
 *   - Section / header / carousel / pricing-card / comparison-table patterns.
 *
 * What changed (mirroring sky-erken's section-by-section mapping):
 *   1. Hero: "Talk to us now" (voice / text chat / callback chooser); hero
 *      visual = the existing repo restaurant photo (no new stock footage
 *      sourced for this replication).
 *   2. Industries carousel → the restaurant's services carousel (6 real
 *      services pulled from the existing src/app/demo/configs/cafe.ts
 *      registry).
 *   3. "How it runs" → THE RESERVATION & EVENT DAY (book → deposit/reminder
 *      → order direct → dine → review), same sticky-column + phase-panel
 *      mechanic. This section carries the four real differentiators research
 *      found for restaurants (see vault Notes/problem-solution.md): the
 *      phone answered during dinner rush, automatic deposits/reminders that
 *      fight no-shows, direct online ordering instead of delivery-app
 *      commissions, and a same-visit review request.
 *   4. "Your AI team" carousel → THE KITCHEN & DINING ROOM carousel.
 *   5. Pricing cards → real price tiers; "Reserve now" scrolls to the
 *      embedded GHL booking calendar.
 *   6. Stack-comparison table → "ONE RESTAURANT" fused with a Phoenix
 *      advantage strip.
 *   7. Custom solutions → "Still have questions?" with the same contact
 *      chooser.
 *   8. Erken bot comes along: text chat = the same GHL widget; VOICE calls
 *      go through DemoVoiceWidget so Retell receives the Café Erken dynamic
 *      variables and answers as the restaurant's front desk.
 *
 * DEMO DISCLAIMER: Café Erken is fictional; all prices/stats are invented.
 */

import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Phone,
  X,
  Coffee,
  Users,
  CalendarCheck,
  Clock,
  ShieldCheck,
  Map,
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

// The cafe demo registry entry — source of truth for the business facts +
// the Retell dynamic variables (demo_business / demo_industry / demo_context)
// the voice agent needs to answer in character.
const CAFE = getDemoConfig("cafe")!;
const PHONE_TEL = "+13252414488";
const PHONE_DISPLAY = CAFE.business.phoneDisplay; // (325) 241-4488
// NOTE (flag for Shamil's review): cafe.ts reuses the SAME shared demo GHL
// calendar as flight-schools/skydiving (SS2V1nuWEIbOlNrzyxpt) — there is no
// dedicated Café Erken calendar yet. Fine for a pilot click-through, but a
// real per-industry calendar (or at least a distinct one) should probably
// exist before this pattern is replicated further.
const BOOKING_CALENDAR_ID = CAFE.booking.calendarId!;

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
/* trigger the single instance living in CafeErkenClient.               */
/* ================================================================== */

const CONTACT_EVENT = "cafe-erken:contact";

export function openCafeContact(anchorEl?: HTMLElement | null) {
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
/* sourced for this replication). A quiet Ken-Burns scale-in gives it   */
/* some life without looping motion (design-system rule: no infinite    */
/* breathing/looping decoration).                                       */
/* ================================================================== */
const HERO_IMAGE = "/industries/card-restaurant-photo.jpg";

function CafeHeroImage() {
  return (
    <div className="relative w-full max-w-[40rem] overflow-hidden rounded-2xl bg-black shadow-2xl aspect-video">
      <motion.img
        src={HERO_IMAGE}
        alt="Dining room interior at Café Erken during dinner service"
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
  kicker: "Café Erken",
  headline: "Never lose a reservation call during the dinner rush.",
  body: "Dinner reservations, private events, and off-site catering out of a chef-owned dining room on 7th Avenue in Phoenix. The AI front desk answers every call — even when the host stand is slammed on a Friday — and a catering pipeline that actually gets answered instead of left on voicemail.",
  priceTease: "Reservations are always free to book. Private buyouts start at $2,500.",
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
            onClick={(e) => openCafeContact(e.currentTarget)}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-medium text-bg transition-all hover:bg-accent-hover"
          >
            Talk to us now →
          </button>
          <a
            href="#services"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-medium text-text transition-all hover:border-border-strong hover:bg-surface"
          >
            Reservations & events
          </a>
        </div>
      </div>
      {/* Media — same right-anchored wrapper the homepage hero uses. */}
      {isMobile ? (
        <div data-celly-avoid className="mt-10 w-full">
          <CafeHeroImage />
        </div>
      ) : (
        <div
          data-celly-avoid
          className="absolute inset-y-[8vh] right-[4vw] left-[48vw] 2xl:left-auto 2xl:w-[50%] hidden md:flex items-center justify-center pointer-events-auto"
        >
          <CafeHeroImage />
        </div>
      )}
    </section>
  );
}

/* ================================================================== */
/* Celly bubble copy — restaurant front-desk voice.                     */
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
      "Hi, I'm Erken — Café Erken's front desk. I can answer anything about dinner reservations, private events, or catering, and book you in. Ask away.",
    widthRem: 22,
    paddingVw: 9,
    paddingVh: 11,
  },
  {
    text: "Hi, I'm Erken — the front desk here. Ask me anything about booking a table.",
    widthRem: 17,
    paddingVw: 7,
    paddingVh: 7,
  },
  {
    text: "Questions about dinner or catering? Ask me.",
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
function CafeHeader() {
  return (
    <header
      data-celly-avoid
      className="sticky top-0 z-50 w-full border-b border-border/60 bg-bg/85 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-8">
        <a href="/" className="font-mono text-sm font-medium uppercase tracking-tight text-text">
          cafe<span className="text-accent"> </span>erken
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#services" className="text-sm text-text-muted transition-colors hover:text-text">
            Reservations & events
          </a>
          <a href="#journey" className="text-sm text-text-muted transition-colors hover:text-text">
            The reservation day
          </a>
          <a href="#kitchen" className="text-sm text-text-muted transition-colors hover:text-text">
            Kitchen & dining room
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
            onClick={(e) => openCafeContact(e.currentTarget)}
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
/* SERVICES — the homepage "Built for your industry" Apple-card         */
/* carousel, cards = the restaurant's six services. Icon tiles instead  */
/* of per-card photos (we only have one restaurant stock photo in the   */
/* repo — reusing it six times would look broken, so each card gets a   */
/* flat icon tile matching its config icon, same visual language as the */
/* JOURNEY illustrations below).                                        */
/* ================================================================== */

const SERVICE_ICONS: Record<
  string,
  React.ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  coffee: Coffee,
  users: Users,
  calendar: CalendarCheck,
  clock: Clock,
  shield: ShieldCheck,
  map: Map,
};

function ServiceIconTile({ icon }: { icon: string }) {
  const Icon = SERVICE_ICONS[icon] ?? Coffee;
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        background:
          "radial-gradient(120% 120% at 30% 20%, var(--accent-soft), transparent 60%), var(--surface-2)",
      }}
    >
      <Icon className="h-16 w-16 text-accent" strokeWidth={1.5} />
    </div>
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
          onClick={() => openCafeContact()}
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
    category: "Nightly · no fee",
    title: "Dinner Reservations",
    icon: "coffee",
    story:
      "A seasonal dinner menu, held tables, and a waitlist that texts you the moment your spot opens — booked online or over the phone, answered even when the host stand is slammed on a Friday.",
    included: [
      "Real-time table availability",
      "Waitlist that texts when a table opens",
      "Answered by phone even during dinner rush",
      "Held tables honored to the confirmed time",
      "Text and email confirmation instantly",
      "Special-occasion notes passed straight to the kitchen",
    ],
    note: "No fee to book a table — walk-ins are always welcome too, waitlist permitting.",
  },
  {
    category: "From $2,500",
    title: "Private Events & Buyouts",
    icon: "users",
    story:
      "Full or partial restaurant buyouts for rehearsal dinners, birthdays, and corporate events. Tell us the headcount and the date, and our events lead builds a custom menu around your budget.",
    included: [
      "Full or partial restaurant buyout",
      "Custom menu built to your budget",
      "Dedicated events lead, one point of contact",
      "Quote turned around within one business day",
      "Deposit secures your date on the calendar",
      "AV and floor-plan options for corporate events",
    ],
    note: "A deposit locks your date; it's applied straight to your final invoice.",
  },
  {
    category: "From $65/person",
    title: "Off-Site Catering",
    icon: "calendar",
    story:
      "Full-service catering for weddings and corporate events, scaled from a plated sit-down dinner to a passed-appetizer reception — the same kitchen that runs dinner service, just wherever you need it.",
    included: [
      "Plated dinner or passed-appetizer service",
      "Staffing and equipment included",
      "Menus scaled from small to large events",
      "Dietary accommodations built in on request",
      "Quote and tasting scheduled before you commit",
    ],
  },
  {
    category: "From $500 minimum",
    title: "Private Dining Room",
    icon: "clock",
    story:
      "A semi-private room seating up to 20 for a smaller celebration that doesn't need a full buyout — same kitchen, same service, a door that closes when you want it to.",
    included: [
      "Seats up to 20 guests",
      "$500 food and beverage minimum",
      "Private from the main dining room",
      "Available without a full-restaurant buyout",
      "Custom menu options on request",
    ],
  },
  {
    category: "Group deposits",
    title: "Gift Cards & Group Deposits",
    icon: "shield",
    story:
      "Digital gift cards for any occasion, and group deposit handling for large parties collected upfront — so a no-show on a table for ten doesn't cost the kitchen a wasted service.",
    included: [
      "Digital gift cards, any amount",
      "Deposit collection for large-party reservations",
      "Automatic reminders before the reservation date",
      "Deposit applied to the final check",
    ],
  },
  {
    category: "$120/person · monthly",
    title: "Wine Dinners & Tasting Events",
    icon: "map",
    story:
      "Monthly seated wine-pairing dinners with a guest sommelier, limited to 30 seats — a standing event our regulars book out before it's publicly announced.",
    included: [
      "Guest sommelier each month",
      "Seated, multi-course pairing menu",
      "Limited to 30 seats",
      "Regulars notified before public booking opens",
    ],
  },
];

function CafeServicesCarousel() {
  const items = SERVICES.map((s, i) => (
    <Card
      key={s.title}
      index={i}
      card={{
        src: HERO_IMAGE,
        title: s.title,
        category: s.category,
        visual: <ServiceIconTile icon={s.icon} />,
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
            onClick={(e) => openCafeContact(e.currentTarget)}
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
          <SectionKicker>Dine & celebrate</SectionKicker>
          <h2
            className="mt-3 text-3xl font-bold tracking-tight md:text-5xl"
            style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
          >
            From a Tuesday dinner to a full private buyout.
          </h2>
          <p className="mt-4 text-base text-text-muted md:text-lg">
            Every card is a real service at the restaurant — open one to see
            what&apos;s inside, what it costs, and how to book it.
          </p>
        </motion.div>
      </div>
      <div data-celly-avoid className="mt-4">
        <CafeServicesCarousel />
      </div>
    </section>
  );
}

/* ================================================================== */
/* THE RESERVATION & EVENT DAY — the homepage "How it runs" sticky-    */
/* column section, phases = book to reviewed. Same flat-SVG icon style, */
/* same sage/clay/cream palette as the rest of the erken.systems site   */
/* (this is the site's OWN accent tokens, not a per-industry brand      */
/* color — see globals.css --accent/--clay — matching sky-erken's       */
/* approach). Phases 1, 2, 3, and 5 are deliberate: research (vault     */
/* Notes/problem-solution.md) found the phone going unanswered during   */
/* rush, no-show-prone big-party bookings, delivery-app commission      */
/* bleed, and slow review requests are the genuine restaurant pain      */
/* points our stack actually solves.                                    */
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

/** BOOK TABLE — a calendar with a fork/knife mark. */
function IlloBookTable() {
  return (
    <IllustrationBackdrop>
      <rect x="26" y="30" width="68" height="58" rx="8" fill="#FFFFFF" stroke={ILLO_NEUTRAL} strokeWidth="2" />
      <rect x="26" y="30" width="68" height="16" rx="8" fill={ILLO_SAGE} />
      <rect x="36" y="24" width="6" height="12" rx="3" fill={ILLO_CLAY} />
      <rect x="78" y="24" width="6" height="12" rx="3" fill={ILLO_CLAY} />
      {/* tiny fork+knife mark on the grid, standing in for the reserved table */}
      <path d="M52 56 v20 M52 56 q-4 0 -4 6 M52 56 q4 0 4 6" stroke={ILLO_CLAY} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M68 56 v20 M68 56 q6 4 0 10" stroke={ILLO_CLAY} strokeWidth="2" fill="none" strokeLinecap="round" />
    </IllustrationBackdrop>
  );
}

/** DEPOSIT & REMINDER — a bell with a dollar badge. */
function IlloDepositReminder() {
  return (
    <IllustrationBackdrop>
      <path
        d="M60 30 a16 16 0 0 1 16 16 v10 l6 10 h-44 l6 -10 v-10 a16 16 0 0 1 16 -16 Z"
        fill={ILLO_NEUTRAL}
      />
      <path d="M52 76 a8 8 0 0 0 16 0" fill="none" stroke={ILLO_SAGE} strokeWidth="3" strokeLinecap="round" />
      <circle cx="84" cy="36" r="14" fill={ILLO_CLAY} />
      <path d="M84 29 v14 M80 32 h8 M80 40 h8" stroke={ILLO_CREAM} strokeWidth="2" strokeLinecap="round" />
    </IllustrationBackdrop>
  );
}

/** DIRECT ORDER — a takeout bag with a crossed-out commission mark. */
function IlloDirectOrder() {
  return (
    <IllustrationBackdrop>
      <path d="M40 50 h40 l-4 38 a6 6 0 0 1 -6 5 h-20 a6 6 0 0 1 -6 -5 Z" fill={ILLO_SAGE} />
      <path d="M48 50 v-8 a12 12 0 0 1 24 0 v8" fill="none" stroke={ILLO_CLAY} strokeWidth="3" />
      <circle cx="78" cy="30" r="12" fill="none" stroke={ILLO_CLAY} strokeWidth="3" />
      <path d="M70 22 L86 38" stroke={ILLO_CLAY} strokeWidth="3" strokeLinecap="round" />
    </IllustrationBackdrop>
  );
}

/** DINE — a plate with fork and knife. */
function IlloDineServed() {
  return (
    <IllustrationBackdrop>
      <circle cx="60" cy="62" r="26" fill="#FFFFFF" stroke={ILLO_NEUTRAL} strokeWidth="2" />
      <circle cx="60" cy="62" r="16" fill={ILLO_SAGE} opacity="0.5" />
      <path d="M34 46 v20 M34 46 q-4 0 -4 6 M34 46 q4 0 4 6" stroke={ILLO_CLAY} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M86 46 v34" stroke={ILLO_CLAY} strokeWidth="2" strokeLinecap="round" />
    </IllustrationBackdrop>
  );
}

/** REVIEW REQUEST — a phone with a 5-star rating above. */
function IlloReviewRequest() {
  return (
    <IllustrationBackdrop>
      <path d="M30 88 h60" stroke={ILLO_NEUTRAL} strokeWidth="4" strokeLinecap="round" />
      <rect x="46" y="62" width="10" height="26" rx="2" fill={ILLO_CLAY} />
      <rect x="64" y="70" width="10" height="18" rx="2" fill={ILLO_CLAY} opacity="0.85" />
      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={i}
          transform={`translate(${34 + i * 13} 30) scale(0.9)`}
          d="M6 0 L7.8 4.2 L12.4 4.4 L8.8 7.4 L10 12 L6 9.4 L2 12 L3.2 7.4 L-0.4 4.4 L4.2 4.2 Z"
          fill={ILLO_SAGE}
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
    name: "Book your table or event",
    tagline: "Answered on the busiest night, not just office hours",
    Illustration: IlloBookTable,
    items: [
      "Book online or call — answered even during dinner rush",
      "Party size and date confirmed on the spot",
      "Text confirmation with your reservation time",
      "Catering and private-event inquiries routed to our events lead",
    ],
  },
  {
    name: "Confirm with a deposit",
    tagline: "No-shows don't cost the kitchen",
    Illustration: IlloDepositReminder,
    items: [
      "Automatic reminder text before larger-party reservations",
      "Deposit collected upfront for events and big tables",
      "Deposit applied straight to your final invoice",
      "No calling to chase a confirmation the night before",
    ],
  },
  {
    name: "Order directly for takeout",
    tagline: "Skip the delivery-app cut",
    Illustration: IlloDirectOrder,
    items: [
      "Order online directly from our own menu",
      "No 20-30% commission padding the price",
      "Same kitchen, same food, lower cost to you",
      "Pickup time texted the moment it's ready",
    ],
  },
  {
    name: "Dinner is served",
    tagline: "The chef who owns the place is in the kitchen",
    Illustration: IlloDineServed,
    items: [
      "Seasonal menu, plated by the chef-owner's kitchen",
      "Your table or event runs on the time you booked",
      "Dietary notes passed straight to the line",
      "Front desk still answering calls while you dine",
    ],
  },
  {
    name: "Leave a review, come back sooner",
    tagline: "While the meal is still fresh",
    Illustration: IlloReviewRequest,
    items: [
      "Review request goes out the same night, not weeks later",
      "Regulars get a win-back message before they quietly stop coming in",
      "Rebook your next reservation or start a catering quote on the spot",
      "Every review read by the chef, not a corporate inbox",
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
              <SectionKicker>The reservation & event day</SectionKicker>
              <h2
                className="mt-3 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
                style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
              >
                From booking to a review the same night.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-text-muted md:text-lg">
                Every reservation and event walks the same five stages — from
                the first booking to a review request while the meal is still
                fresh. You always know what happens next, especially on the
                nights the dining room is slammed.
              </p>
              <p className="mt-3 text-base leading-relaxed text-text-muted md:text-lg">
                No voicemail during the rush, no chasing a deposit the night
                before, no delivery-app commission eating the margin.
              </p>
              <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={(e) => openCafeContact(e.currentTarget)}
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
/* THE KITCHEN & DINING ROOM — the homepage "Your AI team" carousel     */
/* mechanic, cards = the restaurant's spaces and capabilities. Same     */
/* warm wash, portrait cards, auto-rotate.                              */
/* ================================================================== */

const KITCHEN: {
  title: string;
  spec: string;
  desc: string;
}[] = [
  {
    title: "The Dining Room",
    spec: "68 seats · nightly dinner service",
    desc: "The main room where nightly reservations run — real-time availability, a waitlist that texts you, and a seasonal menu that changes with what's fresh.",
  },
  {
    title: "Private Event Space",
    spec: "Seats up to 20 · semi-private",
    desc: "A door that closes when you want it to, without booking a full buyout — built for rehearsal dinners, birthdays, and smaller corporate gatherings.",
  },
  {
    title: "The Catering Kitchen",
    spec: "Full-service · on- or off-site",
    desc: "The same kitchen that runs dinner service scales up for weddings and corporate events, from a plated sit-down dinner to a passed-appetizer reception.",
  },
  {
    title: "The Bar",
    spec: "Wine pairings · monthly tasting nights",
    desc: "A guest sommelier hosts a seated wine-pairing dinner every month, limited to 30 seats — booked out by regulars before it's publicly announced.",
  },
];

/** Flat glyph used for each kitchen/dining-room card visual. */
function KitchenGlyph({ variant }: { variant: number }) {
  if (variant === 0) {
    // round table with four chair marks
    return (
      <svg viewBox="0 0 200 120" className="h-24 w-full" aria-hidden>
        <circle cx="100" cy="60" r="30" fill={ILLO_SAGE} />
        <circle cx="100" cy="60" r="18" fill={ILLO_CREAM} />
        <rect x="40" y="53" width="14" height="14" rx="3" fill={ILLO_CLAY} />
        <rect x="146" y="53" width="14" height="14" rx="3" fill={ILLO_CLAY} />
        <rect x="93" y="14" width="14" height="14" rx="3" fill={ILLO_CLAY} />
        <rect x="93" y="92" width="14" height="14" rx="3" fill={ILLO_CLAY} />
      </svg>
    );
  }
  if (variant === 1) {
    // private-room door outline
    return (
      <svg viewBox="0 0 200 120" className="h-24 w-full" aria-hidden>
        <rect x="60" y="20" width="80" height="86" rx="6" fill="none" stroke={ILLO_SAGE} strokeWidth="5" />
        <circle cx="128" cy="64" r="4" fill={ILLO_CLAY} />
        <path d="M60 20 L40 30 L40 96 L60 106" fill="none" stroke={ILLO_CLAY} strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }
  if (variant === 2) {
    // catering pot with steam
    return (
      <svg viewBox="0 0 200 120" className="h-24 w-full" aria-hidden>
        <path d="M60 66 h80 v28 a10 10 0 0 1 -10 10 h-60 a10 10 0 0 1 -10 -10 Z" fill={ILLO_SAGE} />
        <rect x="50" y="58" width="100" height="12" rx="6" fill={ILLO_CLAY} />
        <path d="M90 50 q0 -14 10 -14 q10 0 10 14" stroke={ILLO_CLAY} strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
    );
  }
  // wine glass
  return (
    <svg viewBox="0 0 200 120" className="h-24 w-full" aria-hidden>
      <path d="M84 26 h32 l-10 34 a6 6 0 0 1 -12 0 Z" fill={ILLO_CLAY} />
      <rect x="98" y="60" width="4" height="24" fill={ILLO_CLAY} />
      <rect x="82" y="84" width="36" height="6" rx="3" fill={ILLO_SAGE} />
    </svg>
  );
}

function KitchenCarousel() {
  const n = KITCHEN.length;
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
        {KITCHEN.map((card, i) => {
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
                  <KitchenGlyph variant={i} />
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
        {KITCHEN.map((c, i) => (
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

function KitchenSection() {
  return (
    <section
      id="kitchen"
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
            <SectionKicker>Kitchen & dining room</SectionKicker>
            <h2
              className="mt-2 text-2xl font-bold tracking-tight md:text-3xl"
              style={{ letterSpacing: "-0.02em", lineHeight: 1.15 }}
            >
              The rooms and the kitchen behind every service.
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
            The chef-owner runs the same kitchen for dinner service, private
            events, and off-site catering — the room just changes.
          </motion.p>
        </div>

        <div data-celly-avoid className="mt-8">
          <KitchenCarousel />
        </div>

        <p data-celly-avoid className="mt-8 text-center text-sm text-text-muted">
          Ask for the <b className="text-text">private dining room or a full buyout</b> —
          same-week availability most weeks.
        </p>
      </div>
    </section>
  );
}

/* ================================================================== */
/* PRICING — the homepage /start-style plan cards, tiers = the         */
/* restaurant's real services. "Book now" scrolls to the booking       */
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
    label: "Dinner Reservation",
    price: "no fee",
    note: "any night · seats up to 68",
    badge: "Start here",
    badgeSolid: true,
    features: [
      "Real-time table availability",
      "Waitlist that texts when a table opens",
      "Answered by phone even during dinner rush",
      "Special-occasion notes passed to the kitchen",
      "Confirmed instantly online",
    ],
  },
  {
    label: "Private Events & Buyouts",
    price: "from $2,500",
    note: "full or partial buyout · custom menu",
    features: [
      "Full or partial restaurant buyout",
      "Custom menu built to your budget",
      "Dedicated events lead, one point of contact",
      "Quote turned around within one business day",
      "Deposit secures your date on the calendar",
    ],
  },
  {
    label: "Off-Site Catering",
    price: "from $65/person",
    note: "weddings & corporate events",
    badge: "Weddings & corporate",
    features: [
      "Plated dinner or passed-appetizer service",
      "Staffing and equipment included",
      "Menus scaled from small to large events",
      "Dietary accommodations built in on request",
      "Tasting scheduled before you commit",
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
            Free to book a table. Know every cost up front.
          </h2>
          <p className="mt-4 text-base text-text-muted md:text-lg">
            No fee for a dinner reservation, a clear quote for events and
            catering — and a deposit that only ever counts toward your bill.
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
          <SectionKicker>Reserve a table</SectionKicker>
          <h2
            className="mt-3 text-2xl font-bold tracking-tight md:text-4xl"
            style={{ letterSpacing: "-0.02em", lineHeight: 1.15 }}
          >
            Pick a real time on our calendar.
          </h2>
          <p className="mt-3 text-base text-text-muted">
            Grab an open slot and you&apos;re confirmed instantly — you&apos;ll get
            a text and email confirmation. Prefer to talk first? The voice
            assistant books the same calendar.
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
                onClick={() => openCafeContact()}
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
                outranks inline styles — this pins the height for good. */}
            <style>{`
              #booking-${BOOKING_CALENDAR_ID} { height: 880px !important; }
              @media (min-width: 768px) {
                #booking-${BOOKING_CALENDAR_ID} { height: 900px !important; }
              }
            `}</style>
            <div className="relative mx-auto h-[924px] w-[315px] md:h-[1265px] md:w-[645px]">
              <iframe
                src={`https://api.leadconnectorhq.com/widget/booking/${BOOKING_CALENDAR_ID}`}
                className="absolute inset-x-0 top-0 mx-auto h-[880px] w-[300px] origin-top scale-[1.05] rounded-2xl border-0 md:h-[900px] md:w-[460px] md:scale-[1.4]"
                style={{ background: "#F5F1E8" }}
                id={`booking-${BOOKING_CALENDAR_ID}`}
                scrolling="no"
                title="Reserve a table at Café Erken"
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
/* ONE RESTAURANT — the homepage "replace your whole stack" table       */
/* mechanic, repurposed: everything a restaurant usually juggles across */
/* providers lives under one roof at Café Erken, fused with a Phoenix   */
/* advantage strip.                                                     */
/* ================================================================== */

const ROOF_ROWS: { cat: string; elsewhere: string }[] = [
  { cat: "Dinner reservations & waitlist", elsewhere: "OpenTable-style booking fees per cover" },
  { cat: "Deposits & no-show protection", elsewhere: "A paper reservation book and a shrug" },
  { cat: "Takeout & delivery orders", elsewhere: "DoorDash/UberEats commissions eating the margin" },
  { cat: "Review requests", elsewhere: "A separate review-request tool, half-configured" },
  { cat: "Catering & private-event inquiries", elsewhere: "A separate inbox nobody checks fast enough" },
  { cat: "Front desk & host stand", elsewhere: "Voicemail during the dinner rush" },
];

const PHX_POINTS = [
  "Chef-owned on 7th Avenue since 2018",
  "68 seats, real-time availability",
  "The front desk answers every call",
];

function RestaurantSection() {
  return (
    <section id="one-restaurant" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <motion.div
          data-celly-avoid
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease }}
          className="max-w-2xl"
        >
          <SectionKicker>One restaurant</SectionKicker>
          <h2
            className="mt-3 text-3xl font-bold tracking-tight md:text-5xl"
            style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
          >
            Everything under one roof.
          </h2>
          <p className="mt-4 text-base text-text-muted md:text-lg">
            Reservations, deposits, takeout, and reviews — one restaurant on
            7th Avenue, one calendar, one team that knows your name.
          </p>
        </motion.div>

        {/* Phoenix advantage strip */}
        <div data-celly-avoid className="mt-8 flex flex-wrap gap-3">
          {PHX_POINTS.map((p) => (
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
              At Café Erken
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
              <div className="text-[11px] font-medium text-white/85">on 7th Avenue, Phoenix</div>
            </div>
          </div>
          {/* Overhang — accent column extends past the table, CTA inside. */}
          <div className="absolute right-0 top-full w-[170px] rounded-b-2xl bg-accent px-3 pb-4 pt-3 text-center shadow-[0_18px_40px_-16px_rgba(126,166,135,0.85)]">
            <button
              type="button"
              onClick={scrollToBooking}
              className="inline-flex w-full items-center justify-center gap-1 rounded-lg bg-white px-3 py-2.5 text-xs font-semibold text-accent shadow-sm transition-transform hover:scale-[1.02]"
            >
              Book a table →
            </button>
            <div className="mt-1.5 text-[11px] text-white/90">no fee · confirmed instantly</div>
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
              Reservations, deposits, takeout, and reviews — all on 7th
              Avenue, Phoenix.
            </div>
            <button
              type="button"
              onClick={scrollToBooking}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-accent shadow-sm transition-transform hover:scale-[1.02]"
            >
              Book a table →
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
            Party sizes, dietary restrictions, what a buyout costs — ask
            anything. The front desk answers around the clock, even when the
            dining room is slammed.
          </p>
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={(e) => openCafeContact(e.currentTarget)}
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

/* ---- Demo attribution — one quiet line (the restaurant is fictional). ---- */
function DemoNote() {
  return (
    <div className="pb-8 pt-4 text-center">
      <p className="px-6 text-xs text-text-dim">
        Café Erken is a fictional restaurant — this site is a live demo
        built by{" "}
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
/* HomeV8Client, with the restaurant sections inside.                   */
/* ================================================================== */
export default function CafeErkenClient() {
  const spriteContainerRef = useRef<HTMLDivElement>(null);
  const bubbleContainerRef = useRef<HTMLDivElement>(null);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  // Celly's Text/Voice menu (voice = the Café Erken front-desk agent).
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
        CallbackModal), mapped to this site's own cream/sage palette
        (identical to sky-erken's — same site skin, different content). */}
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
    <CafeHeader />
    <SphereScrollStage
      // 7 top-level sections: hero, services, journey, kitchen,
      // pricing+booking, one-restaurant, questions. Cosmetic — the on-stop
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
      {/* 1. HERO — restaurant photo + Contact-us-now chooser. */}
      <HeroSection isMobile={isMobile} />

      {/* 2. SERVICES — the industry-carousel mechanic, one card per service. */}
      <ServicesSection />

      {/* 3. THE RESERVATION & EVENT DAY — sticky-column phase panels. */}
      <JourneySection />

      {/* 4. THE KITCHEN & DINING ROOM — the AI-team carousel mechanic. */}
      <KitchenSection />

      {/* 5. PRICING + the real GHL booking calendar right below. */}
      <PricingSection />
      <BookingSection />

      {/* 6. ONE RESTAURANT — the stack-table mechanic + Phoenix advantage. */}
      <RestaurantSection />

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
    {/* Voice widget = the DEMO variant: every call carries the Café Erken
        dynamic variables so the Retell agent answers as this restaurant's
        front desk. CallbackModal = the GHL "Request a Callback" form. */}
    <DemoVoiceWidget config={CAFE} />
    <CallbackModal config={CAFE} />

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
          aria-label="Contact Café Erken"
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
            <span className="text-xs text-white/55">Contact Café Erken</span>
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
