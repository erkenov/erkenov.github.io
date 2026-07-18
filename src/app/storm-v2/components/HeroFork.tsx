"use client";

/**
 * Top bar + hero fork.
 *
 * The KPost skeleton move: a near-empty first screen whose only job is to
 * split the visitor — Residential or Commercial — so every later section
 * lands on someone who already told us who they are. Picking a fork
 * pre-selects the property-type radio in the lead form and scrolls to it.
 * Deep-blue context (styles.dark); the page below alternates light/blue.
 */

import { motion } from "framer-motion";
import styles from "../storm.module.css";
import { EASE, Icon, Roofline, ShieldMark } from "./primitives";
import { PHONE_DISPLAY, PHONE_TEL, type PropertyType } from "./data";

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: EASE, delay },
});

export function TopBar() {
  return (
    <header className={`${styles.dark} sticky top-0 z-50 border-b border-border`}>
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6 md:px-8">
        <a href="#top" className="flex items-center gap-3">
          <ShieldMark size={28} />
          <span className="text-sm font-semibold tracking-tight">Storm Roofing Heroes</span>
        </a>
        <div className="flex items-center gap-6">
          <div className="hidden items-center gap-1.5 sm:flex" aria-label="5.0 star Google rating">
            <Icon name="star" className={`h-3.5 w-3.5 ${styles.star}`} />
            <span className="font-mono text-xs text-text-muted">5.0 · 51 Google reviews</span>
          </div>
          <a
            href={`tel:${PHONE_TEL}`}
            className="flex items-center gap-2 text-sm font-medium text-text transition-colors hover:text-accent"
          >
            <Icon name="phone" className="h-4 w-4 text-accent" />
            {PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </header>
  );
}

export function HeroFork({ onPick }: { onPick: (t: PropertyType) => void }) {
  return (
    <section
      id="top"
      className={`${styles.dark} ${styles.sky} relative flex min-h-[calc(100svh-3.5rem)] flex-col items-center justify-center overflow-hidden px-6`}
    >
      <div className={`pointer-events-none absolute inset-0 ${styles.rain}`} />
      <Roofline className="pointer-events-none absolute inset-x-0 bottom-0 h-24 w-full md:h-40" />

      <div className="relative z-10 -mt-10 flex max-w-3xl flex-col items-center text-center">
        <motion.div {...rise(0)}>
          <ShieldMark size={72} />
        </motion.div>

        <motion.h1
          {...rise(0.08)}
          className="mt-8 text-4xl font-bold md:text-6xl"
          style={{ letterSpacing: "-0.03em", lineHeight: 1.1 }}
        >
          Storm Roofing <span className="text-accent">Heroes</span>
        </motion.h1>

        <motion.p
          {...rise(0.16)}
          className="mt-4 max-w-xl text-base text-text-muted md:text-lg"
          style={{ lineHeight: 1.6 }}
        >
          Roof replacement, storm restoration, and insurance claims for the
          Dallas–Fort Worth metroplex. Tell us what you own — we&apos;ll take it from there.
        </motion.p>

        <motion.div
          {...rise(0.24)}
          className="mt-12 flex w-full max-w-xl flex-col gap-4 sm:flex-row"
        >
          <button
            onClick={() => onPick("residential")}
            className={`${styles.forkBtn} group flex flex-1 items-center justify-center gap-3 bg-white px-8 py-6 text-lg font-semibold text-[#0e2f52] transition-all duration-200 hover:bg-[#dcecfa]`}
          >
            <Icon name="house" className="h-6 w-6 text-[#1470b4]" />
            Residential
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </button>
          <button
            onClick={() => onPick("commercial")}
            className={`${styles.forkBtn} group flex flex-1 items-center justify-center gap-3 border border-border-strong bg-[rgba(255,255,255,0.06)] px-8 py-6 text-lg font-semibold text-text transition-all duration-200 hover:border-accent hover:bg-[rgba(255,255,255,0.12)]`}
          >
            <Icon name="warehouse" className="h-6 w-6 text-accent" />
            Commercial
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </button>
        </motion.div>

        <motion.p {...rise(0.32)} className="mt-8 font-mono text-xs tracking-wider text-text-dim">
          STORM DAMAGE RIGHT NOW? CALL{" "}
          <a
            href={`tel:${PHONE_TEL}`}
            className="whitespace-nowrap text-accent hover:text-accent-hover"
          >
            {PHONE_DISPLAY}
          </a>{" "}
          <span className="whitespace-nowrap">— 24/7 RESPONSE LINE</span>
        </motion.p>
      </div>
    </section>
  );
}
