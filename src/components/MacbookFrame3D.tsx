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

import { Suspense, useRef, useEffect } from "react";
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
  const { scene } = useGLTF("/macbook.glb", true) as unknown as {
    scene: THREE.Group;
  };
  const lidRef = useRef<THREE.Object3D | null>(null);
  const baseRotationRef = useRef<number>(0);

  useEffect(() => {
    const lid = scene.getObjectByName(LID_NODE_NAME);
    if (lid) {
      lidRef.current = lid;
      // Capture the lid's authored open-pose rotation so close folds FROM here.
      baseRotationRef.current = lid.rotation.x;
    }
  }, [scene]);

  useFrame(() => {
    const lid = lidRef.current;
    if (!lid) return;
    const t = openValue.get();
    const open = baseRotationRef.current;
    const closed = open + Math.PI / 2;
    const angle = closed + t * (open - closed);
    lid.rotation.x = angle;

    // The lid's local origin sits ~0.382 units in FRONT of the actual
    // hinge (between lid origin and base back edge — discovered via runtime
    // bbox inspection). Without compensation, rotating the lid swings it
    // up into the air. We compute where the hinge would land after rotation
    // and translate the lid to keep the hinge anchored.
    const HINGE_Y = -0.02;
    const HINGE_Z = -0.382;
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const ry = HINGE_Y * c - HINGE_Z * s;
    const rz = HINGE_Y * s + HINGE_Z * c;
    lid.position.set(0, HINGE_Y - ry, HINGE_Z - rz);
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
  // Lid open/close — closed at section edges, open mid-section.
  // 0 = lid lying flat on base, 1 = lid in authored open pose.
  const openValue = useTransform(
    scrollYProgress,
    [0.18, 0.42, 0.58, 0.82],
    [0, 1, 1, 0],
  );

  return (
    <motion.div
      ref={ref}
      style={{ scale, opacity }}
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
            <Center scale={0.0304} position={[0.2, -0.3, 0]}>
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
