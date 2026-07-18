"use client";

/**
 * Shared building blocks for the /storm-v2 page: scroll-reveal wrapper,
 * the three-tier section heading, and the inline SVG mark set.
 * Motion follows the site design system: fade-up, ease [0.16,1,0.3,1],
 * once-only viewport reveals — motion confirms structure, never decorates.
 */

import { motion } from "framer-motion";
import styles from "../storm.module.css";

export const EASE = [0.16, 1, 0.3, 1] as const;

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Three-tier section heading: kicker → h2 → subhead. */
export function SectionHeading({
  kicker,
  title,
  sub,
}: {
  kicker: string;
  title: string;
  sub?: string;
}) {
  return (
    <Reveal>
      <div className={styles.kicker}>{kicker}</div>
      <h2
        className="mt-3 text-3xl md:text-5xl font-bold"
        style={{ letterSpacing: "-0.03em", lineHeight: 1.1 }}
      >
        {title}
      </h2>
      {sub && (
        <p className="mt-4 max-w-2xl text-base md:text-lg text-text-muted" style={{ lineHeight: 1.6 }}>
          {sub}
        </p>
      )}
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* SRH shield-and-bolt mark                                            */
/* ------------------------------------------------------------------ */

export function ShieldMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path
        d="M20 2 35 8v11c0 9.5-6.4 15.9-15 19C11.4 34.9 5 28.5 5 19V8l15-6Z"
        fill="var(--surface-2)"
        stroke="var(--accent)"
        strokeWidth="2"
      />
      <path d="M22.5 9 14 21.5h5L17.5 31 26 18.5h-5L22.5 9Z" fill="var(--accent)" />
    </svg>
  );
}

/** Simple line-icon set for service cards and checklists. */
export function Icon({ name, className }: { name: string; className?: string }) {
  const stroke = {
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none",
  };
  const paths: Record<string, React.ReactNode> = {
    house: (
      <>
        <path {...stroke} d="M3 11.5 12 4l9 7.5" />
        <path {...stroke} d="M5.5 10v9.5h13V10" />
        <path {...stroke} d="M10 19.5v-5h4v5" />
      </>
    ),
    bolt: <path {...stroke} d="M13 2 5 13.5h5.5L11 22l8-11.5h-5.5L13 2Z" />,
    hail: (
      <>
        <path {...stroke} d="M17.5 13a4.5 4.5 0 0 0-.4-9 5.5 5.5 0 0 0-10.4 1.6A4 4 0 0 0 7 13.5h10.5Z" />
        <circle cx="8" cy="17.5" r="1.1" fill="currentColor" />
        <circle cx="12.5" cy="19.5" r="1.1" fill="currentColor" />
        <circle cx="16.5" cy="16.8" r="1.1" fill="currentColor" />
      </>
    ),
    doc: (
      <>
        <path {...stroke} d="M6 2.5h8L19 7.5v14H6v-19Z" />
        <path {...stroke} d="M14 2.5v5h5" />
        <path {...stroke} d="m9 14.5 2 2 4-4.5" />
      </>
    ),
    warehouse: (
      <>
        <path {...stroke} d="M2.5 9.5 12 4l9.5 5.5V20h-19V9.5Z" />
        <path {...stroke} d="M6.5 20v-7h11v7" />
        <path {...stroke} d="M6.5 16h11" />
      </>
    ),
    calendar: (
      <>
        <rect {...stroke} x="3.5" y="5" width="17" height="16" rx="2" />
        <path {...stroke} d="M3.5 9.5h17M8 2.5V6M16 2.5V6" />
        <path {...stroke} d="m9.5 15 2 2 3.5-4" />
      </>
    ),
    wrench: (
      <>
        <path
          {...stroke}
          d="M14.5 6.5a4 4 0 0 1 5-5l-3 3 .7 2.3 2.3.7 3-3a4 4 0 0 1-5 5L8 19a2.1 2.1 0 0 1-3-3l9.5-9.5Z"
        />
      </>
    ),
    phone: (
      <path
        {...stroke}
        d="M5 3h4l1.5 4.5L8 9.5a12 12 0 0 0 6.5 6.5l2-2.5L21 15v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z"
      />
    ),
    check: <path {...stroke} d="m4.5 12.5 5 5L19.5 7" />,
    star: (
      <path
        d="M12 2.5 15 9l7 .6-5.3 4.6 1.6 6.8L12 17.4 5.7 21l1.6-6.8L2 9.6 9 9l3-6.5Z"
        fill="currentColor"
      />
    ),
    pin: (
      <>
        <path {...stroke} d="M12 21.5S5 14.9 5 9.9a7 7 0 0 1 14 0c0 5-7 11.6-7 11.6Z" />
        <circle {...stroke} cx="12" cy="9.9" r="2.5" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

/** DFW roofline silhouette used along the bottom of the hero. */
export function Roofline({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 160"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      {/* back row — distant commercial blocks */}
      <path
        d="M0 160V96h90l20-18 20 18h80V70l60-6 60 6v50h70V88h110l30-26 30 26h90V60h120v46h80l25-22 25 22h95V78l55-8 55 8v42h90l22-20 22 20h91v60H0Z"
        fill="#0c2a4a"
      />
      {/* front row — pitched residential roofs */}
      <path
        d="M0 160v-36l70-34 70 34v10h50l60-42 60 42h44v-14l64-30 64 30v20h58l52-38 52 38h60v-10l68-32 68 32h64l58-40 58 40h50v-12l66-30 66 30v42H0Z"
        fill="#081f38"
      />
    </svg>
  );
}
