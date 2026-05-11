"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/**
 * Stylized side-profile car line drawing for the hero background.
 * Pure SVG, no images. Renders huge and low-opacity, so it reads as
 * a precision-engineering schematic behind the hero text.
 */
export function CarLineArt() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  // Subtle drift: as user scrolls, the car nudges further off-screen
  const y = useTransform(scrollY, [0, 800], [0, -80]);
  const opacity = useTransform(scrollY, [0, 600], [0.18, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity }}
      className="pointer-events-none absolute inset-x-0 top-1/2 z-0 flex -translate-y-1/2 justify-center"
      aria-hidden
    >
      <svg
        viewBox="0 0 1200 360"
        className="w-[140%] max-w-[1600px] text-accent"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Body — upper line: bonnet, windscreen, roof, rear */}
        <path
          d="M 60 240
             L 180 240
             C 210 240 230 215 260 200
             L 360 162
             C 400 144 460 132 540 130
             L 760 130
             C 820 132 860 146 900 168
             L 980 210
             C 1010 226 1040 234 1080 236
             L 1140 240"
          strokeWidth="1.5"
        />
        {/* Body — lower belt line */}
        <path
          d="M 80 240
             L 1140 240"
          strokeWidth="1.2"
          opacity="0.65"
        />
        {/* Door / sill detail */}
        <path d="M 280 240 L 280 260" strokeWidth="1" opacity="0.5" />
        <path d="M 600 240 L 600 264" strokeWidth="1" opacity="0.5" />
        <path d="M 850 240 L 850 260" strokeWidth="1" opacity="0.5" />
        {/* Front bumper detail */}
        <path
          d="M 60 240 L 60 268 L 120 268"
          strokeWidth="1"
          opacity="0.5"
        />
        {/* Rear bumper detail */}
        <path
          d="M 1140 240 L 1140 268 L 1080 268"
          strokeWidth="1"
          opacity="0.5"
        />
        {/* Front window */}
        <path
          d="M 360 162
             L 380 142
             Q 440 138 510 140
             L 540 130"
          strokeWidth="1"
          opacity="0.55"
        />
        {/* Rear window */}
        <path
          d="M 760 130
             L 790 140
             Q 850 148 880 168
             L 900 168"
          strokeWidth="1"
          opacity="0.55"
        />
        {/* B-pillar */}
        <path d="M 620 134 L 620 200" strokeWidth="1" opacity="0.45" />
        {/* Door handle hint */}
        <path d="M 520 210 L 580 210" strokeWidth="1.2" opacity="0.55" />
        <path d="M 720 212 L 780 212" strokeWidth="1.2" opacity="0.55" />
        {/* Front wheel */}
        <circle cx="240" cy="265" r="48" strokeWidth="1.5" />
        <circle cx="240" cy="265" r="22" strokeWidth="1" opacity="0.55" />
        {/* Rear wheel */}
        <circle cx="960" cy="265" r="48" strokeWidth="1.5" />
        <circle cx="960" cy="265" r="22" strokeWidth="1" opacity="0.55" />
        {/* Headlight */}
        <path
          d="M 70 215 L 95 215 L 100 225 L 70 225 Z"
          strokeWidth="1"
          opacity="0.6"
        />
        {/* Tail light */}
        <path
          d="M 1130 215 L 1105 215 L 1100 225 L 1130 225 Z"
          strokeWidth="1"
          opacity="0.6"
        />
        {/* Ground line — subtle dashed underline */}
        <path
          d="M 0 314 L 1200 314"
          strokeWidth="1"
          strokeDasharray="4 8"
          opacity="0.4"
        />
      </svg>
    </motion.div>
  );
}
