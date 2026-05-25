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
    // Y lowered from -0.625 → -0.69 to kill the mid-rotation gap between
    // lid and base (pivot was sitting above the model's actual hinge axis,
    // so the lid bottom swung upward away from the keyboard during close).
    const hingeWorld = new THREE.Vector3(0.198, -0.69, -0.246);
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
  // 2026-05-24 (round 2, Shamil): lid should OPEN as user scrolls into
  // the section, REACH PEAK when the section is centered in the viewport
  // (reading position), and CLOSE as the user scrolls past in either
  // direction. Previously the lid stayed open forever after first hitting
  // peak, so by the time the user was actually reading, the model had
  // started visually drifting back toward closed.
  //
  // Now: section traverses the FULL viewport (start end → end start),
  // and the open value follows a trapezoid:
  //   0%: closed (section just entering from below)
  //   35%: fully open (plateau begins)
  //   65%: still fully open (plateau ends — reading window)
  //   100%: closed again (section about to exit at top)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const openValue = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    [0, 1, 1, 0],
  );

  return (
    <motion.div
      ref={ref}
      // `relative` so Framer Motion's useScroll({ target: ref }) can
      // measure this element's scroll offsets correctly. Without a
      // non-static position it logs a warning and the offset math falls
      // back to the page level.
      className="relative w-full pointer-events-auto"
    >
      {/* Invisible screen-avoid marker for the Celly auto-positioner.
          When real Erken Systems screenshots eventually project onto
          the laptop's screen, the speech bubble must NOT cover them.
          The wider canvas is still fair game (transparent 3D space)
          so Celly can float around the laptop frame — this rect just
          fences off the screen itself. Position is tuned to where the
          OPEN lid renders (35-65% scroll progress, which is when
          Celly is visible because that's when scrolling stops).
          Shamil 2026-05-24 round 44. */}
      <div
        data-celly-avoid
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          left: "18%",
          top: "10%",
          width: "64%",
          height: "42%",
          // zIndex: -1 to keep DOM-aware avoiders happy without affecting visuals
          zIndex: -1,
        }}
      />
      <div className="aspect-[4/3] md:aspect-[1/1] w-full">
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
            {/* Model lifted up 2026-05-24 (Shamil): was sitting too low,
                keyboard cropped at viewport bottom when section text was
                centered. Y offset -0.375 → 0 brings the whole laptop
                higher into the canvas so it's fully visible alongside the
                section text. ContactShadows lifted to follow. */}
            <Center
              scale={typeof window !== "undefined" && window.innerWidth < 768 ? 0.05 : 0.0304}
              position={typeof window !== "undefined" && window.innerWidth < 768 ? [0.0125, 0, 0] : [0.2, 0, 0]}
            >
              <Model openValue={openValue} />
            </Center>
            <ContactShadows
              position={[0, -0.5, 0]}
              opacity={0.45}
              scale={3}
              blur={1.8}
              far={0.7}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* CC-BY 4.0 attribution REMOVED 2026-05-24 at Shamil's instruction
          (he tried to contact the author to buy a no-attribution license,
          author doesn't respond to messages). UNRESOLVED LICENSING TODO —
          revisit either by paying the author if he becomes reachable, or
          moving the attribution to a dedicated /credits page in the
          footer (CC-BY 4.0 spec allows attribution "reasonable to the
          medium," which on a website means a credits page is acceptable
          per Creative Commons FAQ). Tracked in vault session-log. */}
    </motion.div>
  );
}
