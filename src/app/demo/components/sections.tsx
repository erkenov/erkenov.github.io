"use client";

/**
 * /demo/[industry] template sections, part 1: Nav, Hero (full-bleed
 * photography), Mission statement, Stats, Services (alternating
 * photo/text modules), About, Steps. All content flows in from
 * DemoConfig — nothing industry-specific lives here.
 *
 * Structure borrows the rhythm of premium aviation-brand sites: one
 * photography-led hero, one clear mission statement, services as calm
 * alternating image/text modules, generous whitespace, a single strong
 * CTA. Palette and copy come entirely from the industry theme tokens.
 */

import Image from "next/image";
import { ArrowRight, Clock, MapPin, Mic, Phone } from "lucide-react";
import type { DemoConfig } from "../config";
import {
  DemoIcon,
  Kicker,
  PrimaryButton,
  Reveal,
  SecondaryButton,
  SectionHeading,
} from "./primitives";

declare global {
  interface Window {
    __startDemoVoiceCall?: () => void;
  }
}

export function startDemoCall() {
  window.__startDemoVoiceCall?.();
}

function scrollToBooking() {
  document
    .getElementById("demo-booking")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** Headline with an optional accent-colored substring. */
function AccentedText({ text, accent }: { text: string; accent?: string }) {
  if (!accent || !text.includes(accent)) return <>{text}</>;
  const [before, after] = text.split(accent);
  return (
    <>
      {before}
      <span style={{ color: "var(--d-accent)" }}>{accent}</span>
      {after}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Nav                                                                 */
/* ------------------------------------------------------------------ */

export function DemoNav({ config }: { config: DemoConfig }) {
  return (
    <header
      className="fixed inset-x-0 top-0 z-40 border-b"
      style={{
        borderColor: "color-mix(in srgb, var(--d-border) 70%, transparent)",
        background: "color-mix(in srgb, var(--d-bg) 82%, transparent)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
        <a href="#" className="flex items-center gap-3">
          <span style={{ color: "var(--d-accent)" }}>
            <DemoIcon name={config.business.icon} className="h-5 w-5" />
          </span>
          <span
            className="text-sm font-semibold uppercase"
            style={{ letterSpacing: "0.14em", color: "var(--d-text)" }}
          >
            {config.business.short}
          </span>
          <span
            className="hidden h-4 w-px lg:block"
            style={{ background: "var(--d-border-strong)" }}
            aria-hidden
          />
          <span
            className="hidden font-mono text-xs uppercase lg:block"
            style={{ letterSpacing: "0.1em", color: "var(--d-text-dim)" }}
          >
            {config.business.tagline}
          </span>
        </a>
        <div className="flex items-center gap-3">
          <span
            className="hidden items-center gap-2 text-sm md:flex"
            style={{ color: "var(--d-text-muted)" }}
          >
            <Phone className="h-4 w-4" />
            {config.business.phoneDisplay}
          </span>
          {config.voice.enabled ? (
            <button
              onClick={startDemoCall}
              className="hidden items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors sm:inline-flex"
              style={{ borderColor: "var(--d-border-strong)", color: "var(--d-text)" }}
            >
              <Mic className="h-4 w-4" style={{ color: "var(--d-accent)" }} />
              {config.voice.buttonLabel}
            </button>
          ) : null}
          <button
            onClick={scrollToBooking}
            className="rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
            style={{ background: "var(--d-accent)", color: "var(--d-accent-text)" }}
          >
            {config.hero.primaryCta}
          </button>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Hero — full-bleed photograph, text over a bottom gradient           */
/* ------------------------------------------------------------------ */

export function HeroSection({ config }: { config: DemoConfig }) {
  const h = config.hero;
  return (
    <section className="relative flex min-h-[92svh] items-end overflow-hidden">
      <style>{`
        @keyframes demoHeroZoom { from { transform: scale(1.07); } to { transform: scale(1); } }
        @media (prefers-reduced-motion: no-preference) {
          .demo-hero-zoom { animation: demoHeroZoom 16s cubic-bezier(0.16, 1, 0.3, 1) both; }
        }
      `}</style>
      <div className="demo-hero-zoom absolute inset-0">
        <Image
          src={h.image}
          alt={h.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      {/* Legibility gradient — page bg at the base so the hero melts into the next section. */}
      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          background:
            "linear-gradient(to top, var(--d-bg) 0%, color-mix(in srgb, var(--d-bg) 62%, transparent) 34%, color-mix(in srgb, var(--d-bg) 18%, transparent) 62%, color-mix(in srgb, var(--d-bg) 38%, transparent) 100%)",
        }}
      />
      <div className="relative mx-auto w-full max-w-7xl px-6 pb-16 pt-40 md:px-8 md:pb-24">
        <Reveal>
          <Kicker light>{h.kicker}</Kicker>
        </Reveal>
        <Reveal delay={0.08}>
          <h1
            className="mt-6 max-w-3xl text-4xl font-bold md:text-[3.25rem] lg:text-[4.5rem]"
            style={{
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              color: "var(--d-dark-text)",
            }}
          >
            <AccentedText text={h.headline} accent={h.headlineAccent} />
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p
            className="mt-6 max-w-xl text-base md:text-lg"
            style={{ color: "var(--d-dark-muted)", lineHeight: 1.6 }}
          >
            {h.sub}
          </p>
        </Reveal>
        <Reveal delay={0.24} className="mt-8 flex flex-wrap items-center gap-3">
          <PrimaryButton onClick={scrollToBooking}>{h.primaryCta}</PrimaryButton>
          {config.voice.enabled ? (
            <SecondaryButton light onClick={startDemoCall}>
              <Mic className="h-4 w-4" style={{ color: "var(--d-accent)" }} />
              {h.secondaryCta}
            </SecondaryButton>
          ) : null}
        </Reveal>
        <Reveal delay={0.32}>
          <div
            className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t pt-6"
            style={{ borderColor: "rgba(255,255,255,0.14)" }}
          >
            <span
              className="flex items-center gap-2 font-mono text-xs uppercase"
              style={{ letterSpacing: "0.08em", color: "var(--d-dark-muted)" }}
            >
              <MapPin className="h-3.5 w-3.5" />
              {config.business.location}
            </span>
            <span
              className="flex items-center gap-2 font-mono text-xs uppercase"
              style={{ letterSpacing: "0.08em", color: "var(--d-dark-muted)" }}
            >
              <Clock className="h-3.5 w-3.5" />
              {config.business.hours}
            </span>
            {h.badge ? (
              <span
                className="font-mono text-xs uppercase"
                style={{ letterSpacing: "0.08em", color: "var(--d-accent)" }}
              >
                {h.badge}
              </span>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Mission — one clear statement + value words                         */
/* ------------------------------------------------------------------ */

export function MissionSection({ config }: { config: DemoConfig }) {
  const m = config.mission;
  if (!m) return null;
  return (
    <section className="mx-auto max-w-4xl px-6 py-24 md:px-8 md:py-32">
      <Reveal className="flex flex-col items-center text-center">
        <Kicker>{m.kicker}</Kicker>
        <p
          className="mt-8 text-2xl font-medium md:text-[2rem]"
          style={{
            letterSpacing: "-0.02em",
            lineHeight: 1.3,
            color: "var(--d-text)",
          }}
        >
          <AccentedText text={m.statement} accent={m.statementAccent} />
        </p>
        {m.sub ? (
          <p
            className="mt-6 max-w-xl text-base"
            style={{ color: "var(--d-text-muted)", lineHeight: 1.6 }}
          >
            {m.sub}
          </p>
        ) : null}
      </Reveal>
      {m.values?.length ? (
        <Reveal delay={0.12}>
          <div className="mt-16 flex flex-wrap items-center justify-center gap-y-4">
            {m.values.map((v, i) => (
              <span key={v} className="flex items-center">
                {i > 0 ? (
                  <span
                    aria-hidden
                    className="mx-6 hidden h-4 w-px sm:block md:mx-8"
                    style={{ background: "var(--d-border-strong)" }}
                  />
                ) : null}
                <span
                  className="px-4 font-mono text-xs font-medium uppercase sm:px-0"
                  style={{ letterSpacing: "0.2em", color: "var(--d-text-muted)" }}
                >
                  {v}
                </span>
              </span>
            ))}
          </div>
        </Reveal>
      ) : null}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Stats                                                               */
/* ------------------------------------------------------------------ */

export function StatsSection({ config }: { config: DemoConfig }) {
  if (!config.stats?.length) return null;
  return (
    <section
      className="border-y"
      style={{ borderColor: "var(--d-border)", background: "var(--d-surface2)" }}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-8 gap-y-10 px-6 py-14 md:grid-cols-4 md:px-8 md:py-16">
        {config.stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.06}>
            <div
              className="font-mono text-3xl font-semibold md:text-4xl"
              style={{ color: "var(--d-text)", letterSpacing: "-0.02em" }}
            >
              {s.value}
            </div>
            <div className="mt-2 text-sm" style={{ color: "var(--d-text-muted)" }}>
              {s.label}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Services — alternating photo/text modules + compact extras          */
/* ------------------------------------------------------------------ */

export function ServicesSection({ config }: { config: DemoConfig }) {
  const s = config.services;
  if (!s) return null;
  const featured = s.items.filter((i) => i.image);
  const compact = s.items.filter((i) => !i.image);
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-32">
      <SectionHeading kicker={s.kicker} headline={s.headline} sub={s.sub} />

      <div className="mt-16 flex flex-col gap-20 md:mt-24 md:gap-28">
        {featured.map((item, i) => {
          const imageRight = i % 2 === 1;
          return (
            <div
              key={item.title}
              className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
            >
              <Reveal className={imageRight ? "lg:order-2" : ""}>
                <div
                  className="relative aspect-[4/3] overflow-hidden rounded-xl border"
                  style={{ borderColor: "var(--d-border)" }}
                >
                  <Image
                    src={item.image!}
                    alt={item.imageAlt ?? item.title}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
              <Reveal delay={0.1} className={imageRight ? "lg:order-1" : ""}>
                <div
                  className="font-mono text-sm font-medium"
                  style={{ color: "var(--d-accent)", letterSpacing: "0.1em" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3
                  className="mt-4 text-2xl font-semibold md:text-3xl"
                  style={{ color: "var(--d-text)", letterSpacing: "-0.02em" }}
                >
                  {item.title}
                </h3>
                <p
                  className="mt-4 max-w-md text-base"
                  style={{ color: "var(--d-text-muted)", lineHeight: 1.7 }}
                >
                  {item.body}
                </p>
                {item.price ? (
                  <div
                    className="mt-6 font-mono text-sm font-medium"
                    style={{ color: "var(--d-accent)", letterSpacing: "0.05em" }}
                  >
                    {item.price}
                  </div>
                ) : null}
                <button
                  onClick={scrollToBooking}
                  className="mt-8 inline-flex items-center gap-2 text-sm font-medium transition-colors"
                  style={{ color: "var(--d-text)" }}
                >
                  Check availability
                  <ArrowRight className="h-4 w-4" style={{ color: "var(--d-accent)" }} />
                </button>
              </Reveal>
            </div>
          );
        })}
      </div>

      {compact.length ? (
        <div className="mt-20 md:mt-28">
          <Reveal className="flex items-center gap-4">
            <span
              className="font-mono text-xs font-medium uppercase"
              style={{ letterSpacing: "0.18em", color: "var(--d-text-dim)" }}
            >
              {s.moreLabel ?? "More"}
            </span>
            <span
              aria-hidden
              className="h-px flex-1"
              style={{ background: "var(--d-border)" }}
            />
          </Reveal>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {compact.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <div
                  className="flex h-full flex-col rounded-xl border p-8"
                  style={{
                    background: "var(--d-surface)",
                    borderColor: "var(--d-border)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span style={{ color: "var(--d-accent)" }}>
                      <DemoIcon name={item.icon} className="h-5 w-5" />
                    </span>
                    <h4
                      className="text-lg font-semibold"
                      style={{ color: "var(--d-text)", letterSpacing: "-0.01em" }}
                    >
                      {item.title}
                    </h4>
                  </div>
                  <p
                    className="mt-3 flex-1 text-sm"
                    style={{ color: "var(--d-text-muted)", lineHeight: 1.6 }}
                  >
                    {item.body}
                  </p>
                  {item.price ? (
                    <div
                      className="mt-5 font-mono text-sm font-medium"
                      style={{ color: "var(--d-accent)" }}
                    >
                      {item.price}
                    </div>
                  ) : null}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* About                                                               */
/* ------------------------------------------------------------------ */

export function AboutSection({ config }: { config: DemoConfig }) {
  const a = config.about;
  if (!a) return null;
  return (
    <section
      className="border-y"
      style={{ borderColor: "var(--d-border)", background: "var(--d-surface2)" }}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:px-8 md:py-32 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div
            className="relative aspect-[4/3] overflow-hidden rounded-xl border"
            style={{ borderColor: "var(--d-border)" }}
          >
            <Image
              src={a.image}
              alt={a.imageAlt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
        <div>
          <SectionHeading kicker={a.kicker} headline={a.headline} />
          <div className="mt-6 flex flex-col gap-4">
            {a.paragraphs.map((p) => (
              <Reveal key={p.slice(0, 24)}>
                <p
                  className="text-base"
                  style={{ color: "var(--d-text-muted)", lineHeight: 1.7 }}
                >
                  {p}
                </p>
              </Reveal>
            ))}
          </div>
          <ul className="mt-8 flex flex-col">
            {a.bullets.map((b, i) => (
              <Reveal key={b} delay={i * 0.05}>
                <li
                  className="flex items-baseline gap-4 border-t py-3.5"
                  style={{ borderColor: "var(--d-border)" }}
                >
                  <span
                    className="font-mono text-xs font-medium"
                    style={{ color: "var(--d-accent)", letterSpacing: "0.05em" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm" style={{ color: "var(--d-text)" }}>
                    {b}
                  </span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Steps                                                               */
/* ------------------------------------------------------------------ */

export function StepsSection({ config }: { config: DemoConfig }) {
  const s = config.steps;
  if (!s) return null;
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-32">
      <SectionHeading kicker={s.kicker} headline={s.headline} sub={s.sub} center />
      <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
        {s.items.map((step, i) => (
          <Reveal key={step.title} delay={i * 0.1}>
            <div
              className="border-t pt-6"
              style={{ borderColor: "var(--d-border-strong)" }}
            >
              <div
                className="font-mono text-sm font-medium"
                style={{ color: "var(--d-accent)", letterSpacing: "0.1em" }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3
                className="mt-4 text-xl font-semibold"
                style={{ color: "var(--d-text)", letterSpacing: "-0.02em" }}
              >
                {step.title}
              </h3>
              <p
                className="mt-3 text-sm"
                style={{ color: "var(--d-text-muted)", lineHeight: 1.6 }}
              >
                {step.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
