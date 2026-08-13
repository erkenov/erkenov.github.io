import { RefreshCw, Unlock, Calculator, Users, Radar } from "lucide-react";

/**
 * WhyUs — the "why work with us" block (Shamil 2026-08-13, inspired by Stone
 * Systems' why-us section). The centerpiece is the HONEST ECONOMICS framing:
 * not "we're nice people" (nobody believes that) but the math that makes a
 * fair price rational — build once on snapshots, serve hundreds, keep
 * improving everyone's system. Constant-improvements + no-contract +
 * affordable borrowed from Stone; the operator-economics cards are ours.
 * Shared by the homepage (light) and /receptionist (dark).
 */

type Theme = "dark" | "light";

const T = {
  dark: {
    kicker: "text-[#8fb496]",
    title: "text-[#ece9e0]",
    card: "border-white/10 bg-white/[0.03]",
    lead: "text-[#ece9e0]",
    body: "text-[#a7ada3]",
    icon: "border-[#8fb496]/25 bg-[#8fb496]/10 text-[#8fb496]",
  },
  light: {
    kicker: "text-accent",
    title: "text-text",
    card: "border-border bg-surface",
    lead: "text-text",
    body: "text-text-muted",
    icon: "border-accent/25 bg-accent/10 text-accent",
  },
} as const;

const CARDS = [
  {
    icon: Unlock,
    lead: "Contracts not necessary.",
    body: "We work month to month — if you're happy, you'll stay, and if you're not, you shouldn't have to pay to leave. But if you want one — for your accountant, your partner, or your peace of mind — just ask and we'll put one together for you.",
  },
  {
    icon: RefreshCw,
    lead: "Constant improvements, included.",
    body: "We regularly improve the system you already have — new automations, better scripts, smarter follow-ups. You hear about improvements first, approve them, and get them at no extra charge. The longer you stay, the better your system gets.",
  },
  {
    icon: Calculator,
    lead: "Affordable — and here's the honest math.",
    body: "Our platform lets us run many businesses on systems we build once and refine forever. Setup is fast because the heavy lifting is already done. That leverage is why the price is what it is — you're not buying hours, you're buying a system that's already built.",
  },
  {
    icon: Users,
    lead: "A hundred clients, not one.",
    body: "We'd rather serve a hundred businesses well at a fair price than squeeze one with expensive custom work. You get a system proven across businesses like yours — and every improvement we make for anyone flows back to you.",
  },
  {
    icon: Radar,
    lead: "Someone watching the market for you.",
    body: "Platforms change and AI moves fast. We watch the updates, test what's worth having, and bring it to you first. You'll never have to wonder if there's something better out there — if there is, we'll offer it.",
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
              className={`rounded-2xl border p-7 ${t.card} ${lead.startsWith("A hundred") ? "sm:col-span-2 lg:col-span-1" : ""}`}
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-lg border ${t.icon}`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <p className={`mt-5 text-lg font-semibold ${t.lead}`}>{lead}</p>
              <p className={`mt-2 leading-relaxed ${t.body}`}>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
