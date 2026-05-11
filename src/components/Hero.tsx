"use client";

import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/40">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
      <div className="hero-glow pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-6xl px-6 pt-24 pb-32 md:px-8 md:pt-32 md:pb-40">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center text-center"
        >
          <motion.div variants={item}>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1.5 text-xs font-medium text-text-muted">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              <span className="font-mono uppercase tracking-wider">
                Available — 2 shops onboarding this month
              </span>
            </div>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-8 max-w-4xl text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl"
            style={{ letterSpacing: "-0.03em", lineHeight: 1.05 }}
          >
            AI receptionist that answers every auto shop call.
            <span className="block text-accent">Even after 6pm.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-8 max-w-2xl text-lg leading-relaxed text-text-muted md:text-xl"
          >
            Independent auto repair shops lose <span className="text-text">$500 to $3,000</span>{" "}
            every time a customer can&apos;t get through. We pick up the phone, qualify the job,
            and book it into your calendar — 24/7.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
          >
            <a
              href="#demo"
              className="group inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-base font-medium text-bg transition-all hover:bg-accent-hover hover:scale-[1.02]"
            >
              <Phone className="h-4 w-4" strokeWidth={2.25} />
              Hear a 60-second demo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.25} />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface/40 px-6 py-3.5 text-base font-medium text-text transition-all hover:border-border-strong hover:bg-surface"
            >
              How it works
            </a>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-text-dim"
          >
            <span className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-text-dim" />
              No setup fee
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-text-dim" />
              First week free
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-text-dim" />
              Cancel anytime
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
