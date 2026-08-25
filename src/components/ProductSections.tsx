"use client";

import { Check, PhoneCall, Play } from "lucide-react";

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

type SectionId =
  | "get-customers"
  | "never-miss"
  | "never-lose"
  | "customers-bring"
  | "website"
  | "receptionist"
  | "reviews"
  | "campaigns";

type ProductSection = {
  id: SectionId;
  title: string;
  bullets: { lead: string; text: string }[];
  /** Video slot label for sections that get a founder video later. */
  videoLabel?: string;
  /** Optional plain-language note under the bullets. */
  note?: string;
  /** One section-level loss argument as a clay-edged white strip right under
      the title (Shamil 2026-08-24: variant 3 won; Get-customers' per-bullet
      arguments were too weak, so ONE strong argument per section instead). */
  sectionLoss?: { num: string; text: string }[];
};

const SECTIONS: Record<SectionId, ProductSection> = {
  /* The four journey sections (Shamil 2026-08-24): plain-vocabulary stages
     of the customer journey. The OLD sections (website/receptionist/
     reviews/campaigns) were removed from the homepage 2026-08-24 (Shamil);
     their data stays ONLY for the /fly-home demo, which pins the old
     order explicitly. */
  "get-customers": {
    id: "get-customers",
    title: "Get customers",
    bullets: [
      {
        lead: "A website that actually works.",
        text: "Built by me, with proper SEO and GEO from day one — so when locals search Google or ask an AI, it's your school they find. Already have a site? Keep it — the rest of the system works with it; the SEO and GEO come only with a site I build.",
      },
      {
        lead: "Ads that are already built for you.",
        text: "Ready-made Google and Meta campaigns, proven for flight schools and localized to your city. You just turn them on and fund them — they're included in your plan, you only pay the ad spend.",
      },
      {
        lead: "Found everywhere people look.",
        text: "Google Maps, your Business Profile, AI search answers — your presence is set up and kept current wherever a future student might look.",
      },
    ],
    sectionLoss: [
      {
        num: "$13–20K",
        text: "is what ONE enrolled student is worth — and without an online presence, your business doesn't exist for the people searching.",
      },
    ],
    videoLabel: "Shamil walks through a real client acquisition setup",
  },
  "never-miss": {
    id: "never-miss",
    title: "Never miss a customer",
    bullets: [
      {
        lead: "Every call, text, and chat answered — in seconds, 24/7.",
        text: "Phone, SMS, and web chat — one receptionist on all of them, weekends and holidays included. Most voicemail callers simply dial the next school; yours won't get the chance.",
      },
      {
        lead: "Booked on the spot.",
        text: "The moment they want to fly, the AI books the discovery flight straight into your calendar — no back-and-forth, no 'we'll call you back.'",
      },
      {
        lead: "Something always answers.",
        text: "Missed-call text-back, the website chat widget, after-hours coverage — whatever way they reach out, at whatever hour, they get a real answer.",
      },
    ],
    sectionLoss: [
      { num: "8 of 10", text: "callers who hit voicemail hang up and dial the next school." },
    ],
    videoLabel: "Shamil shows the receptionist catching real calls",
  },
  "never-lose": {
    id: "never-lose",
    title: "Never lose a lead",
    bullets: [
      {
        lead: "Every booked flight actually happens.",
        text: "A reminder chain before every discovery flight — the day before, that morning, two hours out. If weather or life cancels it, the rebooking text goes out on its own.",
      },
      {
        lead: "The discovery flight becomes the enrollment.",
        text: "They land buzzing — and that's exactly when the follow-up lands: congratulations, answers to their questions, and the offer to book the next lesson.",
      },
      {
        lead: "Nobody falls through the cracks.",
        text: "A thirteen-to-twenty-thousand-dollar decision takes time for some. The hesitant ones get a multi-week follow-up until they enroll — or tell you to stop.",
      },
    ],
    /* No-show/enrollment stats REMOVED 2026-08-25 (Shamil): he can't vouch
       for the "1 in 3" and "60–80%" figures — only the student-value anchor
       and the certain logic (no messaging = more walk-outs leave) stay. */
    sectionLoss: [
      { num: "$13–20K", text: "walks out the door with every student you stop texting." },
    ],
    videoLabel: "Shamil walks through the follow-up chain",
  },
  "customers-bring": {
    id: "customers-bring",
    title: "Your customers bring you new customers",
    bullets: [
      {
        lead: "Reviews on autopilot.",
        text: "After every flight, the happy student gets asked at the perfect moment — your rating climbs while you're up in the air.",
      },
      {
        lead: "Referrals without the awkward ask.",
        text: "The system invites every happy customer to bring a friend — the highest-trust lead there is — and tracks who came from whom.",
      },
      {
        lead: "Every review gets an answer.",
        text: "Good or bad, each one gets a thoughtful reply — which is what prospects actually read before they choose.",
      },
    ],
    sectionLoss: [
      {
        num: "Only the unhappy",
              text: "customer is motivated enough to leave a review — a happy customer stays silent unless asked.",
      },
    ],
    videoLabel: "Shamil shows the review and referral engine",
  },
  website: {
    id: "website",
    title: "A website that brings you customers",
    bullets: [
      {
        lead: "Customers find you on Google — not your competitor.",
        text: "Proper SEO and GEO built in from day one, so you show up when locals search for what you do.",
      },
      {
        lead: "New customers trust you before they ever call.",
        text: "Your best reviews on every page, kept current, every one answered — the first thing people check before choosing.",
      },
      {
        lead: "Looks perfect on the phone they found you on.",
        text: "That's where most customers come from, so that's what I build for first: big buttons, tap-to-call, fast loading.",
      },
      {
        lead: "You get their number — even if they leave.",
        text: "Forms and chat open a text conversation the moment someone reaches out, so no visitor leaves without a trace.",
      },
    ],
    videoLabel: "Shamil walks through a real website build",
    /* Website-optional note REMOVED 2026-08-24 (Shamil) — the section is
       being restructured around "Get found" (site / ads / reviews /
       referrals); the optional message moves to the What-you-get header
       description. */
  },
  receptionist: {
    id: "receptionist",
    title: "An AI receptionist that never misses a lead",
    bullets: [
      {
        lead: "Every caller gets an answer — in seconds, 24/7.",
        text: "Phone, SMS, and web chat — one receptionist on all of them, weekends and holidays included. Around 80% of callers who reach voicemail hang up and dial the next business; yours won't. And speed decides who gets the student: 78% of buyers go with whoever responds first, and instant answers book at more than double the rate of same-hour follow-up.",
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
        text: "Existing customers get their first campaign the moment I switch on; every new customer gets it automatically after that.",
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
    // The "What you get" H2 stays neutral so it doesn't blend into the
    // sage section headers below it (Shamil 2026-08-16).
    heading: "text-[#ece9e0]",
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
    heading: "text-text",
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

/* The two-minute test as a slim standalone card ABOVE the video in the
 * never-miss media column (Shamil 2026-08-24: the cost card died with the
 * section-strip design; the test is an action, not an argument). */
function TestCard() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-accent">
        The two-minute test
      </p>
      <p className="mt-2 text-sm leading-relaxed text-text-muted">
        Tonight, after 8 PM, call your own business. That&apos;s what a
        motivated customer hears. Then call my line — same scenario,
        different outcome.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => window.__startErkenVoiceCall?.()}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-bg transition-all hover:bg-accent-hover"
        >
          <PhoneCall className="h-4 w-4" />
          Call your AI receptionist
        </button>
        <a
          href="tel:+19016331400"
          className="font-mono text-sm text-text-muted transition-colors hover:text-text"
        >
          or dial (901) 633-1400
        </a>
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
        {section.sectionLoss && (
          <div className="mt-6 rounded-md border-l-2 border-[var(--clay)] bg-surface px-4 py-2.5">
            <ul className="divide-y divide-border/60">
              {section.sectionLoss.map((r) => (
                <li
                  key={r.num}
                  className="py-2 text-sm leading-snug first:pt-0 last:pb-0 md:text-base"
                >
                  <span className="font-mono font-semibold text-[var(--clay)]">
                    {r.num}
                  </span>{" "}
                  <span className="text-text-dim">{r.text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <ul className="mt-8 space-y-6">
          {section.bullets.map((b) => (
            <li key={b.lead} className="flex items-start gap-3">
              <Check className={`mt-1 h-5 w-5 shrink-0 ${t.lead}`} />
              <div className="flex-1">
                <p className={`text-lg font-semibold ${t.lead}`}>{b.lead}</p>
                <p className={`mt-1.5 leading-relaxed ${t.body}`}>{b.text}</p>
              </div>
            </li>
          ))}
        </ul>
        {/* The two-minute test lives UNDER the never-miss text (moved from
            above the video, Shamil 2026-08-24) — homepage light theme only;
            the web-call global exists there. */}
        {section.id === "never-miss" && theme === "light" && (
          <div className="mt-8">
            <TestCard />
          </div>
        )}
        {/* Optional plain-language note (e.g. the website-is-optional
            framing, 2026-08-24) — small muted text under the bullets. */}
        {section.note && (
          <p className={`mt-6 max-w-prose text-sm leading-relaxed ${t.note}`}>
            {section.note}
          </p>
        )}
      </div>
      {/* Media column — uniform video slots for all sections (Shamil
          2026-08-16): the interactive ReviewDemo animation is OUT for now;
          a founder-recorded video goes in later like the other sections. */}
      <div className={flip ? "md:order-1" : ""}>
        <div className="space-y-6">
          <VideoSlot label={section.videoLabel!} theme={theme} />
        </div>
      </div>
    </div>
  );
}

export default function ProductSections({
  order = ["get-customers", "never-miss", "never-lose", "customers-bring"],
  heading = "What you get",
  description,
  theme = "dark",
}: {
  order?: SectionId[];
  heading?: string;
  description?: string;
  theme?: Theme;
}) {
  return (
    <section id="what-you-get" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          {/* Heading promoted from a small kicker to a real H2 (Shamil
              2026-08-13: "the what you get header should be bigger"). */}
          <h2
            className={`text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl ${T[theme].heading}`}
          >
            {heading}
          </h2>
          {description && (
            <p
              className={`mx-auto mt-4 max-w-2xl text-base leading-relaxed md:text-lg ${T[theme].body}`}
            >
              {description}
            </p>
          )}
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
