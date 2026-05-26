"use client";

/**
 * Scene3LeadCaptureCarousel — Apple Cards Carousel for the Lead Capture scene.
 *
 * Reworked 2026-05-27 (Shamil) to match the Industries carousel pattern:
 * step-by-step "How it works" body with five plain-language steps, plus a
 * "Replaces" footer that calls out the competitor tools each channel
 * substitutes for. Closed-card visual is a full-bleed photographic image
 * per channel (CardStyle2Photo).
 *
 * Channels locked 2026-05-24 (Shamil): Voice receptionist FIRST (the
 * differentiator), then web chat, WhatsApp + Instagram DMs, missed-call
 * text-back, web forms, email-to-inbox.
 */

import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

/* ============================================================
   Closed-card visual — full-bleed photographic image. Same
   component pattern as SceneIndustriesCarousel's CardStyle2Photo
   (which won the A/B/C/D/E experiment 2026-05-26).
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
  /** Full-bleed photographic image for the CLOSED card. */
  visual?: React.ReactNode;
};

const ph = (label: string, bg: string, fg = "F5F1E8") =>
  `https://placehold.co/640x800/${bg}/${fg}?text=${encodeURIComponent(label)}&font=inter`;

// Shared step images reused from the Industries carousel — the underlying
// pipeline is the same (capture → save → see → follow up → review), so
// the visuals are channel-agnostic for steps 2-5. Step 1 uses each
// channel's own hero photo for visual variety.
const IMG = {
  step1Call: "/industries/shared-step1-call.png",
  step2Saved: "/industries/shared-step2-customer-saved.png",
  step3Pipeline: "/industries/shared-step3-pipeline-view.png",
  step4Messages: "/industries/shared-step4-auto-messages.png",
  step5Report: "/industries/shared-step5-weekly-report.png",
} as const;

