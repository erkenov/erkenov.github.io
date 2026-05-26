"use client";

/**
 * Scene2Channels — Apple Cards Carousel for the Lead Generation scene.
 *
 * Reworked 2026-05-27 (Shamil) to match the Industries and Lead Capture
 * carousels: full-bleed photographic cover, five-step "How it works" body
 * inside the modal, and a real-world outcome line. Dropped the per-card
 * animated visuals (Scene2VoiceAgentVisual etc.) and the Erken corner
 * badge — both fought with the new photographic covers.
 *
 * Order locked 2026-05-23 (Shamil): Voice agent FIRST (the flagship
 * outbound channel), then Google Maps prospecting, cold email, Meta
 * Business AI, LinkedIn outreach.
 */

import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

/* ============================================================
   Closed-card visual — full-bleed photographic image. Same
   pattern as SceneIndustriesCarousel and Scene3LeadCaptureCarousel.
   ============================================================ */
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

type ChannelCard = {
  src: string;
  title: string;
  category: string;
  content: React.ReactNode;
  visual?: React.ReactNode;
};

const ph = (label: string, bg: string, fg = "F5F1E8") =>
  `https://placehold.co/640x800/${bg}/${fg}?text=${encodeURIComponent(label)}&font=inter`;

// Shared step images reused from the Industries carousel — the underlying
// pipeline is the same (capture → save → see → follow up → review).
// Step 1 uses each channel's own hero photo for variety.
const IMG = {
  step2Saved: "/industries/shared-step2-customer-saved.png",
  step3Pipeline: "/industries/shared-step3-pipeline-view.png",
  step4Messages: "/industries/shared-step4-auto-messages.png",
  step5Report: "/industries/shared-step5-weekly-report.png",
} as const;

