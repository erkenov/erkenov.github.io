import { Check, Play } from "lucide-react";

/**
 * ProductSections — the "what you get" product block, used on the homepage
 * (website → receptionist → reviews → campaigns). The /receptionist funnel
 * (which used the receptionist-first order) was retired 2026-08-16 — the
 * main page is the selling page now; the `order` prop stays for reuse.
 *
 * Layout: alternating text/media sections in Stone Systems' rhythm. Every
 * section's media side is a video slot for founder-recorded walkthroughs
 * (Shamil 2026-08-16: the interactive ReviewDemo animation in the review
 * section was replaced with a video placeholder too — video comes later).
 *
 * Copy formula (Shamil 2026-08-16, Stone-style): the H3 header states the
 * OUTCOME the client gets; the check-marked bullets explain HOW, in short
 * plain language. The small kicker labels ("The foundation" etc.) were
 * removed same day — they made the blocks fade together; the big headers
 * carry the sage accent color instead.
 */

type SectionId = "website" | "receptionist" | "reviews" | "campaigns";

type ProductSection = {
  id: SectionId;
  title: string;
  bullets: { lead: string; text: string }[];
  /** Video slot label for sections that get a founder video later. */
  videoLabel?: string;
};

const SECTIONS: Record<SectionId, ProductSection> = {
  website: {
    id: "website",
    title: "A website that brings you customers",
    bullets: [
      {
        lead: "Customers find you on Google — not your competitor.",
        text: "Proper SEO and GEO built in from day one, so you show up when locals search for what you do. The honest part: rankings are a long game — we build the site right, we don't sell miracles.",
      },
      {
        lead: "New customers trust you before they ever call.",
        text: "Your best reviews on every page, kept current, every one answered — the first thing people check before choosing.",
      },
      {
        lead: "Looks perfect on the phone they found you on.",
        text: "That's where most customers come from, so that's what we build for first: big buttons, tap-to-call, fast loading.",
      },
      {
        lead: "You get their number — even if they leave.",
        text: "Forms and chat open a text conversation the moment someone reaches out, so no visitor leaves without a trace.",
      },
    ],
    videoLabel: "Shamil walks through a real website build",
  },
  receptionist: {
    id: "receptionist",
    title: "An AI receptionist that never misses a lead",
    bullets: [
      {
        lead: "Every caller gets an answer — in seconds, 24/7.",
        text: "Phone, SMS, and web chat — one receptionist on all of them, weekends and holidays included. Around 80% of callers who reach voicemail hang up and dial the next business; yours won't.",
      },
      {
        lead: "Answers like your best employee.",
        text: "It's trained on your services, prices, and the questions your customers actually ask — it knows your business inside out.",
      },
      {
        lead: "Your calendar fills itself.",
        text: "It books the appointment on the spot and captures every lead's name, number, and email.",
      },
      {
        lead: "You get a text the moment someone books.",
        text: "Every booking and every lead lands in your pocket instantly — nothing waits in a dashboard you forget to check.",
      },
    ],
    videoLabel: "Shamil shows the receptionist handling a real call",
  },
  reviews: {
    id: "reviews",
    title: "A flood of fresh 5-star reviews",
    bullets: [
      {
        lead: "New reviews start rolling in on day one.",
        text: "The request goes out the same day the job is done, while the good feeling is fresh — and your existing customers get asked right away too.",
      },
      {
        lead: "Happy customers actually follow through.",
        text: "They don't refuse to leave a review — they forget. Gentle spaced reminders over the next few weeks make sure it happens, without nagging.",
      },
      {
        lead: "A bad day never becomes a bad review.",
        text: "If a customer had a problem, you're alerted instantly and fix it first — then they review the full picture, including how you made it right.",
      },
      {
        lead: "All the protection, none of the legal risk.",
        text: "Some agencies secretly filter out unhappy customers to fake a perfect score — that can get your reviews wiped and cost tens of thousands in fines. Here, everyone gets the review link: same protection, none of the risk.",
      },
    ],
    videoLabel: "Shamil runs a real customer through the review flow",
  },
  campaigns: {
    id: "campaigns",
    title: "One-click marketing campaigns",
    bullets: [
      {
        lead: "Slow week? Fill it with one click.",
        text: "Send an offer, an update, or a seasonal reminder to everyone who's ever bought from you — repeat business on demand.",
      },
      {
        lead: "Every happy customer brings you the next one.",
        text: "The referral ask is built in — each customer is automatically invited to send a friend your way, the highest-trust lead there is.",
      },
      {
        lead: "It runs itself from day one.",
        text: "Existing customers get their first campaign the moment we switch on; every new customer gets it automatically after that.",
      },
    ],
    videoLabel: "Shamil sends a campaign to a real customer list",
  },
};

