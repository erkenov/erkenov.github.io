"use client";

/**
 * /demo/[industry] template sections, part 1: Nav, Hero, Stats,
 * Services, About, Steps. All content flows in from DemoConfig —
 * nothing industry-specific lives here.
 */

import Image from "next/image";
import { Mic, Phone, MapPin, Clock } from "lucide-react";
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

/* ------------------------------------------------------------------ */
/* Nav                                                                 */
/* ------------------------------------------------------------------ */

export function DemoNav({ config }: { config: DemoConfig }) {
  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-md"
      style={{
        borderColor: "var(--d-border)",
        background: "color-mix(in srgb, var(--d-bg) 85%, transparent)",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-8">
        <a href="#" className="flex items-center gap-2.5">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white"
            style={{ background: "var(--d-accent)" }}
          >
            <DemoIcon name="plane" className="h-5 w-5" />
          </span>
          <span
            className="text-base font-semibold"
            style={{ letterSpacing: "-0.02em", color: "var(--d-text)" }}
          >
            {config.business.name}
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
              style={{ borderColor: "var(--d-border)", color: "var(--d-text)" }}
            >
              <Mic className="h-4 w-4" style={{ color: "var(--d-accent)" }} />
              {config.voice.buttonLabel}
            </button>
          ) : null}
          <button
            onClick={scrollToBooking}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:scale-[1.02]"
            style={{ background: "var(--d-accent)" }}
          >
            {config.hero.primaryCta}
          </button>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

function AccentedHeadline({
  text,
  accent,
}: {
  text: string;
  accent?: string;
}) {
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

export function HeroSection({ config }: { config: DemoConfig }) {
  const h = config.hero;
  return (
    <section className="mx-auto max-w-7xl px-6 pb-20 pt-12 md:px-8 md:pb-24 md:pt-16">
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <Reveal>
            <Kicker>{h.kicker}</Kicker>
          </Reveal>
          <Reveal delay={0.08}>
            <h1
              className="mt-4 text-4xl font-bold md:text-5xl lg:text-[3.25rem]"
              style={{ letterSpacing: "-0.03em", lineHeight: 1.1, color: "var(--d-text)" }}
            >
              <AccentedHeadline text={h.headline} accent={h.headlineAccent} />
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p
              className="mt-6 max-w-xl text-base md:text-lg"
              style={{ color: "var(--d-text-muted)", lineHeight: 1.6 }}
            >
              {h.sub}
            </p>
          </Reveal>
          <Reveal delay={0.24} className="mt-8 flex flex-wrap items-center gap-3">
            <PrimaryButton onClick={scrollToBooking}>{h.primaryCta}</PrimaryButton>
            {config.voice.enabled ? (
              <SecondaryButton onClick={startDemoCall}>
                <Mic className="h-4 w-4" style={{ color: "var(--d-accent)" }} />
                {h.secondaryCta}
              </SecondaryButton>
            ) : null}
          </Reveal>
          <Reveal delay={0.32} className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            <span
              className="flex items-center gap-2 text-sm"
              style={{ color: "var(--d-text-dim)" }}
            >
              <MapPin className="h-4 w-4" />
              {config.business.location}
            </span>
            <span
              className="flex items-center gap-2 text-sm"
              style={{ color: "var(--d-text-dim)" }}
            >
              <Clock className="h-4 w-4" />
              {config.business.hours}
            </span>
          </Reveal>
        </div>
        <Reveal delay={0.15}>
          <div
            className="relative aspect-[4/3] overflow-hidden rounded-2xl border"
            style={{ borderColor: "var(--d-border)" }}
          >
            <Image
              src={h.image}
              alt={h.imageAlt}
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
            {h.badge ? (
              <span
                className="absolute bottom-4 left-4 rounded-lg px-3 py-1.5 font-mono text-xs font-medium text-white"
                style={{
                  background: "color-mix(in srgb, var(--d-dark) 80%, transparent)",
                  letterSpacing: "0.05em",
                }}
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
/* Stats                                                               */
/* ------------------------------------------------------------------ */

export function StatsSection({ config }: { config: DemoConfig }) {
  if (!config.stats?.length) return null;
  return (
    <section
      className="border-y"
      style={{ borderColor: "var(--d-border)", background: "var(--d-surface)" }}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4 md:px-8">
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
/* Services                                                            */
/* ------------------------------------------------------------------ */

export function ServicesSection({ config }: { config: DemoConfig }) {
  const s = config.services;
  if (!s) return null;
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-32">
      <SectionHeading kicker={s.kicker} headline={s.headline} sub={s.sub} />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {s.items.map((item, i) => (
          <Reveal key={item.title} delay={(i % 3) * 0.08}>
            <div
              className="flex h-full flex-col rounded-2xl border p-8 transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: "var(--d-surface)",
                borderColor: "var(--d-border)",
              }}
            >
              <span
                className="flex h-11 w-11 items-center justify-center rounded-lg"
                style={{ background: "var(--d-accent-soft)", color: "var(--d-accent)" }}
              >
                <DemoIcon name={item.icon} className="h-5 w-5" />
              </span>
              <h3
                className="mt-6 text-xl font-semibold"
                style={{ color: "var(--d-text)", letterSpacing: "-0.02em" }}
              >
                {item.title}
              </h3>
              <p
                className="mt-3 flex-1 text-sm"
                style={{ color: "var(--d-text-muted)", lineHeight: 1.6 }}
              >
                {item.body}
              </p>
              {item.price ? (
                <div
                  className="mt-6 font-mono text-sm font-medium"
                  style={{ color: "var(--d-accent)" }}
                >
                  {item.price}
                </div>
              ) : null}
            </div>
          </Reveal>
        ))}
      </div>
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
    <section style={{ background: "var(--d-surface2)" }}>
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:px-8 md:py-32 lg:grid-cols-2">
        <Reveal>
          <div
            className="relative aspect-[4/3] overflow-hidden rounded-2xl border"
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
          <ul className="mt-8 flex flex-col gap-3">
            {a.bullets.map((b, i) => (
              <Reveal key={b} delay={i * 0.05}>
                <li className="flex items-start gap-3">
                  <span
                    className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                    style={{
                      background: "var(--d-accent-soft)",
                      color: "var(--d-accent)",
                    }}
                  >
                    <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
                      <path
                        d="M2.5 6.5 5 9l4.5-5.5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
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
      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {s.items.map((step, i) => (
          <Reveal key={step.title} delay={i * 0.1}>
            <div
              className="h-full rounded-2xl border p-8"
              style={{
                background: "var(--d-surface)",
                borderColor: "var(--d-border)",
              }}
            >
              <div
                className="font-mono text-sm font-medium"
                style={{ color: "var(--d-accent)", letterSpacing: "0.05em" }}
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
