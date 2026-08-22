"use client";

/**
 * FlyHomeClient — the /fly-home draft homepage for FLIGHT SCHOOL OWNERS.
 *
 * Local-only review draft (2026-08-22). Same design system as the live
 * homepage (cream/sage palette, Inter + JetBrains Mono, mono-label
 * kickers, rounded-2xl surface cards, framer-motion fade-ins) but fully
 * self-contained: local header/footer with NO industry links, no
 * 15-industry cards, no generic-SMB framing... with ONE deliberate
 * exception (Shamil 2026-08-22, supersedes the no-vendor-mention rule
 * for THIS page): the "Why is it only $97?" FAQ answer names GoHighLevel
 * openly, per Shamil's transparency pitch.
 *
 * Sections (2026-08-22 revision 3 — Shamil's full Obsidian batch applied):
 *   1. Hero — "Your next student is calling while you're on the flight
 *      line." Media = founder intro VIDEO, landscape frame. CTA =
 *      "Call your future AI receptionist" (Shamil's rename).
 *   2. The fifth place — FIVE cards: four muted + the phone (accent).
 *   3. Product — calls / call-back + text / booking incl. NO-SHOW
 *      rebooking (his workflow change: callback first, SMS after 5 min).
 *   4. Missing layer — "It makes the phone ring. The Receptionist answers it."
 *   5. Pricing — MAIN-PAGE design (radial wash + lead-capture card →
 *      /api/lead → Payoneer), draft copy: $97/mo flat, NO setup fee, NO
 *      front-desk disqualification aside (Shamil removed both 2026-08-22).
 *   6. Process — four live steps + step 5 "Eyes on the gauges".
 *   7. Story — founder, systems guy becoming a pilot.
 *   8. "What you get" — the four product blocks ported from the main page
 *      (shared ProductSections, light theme) under the growth-layer heading.
 *   9. The full platform — Capture/Nurture/Close/Fans/Winback cards ported
 *      from the main page + docs button (Shamil: "see the whole platform
 *      capabilities"; /docs portal builds next).
 *  10. Missed-call cost calculator (#calculator).
 *  11. Audit closer (#audit).
 *  12. FAQ — sage/amber accordion; "Why is it only $97?" = the
 *      GoHighLevel-transparency answer (Shamil's wording direction).
 *  13. Stack table — flight-school version, at the very bottom.
 */

import { Fragment, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  CalendarCheck,
  Check,
  ChevronDown,
  ClipboardList,
  Globe,
  MessageSquare,
  Phone,
  PhoneCall,
  PhoneMissed,
  Scale,
  Search,
} from "lucide-react";
import Link from "next/link";
import { Scene1IntroVideo } from "@/components/Scene1IntroVideo";
import ProductSections from "@/components/ProductSections";
import { PLATFORM_FEATURES, PAYMENT_LINKS } from "@/lib/pricing";

const ease = [0.16, 1, 0.3, 1] as const;

const DEMO_TEL = "+13252412460";
const DEMO_DISPLAY = "(325) 241-2460";
const CTA_LABEL = "Call your future AI receptionist";

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

function SectionH2({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="mt-3 text-3xl font-bold tracking-tight md:text-5xl"
      style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
    >
      {children}
    </h2>
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

/* ---- Local header — no industry links. ---- */
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
            Call your AI receptionist
          </a>
        </div>
      </div>
    </header>
  );
}

/* ================================================================== */
/* 1. HERO — media = founder intro video, LANDSCAPE frame (Shamil).    */
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
            <PrimaryCta>{CTA_LABEL}</PrimaryCta>
            <a
              href="#calculator"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-medium text-text transition-all hover:border-border-strong hover:bg-surface"
            >
              See what voicemail costs you
            </a>
          </div>
        </FadeIn>
        <FadeIn className="w-full">
          <Scene1IntroVideo orientation="landscape" />
        </FadeIn>
      </div>
    </section>
  );
}

