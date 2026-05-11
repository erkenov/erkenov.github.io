"use client";

import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

const metrics = [
  {
    kicker: "AVERAGE",
    value: "+27%",
    body: "More booked appointments per month compared to the same shop's prior 90-day baseline.",
  },
  {
    kicker: "OUTSIDE-HOURS",
    value: "8–15",
    body: "Calls per week we recover after 6pm that would have otherwise gone to voicemail.",
  },
  {
    kicker: "TIME-TO-VALUE",
    value: "1 week",
    body: "From setup to your first booked appointment through the AI receptionist. Often sooner.",
  },
];

export function MetricBlock() {
  return (
    <section className="border-b border-border/40 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mono-label inline-block">What it produces</div>
          <h2
            className="mt-3 text-3xl font-bold tracking-tight md:text-5xl"
            style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
          >
            Numbers the shop can put on a fridge magnet.
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {metrics.map((m, i) => (
            <motion.div
              key={m.kicker}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, ease, delay: i * 0.08 }}
              className="rounded-2xl border border-border bg-surface p-8 md:p-10"
            >
              <div className="font-mono text-xs uppercase tracking-widest text-text-dim">
                {m.kicker}
              </div>
              <div
                className="mt-4 font-mono text-6xl font-semibold tracking-tight text-accent md:text-7xl"
                style={{ letterSpacing: "-0.04em" }}
              >
                {m.value}
              </div>
              <p className="mt-6 text-sm leading-relaxed text-text-muted">
                {m.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
