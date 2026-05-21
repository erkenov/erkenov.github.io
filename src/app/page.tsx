"use client";

/**
 * v3 — homepage scrolly hero stage.
 *
 * The SphereScrollStage is the foundational layer: a fixed canvas with
 * the cell-dragon visual that lives behind all sections. Each Section
 * is a content layer placed above it with alternating L/R alignment.
 *
 * The previous static sections (Problem / LaptopDemo / FeatureBlocks /
 * etc) are temporarily REMOVED from this page while v3 is being built
 * out scene by scene. They're still in the codebase and will be either
 * folded into a section or restored after the cinematic. Old hero
 * components (PinnedHero, Hero) also still on disk for reference.
 *
 * Playground for trying things before they land here: /sphere-preview
 */

import { Header } from "@/components/Header";
import { SphereScrollStage } from "@/components/SphereScrollStage";
import { Footer } from "@/components/Footer";

const SCENES = [
  {
    side: "left" as const,
    kicker: "Erken Systems",
    headline: "Full-spectrum business systems, with AI inside.",
    body: "I build the whole customer pipeline — voice agents, lead generation, CRM, automations, dashboards. One operator. One system. Five rivers feed it.",
    primaryCta: { label: "Hear it work", href: "#demo" },
    secondaryCta: { label: "See what I build", href: "#how-it-works" },
  },
  {
    side: "right" as const,
    kicker: "Scene 02 · the voice agent",
    headline: "Your AI receptionist picks up. Within two rings.",
    body: "A real voice agent that knows your business, asks the right questions, books the customer, logs every detail. Works at 2 AM the same way it works at 2 PM.",
  },
  {
    side: "left" as const,
    kicker: "Scene 03 · automation",
    headline: "The workflow fires itself.",
    body: "n8n moves the call data into the right places — CRM, calendar, your inbox, the customer's SMS. Every step recorded, every misstep flagged.",
  },
  {
    side: "right" as const,
    kicker: "Scene 04 · the system of record",
    headline: "Every lead lands in your CRM, tagged and routed.",
    body: "GoHighLevel under your brand. Pipelines. Tags. Follow-up automations. Custom fields. You see exactly where every customer is.",
  },
  {
    side: "left" as const,
    kicker: "Scene 05 · the full picture",
    headline: "Voice was one stream. I build the other four too.",
    body: "Lead generation. Email triage. Workflow automation. Reporting dashboards. Same approach, every channel of customer contact lands in the same place — structured, automated, reported.",
  },
];

function Scene({
  kicker,
  headline,
  body,
  side,
  primaryCta,
  secondaryCta,
}: typeof SCENES[number]) {
  const isLeft = side === "left";
  return (
    <section className="min-h-screen flex items-center px-6 md:px-12">
      <div
        className={`w-full md:w-1/2 ${
          isLeft ? "md:mr-auto" : "md:ml-auto"
        } max-w-xl`}
      >
        <div className="mono-label">{kicker}</div>
        <h2
          className="mt-3 text-3xl font-bold tracking-tight md:text-5xl"
          style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
        >
          {headline}
        </h2>
        <p className="mt-5 text-base md:text-lg text-text-muted leading-relaxed">
          {body}
        </p>
        {(primaryCta || secondaryCta) && (
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            {primaryCta && (
              <a
                href={primaryCta.href}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-medium text-bg transition-all hover:bg-accent-hover"
              >
                {primaryCta.label} →
              </a>
            )}
            {secondaryCta && (
              <a
                href={secondaryCta.href}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface/60 px-5 py-3 text-sm font-medium text-text transition-all hover:border-border-strong hover:bg-surface"
              >
                {secondaryCta.label}
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <SphereScrollStage>
          {SCENES.map((s, i) => (
            <Scene key={i} {...s} />
          ))}
          {/* Trailing space so the scroll-tween has room to finish */}
          <div className="h-[20vh]" />
        </SphereScrollStage>
      </main>
      <Footer />
    </>
  );
}
