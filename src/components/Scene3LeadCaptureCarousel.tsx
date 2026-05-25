"use client";

/**
 * Scene3LeadCaptureCarousel — Apple Cards Carousel for the Lead Capture scene.
 *
 * Replaces the SVG funnel visual with scannable cards, one per inbound
 * channel. Each card opens to show what the channel does + which competitor
 * tools it replaces.
 *
 * Channels locked 2026-05-24 (Shamil): Voice receptionist FIRST (the
 * differentiator), then web chat, WhatsApp + Instagram DMs, missed-call
 * text-back, web forms, email-to-inbox.
 */

import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

type ChannelCard = {
  src: string;
  title: string;
  category: string;
  content: React.ReactNode;
};

const ph = (label: string, bg: string, fg = "F5F1E8") =>
  `https://placehold.co/640x800/${bg}/${fg}?text=${encodeURIComponent(label)}&font=inter`;

const CHANNELS: ChannelCard[] = [
  {
    category: "Inbound · voice",
    title: "AI voice receptionist",
    src: ph("Voice receptionist", "C76B58"),
    content: (
      <CardBody replaces={["Dialzara", "Rosie", "Smith.ai", "missed-call voicemail"]}>
        <p>
          Picks up in two rings, twenty-four seven. Qualifies the caller,
          answers FAQs, books the appointment directly into your calendar,
          and drops the full transcript into your CRM.
        </p>
        <p>
          Trained on YOUR business — your hours, your services, your prices,
          your scripts. Not a generic answering bot.
        </p>
      </CardBody>
    ),
  },
  {
    category: "Inbound · web",
    title: "Web chat that books appointments",
    src: ph("Web chat", "7ea687"),
    content: (
      <CardBody replaces={["Intercom", "Tidio", "Drift starter plans"]}>
        <p>
          Live chat widget on your website that answers product and pricing
          questions, qualifies the visitor, and books the call. Hands off to
          a human only when there&apos;s real interest.
        </p>
        <p>
          Same brain as the voice agent — same answers, same booking flow,
          same CRM destination.
        </p>
      </CardBody>
    ),
  },
  {
    category: "Inbound · messaging",
    title: "WhatsApp + Instagram DMs",
    src: ph("WhatsApp · IG", "25D366"),
    content: (
      <CardBody replaces={["Manychat", "Chatfuel", "manual DM checking"]}>
        <p>
          Customers who message your WhatsApp Business number or your
          Instagram DMs get an instant intelligent reply, route to the same
          pipeline as everything else.
        </p>
        <p>
          No more &ldquo;DMs disappear into the void&rdquo; — every message
          is logged, tagged, and followed up automatically.
        </p>
      </CardBody>
    ),
  },
  {
    category: "Inbound · recovery",
    title: "Missed-call text-back",
    src: ph("Missed-call text", "E89F1F"),
    content: (
      <CardBody replaces={["nothing — most businesses just lose these"]}>
        <p>
          Every missed call triggers an automatic SMS within seconds:
          &ldquo;Hi, sorry we missed you — want to book a time or have us call
          you back?&rdquo; Recovers leads that would otherwise hit voicemail
          and never call back.
        </p>
        <p>
          Industry data: forty to sixty percent of missed callers never
          re-attempt. This single workflow plugs the biggest leak in most
          service businesses.
        </p>
      </CardBody>
    ),
  },
  {
    category: "Inbound · form",
    title: "Web forms routed straight to pipeline",
    src: ph("Web forms", "8B7BB8"),
    content: (
      <CardBody replaces={["Typeform", "JotForm", "Google Forms + Zapier"]}>
        <p>
          Contact forms, quote requests, intake forms, appointment requests
          — all flow into the same pipeline as voice and chat. Tagged by
          source so you know which channels actually work.
        </p>
        <p>
          Pre-built form templates per industry: dental new-patient intake,
          auto repair quote request, salon booking form, et cetera.
        </p>
      </CardBody>
    ),
  },
  {
    category: "Inbound · email",
    title: "Email-to-inbox aggregation",
    src: ph("Unified inbox", "5e8268"),
    content: (
      <CardBody replaces={["Front", "Help Scout starter plans", "shared Gmail"]}>
        <p>
          Inbound emails to your business address land in the same unified
          inbox as your voice transcripts, chats, and DMs. One place to
          triage everything.
        </p>
        <p>
          Auto-tagging by sender and content keeps the queue scannable
          instead of buried.
        </p>
      </CardBody>
    ),
  },
];

function CardBody({
  children,
  replaces,
}: {
  children: React.ReactNode;
  replaces: string[];
}) {
  return (
    <div className="space-y-4 text-base text-text-muted leading-relaxed">
      {children}
      <div className="pt-2 border-t border-text-muted/15">
        <div className="mono-label text-text-dim text-xs mb-1">Replaces</div>
        <div className="text-sm text-text-muted/80">{replaces.join(" · ")}</div>
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
