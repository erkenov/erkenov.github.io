"use client";

import { motion } from "framer-motion";
import { PhoneCall, Wrench, CalendarCheck } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

const steps = [
  {
    n: "01",
    icon: PhoneCall,
    title: "Call comes in",
    body: "Customer rings your shop. After 2 rings — or after-hours, or while you're busy — our AI picks up using your shop's name and voice.",
  },
  {
    n: "02",
    icon: Wrench,
    title: "AI qualifies the job",
    body: "Make, model, year, what's wrong, when do they need it by. Asks the questions you'd ask. Knows what services you offer and what you don't.",
  },
  {
    n: "03",
    icon: CalendarCheck,
    title: "Booked into your calendar",
    body: "Slots them into your Google Calendar or shop management system. Sends them a confirmation text. You see the appointment when you next check your phone.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-border/40 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease }}
          className="max-w-3xl"
        >
          <div className="mono-label">How it works</div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl" style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}>
            Three steps. No app for you to learn.
          </h2>
          <p className="mt-6 text-lg text-text-muted md:text-xl">
            The AI runs in the background. You keep doing the work you actually like.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, ease, delay: i * 0.1 }}
                whileHover={{ y: -2 }}
                className="rounded-2xl border border-border bg-surface p-8 transition-colors hover:border-border-strong"
              >
                <div className="flex items-center justify-between">
                  <div className="font-mono text-sm text-text-dim">{step.n}</div>
                  <Icon className="h-5 w-5 text-accent" strokeWidth={1.75} />
                </div>
                <h3 className="mt-6 text-xl font-semibold tracking-tight text-text">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">{step.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
