"use client";

/**
 * Creature Lab — six concept sketches for the on-site AI character.
 *
 * Low-fidelity exploration page so Shamil can pick a direction before we
 * invest in building one for real. Each card shows:
 *   - animated visual preview (SVG / CSS — no Three.js per concept, too heavy)
 *   - name + vibe description
 *   - sample chat bubble showing how the AI conversation would appear
 *
 * Concepts:
 *   1. Cell-Dragon with Face       — adds eyes+mouth to the existing entity
 *   2. The Companion Orb           — Eve-from-Wall-E energy, sage + gold
 *   3. The Mini Dragon             — particle-trail creature, no face, all motion
 *   4. The Pet Cube                — Pixar-lamp geometry, very tech-friendly
 *   5. The Sprite                  — abstract flame/spirit, dance > face
 *   6. The Watcher                 — just eyes+mouth, no body, most minimal
 *
 * Visit http://localhost:3000/creature-lab
 */

import React from "react";

// ---------- Shared chat bubble component ----------

function ChatBubble({ children, side = "top" }: { children: React.ReactNode; side?: "top" | "right" }) {
  return (
    <div
      className={`absolute z-20 ${
        side === "top"
          ? "left-1/2 -translate-x-1/2 -top-2 -translate-y-full"
          : "left-full top-1/2 -translate-y-1/2 ml-3"
      } w-56 rounded-2xl bg-white shadow-lg ring-1 ring-black/5 px-4 py-3`}
    >
      <div className="text-[13px] leading-snug text-neutral-800">{children}</div>
      <div
        className={`absolute w-3 h-3 bg-white rotate-45 ${
          side === "top"
            ? "left-1/2 -translate-x-1/2 -bottom-1.5"
            : "top-1/2 -translate-y-1/2 -left-1.5"
        } ring-1 ring-black/5`}
        style={{
          clipPath:
            side === "top"
              ? "polygon(0% 0%, 100% 100%, 0% 100%)"
              : "polygon(0% 0%, 100% 0%, 0% 100%)",
        }}
      />
    </div>
  );
}

// ---------- Creature 1: Cell-Dragon with Face ----------
// Two terracotta cell circles (mimicking the existing cell aesthetic) with
// eyes overlaid. Soft pulse to show "alive". The dragon trail particles
// would still animate in production — here we show a static teaser.

function CellDragonFace() {
  return (
    <div className="relative w-44 h-44 flex items-center justify-center">
      {/* Outer sage dust shell — soft, large, blurry */}
      <div
        className="absolute inset-0 rounded-full animate-[pulseSoft_4s_ease-in-out_infinite]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(126,166,135,0.35) 0%, rgba(126,166,135,0.18) 50%, transparent 75%)",
          filter: "blur(4px)",
        }}
      />
      {/* Inner terracotta CORE — proper spherical shading via radial gradient.
          Highlight upper-left, deep shadow lower-right, glowing rim.        */}
      <div
        className="relative w-28 h-28 rounded-full animate-[pulseSoft_4s_ease-in-out_infinite]"
        style={{
          background:
            "radial-gradient(circle at 35% 32%, #F2B5A6 0%, #E88B7A 22%, #C76B58 55%, #8E4034 92%, #6A2A22 100%)",
          boxShadow:
            "inset -8px -10px 18px rgba(0,0,0,0.35), inset 6px 8px 14px rgba(255,200,180,0.4), 0 0 32px rgba(232,139,122,0.55)",
        }}
      >
        {/* Specular highlight blob top-left to sell the 3D sphere */}
        <div
          className="absolute top-[15%] left-[18%] w-7 h-5 rounded-full opacity-70"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255,240,230,0.9) 0%, transparent 75%)",
            filter: "blur(2px)",
          }}
        />
        {/* Eyes — sit ON the sphere surface, slightly above center */}
        <div className="absolute top-[40%] left-[28%] w-4 h-4 rounded-full bg-white shadow-md">
          <div className="absolute top-0.5 left-1 w-2.5 h-2.5 rounded-full bg-neutral-900" />
        </div>
        <div className="absolute top-[40%] right-[28%] w-4 h-4 rounded-full bg-white shadow-md">
          <div className="absolute top-0.5 left-0.5 w-2.5 h-2.5 rounded-full bg-neutral-900" />
        </div>
        {/* Smile — slight curve, follows sphere */}
        <div className="absolute bottom-[28%] left-1/2 -translate-x-1/2 w-8 h-3.5 border-b-[2.5px] border-neutral-900 rounded-b-full" />
      </div>
      {/* Tiny sun-gold particle accents around the edge (dragon shimmer) */}
      <div className="absolute top-2 right-6 w-1.5 h-1.5 rounded-full bg-[#F2C94C] opacity-80" />
      <div className="absolute bottom-4 left-3 w-1 h-1 rounded-full bg-[#E89F1F] opacity-70" />
      <div className="absolute top-12 left-1 w-1 h-1 rounded-full bg-[#F2C94C] opacity-60" />
      <style jsx>{`
        @keyframes pulseSoft {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
      `}</style>
    </div>
  );
}

