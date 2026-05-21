"use client";

/**
 * v3 preview — sphere travels through alternating L/R sections on scroll.
 * Visit http://localhost:3000/sphere-preview
 */

import { SphereScrollStage } from "@/components/SphereScrollStage";

const SECTIONS = [
  {
    side: "left" as const,
    kicker: "v3 · scene 01",
    headline: "Full-spectrum business systems.",
    body: "I build the whole customer pipeline — voice agents, lead generation, CRM, workflows, dashboards. Same operator. One system.",
    cta: "Show the demo",
  },
  {
    side: "right" as const,
    kicker: "v3 · scene 02",
    headline: "The voice agent answers.",
    body: "Sage-green particles in motion = audio amplitude of the live Retell call. Your agent picks up, qualifies, books. You never lifted a finger.",
  },
  {
    side: "left" as const,
    kicker: "v3 · scene 03",
    headline: "The workflow fires.",
    body: "Call ends. n8n picks up the structured data. Particles thread through the nodes — each one lights up as it executes. Output: a CRM contact, an SMS to the customer, a notification to you.",
  },
  {
    side: "right" as const,
    kicker: "v3 · scene 04",
    headline: "The CRM lands the lead.",
    body: "Your GoHighLevel pipeline, branded as Erken Systems. The new lead enters the funnel, tagged by intent, routed by urgency. Your morning report tomorrow will show it.",
  },
  {
    side: "left" as const,
    kicker: "v3 · scene 05",
    headline: "Voice was one of five.",
    body: "Five streams feed the same system: lead gen, voice + chat + WhatsApp, CRM + email triage, automation glue, reporting. I build all five. You see one system, not five tools.",
  },
];

function Section({ kicker, headline, body, side, cta }: typeof SECTIONS[number]) {
  const isLeft = side === "left";
  return (
    <section className="min-h-screen flex items-center px-6 md:px-12">
      <div className={`w-full md:w-1/2 ${isLeft ? "md:mr-auto" : "md:ml-auto"} max-w-xl`}>
        <div className="mono-label">{kicker}</div>
        <h2
          className="mt-3 text-3xl md:text-5xl font-bold tracking-tight"
          style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
        >
          {headline}
        </h2>
        <p className="mt-5 text-base md:text-lg text-text-muted leading-relaxed">
          {body}
        </p>
        {cta && (
          <button className="mt-7 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-medium text-bg transition-all hover:bg-accent-hover">
            {cta} →
          </button>
        )}
      </div>
    </section>
  );
}

export default function SpherePreviewPage() {
  return (
    <SphereScrollStage>
      {SECTIONS.map((s, i) => <Section key={i} {...s} />)}
      {/* Trailing space so scroll has room to finish its tween */}
      <div className="h-[20vh]" />
    </SphereScrollStage>
  );
}
