"use client";

import { motion } from "framer-motion";
import { FloatingTools } from "./FloatingTools";

const ease = [0.16, 1, 0.3, 1] as const;

export function About() {
  return (
    <section className="relative overflow-hidden border-b border-border/40 py-24 md:py-32">
      <FloatingTools variant="spread" />
      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-8">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease }}
            className="md:col-span-5"
          >
            <div className="mono-label">Who builds this</div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl" style={{ letterSpacing: "-0.025em", lineHeight: 1.15 }}>
              Built by someone who has actually been under a hood.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease, delay: 0.1 }}
            className="md:col-span-7"
          >
            <div className="space-y-5 text-base leading-relaxed text-text-muted md:text-lg">
              <p>
                I&apos;m <span className="text-text">Shamil Erkenov</span>. Solo operator,
                based in Tbilisi. I&apos;ve replaced brake pads, swapped clutches, helped
                friends rebuild houses including the plumbing. I know the difference
                between a CV joint and a wheel bearing.
              </p>
              <p>
                I also build AI systems. So when this AI receptionist asks a caller
                whether their check-engine light is solid or blinking, it&apos;s because
                a real shop owner would. Not because a marketer told me to.
              </p>
              <p>
                I work with one shop at a time during onboarding so the receptionist
                actually sounds like <em>your</em> shop, not a generic template.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-lg bg-accent px-5 py-3 text-sm font-medium text-bg transition-all hover:bg-accent-hover"
              >
                Book a 15-minute call
              </a>
              <a
                href="mailto:shamil.erkenovv@gmail.com"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-surface/60 px-5 py-3 text-sm font-medium text-text transition-all hover:border-border-strong hover:bg-surface"
              >
                Email me directly
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