/* ================================================================== */
/* 2. THE FIFTH PLACE — five cards: four muted + the phone (accent)    */
/* ================================================================== */
const FIFTH_CARDS = [
  {
    Icon: Search,
    step: "1 — Search",
    body: "A student searches “flight school near me” and starts a shortlist.",
  },
  {
    Icon: Globe,
    step: "2 — Website",
    body: "They land on your site and judge it in seconds.",
  },
  {
    Icon: Scale,
    step: "3 — Comparison",
    body: "They compare you against two other schools.",
  },
  {
    Icon: ClipboardList,
    step: "4 — The form",
    body: "They fill out one school’s form. Maybe yours.",
  },
];

function FifthPlaceSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <FadeIn className="max-w-3xl">
          <SectionKicker>The leak nobody counts</SectionKicker>
          <SectionH2>
            Four places lose you a student. The fifth is your phone.
          </SectionH2>
          <p className="mt-5 text-base leading-relaxed text-text-muted md:text-lg">
            Everyone in flight-school marketing talks about the same four
            places. The fifth one never makes the list — because nobody sells
            a tool for it.
          </p>
        </FadeIn>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {FIFTH_CARDS.map((card, i) => (
            <motion.div
              key={card.step}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, ease, delay: i * 0.05 }}
              className="rounded-2xl border border-border bg-surface p-5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2 text-text-muted">
                <card.Icon className="h-5 w-5" />
              </div>
              <div className="mt-4 font-mono text-xs font-medium uppercase tracking-[0.08em] text-text-dim">
                {card.step}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {card.body}
              </p>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, ease, delay: 0.2 }}
            className="rounded-2xl border border-accent bg-accent p-5 text-white shadow-[0_18px_44px_-18px_rgba(126,166,135,0.75)]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white">
              <PhoneMissed className="h-5 w-5" />
            </div>
            <div className="mt-4 font-mono text-xs font-medium uppercase tracking-[0.08em] text-white/85">
              5 — The phone call
            </div>
            <p className="mt-2 text-sm leading-relaxed text-white/90">
              6 PM. Everyone&apos;s on the flight line. The call goes to
              voicemail — and the 9 PM inquiry has contacted two other schools
              by 9:15.
            </p>
          </motion.div>
        </div>
        <FadeIn className="mt-8 max-w-3xl">
          <p className="text-base leading-relaxed text-text-muted md:text-lg">
            Friday-night inquiries shouldn&apos;t wait until Monday — but a
            full-time front desk costs $3,000+ a month, so they usually do.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

/* ================================================================== */
/* 3. PRODUCT — three cards (rev3: callback-first flow, no-show added) */
/* ================================================================== */
const PRODUCT_CARDS = [
  {
    Icon: Phone,
    title: "Answers every call",
    body: "24/7 voice agent; pricing, programs, and discovery-flight booking straight into your calendar.",
  },
  {
    Icon: PhoneCall,
    title: "Calls back instantly",
    body: "Missed call? The Receptionist calls back within about a minute. No answer — five minutes later it texts: sorry we missed you — and keeps the conversation alive.",
  },
  {
    Icon: CalendarCheck,
    title: "Books and reminds",
    body: "Calendar sync, booking reminders, weather-cancellation and no-show rebooking.",
  },
];

function ProductSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <FadeIn className="max-w-2xl">
          <SectionKicker>The Receptionist</SectionKicker>
          <SectionH2>
            A receptionist that knows what a discovery flight is.
          </SectionH2>
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
/* 4. MISSING LAYER                                                    */
/* ================================================================== */
function MissingLayerSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <FadeIn className="max-w-3xl">
          <SectionKicker>Already have a marketing system?</SectionKicker>
          <SectionH2>
            It makes the phone ring. The Receptionist answers it.
          </SectionH2>
          <p className="mt-5 text-base leading-relaxed text-text-muted md:text-lg">
            Websites, SEO, and ads are built to make the phone ring — and none
            of them pick it up. The Receptionist is the layer every system is
            missing: the moment a student reaches out, someone answers.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

