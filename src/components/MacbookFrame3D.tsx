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
import { useGLTF, Stage } from "@react-three/drei";
import { motion, useScroll, useTransform } from "framer-motion";
import * as THREE from "three";

interface MacbookFrame3DProps {
  /** Future hook: HTML content to project onto the screen via drei <Html>. */
  children?: React.ReactNode;
}

function Model() {
  // Second arg = true → use Draco decoder (model is Draco-compressed:
  // 9.7MB → 2.86MB after gltf-transform draco)
  const { scene } = useGLTF("/macbook.glb", true) as unknown as {
    scene: THREE.Group;
  };
  return <primitive object={scene} />;
}

useGLTF.preload("/macbook.glb", true);

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
          camera={{ position: [0, 0.6, 8], fov: 24 }}
          gl={{ alpha: true, antialias: true }}
          style={{ background: "transparent" }}
        >
          <Suspense fallback={null}>
            {/* Stage = drei helper. Auto-fits model to camera, sets up
                3-point lighting, contact shadows under model. The HDR
                environment is NOT used as background (Stage handles this
                correctly — only contributes reflections). */}
            <Stage
              adjustCamera={1.8}
              intensity={0.5}
              environment="city"
              shadows={{ type: "contact", opacity: 0.45, blur: 2 }}
            >
              <Model />
            </Stage>
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
