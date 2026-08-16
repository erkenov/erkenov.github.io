import { ChevronDown } from "lucide-react";

/**
 * Faq — "Frequently asked questions" accordion (Shamil 2026-08-16, modeled
 * on Stone Systems' five-question FAQ — same questions and sales logic,
 * rewritten in our honest voice; do NOT copy their answer text verbatim).
 * Shared light/dark theming like ProductSections/WhyUs. Currently mounted
 * on the homepage (light); /receptionist keeps its own funnel-specific FAQ.
 */

type Theme = "dark" | "light";

const T = {
  dark: {
    kicker: "text-[#8fb496]",
    title: "text-[#ece9e0]",
    item: "border-white/10 bg-white/[0.02] divide-white/10",
    question: "text-[#ece9e0]",
    answer: "text-[#a7ada3]",
    chevron: "text-[#8fb496]",
  },
  light: {
    kicker: "text-accent",
    title: "text-text",
    item: "border-border bg-surface divide-border",
    question: "text-text",
    answer: "text-text-muted",
    chevron: "text-accent",
  },
} as const;

const FAQ = [
  {
    q: "When am I going to start seeing results?",
    a: "Honestly? It depends on what else you're doing to bring customers in, how long you've been around, and how good the work is — anyone who promises you a date is guessing. What we can promise: every call answered, every lead followed up in seconds, every happy customer asked for a review, every past customer reminded you exist. If you're doing your part, the system multiplies it. If you want to close your eyes and pay someone to make the phone ring by magic — we're not the right fit.",
  },
  {
    q: "Why is your pricing so cheap?",
    a: "Because the whole model is keeping you for ten years, not ten weeks. The systems are built once and refined forever, so we run many businesses on work we've already done — that leverage is why the price is what it is. Stay affordable, do good work, and you never have a reason to leave.",
  },
  {
    q: "What happens if I decide to cancel?",
    a: "We'll be sad to see you go — then we'll help you leave cleanly. No contracts, no cancellation fees, no hostage-taking. You lose access to the platform and the systems we run for you in it; your business data is yours to export.",
  },
  {
    q: "Can people find my website on Google?",
    a: "Every site we ship is built to be found: proper page titles and meta descriptions, image alt tags, SSL, fast loading, mobile-first. The honest part: ranking high is a long game — it depends on your market, your competition, and your reviews. We build the foundation right and keep it maintained. We don't sell \"#1 on Google in a week,\" because nobody honest can deliver that.",
  },
  {
    q: "Word of mouth already brings me business — why spend on a website?",
    a: "Because word of mouth ends the same way every time: the person Googles you before they call. If nothing comes up — or the site looks abandoned — the referral dies quietly and you never find out. A proper site catches those referrals, makes you easier to recommend, and wins the bigger customers who always check first. A couple of extra customers a year usually pays for the whole thing.",
  },
];

export default function Faq({ theme = "dark" }: { theme?: Theme }) {
  const t = T[theme];
  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <p
            className={`font-mono text-xs font-medium tracking-[0.18em] uppercase ${t.kicker}`}
          >
            FAQ
          </p>
          <h2
            className={`mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl ${t.title}`}
          >
            Frequently asked questions
          </h2>
        </div>
        <div
          className={`mt-12 divide-y rounded-2xl border ${t.item}`}
        >
          {FAQ.map(({ q, a }) => (
            <details key={q} className="group px-6 py-5">
              <summary
                className={`flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium [&::-webkit-details-marker]:hidden ${t.question}`}
              >
                {q}
                <ChevronDown
                  className={`h-5 w-5 shrink-0 transition group-open:rotate-180 ${t.chevron}`}
                />
              </summary>
              <p className={`mt-3 leading-relaxed ${t.answer}`}>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
