"use client";

import { motion } from "framer-motion";

/**
 * Decorative scattered tool / car-part SVG marks that float gently in a section
 * background. Low opacity, animated subtly. Use sparingly — one per section max.
 *
 * variant chooses the layout:
 *   "spread"  — three icons in widely separated positions
 *   "corners" — two icons in opposite corners
 */
type Variant = "spread" | "corners";

const ease = [0.42, 0, 0.58, 1] as const;

const positions: Record<Variant, Array<{ top: string; left?: string; right?: string; rotate: number; scale: number; icon: Icon; delay: number }>> = {
  spread: [
    { top: "8%", left: "6%", rotate: -18, scale: 1, icon: "wrench", delay: 0 },
    { top: "60%", right: "10%", rotate: 24, scale: 1.1, icon: "gear", delay: 1.5 },
    { top: "35%", left: "48%", rotate: 8, scale: 0.85, icon: "bolt", delay: 3 },
  ],
  corners: [
    { top: "12%", right: "8%", rotate: 18, scale: 0.9, icon: "gear", delay: 0 },
    { top: "70%", left: "6%", rotate: -12, scale: 1, icon: "wrench", delay: 2 },
  ],
};

type Icon = "wrench" | "gear" | "bolt";

export function FloatingTools({ variant = "spread" }: { variant?: Variant }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {positions[variant].map((p, i) => (
        <motion.div
          key={i}
          style={{
            top: p.top,
            left: p.left,
            right: p.right,
            rotate: `${p.rotate}deg`,
            scale: p.scale,
          }}
          className="absolute text-text-dim"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 0.08,
            y: [0, -8, 0],
          }}
          transition={{
            opacity: { duration: 1.2, delay: 0.5 },
            y: {
              duration: 6,
              delay: p.delay,
              repeat: Infinity,
              ease,
            },
          }}
        >
          <ToolIcon name={p.icon} />
        </motion.div>
      ))}
    </div>
  );
}

function ToolIcon({ name }: { name: Icon }) {
  if (name === "wrench") {
    return (
      <svg
        width="160"
        height="160"
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M44 8 a12 12 0 1 0 12 12 l-7 7 -5 -5 -5 5 -5 -5 z" />
        <path d="M44 27 L20 51 a4 4 0 0 1 -6 -6 L38 21" />
      </svg>
    );
  }
  if (name === "gear") {
    return (
      <svg
        width="180"
        height="180"
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="32" cy="32" r="11" />
        <circle cx="32" cy="32" r="4" />
        <path d="M32 4 v8 M32 52 v8 M4 32 h8 M52 32 h8 M12 12 l6 6 M46 46 l6 6 M52 12 l-6 6 M18 46 l-6 6" />
      </svg>
    );
  }
  // bolt
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M32 4 L48 14 L48 34 L32 44 L16 34 L16 14 Z" />
      <circle cx="32" cy="24" r="6" />
      <path d="M32 44 L32 60" />
    </svg>
  );
}
