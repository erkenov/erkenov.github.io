"use client";

/**
 * SphereScrollStage — v3 page-level cinematic stage.
 *
 * The sphere lives in a FIXED full-viewport canvas (always visible during
 * scroll). GSAP ScrollTrigger ties its position, scale, and pulse to the
 * progress of a long parent section, so as the user scrolls the sphere
 * appears to travel down through the page and interact with section content.
 *
 * This is the FOUNDATION for the v3 multi-section storytelling. Sections
 * (Hero / Voice / n8n / CRM / Services constellation / etc.) layer ABOVE
 * the fixed canvas with alternating L/R content.
 *
 * Current scope (Session A of v3, scroll milestone):
 *   - Sphere stays fixed-center on viewport
 *   - Scroll progress 0..1 drives a horizontal x offset (left/right sweep)
 *     so the sphere migrates between L/R sections naturally
 *   - Scale modulates a bit at certain milestones for "transform" hint
 *
 * Future:
 *   - Audio amplitude -> pulse
 *   - Particle dissolve between sections
 *   - Lottie animations on section content the sphere "enters"
 */

import { useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ACCENT = "#7ea687";
const ACCENT_BRIGHT = "#b8d4be";

function fibonacciSphere(count: number, radius: number): Float32Array {
  const arr = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    arr[i * 3] = Math.cos(theta) * r * radius;
    arr[i * 3 + 1] = y * radius;
    arr[i * 3 + 2] = Math.sin(theta) * r * radius;
  }
  return arr;
}

interface SphereInnerProps {
  /** mutable refs the host updates from scroll/audio so we don't re-render on every tick */
  pulseRef: React.MutableRefObject<number>;
  xRef: React.MutableRefObject<number>;
  scaleRef: React.MutableRefObject<number>;
  /** 0..1 — opacity of the cohesive sphere (drops during transitions) */
  sphereOpacityRef: React.MutableRefObject<number>;
  /** 0..1 — opacity of the downward stream layer (peaks during transitions) */
  streamOpacityRef: React.MutableRefObject<number>;
}

