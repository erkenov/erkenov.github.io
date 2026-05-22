"use client";

/**
 * v3 preview — sphere travels through alternating L/R sections on scroll.
 * Visit http://localhost:3000/sphere-preview
 */

import { SphereScrollStage } from "@/components/SphereScrollStage";
import { MacbookFrame3D } from "@/components/MacbookFrame3D";
import { Scene2Channels } from "@/components/Scene2Channels";
import { Scene4CrmTabs } from "@/components/Scene4CrmTabs";

const SECTIONS = [
  {
    side: "left" as const,
    kicker: "Erken Systems",
    headline: "Full-spectrum business systems, with AI inside.",
    body: "Every business runs the same pipeline — leads come in, get captured, get tracked, get reported on. I build all four steps — bundled as one connected system, or piece by piece. Pick what you're missing. Workflow automation is the wiring between them. One operator. Any business.",
    cta: "Show the demo",
  },
  {
    side: "right" as const,
    kicker: "Lead generation",
    headline: "Where your next ten customers come from.",
    body: "Your channel, my approach. Google Maps scraping for local businesses. Cold email at scale. AI voice agent that runs outbound calls — qualifies, pitches, books. Meta Business AI agents on Instagram and Facebook ads. LinkedIn outreach when the work is white-collar. Every method ends the same way — leads land structured, ready for the next step.",
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
    body: "Three ways we wire this up. Google Sheets — lean and free. GoHighLevel — the industry standard, you sign up directly. Or the Erken Systems platform — your CRM, calendar, email, SMS, and follow-up workflows, all in one place. Already using Salesforce, HubSpot, Pipedrive? Same approach, I learn your stack. Every lead tagged, every follow-up automated, every channel logged.",
  },
  {
    side: "left" as const,
    kicker: "The control panel",
    headline: "Your whole operation, one screen.",
    body: "Calls, chats, forms, emails, deals — all visible in one dashboard. Workflow automation runs underneath everything, moving data between tools without you touching a thing. You see exactly where every customer is. Your operation runs. You read the dashboard.",
  },
];

type SectionProps = typeof SECTIONS[number] & {
  media?: React.ReactNode;
  /** Full wrapper className for the absolute media container. Default is
   *  set for the 3D MacBook (large transparent canvas extending past the
   *  section). Compact HTML media (carousel/tabs) should override with a
   *  tighter wrapper that sits within the section bounds. */
  mediaWrapperClassName?: string;
};

const DEFAULT_MEDIA_WRAPPER = (isLeft: boolean) =>
  `absolute -top-[55vh] -bottom-[10vh] ${isLeft ? "-right-12" : "-left-12"} hidden md:flex md:w-[90%] items-center justify-center px-2 lg:px-4 pointer-events-none`;

function Section({
  kicker,
  headline,
  body,
  side,
  cta,
  media,
  mediaWrapperClassName,
}: SectionProps) {
  const isLeft = side === "left";
  const wrapperClass = mediaWrapperClassName ?? DEFAULT_MEDIA_WRAPPER(isLeft);
  return (
    <section className="relative min-h-screen flex items-center px-6 md:px-12">
      <div className={`relative z-30 w-full md:w-1/2 ${isLeft ? "md:mr-auto" : "md:ml-auto"} max-w-xl`}>
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
      {media && <div className={wrapperClass}>{media}</div>}
    </section>
  );
}

export default function SpherePreviewPage() {
  return (
    <SphereScrollStage>
      {SECTIONS.map((s, i) => (
        <Section
          key={i}
          {...s}
          media={
            i === 1 ? <Scene2Channels />
            : i === 3 ? <Scene4CrmTabs />
            : i === 4 ? <MacbookFrame3D />
            : null
          }
          mediaWrapperClassName={
            // Opaque HTML media (carousel / tabs): tight wrapper centered
            // vertically with section, anchored on the side opposite the
            // text, with safe margin from viewport edge.
            i === 1
              ? "absolute inset-y-[8vh] left-[4vw] hidden md:flex md:w-[80%] items-center pointer-events-auto"
              : i === 3
              ? "absolute inset-y-[8vh] right-[4vw] hidden md:flex md:w-[80%] items-center pointer-events-auto"
              : undefined
          }
        />
      ))}
      {/* Trailing space so scroll has room to finish its tween */}
      <div className="h-[20vh]" />
    </SphereScrollStage>
  );
}
