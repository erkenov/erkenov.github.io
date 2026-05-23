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

import { Suspense, useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows, Center } from "@react-three/drei";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import * as THREE from "three";

interface MacbookFrame3DProps {
  /** Future hook: HTML content to project onto the screen via drei <Html>. */
  children?: React.ReactNode;
}

/** Name of the lid mesh group in the jackbaeten MacBook M3 model.
 *  Discovered via runtime inspection — contains the 18 child meshes
 *  (screen, bezel, camera notch). */
const LID_NODE_NAME = "VCQqxpxkUlzqcJI_62";

function Model({ openValue }: { openValue: MotionValue<number> }) {
  const { scene: sharedScene } = useGLTF("/macbook.glb", true) as unknown as {
    scene: THREE.Group;
  };
  // Clone the scene so each MacbookFrame3D instance has its own copy and can
  // animate its lid independently (useGLTF caches and returns the SAME scene
  // object across instances, so without cloning all laptops would share one
  // lid).
  const scene = useMemo(() => sharedScene.clone(true), [sharedScene]);
  const pivotRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const lid = scene.getObjectByName(LID_NODE_NAME);
    if (!lid || !lid.parent) return;
    // Already wrapped on THIS clone? Skip.
    if (lid.parent.userData.__macbookHingeWrapped) return;
    const lidParent = lid.parent;

    // Hinge in WORLD coords (measured via runtime inspection):
    //   (0.198, -0.649, -0.246) — base back edge / lid bottom edge
    const hingeWorld = new THREE.Vector3(0.198, -0.625, -0.246);
    // Convert to lid's parent local frame so the pivot sits at the hinge.
    const hingeInParent = lidParent.worldToLocal(hingeWorld.clone());

    const lidLocalPos = lid.position.clone();
    const pivot = new THREE.Group();
    pivot.position.copy(hingeInParent);

    // Re-parent lid under pivot, offset so its world position stays the same.
    lidParent.remove(lid);
    lid.position.copy(lidLocalPos).sub(hingeInParent);
    pivot.add(lid);
    lidParent.add(pivot);
    lidParent.userData.__macbookHingeWrapped = true;

    pivotRef.current = pivot;
  }, [scene]);

  useFrame(() => {
    const pivot = pivotRef.current;
    if (!pivot) return;
    // openValue 0..1 → pivot rotation (full-closed)..0
    // Closed needs >90° because authored open pose leans back slightly;
    // ~110° folds the lid flat onto the keyboard.
    const t = openValue.get();
    pivot.rotation.x = (1 - t) * (Math.PI * 0.612);
  });

  return <primitive object={scene} rotation={[0, -0.010, 0]} />;
}

useGLTF.preload("/macbook.glb", true);

export function MacbookFrame3D({ children: _children }: MacbookFrame3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Scene 5 is the LAST section. Shamil's spec (2026-05-23):
  //  - Fully OPEN at the bottom of the page (= max scroll)
  //  - Closes as user scrolls UP toward Scene 4
  //  - No "closing on the way out" — there's no out, this is the end.
  const openValue = useTransform(
    scrollYProgress,
    [0.4, 0.55],
    [0, 1],
  );

  return (
    <motion.div
      ref={ref}
      className="w-full pointer-events-auto"
    >
      <div className="aspect-[1/1] w-full">
        <Canvas
          camera={{ position: [0, 0.4, 3.2], fov: 32 }}
          gl={{ alpha: true, antialias: true }}
          style={{ background: "transparent" }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} color="#F8F1DE" />
            <directionalLight
              position={[3, 4, 5]}
              intensity={1.1}
              color="#F5E9CC"
            />
            <directionalLight
              position={[-4, 1, 2]}
              intensity={0.4}
              color="#7ea687"
            />
            <Environment preset="city" background={false} />
            {/* Center auto-positions model at origin. Scale chosen by trial
                to fit the laptop comfortably in the canvas viewport with
                breathing room around it. */}
            <Center scale={0.0304} position={[0.2, -0.375, 0]}>
              <Model openValue={openValue} />
            </Center>
            <ContactShadows
              position={[0, -0.85, 0]}
              opacity={0.45}
              scale={3}
              blur={1.8}
              far={0.7}
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