/** Theme tokens: the funnel is dark premium, the homepage is light sage. */
type Theme = "dark" | "light";

const T = {
  dark: {
    // Section headers in sage (Shamil 2026-08-16: kickers removed, the big
    // header carries the accent color instead).
    title: "text-[#8fb496]",
    // Bullet leads in amber (Erken particle color) — Shamil 2026-08-13.
    lead: "text-amber-400",
    body: "text-[#a7ada3]",
    videoBox:
      "border-white/10 bg-gradient-to-br from-[#131814] to-[#0e120f]",
    videoLabel: "text-[#a7ada3]",
    note: "text-[#a7ada3]",
  },
  light: {
    title: "text-accent",
    // Darker amber on the light theme so it stays readable on cream.
    lead: "text-amber-700",
    body: "text-text-muted",
    videoBox: "border-border bg-gradient-to-br from-surface to-surface-2",
    videoLabel: "text-text-muted",
    note: "text-text-muted",
  },
} as const;

function VideoSlot({ label, theme }: { label: string; theme: Theme }) {
  return (
    <div
      className={`group relative aspect-video w-full overflow-hidden rounded-2xl border ${T[theme].videoBox}`}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-amber-400/40 bg-amber-400/10 transition group-hover:bg-amber-400/20">
          <Play className="h-6 w-6 fill-amber-400 text-amber-400" />
        </div>
        <p
          className={`text-center font-mono text-xs tracking-[0.18em] uppercase ${T[theme].videoLabel}`}
        >
          Video coming — {label}
        </p>
      </div>
    </div>
  );
}

function SectionBlock({
  section,
  flip,
  theme,
}: {
  section: ProductSection;
  flip: boolean;
  theme: Theme;
}) {
  const t = T[theme];
  return (
    <div
      id={`product-${section.id}`}
      className="grid scroll-mt-24 items-center gap-10 md:grid-cols-2 md:gap-14"
    >
      {/* Text column */}
      <div className={flip ? "md:order-2" : ""}>
        <h3
          className={`text-3xl font-semibold tracking-tight text-balance sm:text-4xl ${t.title}`}
        >
          {section.title}
        </h3>
        <ul className="mt-8 space-y-6">
          {section.bullets.map((b) => (
            <li key={b.lead} className="flex items-start gap-3">
              <Check className={`mt-1 h-5 w-5 shrink-0 ${t.lead}`} />
              <div>
                <p className={`text-lg font-semibold ${t.lead}`}>{b.lead}</p>
                <p className={`mt-1.5 leading-relaxed ${t.body}`}>{b.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* Media column — uniform video slots for all sections (Shamil
          2026-08-16): the interactive ReviewDemo animation is OUT for now;
          a founder-recorded video goes in later like the other sections. */}
      <div className={flip ? "md:order-1" : ""}>
        <VideoSlot label={section.videoLabel!} theme={theme} />
      </div>
    </div>
  );
}

export default function ProductSections({
  order = ["website", "receptionist", "reviews", "campaigns"],
  heading = "What you get",
  theme = "dark",
}: {
  order?: SectionId[];
  heading?: string;
  theme?: Theme;
}) {
  return (
    <section id="what-you-get" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          {/* Heading promoted from a small kicker to a real H2 (Shamil
              2026-08-13: "the what you get header should be bigger"). */}
          <h2
            className={`text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl ${T[theme].title}`}
          >
            {heading}
          </h2>
        </div>
        <div className="mt-16 space-y-24 md:space-y-32">
          {order.map((id, i) => (
            <SectionBlock
              key={id}
              section={SECTIONS[id]}
              flip={i % 2 === 1}
              theme={theme}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
