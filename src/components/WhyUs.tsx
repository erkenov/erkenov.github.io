import { RefreshCw, Calculator, Unlock } from "lucide-react";

/**
 * WhyUs — the "why work with us" block (Shamil 2026-08-13, inspired by Stone
 * Systems' why-us section). The centerpiece is the HONEST ECONOMICS framing:
 * not "we're nice people" (nobody believes that) but the math that makes a
 * fair price rational — build once on snapshots, serve hundreds, keep
 * improving everyone's system.
 * Slimmed and re-merged (Shamil 2026-08-16): "Affordable" absorbed
 * "A hundred clients, not one"; "Constant improvements" absorbed
 * "Someone watching the market". Third card = "Contracts not necessary",
 * restored as the easy placeholder until he thinks of something better.
 * Used on the homepage (light). The dark theme stays available for any
 * future funnel page (the /receptionist funnel was retired 2026-08-16 —
 * the main page is the selling page now).
 */

type Theme = "dark" | "light";

const T = {
  dark: {
    kicker: "text-[#8fb496]",
    title: "text-[#ece9e0]",
  },
  light: {
    kicker: "text-accent",
    title: "text-text",
  },
} as const;

/* Card styling is theme-independent now (Shamil 2026-08-16): sage-green
   card background on BOTH themes, with bright cream text and amber icons
   so everything stays readable on sage. */
const CARD = {
  card: "border-white/10 bg-[#8fb496]",
  lead: "text-white",
  body: "text-white/85",
  icon: "border-amber-300/50 bg-amber-300/15 text-amber-300",
} as const;

const CARDS = [
  {
    icon: Calculator,
    lead: "Affordable — and here's the honest math.",
    body: "We build each system once and refine it forever, then run many businesses on it. A hundred clients at a fair price beats squeezing one with expensive custom work — you're not buying hours, you're buying a system that's already built and proven across businesses like yours. That's why the price is what it is.",
  },
  {
    icon: RefreshCw,
    lead: "Constant improvements, included.",
    body: "Your system keeps getting better at no extra charge — new automations, better scripts, smarter follow-ups. And because platforms and AI move fast, we watch the market for you: we test what's worth having and bring it to you first. You'll never have to wonder if something better is out there — if there is, we'll offer it.",
  },
  {
    // Third card = easy placeholder for now (Shamil 2026-08-16: "make it
    // easy, maybe I'll think of something better later") — restored the
    // contracts card since the copy already existed.
    icon: Unlock,
    lead: "Contracts not necessary.",
    body: "We work month to month — if you're happy, you'll stay, and if you're not, you shouldn't have to pay to leave. But if you want one — for your accountant, your partner, or your peace of mind — just ask and we'll put one together for you.",
  },
];

export default function WhyUs({ theme = "dark" }: { theme?: Theme }) {
  const t = T[theme];
  return (
    <section id="why-us" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p
            className={`font-mono text-xs font-medium tracking-[0.18em] uppercase ${t.kicker}`}
          >
            Why us
          </p>
          <h2
            className={`mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl ${t.title}`}
          >
            Fair questions, straight answers
          </h2>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map(({ icon: Icon, lead, body }) => (
            <div
              key={lead}
              className={`rounded-2xl border p-7 ${CARD.card}`}
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-lg border ${CARD.icon}`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <p className={`mt-5 text-lg font-semibold ${CARD.lead}`}>{lead}</p>
              <p className={`mt-2 leading-relaxed ${CARD.body}`}>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
