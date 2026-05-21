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
/* StreamLayer — downward-flowing particles, visible during transitions */
/* ------------------------------------------------------------------ */
function StreamLayer({ streamOpacityRef }: { streamOpacityRef: React.MutableRefObject<number> }) {
  const ref = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);
  const COUNT = 600;

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const velocities = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 5;     // x: wider spread
      positions[i * 3 + 1] = Math.random() * 5 - 2;         // y: random start
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2;     // z: depth
      velocities[i] = 1.8 + Math.random() * 1.6;            // 3x faster — more "streaming"
    }
    return { positions, velocities };
  }, []);

  useFrame(({ clock }, delta) => {
    if (!ref.current || !matRef.current) return;
    const pa = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    const pos = pa.array as Float32Array;
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3 + 1] -= velocities[i] * delta;
      if (pos[i * 3 + 1] < -3) {
        pos[i * 3 + 1] = 3 + Math.random() * 0.5;
        pos[i * 3]     = (Math.random() - 0.5) * 5;
      }
    }
    pa.needsUpdate = true;
    // Fast crossfade — sharper transitions
    const target = Math.min(1, streamOpacityRef.current);
    matRef.current.opacity = matRef.current.opacity * 0.5 + target * 0.5;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={COUNT} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        color={ACCENT_BRIGHT}
        size={0.025}
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

    // Sphere opacity (cohesive form fades during transitions, stream takes over)
    const o = sphereOpacityRef.current;
    if (dustMatRef.current) dustMatRef.current.opacity = 0.55 * o;
    if (nodeMatRef.current) nodeMatRef.current.opacity = 1.0 * o;
    if (lineMatRef.current) lineMatRef.current.opacity = 0.18 * o;
    if (glowMatRef.current) glowMatRef.current.opacity = 0.05 * o;
  });

  return (
    <group ref={groupRef}>
      {/* Inner glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial ref={glowMatRef} color={ACCENT} transparent opacity={0.05} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Dust layer */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dustBase.slice(), 3]} count={dustBase.length / 3} array={dustBase.slice()} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial ref={dustMatRef} color={ACCENT} size={0.02} sizeAttenuation transparent opacity={0.55} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>

      {/* Graph lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[lineBase.current, 3]} count={lineBase.current.length / 3} array={lineBase.current} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial ref={lineMatRef} color={ACCENT} transparent opacity={0.18} depthWrite={false} blending={THREE.AdditiveBlending} />
      </lineSegments>

      {/* Graph nodes */}
      <points ref={nodesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodeBase.slice(), 3]} count={nodeBase.length / 3} array={nodeBase.slice()} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial ref={nodeMatRef} color={ACCENT_BRIGHT} size={0.045} sizeAttenuation transparent opacity={1} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
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
  const xRef = useRef(0);
  const scaleRef = useRef(0.9);
  const sphereOpacityRef = useRef(1);
  const streamOpacityRef = useRef(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

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
          // Section boundaries: progress p has `sectionCount` sections.
          // We want sphere visible IN sections, stream visible AT boundaries.
          // sectionIdx = floor(p * sectionCount); localProgress = (p * sectionCount) % 1
          const sectionFloat = p * sectionCount;
          const local = sectionFloat - Math.floor(sectionFloat);
          // Sharper bell curve so sphere fully dies at boundaries
          // Use sin^2 so the in-section plateau is wider, edges sharper
          const raw = Math.sin(local * Math.PI);
          const insideSection = Math.pow(raw, 0.6); // raise plateau, sharpen drop-off
          // Sphere fully dies at boundaries (min 0 not 0.15)
          sphereOpacityRef.current = insideSection;
          // Stream PEAKS at boundaries — boosted intensity
          const boundaryProx = 1 - insideSection;
          streamOpacityRef.current = boundaryProx * 1.4; // overshoot — clamped by material max

          // x: oscillate between -0.9 and +0.9 in a piecewise-sine that matches section count
          // so sphere lands LEFT or RIGHT inside each section, smoothly moves between
          const sectionIdx = Math.floor(sectionFloat);
          const isLeftSection = sectionIdx % 2 === 0;
          const targetX = isLeftSection ? -0.9 : 0.9;
          // smooth-step toward target as we enter the middle of the section
          const nextLeft = (sectionIdx + 1) % 2 === 0;
          const nextTargetX = nextLeft ? -0.9 : 0.9;
          // ease: stay at targetX during section body, slide to next during boundary
          const ease = local < 0.3 ? 0
                     : local > 0.7 ? 1
                     : (local - 0.3) / 0.4;
          xRef.current = targetX + (nextTargetX - targetX) * ease;

          // Scale: peaks in the middle of the page
          scaleRef.current = 0.7 + Math.sin(p * Math.PI) * 0.35;

          // Pulse: gentle baseline + spikes at section centers (when in-section)
          pulseRef.current = insideSection * 0.5;
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
            <StreamLayer streamOpacityRef={streamOpacityRef} />
          </Canvas>
        )}
      </div>

      {/* Foreground sections — scroll naturally; sphere reacts via refs */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
