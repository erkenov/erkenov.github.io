"use client";

/**
 * Scene2Channels — Apple Cards Carousel for the Lead Generation scene.
 *
 * Horizontal carousel of channel cards. Click any card to expand into a
 * full modal with details. Channels = lead-gen methods Shamil offers.
 *
 * Order locked 2026-05-23 (Shamil): Voice agent FIRST (the flagship
 * channel), then Google Maps scraping, cold email, Meta Business AI,
 * LinkedIn. Voice agent now uses an inline animated mockup visual
 * instead of a static placeholder; other cards still use placeholder
 * thumbnails until real visuals are produced.
 */

import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { Scene2VoiceAgentVisual } from "@/components/Scene2VoiceAgentVisual";
import { Scene2GoogleMapsVisual } from "@/components/Scene2GoogleMapsVisual";
import { Scene2ColdEmailVisual } from "@/components/Scene2ColdEmailVisual";

type ChannelCard = {
  src: string;
  title: string;
  category: string;
  content: React.ReactNode;
  visual?: React.ReactNode;
};

// Placeholder thumbnail URLs — sage primary + terracotta accent on cream.
// Aspect 4:5 (portrait) — the carousel cards are tall.
const ph = (label: string, bg: string, fg = "F5F1E8") =>
  `https://placehold.co/640x800/${bg}/${fg}?text=${encodeURIComponent(label)}&font=inter`;

const CHANNELS: ChannelCard[] = [
  {
    category: "Outbound · voice",
    title: "AI voice agent that calls",
    src: ph("Voice agent", "C76B58"),
    visual: <Scene2VoiceAgentVisual />,
    content: (
      <CardBody>
        <p>
          An AI agent on Retell makes the outbound call — qualifies the
          prospect, books the meeting, hands off to a human only when
          there&apos;s real interest.
        </p>
        <p>
          Calls hundreds of numbers a day at a fraction of the cost of
          human SDRs, with a transcript and a recording for every contact.
        </p>
      </CardBody>
    ),
  },
  {
    category: "Outbound · scrape",
    title: "Google Maps prospecting",
    src: ph("Google Maps", "7ea687"),
    visual: <Scene2GoogleMapsVisual />,
    content: (
      <CardBody>
        <p>
          Daily scraper pulls businesses in your category and city — name,
          phone, website, hours, owner photo, review count, last-review date.
        </p>
        <p>
          Scored against your ideal-customer profile, deduplicated against
          your CRM, and dropped into the outreach queue.
        </p>
      </CardBody>
    ),
  },
  {
    category: "Outbound · email",
    title: "Cold email at scale",
    src: ph("Cold email", "5e8268"),
    visual: <Scene2ColdEmailVisual />,
    content: (
      <CardBody>
        <p>
          Personalised first-line generation per prospect, sent through
          warmed-up inboxes with reputation monitoring. Reply tracking +
          auto-pause on opt-outs.
        </p>
        <p>
          Replies routed straight into the same pipeline as inbound leads —
          no separate inbox to babysit.
        </p>
      </CardBody>
    ),
  },
  {
    category: "Paid · Meta",
    title: "Meta Business AI on FB / Instagram",
    src: ph("Meta ads", "E89F1F"),
    content: (
      <CardBody>
        <p>
          Custom AI agents embedded in your Facebook and Instagram ads —
          answer product questions, qualify, hand off to your CRM. Learns
          from your existing posts, ads, and website.
        </p>
        <p>
          Free for eligible advertisers via Meta Business Suite. No code,
          no third-party platforms.
        </p>
      </CardBody>
    ),
  },
  {
    category: "Outbound · LinkedIn",
    title: "LinkedIn outreach (white-collar)",
    src: ph("LinkedIn", "A8B86C"),
    content: (
      <CardBody>
        <p>
          For B2B / professional-services work: targeted connection
          requests, personalised first messages, follow-up sequences.
        </p>
        <p>
          Built on the same scoring + deduplication backbone as the email
          channel — your sales pipeline doesn&apos;t care which channel a
          lead came from.
        </p>
      </CardBody>
    ),
  },
];

function CardBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-4 text-base text-text-muted leading-relaxed">
      {children}
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
