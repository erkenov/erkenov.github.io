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
 * Cards (Shamil 2026-06-05 audit): Google Maps prospecting (+ enrichment),
 * then cold email at scale. Voice agent moved to Lead Capture as the
 * inbound receptionist — cold AI-calling is a TCPA/robocall risk. Meta
 * Business AI + LinkedIn outreach cut (can't deliver today / poor fit for
 * local SMBs).
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
  // 1. Google Maps prospecting
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
              "Cold email, SMS, and your other channels — pick what to run per list. The system handles timing, follow-up, and unsubscribes for you.",
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
  // 2. Lead enrichment
  {
    category: "Outbound · enrich",
    title: "Lead enrichment",
    src: ph("Enrichment", "6E8B5A"),
    visual: <CardStyle2Photo src="/industries/card-activity-feed-photo.jpg" />,
    content: (
      <ChannelBodySteps
        steps={[
          {
            title: "A raw list comes in — and becomes people you can actually reach",
            description:
              "A scrape gives you a business name and a phone number. Enrichment fills in what's missing: the owner's email, the name of the person who actually decides, and a verified way to reach them. A list of businesses becomes a list of people.",
            image: "/industries/card-activity-feed-photo.jpg",
            imageAlt: "Lead enrichment filling in contact details",
          },
          {
            title: "Every record lands in your CRM — fully filled in, automatically",
            description:
              "Name, role, verified email, company size, socials — appended to each contact and tagged by source. No more half-empty rows you can't do anything with.",
            image: "/industries/enrich-step2-enriched-contact.png",
            imageAlt: "Enriched contact saved to CRM",
          },
          {
            title: "Bad data gets caught before it costs you — automatically",
            description:
              "Dead emails, disconnected numbers, and duplicates are flagged and cleaned, so your outreach doesn't bounce, burn your sender reputation, or waste time on a number that rings nowhere.",
            image: "/industries/enrich-step3-data-cleaning.png",
            imageAlt: "Data verification and cleaning view",
          },
          {
            title: "Enriched leads flow straight into outreach — automatically",
            description:
              "The moment a list is enriched and verified, it's ready for the next step — cold email, a call, or your sales team. No manual hand-off, no copy-paste between tools.",
            image: "/industries/enrich-step4-route-to-outreach.png",
            imageAlt: "Enriched leads routed to outreach",
          },
          {
            title: "Monday morning, you see how reachable your list really is",
            description:
              "Match rate, email-found rate, verified-contact rate per list. A clean weekly summary so you know which sources give you real, reachable people and which give you dead ends.",
            image: "/industries/enrich-step5-match-rate.png",
            imageAlt: "Weekly enrichment match-rate summary",
          },
        ]}
        outcome="Good enrichment lifts a raw scrape from phone-only to roughly sixty to eighty percent with a verified email — the difference between a list you can actually email and one you can only cold-call."
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
              "Sends. Open rate. Reply rate. Booked rate. Whether your emails are still landing in inboxes instead of spam. A clean weekly summary so you can swap subject lines or rest tired inboxes before they stop delivering.",
            image: IMG.step5Report,
            imageAlt: "Weekly cold email performance summary",
          },
        ]}
        outcome="Properly warmed-up sending accounts (so your emails stay out of spam) plus per-prospect personalization typically hold reply rates between three and eight percent — several times generic cold email."
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
