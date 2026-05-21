"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

const includes = [
  "AI receptionist trained on YOUR services and pricing",
  "Dedicated phone number (or use your existing one)",
  "After-hours, overflow, and missed-call coverage",
  "Calendar integration (Google / Outlook / your existing tool)",
  "Customer SMS confirmations and follow-ups",
  "GoHighLevel CRM under your brand",
  "Monthly call recordings + summary report",
  "Bilingual English + Spanish",
  "First week free — cancel anytime in the trial",
];

export function Pricing() {
  return (
    <section id="pricing" className="border-b border-border/40 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease }}
          className="max-w-3xl"
        >
          <div className="mono-label">Pricing</div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl" style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}>
            One plan. One number. Pays for itself in one booked job.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease, delay: 0.1 }}
          className="mt-16 grid gap-6 md:grid-cols-5"
        >
          <div className="rounded-2xl border border-border-strong bg-surface p-10 md:col-span-3 md:p-12">
            <div className="flex items-baseline gap-2">
              <div className="font-mono text-sm text-text-dim">USD</div>
              <div className="text-5xl font-bold tracking-tight text-text md:text-6xl" style={{ letterSpacing: "-0.04em" }}>
                $400
              </div>
              <div className="text-base text-text-muted">/month</div>
            </div>
            <p className="mt-3 text-sm text-text-muted">
              Flat rate. No per-minute charges. No setup fee. First week is free.
            </p>

            <div className="mt-10 grid gap-3">
              {includes.map((inc) => (
                <div key={inc} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={2.5} />
                  <span className="text-sm text-text">{inc}</span>
                </div>
              ))}
            </div>

            <a
              href="#contact"
              className="mt-10 inline-flex items-center justify-center rounded-lg bg-accent px-6 py-3.5 text-base font-medium text-bg transition-all hover:bg-accent-hover hover:scale-[1.01]"
            >
              Start the free week
            </a>
          </div>

          <div className="flex flex-col gap-6 md:col-span-2">
            <div className="rounded-2xl border border-border bg-surface p-8">
              <div className="mono-label">The math</div>
              <p className="mt-4 text-sm leading-relaxed text-text-muted">
                Most small businesses miss{" "}
                <span className="text-text">8 to 15 callers a week</span> outside business hours.
                If even one becomes a $500 transaction, the system has paid for itself for the month.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-8">
              <div className="mono-label">If you grow</div>
              <p className="mt-4 text-sm leading-relaxed text-text-muted">
                Two locations? Three? Pricing scales linearly — one flat rate per location. No
                surprise tier upgrades when call volume spikes seasonally.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
