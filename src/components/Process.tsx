/**
 * Process — "What working with us looks like" 3-step timeline (Shamil
 * 2026-08-16, modeled on Stone Systems' process section — same three steps
 * and their disarming honesty, rewritten in our voice; do NOT copy their
 * text verbatim). Mounted on the homepage after Pricing.
 */

type Theme = "dark" | "light";

const T = {
  dark: {
    kicker: "text-[#8fb496]",
    title: "text-[#ece9e0]",
    lead: "text-[#ece9e0]",
    body: "text-[#a7ada3]",
    circle: "border-[#8fb496]/40 bg-[#0e120f] text-[#8fb496]",
    line: "border-white/15",
  },
  light: {
    kicker: "text-accent",
    title: "text-text",
    lead: "text-text",
    body: "text-text-muted",
    circle: "border-accent/40 bg-surface text-accent",
    line: "border-border",
  },
} as const;

const STEPS = [
  {
    title: "Intro call — 20 minutes",
    text: "Yes, it's technically a sales call — no point pretending otherwise. But a useful one: bring every question you have, we'll show you the system running live, and you'll leave knowing exactly what you'd get and what it costs.",
  },
  {
    title: "We build your system — 7–10 days",
    text: "You fill out one onboarding form — your services, prices, common questions, booking rules. We take it from there: website, receptionist, review engine, campaigns — built, connected, and tested before you ever see it.",
  },
  {
    title: "Launch call — 25 minutes",
    text: "We walk you through everything live and hand you the keys. And by \"everything\" we mostly mean two buttons — the system answers, follows up, and asks for reviews on its own.",
  },
];

export default function Process({ theme = "dark" }: { theme?: Theme }) {
  const t = T[theme];
  return (
    <section id="process" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p
            className={`font-mono text-xs font-medium tracking-[0.18em] uppercase ${t.kicker}`}
          >
            The process
          </p>
          <h2
            className={`mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl ${t.title}`}
          >
            What working with us looks like
          </h2>
        </div>
        <div className="relative mt-14 grid gap-10 sm:grid-cols-3">
          {/* Connecting line behind the step numbers (desktop only). */}
          <div
            aria-hidden
            className={`absolute top-6 right-0 left-0 hidden border-t border-dashed sm:block ${t.line}`}
          />
          {STEPS.map((step, i) => (
            <div key={step.title}>
              <span
                className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border font-mono text-sm font-semibold ${t.circle}`}
              >
                {i + 1}
              </span>
              <h3 className={`mt-5 text-xl font-semibold ${t.lead}`}>
                {step.title}
              </h3>
              <p className={`mt-2 leading-relaxed ${t.body}`}>{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
