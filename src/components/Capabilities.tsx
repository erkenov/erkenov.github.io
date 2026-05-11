"use client";

import { motion } from "framer-motion";
import { Clock, MessageSquare, FileText, CarFront, Calendar, Languages } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

const capabilities = [
  {
    icon: Clock,
    title: "After-hours coverage",
    body: "Picks up at 7pm, on Saturdays, on holidays. Books the job for Monday morning before they call somewhere else.",
  },
  {
    icon: MessageSquare,
    title: "Overflow during busy hours",
    body: "When your bay is full and the phone rings, the AI answers in parallel. You stop juggling.",
  },
  {
    icon: CarFront,
    title: "Vehicle-aware",
    body: "Asks for make, model, year, mileage, VIN if needed. Logs every detail so you know what's coming in.",
  },
  {
    icon: Calendar,
    title: "Books into your calendar",
    body: "Google Calendar, Outlook, or your shop management system. The AI knows your slot times and skill mix.",
  },
  {
    icon: FileText,
    title: "Sends quotes & confirmations",
    body: "Standard service prices texted to customer immediately. Confirmation message with shop address and time.",
  },
  {
    icon: Languages,
    title: "English + Spanish",
    body: "Bilingual out of the box. Handles US callers and growing Spanish-speaking customer base without extra setup.",
  },
];

export function Capabilities() {
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
          <div className="mono-label">What it handles</div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl" style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}>
            Everything a good receptionist does. Without the salary.
          </h2>
          <p className="mt-6 text-lg text-text-muted md:text-xl">
            Built specifically for independent auto repair shops. Not a generic chatbot retrofitted onto your phone.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, ease, delay: i * 0.05 }}
                whileHover={{ y: -2 }}
                className="rounded-xl border border-border bg-surface p-6 transition-colors hover:border-border-strong"
              >
                <Icon className="h-5 w-5 text-accent" strokeWidth={1.75} />
                <h3 className="mt-4 text-base font-semibold tracking-tight text-text">
                  {c.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{c.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