// ---------- Creature 7: The Mascot (Pixar / Clippy energy, neotenous) ----------
// Cartoonish character with baby proportions — oversized head, tiny body,
// big expressive eyes. Triggers attachment via neoteny.

function Mascot() {
  return (
    <div className="relative w-44 h-44 flex items-end justify-center pb-2">
      <div className="relative animate-[bobble_3s_ease-in-out_infinite]">
        {/* HEAD — oversized, soft cream sphere with shading */}
        <div
          className="relative w-28 h-28 rounded-full mx-auto"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, #FFFBF2 0%, #F5E9CC 50%, #D9C9A0 100%)",
            boxShadow:
              "inset -6px -8px 14px rgba(120,90,60,0.18), 0 6px 16px rgba(0,0,0,0.12)",
          }}
        >
          {/* HUGE expressive eyes — neoteny trigger */}
          <div className="absolute top-[30%] left-[20%] w-6 h-7 rounded-full bg-white shadow-inner">
            <div
              className="absolute top-1.5 left-1 w-4 h-4 rounded-full bg-neutral-900"
              style={{ animation: "lookAround 5s ease-in-out infinite" }}
            >
              <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-full bg-white" />
            </div>
          </div>
          <div className="absolute top-[30%] right-[20%] w-6 h-7 rounded-full bg-white shadow-inner">
            <div
              className="absolute top-1.5 left-1 w-4 h-4 rounded-full bg-neutral-900"
              style={{ animation: "lookAround 5s ease-in-out infinite" }}
            >
              <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-full bg-white" />
            </div>
          </div>
          {/* Tiny smile */}
          <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-5 h-2.5 border-b-2 border-neutral-700 rounded-b-full" />
          {/* Cheek blush */}
          <div className="absolute bottom-[28%] left-[12%] w-3 h-2 rounded-full bg-[#E88B7A]/40" />
          <div className="absolute bottom-[28%] right-[12%] w-3 h-2 rounded-full bg-[#E88B7A]/40" />
        </div>
        {/* Tiny body — sage hoodie/blob shape */}
        <div
          className="relative -mt-2 mx-auto w-16 h-9 rounded-t-2xl"
          style={{
            background:
              "linear-gradient(180deg, #7ea687 0%, #5e8268 100%)",
            boxShadow:
              "inset -3px -2px 6px rgba(0,0,0,0.18), 0 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          {/* Tiny arms */}
          <div className="absolute -left-2 top-1 w-3 h-5 rounded-full bg-[#5e8268]" />
          <div className="absolute -right-2 top-1 w-3 h-5 rounded-full bg-[#5e8268]" />
          {/* Tiny gold pin (badge — references the cell-dragon gold accents) */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#F2C94C] shadow-sm" />
        </div>
      </div>
      <style jsx>{`
        @keyframes bobble {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50% { transform: translateY(-4px) rotate(1deg); }
        }
        @keyframes lookAround {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(2px, -1px); }
          60% { transform: translate(-1px, 1px); }
          80% { transform: translate(0, 0); }
        }
      `}</style>
    </div>
  );
}

// ---------- Creature 8: Cell-Dragon Sprite (face + floating limbs) ----------
// The "best of both worlds" pick: the cell-dragon body Shamil already loves,
// PLUS detached Mickey-Mouse-style hands and feet that float beside it.
// One hand poses pointing — toward the section content the creature is
// "introducing". Slight bobble + leg swing sells the levitation.

function CellDragonSprite() {
  return (
    <div className="relative w-52 h-52 flex items-center justify-center">
      {/* Outer sage dust shell */}
      <div
        className="absolute inset-6 rounded-full animate-[pulseSoft_4s_ease-in-out_infinite]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(126,166,135,0.35) 0%, rgba(126,166,135,0.18) 50%, transparent 75%)",
          filter: "blur(4px)",
        }}
      />

      {/* The character — body + limbs bobble together */}
      <div className="relative animate-[bobble_3s_ease-in-out_infinite]">
        {/* Inner terracotta CORE — proper spherical shading */}
        <div
          className="relative w-24 h-24 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 35% 32%, #F2B5A6 0%, #E88B7A 22%, #C76B58 55%, #8E4034 92%, #6A2A22 100%)",
            boxShadow:
              "inset -7px -9px 16px rgba(0,0,0,0.35), inset 5px 7px 12px rgba(255,200,180,0.4), 0 0 28px rgba(232,139,122,0.55)",
          }}
        >
          {/* Specular highlight */}
          <div
            className="absolute top-[15%] left-[18%] w-6 h-4 rounded-full opacity-70"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(255,240,230,0.9) 0%, transparent 75%)",
              filter: "blur(2px)",
            }}
          />
          {/* Eyes */}
          <div className="absolute top-[38%] left-[26%] w-4 h-4 rounded-full bg-white shadow-md">
            <div className="absolute top-0.5 left-1 w-2.5 h-2.5 rounded-full bg-neutral-900" />
          </div>
          <div className="absolute top-[38%] right-[26%] w-4 h-4 rounded-full bg-white shadow-md">
            <div className="absolute top-0.5 left-0.5 w-2.5 h-2.5 rounded-full bg-neutral-900" />
          </div>
          {/* Smile */}
          <div className="absolute bottom-[28%] left-1/2 -translate-x-1/2 w-7 h-3 border-b-[2.5px] border-neutral-900 rounded-b-full" />
        </div>

        {/* LEFT HAND — detached, sage glove, gently waving */}
        <div
          className="absolute top-[55%] -left-5 w-5 h-5 rounded-full animate-[waveLeft_3s_ease-in-out_infinite]"
          style={{
            background: "radial-gradient(circle at 35% 30%, #B8D4BD, #7ea687 55%, #5e8268)",
            boxShadow: "inset -2px -2px 4px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.12)",
          }}
        />

        {/* RIGHT HAND — detached, POINTING right (toward "section content") */}
        <div
          className="absolute top-[42%] -right-7 animate-[pointRight_4s_ease-in-out_infinite]"
        >
          <div
            className="relative w-5 h-5 rounded-full"
            style={{
              background: "radial-gradient(circle at 35% 30%, #B8D4BD, #7ea687 55%, #5e8268)",
              boxShadow: "inset -2px -2px 4px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.12)",
            }}
          >
            {/* Finger pointing right — small bump */}
            <div
              className="absolute top-1 -right-1.5 w-3 h-2 rounded-r-full"
              style={{
                background: "radial-gradient(circle at 30% 30%, #B8D4BD, #7ea687)",
              }}
            />
          </div>
        </div>

        {/* LEGS — two small terracotta feet dangling, slight swing */}
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
          <div
            className="w-3.5 h-5 rounded-full origin-top animate-[legSwingL_3s_ease-in-out_infinite]"
            style={{
              background: "radial-gradient(circle at 40% 25%, #E88B7A, #C76B58 55%, #8E4034)",
              boxShadow: "inset -1px -1px 3px rgba(0,0,0,0.2)",
            }}
          />
          <div
            className="w-3.5 h-5 rounded-full origin-top animate-[legSwingR_3s_ease-in-out_infinite]"
            style={{
              background: "radial-gradient(circle at 40% 25%, #E88B7A, #C76B58 55%, #8E4034)",
              boxShadow: "inset -1px -1px 3px rgba(0,0,0,0.2)",
            }}
          />
        </div>
      </div>

      {/* Tiny sun-gold sparkle accents */}
      <div className="absolute top-3 right-8 w-1.5 h-1.5 rounded-full bg-[#F2C94C] opacity-80" />
      <div className="absolute bottom-6 left-4 w-1 h-1 rounded-full bg-[#E89F1F] opacity-70" />

      <style jsx>{`
        @keyframes pulseSoft {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
        @keyframes bobble {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50% { transform: translateY(-5px) rotate(1deg); }
        }
        @keyframes waveLeft {
          0%, 100% { transform: translateY(0) rotate(-10deg); }
          50% { transform: translateY(-2px) rotate(10deg); }
        }
        @keyframes pointRight {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(3px); }
        }
        @keyframes legSwingL {
          0%, 100% { transform: rotate(-8deg); }
          50% { transform: rotate(4deg); }
        }
        @keyframes legSwingR {
          0%, 100% { transform: rotate(8deg); }
          50% { transform: rotate(-4deg); }
        }
      `}</style>
    </div>
  );
}

