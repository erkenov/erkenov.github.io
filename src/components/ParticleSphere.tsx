"use client";

/**
 * ParticleSphere — proof of concept for v3.
 *
 * A 3D sphere of sage-green particles that gently pulses (sine-wave amplitude).
 * This component is the visual core that, in the full v3 build, will:
 *   - drive its pulse from real audio amplitude (Web Audio API analyser)
 *   - travel down the page on scroll via GSAP ScrollTrigger
 *   - transform into streaming particles between sections
 *   - interact with Lottie-animated section content (n8n nodes, CRM, etc.)
 *
 * For now: pure render — proves the Three.js architecture works.
 */

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

const ACCENT = "#7ea687";
const ACCENT_BRIGHT = "#b8d4be";

interface SphereProps {
  /** Pulse amplitude 0..1 (will eventually be audio-driven) */
  pulse?: number;
}

function Sphere({ pulse = 0 }: SphereProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Generate ~1500 points distributed on a sphere surface (Fibonacci lattice)
  const { positions, originalRadii } = useMemo(() => {
    const count = 1500;
    const positions = new Float32Array(count * 3);
    const originalRadii = new Float32Array(count);
    const radius = 1.0;
    const golden = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;
      positions[i * 3] = x * radius;
      positions[i * 3 + 1] = y * radius;
      positions[i * 3 + 2] = z * radius;
      originalRadii[i] = radius;
    }
    return { positions, originalRadii };
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();
    const positionAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const positions = positionAttr.array as Float32Array;
    const count = positions.length / 3;

    // Ambient sine pulse + audio-driven pulse (when wired)
    const ambientPulse = (Math.sin(t * 1.2) + 1) * 0.5; // 0..1
    const combined = Math.max(ambientPulse * 0.15, pulse);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const original = originalRadii[i];
      // Each point drifts slightly in its own phase for organic feel
      const phase = i * 0.13;
      const drift = Math.sin(t * 0.5 + phase) * 0.02;
      const scale = original * (1 + combined * 0.35 + drift);
      // Rebuild position from original direction × current radius
      const dirX = positions[i3] / Math.hypot(positions[i3], positions[i3 + 1], positions[i3 + 2]);
      const dirY = positions[i3 + 1] / Math.hypot(positions[i3], positions[i3 + 1], positions[i3 + 2]);
      const dirZ = positions[i3 + 2] / Math.hypot(positions[i3], positions[i3 + 1], positions[i3 + 2]);
      positions[i3] = dirX * scale;
      positions[i3 + 1] = dirY * scale;
      positions[i3 + 2] = dirZ * scale;
    }
    positionAttr.needsUpdate = true;

    // Slow rotation of the whole sphere group for life
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.08;
      groupRef.current.rotation.x = Math.sin(t * 0.05) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color={ACCENT}
          size={0.025}
          sizeAttenuation
          transparent
          opacity={0.9}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      {/* Inner glow */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color={ACCENT_BRIGHT} transparent opacity={0.06} />
      </mesh>
    </group>
  );
}

interface ParticleSphereProps {
  /** Pulse amplitude 0..1 (audio-driven in production, sine-wave for POC) */
  pulse?: number;
  className?: string;
}

export function ParticleSphere({ pulse, className }: ParticleSphereProps) {
  return (
    <div className={className ?? "h-[500px] w-full"}>
      <Canvas
        camera={{ position: [0, 0, 2.8], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <Sphere pulse={pulse ?? 0} />
      </Canvas>
    </div>
  );
}
