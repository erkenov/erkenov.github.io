"use client";

/**
 * MacbookFrame3D — photoreal MacBook via React Three Fiber.
 *
 * Loads /macbook.glb (MacBook Pro M3 16" 2024 by jackbaeten, CC-BY 4.0)
 * and renders it in a dedicated WebGL canvas. The dragon-cell canvas runs
 * elsewhere on the page; these are two separate WebGL contexts.
 *
 * Phase B scope (proof-of-concept): static photoreal model + scroll-driven
 * scale-in for entrance polish. Lid open/close animation deferred until we
 * inspect the model's node hierarchy and identify the lid mesh.
 *
 * Credit line is inline below the canvas — keeps attribution travelling
 * with the component regardless of which page hosts it.
 */

import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows } from "@react-three/drei";
import { motion, useScroll, useTransform } from "framer-motion";
import * as THREE from "three";

interface MacbookFrame3DProps {
  /** Future hook: HTML content to project onto the screen via drei <Html>. */
  children?: React.ReactNode;
}

function Model() {
  const { scene } = useGLTF("/macbook.glb") as unknown as {
    scene: THREE.Group;
  };
  // Auto-center the model so it sits at origin regardless of how the
  // artist authored it
  return <primitive object={scene} position={[0, -0.4, 0]} scale={1.4} />;
}

useGLTF.preload("/macbook.glb");

export function MacbookFrame3D({ children: _children }: MacbookFrame3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Subtle scale-in as the section enters view, scale-out as it leaves.
  // Until we wire lid animation, this is the entrance polish.
  const scale = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    [0.85, 1, 1, 0.85],
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0, 1, 1, 0],
  );

  return (
    <motion.div
      ref={ref}
      style={{ scale, opacity }}
      className="mx-auto w-full max-w-xl"
    >
      <div className="aspect-[16/10] w-full">
        <Canvas
          camera={{ position: [0, 0.2, 2.5], fov: 35 }}
          gl={{ alpha: true, antialias: true }}
          style={{ background: "transparent" }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.55} color="#F8F1DE" />
            <directionalLight
              position={[3, 4, 5]}
              intensity={1.2}
              color="#F5E9CC"
            />
            <directionalLight
              position={[-4, 1, 2]}
              intensity={0.4}
              color="#7ea687"
            />
            <Environment preset="city" />
            <Model />
            <ContactShadows
              position={[0, -0.6, 0]}
              opacity={0.45}
              scale={4}
              blur={2}
              far={1}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* CC-BY 4.0 attribution — travels with the component */}
      <div className="mt-2 text-center font-mono text-[10px] uppercase tracking-wider text-text-dim/70">
        3D model:{" "}
        <a
          href="https://sketchfab.com/3d-models/macbook-pro-m3-16-inch-2024-8e34fc2b303144f78490007d91ff57c4"
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-2 hover:underline"
        >
          jackbaeten
        </a>{" "}
        ·{" "}
        <a
          href="http://creativecommons.org/licenses/by/4.0/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-2 hover:underline"
        >
          CC BY 4.0
        </a>
      </div>
    </motion.div>
  );
}
