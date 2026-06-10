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
            image: "/industries/calendar-step2-live-sync.png",
            imageAlt: "Live calendar sync",
          },
          {
            title: "Different services have different durations and prep",
            description:
              "Fifteen-minute discovery call vs sixty-minute consult vs thirty-minute follow-up. The system knows which buffer to apply for each.",
            image: "/industries/calendar-step3-service-types.png",
            imageAlt: "Per-service booking configuration",
          },
          {
            title: "Confirmation, reminders, reschedule links — automatic",
            description:
              "In your voice, on the channel they prefer. No-show rate drops because they got reminded the right number of times.",
            image: "/industries/calendar-step4-confirmations.png",
            imageAlt: "Automated booking confirmations",
          },
          {
            title: "Monday morning, you see what your calendar produced",
            description:
              "Bookings by service type. Show rate. Average value per booking. Which services should you push next month.",
            image: "/industries/calendar-step5-bookings-summary.png",
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
            image: "/industries/funnels-step2-form-to-pipeline.png",
            imageAlt: "Form-to-pipeline routing",
          },
          {
            title: "Multi-step funnels, not just single pages",
            description:
              "Quote → results → book consult → confirmation. Each step tracked. Drop-off points visible so you know exactly where you're losing buyers.",
            image: "/industries/funnels-step3-funnel-flow.png",
            imageAlt: "Multi-step funnel flow",
          },
          {
            title: "A/B test variations without a separate tool",
            description:
              "Two headlines. Two offers. The system picks the winner based on actual bookings, not just clicks. The losing variation gets retired automatically.",
            image: "/industries/funnels-step4-ab-test.png",
            imageAlt: "A/B test variation controls",
          },
          {
            title: "Monday morning, you see what your funnels produced",
            description:
              "Visitors. Conversion. Bookings. By page, by traffic source, by funnel step. Kill the underperformers, double down on winners.",
            image: "/industries/funnels-step5-funnel-summary.png",
            imageAlt: "Weekly funnel performance summary",
          },
        ]}
        outcome="Replaces Webflow plus Typeform plus a designer. Most service businesses launch their first revenue-producing funnel within a week of setup."
      />
    ),
  },
  // 6. Reputation management
  {
    category: "Reputation · reviews",
    title: "Reputation management",
    src: ph("Reputation", "C76B58"),
    visual: <CardStyle2Photo src="/industries/card-activity-feed-photo.jpg" />,
    content: (
      <FeatureBodySteps
        steps={[
          {
            title: "Every finished job asks for a review — automatically",
            description:
              "The moment you mark a job done, the customer gets a friendly text or email asking for a review, with a one-tap link straight to your Google or Facebook page. No more forgetting to ask.",
            image: "/industries/card-activity-feed-photo.jpg",
            imageAlt: "Automated review request",
          },
          {
            title: "All your reviews land in one place",
            description:
              "Google and Facebook reviews pull into a single dashboard. You stop logging into separate sites to find out what people are saying about you.",
            image: "/industries/reputation-step2-reviews-inbox.png",
            imageAlt: "Unified review dashboard",
          },
          {
            title: "Reply to every review without leaving the platform",
            description:
              "AI drafts a reply in your voice for each review — you read it, tweak it if you want, send it. A five-star gets a thank-you, a one-star gets a calm, professional response. Every review answered.",
            image: "/industries/reputation-step3-ai-reply.png",
            imageAlt: "AI-drafted review replies",
          },
          {
            title: "Turn five-star reviews into marketing",
            description:
              "Your best reviews get pushed onto your website and social posts automatically. The praise you earned does the selling for you instead of sitting on one page nobody visits.",
            image: "/industries/reputation-step4-review-as-marketing.png",
            imageAlt: "Five-star reviews repurposed as marketing",
          },
          {
            title: "Monday morning, you see your review health",
            description:
              "New reviews this week. Your average star rating and which way it's trending. Anything that needs a reply. One clean summary so your reputation never drifts unnoticed.",
            image: "/industries/reputation-step5-summary.png",
            imageAlt: "Weekly review-health summary",
          },
        ]}
        outcome="For a local home-services business, your star rating is your storefront — buyers pick the roofer with more recent five-star reviews before they ever call. Asking every customer, every time, is what builds that lead."
      />
    ),
  },
  // 7. Invoicing & payments
  {
    category: "Payments · get paid",
    title: "Invoicing & payments",
    src: ph("Payments", "7ea687"),
    visual: <CardStyle2Photo src="/industries/card-kpi-dashboard-photo.jpg" />,
    content: (
      <FeatureBodySteps
        steps={[
          {
            title: "Send branded estimates and invoices in seconds",
            description:
              "Build an estimate or invoice with your logo and business name, send it by text or email, and the customer can approve it from their phone. No paper, no chasing.",
            image: "/industries/card-kpi-dashboard-photo.jpg",
            imageAlt: "Branded estimate and invoice",
          },
          {
            title: "Connect your own Stripe or Square — keep your processor",
            description:
              "Payments run through your own Stripe, Square, or PayPal account, so the money lands in your bank the way it always has. You're just adding a faster way for customers to pay.",
            image: "/industries/payments-step2-connect-processor.png",
            imageAlt: "Connect your own payment processor",
          },
          {
            title: "Take card payments and deposits up front",
            description:
              "Collect a deposit before the job starts and the balance when it's done. Customers pay by card from the invoice link — no awkward 'can you send me a check' conversations.",
            image: "/industries/payments-step3-card-payment.png",
            imageAlt: "Card payments and deposits",
          },
          {
            title: "Text-to-pay and recurring billing built in",
            description:
              "Text a payment link for fast jobs, or set up subscriptions for maintenance plans that bill on their own every month. Less time invoicing, more time on the tools.",
            image: "/industries/payments-step4-recurring-text-to-pay.png",
            imageAlt: "Text-to-pay and recurring billing",
          },
          {
            title: "Every payment is tracked against the customer",
            description:
              "Each invoice, deposit, and payment sits on the customer's record next to their jobs and messages. You always know who's paid, who owes, and what's overdue.",
            image: "/industries/payments-step2-invoice-in-crm.png",
            imageAlt: "Payments tracked on the contact record",
          },
        ]}
        outcome="A roofer who collects a deposit before climbing the ladder and a text-to-pay link the moment the job is signed off gets paid days faster — and stops carrying customers who 'forgot' to mail the check."
      />
    ),
  },
  // 8. Social media planner
  {
    category: "Marketing · social",
    title: "Social media planner",
    src: ph("Social planner", "E89F1F"),
    visual: <CardStyle2Photo src="/industries/card-meta-ads-photo.jpg" />,
    content: (
      <FeatureBodySteps
        steps={[
          {
            title: "Schedule every channel from one calendar",
            description:
              "Plan and queue posts to Facebook, Instagram, your Google Business Profile, LinkedIn, and TikTok from a single calendar. One place instead of logging into five different apps.",
            image: "/industries/card-meta-ads-photo.jpg",
            imageAlt: "One social calendar across channels",
          },
          {
            title: "AI helps write the posts",
            description:
              "Stuck on what to say? The AI drafts the caption from a few words about the job or offer, in your voice. You approve it and it goes out — no blank-page paralysis.",
            image: "/industries/social-step3-ai-writes-post.png",
            imageAlt: "AI-drafted social posts",
          },
          {
            title: "Reuse your review and job photos as content",
            description:
              "Your before-and-after job photos and five-star reviews become ready-made posts. The proof you already earned turns straight into content that pulls new customers.",
            image: "/industries/social-step4-reuse-photos.png",
            imageAlt: "Job photos and reviews reused as posts",
          },
          {
            title: "Plan a whole month in one sitting",
            description:
              "Batch a month of posts on a Sunday, set the dates, and let them publish on schedule. Your pages stay active even in your busiest week on the job.",
            image: "/industries/social-step2-content-calendar.png",
            imageAlt: "Month of posts scheduled ahead",
          },
          {
            title: "Monday morning, you see what's working",
            description:
              "Which posts got seen, liked, and clicked, by channel. So you do more of what brings in calls and quietly drop what nobody noticed.",
            image: "/industries/social-step5-engagement-summary.png",
            imageAlt: "Weekly social engagement summary",
          },
        ]}
        outcome="You stay visible to your local market every week without hiring a marketer — the posts that keep your name in front of homeowners go out on schedule whether you're on a roof or asleep."
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
