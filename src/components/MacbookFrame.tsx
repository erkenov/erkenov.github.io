"use client";

/**
 * MacbookFrame — premium laptop visual that opens/closes on scroll.
 *
 * 3D rotation around the bottom edge of the screen. When the host section
 * enters the viewport, the lid rotates open (rotateX -90° → 0°). When the
 * section leaves, it closes again. No Apple logo for trademark reasons —
 * everything else mimics MacBook proportions: aluminum body, thin black
 * bezel, camera notch, soft drop shadow.
 *
 * Placeholder content lives inside `children` — pass null/undefined to
 * render the default "demo soon" pad. Real per-scene content (CallsView,
 * CrmView, LeadsView from LaptopDemo) gets wired in a later phase.
 */

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface MacbookFrameProps {
  children?: React.ReactNode;
}

export function MacbookFrame({ children }: MacbookFrameProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    // 0 = section's top hits viewport bottom (entering)
    // 1 = section's bottom passes viewport top (leaving)
    offset: ["start end", "end start"],
  });

  // Open in the middle 50% of viewing, closed at the edges
  // -90° = lid lying flat on the base (closed)
  //   0° = lid fully vertical (open)
  const rotateX = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    [-90, 0, 0, -90],
  );

  // Slight scale-in as it opens — adds polish, makes it feel like it
  // really came forward when the scene arrived
  const scale = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    [0.92, 1, 1, 0.92],
  );

  return (
    <motion.div
      ref={ref}
      style={{
        perspective: "1400px",
        scale,
      }}
      className="mx-auto w-full max-w-md"
    >
      {/* Lid — rotates around its bottom edge */}
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

        {/* Screen content */}
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

      {/* Hinge — thin dark seam between lid and base */}
      <div className="relative mx-auto h-[3px] w-[102%] -translate-x-[1%] bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-700" />

      {/* Base — aluminum slab (the keyboard deck, viewed edge-on) */}
      <div className="relative">
        <div className="mx-auto h-[14px] w-[104%] -translate-x-[2%] rounded-b-xl bg-gradient-to-b from-zinc-300 via-zinc-200 to-zinc-400 shadow-[0_18px_36px_-8px_rgba(0,0,0,0.35)]" />
        {/* Trackpad lip — tiny hint at the front edge */}
        <div className="mx-auto -mt-[1px] h-[2px] w-[30%] rounded-b-md bg-zinc-400/60" />
      </div>
    </motion.div>
  );
}