/* ================================================================== */
/* 5. PRICING — main-page design (radial wash + lead-capture card),    */
/* draft copy: $97 flat, no setup fee, no disqualification aside.      */
/* ================================================================== */
function PricingCard() {
  const [submitting, setSubmitting] = useState(false);

  // Same lead-capture-then-pay mechanic as the live homepage card:
  // submit → /api/lead (best-effort) → Payoneer link for the monthly plan.
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const data = new FormData(e.currentTarget);
    let paymentUrl: string | null = null;
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: data.get("firstName"),
          lastName: data.get("lastName"),
          phone: data.get("phone"),
          email: data.get("email"),
          plan: "monthly",
        }),
      });
      const d = (await res.json().catch(() => ({}))) as { paymentUrl?: string | null };
      paymentUrl = d.paymentUrl ?? null;
    } catch {
      // Never block the payment redirect on a lead-capture failure.
    }
    window.location.href = paymentUrl ?? PAYMENT_LINKS.monthly;
  }

  const inputCls =
    "w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-text placeholder:text-text-dim focus:border-accent focus:outline-none";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease }}
      whileHover={{ y: -2 }}
      className="relative flex w-full max-w-md flex-col rounded-2xl border-2 border-accent bg-surface p-8 transition-colors duration-200 hover:border-accent-hover"
    >
      <h3 className="text-lg font-semibold text-text">The Receptionist</h3>
      <div className="mt-4">
        <span
          className="text-3xl font-bold tracking-tight text-text"
          style={{ letterSpacing: "-0.03em" }}
        >
          $97/mo
        </span>
        <span className="ml-2 text-xs text-text-dim">
          billed monthly · no setup fee · cancel anytime
        </span>
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
      <form onSubmit={handleSubmit} className="mt-6">
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <input name="firstName" required placeholder="First name" autoComplete="given-name" className={inputCls} />
            <input name="lastName" required placeholder="Last name" autoComplete="family-name" className={inputCls} />
          </div>
          <input name="email" required type="email" placeholder="Email" autoComplete="email" className={inputCls} />
          <input name="phone" required type="tel" placeholder="Phone" autoComplete="tel" className={inputCls} />
        </div>
        <label className="mt-3 flex items-start gap-2.5 text-xs leading-relaxed text-text-dim">
          <input type="checkbox" required className="mt-0.5 shrink-0 accent-[#8D63DA]" />
          <span>
            I agree to receive SMS, email, and calls — including automated
            AI-voice calls — from Erken Systems about my order and setup.
            No spam — only what my account needs.
          </span>
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-60"
          style={{ background: "linear-gradient(90deg, #8D63DA, #1C71DF)" }}
        >
          {submitting ? "One moment…" : "Continue to pay →"}
        </button>
      </form>
    </motion.div>
  );
}

function PricingSection() {
  return (
    <section
      id="pricing"
      className="relative overflow-hidden py-20 md:py-28"
      style={{
        background:
          "radial-gradient(58% 80% at 14% 8%, rgba(141,99,218,0.18), transparent 60%)," +
          "radial-gradient(54% 74% at 88% 14%, rgba(28,113,223,0.16), transparent 62%)," +
          "radial-gradient(52% 62% at 62% 96%, rgba(126,166,135,0.16), transparent 62%)," +
          "linear-gradient(180deg, #FBF7EF 0%, var(--bg) 100%)",
      }}
    >
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <FadeIn className="max-w-2xl">
          <SectionKicker>Pricing</SectionKicker>
          <SectionH2>$97 a month. That&apos;s the whole price.</SectionH2>
          <p className="mt-4 text-base text-text-muted md:text-lg">
            No setup fee. No six-month minimums. No retainer. No proposal you
            can&apos;t compare to anything. A full marketing system runs
            $1,000–3,000 a month — and still sends the Friday-night caller to
            voicemail. Start where the leak is.
          </p>
        </FadeIn>
        <div className="mt-10 flex justify-start md:justify-center">
          <PricingCard />
        </div>
        <p className="mt-6 max-w-2xl text-xs font-medium leading-relaxed text-amber-700 md:mx-auto md:text-center">
          AI voice minutes are billed separately at cost — roughly 10¢ a
          minute, so even a busy month of answered calls adds a few dollars,
          never a surprise bill.
        </p>
      </div>
    </section>
  );
}