const CHANNELS: ChannelCard[] = [
  // 1. AI voice receptionist
  {
    category: "Inbound · voice",
    title: "AI voice receptionist",
    src: ph("Voice receptionist", "C76B58"),
    visual: <CardStyle2Photo src="/industries/card-voice-receptionist-photo.jpg" />,
    content: (
      <ChannelBodySteps
        steps={[
          {
            title: "Your phone rings — and gets answered, every time",
            description:
              "When a customer calls your business, your AI receptionist picks up in two rings, twenty-four seven. It sounds friendly and tailored to YOUR brand voice — your hours, your services, your prices, your scripts. Not a generic answering bot.",
            image: IMG.step1Call,
            imageAlt: "AI voice receptionist picking up a call",
          },
          {
            title: "Everything they said lands in one place — automatically",
            description:
              "Name, phone, what they wanted, when they want it — all dropped into your CRM the moment the call ends. The full transcript is there too. You see it on your phone or computer in seconds.",
            image: IMG.step2Saved,
            imageAlt: "Call details saved to the CRM",
          },
          {
            title: "Every caller moves through your pipeline visibly",
            description:
              "New caller → Qualified → Booked → Showed → Followed up. You see exactly who's where without asking anyone. Nothing falls through the cracks.",
            image: IMG.step3Pipeline,
            imageAlt: "Caller pipeline view",
          },
          {
            title: "Right message at the right time — automatically",
            description:
              "Booking confirmation text the second they hang up. Reminder the day before. Follow-up after the appointment. All in your brand voice, all automatic.",
            image: IMG.step4Messages,
            imageAlt: "Automated follow-up messages",
          },
          {
            title: "Monday morning, you see what your phone produced last week",
            description:
              "How many calls came in. How many converted to bookings. Which marketing channel drove the most. A clean weekly summary — no spreadsheet needed.",
            image: IMG.step5Report,
            imageAlt: "Weekly call performance summary",
          },
        ]}
        outcome="Most businesses recover ten to twenty after-hours and overflow calls per week that would have gone to voicemail."
        replaces={["Dialzara", "Rosie", "Smith.ai", "missed-call voicemail"]}
      />
    ),
  },
  // 2. Web chat
  {
    category: "Inbound · web",
    title: "Web chat that books appointments",
    src: ph("Web chat", "7ea687"),
    visual: <CardStyle2Photo src="/industries/card-web-chat-photo.jpg" />,
    content: (
      <ChannelBodySteps
        steps={[
          {
            title: "A visitor lands on your site — and gets a real conversation",
            description:
              "The chat widget invites every visitor in your brand voice. It answers product, pricing, and scheduling questions the same way your best front-desk person would. Hands off to a human only when there's real interest.",
            image: "/industries/card-web-chat-photo.jpg",
            imageAlt: "Web chat widget on a business website",
          },
          {
            title: "Their interest lands in your CRM — automatically",
            description:
              "Name, what they asked about, what they want, what they're worried about — all dropped into your lead list. Conversation history attached. Ready for your team's follow-up.",
            image: IMG.step2Saved,
            imageAlt: "Chat lead saved to CRM",
          },
          {
            title: "Every chat moves through your pipeline visibly",
            description:
              "Visitor → Engaged → Qualified → Booked. Cold visitors auto-tag as cold, hot visitors ping your phone. Nothing sits in a forgotten Intercom inbox.",
            image: IMG.step3Pipeline,
            imageAlt: "Chat lead pipeline view",
          },
          {
            title: "Follow-up keeps going after they close the tab — automatically",
            description:
              "Booking confirmation. Pre-appointment prep. Post-visit review request. Re-engagement for ghosted chats. All in your voice, all automatic.",
            image: IMG.step4Messages,
            imageAlt: "Automated chat follow-up sequence",
          },
          {
            title: "Monday morning, you see which pages produced chats",
            description:
              "Chats by page. Chat-to-booking conversion. Common questions asked. A clean weekly summary so you can fix the page that's losing visitors.",
            image: IMG.step5Report,
            imageAlt: "Weekly web chat performance summary",
          },
        ]}
        outcome="Sites with intelligent chat typically book ten to twenty percent more appointments from existing traffic — no ad spend increase needed."
        replaces={["Intercom", "Tidio", "Drift starter plans"]}
      />
    ),
  },
  // 3. WhatsApp + Instagram DMs
  {
    category: "Inbound · messaging",
    title: "WhatsApp + Instagram DMs",
    src: ph("WhatsApp · IG", "25D366"),
    visual: <CardStyle2Photo src="/industries/card-whatsapp-ig-photo.jpg" />,
    content: (
      <ChannelBodySteps
        steps={[
          {
            title: "A customer DMs you — they get a real reply in seconds",
            description:
              "Whether they message your WhatsApp Business number or your Instagram inbox, your AI replies immediately in your brand voice. No more “DMs disappear into the void.” No more answering the same five questions at 9 PM.",
            image: "/industries/card-whatsapp-ig-photo.jpg",
            imageAlt: "WhatsApp Business chat thread on a phone",
          },
          {
            title: "Their message thread lands in your CRM — automatically",
            description:
              "Every DM, every reply, every photo — saved alongside their contact record. You never lose context when they message again two weeks later.",
            image: IMG.step2Saved,
            imageAlt: "DM thread saved to contact record",
          },
          {
            title: "Every DM moves through your pipeline visibly",
            description:
              "New DM → Qualified → Booked → Followed up. Tag conversations by source so you know which platform actually delivers buyers.",
            image: IMG.step3Pipeline,
            imageAlt: "DM lead pipeline view",
          },
          {
            title: "Follow-up continues without you babysitting the inbox — automatically",
            description:
              "Booking confirmations. Reminders. Win-back nudges for cold threads. All sent through WhatsApp or DM in your brand voice, all automatic.",
            image: IMG.step4Messages,
            imageAlt: "Automated DM follow-up sequence",
          },
          {
            title: "Monday morning, you see what social actually generated",
            description:
              "DMs by platform. DM-to-booking conversion. Which ads or posts drove the most replies. A clean weekly summary so you can double down on what works.",
            image: IMG.step5Report,
            imageAlt: "Weekly DM performance summary",
          },
        ]}
        outcome="Service businesses on Instagram typically lose forty percent of inbound DMs to slow replies — automation captures them all."
        replaces={["Manychat", "Chatfuel", "manual DM checking"]}
      />
    ),
  },
  // 4. Missed-call text-back
  {
    category: "Inbound · recovery",
    title: "Missed-call text-back",
    src: ph("Missed-call text", "E89F1F"),
    visual: <CardStyle2Photo src="/industries/card-missed-call-text-photo.jpg" />,
    content: (
      <ChannelBodySteps
        steps={[
          {
            title: "A call comes in while you're busy — and gets recovered",
            description:
              "Every missed call triggers an automatic SMS within seconds: “Hi, sorry we missed you — want to book a time, or have us call you back?” The caller gets a response before they have time to dial your competitor.",
            image: "/industries/card-missed-call-text-photo.jpg",
            imageAlt: "Missed-call notification with auto-SMS reply",
          },
          {
            title: "Their info lands in your CRM — automatically",
            description:
              "Phone number, time of call, your auto-reply, and any reply they send back — all saved together. You never wonder “who was that and what did they want?”",
            image: IMG.step2Saved,
            imageAlt: "Missed-call lead saved to CRM",
          },
          {
            title: "Every missed call moves through your pipeline visibly",
            description:
              "Missed → Texted back → Replied → Booked or Closed. You see exactly which missed calls were saved and which became jobs.",
            image: IMG.step3Pipeline,
            imageAlt: "Missed-call recovery pipeline view",
          },
          {
            title: "If they don't reply, follow-up still happens — automatically",
            description:
              "Second nudge the next day. Final follow-up a few days later. All in your shop's voice, all gentle, all automatic.",
            image: IMG.step4Messages,
            imageAlt: "Automated missed-call follow-up sequence",
          },
          {
            title: "Monday morning, you see how much revenue your missed calls produced",
            description:
              "Missed calls. Recovery rate. Revenue rescued. A clean weekly summary so you know how much your old voicemail was actually costing you.",
            image: IMG.step5Report,
            imageAlt: "Weekly missed-call recovery summary",
          },
        ]}
        outcome="Forty to sixty percent of missed callers never call back — this single workflow plugs the biggest leak in most service businesses."
        replaces={["nothing — most businesses just lose these"]}
      />
    ),
  },
  // 5. Web forms
  {
    category: "Inbound · form",
    title: "Web forms routed straight to pipeline",
    src: ph("Web forms", "8B7BB8"),
    visual: <CardStyle2Photo src="/industries/card-web-form-photo.jpg" />,
    content: (
      <ChannelBodySteps
        steps={[
          {
            title: "Someone fills out your form — and gets a response in seconds",
            description:
              "Contact form, quote request, intake form, appointment request — every submission triggers an instant intelligent reply. The visitor sees you're responsive before they bounce to a competitor's tab.",
            image: "/industries/card-web-form-photo.jpg",
            imageAlt: "Web form submission on a laptop",
          },
          {
            title: "Their submission lands in your CRM — automatically",
            description:
              "Every form field saved, tagged by source so you know exactly which form on which page drove the lead. Ready for your team's review in seconds.",
            image: IMG.step2Saved,
            imageAlt: "Form submission saved to CRM",
          },
          {
            title: "Every form lead moves through your pipeline visibly",
            description:
              "Submitted → Auto-replied → Qualified → Booked. You see which forms produce buyers and which produce tire-kickers.",
            image: IMG.step3Pipeline,
            imageAlt: "Form lead pipeline view",
          },
          {
            title: "Follow-up runs even if they don't reply right away — automatically",
            description:
              "Instant confirmation. Booking link in the first message. Reminder if they don't book in 24 hours. Win-back a week later. All in your brand voice.",
            image: IMG.step4Messages,
            imageAlt: "Automated form-lead follow-up sequence",
          },
          {
            title: "Monday morning, you see which forms actually work",
            description:
              "Submissions by form. Submission-to-booking conversion. Average response time. A clean weekly summary so you can kill the forms that don't convert and double down on what does.",
            image: IMG.step5Report,
            imageAlt: "Weekly form performance summary",
          },
        ]}
        outcome="Pre-built form templates per industry mean no Zapier setup, no Typeform monthly fee, and instant routing to your pipeline."
        replaces={["Typeform", "JotForm", "Google Forms + Zapier"]}
      />
    ),
  },
  // 6. Email-to-inbox aggregation
  {
    category: "Inbound · email",
    title: "Email-to-inbox aggregation",
    src: ph("Unified inbox", "5e8268"),
    visual: <CardStyle2Photo src="/industries/card-unified-inbox-photo.jpg" />,
    content: (
      <ChannelBodySteps
        steps={[
          {
            title: "An email lands — and joins everything else in one inbox",
            description:
              "Inbound emails to your business address arrive in the same unified inbox as your voice transcripts, chats, and DMs. One place to triage everything. No more flipping between Gmail and your CRM.",
            image: "/industries/card-unified-inbox-photo.jpg",
            imageAlt: "Unified inbox showing email + voice + chat threads",
          },
          {
            title: "Senders are matched to existing contacts — automatically",
            description:
              "New senders create a contact record. Returning senders attach to the existing one. Conversation history is always one click away.",
            image: IMG.step2Saved,
            imageAlt: "Email sender matched to existing contact",
          },
          {
            title: "Every email thread moves through your pipeline visibly",
            description:
              "New email → Tagged → Replied → Booked or Closed. Auto-tagging by content (quote request, scheduling, complaint, vendor) keeps the queue scannable.",
            image: IMG.step3Pipeline,
            imageAlt: "Email thread pipeline view",
          },
          {
            title: "AI drafts a reply in your voice — you approve or auto-send",
            description:
              "For common questions, AI drafts a response in your tone for you to one-click approve. For repetitive vendor or scheduling emails, full auto-reply. You get your hours back.",
            image: IMG.step4Messages,
            imageAlt: "AI-drafted email reply ready for approval",
          },
          {
            title: "Monday morning, you see what your inbox actually was",
            description:
              "Emails by type. Reply time. Which threads converted to revenue. A clean weekly summary so you can spot what your inbox is actually costing or earning.",
            image: IMG.step5Report,
            imageAlt: "Weekly inbox performance summary",
          },
        ]}
        outcome="Operators triaging voice, chat, DM, and email from one screen save eight to fifteen hours per week of inbox switching."
        replaces={["Front", "Help Scout starter plans", "shared Gmail"]}
      />
    ),
  },
];