/* ------------------------------------------------------------------ */
/* TrailLayer — snake-like particle trail between sphere positions     */
/*                                                                     */
/*  Particles distributed along a path from "previous sphere position" */
/*  to "next sphere position" with a downward arc + sine wiggle that   */
/*  gives the snake-of-light feel. Only visible during boundary        */
/*  transitions (not random snowfall).                                 */
/* ------------------------------------------------------------------ */
function TrailLayer({
  streamOpacityRef,
  prevXRef,
  nextXRef,
  transitionProgressRef,
}: {
  streamOpacityRef: React.MutableRefObject<number>;
  prevXRef: React.MutableRefObject<number>;
  nextXRef: React.MutableRefObject<number>;
  /** 0..1 during a transition (sphere disappearing -> reappearing), else 0 */
  transitionProgressRef: React.MutableRefObject<number>;
}) {
  const ref = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);
  const COUNT = 220;
  const positions = useMemo(() => new Float32Array(COUNT * 3), []);

  // Each particle has its own position-along-trail [0..1] and a wiggle phase
  const params = useMemo(() => {
    const arr = new Float32Array(COUNT * 2);
    for (let i = 0; i < COUNT; i++) {
      arr[i * 2] = i / (COUNT - 1);                  // t along trail
      arr[i * 2 + 1] = Math.random() * Math.PI * 2;  // wiggle phase
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current || !matRef.current) return;
    const t = clock.getElapsedTime();
    const pa = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    const pos = pa.array as Float32Array;

    const prevX = prevXRef.current;
    const nextX = nextXRef.current;
    const trans = transitionProgressRef.current;  // 0 at section center, 1 at boundary

    // Head of trail moves from prevPos toward nextPos as trans goes 0->1
    // Tail lags behind. Each particle's position = lerp(prevX, nextX, particle.t * trans)
    for (let i = 0; i < COUNT; i++) {
      const localT = params[i * 2];           // 0..1
      const phase = params[i * 2 + 1];

      // Position along the trail (head leads, tail lags)
      const u = localT * trans;
      const x = prevX + (nextX - prevX) * u;

      // Y: starts at sphere height (0), drops as we move along the trail
      // gives the "downward arc" feel — snake flows down
      const y = -u * 1.4;

      // Wiggle perpendicular to motion + ambient sway
      const wiggle = Math.sin(t * 3 + phase + u * 6) * 0.08 * trans;
      const dx = (nextX - prevX);
      // perpendicular vector in screen-plane: rotate 90deg = (-dy, dx) where dy=-1.4 here
      const perpX = -(-1.4);  // = 1.4 — but normalize
      const perpY = dx;
      const perpMag = Math.hypot(perpX, perpY) || 1;

      pos[i * 3]     = x + (perpX / perpMag) * wiggle;
      pos[i * 3 + 1] = y + (perpY / perpMag) * wiggle * 0.5;
      pos[i * 3 + 2] = (Math.sin(phase + t * 1.2) * 0.2);  // z wobble for depth
    }
    pa.needsUpdate = true;

    // Gentle crossfade — softer transitions per "more subtle" feedback
    const target = Math.min(0.9, streamOpacityRef.current);
    matRef.current.opacity = matRef.current.opacity * 0.85 + target * 0.15;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={COUNT} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        color={ACCENT_BRIGHT}
        size={0.04}
        sizeAttenuation
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Sphere({ pulseRef, xRef, scaleRef, sphereOpacityRef, streamOpacityRef }: SphereInnerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const dustRef = useRef<THREE.Points>(null);
  const nodesRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const dustBase = useRef(fibonacciSphere(1500, 1.0)).current;
  const nodeBase = useRef(fibonacciSphere(120, 1.0)).current;
  const dustMatRef = useRef<THREE.PointsMaterial>(null);
  const nodeMatRef = useRef<THREE.PointsMaterial>(null);
  const lineMatRef = useRef<THREE.LineBasicMaterial>(null);
  const glowMatRef = useRef<THREE.MeshBasicMaterial>(null);

  // Pre-compute graph edges (pairs within distance threshold)
  const lineIndices = useRef<Array<[number, number]>>([]);
  const lineBase = useRef<Float32Array>(new Float32Array(0));
  if (lineIndices.current.length === 0) {
    const threshold = 0.35;
    const pairs: Array<[number, number]> = [];
    const count = nodeBase.length / 3;
    for (let i = 0; i < count; i++) {
      const ax = nodeBase[i * 3], ay = nodeBase[i * 3 + 1], az = nodeBase[i * 3 + 2];
      for (let j = i + 1; j < count; j++) {
        const bx = nodeBase[j * 3], by = nodeBase[j * 3 + 1], bz = nodeBase[j * 3 + 2];
        const d = Math.hypot(ax - bx, ay - by, az - bz);
        if (d < threshold) pairs.push([i, j]);
      }
    }
    lineIndices.current = pairs;
    lineBase.current = new Float32Array(pairs.length * 6);
  }

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const ambient = (Math.sin(t * 1.1) + 1) * 0.5 * 0.12;
    const amplitude = Math.max(ambient, pulseRef.current * 0.4);
    const sphereScale = scaleRef.current;

    // Dust positions
    if (dustRef.current) {
      const pa = dustRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const positions = pa.array as Float32Array;
      for (let i = 0; i < dustBase.length; i++) {
        const phase = (i * 0.13) % (Math.PI * 2);
        const breathing = 1 + amplitude + Math.sin(t * 0.45 + phase) * 0.025;
        positions[i] = dustBase[i] * breathing;
      }
      pa.needsUpdate = true;
    }

    // Node + line positions
    if (nodesRef.current && linesRef.current) {
      const npa = nodesRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const npos = npa.array as Float32Array;
      for (let i = 0; i < nodeBase.length; i++) {
        npos[i] = nodeBase[i] * (1 + amplitude);
      }
      npa.needsUpdate = true;

      const lpa = linesRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const lpos = lpa.array as Float32Array;
      const scale = 1 + amplitude;
      for (let p = 0; p < lineIndices.current.length; p++) {
        const [i, j] = lineIndices.current[p];
        const offset = p * 6;
        lpos[offset]     = nodeBase[i * 3]     * scale;
        lpos[offset + 1] = nodeBase[i * 3 + 1] * scale;
        lpos[offset + 2] = nodeBase[i * 3 + 2] * scale;
        lpos[offset + 3] = nodeBase[j * 3]     * scale;
        lpos[offset + 4] = nodeBase[j * 3 + 1] * scale;
        lpos[offset + 5] = nodeBase[j * 3 + 2] * scale;
      }
      lpa.needsUpdate = true;
    }

    // Glow scale
    if (glowRef.current) glowRef.current.scale.setScalar(0.45 + amplitude);

    // Whole group: scroll-driven x position + scroll-driven scale + slow rotation
    if (groupRef.current) {
      groupRef.current.position.x = xRef.current;
      groupRef.current.scale.setScalar(sphereScale);
      groupRef.current.rotation.y = t * 0.08;
      groupRef.current.rotation.x = Math.sin(t * 0.05) * 0.12;
    }

    // Sphere opacity — molecule visual
    const o = sphereOpacityRef.current;
    if (dustMatRef.current) dustMatRef.current.opacity = 0.7 * o;
    if (nodeMatRef.current) nodeMatRef.current.opacity = 1.0 * o;
    if (lineMatRef.current) lineMatRef.current.opacity = 0;              // removed
    if (glowMatRef.current) glowMatRef.current.opacity = 0.55 * o;       // solid nucleus
  });

  return (
    <group ref={groupRef}>
      {/* INNER SOLID SPHERE — molecule nucleus, smaller + more opaque */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.55, 48, 48]} />
        <meshBasicMaterial
          ref={glowMatRef}
          color={ACCENT}
          transparent
          opacity={0.55}
          depthWrite={false}
        />
      </mesh>

      {/* Outer dust cloud — electron shell */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dustBase.slice(), 3]} count={dustBase.length / 3} array={dustBase.slice()} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial ref={dustMatRef} color={ACCENT} size={0.022} sizeAttenuation transparent opacity={0.7} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>

      {/* Graph nodes (bright accents) — keeping these, removing the lines */}
      <points ref={nodesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodeBase.slice(), 3]} count={nodeBase.length / 3} array={nodeBase.slice()} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial ref={nodeMatRef} color={ACCENT_BRIGHT} size={0.045} sizeAttenuation transparent opacity={1} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>

      {/* Hidden lines (kept for ref but invisible per 2026-05-21 feedback) */}
      <lineSegments ref={linesRef} visible={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[lineBase.current, 3]} count={lineBase.current.length / 3} array={lineBase.current} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial ref={lineMatRef} color={ACCENT} transparent opacity={0} depthWrite={false} />
      </lineSegments>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Stage — fixed canvas + scroll progress tracker                     */