/* ================================================================== */
/* 6. PROCESS — the four live steps + 5th: "Eyes on the gauges"        */
/* ================================================================== */
const PROCESS_STEPS = [
  {
    title: "Ask the AI anything",
    text: "Questions? Our AI receptionist answers instantly — chat, voice, or text. No sales calls. And if the AI can't cover something, ask it to pass your message to Shamil — he'll call you personally.",
  },
  {
    title: "Pay and fill one form",
    text: "One onboarding form: your services, prices, common questions. Shamil reviews it personally and confirms everything with you.",
  },
  {
    title: "We build it — 7–10 days",
    text: "Most of that is the phone carrier verifying your number. We handle everything else.",
  },
  {
    title: "Video handover",
    text: "A short video call: you see the whole system working, and get the keys.",
  },
  {
    title: "Eyes on the gauges",
    text: "After launch, I keep watching: how your school uses the system, where students still slip through, where the industry is moving. And I keep building — new automations, sharper answers, better booking flow. The system you start with is not the system you're limited to.",
  },
];

function ProcessSection() {
  return (
    <section id="process" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <FadeIn className="mx-auto max-w-3xl text-center">
          <SectionKicker>The process</SectionKicker>
          <SectionH2>What working with us looks like</SectionH2>
        </FadeIn>
        <div className="relative mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div
            aria-hidden
            className="absolute top-6 right-0 left-0 hidden border-t border-dashed border-border lg:block"
          />
          {PROCESS_STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, ease, delay: i * 0.05 }}
            >
              <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-accent/40 bg-surface font-mono text-sm font-semibold text-accent">
                {i + 1}
              </span>
              <h3 className="mt-5 text-lg font-semibold text-text">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {step.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* 7. STORY                                                            */
/* ================================================================== */
function StorySection() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <FadeIn className="max-w-3xl">
          <SectionKicker>Who builds it</SectionKicker>
          <SectionH2>
            Built by a systems guy who&apos;s becoming a pilot.
          </SectionH2>
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
/* 9. THE FULL PLATFORM — ported phase cards + docs button             */
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

const STAR_D =
  "M0 -7 L1.65 -2.26 L6.66 -2.16 L2.66 0.87 L4.11 5.66 L0 2.8 L-4.11 5.66 L-2.66 0.87 L-6.66 -2.16 L-1.65 -2.26 Z";

function IllustrationCapture() {
  return (
    <IllustrationBackdrop>
      <circle cx="46" cy="34" r="4" fill={ILLO_CLAY} />
      <circle cx="60" cy="28" r="4.5" fill={ILLO_CLAY} />
      <circle cx="74" cy="34" r="4" fill={ILLO_CLAY} />
      <path d="M32 48 L88 48 L66 76 L66 90 L54 90 L54 76 Z" fill={ILLO_SAGE} />
      <rect x="32" y="46" width="56" height="5" rx="2.5" fill={ILLO_NEUTRAL} />
      <circle cx="60" cy="102" r="4.5" fill={ILLO_CLAY} />
    </IllustrationBackdrop>
  );
}

function IllustrationNurture() {
  return (
    <IllustrationBackdrop>
      <circle cx="48" cy="30" r="3" fill={ILLO_SAGE} opacity="0.65" />
      <circle cx="60" cy="26" r="3.5" fill={ILLO_SAGE} opacity="0.65" />
      <circle cx="72" cy="30" r="3" fill={ILLO_SAGE} opacity="0.65" />
      <path d="M46 78 L74 78 L70 94 L50 94 Z" fill={ILLO_CLAY} />
      <rect x="45" y="74" width="30" height="6" rx="3" fill={ILLO_NEUTRAL} />
      <path d="M60 74 V50" stroke={ILLO_SAGE} strokeWidth="4" strokeLinecap="round" />
      <path d="M60 62 Q46 58 46 44 Q58 46 60 62 Z" fill={ILLO_SAGE} />
      <path d="M60 56 Q74 52 74 40 Q63 42 60 56 Z" fill={ILLO_SAGE} />
    </IllustrationBackdrop>
  );
}

function IllustrationClose() {
  return (
    <IllustrationBackdrop>
      <rect x="36" y="26" width="44" height="58" rx="6" fill="#FFFFFF" stroke={ILLO_NEUTRAL} strokeWidth="2" />
      <rect x="44" y="36" width="28" height="4" rx="2" fill={ILLO_NEUTRAL} />
      <rect x="44" y="46" width="28" height="4" rx="2" fill={ILLO_NEUTRAL} />
      <rect x="44" y="56" width="18" height="4" rx="2" fill={ILLO_NEUTRAL} />
      <path d="M44 70 q5 -7 10 0 t10 0" stroke={ILLO_CLAY} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="82" cy="82" r="16" fill={ILLO_SAGE} />
      <path d="M74 82 L80 88 L91 75" stroke="#FFFFFF" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </IllustrationBackdrop>
  );
}

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

function IllustrationWinback() {
  return (
    <IllustrationBackdrop>
      <circle cx="58" cy="58" r="8" fill={ILLO_CLAY} />
      <path d="M45 86 Q45 70 58 70 Q71 70 71 86 Z" fill={ILLO_CLAY} />
      <path d="M86 70 A29 29 0 1 0 55 30" fill="none" stroke={ILLO_SAGE} strokeWidth="4.5" strokeLinecap="round" />
      <path d="M55 30 L63 27 M55 30 L58 38" stroke={ILLO_SAGE} strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </IllustrationBackdrop>
  );
}

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

function PlatformPhases() {
  return (
    <div className="flex flex-col gap-4">
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

/** Sticky-left story + always-expanded phase panels (ported from the live
 *  homepage pipeline section), with Shamil's docs button added (2026-08-22:
 *  "a third button — see the whole platform capabilities"). /docs is the
 *  aviation-flavored docs portal — built next, links live then. */
function PlatformSection() {
  return (
    <section id="platform" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div className="grid gap-10 md:grid-cols-2 md:items-start md:gap-12 lg:gap-16">
          <div className="md:sticky md:top-24 md:self-start">
            <FadeIn>
              <SectionKicker>The full platform</SectionKicker>
              <SectionH2>And that&apos;s just the setup.</SectionH2>
              <p className="mt-4 text-base leading-relaxed text-text-muted md:text-lg">
                Everything above is what we build for you in the first 7–10
                days. Underneath it sits the full platform — every feature
                below is already included in your $97, ready when you are.
              </p>
              <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <PrimaryCta>{CTA_LABEL}</PrimaryCta>
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium text-text transition-all hover:border-border-strong hover:bg-surface"
                >
                  <BookOpen className="h-4 w-4" />
                  Explore the platform docs
                </Link>
              </div>
            </FadeIn>
          </div>
          <div className="w-full">
            <PlatformPhases />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* 10. MISSED-CALL COST CALCULATOR (#calculator)                       */
/* ================================================================== */
const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function CalcSlider({
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label className="text-sm text-text-muted">{label}</label>
        <span className="font-mono text-sm font-medium text-text">{display}</span>
      </div>
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full"
        style={{ accentColor: "var(--accent)" }}
      />
    </div>
  );
}

function CalculatorSection() {
  const [inquiries, setInquiries] = useState(30);
  const [voicemailPct, setVoicemailPct] = useState(40);
  const [bookingPct, setBookingPct] = useState(25);
  const [studentValue, setStudentValue] = useState(15000);

  const monthlyCost = inquiries * (voicemailPct / 100) * (bookingPct / 100) * studentValue;

  return (
    <section id="calculator" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <FadeIn className="max-w-3xl">
          <SectionKicker>The math</SectionKicker>
          <SectionH2>What voicemail costs your school.</SectionH2>
        </FadeIn>
        <FadeIn className="mt-10 max-w-3xl rounded-2xl border border-border bg-surface p-6 md:p-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <CalcSlider
              label="Discovery-flight inquiries per month"
              value={inquiries}
              display={String(inquiries)}
              min={5}
              max={100}
              step={1}
              onChange={setInquiries}
            />
            <CalcSlider
              label="Share reaching voicemail / after-hours"
              value={voicemailPct}
              display={`${voicemailPct}%`}
              min={10}
              max={90}
              step={5}
              onChange={setVoicemailPct}
            />
            <CalcSlider
              label="Booking rate when answered live"
              value={bookingPct}
              display={`${bookingPct}%`}
              min={5}
              max={60}
              step={5}
              onChange={setBookingPct}
            />
            <CalcSlider
              label="Value of one enrolled student"
              value={studentValue}
              display={usd.format(studentValue)}
              min={5000}
              max={40000}
              step={500}
              onChange={setStudentValue}
            />
          </div>
          <div className="mt-8 border-t border-border pt-6">
            <p className="text-xl font-semibold tracking-tight text-text md:text-2xl">
              Unanswered inquiries cost you ≈{" "}
              <span className="text-[var(--clay)]">{usd.format(monthlyCost)}</span>{" "}
              per month
            </p>
            <p className="mt-3 text-xs leading-relaxed text-text-dim md:text-sm">
              {inquiries} inquiries × {voicemailPct}% to voicemail × {bookingPct}%
              booking rate × {usd.format(studentValue)}{" "}per student —
              conservative on purpose; change the numbers to your school&apos;s.
            </p>
          </div>
        </FadeIn>
        <FadeIn className="mt-8 max-w-3xl">
          <a
            href="#audit"
            className="group inline-flex items-center gap-2 text-base text-text-muted transition-colors hover:text-text md:text-lg"
          >
            Then tonight, call your own school after hours — and hear it for
            yourself.
            <span aria-hidden className="text-accent transition-transform group-hover:translate-y-0.5">
              ↓
            </span>
          </a>
        </FadeIn>
      </div>
    </section>
  );
}

/* ================================================================== */
/* 11. AUDIT CLOSER (#audit)                                           */
/* ================================================================== */
function AuditSection() {
  return (
    <section id="audit" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <FadeIn className="max-w-3xl rounded-2xl border border-border bg-surface p-8 md:p-12">
          <SectionKicker>The two-minute test</SectionKicker>
          <SectionH2>Hear what your students hear.</SectionH2>
          <p className="mt-5 text-base leading-relaxed text-text-muted md:text-lg">
            Tonight, after 8 PM, call your own school. That&apos;s what a
            motivated student pilot hears. Then call our demo line — same
            scenario, different outcome.
          </p>
          <div className="mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <PrimaryCta>{CTA_LABEL}</PrimaryCta>
            <span className="font-mono text-sm text-text-muted">{DEMO_DISPLAY}</span>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ================================================================== */
/* 12. FAQ — sage/amber accordion (merged WhyUs). "Why is it only $97" */
/* = Shamil's GoHighLevel-transparency answer (2026-08-22). JSON-LD    */
/* mirror lives in page.tsx — keep in sync.                            */
/* ================================================================== */
const FAQS = [
  {
    q: "Does it replace my front desk?",
    a: "It covers what a front desk can't: after-hours, weekends, and the calls that come in while everyone's flying. Your staff keeps the day shift; nothing gets missed around it.",
  },
  {
    q: "What happens when it doesn't know an answer?",
    a: "It says so honestly, takes the caller's details, and texts you the summary — no invented answers, ever.",
  },
  {
    q: "How does discovery-flight booking work?",
    a: "It connects to your calendar and books straight into it, with automatic reminders. If you don't use a calendar today, setup includes one.",
  },
  {
    q: "Do I keep my phone number?",
    a: "Yes. Calls forward to the Receptionist only when you can't answer — after hours, or when the line is busy.",
  },
  {
    q: "Why is it only $97 a month?",
    a: "The honest answer: it runs on GoHighLevel — a platform that costs me $297 a month and already has everything built in. You can buy GoHighLevel yourself for $97 a month — exactly what I charge. The difference: buying direct gets you no setup, no one monitoring your account, no one looking for ways to improve it. From me, the same $97 includes all of that. My math is simple — $97 times the months you stay, and you stay because the system keeps improving. Cheap enough never to resent, valuable enough never to leave.",
  },
  {
    q: "Is there a contract?",
    a: "No. $97 a month, cancel anytime — no setup fee, no contract, no hostage-taking. The demo line on this page is the product, live — judge it before you pay anything.",
  },
];

function FaqSection() {
  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6 md:px-8">
        <FadeIn className="text-center">
          <SectionKicker>Questions owners ask</SectionKicker>
          <SectionH2>Fair questions, straight answers.</SectionH2>
        </FadeIn>
        <FadeIn className="mt-12">
          <div className="divide-y divide-white/15 overflow-hidden rounded-2xl border border-white/10 bg-[#8fb496] shadow-[0_18px_44px_-18px_rgba(126,166,135,0.75)]">
            {FAQS.map((item) => (
              <details key={item.q} className="group px-6 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium text-white [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <ChevronDown className="h-5 w-5 shrink-0 text-amber-300 transition group-open:rotate-180" />
                </summary>
                <p className="mt-3 leading-relaxed text-white/85">{item.a}</p>
              </details>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ================================================================== */
/* 13. STACK TABLE — flight-school version, at the very bottom.        */
/* ================================================================== */
const STACK_ROWS: { cat: string; tools: string[]; price: number }[] = [
  { cat: "Live answering service", tools: ["Smith.ai", "Ruby"], price: 292 },
  { cat: "SMS & phone system", tools: ["Twilio", "SimpleTexting"], price: 75 },
  { cat: "Call tracking", tools: ["CallRail"], price: 75 },
  { cat: "Website chat", tools: ["Tidio", "LiveChat"], price: 25 },
  { cat: "Appointment booking", tools: ["Calendly", "Acuity"], price: 25 },
  { cat: "CRM", tools: ["HubSpot", "Pipedrive"], price: 45 },
];
const STACK_TOTAL = STACK_ROWS.reduce((s, r) => s + r.price, 0); // 537
const PLATFORM_PRICE = 97;

function ToolChip({ name }: { name: string }) {
  const initial = (name.replace(/[^A-Za-z0-9]/g, "")[0] || "•").toUpperCase();
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-2 px-2 py-1 text-xs font-medium text-text-muted"
      title={name}
    >
      <span
        aria-hidden
        className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px] bg-text-dim/20 text-[8px] font-bold text-text-dim"
      >
        {initial}
      </span>
      {name}
    </span>
  );
}

function StackSection() {
  return (
    <section id="replace-your-stack" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <FadeIn className="max-w-2xl">
          <SectionKicker>Replace your whole stack</SectionKicker>
          <SectionH2>One receptionist instead of six subscriptions.</SectionH2>
          <p className="mt-4 text-base text-text-muted md:text-lg">
            Everything below is something The Receptionist does for your school
            out of the box — one login, one bill, $97/mo.
          </p>
        </FadeIn>

        {/* DESKTOP */}
        <div className="relative mb-24 mt-10 hidden md:block">
          <div className="grid grid-cols-[1.15fr_1.6fr_0.65fr_150px] overflow-hidden rounded-t-2xl rounded-bl-2xl shadow-[0_18px_50px_-24px_rgba(42,38,32,0.35)]">
            <div className="bg-[var(--accent-soft)] px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.08em] text-text">Category</div>
            <div className="bg-[var(--accent-soft)] px-3 py-3.5 font-mono text-[11px] uppercase tracking-[0.08em] text-text">The tools you&apos;d buy</div>
            <div className="bg-[var(--accent-soft)] px-3 py-3.5 font-mono text-[11px] uppercase tracking-[0.08em] text-text">Price on its own</div>
            <div className="flex items-center justify-center bg-accent px-3 py-3.5 text-center font-mono text-[11px] uppercase tracking-[0.08em] text-white">
              Receptionist ${PLATFORM_PRICE}
            </div>
            {STACK_ROWS.map((row, i) => {
              const zebra = i % 2 === 1 ? "bg-surface-2/60" : "bg-surface";
              return (
                <Fragment key={row.cat}>
                  <div className={`flex items-center px-6 py-3.5 font-semibold text-text ${zebra} border-t border-border/50`}>{row.cat}</div>
                  <div className={`flex items-center px-3 py-3.5 ${zebra} border-t border-border/50`}>
                    <div className="flex flex-wrap gap-1.5">
                      {row.tools.map((t) => (
                        <ToolChip key={t} name={t} />
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
            <div className="flex items-center border-t-2 border-border bg-[var(--accent-soft)] px-6 py-5 text-sm font-semibold text-text">
              The piecemeal stack
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
                  ${PLATFORM_PRICE}
                </span>
                <span className="mb-0.5 text-sm font-medium text-white/85">/mo</span>
              </div>
              <div className="text-[11px] font-medium text-white/85">all included</div>
            </div>
          </div>
          <div className="absolute right-0 top-full w-[150px] rounded-b-2xl bg-accent px-3 pb-4 pt-3 text-center shadow-[0_18px_40px_-16px_rgba(126,166,135,0.85)]">
            <a
              href={`tel:${DEMO_TEL}`}
              className="inline-flex w-full items-center justify-center gap-1 rounded-lg bg-[linear-gradient(90deg,#8D63DA,#1C71DF)] px-3 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:brightness-110 hover:scale-[1.02]"
            >
              {CTA_LABEL}
            </a>
          </div>
        </div>

        {/* MOBILE */}
        <div className="mt-10 md:hidden">
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
                    <ToolChip key={t} name={t} />
                  ))}
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between border-t-2 border-border bg-[var(--accent-soft)] px-5 py-4">
              <span className="text-sm font-semibold text-text">The piecemeal stack</span>
              <span className="text-2xl font-bold tracking-tight text-[var(--clay)] line-through decoration-[var(--clay)]/70 decoration-2">
                ${STACK_TOTAL.toLocaleString()}
                <span className="ml-1 text-sm font-normal">/mo</span>
              </span>
            </div>
          </div>
          <div
            className="relative mt-4 overflow-hidden rounded-2xl p-6 text-white shadow-[0_18px_44px_-18px_rgba(126,166,135,0.75)]"
            style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-hover))" }}
          >
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold tracking-tight" style={{ letterSpacing: "-0.03em" }}>
                ${PLATFORM_PRICE}
              </span>
              <span className="mb-1 text-base font-medium text-white/85">/mo, everything included</span>
            </div>
            <div className="mt-1 text-sm text-white/90">
              About <b>${(STACK_TOTAL - PLATFORM_PRICE).toLocaleString()} a month</b> back in
              your pocket.
            </div>
            <a
              href={`tel:${DEMO_TEL}`}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[linear-gradient(90deg,#8D63DA,#1C71DF)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110 hover:scale-[1.02]"
            >
              {CTA_LABEL}
            </a>
          </div>
        </div>
        <FadeIn className="mt-6 max-w-2xl">
          <p className="text-xs leading-relaxed text-text-dim">
            Prices are current published entry points for each category, not
            premium tiers.
          </p>
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
      <MissingLayerSection />
      <PricingSection />
      <ProcessSection />
      <StorySection />
      <ProductSections
        theme="light"
        heading="When every call is answered, make the phone ring more."
      />
      <PlatformSection />
      <CalculatorSection />
      <AuditSection />
      <FaqSection />
      <StackSection />
      <FlyHomeFooter />
    </main>
  );
}
