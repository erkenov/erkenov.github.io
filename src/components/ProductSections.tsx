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
 * Copy: Stone Systems' sales logic rewritten in our honest voice — the
 * gating-flavored claims became the fix-first philosophy; SEO/GEO is
 * mentioned honestly as built-in-but-a-long-game, with the "do we sell
 * ongoing SEO" decision deliberately parked.
 */

type SectionId = "website" | "receptionist" | "reviews" | "campaigns";

type ProductSection = {
  id: SectionId;
  kicker: string;
  title: string;
  bullets: { lead: string; text: string }[];
  /** Video slot label for sections that get a founder video later. */
  videoLabel?: string;
};

const SECTIONS: Record<SectionId, ProductSection> = {
  website: {
    id: "website",
    kicker: "The foundation",
    title: "A website that brings you customers",
    bullets: [
      {
        lead: "Built to be found on Google — and in AI answers.",
        text: "Your site ships with proper SEO and GEO — the technical setup that makes Google and AI assistants show your business when people search for what you do. The honest part: that's the starting line, not the finish. Rankings are a long game, and someone has to keep playing it. What we guarantee is a site built right.",
      },
      {
        lead: "Your best reviews, front and center.",
        text: "Your top reviews showcased on every page, kept current, every one answered. And when a bad experience happens, our follow-up system helps you fix the mistake before it ever becomes a public review.",
      },
      {
        lead: "Works perfectly on a phone.",
        text: "Most customers will find you on their phone, so that's what we build for first: big buttons, tap-to-call, fast loading. No pinching, no zooming — and no customers lost to a clunky site.",
      },
      {
        lead: "Starts conversations, not email threads.",
        text: "Forms and chat that open an SMS conversation the moment someone reaches out — so their number is captured even if they leave the site.",
      },
    ],
    videoLabel: "Shamil walks through a real website build",
  },
  receptionist: {
    id: "receptionist",
    kicker: "The receptionist",
    title: "A front desk that never sleeps",
    bullets: [
      {
        lead: "Every call, chat, and text — answered in seconds.",
        text: "Around 80% of callers who reach voicemail hang up without leaving a message — and most of them dial the next business on the list. The receptionist picks up 24/7, weekends and holidays included.",
      },
      {
        lead: "One receptionist on every channel.",
        text: "Voice on the phone, voice on your website, and SMS chat — same knowledge, same manners, everywhere your customers are.",
      },
      {
        lead: "Books straight into your calendar.",
        text: "Answers questions from your actual info, schedules the appointment, and captures every lead's name, number, and email.",
      },
      {
        lead: "You know the moment it happens.",
        text: "Every booking and every lead is texted and emailed to you instantly — nothing waits in a dashboard you forget to check.",
      },
    ],
    videoLabel: "Shamil shows the receptionist handling a real call",
  },
  reviews: {
    id: "reviews",
    kicker: "After the job",
    title: "Protect your rating — without risking fines",
    bullets: [
      {
        lead: "Bad reviews stopped before they reach Google.",
        text: "A day after the job, the system asks the customer how it went. Unhappy? You get alerted instantly and fix it first — then they can review the full picture, including how you made it right.",
      },
      {
        lead: "Protection without the legal risk.",
        text: "Some agencies secretly filter out unhappy customers to fake a perfect score. That can get your reviews wiped and cost tens of thousands in fines. We build it the honest way: everyone gets the review link — you get the same protection, none of the risk.",
      },
      {
        lead: "Gentle automatic reminders.",
        text: "Most happy customers don't refuse to leave a review — they forget. Spaced follow-ups over a few weeks jog their memory without nagging.",
      },
      {
        lead: "Your past customers go to work on day one.",
        text: "We gradually run your existing customer list through review and referral requests — and every new customer gets the same from then on.",
      },
    ],
    videoLabel: "Shamil runs a real customer through the review flow",
  },
  campaigns: {
    id: "campaigns",
    kicker: "Keep them coming back",
    title: "One-click campaigns & referrals",
    bullets: [
      {
        lead: "Your customer list, one click away.",
        text: "Send an offer, an update, or a seasonal reminder to everyone who's ever bought from you — repeat business on demand.",
      },
      {
        lead: "The referral ask is built in.",
        text: "Every happy customer is automatically invited to send a friend your way — the highest-trust lead there is.",
      },
      {
        lead: "On from day one.",
        text: "Existing customers get their referral and feedback request the moment we switch on; every new customer gets it automatically after that.",
      },
    ],
    videoLabel: "Shamil sends a campaign to a real customer list",
  },
};

/** Theme tokens: the funnel is dark premium, the homepage is light sage. */
type Theme = "dark" | "light";

const T = {
  dark: {
    kicker: "text-[#8fb496]",
    title: "text-[#ece9e0]",
    // Bullet leads in amber (Erken particle color) — Shamil 2026-08-13.
    lead: "text-amber-400",
    body: "text-[#a7ada3]",
    videoBox:
      "border-white/10 bg-gradient-to-br from-[#131814] to-[#0e120f]",
    videoLabel: "text-[#a7ada3]",
    note: "text-[#a7ada3]",
  },
  light: {
    kicker: "text-accent",
    title: "text-text",
    // Darker amber on the light theme so it stays readable on cream.
    lead: "text-amber-700",
    body: "text-text-muted",
    videoBox: "border-border bg-gradient-to-br from-surface to-surface-2",
    videoLabel: "text-text-muted",
    note: "text-text-muted",
  },
} as const;

function Kicker({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme: Theme;
}) {
  return (
    <p
      className={`font-mono text-xs font-medium tracking-[0.18em] uppercase ${T[theme].kicker}`}
    >
      {children}
    </p>
  );
}

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
        <Kicker theme={theme}>{section.kicker}</Kicker>
        <h3
          className={`mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl ${t.title}`}
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