/* ------------------------------------------------------------------ */
interface StageProps {
  /** Children = the scrollable sections that live above the fixed sphere canvas */
  children: React.ReactNode;
}

export function SphereScrollStage({ children, sectionCount = 5 }: StageProps & { sectionCount?: number }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef(0);
  const xRef = useRef(-0.9);             // start LEFT (section 0 is even -> left)
  const scaleRef = useRef(0.9);
  const sphereOpacityRef = useRef(1);    // start FULLY visible
  const streamOpacityRef = useRef(0);
  // For snake trail: where sphere WAS and where it's going
  const prevXRef = useRef(-0.9);
  const nextXRef = useRef(0.9);
  const transitionProgressRef = useRef(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Helper: which x-position each section sits at (alternating L / R)
  const sectionX = (idx: number) => (idx % 2 === 0 ? -0.9 : 0.9);

  // Transition window width in progress-units (page scroll 0..1).
  // Each section spans 1/sectionCount. Transition takes up the LAST `transitionFrac`
  // of each section into the next. (So sphere is visible most of the section, then
  // dissolves into the trail near the end, then snaps to next section's x.)
  const transitionFrac = 0.3;

  useGSAP(() => {
    if (!stageRef.current) return;
    const tween = gsap.to({ progress: 0 }, {
      progress: 1,
      ease: "none",
      scrollTrigger: {
        trigger: stageRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress;
          const N = sectionCount;
          // CENTER-BASED MODEL: each section i has its "settle center" at p = (i+0.5)/N.
          // Around that center, in a half-width band, sphere is PEAKED.
          // Outside that band, sphere COMPRESSES toward a dot and snake emerges
          // FROM the dot toward the next section's center.
          // Page edges (top/bottom) are clamped to peaked so sphere never feels half-vanished.

          let nearestIdx = Math.round(p * N - 0.5);
          if (nearestIdx < 0) nearestIdx = 0;
          if (nearestIdx > N - 1) nearestIdx = N - 1;
          const centerP = (nearestIdx + 0.5) / N;
          const distSectionUnits = (p - centerP) * N;
          const absDist = Math.abs(distSectionUnits);

          const atTopEdge = p <= centerP && nearestIdx === 0;
          const atBottomEdge = p >= centerP && nearestIdx === N - 1;

          const peakBand = 0.15;
          const transBand = 0.5 - peakBand;

          let sphereScale: number;
          let sphereOpacity: number;
          let trans: number;
          let fromX: number;
          let toX: number;

          if (atTopEdge || atBottomEdge || absDist < peakBand) {
            sphereScale = 1;
            sphereOpacity = 1;
            trans = 0;
            fromX = sectionX(nearestIdx);
            toX = sectionX(nearestIdx);
          } else {
            const tBand = (absDist - peakBand) / transBand;
            sphereScale = Math.max(0.05, 1 - Math.pow(tBand, 0.85));
            sphereOpacity = Math.max(0.05, 1 - Math.pow(tBand, 0.7));
            trans = Math.pow(tBand, 0.85);
            if (distSectionUnits > 0) {
              const next = Math.min(N - 1, nearestIdx + 1);
              fromX = sectionX(nearestIdx);
              toX = sectionX(next);
            } else {
              const prev = Math.max(0, nearestIdx - 1);
              fromX = sectionX(nearestIdx);
              toX = sectionX(prev);
            }
          }

          sphereOpacityRef.current = sphereOpacity;
          xRef.current = sectionX(nearestIdx);
          scaleRef.current = sphereScale * (0.85 + Math.sin(p * Math.PI) * 0.2);
          transitionProgressRef.current = trans;
          streamOpacityRef.current = trans;
          prevXRef.current = fromX;
          nextXRef.current = toX;

          pulseRef.current = sphereOpacity * 0.5;
        },
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, { scope: stageRef });

  return (
    <div ref={stageRef} className="relative">
      {/* Fixed canvas behind all content */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {mounted && (
          <Canvas
            camera={{ position: [0, 0, 2.9], fov: 50 }}
            gl={{ alpha: true, antialias: true }}
            style={{ background: "transparent" }}
          >
            <ambientLight intensity={0.5} />
            <Sphere
              pulseRef={pulseRef}
              xRef={xRef}
              scaleRef={scaleRef}
              sphereOpacityRef={sphereOpacityRef}
              streamOpacityRef={streamOpacityRef}
            />
            <TrailLayer
              streamOpacityRef={streamOpacityRef}
              prevXRef={prevXRef}
              nextXRef={nextXRef}
              transitionProgressRef={transitionProgressRef}
            />
          </Canvas>
        )}
      </div>

      {/* Foreground sections — scroll naturally; sphere reacts via refs */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
