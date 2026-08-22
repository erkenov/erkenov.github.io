"use client";

/**
 * ported.tsx — sections ported VERBATIM-STYLE from the live homepage
 * (home-v8-draft) into the /fly-home draft, per Shamil's review notes
 * 2026-08-22: "make it same as on my website."
 *
 *  - FlyHeader: the main-site header (Products mega menu, How it works,
 *    Pricing, phone, "Get started") — with the "· for flight schools"
 *    tag kept, the Industries link dropped (no industries section here),
 *    the phone number swapped to the demo line, and "Talk to us" replaced
 *    by "Talk to your future AI receptionist" (tel:).
 *  - StackComparisonSection: IDENTICAL to the live one (14 rows, real
 *    tool logos via STACK_LOGOS, platform price from the pricing lib) —
 *    only the CTA points at the on-page pricing anchor.
 *  - IntegrationsMarquee: identical to the live one (real logos ticker).
 */

import { Fragment } from "react";
import { motion } from "framer-motion";
import {
  Check,
  ChevronDown,
  Globe,
  Megaphone,
  Phone,
  PhoneCall,
  Star,
} from "lucide-react";
import Link from "next/link";
import { STACK_LOGOS } from "../home-v8-draft/stack-logos";
import { INTEGRATION_LOGOS } from "../home-v8-draft/integration-logos";
import { PLATFORM_HEADLINE_MONTHLY } from "@/lib/pricing";

const ease = [0.16, 1, 0.3, 1] as const;
const DEMO_TEL = "+13252412460";
const DEMO_DISPLAY = "(325) 241-2460";

