"use client";

/**
 * MacbookFrame — premium laptop visual that opens/closes on scroll.
 *
 * Iteration 2 — Path A refinements per session feedback:
 *   - Whole laptop tilted toward viewer (~12° perspective) so the
 *     keyboard deck reads as a horizontal surface, not a flat strip
 *   - Lid leans back when fully open (~-10° rotateX rel. to closed
 *     vertical) so the screen sits at a believable real-MacBook angle
 *   - Base now shows recessed keyboard area with row hints + trackpad
 *     rectangle, with subtle aluminum gradient
 *   - Camera notch + thin black bezels preserved
 *
 * No Apple logo for trademark reasons. Animation: scrollYProgress
 * drives rotateX from -90° (lid flat on base, closed) through to the
 * open angle as the host section enters viewport, then back to -90°
 * as it leaves.
 */

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface MacbookFrameProps {
  children?: React.ReactNode;
}

const OPEN_ANGLE = -10; // degrees — lid leans back from vertical at full-open

export function MacbookFrame({ children }: MacbookFrameProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // -90° = lid flat-closed on base, OPEN_ANGLE = leaned-back open
  const rotateX = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    [-90, OPEN_ANGLE, OPEN_ANGLE, -90],
  );

  // Slight scale-in for entrance polish
  const scale = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    [0.94, 1, 1, 0.94],
  );

  return (
    <motion.div
      ref={ref}
      style={{ perspective: "1400px", scale }}
      className="mx-auto w-full max-w-md"
    >
      {/* Outer 3D scene — slight forward tilt so we see down onto keyboard */}
      <div
        style={{
          transform: "rotateX(12deg)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Lid — rotates around its bottom edge (hinge) */}
        <motion.div
          style={{
            rotateX,
            transformOrigin: "bottom center",
            transformStyle: "preserve-3d",
          }}
          className="relative aspect-[16/10] rounded-[14px] bg-gradient-to-b from-zinc-800 via-zinc-900 to-black p-[6px] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.45)]"
        >
          {/* Camera notch (MacBook Pro 2021+ style) */}
          <div className="pointer-events-none absolute left-1/2 top-0 z-10 h-[5px] w-12 -translate-x-1/2 rounded-b-md bg-black">
            <div className="absolute left-1/2 top-1/2 h-[3px] w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-700" />
          </div>

          {/* Screen content area */}
          <div className="relative h-full overflow-hidden rounded-[8px] bg-[#F5F1E8]">
            {/* Soft sheen overlay for premium screen feel */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent" />
            {children ?? (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="mono-label text-text-dim">Demo</div>
                  <div className="mt-2 text-sm text-text-muted">
                    Screen content drops in next pass
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Hinge — thin dark seam */}
        <div className="relative mx-auto h-[3px] w-[101%] -translate-x-[0.5%] rounded-sm bg-gradient-to-b from-zinc-700 via-zinc-900 to-zinc-700" />

        {/* Base / keyboard deck — wider than lid, visible from above */}
        <div
          className="relative mx-auto w-[105%] -translate-x-[2.5%] rounded-b-[18px] bg-gradient-to-b from-zinc-300 via-zinc-200 to-zinc-400 shadow-[0_22px_44px_-10px_rgba(0,0,0,0.4)]"
          style={{ paddingTop: "8px", paddingBottom: "10px" }}
        >
          {/* Recessed keyboard area */}
          <div className="mx-auto h-[26px] w-[88%] rounded-md bg-gradient-to-b from-zinc-800 via-zinc-900 to-zinc-800 p-[3px]">
            {/* Key row hints — 4 thin rows suggest keys */}
            <div className="flex h-full flex-col justify-between gap-[2px]">
              <KeyRow widthClass="w-full" />
              <KeyRow widthClass="w-[97%]" />
              <KeyRow widthClass="w-full" />
              <KeyRow widthClass="w-[60%] mx-auto" /> {/* spacebar row */}
            </div>
          </div>

          {/* Trackpad */}
          <div className="mx-auto mt-[6px] h-[14px] w-[42%] rounded-md bg-gradient-to-b from-zinc-200 to-zinc-300 ring-1 ring-zinc-400/40" />
        </div>

        {/* Soft ground shadow */}
        <div className="pointer-events-none absolute -bottom-3 left-1/2 h-[10px] w-[80%] -translate-x-1/2 rounded-full bg-black/25 blur-md" />
      </div>
    </motion.div>
  );
}

/* Thin row of key suggestions — purely visual, no real keys */
function KeyRow({ widthClass }: { widthClass: string }) {
  return (
    <div className={`flex h-[4px] gap-[2px] rounded-sm ${widthClass}`}>
      {Array.from({ length: 14 }).map((_, i) => (
        <div
          key={i}
          className="h-full flex-1 rounded-[1px] bg-gradient-to-b from-zinc-600 to-zinc-700"
        />
      ))}
    </div>
  );
}
