"use client";

/**
 * Scene5ControlPanelCarousel — Apple Cards Carousel for the Control Panel
 * scene (Step 4). Replaces the 3D MacBook (MacbookFrame3D) with a
 * swipeable carousel of dashboard features.
 *
 * Created 2026-05-27 (Shamil): the 3D MacBook signals sophistication to
 * an audience (local-service-business owners) that doesn't reward
 * sophistication signaling. Same UI primitive across the page makes
 * the page easier to follow for non-technical buyers.
 *
 * Cards locked: unified inbox, live activity feed, pipeline KPIs at a
 * glance, workflow automations dashboard, mobile app for owners.
 */

import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

function CardStyle2Photo({ src }: { src: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className="absolute inset-0 w-full h-full object-cover"
      draggable={false}
    />
  );
}

type FeatureCard = {
  src: string;
  title: string;
  category: string;
  content: React.ReactNode;
  visual?: React.ReactNode;
};

const ph = (label: string, bg: string, fg = "F5F1E8") =>
  `https://placehold.co/640x800/${bg}/${fg}?text=${encodeURIComponent(label)}&font=inter`;

const IMG = {
  step2Saved: "/industries/shared-step2-customer-saved.png",
  step3Pipeline: "/industries/shared-step3-pipeline-view.png",
  step4Messages: "/industries/shared-step4-auto-messages.png",
  step5Report: "/industries/shared-step5-weekly-report.png",
} as const;

