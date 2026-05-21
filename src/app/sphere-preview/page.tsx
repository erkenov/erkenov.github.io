"use client";

/**
 * Temporary preview route for the v3 ParticleSphere POC.
 * Visit http://localhost:3000/sphere-preview to see it.
 * Will be deleted once the sphere is integrated into the real hero.
 */

import { ParticleSphere } from "@/components/ParticleSphere";

export default function SpherePreviewPage() {
  return (
    <div className="min-h-screen w-full bg-bg flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-2xl w-full text-center">
        <div className="mono-label mb-4">v3 — proof of concept</div>
        <h1
          className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
          style={{ letterSpacing: "-0.03em", lineHeight: 1.1 }}
        >
          Sphere alive.
        </h1>
        <p className="text-text-muted max-w-md mx-auto mb-12 leading-relaxed">
          The particle sphere renders in 3D via Three.js. Ambient sine-pulse for now —
          in production this gets driven by the real audio amplitude of your Retell agent
          via the Web Audio API. Color matches the brand accent (sage green).
        </p>

        <ParticleSphere className="h-[500px] w-full" />

        <p className="text-text-dim text-xs mt-8 max-w-md mx-auto leading-relaxed">
          Next steps after you approve this look: GSAP ScrollTrigger to make it travel
          down the page, audio analyser to drive pulse from real call, transform into
          streaming particles between sections.
        </p>
      </div>
    </div>
  );
}