const CHANNELS: ChannelCard[] = [
  // 1. AI voice agent that calls
  {
    category: "Outbound · voice",
    title: "AI voice agent that calls",
    src: ph("Voice agent", "C76B58"),
    visual: <CardStyle2Photo src="/industries/card-voice-agent-photo.jpg" />,
    content: (
      <ChannelBodySteps
        steps={[
          {
            title: "Your campaign starts — and dials thousands of prospects without burning out reps",
            description:
              "An AI agent makes the outbound call in YOUR brand voice with YOUR pitch. Hundreds of dials a day. Voicemails handled. Wrong numbers logged. Real conversations qualified and booked right on the call.",
            image: "/industries/card-voice-agent-photo.jpg",
            imageAlt: "Outbound calling campaign dashboard",
          },
          {
            title: "Every call lands in your CRM — automatically",
            description:
              "Transcript, recording, prospect's answers, qualification notes — all saved against the contact record. Reps see full context before they pick up where the AI left off.",
            image: IMG.step2Saved,
            imageAlt: "Call records saved to CRM",
          },
          {
            title: "Every prospect moves through your pipeline visibly",
            description:
              "Dialed → Connected → Qualified → Meeting booked. You see exactly where each campaign stands and which lists are actually producing.",
            image: IMG.step3Pipeline,
            imageAlt: "Outbound pipeline view",
          },
          {
            title: "Booked meetings get the right follow-up — automatically",
            description:
              "Calendar invite the moment the call ends. Reminder text the day before. Reschedule link if they bail. All in your brand voice, all automatic.",
            image: IMG.step4Messages,
            imageAlt: "Automated follow-up sequence",
          },
          {
            title: "Monday morning, you see what your campaign produced",
            description:
              "Dials. Pickups. Conversations. Meetings booked. No-shows. Per agent, per campaign, per list. A clean weekly summary — no spreadsheets.",
            image: IMG.step5Report,
            imageAlt: "Weekly campaign performance summary",
          },
        ]}
        outcome="Replaces a team of three SDRs at a fraction of the cost. Most campaigns book ten to twenty meetings per week from a single list."
      />
    ),
  },
  // 2. Google Maps prospecting
  {
    category: "Outbound · scrape",
    title: "Google Maps prospecting",
    src: ph("Google Maps", "7ea687"),
    visual: <CardStyle2Photo src="/industries/card-google-maps-photo.jpg" />,
    content: (
      <ChannelBodySteps
        steps={[
          {
            title: "Tell us your category and city — we pull every business overnight",
            description:
              "Plumbers in Austin. Dentists in Manchester. Salons in Sydney. The scraper pulls every match — name, phone, website, hours, owner photo, review count, last-review date. Daily refresh.",
            image: "/industries/card-google-maps-photo.jpg",
            imageAlt: "Google Maps prospecting dashboard",
          },
          {
            title: "Each business lands in your prospect list — automatically",
            description:
              "Scored against your ideal-customer profile. Deduplicated against your CRM so you never double-touch a business you've already worked.",
            image: IMG.step2Saved,
            imageAlt: "Scraped businesses saved to prospect list",
          },
          {
            title: "Every prospect moves through your outreach pipeline visibly",
            description:
              "Scraped → Scored → Queued → Contacted → Replied. You see which neighborhoods produce buyers and which produce ghosts.",
            image: IMG.step3Pipeline,
            imageAlt: "Outreach pipeline view",
          },
          {
            title: "Outreach kicks off across whatever channels you choose — automatically",
            description:
              "Voice agent, cold email, LinkedIn, SMS — pick the channels per list. The system handles cadence, follow-up, and opt-out compliance.",
            image: IMG.step4Messages,
            imageAlt: "Automated multi-channel outreach",
          },
          {
            title: "Monday morning, you see which lists actually delivered",
            description:
              "Businesses scraped. Contact rate. Reply rate. Booked rate. A clean weekly summary so you know which categories and cities are worth running again.",
            image: IMG.step5Report,
            imageAlt: "Weekly scrape performance summary",
          },
        ]}
        outcome="A typical city pull yields five hundred to two thousand qualified prospects per category. No lists to buy, no manual research."
      />
    ),
  },
  // 3. Cold email at scale
  {
    category: "Outbound · email",
    title: "Cold email at scale",
    src: ph("Cold email", "5e8268"),
    visual: <CardStyle2Photo src="/industries/card-cold-email-photo.jpg" />,
    content: (
      <ChannelBodySteps
        steps={[
          {
            title: "Each email is personalized to the prospect — automatically",
            description:
              "AI writes a custom first line per prospect based on their website, recent posts, or Google Maps profile. No “Dear sir or madam.” No “{first_name}” template leaks. Real personalization at scale.",
            image: "/industries/card-cold-email-photo.jpg",
            imageAlt: "Personalized cold email campaign dashboard",
          },
          {
            title: "Every contact lands in your CRM — automatically",
            description:
              "Emails sent, opens, clicks, replies — all tracked against the contact record. Bounces auto-cleanse. Opt-outs honored across every channel.",
            image: IMG.step2Saved,
            imageAlt: "Email engagement tracked in CRM",
          },
          {
            title: "Every prospect moves through your outreach pipeline visibly",
            description:
              "Queued → Sent → Opened → Replied → Booked. You see the funnel in real time, not at the end of the quarter.",
            image: IMG.step3Pipeline,
            imageAlt: "Email outreach pipeline view",
          },
          {
            title: "Replies route straight to your team — automatically",
            description:
              "Positive replies escalate to a human. Out-of-office gets re-queued. Unsubscribes pause that prospect forever. All in one inbox, not buried in Gmail.",
            image: IMG.step4Messages,
            imageAlt: "Reply routing and follow-up workflow",
          },
          {
            title: "Monday morning, you see what your inboxes produced",
            description:
              "Sends. Open rate. Reply rate. Booked rate. Sender-reputation health. A clean weekly summary so you can swap subject lines or rest tired inboxes before they get burned.",
            image: IMG.step5Report,
            imageAlt: "Weekly cold email performance summary",
          },
        ]}
        outcome="Warmed-up sender infrastructure plus per-prospect personalization typically holds reply rates between three and eight percent — several times generic cold email."
      />
    ),
  },
  // 4. Meta Business AI
  {
    category: "Paid · Meta",
    title: "Meta Business AI",
    src: ph("Meta ads", "E89F1F"),
    visual: <CardStyle2Photo src="/industries/card-meta-ads-photo.jpg" />,
    content: (
      <ChannelBodySteps
        steps={[
          {
            title: "Your Meta ads now talk back — twenty-four seven",
            description:
              "When someone clicks your Facebook or Instagram ad, an AI agent answers their questions, qualifies them, and books a call right inside Messenger. The ad budget you're already spending now actually books meetings.",
            image: "/industries/card-meta-ads-photo.jpg",
            imageAlt: "Instagram DM thread with AI agent reply",
          },
          {
            title: "Every conversation lands in your CRM — automatically",
            description:
              "Name, what they asked, what they wanted, what objections they had — all saved against the lead record. Your sales team sees the full thread before they pick up.",
            image: IMG.step2Saved,
            imageAlt: "Ad-conversation lead saved to CRM",
          },
          {
            title: "Every ad-driven lead moves through your pipeline visibly",
            description:
              "Ad clicked → Chatted → Qualified → Booked. You see which creative, which audience, and which day of the week produce actual bookings — not just clicks.",
            image: IMG.step3Pipeline,
            imageAlt: "Ad lead pipeline view",
          },
          {
            title: "Follow-up runs across Messenger, Instagram, and SMS — automatically",
            description:
              "Booking confirmation. Day-before reminder. Win-back for ghosted threads. All in your brand voice, across whichever channel the lead prefers.",
            image: IMG.step4Messages,
            imageAlt: "Cross-channel ad follow-up sequence",
          },
          {
            title: "Monday morning, you see what your ad spend actually bought",
            description:
              "Cost per ad-conversation. Cost per booked meeting. Best-performing creative. A clean weekly summary so you can kill the duds and double down on winners.",
            image: IMG.step5Report,
            imageAlt: "Weekly Meta ads performance summary",
          },
        ]}
        outcome="Meta Business AI is free for eligible advertisers. Average cost-per-meeting drops thirty to fifty percent when ads can answer questions instead of just sending to a landing page."
      />
    ),
  },
  // 5. LinkedIn outreach
  {
    category: "Outbound · LinkedIn",
    title: "LinkedIn outreach",
    src: ph("LinkedIn", "A8B86C"),
    visual: <CardStyle2Photo src="/industries/card-linkedin-photo.jpg" />,
    content: (
      <ChannelBodySteps
        steps={[
          {
            title: "Targeted connection requests go out — at scale, in your voice",
            description:
              "Filter for your ideal customer — industry, company size, role, geography. The system sends personalized connection requests with a real first line tailored to each profile, not a copy-paste template.",
            image: "/industries/card-linkedin-photo.jpg",
            imageAlt: "LinkedIn outreach messaging interface",
          },
          {
            title: "Every accepted connection lands in your CRM — automatically",
            description:
              "Name, role, company, what triggered the personalization, full conversation history — all saved. Reps see context before they message.",
            image: IMG.step2Saved,
            imageAlt: "LinkedIn connection saved to CRM",
          },
          {
            title: "Every prospect moves through your LinkedIn pipeline visibly",
            description:
              "Invited → Accepted → Messaged → Replied → Booked. You see which job titles and industries actually convert vs which just collect connections.",
            image: IMG.step3Pipeline,
            imageAlt: "LinkedIn outreach pipeline view",
          },
          {
            title: "Follow-up runs without you logging into LinkedIn — automatically",
            description:
              "First message after acceptance. Second touch a few days later. Third nudge with value, not pressure. All paced safely under LinkedIn's daily limits.",
            image: IMG.step4Messages,
            imageAlt: "Automated LinkedIn follow-up sequence",
          },
          {
            title: "Monday morning, you see what your network actually produced",
            description:
              "Invites sent. Acceptance rate. Reply rate. Booked rate. By industry, by title, by message variant. A clean weekly summary so you can tune the targeting.",
            image: IMG.step5Report,
            imageAlt: "Weekly LinkedIn outreach summary",
          },
        ]}
        outcome="B2B founders typically book two to five meetings per week per LinkedIn account, with the same outreach scaling cleanly across multiple seats."
      />
    ),
  },
];

/**
 * Step-by-step body — five plain-language steps + a real-world outcome.
 * Same visual structure as IndustryBodySteps and ChannelBodySteps (lead
 * capture). No "Replaces" footer on the lead-gen side; the outbound
 * channels don't have direct one-to-one tool substitutes the way the
 * inbound channels do.
 */
function ChannelBodySteps({
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

export function Scene2Channels() {
  const items = CHANNELS.map((c, i) => <Card key={c.title} card={c} index={i} />);
  return (
    <div className="w-full">
      <Carousel items={items} />
    </div>
  );
}