const FEATURES: FeatureCard[] = [
  // 1. Unified inbox
  {
    category: "Triage · one screen",
    title: "Unified inbox",
    src: ph("Unified inbox", "C76B58"),
    visual: <CardStyle2Photo src="/industries/card-unified-inbox-control-photo.jpg" />,
    content: (
      <FeatureBodySteps
        steps={[
          {
            title: "Calls, chats, DMs, forms, emails — all in one queue",
            description:
              "One place to triage everything. No flipping between Gmail, Instagram, the chat widget, and the CRM. Your team triages from one screen.",
            image: "/industries/card-unified-inbox-control-photo.jpg",
            imageAlt: "Unified inbox dashboard",
          },
          {
            title: "Auto-tagging keeps the queue scannable",
            description:
              "Quote request. Booking. Complaint. Vendor. Spam. The AI tags conversations as they land so you can filter and batch.",
            image: IMG.step2Saved,
            imageAlt: "Auto-tagged conversations",
          },
          {
            title: "AI drafts replies for one-click approval",
            description:
              "For common questions, the system writes the reply in your voice. You hit approve or auto-send for repetitive vendor or scheduling threads.",
            image: IMG.step3Pipeline,
            imageAlt: "AI-drafted reply pending approval",
          },
          {
            title: "Each conversation has the full customer context attached",
            description:
              "Pipeline stage, last appointment, total revenue, lead score — all visible without leaving the thread.",
            image: IMG.step4Messages,
            imageAlt: "Conversation with customer context",
          },
          {
            title: "Monday morning, you see your inbox economics",
            description:
              "Volume by channel. Average reply time. Conversion to revenue per channel. You see what your inbox actually was — cost or earning.",
            image: IMG.step5Report,
            imageAlt: "Weekly inbox economics summary",
          },
        ]}
        outcome="Operators triaging voice, chat, DM, and email from one screen save eight to fifteen hours per week of inbox switching."
      />
    ),
  },
  // 2. Live activity feed
  {
    category: "Visibility · real-time",
    title: "Live activity feed",
    src: ph("Activity feed", "7ea687"),
    visual: <CardStyle2Photo src="/industries/card-activity-feed-photo.jpg" />,
    content: (
      <FeatureBodySteps
        steps={[
          {
            title: "Every customer touchpoint lands in real time",
            description:
              "A call answered. A form filled. A booking made. A payment received. The stream lives on one page, newest at the top, updating as events happen.",
            image: "/industries/card-activity-feed-photo.jpg",
            imageAlt: "Live activity feed timeline",
          },
          {
            title: "Filter the stream by type, channel, or rep",
            description:
              "Just show me bookings today. Just show me payments this week. Just show me Sarah's activity. Filters save as views.",
            image: IMG.step2Saved,
            imageAlt: "Filtered activity views",
          },
          {
            title: "Click any event for the full context",
            description:
              "The conversation that produced the booking. The deal the payment closed. The exact moment of the touchpoint. No hunting through tabs.",
            image: IMG.step3Pipeline,
            imageAlt: "Activity event detail view",
          },
          {
            title: "Set alerts on the activity that matters",
            description:
              "A deal over five thousand dollars closes. A VIP customer messages. A complaint is logged. You get pinged immediately — phone, email, or both.",
            image: IMG.step4Messages,
            imageAlt: "Activity alert configuration",
          },
          {
            title: "Monday morning, you see the week's pulse",
            description:
              "Total events. By type. By rep. By hour-of-day. So you know when your business actually happens — and whether your staffing matches.",
            image: IMG.step5Report,
            imageAlt: "Weekly activity-pulse summary",
          },
        ]}
        outcome="Owners often discover their busiest hour isn't when they staffed for it — visibility into the activity feed exposes scheduling gaps worth real money."
      />
    ),
  },
  // 3. Pipeline KPIs at a glance
  {
    category: "Reporting · at-a-glance",
    title: "Pipeline KPIs at a glance",
    src: ph("KPI dashboard", "E89F1F"),
    visual: <CardStyle2Photo src="/industries/card-kpi-dashboard-photo.jpg" />,
    content: (
      <FeatureBodySteps
        steps={[
          {
            title: "The numbers that matter, on the home screen",
            description:
              "New leads. Booked. Won. Revenue. For today, this week, this month, this quarter. Toggle the range with one tap.",
            image: "/industries/card-kpi-dashboard-photo.jpg",
            imageAlt: "Business KPI dashboard",
          },
          {
            title: "Compare against last period — automatically",
            description:
              "Up nine percent vs last week. Down two percent on conversion. The system does the math; you just see the direction.",
            image: IMG.step2Saved,
            imageAlt: "Period-over-period comparison",
          },
          {
            title: "Drill into any tile to see what produced the number",
            description:
              "Tap Won → see the deals that closed. Tap Booked → see the appointments. Real records behind every count, not abstract metrics.",
            image: IMG.step3Pipeline,
            imageAlt: "KPI tile drill-down to records",
          },
          {
            title: "Set goals per metric and track progress visibly",
            description:
              "Twenty new leads per week. Eighty percent show rate. Fifteen percent conversion. Progress bar fills as the week goes.",
            image: IMG.step4Messages,
            imageAlt: "Per-metric goal progress",
          },
          {
            title: "Monday morning, the dashboard summarizes itself",
            description:
              "“You're at fourteen of twenty leads, behind pace. Booked rate is up. Revenue per booking is down.” Plain English, not just a chart.",
            image: IMG.step5Report,
            imageAlt: "Weekly natural-language summary",
          },
        ]}
        outcome="Founders making one strategic shift per month typically need a clear dashboard to see what's actually moving — this is that dashboard."
      />
    ),
  },
  // 4. Workflow automations dashboard
  {
    category: "Operations · plumbing",
    title: "Workflow automations dashboard",
    src: ph("Workflow automations", "8B7BB8"),
    visual: <CardStyle2Photo src="/industries/card-workflow-automations-photo.jpg" />,
    content: (
      <FeatureBodySteps
        steps={[
          {
            title: "See every workflow running underneath your business",
            description:
              "The auto-replies. The follow-up sequences. The pipeline-stage automations. The Stripe webhooks. All visible on one page — not buried in five settings menus.",
            image: "/industries/card-workflow-automations-photo.jpg",
            imageAlt: "Workflow automations control panel",
          },
          {
            title: "Status badges show what's running, paused, or broken",
            description:
              "Green is healthy. Yellow is warning. Red is broken. You spot problems before they cost you money.",
            image: IMG.step2Saved,
            imageAlt: "Workflow status badges",
          },
          {
            title: "Click any workflow to see its run history",
            description:
              "Every fire. Every success. Every failure with the error message. Debug in seconds, not in an hour-long support ticket.",
            image: IMG.step3Pipeline,
            imageAlt: "Workflow run history view",
          },
          {
            title: "Pause, edit, or retry without leaving the dashboard",
            description:
              "Bad sequence going out? Pause it. Fix the message. Resume. All without scaffolding a new tool or filing a support request.",
            image: IMG.step4Messages,
            imageAlt: "Inline workflow controls",
          },
          {
            title: "Monday morning, you see your operation's plumbing health",
            description:
              "Workflow uptime. Most-fired automations. Most-failed automations. Bottlenecks identified before they cascade into customer impact.",
            image: IMG.step5Report,
            imageAlt: "Weekly workflow health summary",
          },
        ]}
        outcome="Most businesses run automations they can't see — when something breaks, customer impact is the first signal. This dashboard makes it the last."
      />
    ),
  },
  // 5. Mobile app for owners
  {
    category: "Mobile · owner-first",
    title: "Mobile app for owners",
    src: ph("Mobile app", "5e8268"),
    visual: <CardStyle2Photo src="/industries/card-mobile-app-photo.jpg" />,
    content: (
      <FeatureBodySteps
        steps={[
          {
            title: "Full control panel in your pocket — not a stripped-down version",
            description:
              "Pipeline, inbox, calendar, automations, KPIs. Everything you have on desktop, available on the phone — built for owners who don't sit at a desk.",
            image: "/industries/card-mobile-app-photo.jpg",
            imageAlt: "Mobile control-panel app",
          },
          {
            title: "Push notifications for what actually matters",
            description:
              "Hot lead. Deal closed. Customer complaint. Workflow failure. Not every micro-event — only the ones that need YOU specifically.",
            image: IMG.step2Saved,
            imageAlt: "Selective push notification settings",
          },
          {
            title: "Reply, book, route — from the lock screen if you want",
            description:
              "Voice-to-text reply. One-tap stage change. Approve a quote. Do the work in fifteen seconds while you're walking the dog.",
            image: IMG.step3Pipeline,
            imageAlt: "Lock-screen quick actions",
          },
          {
            title: "Offline-capable for spotty signal",
            description:
              "Walking through a tunnel, in the basement, on a plane. Changes sync the moment you're back online — you never wonder if it saved.",
            image: IMG.step4Messages,
            imageAlt: "Offline-capable sync",
          },
          {
            title: "Monday morning, you see the week without sitting at a desk",
            description:
              "The dashboard arrives as a push notification. Tap to drill in. The week's review takes three minutes, not an hour.",
            image: IMG.step5Report,
            imageAlt: "Weekly mobile-first summary",
          },
        ]}
        outcome="Owners running mobile-first typically respond to hot leads forty to sixty percent faster — and never miss the customer complaint that becomes a one-star review."
      />
    ),
  },
];

