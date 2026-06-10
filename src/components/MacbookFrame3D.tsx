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

import { Suspense, useRef, useEffect, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows, Center } from "@react-three/drei";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import * as THREE from "three";
import { LaptopScreenDashboard } from "@/components/LaptopScreenDashboard";

/* ============================================================
   Perspective-warp helpers — map the flat dashboard rectangle onto the
   laptop screen's FOUR corners via a CSS matrix3d homography (the
   franklinta.com technique). Unlike rotateX, this lets us pin each corner
   independently to an exact point on the 3D screen. Corners are expressed
   as fractions of the laptop wrapper box and tuned visually.
   ============================================================ */
function adjugate(m: number[]) {
  return [
    m[4] * m[8] - m[5] * m[7], m[2] * m[7] - m[1] * m[8], m[1] * m[5] - m[2] * m[4],
    m[5] * m[6] - m[3] * m[8], m[0] * m[8] - m[2] * m[6], m[2] * m[3] - m[0] * m[5],
    m[3] * m[7] - m[4] * m[6], m[1] * m[6] - m[0] * m[7], m[0] * m[4] - m[1] * m[3],
  ];
}
function multMM(a: number[], b: number[]) {
  const r = new Array(9);
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++) {
      let s = 0;
      for (let k = 0; k < 3; k++) s += a[3 * i + k] * b[3 * k + j];
      r[3 * i + j] = s;
    }
  return r;
}
function multMV(m: number[], v: number[]) {
  return [
    m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
    m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
    m[6] * v[0] + m[7] * v[1] + m[8] * v[2],
  ];
}
function basisToPoints(p: number[]) {
  // p = [x1,y1, x2,y2, x3,y3, x4,y4]
  const m = [p[0], p[2], p[4], p[1], p[3], p[5], 1, 1, 1];
  const v = multMV(adjugate(m), [p[6], p[7], 1]);
  return multMM(m, [v[0], 0, 0, 0, v[1], 0, 0, 0, v[2]]);
}
/** matrix3d string mapping the element box (w×h) → 4 dest points {tl,tr,br,bl}
 *  given relative to the element's own top-left (transform-origin 0 0). */
function quadMatrix3d(
  w: number,
  h: number,
  c: { tl: number[]; tr: number[]; br: number[]; bl: number[] },
) {
  // src order TL,TR,BL,BR  →  dst order TL,TR,BL,BR
  const s = basisToPoints([0, 0, w, 0, 0, h, w, h]);
  const d = basisToPoints([
    c.tl[0], c.tl[1], c.tr[0], c.tr[1], c.bl[0], c.bl[1], c.br[0], c.br[1],
  ]);
  const t = multMM(d, adjugate(s));
  for (let i = 0; i < 9; i++) t[i] = t[i] / t[8];
  const m = [
    t[0], t[3], 0, t[6],
    t[1], t[4], 0, t[7],
    0, 0, 1, 0,
    t[2], t[5], 0, t[8],
  ];
  return `matrix3d(${m.join(",")})`;
}

/* Laptop SCREEN corners as fractions of the laptop wrapper box.
   Tuned visually so the dashboard pins to the open lid's glass. */
const SCREEN_CORNERS = {
  tl: [0.338, 0.300],
  tr: [0.862, 0.300],
  br: [0.866, 0.642],
  bl: [0.336, 0.642],
} as const;

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
    // Y history:
    //  -0.625 → small mid-rotation gap between lid and base
    //  -0.69  → killed the gap BUT hinge swung DOWN through the base
    //           on close (Shamil 2026-05-25 evening "hinge goes down")
    //  -0.625 → restored. The "gap" was less ugly than the through-base
    //           swing. Pair with reduced rotation angle below to avoid
    //           over-closing past flat-onto-keyboard.
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
    // Lid animation FROZEN at fully-open (Shamil 2026-05-25 late evening):
    // hinge pivot kept slipping no matter the Y offset or rotation angle.
    // Static open pose looks clean. Real screenshot swap planned as
    // follow-up. openValue still threaded through in case we re-enable
    // later.
    void openValue;
    pivot.rotation.x = 0;
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
    // Closing starts at the same 0.65 mark but finishes by 0.80 instead
    // of 1.0 — the CLOSE itself happens faster, the lid is already shut
    // before the section exits the viewport (Shamil 2026-05-25 evening
    // "close faster not sooner"). Outputs clamp past 0.80 so lid stays
    // closed through the rest of the section exit.
    [0, 0.35, 0.65, 0.80],
    [0, 1, 1, 0],
  );

  // Compute the matrix3d that warps the dashboard onto the screen's 4 corners.
  // Recomputed on mount + whenever the laptop wrapper resizes (responsive).
  const [dashStyle, setDashStyle] = useState<React.CSSProperties | null>(null);
  useEffect(() => {
    const wrap = ref.current;
    if (!wrap) return;
    const compute = () => {
      const W = wrap.clientWidth;
      const H = wrap.clientHeight;
      if (!W || !H) return;
      const c = SCREEN_CORNERS;
      const pts = {
        tl: [c.tl[0] * W, c.tl[1] * H],
        tr: [c.tr[0] * W, c.tr[1] * H],
        br: [c.br[0] * W, c.br[1] * H],
        bl: [c.bl[0] * W, c.bl[1] * H],
      };
      const xs = [pts.tl[0], pts.tr[0], pts.br[0], pts.bl[0]];
      const ys = [pts.tl[1], pts.tr[1], pts.br[1], pts.bl[1]];
      const minX = Math.min(...xs);
      const minY = Math.min(...ys);
      const bw = Math.max(...xs) - minX;
      const bh = Math.max(...ys) - minY;
      const rel = {
        tl: [pts.tl[0] - minX, pts.tl[1] - minY],
        tr: [pts.tr[0] - minX, pts.tr[1] - minY],
        br: [pts.br[0] - minX, pts.br[1] - minY],
        bl: [pts.bl[0] - minX, pts.bl[1] - minY],
      };
      setDashStyle({
        position: "absolute",
        left: minX,
        top: minY,
        width: bw,
        height: bh,
        transform: quadMatrix3d(bw, bh, rel),
        transformOrigin: "0 0",
      });
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

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
      {/* Live control-panel dashboard projected onto the laptop screen.
          The lid is frozen fully open (static pose), so a fixed CSS overlay
          aligns reliably with the screen rectangle. Position values mirror
          the screen-avoid marker above and are tuned visually. A small
          rotateX matches the open screen's backward tilt; perspective on the
          wrapper gives it depth so it reads as a screen, not a sticker.
          pointer-events-none — it's a visual, the section copy carries the
          message. Hidden on mobile (laptop renders too small to be legible). */}
      {dashStyle && (
        <div
          aria-hidden="true"
          className="hidden md:block pointer-events-none z-10"
          style={dashStyle}
        >
          <div
            className="w-full h-full overflow-hidden"
            style={{
              borderRadius: "12px 12px 6px 6px",
              boxShadow:
                "0 0 0 1px rgba(0,0,0,0.45), 0 2px 16px rgba(0,0,0,0.4)",
            }}
          >
            <LaptopScreenDashboard />
          </div>
        </div>
      )}

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
