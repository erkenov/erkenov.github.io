"use client";

/**
 * FlyHomeClient — the /fly-home draft homepage for FLIGHT SCHOOL OWNERS.
 *
 * Local-only review draft (2026-08-22). Same design system as the live
 * homepage (cream/sage palette, Inter + JetBrains Mono, mono-label
 * kickers, rounded-2xl surface cards, framer-motion fade-ins) but fully
 * self-contained: local header/footer with NO industry links, no
 * 15-industry cards, no generic-SMB framing, no platform-vendor mentions.
 *
 * Sections (copy per the 2026-08-22 brief, verbatim):
 *   1. Hero — "Your next student is calling while you're on the flight
 *      line." + demo-line CTA (tel:+13252412460).
 *   2. The fifth place — the phone as the uncounted leak.
 *   3. Product — three cards: calls / texts / booking.
 *   4. Pricing — $97/mo, $197 setup, disqualification aside.
 *   5. Story — founder, systems guy becoming a pilot.
 *   6. Growth layer — websites/search/ads later; phone first.
 *   7. Audit closer (#audit) — "call your own school after 8 PM".
 */

import { motion } from "framer-motion";
import { CalendarCheck, MessageSquare, Phone, PhoneCall } from "lucide-react";
import Link from "next/link";

const ease = [0.16, 1, 0.3, 1] as const;

const DEMO_TEL = "+13252412460";
const DEMO_DISPLAY = "(325) 241-2460";

function SectionKicker({ children }: { children: React.ReactNode }) {
  return <div className="mono-label">{children}</div>;
}

function FadeIn({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function PrimaryCta({ children }: { children: React.ReactNode }) {
  return (
    <a
      href={`tel:${DEMO_TEL}`}
      className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-medium text-bg transition-all hover:bg-accent-hover"
    >
      <PhoneCall className="h-4 w-4" />
      {children}
    </a>
  );
}

/* ---- Local header — same sticky pattern as the homepage DraftHeader, */
/* but with no industry links. ---- */
function FlyHomeHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-8">
        <Link
          href="/fly-home"
          className="font-mono text-sm font-medium uppercase tracking-tight text-text"
        >
          erken<span className="text-accent"> </span>systems
          <span className="ml-2 hidden text-xs normal-case text-text-dim sm:inline">
            · for flight schools
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <a
            href={`tel:${DEMO_TEL}`}
            className="hidden items-center gap-1.5 font-mono text-sm text-text-muted transition-colors hover:text-text md:flex"
          >
            <Phone className="h-3.5 w-3.5" />
            {DEMO_DISPLAY}
          </a>
          <a
            href={`tel:${DEMO_TEL}`}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg transition-all hover:bg-accent-hover"
          >
            Call the demo line
          </a>
        </div>
      </div>
    </header>
  );
}

/* ================================================================== */
/* 1. HERO                                                             */
/* ================================================================== */
function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 py-16 md:px-12 md:py-24">
      <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden />
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-12">
        <FadeIn>
          <div className="mono-label">For flight school owners</div>
          <h1
            className="mt-3 text-3xl font-bold tracking-tight md:text-4xl xl:text-5xl"
            style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
          >
            Your next student is calling while you&apos;re on the flight line.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-text-muted xl:text-lg">
            The Receptionist answers every call, text, and website chat — 24/7 —
            and books discovery flights straight into your calendar. It knows
            what a discovery flight is, what Part 61 and Part 141 mean, and why
            weather cancels happen. $97/month — less than one hour of dual
            instruction.
          </p>
          <div className="mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <PrimaryCta>Call the demo line — hear it work</PrimaryCta>
            <a
              href="#audit"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-medium text-text transition-all hover:border-border-strong hover:bg-surface"
            >
              See what voicemail costs you
            </a>
          </div>
        </FadeIn>
        <FadeIn className="w-full">
          <div className="relative w-full overflow-hidden rounded-2xl bg-black shadow-2xl aspect-video">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/demo/flight-schools/sunset-pilots.jpg"
              alt="Student pilot and instructor walking the flight line at sunset"
              className="absolute inset-0 h-full w-full object-cover"
              draggable={false}
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ================================================================== */
/* 2. THE FIFTH PLACE                                                  */
/* ================================================================== */
function FifthPlaceSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <FadeIn className="max-w-3xl">
          <SectionKicker>The leak nobody counts</SectionKicker>
          <h2
            className="mt-3 text-3xl font-bold tracking-tight md:text-5xl"
            style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
          >
            Four places lose you a student. The fifth is your phone.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-text-muted md:text-lg">
            A student searches, lands on your site, compares you against two
            other schools, and fills out one form. Those are the four places
            everyone talks about. The fifth is the call at 6 PM while
            everyone&apos;s on the flight line — and the 9 PM website visitor who
            has contacted two other schools by 9:15. Friday-night inquiries
            shouldn&apos;t wait until Monday — but a full-time front desk costs
            $3,000+ a month, so they usually do.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

/* ================================================================== */
/* 3. PRODUCT — three cards                                            */
/* ================================================================== */
const PRODUCT_CARDS = [
  {
    Icon: Phone,
    title: "Answers every call",
    body: "24/7 voice agent; pricing, programs, and discovery-flight booking straight into your calendar.",
  },
  {
    Icon: MessageSquare,
    title: "Texts back instantly",
    body: "Missed-call SMS within seconds; after-hours website chat.",
  },
  {
    Icon: CalendarCheck,
    title: "Books and reminds",
    body: "Calendar sync, booking reminders, weather-cancellation rebooking.",
  },
];

function ProductSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <FadeIn className="max-w-2xl">
          <SectionKicker>The Receptionist</SectionKicker>
          <h2
            className="mt-3 text-3xl font-bold tracking-tight md:text-5xl"
            style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
          >
            A receptionist that knows what a discovery flight is.
          </h2>
        </FadeIn>
        <div className="mt-10 grid gap-4 md:grid-cols-3 md:gap-6">
          {PRODUCT_CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, ease, delay: i * 0.05 }}
              className="rounded-2xl border border-border bg-surface p-6"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <card.Icon className="h-5 w-5" />
              </div>
              <div
                className="mt-4 text-base font-semibold text-text"
                style={{ letterSpacing: "-0.01em" }}
              >
                {card.title}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-text-muted md:text-[15px]">
                {card.body}
              </p>
            </motion.div>
          ))}
        </div>
        <FadeIn className="mt-8">
          <p className="font-mono text-sm text-accent">
            No apps for your staff to learn. It just answers.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

/* ================================================================== */
/* 4. PRICING                                                          */
/* ================================================================== */
function PricingSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <FadeIn className="max-w-3xl">
          <SectionKicker>Pricing</SectionKicker>
          <h2
            className="mt-3 text-3xl font-bold tracking-tight md:text-5xl"
            style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
          >
            $97/month. $197 setup. That&apos;s the whole price.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-text-muted md:text-lg">
            No six-month minimums. No retainer. No proposal you can&apos;t
            compare to anything. A full marketing system runs $1,000–3,000 a
            month — and still sends the Friday-night caller to voicemail.
            Start where the leak is.
          </p>
          <div className="mt-6 rounded-2xl border border-dashed border-border-strong bg-surface-2 p-5">
            <p className="text-sm italic leading-relaxed text-text-muted md:text-base">
              Already have a full-time front desk answering after hours? You
              honestly don&apos;t need this.
            </p>
          </div>
          <div className="mt-7">
            <PrimaryCta>Call the demo line — hear it work</PrimaryCta>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ================================================================== */
/* 5. STORY                                                            */
/* ================================================================== */
function StorySection() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <FadeIn className="max-w-3xl">
          <SectionKicker>Who builds it</SectionKicker>
          <h2
            className="mt-3 text-3xl font-bold tracking-tight md:text-5xl"
            style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
          >
            Built by a systems guy who&apos;s becoming a pilot.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-text-muted md:text-lg">
            I&apos;ve spent ten years building systems for businesses —
            operations, automation, the unglamorous machinery that makes
            companies run. This year I started ground school. I&apos;m entering
            aviation from both sides at once: learning to fly, and fixing the
            part of the industry I can already see is broken — the unanswered
            phone. You should never have to explain to your receptionist what a
            discovery flight is.
          </p>
          <p className="mt-4 font-mono text-sm text-text-dim">
            — Shamil, founder.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

/* ================================================================== */
/* 6. GROWTH LAYER                                                     */
/* ================================================================== */
function GrowthSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <FadeIn className="max-w-3xl">
          <SectionKicker>Later, when you&apos;re ready</SectionKicker>
          <h2
            className="mt-3 text-3xl font-bold tracking-tight md:text-5xl"
            style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
          >
            When every call is answered, make the phone ring more.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-text-muted md:text-lg">
            Websites, search visibility — including AI search, where students
            increasingly ask ChatGPT which school to choose — and ads, built
            for flight schools and priced for 1–3-aircraft operations.
            Available when you&apos;re ready. The phone comes first.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

/* ================================================================== */
/* 7. AUDIT CLOSER (#audit)                                            */
/* ================================================================== */
function AuditSection() {
  return (
    <section id="audit" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <FadeIn className="max-w-3xl rounded-2xl border border-border bg-surface p-8 md:p-12">
          <SectionKicker>The two-minute test</SectionKicker>
          <h2
            className="mt-3 text-3xl font-bold tracking-tight md:text-5xl"
            style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
          >
            Hear what your students hear.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-text-muted md:text-lg">
            Tonight, after 8 PM, call your own school. That&apos;s what a
            motivated student pilot hears. Then call our demo line — same
            scenario, different outcome.
          </p>
          <div className="mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <PrimaryCta>Call the demo line</PrimaryCta>
            <span className="font-mono text-sm text-text-muted">{DEMO_DISPLAY}</span>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ---- Local footer — minimal, no industry links. ---- */
function FlyHomeFooter() {
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 md:flex-row md:items-center md:px-8">
        <div className="font-mono text-sm uppercase tracking-tight text-text">
          erken<span className="text-accent"> </span>systems
        </div>
        <a
          href={`tel:${DEMO_TEL}`}
          className="flex items-center gap-1.5 font-mono text-sm text-text-muted transition-colors hover:text-text"
        >
          <Phone className="h-3.5 w-3.5" />
          {DEMO_DISPLAY}
        </a>
        <div className="text-xs text-text-dim">
          Draft for internal review — not the live site.
        </div>
      </div>
    </footer>
  );
}

export default function FlyHomeClient() {
  return (
    <main className="flex-1">
      <FlyHomeHeader />
      <HeroSection />
      <FifthPlaceSection />
      <ProductSection />
      <PricingSection />
      <StorySection />
      <GrowthSection />
      <AuditSection />
      <FlyHomeFooter />
    </main>
  );
}
