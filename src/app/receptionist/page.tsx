import type { Metadata } from "next";
import {
  MessageSquare,
  PhoneCall,
  Play,
  Check,
  ChevronDown,
} from "lucide-react";
import { PLATFORM_BILLING_PERIODS, billingPeriodNote } from "@/lib/pricing";
import ProductSections from "@/components/ProductSections";
import WhyUs from "@/components/WhyUs";
import { PAYMENT_LINKS } from "@/lib/pricing";

/**
 * /receptionist — direct-response funnel selling the AI Receptionist to
 * FLIGHT SCHOOLS. First of the per-industry funnel pages: keep the copy
 * flight-school specific, the structure reusable.
 *
 * Intentionally standalone: premium dark theme (the site's sage accent kept
 * for labels/icons, amber reserved for the single primary CTA), no site nav
 * or footer links — the only things to click are the CTAs below.
 */

// ── Config placeholders ────────────────────────────────────────────────
// PAYMENT_LINK comes from @/lib/pricing (single source, Shamil 2026-08-13).
// TODO: replace with the real booking link before launch.
const CALL_BOOKING_LINK = "#todo-booking-link";
const DEMO_PHONE = "+1 (325) 241-2460";
// ────────────────────────────────────────────────────────────────────────

const DEMO_PHONE_TEL = `tel:${DEMO_PHONE.replace(/[^+\d]/g, "")}`;

export const metadata: Metadata = {
  title: "AI Receptionist for Flight Schools — Erken Systems",
  description:
    "An AI receptionist answers your flight school's phone, website chat, and SMS around the clock — answers questions about your programs, books discovery flights, and texts you every lead. From $77/month.",
};

function PrimaryCta({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`inline-block rounded-xl bg-amber-400 px-8 py-4 text-lg font-semibold text-[#1a1405] shadow-[0_0_40px_rgba(251,191,36,0.25)] transition hover:bg-amber-300 hover:shadow-[0_0_56px_rgba(251,191,36,0.35)] ${className}`}
    >
      {children}
    </a>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs font-medium tracking-[0.18em] text-[#8fb496] uppercase">
      {children}
    </p>
  );
}

function Divider() {
  return (
    <div className="mx-auto my-20 h-px w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
  );
}

const HOW_IT_WORKS = [
  {
    title: "Forward your unanswered calls",
    text: "Point missed calls to your AI number — takes 5 minutes, and we send exact instructions for your carrier.",
  },
  {
    title: "The receptionist answers, chats, and books",
    text: "Trained on your business: your programs, your pricing, your schedule.",
  },
  {
    title: "You get a text with everything",
    text: "Every booking and every lead lands in your pocket the moment it happens.",
  },
];

const INCLUDED = [
  "Voice + web chat + SMS receptionist",
  "Done-for-you setup — we build it, you approve it",
  "Your programs and pricing baked in",
  "New leads texted to you instantly",
  "Post-flight follow-up & review engine",
];

const FAQ = [
  {
    q: "Do I keep my business number?",
    a: "Yes — callers dial your normal number; unanswered calls forward to the receptionist. Nothing changes for customers.",
  },
  {
    q: "What happens if it can't answer something?",
    a: "It takes a detailed message and texts you immediately.",
  },
  {
    q: "How fast is it live?",
    a: "Within 48 hours of the setup call.",
  },
  {
    q: "Does it work with my calendar or school software?",
    a: "Google Calendar and Google Sheets out of the box, plus the platform's own built-in calendar and CRM at no extra cost. The platform connects with most popular tools — CRMs, calendars, booking and payment systems — so whatever you already use, we can very likely plug it in.",
  },
  {
    q: "Do I get a calendar or CRM with it?",
    a: "Yes, if you want them. The receptionist runs on a platform with a built-in calendar and CRM — every booking and every captured lead lands there automatically, and you can see everything in one place. Use them as your main system or ignore them entirely; they're included either way.",
  },
];