// ---------- Creature 2: The Companion Orb ----------
// Glowing sphere with two simple eyes that blink.

function CompanionOrb() {
  return (
    <div className="relative w-44 h-44 flex items-center justify-center">
      <div
        className="w-32 h-32 rounded-full shadow-[0_0_30px_rgba(126,166,135,0.5)] animate-[float_4s_ease-in-out_infinite]"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, #B8D4BD 0%, #7ea687 45%, #5e8268 100%)",
        }}
      >
        {/* Eyes */}
        <div className="relative w-full h-full">
          <div className="absolute top-[38%] left-[28%] w-4 h-4 rounded-full bg-white shadow-md">
            <div className="absolute top-1 left-1 w-2.5 h-2.5 rounded-full bg-neutral-900 animate-[blink_5s_ease-in-out_infinite]" />
          </div>
          <div className="absolute top-[38%] right-[28%] w-4 h-4 rounded-full bg-white shadow-md">
            <div className="absolute top-1 left-1 w-2.5 h-2.5 rounded-full bg-neutral-900 animate-[blink_5s_ease-in-out_infinite]" />
          </div>
          {/* Tiny gold accent dot */}
          <div className="absolute bottom-[28%] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#F2C94C]" />
        </div>
      </div>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes blink {
          0%, 92%, 100% { transform: scaleY(1); }
          94%, 98% { transform: scaleY(0.1); }
        }
      `}</style>
    </div>
  );
}

// ---------- Creature 3: The Mini Dragon (no face, all motion) ----------
// Snaking trail of gold dots — characterful through motion alone.

function MiniDragon() {
  const dots = Array.from({ length: 8 }, (_, i) => i);
  return (
    <div className="relative w-44 h-44 flex items-center justify-center overflow-hidden">
      {dots.map((i) => (
        <div
          key={i}
          className="absolute w-3 h-3 rounded-full"
          style={{
            background: i === 0 ? "#E89F1F" : `#F2C94C`,
            opacity: 1 - i * 0.1,
            transform: "translate(-50%, -50%)",
            left: "50%",
            top: "50%",
            animation: `dragonPath 4s ease-in-out infinite`,
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes dragonPath {
          0%   { transform: translate(-80px, -10px) scale(1); }
          25%  { transform: translate(-30px, -40px) scale(1.1); }
          50%  { transform: translate( 30px,   0px) scale(1); }
          75%  { transform: translate( 60px,  30px) scale(0.9); }
          100% { transform: translate(-80px, -10px) scale(1); }
        }
      `}</style>
    </div>
  );
}

// ---------- Creature 4: The Pet Cube (Pixar lamp energy) ----------

function PetCube() {
  return (
    <div className="relative w-44 h-44 flex items-center justify-center [perspective:600px]">
      <div
        className="relative w-24 h-24 [transform-style:preserve-3d] animate-[cubeTilt_5s_ease-in-out_infinite]"
        style={{ transform: "rotateX(-15deg) rotateY(20deg)" }}
      >
        {/* Front face with eyes */}
        <div
          className="absolute inset-0 rounded-md bg-[#F2D9A0] shadow-lg"
          style={{ transform: "translateZ(48px)" }}
        >
          <div className="absolute top-6 left-4 w-4 h-4 rounded-full bg-neutral-900">
            <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-full bg-white" />
          </div>
          <div className="absolute top-6 right-4 w-4 h-4 rounded-full bg-neutral-900">
            <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-full bg-white" />
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-6 h-1 bg-neutral-900 rounded-full" />
        </div>
        {/* Right face */}
        <div
          className="absolute inset-0 rounded-md bg-[#D6B97A] shadow-md"
          style={{ transform: "rotateY(90deg) translateZ(48px)" }}
        />
        {/* Top face */}
        <div
          className="absolute inset-0 rounded-md bg-[#EFC7BC]"
          style={{ transform: "rotateX(90deg) translateZ(48px)" }}
        />
      </div>
      <style jsx>{`
        @keyframes cubeTilt {
          0%, 100% { transform: rotateX(-15deg) rotateY(20deg); }
          50% { transform: rotateX(-10deg) rotateY(-10deg); }
        }
      `}</style>
    </div>
  );
}

// ---------- Creature 5: The Sprite (abstract flame, no face) ----------

function Sprite() {
  return (
    <div className="relative w-44 h-44 flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-32 h-32">
        <defs>
          <radialGradient id="spriteGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F2C94C" stopOpacity="1" />
            <stop offset="50%" stopColor="#E89F1F" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#C76B58" stopOpacity="0.4" />
          </radialGradient>
        </defs>
        <path fill="url(#spriteGrad)">
          <animate
            attributeName="d"
            dur="3s"
            repeatCount="indefinite"
            values="
              M50,15 C70,15 85,35 80,55 C75,75 60,90 50,85 C40,90 25,75 20,55 C15,35 30,15 50,15 Z;
              M50,10 C75,10 88,40 82,60 C76,80 55,92 50,88 C45,92 24,80 18,60 C12,40 25,10 50,10 Z;
              M50,15 C70,15 85,35 80,55 C75,75 60,90 50,85 C40,90 25,75 20,55 C15,35 30,15 50,15 Z
            "
          />
        </path>
      </svg>
    </div>
  );
}

// ---------- Creature 6: The Watcher (eyes + mouth, no body) ----------

function Watcher() {
  return (
    <div className="relative w-44 h-44 flex items-center justify-center">
      <div className="relative w-32 h-20 flex items-center justify-center gap-3 animate-[float_4s_ease-in-out_infinite]">
        {/* Two large eyes */}
        <div className="w-10 h-10 rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex items-center justify-center">
          <div className="w-5 h-5 rounded-full bg-neutral-900 animate-[lookAround_6s_ease-in-out_infinite]" />
        </div>
        <div className="w-10 h-10 rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex items-center justify-center">
          <div className="w-5 h-5 rounded-full bg-neutral-900 animate-[lookAround_6s_ease-in-out_infinite]" />
        </div>
        {/* Small mouth below */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-1.5 bg-neutral-900 rounded-full" />
      </div>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes lookAround {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(2px, -1px); }
          50% { transform: translate(-2px, 1px); }
          80% { transform: translate(0, 0); }
        }
      `}</style>
    </div>
  );
}

