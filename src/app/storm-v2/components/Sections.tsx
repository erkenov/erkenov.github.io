"use client";

/**
 * Mid-page sections, in KPost skeleton order, alternating light and
 * deep-blue bands (revision 2):
 *   credibility (white) → six photo service cards (steel) →
 *   territory (blue band) → crew story (white) → storm urgency (blue
 *   photo band). All copy/data lives in ./data.
 *
 * Service photos: Unsplash-licensed (free commercial use, no attribution
 * required), downloaded to /public/storm-v2/ — never hotlinked.
 */

import Image from "next/image";
import { motion } from "framer-motion";
import styles from "../storm.module.css";
import { EASE, Icon, Reveal, SectionHeading } from "./primitives";
import {
  CITIES,
  PROOF_POINTS,
  PROPERTY_TYPES_SERVED,
  SERVICES,
  STORM_RECORD,
} from "./data";

/* ---------------------------------------------------------------- */
/* 2 · Credibility wall (white)                                      */
/* ---------------------------------------------------------------- */

export function Credibility() {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-32">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <SectionHeading
              kicker="Dallas–Fort Worth Roofing"
              title="The roof over your head is our whole business."
            />
            <Reveal delay={0.1}>
              <p className="mt-6 text-base text-text-muted" style={{ lineHeight: 1.7 }}>
                We started Storm Roofing Heroes in 2016 with two trucks and one
                rule: treat every roof like it&apos;s over our own family. No
                storm-chaser tactics, no disappearing after the check clears.
                Ten seasons of North Texas hail later, most of our work comes
                from the same neighborhoods — because the last roof we did
                there is still holding.
              </p>
            </Reveal>
          </div>
          <ul className="grid content-center gap-4">
            {PROOF_POINTS.map((p, i) => (
              <motion.li
                key={p}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, ease: EASE, delay: i * 0.06 }}
                className="flex items-start gap-3 border-b border-border pb-4"
              >
                <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span className="text-sm text-text md:text-base">{p}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* 3 · Six service cards with photos (light steel)                   */
/* ---------------------------------------------------------------- */

export function Services() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-32">
      <SectionHeading
        kicker="What we do"
        title="Six ways a roof goes wrong. One crew for all of them."
        sub="Every job — from a tarp-out at midnight to a full commercial re-roof — runs through the same licensed crew and the same 3-year workmanship warranty."
      />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:mt-16">
        {SERVICES.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: EASE, delay: (i % 3) * 0.08 }}
            whileHover={{ y: -2 }}
            className="overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-border-strong"
          >
            <div className={`${styles.photoClip} relative h-44`}>
              <Image
                src={s.photo}
                alt={s.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="p-8 pt-6">
              <h3 className="text-xl font-semibold" style={{ letterSpacing: "-0.02em" }}>
                {s.title}
              </h3>
              <p className="mt-3 text-sm text-text-muted" style={{ lineHeight: 1.6 }}>
                {s.line}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* 4 · Territory band (deep blue, diagonal)                          */
/* ---------------------------------------------------------------- */

export function Territory() {
  return (
    <section className={`${styles.dark} ${styles.band} my-12 py-20 md:py-28`}>
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div className="grid items-center gap-12 md:grid-cols-[1.2fr_1fr]">
          <div>
            <SectionHeading
              kicker="Where we work"
              title="Servicing the entire Dallas–Fort Worth metroplex."
              sub="If a hailstone can reach it, so can we. Same crew, same warranty, from a Frisco cul-de-sac to a warehouse row in south Fort Worth."
            />
            <Reveal delay={0.1}>
              <div className="mt-8 flex flex-wrap gap-2">
                {CITIES.map((c) => (
                  <span
                    key={c}
                    className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-3 py-1.5 font-mono text-xs text-text-muted"
                  >
                    <Icon name="pin" className="h-3 w-3 text-accent" />
                    {c}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <div className="rounded-2xl border border-border bg-surface-2 p-8">
              <div className={styles.kicker}>Property types we serve</div>
              <ul className="mt-4 grid gap-3">
                {PROPERTY_TYPES_SERVED.map((t) => (
                  <li key={t} className="flex items-center gap-3 text-sm text-text">
                    <Icon name="check" className="h-4 w-4 shrink-0 text-accent" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* 5 · Crew story + storm-response record (white)                    */
/* ---------------------------------------------------------------- */

export function Story() {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-32">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <SectionHeading
              kicker="The crew"
              title="Two brothers, one promise: we show up after the storm — and after the check."
            />
            <Reveal delay={0.1}>
              <p className="mt-6 text-base text-text-muted" style={{ lineHeight: 1.7 }}>
                Marcus and Danny Reyes ran storm-restoration crews for other
                companies for a decade before starting their own. They watched
                out-of-state crews roll in after every hail line, do fast work,
                and vanish before the first leak. SRH was built as the
                opposite: a local crew whose owners still climb roofs, answer
                their own phones, and live in the same zip codes they work in.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="mt-4 text-base text-text-muted" style={{ lineHeight: 1.7 }}>
                That&apos;s why our proof isn&apos;t a stadium logo — it&apos;s
                whole streets where the neighbors compared notes and picked us
                twice.
              </p>
            </Reveal>
          </div>
          <div className="grid content-center gap-6">
            {STORM_RECORD.map((r, i) => (
              <motion.div
                key={r.stat}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 }}
                className="rounded-2xl border border-border bg-surface-2 p-8"
              >
                <div className="font-mono text-3xl font-bold text-accent" style={{ letterSpacing: "-0.02em" }}>
                  {r.stat}
                </div>
                <p className="mt-2 text-sm text-text-muted" style={{ lineHeight: 1.6 }}>
                  {r.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* 6 · Storm-damage urgency band (deep blue over storm photo)        */
/* ---------------------------------------------------------------- */

const URGENCY = [
  {
    n: "01",
    title: "Damage hides",
    body: "Hail bruises shingles without tearing them. The leak shows up two rainstorms later — inside your ceiling.",
  },
  {
    n: "02",
    title: "Claims have clocks",
    body: "Most Texas policies give you one year from the storm date to file. Wait, and the damage becomes 'wear and tear.'",
  },
  {
    n: "03",
    title: "Chasers move fast",
    body: "After every hail line, out-of-town crews knock doors, collect deductibles, and are gone by the first callback.",
  },
];

export function StormDamage() {
  return (
    <section className={`${styles.dark} ${styles.band} ${styles.bandPhoto} my-12 py-20 md:py-28`}>
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <SectionHeading
          kicker="North Texas weather"
          title="DFW sits in the hardest-hit hail corridor in America."
          sub="Golf-ball hail and 70-mph straight-line winds hit the metroplex nearly every spring. What you do in the first two weeks after a storm decides what the next ten years cost."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3 md:mt-16">
          {URGENCY.map((u, i) => (
            <motion.div
              key={u.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 }}
              className="border-l border-border-strong pl-6"
            >
              <div className="font-mono text-xs tracking-widest text-accent">{u.n}</div>
              <h3 className="mt-3 text-xl font-semibold" style={{ letterSpacing: "-0.02em" }}>
                {u.title}
              </h3>
              <p className="mt-3 text-sm text-text-muted" style={{ lineHeight: 1.6 }}>
                {u.body}
              </p>
            </motion.div>
          ))}
        </div>
        <Reveal delay={0.2}>
          <p className="mt-12 max-w-2xl text-base text-text" style={{ lineHeight: 1.6 }}>
            A free SRH inspection — with photos you keep either way — costs
            you twenty minutes. It&apos;s the cheapest insurance decision
            you&apos;ll make all year.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