/* ------------------------------------------------------------------ */
/* Header — main-site menu, flight-school tag kept (Shamil 2026-08-22) */
/* ------------------------------------------------------------------ */
export function FlyHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-8">
        <Link
          href="/fly-home"
          className="font-mono text-sm font-medium tracking-tight uppercase text-text"
        >
          erken<span className="text-accent"> </span>systems
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <div className="group relative">
            <button
              type="button"
              className="flex items-center gap-1 text-sm text-text-muted transition-colors hover:text-text"
            >
              Products
              <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
            </button>
            <div className="invisible absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <div className="w-96 rounded-2xl border border-border bg-surface p-3 shadow-xl">
                {[
                  { icon: Globe, name: "Website", desc: "Built to be found on Google — and to turn visitors into customers.", href: "#product-website" },
                  { icon: PhoneCall, name: "AI receptionist", desc: "Answers every call, text, and chat 24/7 — and books the job.", href: "#product-receptionist" },
                  { icon: Star, name: "Review engine", desc: "A flood of fresh 5-star reviews, on autopilot.", href: "#product-reviews" },
                  { icon: Megaphone, name: "Campaigns & referrals", desc: "One-click campaigns that bring past customers back — with friends.", href: "#product-campaigns" },
                ].map(({ icon: Icon, name, desc, href }) => (
                  <a
                    key={href}
                    href={href}
                    className="flex items-start gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-surface-2"
                  >
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-accent/25 bg-accent/10 text-accent">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-text">{name}</span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-text-muted">{desc}</span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
          <a href="#process" className="text-sm text-text-muted transition-colors hover:text-text">
            How it works
          </a>
          <a href="#pricing" className="text-sm text-text-muted transition-colors hover:text-text">
            Pricing
          </a>
          <a
            href={`tel:${DEMO_TEL}`}
            className="flex items-center gap-1.5 font-mono text-sm text-text-muted transition-colors hover:text-text"
          >
            <Phone className="h-3.5 w-3.5" />
            {DEMO_DISPLAY}
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <a
            href={`tel:${DEMO_TEL}`}
            aria-label={`Call ${DEMO_DISPLAY}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-muted transition-colors hover:border-border-strong hover:text-text md:hidden"
          >
            <Phone className="h-4 w-4" />
          </a>
          <a
            href="#pricing"
            className="rounded-lg bg-[linear-gradient(90deg,#8D63DA,#1C71DF)] px-4 py-2 text-sm font-medium text-white transition-all hover:brightness-110"
          >
            Get started
          </a>
          {/* Right of "Get started", outlined like the hero's secondary
              button (Shamil 2026-08-22). */}
          <a
            href={`tel:${DEMO_TEL}`}
            className="hidden rounded-lg border border-border px-4 py-2 text-sm font-medium text-text transition-all hover:border-border-strong hover:bg-surface lg:block"
          >
            Talk to your future AI receptionist
          </a>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Stack comparison — VERBATIM port of the live table (14 rows, logos) */
/* ------------------------------------------------------------------ */
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

export function StackComparisonSection() {
  return (
    <section id="replace-your-stack" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease }}
          className="max-w-2xl"
        >
          <div className="mono-label">Replace your whole stack</div>
          <h2
            className="mt-3 text-3xl font-bold tracking-tight md:text-5xl"
            style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
          >
            One platform instead of fourteen subscriptions.
          </h2>
          <p className="mt-4 text-base text-text-muted md:text-lg">
            Everything below is included — platform and AI receptionist under
            one login, one bill, from ${PLATFORM_HEADLINE_MONTHLY}/mo.
          </p>
        </motion.div>

        {/* DESKTOP */}
        <div className="relative mb-24 mt-10 hidden md:block">
          <div className="grid grid-cols-[1.15fr_1.6fr_0.65fr_150px] overflow-hidden rounded-t-2xl rounded-bl-2xl shadow-[0_18px_50px_-24px_rgba(42,38,32,0.35)]">
            <div className="bg-[var(--accent-soft)] px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.08em] text-text">Category</div>
            <div className="bg-[var(--accent-soft)] px-3 py-3.5 font-mono text-[11px] uppercase tracking-[0.08em] text-text">The tools you&apos;d buy</div>
            <div className="bg-[var(--accent-soft)] px-3 py-3.5 font-mono text-[11px] uppercase tracking-[0.08em] text-text">Price on its own</div>
            <div className="flex items-center justify-center bg-accent px-3 py-3.5 text-center font-mono text-[11px] uppercase tracking-[0.08em] text-white">
              Platform ${PLATFORM_HEADLINE_MONTHLY}
            </div>
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
                  ${PLATFORM_HEADLINE_MONTHLY}
                </span>
                <span className="mb-0.5 text-sm font-medium text-white/85">/mo</span>
              </div>
              <div className="text-[11px] font-medium text-white/85">all included</div>
            </div>
          </div>
          <div className="absolute right-0 top-full w-[150px] rounded-b-2xl bg-accent px-3 pb-4 pt-3 text-center shadow-[0_18px_40px_-16px_rgba(126,166,135,0.85)]">
            <a
              href="#pricing"
              className="inline-flex w-full items-center justify-center gap-1 rounded-lg bg-[linear-gradient(90deg,#8D63DA,#1C71DF)] px-3 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:brightness-110 hover:scale-[1.02]"
            >
              Get started →
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
          <div
            className="relative mt-4 overflow-hidden rounded-2xl p-6 text-white shadow-[0_18px_44px_-18px_rgba(126,166,135,0.75)]"
            style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-hover))" }}
          >
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold tracking-tight" style={{ letterSpacing: "-0.03em" }}>
                ${PLATFORM_HEADLINE_MONTHLY}
              </span>
              <span className="mb-1 text-base font-medium text-white/85">/mo, everything included</span>
            </div>
            <div className="mt-1 text-sm text-white/90">
              About <b>${(STACK_TOTAL - PLATFORM_HEADLINE_MONTHLY).toLocaleString()} a month</b> back in
              your pocket.
            </div>
            <a
              href="#pricing"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[linear-gradient(90deg,#8D63DA,#1C71DF)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110 hover:scale-[1.02]"
            >
              Get started →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Integrations marquee — VERBATIM port of the live ticker             */
/* ------------------------------------------------------------------ */
export function IntegrationsMarquee() {
  return (
    <section id="integrations" className="pt-20 pb-10 md:pt-28 md:pb-14">
      <div className="mx-auto max-w-3xl px-6 text-center md:px-8">
        <div className="mono-label">Integrations</div>
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
