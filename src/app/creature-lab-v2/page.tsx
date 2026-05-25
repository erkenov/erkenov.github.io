"use client";

/**
 * Creature Lab v2 — alien-tech / futuristic Celly drafts.
 *
 * Shamil's pivot from the cartoonish Pixar-style mascot: less childish,
 * more "alien technology, futuristic vibe-like." Six concepts to pick a
 * direction from. Once chosen, we build the production version and swap
 * out the CellDragonSprite component on /preview-v6.
 *
 * Visit: http://localhost:3000/creature-lab-v2 (or network URL from the
 * dev server output for mobile testing).
 */

import React from "react";

// ---------- shared brand colors ----------
const SAGE = "#7ea687";
const SAGE_BRIGHT = "#B8D4BD";
const SAGE_DARK = "#5e8268";
const TERRA = "#C76B58";
const TERRA_BRIGHT = "#E88B7A";
const GOLD = "#F2C94C";
// GOLD_DEEP removed (unused).
const CREAM = "#F5E9CC";

// ============================================================
// Concept 1 — JARVIS Orb
// Glowing translucent sphere with rotating ring + soft inner light.
// Reads as "AI core" without any face.
// ============================================================
function JarvisOrb() {
  return (
    <div className="relative w-44 h-44 flex items-center justify-center">
      {/* Outer rotating ring */}
      <div
        className="absolute w-40 h-40 rounded-full border-2 animate-[spinSlow_8s_linear_infinite]"
        style={{
          borderColor: `${SAGE_BRIGHT}80`,
          borderStyle: "dashed",
          borderWidth: "1px",
        }}
      />
      {/* Counter-rotating inner ring */}
      <div
        className="absolute w-32 h-32 rounded-full border animate-[spinSlowRev_6s_linear_infinite]"
        style={{
          borderColor: `${GOLD}60`,
          borderWidth: "1px",
        }}
      />
      {/* Glowing core */}
      <div
        className="relative w-20 h-20 rounded-full animate-[corePulse_3s_ease-in-out_infinite]"
        style={{
          background: `radial-gradient(circle at 40% 35%, ${SAGE_BRIGHT}ee 0%, ${SAGE}bb 35%, ${SAGE_DARK}66 75%, transparent 100%)`,
          boxShadow: `0 0 40px ${SAGE}99, inset 0 0 20px ${SAGE_BRIGHT}80`,
          filter: "blur(0.3px)",
        }}
      />
      {/* Tiny scan dots around the rim */}
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <div
          key={deg}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            background: GOLD,
            boxShadow: `0 0 6px ${GOLD}`,
            transform: `rotate(${deg}deg) translate(80px) rotate(-${deg}deg)`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spinSlowRev {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes corePulse {
          0%, 100% { transform: scale(1); opacity: 0.95; }
          50% { transform: scale(1.06); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ============================================================
// Concept 2 — EVE-Style Egg
// Smooth white egg with two glowing slot eyes. Wall-E EVE energy.
// ============================================================
function EveEgg() {
  return (
    <div className="relative w-44 h-44 flex items-center justify-center">
      {/* Egg body */}
      <div
        className="relative w-24 h-32 rounded-full animate-[bobble_4s_ease-in-out_infinite]"
        style={{
          background: `linear-gradient(160deg, #FFFFFF 0%, #F0F0F0 60%, #D8DDD9 100%)`,
          boxShadow: `0 12px 30px rgba(0, 0, 0, 0.15), inset -8px -12px 20px rgba(120, 130, 125, 0.12), inset 6px 8px 14px rgba(255, 255, 255, 0.8)`,
        }}
      >
        {/* Glowing slot eyes */}
        <div
          className="absolute top-[38%] left-[20%] w-3 h-5 rounded-full"
          style={{
            background: `linear-gradient(180deg, ${SAGE_BRIGHT}, ${SAGE})`,
            boxShadow: `0 0 12px ${SAGE_BRIGHT}, 0 0 4px ${SAGE_BRIGHT} inset`,
          }}
        />
        <div
          className="absolute top-[38%] right-[20%] w-3 h-5 rounded-full"
          style={{
            background: `linear-gradient(180deg, ${SAGE_BRIGHT}, ${SAGE})`,
            boxShadow: `0 0 12px ${SAGE_BRIGHT}, 0 0 4px ${SAGE_BRIGHT} inset`,
          }}
        />
      </div>
      <style jsx>{`
        @keyframes bobble {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50% { transform: translateY(-4px) rotate(1deg); }
        }
      `}</style>
    </div>
  );
}

// ============================================================
// Concept 3 — Crystal Polyhedron
// Faceted geometric shape with glowing edges. Looks like alien tech.
// ============================================================
function CrystalPoly() {
  return (
    <div className="relative w-44 h-44 flex items-center justify-center [perspective:600px]">
      <div
        className="relative w-28 h-28 [transform-style:preserve-3d] animate-[rotateCrystal_10s_linear_infinite]"
      >
        {/* SVG faceted crystal */}
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="facetA" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={SAGE_BRIGHT} stopOpacity="0.7" />
              <stop offset="100%" stopColor={SAGE_DARK} stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="facetB" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={GOLD} stopOpacity="0.5" />
              <stop offset="100%" stopColor={TERRA} stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <polygon
            points="50,10 80,30 70,70 30,70 20,30"
            fill="url(#facetA)"
            stroke={SAGE_BRIGHT}
            strokeWidth="1"
            style={{
              filter: `drop-shadow(0 0 8px ${SAGE_BRIGHT}aa)`,
            }}
          />
          <polygon
            points="50,10 80,30 70,70 50,55"
            fill="url(#facetB)"
            opacity="0.5"
          />
          <polygon
            points="50,55 70,70 30,70"
            fill={GOLD}
            opacity="0.3"
          />
          {/* glowing core dot */}
          <circle cx="50" cy="45" r="3" fill={GOLD} style={{ filter: `drop-shadow(0 0 6px ${GOLD})` }} />
        </svg>
      </div>
      <style jsx>{`
        @keyframes rotateCrystal {
          from { transform: rotateY(0deg) rotateX(15deg); }
          to { transform: rotateY(360deg) rotateX(15deg); }
        }
      `}</style>
    </div>
  );
}

// ============================================================
// Concept 4 — Liquid Metal Blob
// Chrome surface with surface ripples. T-1000 vibe but warm.
// ============================================================
function LiquidMetal() {
  return (
    <div className="relative w-44 h-44 flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-32 h-32" style={{ filter: `drop-shadow(0 8px 16px rgba(0,0,0,0.2))` }}>
        <defs>
          <radialGradient id="metalGrad" cx="35%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="15%" stopColor={CREAM} stopOpacity="0.95" />
            <stop offset="45%" stopColor={SAGE_BRIGHT} stopOpacity="0.7" />
            <stop offset="80%" stopColor={SAGE_DARK} stopOpacity="0.85" />
            <stop offset="100%" stopColor="#1a2a22" stopOpacity="0.9" />
          </radialGradient>
        </defs>
        <path fill="url(#metalGrad)">
          <animate
            attributeName="d"
            dur="6s"
            repeatCount="indefinite"
            values="
              M50,18 C68,18 82,32 82,50 C82,68 68,82 50,82 C32,82 18,68 18,50 C18,32 32,18 50,18 Z;
              M50,15 C70,15 85,35 82,52 C79,69 65,85 50,84 C35,85 22,68 18,52 C15,35 30,15 50,15 Z;
              M50,18 C68,18 82,32 82,50 C82,68 68,82 50,82 C32,82 18,68 18,50 C18,32 32,18 50,18 Z
            "
          />
        </path>
        {/* highlight spot */}
        <ellipse cx="38" cy="34" rx="10" ry="6" fill="#FFFFFF" opacity="0.55" />
      </svg>
    </div>
  );
}

// ============================================================
// Concept 5 — Holographic Sphere
// Translucent glass orb with rotating "data" rings + UI markers.
// ============================================================
function HoloSphere() {
  return (
    <div className="relative w-44 h-44 flex items-center justify-center">
      {/* Glass orb body */}
      <div
        className="absolute w-28 h-28 rounded-full"
        style={{
          background: `radial-gradient(circle at 40% 35%, rgba(255,255,255,0.6) 0%, ${SAGE_BRIGHT}40 35%, ${SAGE}40 70%, ${SAGE_DARK}30 100%)`,
          boxShadow: `0 0 30px ${SAGE}66, inset 0 0 20px ${SAGE_BRIGHT}60`,
          backdropFilter: "blur(2px)",
        }}
      />
      {/* Horizontal data ring 1 */}
      <div
        className="absolute w-36 h-9 rounded-full border animate-[spinSlow2_5s_linear_infinite]"
        style={{
          borderColor: `${GOLD}80`,
          borderWidth: "1px",
          transform: "rotateX(75deg)",
          boxShadow: `0 0 8px ${GOLD}40`,
        }}
      />
      {/* Horizontal data ring 2 */}
      <div
        className="absolute w-32 h-7 rounded-full border animate-[spinSlowRev2_7s_linear_infinite]"
        style={{
          borderColor: `${SAGE_BRIGHT}80`,
          borderWidth: "1px",
          transform: "rotateX(60deg) rotateZ(45deg)",
          boxShadow: `0 0 8px ${SAGE_BRIGHT}40`,
        }}
      />
      {/* Tiny floating UI dots */}
      <div className="absolute w-1 h-1 rounded-full" style={{ background: GOLD, boxShadow: `0 0 4px ${GOLD}`, top: "30%", left: "70%" }} />
      <div className="absolute w-1.5 h-1.5 rounded-full" style={{ background: SAGE_BRIGHT, boxShadow: `0 0 6px ${SAGE_BRIGHT}`, top: "55%", left: "25%" }} />
      <div className="absolute w-1 h-1 rounded-full" style={{ background: GOLD, boxShadow: `0 0 4px ${GOLD}`, top: "65%", left: "72%" }} />
      <style jsx>{`
        @keyframes spinSlow2 {
          from { transform: rotateX(75deg) rotateZ(0deg); }
          to { transform: rotateX(75deg) rotateZ(360deg); }
        }
        @keyframes spinSlowRev2 {
          from { transform: rotateX(60deg) rotateZ(45deg); }
          to { transform: rotateX(60deg) rotateZ(-315deg); }
        }
      `}</style>
    </div>
  );
}

// ============================================================
// Concept 6 — Pure Energy / Particle Constellation
// No body. Just a coherent cluster of glowing particles forming a
// vaguely humanoid silhouette via density.
// ============================================================
function ParticleSpirit() {
  // Deterministic positions (React 19 strict purity bans Math.random
  // during render). Hand-tuned cluster of 30 particles in an egg shape.
  const particles: Array<{ x: number; y: number; size: number; color: string; delay: number }> = [
    { x: 50, y: 25, size: 3, color: SAGE_BRIGHT, delay: 0 },
    { x: 42, y: 30, size: 2, color: GOLD, delay: 0.3 },
    { x: 58, y: 30, size: 2.5, color: SAGE_BRIGHT, delay: 0.6 },
    { x: 35, y: 38, size: 1.5, color: TERRA_BRIGHT, delay: 1.2 },
    { x: 65, y: 38, size: 2, color: GOLD, delay: 0.9 },
    { x: 50, y: 40, size: 4, color: SAGE_BRIGHT, delay: 0.4 },
    { x: 30, y: 48, size: 2, color: SAGE_BRIGHT, delay: 1.5 },
    { x: 42, y: 48, size: 3, color: GOLD, delay: 0.7 },
    { x: 58, y: 48, size: 3, color: SAGE_BRIGHT, delay: 0.2 },
    { x: 70, y: 48, size: 1.5, color: TERRA_BRIGHT, delay: 1.8 },
    { x: 25, y: 55, size: 1.5, color: SAGE_BRIGHT, delay: 1.1 },
    { x: 38, y: 56, size: 2.5, color: SAGE_BRIGHT, delay: 0.5 },
    { x: 50, y: 56, size: 4, color: GOLD, delay: 0.8 },
    { x: 62, y: 56, size: 2.5, color: SAGE_BRIGHT, delay: 1.3 },
    { x: 75, y: 55, size: 1.5, color: GOLD, delay: 1.6 },
    { x: 28, y: 64, size: 1.5, color: TERRA_BRIGHT, delay: 0.6 },
    { x: 40, y: 64, size: 2, color: SAGE_BRIGHT, delay: 1.4 },
    { x: 52, y: 65, size: 3, color: SAGE_BRIGHT, delay: 0.1 },
    { x: 64, y: 64, size: 2, color: GOLD, delay: 1.7 },
    { x: 72, y: 64, size: 1.5, color: SAGE_BRIGHT, delay: 0.4 },
    { x: 35, y: 72, size: 2, color: GOLD, delay: 1.0 },
    { x: 48, y: 73, size: 2.5, color: SAGE_BRIGHT, delay: 0.3 },
    { x: 60, y: 72, size: 2, color: SAGE_BRIGHT, delay: 1.9 },
    { x: 42, y: 80, size: 1.5, color: SAGE_BRIGHT, delay: 0.8 },
    { x: 56, y: 80, size: 2, color: TERRA_BRIGHT, delay: 1.3 },
    { x: 50, y: 86, size: 1.5, color: GOLD, delay: 0.6 },
    { x: 45, y: 35, size: 1.5, color: GOLD, delay: 1.1 },
    { x: 55, y: 35, size: 1.5, color: SAGE_BRIGHT, delay: 0.5 },
    { x: 47, y: 60, size: 1.5, color: GOLD, delay: 1.8 },
    { x: 53, y: 50, size: 2, color: SAGE_BRIGHT, delay: 1.5 },
  ];
  return (
    <div className="relative w-44 h-44 flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-40 h-40">
        {particles.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={p.size}
            fill={p.color}
            opacity={0.7}
            style={{
              filter: `drop-shadow(0 0 ${p.size * 2}px ${p.color})`,
              animation: `particleFloat ${2 + p.delay}s ease-in-out ${p.delay}s infinite`,
              transformOrigin: `${p.x}px ${p.y}px`,
            }}
          />
        ))}
      </svg>
      <style jsx>{`
        @keyframes particleFloat {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}

// ---------- Card wrapper ----------

type ConceptCardProps = {
  index: number;
  name: string;
  vibe: string;
  Component: React.ComponentType;
};

function ConceptCard({ index, name, vibe, Component }: ConceptCardProps) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white/60 backdrop-blur p-6 md:p-8 shadow-sm">
      <div className="mono-label mb-3 text-text-dim">Concept {index}</div>
      <h3
        className="text-2xl md:text-3xl font-bold tracking-tight mb-4"
        style={{ letterSpacing: "-0.025em" }}
      >
        {name}
      </h3>
      <p className="text-text-muted text-[15px] leading-relaxed mb-6">{vibe}</p>
      <div className="relative h-64 bg-[#F5F1E8] rounded-xl flex items-center justify-center">
        <Component />
      </div>
    </div>
  );
}

const CONCEPTS: Omit<ConceptCardProps, "index">[] = [
  {
    name: "JARVIS Orb",
    vibe:
      "Glowing translucent sage core with rotating dashed/solid rings + gold scan dots. Reads as AI core without any face. Iron-Man-J.A.R.V.I.S. energy.",
    Component: JarvisOrb,
  },
  {
    name: "EVE Egg",
    vibe:
      "Smooth white egg body with two vertical sage-glowing slot eyes. Wall-E EVE energy. Minimalist, sophisticated, still has 'face' enough to feel alive.",
    Component: EveEgg,
  },
  {
    name: "Crystal Polyhedron",
    vibe:
      "Faceted geometric shape (pentagon prism) with glowing sage edges + gold core dot. Rotates slowly. Looks like alien crystalline technology.",
    Component: CrystalPoly,
  },
  {
    name: "Liquid Metal",
    vibe:
      "Chrome-like surface with subtle rippling deformation. Warm metallic palette (sage tint instead of cold blue). T-1000 sophistication, not childish.",
    Component: LiquidMetal,
  },
  {
    name: "Holographic Sphere",
    vibe:
      "Translucent glass orb with rotating tilted data rings + floating UI dots. Like a hologram from a sci-fi UI. Modern, futuristic, branded with sage/gold accent particles.",
    Component: HoloSphere,
  },
  {
    name: "Particle Spirit",
    vibe:
      "No solid body. Just a coherent cluster of forty glowing particles forming a vaguely humanoid shape via density. Most abstract, most on-brand with the existing cell-dragon dust aesthetic.",
    Component: ParticleSpirit,
  },
];

export default function CreatureLabV2Page() {
  return (
    <main className="min-h-screen bg-bg text-text px-6 md:px-12 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <div className="mono-label text-text-dim">Creature lab v2 · alien-tech direction</div>
        <h1
          className="mt-3 text-4xl md:text-6xl font-bold tracking-tight"
          style={{ letterSpacing: "-0.025em", lineHeight: 1.05 }}
        >
          Pick the next Celly.
        </h1>
        <p className="mt-5 text-base md:text-lg text-text-muted leading-relaxed max-w-2xl">
          Six alien-tech / futuristic concepts to replace the current
          cartoonish mascot. Less Pixar, more J.A.R.V.I.S. The behavior
          we just locked in (auto-positioning, dragon trail, scroll-stop
          expansion) is sprite-agnostic — pick a direction and I&apos;ll
          swap the production version into preview-v6.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {CONCEPTS.map((c, i) => (
            <ConceptCard key={c.name} index={i + 1} {...c} />
          ))}
        </div>
      </div>
    </main>
  );
}
