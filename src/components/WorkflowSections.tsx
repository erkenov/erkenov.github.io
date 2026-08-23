import { Check, Play } from "lucide-react";
import { motion } from "framer-motion";

/**
 * WorkflowSections — the flight-school automation blocks (2026-08-22,
 * Shamil: "add them to the website so I can see them in the same manner
 * as What-you-get… try to sell them to me and I'll think if we remove
 * or merge them"). Sourced from the vault leverage research
 * (03-research/2026-07-28-flightschool-leverage-ranking.md) + his two
 * new ones (no-show rescue with voice option, 24h/morning/2h reminders).
 *
 * 2026-08-23 (Shamil): the workflows ARE part of "what they get" — the
 * "Quiet machinery / workflows that guard every student" header is REMOVED
 * and the block renders on the SAME plain background as ProductSections
 * above it, so the two read as one continuous section.
 *
 * Same alternating text/media rhythm as ProductSections; media side =
 * "video coming" slots. Light theme only (live homepage).
 */

const ease = [0.16, 1, 0.3, 1] as const;

type Workflow = {
  id: string;
  title: string;
  bullets: { lead: string; text: string }[];
  videoLabel: string;
};

const WORKFLOWS: Workflow[] = [
  {
    id: "reminders",
    title: "Every booked flight actually happens",
    bullets: [
      {
        lead: "Reminders go out on their own — 24 hours before, that morning, two hours out.",
        text: "SMS and email, timed so the flight stays top of mind. No office work, no forgotten students.",
      },
      {
        lead: "Fewer empty aircraft.",
        text: "Reminder sequences cut no-shows by a third across industries. At your rates, one saved slot a week pays for the system.",
      },
      {
        lead: "Reschedules land early, not at the ramp.",
        text: "If a student can't make it, they answer the reminder — you know hours ahead, not when they don't show.",
      },
    ],
    videoLabel: "Shamil shows the reminder workflow",
  },
  {
    id: "rescue",
    title: "A cancelled flight rebooks itself",
    bullets: [
      {
        lead: "Weather cancel or no-show — the rescue goes out within minutes.",
        text: "The system offers the next open slots automatically, while the student still cares.",
      },
      {
        lead: "By text — or by voice.",
        text: "A text is easy to ignore; a call isn't. The receptionist can ring them and rebook live. One workflow switch — you choose, or I flip it for you.",
      },
      {
        lead: "The slot doesn't die either.",
        text: "A freed slot can be offered to the next student on the list — same hour, same aircraft.",
      },
    ],
    videoLabel: "Shamil runs a no-show rescue live",
  },
  {
    id: "postflight",
    title: "The flight they loved becomes the enrollment",
    bullets: [
      {
        lead: "The follow-up lands while they're still buzzing.",
        text: "Most schools never call after a discovery flight. Yours goes out the same evening — without it, only 20–40% of discovery flyers ever enroll.",
      },
      {
        lead: "A mortgage-sized decision gets a multi-week conversation.",
        text: "A private pilot license runs $13–20K. Nobody signs that on one phone call — the nurture keeps you in their cockpit until they're ready.",
      },
      {
        lead: "You'll finally see the number.",
        text: "Discovery-to-enrollment conversion, tracked per student — most schools can't even measure it today.",
      },
    ],
    videoLabel: "Shamil walks the post-flight sequence",
  },
  {
    id: "reactivation",
    title: "Lost students come back",
    bullets: [
      {
        lead: "One evening, one list, real replies.",
        text: "We text your inactive students — the industry's own guidance calls it the cheapest win in flight training: an hour of texting a hundred lapsed students brings a handful back to the flight line.",
      },
      {
        lead: "Cheaper than finding new ones.",
        text: "A new student costs $400–1,000 to acquire. A lapsed one already trusts you — and costs a text.",
      },
    ],
    videoLabel: "Shamil runs a reactivation campaign",
  },
  {
    id: "speed-to-lead",
    title: "Every inquiry gets an answer in sixty seconds",
    bullets: [
      {
        lead: "First responder wins.",
        text: "78% of buyers go with whoever responds first — and instant answers book meetings at more than double the rate of same-hour follow-up.",
      },
      {
        lead: "Forms, texts, chat — all covered.",
        text: "The inquiry gets a real reply in seconds, at any hour — not a form confirmation that reads like a receipt.",
      },
    ],
    videoLabel: "Shamil shows the 60-second reply",
  },
];

function VideoSlot({ label }: { label: string }) {
  return (
    <div className="group relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-surface to-surface-2">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-amber-400/40 bg-amber-400/10 transition group-hover:bg-amber-400/20">
          <Play className="h-6 w-6 fill-amber-400 text-amber-400" />
        </div>
        <p className="text-center font-mono text-xs tracking-[0.18em] uppercase text-text-muted">
          Video coming — {label}
        </p>
      </div>
    </div>
  );
}

export default function WorkflowSections() {
  return (
    <section id="workflows" className="pb-20 pt-2 md:pb-28 md:pt-4">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header removed 2026-08-23 (Shamil): no "quiet machinery" heading —
            the workflows continue the What-you-get block as one section. */}
        <div className="space-y-24 md:space-y-32">
          {WORKFLOWS.map((wf, i) => (
            <motion.div
              key={wf.id}
              id={`workflow-${wf.id}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, ease }}
              className="grid scroll-mt-24 items-center gap-10 md:grid-cols-2 md:gap-14"
            >
              <div className={i % 2 === 1 ? "md:order-2" : ""}>
                <h3 className="text-3xl font-semibold tracking-tight text-balance text-accent sm:text-4xl">
                  {wf.title}
                </h3>
                <ul className="mt-8 space-y-6">
                  {wf.bullets.map((b) => (
                    <li key={b.lead} className="flex items-start gap-3">
                      <Check className="mt-1 h-5 w-5 shrink-0 text-amber-700" />
                      <div>
                        <p className="text-lg font-semibold text-amber-700">{b.lead}</p>
                        <p className="mt-1.5 leading-relaxed text-text-muted">{b.text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={i % 2 === 1 ? "md:order-1" : ""}>
                <VideoSlot label={wf.videoLabel} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
