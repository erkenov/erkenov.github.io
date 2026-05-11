"use client";

import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

const stats = [
  {
    value: "62%",
    label: "of calls after 5pm",
    sub: "go straight to voicemail in independent shops",
  },
  {
    value: "$1,400",
    label: "average lost job",
    sub: "when a brake repair caller can't reach you",
  },
  {
    value: "3 min",
    label: "is all it takes",
    sub: "for that caller to dial the next shop on Google",
  },
];

export function Problem() {
  return (
    <section className="border-b border-border/40 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease }}
          className="max-w-3xl"
        >
          <div className="mono-label">The problem</div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl" style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}>
            Every missed call is a customer calling your competitor.
          </h2>
          <p className="mt-6 text-lg text-text-muted md:text-xl">
            You&apos;re under a car. The phone rings. By the time you wipe your hands,
            they&apos;ve hung up and dialled the next shop on the list. That&apos;s the job, gone.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
          {stats.map((s, i) => (
            <motion.div
              key={s.value}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, ease, delay: i * 0.1 }}
              className="bg-surface p-8 md:p-10"
            >
              <div className="font-mono text-5xl font-semibold tracking-tight text-accent md:text-6xl" style={{ letterSpacing: "-0.04em" }}>
                {s.value}
              </div>
              <div className="mt-4 text-base font-semibold text-text">{s.label}</div>
              <div className="mt-1 text-sm text-text-muted">{s.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
