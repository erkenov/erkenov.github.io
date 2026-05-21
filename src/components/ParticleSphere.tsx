"use client";

/**
 * ParticleSphere — v0.2 (polish pass)
 *
 * Two-layer architecture:
 *   1. Dust layer: ~1500 fine particles, additive blending — gives texture / depth
 *   2. Graph layer: ~120 sparser "nodes" with visible connection LINES between
 *      neighbors within a distance threshold. This is what makes it read as
 *      an "Obsidian graph" / neural-network sphere, not just a dust cloud.
 *
 * Both layers pulse together. Slow rotation on both axes for life.
 *
 * Eventually drives from:
 *   - Web Audio API analyser (real audio amplitude -> pulse)
 *   - GSAP ScrollTrigger (page scroll -> y position + transform state)
 */

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

const ACCENT = "#7ea687";
const ACCENT_BRIGHT = "#b8d4be";

interface SphereProps {
  pulse?: number;
}

/* ------------------------------------------------------------------ */
/* Helper: Fibonacci lattice — evenly distributes points on a sphere   */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/* Dust layer (1500 fine particles)                                   */
/* ------------------------------------------------------------------ */
function DustLayer({ pulse, time }: { pulse: number; time: React.MutableRefObject<number> }) {
  const ref = useRef<THREE.Points>(null);
  const base = useMemo(() => fibonacciSphere(1500, 1.0), []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    time.current = t;
    const positionAttr = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    const positions = positionAttr.array as Float32Array;
    const ambient = (Math.sin(t * 1.1) + 1) * 0.5 * 0.12;
    const amplitude = Math.max(ambient, pulse * 0.4);

    for (let i = 0; i < base.length; i++) {
      const phase = (i * 0.13) % (Math.PI * 2);
      // Slight per-point breathing
      const breathing = 1 + amplitude + Math.sin(t * 0.45 + phase) * 0.025;
      positions[i] = base[i] * breathing;
    }
    positionAttr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[base.slice(), 3]}
          count={base.length / 3}
          array={base.slice()}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={ACCENT}
        size={0.02}
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ------------------------------------------------------------------ */
/* Graph layer — sparse nodes with connection lines between neighbors */
/* ------------------------------------------------------------------ */
function GraphLayer({ pulse }: { pulse: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const nodesRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const { nodeBase, lineBase, lineIndices } = useMemo(() => {
    const count = 120;
    const nodeBase = fibonacciSphere(count, 1.0);
    // For each node, find all neighbors within threshold. Store pairs of indices.
    const threshold = 0.35; // tuned for ~120 points on unit sphere
    const pairs: Array<[number, number]> = [];
    for (let i = 0; i < count; i++) {
      const ax = nodeBase[i * 3], ay = nodeBase[i * 3 + 1], az = nodeBase[i * 3 + 2];
      for (let j = i + 1; j < count; j++) {
        const bx = nodeBase[j * 3], by = nodeBase[j * 3 + 1], bz = nodeBase[j * 3 + 2];
        const d = Math.hypot(ax - bx, ay - by, az - bz);
        if (d < threshold) pairs.push([i, j]);
      }
    }
    // Pre-allocate line positions buffer (2 endpoints per line)
    const lineBase = new Float32Array(pairs.length * 2 * 3);
    return { nodeBase, lineBase, lineIndices: pairs };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const ambient = (Math.sin(t * 1.1) + 1) * 0.5 * 0.12;
    const amplitude = Math.max(ambient, pulse * 0.4);

    // 1. Update node positions
    if (nodesRef.current) {
      const positionAttr = nodesRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const positions = positionAttr.array as Float32Array;
      for (let i = 0; i < nodeBase.length; i++) {
        positions[i] = nodeBase[i] * (1 + amplitude);
      }
      positionAttr.needsUpdate = true;
    }

    // 2. Update line endpoints (use the same node positions)
    if (linesRef.current) {
      const positionAttr = linesRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const positions = positionAttr.array as Float32Array;
      const scale = 1 + amplitude;
      for (let p = 0; p < lineIndices.length; p++) {
        const [i, j] = lineIndices[p];
        const offset = p * 6;
        positions[offset]     = nodeBase[i * 3]     * scale;
        positions[offset + 1] = nodeBase[i * 3 + 1] * scale;
        positions[offset + 2] = nodeBase[i * 3 + 2] * scale;
        positions[offset + 3] = nodeBase[j * 3]     * scale;
        positions[offset + 4] = nodeBase[j * 3 + 1] * scale;
        positions[offset + 5] = nodeBase[j * 3 + 2] * scale;
      }
      positionAttr.needsUpdate = true;
    }

    // 3. Slow rotation of the whole group
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.08;
      groupRef.current.rotation.x = Math.sin(t * 0.05) * 0.12;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Connection lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[lineBase, 3]}
            count={lineBase.length / 3}
            array={lineBase}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={ACCENT}
          transparent
          opacity={0.18}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Node points (brighter, larger than dust) */}
      <points ref={nodesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[nodeBase.slice(), 3]}
            count={nodeBase.length / 3}
            array={nodeBase.slice()}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color={ACCENT_BRIGHT}
          size={0.045}
          sizeAttenuation
          transparent
          opacity={1}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Inner glow sphere (soft volumetric depth)                          */
/* ------------------------------------------------------------------ */
function InnerGlow({ pulse }: { pulse: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const ambient = (Math.sin(t * 1.1) + 1) * 0.5 * 0.1;
    const amplitude = Math.max(ambient, pulse * 0.3);
    ref.current.scale.setScalar(0.45 + amplitude);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial
        color={ACCENT}
        transparent
        opacity={0.05}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/* Main Sphere composition                                            */
/* ------------------------------------------------------------------ */
function Sphere({ pulse = 0 }: SphereProps) {
  const time = useRef(0);
  return (
    <>
      <InnerGlow pulse={pulse} />
      <DustLayer pulse={pulse} time={time} />
      <GraphLayer pulse={pulse} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Exported component                                                 */
/* ------------------------------------------------------------------ */
interface ParticleSphereProps {
  /** Pulse amplitude 0..1 (audio-driven in production, sine-wave for now) */
  pulse?: number;
  className?: string;
}

export function ParticleSphere({ pulse, className }: ParticleSphereProps) {
  return (
    <div className={className ?? "h-[500px] w-full"}>
      <Canvas
        camera={{ position: [0, 0, 2.9], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <Sphere pulse={pulse ?? 0} />
      </Canvas>
    </div>
  );
}
