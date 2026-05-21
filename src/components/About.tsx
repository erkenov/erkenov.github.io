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
              Built by an operator, not an agency.
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
                based in Tbilisi. Ten years running my own businesses — e-commerce
                across Russia&apos;s major marketplaces, a perfume brand, hands-on with
                cars and houses on the side. I&apos;ve been the person under the car, the
                person on the phone with suppliers, the person hiring and firing.
              </p>
              <p>
                I&apos;m an operator who learned AI, not an AI engineer learning operations.
                That means when I build a system for your business, I build it the way
                I&apos;d build it for mine — focused on which automation actually saves
                hours, which one quietly leaks money, and which one you should never
                touch.
              </p>
              <p>
                I work with one client at a time during onboarding so the system
                sounds like <em>your</em> business, not a generic template. The voice
                agent. The CRM logic. The follow-up rules. All shaped to the way you
                already work.
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