// ---------- Creature card wrapper ----------

type CreatureCardProps = {
  index: number;
  name: string;
  vibe: string;
  chatExample: string;
  pros: string[];
  cons: string[];
  CreatureComponent: React.ComponentType;
};

function CreatureCard({
  index,
  name,
  vibe,
  chatExample,
  pros,
  cons,
  CreatureComponent,
}: CreatureCardProps) {
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

      {/* Visual area with chat bubble */}
      <div className="relative h-64 mb-6 bg-[#F5F1E8] rounded-xl flex items-center justify-center">
        <div className="relative">
          <CreatureComponent />
          <ChatBubble side="top">{chatExample}</ChatBubble>
        </div>
      </div>

      {/* Pros / Cons */}
      <div className="grid grid-cols-2 gap-4 text-[13px]">
        <div>
          <div className="mono-label text-text-dim text-[10px] mb-1.5">Pros</div>
          <ul className="space-y-1 text-text-muted">
            {pros.map((p) => (
              <li key={p} className="flex items-start gap-1.5">
                <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-[#7ea687]" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mono-label text-text-dim text-[10px] mb-1.5">Cons</div>
          <ul className="space-y-1 text-text-muted">
            {cons.map((c) => (
              <li key={c} className="flex items-start gap-1.5">
                <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-[#C76B58]" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ---------- Page ----------

const CREATURES: Omit<CreatureCardProps, "index">[] = [
  {
    name: "Cell-Dragon with a Face (v2 — spherical)",
    vibe:
      "Take the entity you already built and give the inner terracotta core eyes and a smile. Now drawn properly as a 3D sphere with depth and specular highlight, matching the real cell-dragon. The outer sage dust + gold particles stay. Lowest-risk option.",
    chatExample: "Hi! I'm the cell — ask me anything about Erken Systems.",
    pros: ["Reuses 12hrs of cell-dragon work", "Visually coherent with site", "Now reads as a sphere, not a disk"],
    cons: ["Still less viral than a brand-new character", "Face on abstract entity may feel uncanny to some"],
    CreatureComponent: CellDragonFace,
  },
  {
    name: "Cell-Dragon Sprite (face + floating limbs) ⭐ best of both worlds",
    vibe:
      "Shamil's pick. Keeps the real cell-dragon body and adds detached Mickey-Mouse-style sage hands and dangling terracotta feet — like the character is levitating. One hand poses pointing right so it can gesture at the section content it's introducing. Bridges abstract brand entity and Clippy-style cartoon companion.",
    chatExample: "Look over here — I'll show you the lead capture flow.",
    pros: [
      "Best of both worlds — brand entity + cartoon character",
      "Pointing hand naturally guides visitor attention",
      "Levitating posture sells the 'AI assistant' role",
      "Most viral potential while staying on-brand",
    ],
    cons: [
      "More animation work than a static face",
      "Limbs add visual complexity — must not compete with section content",
    ],
    CreatureComponent: CellDragonSprite,
  },
  {
    name: "The Companion Orb",
    vibe:
      "Eve-from-Wall-E energy. Glowing sphere, two dot-eyes, sage + gold palette. Minimalist, friendly, very 2026.",
    chatExample: "Hey there. Want me to show you how the voice agent works?",
    pros: ["Cleanest visual", "Easy to animate well", "Reads as 'AI companion' instantly"],
    cons: ["Generic if not done right", "Doesn't reference your existing brand work"],
    CreatureComponent: CompanionOrb,
  },
  {
    name: "The Mini Dragon",
    vibe:
      "No face, no body — character through pure motion. A snaking trail of gold particles. Mysterious, elegant, on-brand with the cell-dragon naming.",
    chatExample: "I move when you talk. Try me — what are you here for?",
    pros: ["Most original / least Clippy-like", "Reinforces dragon brand naming", "Beautiful at scale"],
    cons: ["Less obviously 'clickable'", "Harder for users to grasp it has personality"],
    CreatureComponent: MiniDragon,
  },
  {
    name: "The Pet Cube",
    vibe:
      "Pixar-lamp geometry. A little 3D cube with a face on one side, gently tilting and tracking. Most memorable, most tech-friendly.",
    chatExample: "I'm the cube. I know everything about this site. Try me.",
    pros: ["Most distinctive — nobody else has this", "Screenshots well", "Suggests 'systems' / 'modules'"],
    cons: ["Harder to redesign later", "Less 'soft' than orb"],
    CreatureComponent: PetCube,
  },
  {
    name: "The Sprite",
    vibe:
      "Abstract flame-spirit. No face, no body — pure shape and motion. Character through dance. Most artistic, most ambiguous.",
    chatExample: "I'll answer in writing — I don't have a face. Ask away.",
    pros: ["Most artistic / unique", "Hard to copy", "Doesn't anthropomorphize AI"],
    cons: ["Risks reading as a loading spinner", "Harder to 'click to talk' affordance"],
    CreatureComponent: Sprite,
  },
  {
    name: "The Watcher",
    vibe:
      "Just two eyes and a mouth. No body. Most minimal. Very 'calm one in the AI storm' on-brand. Slightly uncanny in a good way.",
    chatExample: "Hi. I'm listening. What do you want to know?",
    pros: ["Most on-brand for 'calm operator' persona", "Memorable", "Very minimal"],
    cons: ["Might read as creepy to some", "Hardest to make 'cute'"],
    CreatureComponent: Watcher,
  },
  {
    name: "The Mascot (Clippy energy, but original)",
    vibe:
      "Cartoonish character with baby proportions — oversized cream head, huge expressive eyes, tiny sage hoodie body, cheek blush. Designed to trigger attachment via neoteny (the design principle behind every Pixar character). Most 'alive' option. Closest to the Clippy nostalgia you mentioned — without the Clippy IP.",
    chatExample: "Hey! I helped build this site. Want me to show you around?",
    pros: ["Strongest attachment / memorability", "Most 'character'", "Closest to your Clippy reference"],
    cons: ["Biggest design departure from current site aesthetic", "Mascots can date faster than abstract entities"],
    CreatureComponent: Mascot,
  },
];

export default function CreatureLabPage() {
  return (
    <main className="min-h-screen bg-bg text-text px-6 md:px-12 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <div className="mono-label text-text-dim">Creature lab · concept sketches</div>
        <h1
          className="mt-3 text-4xl md:text-6xl font-bold tracking-tight"
          style={{ letterSpacing: "-0.025em", lineHeight: 1.05 }}
        >
          Pick the on-site AI character.
        </h1>
        <p className="mt-5 text-base md:text-lg text-text-muted leading-relaxed max-w-2xl">
          Six low-fidelity sketches. Each one is the candidate for an
          embodied AI assistant that lives on the Erken Systems site —
          scrolls with you, points at sections, and opens a chat when
          clicked. Pick a direction; we&apos;ll build the chosen one
          properly. Mock chat bubble shows the voice/tone for that creature.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {CREATURES.map((c, i) => (
            <CreatureCard key={c.name} index={i + 1} {...c} />
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-black/5 bg-white/40 backdrop-blur p-6 md:p-8">
          <div className="mono-label text-text-dim mb-2">Once you pick</div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
            What we build next
          </h2>
          <ul className="space-y-2 text-text-muted text-[15px] leading-relaxed">
            <li>• Production-quality version of the chosen creature (3D or polished 2D depending on pick)</li>
            <li>• Scroll-tied position so the creature travels with the page</li>
            <li>• Click → opens chat bubble with Claude Haiku behind it</li>
            <li>• System prompt scoped to Erken Systems + per-session message cap (5 msgs) + &quot;book a call&quot; upsell after</li>
            <li>• Mobile responsive — creature scales down, chat bubble becomes bottom drawer</li>
            <li>• Optional v2: TTS so the creature speaks (defer until local TTS hardware is fast enough)</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
