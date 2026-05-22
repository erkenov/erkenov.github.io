"use client";

/**
 * v3 preview — sphere travels through alternating L/R sections on scroll.
 * Visit http://localhost:3000/sphere-preview
 */

import { SphereScrollStage } from "@/components/SphereScrollStage";

const SECTIONS = [
  {
    side: "left" as const,
    kicker: "Erken Systems",
    headline: "Full-spectrum business systems, with AI inside.",
    body: "Every business runs the same pipeline — leads come in, get captured, get tracked, get reported on. I build all four steps as one system. Workflow automation is the wiring between them. One operator. One system. Any business.",
    cta: "Show the demo",
  },
  {
    side: "right" as const,
    kicker: "Lead generation",
    headline: "Where your next ten customers come from.",
    body: "Your channel, my approach. Google Maps scraping for local businesses. Cold email at scale. Meta Business AI agents on Instagram and Facebook ads. LinkedIn outreach when the work is white-collar. Every method ends the same way — leads land structured, ready for the next step.",
  },
  {
    side: "left" as const,
    kicker: "Lead capture",
    headline: "Every channel answered.",
    body: "Your website, built right and wired to the pipeline. AI voice receptionist that picks up in two rings, qualifies the caller, books the appointment. Web chat that answers product questions and books calls. WhatsApp Business and Instagram DMs integrated through the same flow. Forms routed straight to the pipeline. Leads can come from anywhere — they all land in one place.",
  },
  {
    side: "right" as const,
    kicker: "Lead management",
    headline: "Every lead tracked, every follow-up automated.",
    body: "Three ways we wire this up. Google Sheets — lean and free. GoHighLevel — the industry standard, you sign up directly. Or the Erken Systems platform — your CRM, calendar, email, SMS, and follow-up workflows all under one branded login. Already using Salesforce, HubSpot, Pipedrive? Same approach, I learn your stack. Every lead tagged, every follow-up automated, every channel logged.",
  },
  {
    side: "left" as const,
    kicker: "The control panel",
    headline: "Everything in one view.",
    body: "Calls, chats, forms, emails, deals — all visible in one dashboard. Workflow automation runs underneath everything, moving data between tools without you touching a thing. You see exactly where every customer is. The system is the product.",
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
