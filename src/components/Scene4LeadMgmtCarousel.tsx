"use client";

/**
 * Scene4LeadMgmtCarousel — Apple Cards Carousel for the Lead Management
 * scene (Step 3). Replaces the old Scene4ErkenPlatform single-panel
 * mockup with a swipeable carousel of platform features, matching the
 * pattern of Lead Generation, Lead Capture, and Industries.
 *
 * Created 2026-05-27 (Shamil): every section that breaks the carousel
 * pattern forces non-technical visitors to re-orient. Going all-in on
 * the same UI primitive across the page.
 *
 * Cards locked: visual deal pipeline, auto-scoring + routing, branded
 * calendar + booking, SMS + email automations, funnels + landing pages.
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
  // 1. Visual deal pipeline
  {
    category: "Pipeline · visibility",
    title: "Visual deal pipeline",
    src: ph("Deal pipeline", "C76B58"),
    visual: <CardStyle2Photo src="/industries/card-deal-pipeline-photo.jpg" />,
    content: (
      <FeatureBodySteps
        steps={[
          {
            title: "Every lead lands in your pipeline — automatically",
            description:
              "The moment a lead is captured — call, chat, form, ad — it lands in your pipeline as a card in the right column. No manual data entry. No double-handling.",
            image: "/industries/card-deal-pipeline-photo.jpg",
            imageAlt: "Visual deal pipeline interface",
          },
          {
            title: "Drag cards across stages as the deal progresses",
            description:
              "On desktop or phone. The card shows everything you need to know at a glance — name, phone, last activity, deal value, days in stage.",
            image: IMG.step2Saved,
            imageAlt: "Lead card details",
          },
          {
            title: "Multiple pipelines for different lines of business",
            description:
              "Sales pipeline. Service pipeline. Onboarding pipeline. Each tuned for the way that part of the business actually flows — not a one-size-fits-none template.",
            image: IMG.step3Pipeline,
            imageAlt: "Multiple pipelines view",
          },
          {
            title: "Stage changes trigger automations — automatically",
            description:
              "Card moves to Won → invoice goes out and intake form fires. Card moves to Lost → win-back drip starts. All in your voice, all without you touching a thing.",
            image: IMG.step4Messages,
            imageAlt: "Stage-triggered automations",
          },
          {
            title: "Monday morning, you see pipeline health",
            description:
              "Value by stage. Average days in stage. Stuck deals. Which reps are pushing deals forward and which are sitting on them. A clean weekly summary.",
            image: IMG.step5Report,
            imageAlt: "Weekly pipeline health summary",
          },
        ]}
        outcome="Owners typically discover ten to twenty percent of their pipeline is stuck in one stage they didn't know about — visibility alone unblocks revenue."
      />
    ),
  },
  // 2. Auto-scoring + routing
  {
    category: "Pipeline · intelligence",
    title: "Auto-scoring + routing",
    src: ph("Auto-scoring", "7ea687"),
    visual: <CardStyle2Photo src="/industries/card-auto-scoring-photo.jpg" />,
    content: (
      <FeatureBodySteps
        steps={[
          {
            title: "Every new lead is scored — automatically",
            description:
              "Industry match, source quality, deal size, urgency — combined into a single score on the lead card. Your rules, your weights. The system learns what your best customers look like.",
            image: "/industries/card-auto-scoring-photo.jpg",
            imageAlt: "Lead scoring interface",
          },
          {
            title: "Hot leads ping the right rep's phone — instantly",
            description:
              "Push notification, SMS, or both. No new lead sits in a queue for an hour while the prospect dials a competitor.",
            image: IMG.step2Saved,
            imageAlt: "Hot lead notification",
          },
          {
            title: "Cold leads go straight into nurture",
            description:
              "Auto-tagged by reason (wrong fit, low score, no answer). They get a long-tail drip; your team doesn't waste time on them.",
            image: IMG.step3Pipeline,
            imageAlt: "Cold lead nurture flow",
          },
          {
            title: "Reps see the score on the lead card before they call",
            description:
              "Plus the reason the score was high. Plus the source. Plus the last activity. Context before contact, every time.",
            image: IMG.step4Messages,
            imageAlt: "Lead card with score context",
          },
          {
            title: "Monday morning, you see which sources deliver hot leads",
            description:
              "Not just leads. Hot leads. The ones that close. So you know where to spend the next ad dollar.",
            image: IMG.step5Report,
            imageAlt: "Weekly lead-source quality summary",
          },
        ]}
        outcome="Scoring plus routing typically lifts contact rate on hot inbound by thirty to fifty percent because reps get there before the prospect cools."
      />
    ),
  },
  // 3. Branded calendar + booking
  {
    category: "Booking · branded",
    title: "Branded calendar + booking",
    src: ph("Calendar", "E89F1F"),
    visual: <CardStyle2Photo src="/industries/card-calendar-booking-photo.jpg" />,
    content: (
      <FeatureBodySteps
        steps={[
          {
            title: "Customers book themselves on your branded calendar",
            description:
              "Your domain, your colors, your business name. Not calendly.com slash you. Buyers see your brand the whole way through the booking flow.",
            image: "/industries/card-calendar-booking-photo.jpg",
            imageAlt: "Branded booking calendar",
          },
          {
            title: "Available slots sync with Google or Outlook — live",
            description:
              "No double-booked appointments. No back-and-forth emails. They pick a slot; it disappears for everyone else in real time.",
            image: IMG.step2Saved,
            imageAlt: "Live calendar sync",
          },
          {
            title: "Different services have different durations and prep",
            description:
              "Fifteen-minute discovery call vs sixty-minute consult vs thirty-minute follow-up. The system knows which buffer to apply for each.",
            image: IMG.step3Pipeline,
            imageAlt: "Per-service booking configuration",
          },
          {
            title: "Confirmation, reminders, reschedule links — automatic",
            description:
              "In your voice, on the channel they prefer. No-show rate drops because they got reminded the right number of times.",
            image: IMG.step4Messages,
            imageAlt: "Automated booking confirmations",
          },
          {
            title: "Monday morning, you see what your calendar produced",
            description:
              "Bookings by service type. Show rate. Average value per booking. Which services should you push next month.",
            image: IMG.step5Report,
            imageAlt: "Weekly calendar performance summary",
          },
        ]}
        outcome="Self-service booking typically captures thirty to forty percent of bookings outside business hours — the leads your competitors miss because their phone goes to voicemail."
      />
    ),
  },
  // 4. SMS + email automations
  {
    category: "Automation · communication",
    title: "SMS + email automations",
    src: ph("Automations", "8B7BB8"),
    visual: <CardStyle2Photo src="/industries/card-sms-email-automations-photo.jpg" />,
    content: (
      <FeatureBodySteps
        steps={[
          {
            title: "Triggers from anywhere in the platform",
            description:
              "New lead, stage change, booking, payment, missed call, anniversary — any event can start a sequence. You don't move data between tools.",
            image: "/industries/card-sms-email-automations-photo.jpg",
            imageAlt: "Automation trigger workflow",
          },
          {
            title: "Sequences run on the channel the customer prefers",
            description:
              "SMS for urgent. Email for detail. WhatsApp for international. You set the rules; the system picks the channel based on the contact's history.",
            image: IMG.step2Saved,
            imageAlt: "Multi-channel sequence routing",
          },
          {
            title: "Every message uses tokens for personalization",
            description:
              "First name, business name, last service, last appointment date — pulled from the contact record in real time. No template leaks.",
            image: IMG.step3Pipeline,
            imageAlt: "Token-personalized message preview",
          },
          {
            title: "Replies route back into your unified inbox",
            description:
              "No checking five different inboxes. The customer's reply lands wherever the original send came from, attached to their contact record.",
            image: IMG.step4Messages,
            imageAlt: "Replies unified back into inbox",
          },
          {
            title: "Monday morning, you see what your messages produced",
            description:
              "Sent. Delivered. Opened. Replied. Booked. By sequence, by trigger, by audience. So you know which sequences pay for themselves and which to kill.",
            image: IMG.step5Report,
            imageAlt: "Weekly message-sequence performance",
          },
        ]}
        outcome="Automated follow-up typically converts twenty to thirty percent more leads than manual touch — most leads die not from no, but from no reply."
      />
    ),
  },
  // 5. Funnels + landing pages
  {
    category: "Acquisition · funnels",
    title: "Funnels + landing pages",
    src: ph("Funnels", "5e8268"),
    visual: <CardStyle2Photo src="/industries/card-funnels-landing-photo.jpg" />,
    content: (
      <FeatureBodySteps
        steps={[
          {
            title: "Build landing pages without a designer or developer",
            description:
              "Drag-and-drop blocks. Pre-built templates per industry. Pages live in seconds, not weeks. Your colors and brand baked in.",
            image: "/industries/card-funnels-landing-photo.jpg",
            imageAlt: "Landing page builder",
          },
          {
            title: "Forms submit straight to your pipeline",
            description:
              "Every field maps to your lead record. Every submission triggers the right automation. No Zapier middleware to maintain.",
            image: IMG.step2Saved,
            imageAlt: "Form-to-pipeline routing",
          },
          {
            title: "Multi-step funnels, not just single pages",
            description:
              "Quote → results → book consult → confirmation. Each step tracked. Drop-off points visible so you know exactly where you're losing buyers.",
            image: IMG.step3Pipeline,
            imageAlt: "Multi-step funnel flow",
          },
          {
            title: "A/B test variations without a separate tool",
            description:
              "Two headlines. Two offers. The system picks the winner based on actual bookings, not just clicks. The losing variation gets retired automatically.",
            image: IMG.step4Messages,
            imageAlt: "A/B test variation controls",
          },
          {
            title: "Monday morning, you see what your funnels produced",
            description:
              "Visitors. Conversion. Bookings. By page, by traffic source, by funnel step. Kill the underperformers, double down on winners.",
            image: IMG.step5Report,
            imageAlt: "Weekly funnel performance summary",
          },
        ]}
        outcome="Replaces Webflow plus Typeform plus a designer. Most service businesses launch their first revenue-producing funnel within a week of setup."
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

export function Scene4LeadMgmtCarousel() {
  const items = FEATURES.map((c, i) => <Card key={c.title} card={c} index={i} />);
  return (
    <div className="w-full">
      <Carousel items={items} />
    </div>
  );
}