/**
 * Step-by-step body for the Lead Capture channels — same visual structure
 * as IndustryBodySteps but with an additional "Replaces" footer that
 * calls out the competitor tools each channel substitutes for. Five
 * plain-language steps per channel + outcome + replaces.
 */
function ChannelBodySteps({
  steps,
  outcome,
  replaces,
}: {
  steps: {
    title: string;
    description: string;
    image?: string | React.ReactNode;
    imageAlt?: string;
  }[];
  outcome: string;
  replaces: string[];
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
      <div className="pt-5 border-t border-text-muted/15 space-y-4">
        <div>
          <div className="mono-label text-text-dim text-xs mb-1">Real-world outcome</div>
          <p className="text-[15px] md:text-base">{outcome}</p>
        </div>
        <div>
          <div className="mono-label text-text-dim text-xs mb-1">Replaces</div>
          <p className="text-[15px] md:text-base text-text-muted/80">{replaces.join(" · ")}</p>
        </div>
      </div>
    </div>
  );
}

export function Scene3LeadCaptureCarousel() {
  const items = CHANNELS.map((c, i) => <Card key={c.title} card={c} index={i} />);
  return (
    <div className="w-full">
      {/* arrowsPosition="right" — Shamil 2026-05-24: arrows on the right
          side of this specific carousel only (the carousel itself was also
          shifted left so they read together as a unit). */}
      <Carousel items={items} arrowsPosition="right" />
    </div>
  );
}