export default function ReceptionistPage() {
  return (
    <main className="relative min-h-screen bg-[#0b0e0c] text-[#ece9e0]">
      {/* soft sage glow behind the hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px]"
        style={{
          background:
            "radial-gradient(ellipse 720px 360px at 50% 0%, rgba(126,166,135,0.14), transparent 65%)",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-6 pt-24 pb-16 sm:pt-32">
        {/* 1 ─ Hero ─────────────────────────────────────────────── */}
        <section className="text-center">
          <SectionLabel>For flight schools</SectionLabel>
          <h1 className="mt-6 text-4xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-6xl">
            Every missed call is a student who signed up somewhere else.
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-[#a7ada3] sm:text-xl">
            An AI receptionist answers your phone, website chat, and SMS around
            the clock — answers questions about your programs, books discovery
            flights, and texts you every lead.
          </p>
          <div className="mt-10">
            <PrimaryCta href="#demo">Hear it answer a call</PrimaryCta>
          </div>
          <a
            href="#pricing"
            className="mt-5 inline-block text-sm font-medium text-[#8fb496] underline decoration-[#8fb496]/40 underline-offset-4 transition hover:text-[#a8c7ae]"
          >
            or see plans →
          </a>
        </section>

        <Divider />

        {/* 2 ─ Video placeholder ────────────────────────────────── */}
        <section>
          <div className="group relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#131814] to-[#0e120f]">
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-amber-400/40 bg-amber-400/10 transition group-hover:bg-amber-400/20">
                <Play className="h-8 w-8 fill-amber-400 text-amber-400" />
              </div>
              <p className="font-mono text-xs tracking-[0.18em] text-[#a7ada3] uppercase">
                Watch: how it works — 90 seconds
              </p>
            </div>
          </div>
        </section>

        <Divider />

        {/* 3 ─ Live demo ────────────────────────────────────────── */}
        <section id="demo" className="scroll-mt-12 text-center">
          <SectionLabel>Live demo</SectionLabel>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Try it right now
          </h2>
          <div className="mt-10 grid gap-6 text-left sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
              <div className="flex items-center gap-3">
                <PhoneCall className="h-5 w-5 text-[#8fb496]" />
                <h3 className="text-lg font-semibold">Call the demo line</h3>
              </div>
              <a
                href={DEMO_PHONE_TEL}
                className="mt-5 block text-3xl font-semibold tracking-tight text-amber-400 transition hover:text-amber-300 sm:text-[2rem]"
              >
                {DEMO_PHONE}
              </a>
              <p className="mt-4 text-sm leading-relaxed text-[#a7ada3]">
                This is Skye, the demo receptionist for a fictional flight
                academy. Ask it anything — try to book a discovery flight.
              </p>
            </div>
            <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-8">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-[#8fb496]" />
                <h3 className="text-lg font-semibold">Chat with it</h3>
              </div>
              <div className="mt-5 flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-white/15 bg-[#0e120f] px-6 py-10 text-center">
                <MessageSquare className="h-6 w-6 text-white/25" />
                <p className="mt-3 text-sm text-[#a7ada3]">
                  The live chat widget mounts here.
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* 4 ─ Product sections — shared block (src/components/
          ProductSections.tsx), funnel order = receptionist-first. Full-width,
          sits outside the max-w-3xl column like pricing does. */}
      <ProductSections
        order={["receptionist", "reviews", "website", "campaigns"]}
        heading="What you get"
      />

      {/* 4b ─ Why us — right after the product block (Shamil 2026-08-13). */}
      <WhyUs />

      {/* 5 ─ Pricing — moved right after Why us (Shamil 2026-08-13).
          Owner-approved restructure (2026-08-12): three
          billing-period cards (Monthly $97 / 6 months $87/mo / Yearly
          $77/mo), same INCLUDED list on each, all CTAs to PAYMENT_LINK.
          The "$197 one-time setup" line is gone. This section gets a wider
          container (max-w-5xl) than the rest of the page (max-w-3xl) so
          the three cards fit side by side. */}
      <div className="relative mx-auto max-w-5xl px-6">
        <section id="pricing" className="scroll-mt-12">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-10 text-center sm:p-12">
            <SectionLabel>Pricing</SectionLabel>
            <div className="mt-8 grid gap-6 text-left sm:grid-cols-3">
              {PLATFORM_BILLING_PERIODS.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                >
                  <p className="font-mono text-xs font-medium tracking-[0.18em] text-[#8fb496] uppercase">
                    {p.label}
                  </p>
                  <p className="mt-4 text-4xl font-semibold tracking-tight">
                    ${p.perMonth}
                    <span className="text-xl font-normal text-[#a7ada3]">/month</span>
                  </p>
                  <p className="mt-2 text-sm text-[#a7ada3]">{billingPeriodNote(p)}</p>
                  <ul className="mt-6 flex-1 space-y-3">
                    {INCLUDED.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-[#8fb496]" />
                        <span className="text-sm text-[#d8d5cb]">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={PAYMENT_LINKS[p.id]}
                    className="mt-8 inline-block w-full rounded-xl bg-amber-400 px-4 py-3 text-center text-base font-semibold text-[#1a1405] transition hover:bg-amber-300"
                  >
                    Get started now
                  </a>
                </div>
              ))}
            </div>
            <p className="mx-auto mt-6 max-w-xl text-xs leading-relaxed text-[#a7ada3]">
              AI voice minutes are billed separately at cost — you only pay
              for what you use, so a busy month never brings a surprise bill.
            </p>
            <a
              href={CALL_BOOKING_LINK}
              className="mt-8 inline-block text-sm font-medium text-[#8fb496] underline decoration-[#8fb496]/40 underline-offset-4 transition hover:text-[#a8c7ae]"
            >
              Book a 10-minute call first
            </a>
          </div>
        </section>
      </div>

      <div className="relative mx-auto max-w-3xl px-6">
        {/* 6 ─ How it works ─────────────────────────────────────── */}
        <section>
          <SectionLabel>How it works</SectionLabel>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Live in three steps
          </h2>
          <ol className="mt-10 space-y-10">
            {HOW_IT_WORKS.map((step, i) => (
              <li key={step.title} className="flex items-start gap-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-amber-400/40 font-mono text-sm font-semibold text-amber-400">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="mt-2 leading-relaxed text-[#a7ada3]">
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <Divider />
      </div>

      <div className="relative mx-auto max-w-3xl px-6">
        <Divider />

        {/* 7 ─ FAQ ──────────────────────────────────────────────── */}
        <section>
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Questions, answered
          </h2>
          <div className="mt-10 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.02]">
            {FAQ.map(({ q, a }) => (
              <details key={q} className="group px-6 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium [&::-webkit-details-marker]:hidden">
                  {q}
                  <ChevronDown className="h-5 w-5 shrink-0 text-[#8fb496] transition group-open:rotate-180" />
                </summary>
                <p className="mt-3 leading-relaxed text-[#a7ada3]">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <Divider />

        {/* 8 ─ Final CTA + minimal footer ───────────────────────── */}
        <section className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Stop losing students to the voicemail.
          </h2>
          <div className="mt-8">
            <PrimaryCta href="#pricing">Get started now</PrimaryCta>
          </div>
          <p className="mt-16 font-mono text-xs tracking-[0.14em] text-white/30 uppercase">
            Erken Systems · AI receptionist for flight schools
          </p>
        </section>
      </div>
    </main>
  );
}