function FeatureBodySteps({
  steps,
  outcome,
}: {
  steps: {
    title: string;
    description: string;
    image?: string | React.ReactNode;
    imageAlt?: string;
  }[];
  outcome: string;
}) {
  return (
    <div className="space-y-8 text-base text-text-muted leading-relaxed">
      <div>
        <div className="mono-label text-text-dim text-xs mb-3">How it works</div>
        <ol className="space-y-7">
          {steps.map((step, i) => (
            <li key={step.title} className="flex flex-col md:flex-row gap-4 md:gap-6">
              {step.image && (
                <div className="md:w-1/3 shrink-0">
                  <div className="aspect-square w-full overflow-hidden rounded-xl bg-text-muted/10">
                    {typeof step.image === "string" ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={step.image}
                        alt={step.imageAlt ?? step.title}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="w-full h-full"
                        role="img"
                        aria-label={step.imageAlt ?? step.title}
                      >
                        {step.image}
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-baseline gap-3">
                  <span
                    className="text-2xl md:text-3xl font-bold text-accent tabular-nums"
                    style={{ letterSpacing: "-0.025em" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h4
                    className="text-lg md:text-xl font-semibold text-text leading-snug"
                    style={{ letterSpacing: "-0.01em" }}
                  >
                    {step.title}
                  </h4>
                </div>
                <p className="mt-2 text-[15px] md:text-base text-text-muted leading-relaxed">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div className="pt-5 border-t border-text-muted/15">
        <div className="mono-label text-text-dim text-xs mb-1">Real-world outcome</div>
        <p className="text-[15px] md:text-base">{outcome}</p>
      </div>
    </div>
  );
}

export function Scene5ControlPanelCarousel() {
  const items = FEATURES.map((c, i) => <Card key={c.title} card={c} index={i} />);
  return (
    <div className="w-full">
      <Carousel items={items} />
    </div>
  );
}
