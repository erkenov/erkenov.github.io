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

// Cell-Dragon palette (locked 2026-05-21):
//   sage outer shell, terracotta inner cell, sun-gold dragon, warm cream lighting
const ACCENT = "#7ea687";          // sage — outer dust shell, primary brand
const ACCENT_BRIGHT = "#F2C94C";   // sun gold — dragon particles + graph nodes
const DRAGON_DEEP = "#E89F1F";     // saturated sun gold — dragon trail (reverted from tree-leaf per round 11 feedback)
const CELL_CORE = "#C76B58";       // terracotta red — inner cell base (earthy complement to sage)
const CELL_GLOW = "#E88B7A";       // warmer red — cell emissive (red core glowing brighter from within)
const KEY_LIGHT = "#F5E9CC";       // warm cream directional key light
const AMBIENT_TINT = "#F8F1DE";    // warm ambient (replaces stark white)

/* ------------------------------------------------------------------ */
/* Soft circular sprite — for dust + graph nodes inside the cell       */
/* ------------------------------------------------------------------ */
let _softSprite: THREE.Texture | null = null;
function getSoftSprite(): THREE.Texture | null {
  if (typeof window === "undefined") return null;
  if (_softSprite) return _softSprite;
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.25, "rgba(255,255,255,0.7)");
  gradient.addColorStop(0.5, "rgba(255,255,255,0.3)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  _softSprite = tex;
  return tex;
}

/* ------------------------------------------------------------------ */
/* Leaf-shape sprite — for the dragon (tree leaves blowing in wind).   */
/* Pointed almond / leaf silhouette with soft glow edges + central     */
/* vein hint. Tilted ~25° to suggest blowing direction.                */
/* ------------------------------------------------------------------ */
let _leafSprite: THREE.Texture | null = null;
function getLeafSprite(): THREE.Texture | null {
  if (typeof window === "undefined") return null;
  if (_leafSprite) return _leafSprite;
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.clearRect(0, 0, size, size);

  // Tilt the leaf 25° so all blowing leaves face the same wind direction (stylized)
  ctx.translate(size / 2, size / 2);
  ctx.rotate((25 * Math.PI) / 180);

  // Soft glow edges via shadow
  ctx.shadowBlur = 14;
  ctx.shadowColor = "rgba(255,255,255,0.6)";

  // Main leaf shape — pointed almond
  ctx.fillStyle = "rgba(255,255,255,1)";
  ctx.beginPath();
  const w = 46;   // half length tip-to-tip
  const h = 14;   // half thickness
  ctx.moveTo(-w, 0);
  ctx.bezierCurveTo(-w * 0.45, -h * 1.4, w * 0.45, -h * 1.4, w, 0);
  ctx.bezierCurveTo(w * 0.45, h * 1.4, -w * 0.45, h * 1.4, -w, 0);
  ctx.closePath();
  ctx.fill();

  // Reset shadow, draw central vein darker for leaf detail
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(0,0,0,0.25)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-w * 0.85, 0);
  ctx.lineTo(w * 0.85, 0);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  _leafSprite = tex;
  return tex;
}

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
  yRef: React.MutableRefObject<number>;
  scaleRef: React.MutableRefObject<number>;
  /** 0..1 — opacity of the cohesive sphere (drops during transitions) */
  sphereOpacityRef: React.MutableRefObject<number>;
  /** 0..1 — opacity of the downward stream layer (peaks during transitions) */
  streamOpacityRef: React.MutableRefObject<number>;
  /** When true, the inner red glowing core mesh is hidden so a 2D overlay
   *  (Sally) can visually take its place. The outer dust + nodes stay. */
  hideInnerCore?: boolean;
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
  prevYRef,
  nextYRef,
  transitionProgressRef,
  segProgressRef,
  straightTrail = false,
}: {
  streamOpacityRef: React.MutableRefObject<number>;
  prevXRef: React.MutableRefObject<number>;
  nextXRef: React.MutableRefObject<number>;
  prevYRef: React.MutableRefObject<number>;
  nextYRef: React.MutableRefObject<number>;
  /** 0..1 — triangle envelope (peak in middle of segment) */
  transitionProgressRef: React.MutableRefObject<number>;
  /** 0..1 raw segment progress (0 = at prev cell, 1 = at next cell) */
  segProgressRef: React.MutableRefObject<number>;
  /** When true, dragon is drawn as a straight line between prev and next
   *  (no bend, no sin arc). Used for the inverted "Celly drives" mode
   *  where curves don't fit Shamil's pen-drawing mental model. */
  straightTrail?: boolean;
}) {
  const ref = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);
  const COUNT = 700;
  const positions = useMemo(() => new Float32Array(COUNT * 3), []);
  const sprite = getSoftSprite();

  // Per-particle COLORS — earthy palette: sage + sun-gold + olive
  const colors = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    const cSage = new THREE.Color("#7ea687");
    const cGold = new THREE.Color("#E89F1F");
    const cOlive = new THREE.Color("#A8B86C");  // earthy yellow-green
    for (let i = 0; i < COUNT; i++) {
      const r = Math.random();
      const c = r < 0.42 ? cSage : r < 0.82 ? cGold : cOlive;
      arr[i * 3]     = c.r;
      arr[i * 3 + 1] = c.g;
      arr[i * 3 + 2] = c.b;
    }
    return arr;
  }, []);

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
    const prevY = prevYRef.current;
    const nextY = nextYRef.current;
    const trans = transitionProgressRef.current;  // 0 at section center, 1 mid-segment
    const segP = segProgressRef.current;          // 0..1 raw segment progress

    // Default dragon body extent across the whole segment.
    //   At segP=0:   tail=head=0  → all particles bunched AT PREV cell
    //   At segP=0.5: tail=0, head=1 → dragon fully extended
    //   At segP=1:   tail=head=1  → all particles bunched AT NEXT cell (absorbed!)
    const tail = Math.max(0, 2 * segP - 1);
    const head = Math.min(1, 2 * segP);


    // Dragon path shape: horizontal motion + vertical sin swoop.
    // Mobile uses same logic as desktop (cells slightly L/R, dragon arcs
    // side-to-side with a downward sin loop).
    const isMobileNow = typeof window !== "undefined" && window.innerWidth < 768;
    const BEND = 0.55;
    const LOOP_HEIGHT = isMobileNow ? 0.7 : 0.9;

    for (let i = 0; i < COUNT; i++) {
      const localT = params[i * 2];           // 0..1, position-along-dragon offset
      const phase = params[i * 2 + 1];

      // Particle u: maps localT to [tail, head] of the dragon body extent.
      const u = tail + localT * (head - tail);

      // Base X interpolation + (optionally) center bend
      const linearX = prevX + (nextX - prevX) * u;
      const bendStrength = u * (1 - u) * 4;
      const bendAmount = straightTrail ? 0 : -linearX * bendStrength * BEND;
      const x = linearX + bendAmount;

      // Y position: linear lerp + (optionally) downward sin arc
      const linearY = prevY + (nextY - prevY) * u;
      const arcOffset = straightTrail ? 0 : Math.sin(u * Math.PI) * LOOP_HEIGHT * 0.75;
      const y = linearY - arcOffset;

      // Per-particle wiggle for organic feel (scale by trail extent so it doesn't wiggle when bunched)
      const extent = head - tail;
      const wiggle = Math.sin(t * 3 + phase + u * 6) * 0.06 * extent;
      // Z depth wobble — also scaled by extent so converged particles aren't drifting in z
      const zWobble = Math.sin(phase + t * 1.2 + u * 4) * 0.25 * extent;

      pos[i * 3]     = x + wiggle;
      pos[i * 3 + 1] = y + wiggle * 0.4;
      pos[i * 3 + 2] = zWobble;
    }
    pa.needsUpdate = true;

    // Direct opacity assignment — no smoothing (smoothing made dragon
    // barely visible during fast scrolls)
    matRef.current.opacity = Math.min(1, streamOpacityRef.current);
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={COUNT} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} count={COUNT} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        vertexColors
        size={0.04}
        sizeAttenuation
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.NormalBlending}
        map={sprite}
        alphaTest={0.01}
      />
    </points>
  );
}

function Sphere({ pulseRef, xRef, yRef, scaleRef, sphereOpacityRef, streamOpacityRef, hideInnerCore }: SphereInnerProps) {
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
  const glowMatRef = useRef<THREE.Material>(null);

  // Per-particle earthy palette for the cell dust shell (matches dragon palette)
  const dustColors = useRef<Float32Array | null>(null);
  if (!dustColors.current) {
    const arr = new Float32Array(1500 * 3);
    const cSage = new THREE.Color("#7ea687");
    const cGold = new THREE.Color("#E89F1F");
    const cOlive = new THREE.Color("#A8B86C");
    for (let i = 0; i < 1500; i++) {
      const r = Math.random();
      // dust shell is mostly sage with golden / olive flecks (60/25/15)
      const c = r < 0.60 ? cSage : r < 0.85 ? cGold : cOlive;
      arr[i * 3]     = c.r;
      arr[i * 3 + 1] = c.g;
      arr[i * 3 + 2] = c.b;
    }
    dustColors.current = arr;
  }

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

    // Whole group: scroll-driven position + scale + slow rotation
    if (groupRef.current) {
      groupRef.current.position.x = xRef.current;
      groupRef.current.position.y = yRef.current;
      groupRef.current.scale.setScalar(sphereScale);
      groupRef.current.rotation.y = t * 0.08;
      groupRef.current.rotation.x = Math.sin(t * 0.05) * 0.12;
    }

    // Sphere opacity + size — dust/nodes are BIG when cell is peaked, SMALL when transforming to dragon
    const o = sphereOpacityRef.current;
    if (dustMatRef.current) {
      dustMatRef.current.opacity = 0.85 * o;
      // size ranges 0.022 (transforming) -> 0.05 (fully peaked)
      dustMatRef.current.size = 0.022 + o * 0.028;
    }
    if (nodeMatRef.current) {
      nodeMatRef.current.opacity = 1.0 * o;
      // graph nodes bigger when cell is fully formed
      nodeMatRef.current.size = 0.035 + o * 0.025;
    }
    if (lineMatRef.current) lineMatRef.current.opacity = 0;
    if (glowMatRef.current) {
      // Hide the inner red core entirely when a 2D overlay (Sally) is
      // replacing it visually. Outer dust + nodes stay untouched.
      (glowMatRef.current as THREE.MeshStandardMaterial).opacity = hideInnerCore ? 0 : 0.95 * o;
    }
  });

  return (
    <group ref={groupRef}>
      {/* INNER CELL — terracotta red core glowing warm from within */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.55, 64, 64]} />
        <meshStandardMaterial
          ref={glowMatRef as unknown as React.RefObject<THREE.MeshStandardMaterial>}
          color={CELL_CORE}
          roughness={0.42}
          metalness={0.08}
          emissive={CELL_GLOW}
          emissiveIntensity={0.7}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Outer dust cloud — earthy multi-color palette via vertex colors */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dustBase.slice(), 3]} count={dustBase.length / 3} array={dustBase.slice()} itemSize={3} />
          <bufferAttribute attach="attributes-color" args={[dustColors.current!, 3]} count={1500} array={dustColors.current!} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          ref={dustMatRef}
          vertexColors
          size={0.018}
          sizeAttenuation
          transparent
          opacity={0.7}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          map={getSoftSprite()}
          alphaTest={0.01}
        />
      </points>

      {/* Graph nodes (bright accents) — also soft sprites */}
      <points ref={nodesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodeBase.slice(), 3]} count={nodeBase.length / 3} array={nodeBase.slice()} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          ref={nodeMatRef}
          color={ACCENT_BRIGHT}
          size={0.035}
          sizeAttenuation
          transparent
          opacity={1}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          map={getSoftSprite()}
          alphaTest={0.01}
        />
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
  /** Optional callback fired every onUpdate with the current cell position +
   *  scale + opacity, plus camera params needed to project world→screen.
   *  Used by external 2D overlays (e.g. CellDragonSprite) to track the cell.
   *  Fires at 60fps — keep handler cheap (write directly to a DOM ref,
   *  don't setState). */
  onCellPositionChange?: (pos: CellPositionInfo) => void;
  /** Fired once on mount with the internal position + shape + trail refs.
   *  External code (the page) writes to these to drive cell behavior. */
  onCellRefsReady?: (refs: {
    xRef: React.MutableRefObject<number>;
    yRef: React.MutableRefObject<number>;
    scaleRef: React.MutableRefObject<number>;
    sphereOpacityRef: React.MutableRefObject<number>;
    streamOpacityRef: React.MutableRefObject<number>;
    prevXRef: React.MutableRefObject<number>;
    prevYRef: React.MutableRefObject<number>;
    nextXRef: React.MutableRefObject<number>;
    nextYRef: React.MutableRefObject<number>;
    transitionProgressRef: React.MutableRefObject<number>;
    segProgressRef: React.MutableRefObject<number>;
  }) => void;
}

export type CellPositionInfo = {
  worldX: number;
  worldY: number;
  scale: number;
  opacity: number;
  cameraZ: number;
  fovDeg: number;
  isMobile: boolean;
  /** Currently "settled" section index (0..sectionCount-1). During a
   *  segment transition this is the section the cell is heading to once
   *  it crosses the segment midpoint, otherwise the section it's peaked at. */
  sectionIndex: number;
};

export function SphereScrollStage({
  children,
  sectionCount = 5,
  onCellPositionChange,
  onCellRefsReady,
  hideInnerCellCore = false,
  sectionYOverrides,
  disableScrollDrivenShape = false,
  straightTrail = false,
}: StageProps & {
  sectionCount?: number;
  hideInnerCellCore?: boolean;
  sectionYOverrides?: Record<number, number>;
  disableScrollDrivenShape?: boolean;
  /** Pass through to TrailLayer — straight dragon (no bend, no arc). */
  straightTrail?: boolean;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef(0);
  const xRef = useRef(-0.9);             // start LEFT (section 0 is even -> left)
  const yRef = useRef(0);
  const scaleRef = useRef(0.9);
  const sphereOpacityRef = useRef(1);    // start FULLY visible
  const streamOpacityRef = useRef(0);
  // For snake trail: where sphere WAS and where it's going (X + Y so dragon
  // works on mobile vertical layout as well as desktop horizontal layout)
  const prevXRef = useRef(-0.9);
  const nextXRef = useRef(0.9);
  const prevYRef = useRef(0);
  const nextYRef = useRef(0);
  const transitionProgressRef = useRef(0);
  const segProgressRef = useRef(0);
  const [mounted, setMounted] = useState(false);
  // Expose position refs to the parent on mount so external code can
  // force the cell to a specific world position. Used by the page to
  // make the cell follow Celly's auto-positioned spot on scroll stop.
  useEffect(() => {
    if (onCellRefsReady) {
      onCellRefsReady({
        xRef,
        yRef,
        scaleRef,
        sphereOpacityRef,
        streamOpacityRef,
        prevXRef,
        prevYRef,
        nextXRef,
        nextYRef,
        transitionProgressRef,
        segProgressRef,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Lazy initializer so the very first render uses the correct viewport class.
  // Without this, isMobile started false and the ScrollTrigger captured the
  // desktop sectionX in its closure — cell drifted off-screen on mobile until
  // the first resize.
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );

  useEffect(() => {
    setMounted(true);
    const check = () => {
      const mob = window.innerWidth < 768;
      setIsMobile(mob);
      // Seed initial position so the first frame matches the scroll callback's
      // section 0 home position — no "center then snap left" flicker on first scroll.
      xRef.current = mob ? -0.3 : -0.9;
      yRef.current = 0;
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // sectionX/sectionY positions are computed INSIDE onUpdate (below) so they
  // always read the current window width — no closure-staleness from SSR
  // capturing isMobile=false on the server.

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
          // Read viewport fresh — closure-free so it works under SSR initial render
          const mob = typeof window !== "undefined" && window.innerWidth < 768;
          // Mobile: same pattern as desktop but with smaller L/R offset to fit
          // narrow viewport. Cells alternate slightly side-to-side, dragon
          // moves horizontally between them with the same sin-arc loop.
          const sectionX = (idx: number) =>
            mob
              ? (idx % 2 === 0 ? -0.3 : 0.3)
              : (idx % 2 === 0 ? -0.9 : 0.9);
          // Default lift: cell-dragon lives in upper-third of viewport
          // (Y=+0.4). Per-section override available via sectionYOverrides
          // prop — sections that need the cell+cloud somewhere else (e.g.
          // bottom-right for Step 1 Lead Gen) supply their own Y here so
          // Celly and the dust cloud stay together.
          const sectionY = (idx: number) =>
            sectionYOverrides?.[idx] ?? 0.4;
          // SEGMENT-BETWEEN-CENTERS MODEL:
          // Section centers at p = (i+0.5)/N.
          // For each segment between center i and center i+1, the dragon flies
          // from sectionX(i) toward sectionX(i+1) — direction CONSTANT through
          // the segment (no flip mid-segment).
          //
          // Per segment progress segP (0..1):
          //   segP < 0.10: still at section i, sphere PEAKED at sectionX(i)
          //   0.10 - 0.50: sphere compresses to dot at sectionX(i), dragon extends out
          //   0.50: dragon fully extended midway, sphere invisible (just the dot at far ends)
          //   0.50 - 0.90: dragon compresses to dot at sectionX(i+1), sphere reforming
          //   segP > 0.90: sphere PEAKED at sectionX(i+1)

          // Spread centers to page edges so section 0's peak is at p=0
          // and section N-1's peak is at p=1 — first scroll triggers transformation immediately.
          const firstCenter = 0;
          const lastCenter = 1;
          const segmentSpan = 1 / (N - 1);   // length of one segment in p-units

          let sphereScale = 1;
          let sphereOpacity = 1;
          let trans = 0;
          let xPos = sectionX(0);
          let fromX = sectionX(0);
          let toX = sectionX(0);

          let currentSegP = 0;
          let fromY = 0;
          let toY = 0;
          if (p <= 0) {
            // Page top: peaked at section 0
            sphereScale = 1;
            sphereOpacity = 1;
            xPos = sectionX(0);
            fromX = toX = xPos;
            fromY = toY = sectionY(0);
          } else if (p >= 1) {
            // Page bottom: peaked at section N-1
            sphereScale = 1;
            sphereOpacity = 1;
            xPos = sectionX(N - 1);
            fromX = toX = xPos;
            fromY = toY = sectionY(N - 1);
          } else {
            // Centers now at i / (N-1). Find which segment we're in.
            let i = Math.floor(p / segmentSpan);
            if (i < 0) i = 0;
            if (i > N - 2) i = N - 2;
            const ci = i * segmentSpan;
            const segP = (p - ci) / segmentSpan;   // 0..1 across this segment
            currentSegP = segP;

            // Direction is CONSTANT through this segment — from i to i+1
            fromX = sectionX(i);
            toX = sectionX(i + 1);
            fromY = sectionY(i);
            toY = sectionY(i + 1);

            // Peak bands WIDENED 2026-05-24 round 5 (Shamil): the cell
            // should be at FULL EXPANSION for most of each section so
            // visitors who stop reading see Celly fully grown — not
            // mid-transition. 0.25/0.75 means the first 25% and last 25%
            // of each segment are "peaked" (cell fully expanded), and
            // only the middle 50% is dragon-trail transition.
            const peakLeftEnd = 0.25;
            const peakRightStart = 0.75;

            if (segP < peakLeftEnd) {
              // Still at section i, sphere peaked
              sphereScale = 1;
              sphereOpacity = 1;
              xPos = sectionX(i);
              trans = 0;
            } else if (segP > peakRightStart) {
              // Arrived at section i+1, sphere peaked
              sphereScale = 1;
              sphereOpacity = 1;
              xPos = sectionX(i + 1);
              trans = 0;
            } else {
              // Transition: sphere shrinks AGGRESSIVELY (higher exponent), giving
              // dragon a wider visible window in the middle of the segment.
              const tNorm = (segP - peakLeftEnd) / (peakRightStart - peakLeftEnd);  // 0..1
              const triangle = 1 - Math.abs(tNorm - 0.5) * 2;     // 0 at ends, 1 at middle
              const compressed = 1 - triangle;                     // 1 at ends, 0 at middle
              // Steeper exponent on shrink (was 1.2 / 0.9) — cell collapses fast
              sphereScale = Math.max(0.0, Math.pow(compressed, 2.4));
              sphereOpacity = Math.max(0.0, Math.pow(compressed, 1.8));
              // Dragon visibility widened: square-root makes triangle plateau-ish near peak
              trans = Math.min(1, Math.sqrt(triangle) * 1.05);
              xPos = tNorm < 0.5 ? sectionX(i) : sectionX(i + 1);
            }
          }

          // y position: SAME pattern as x — stay at section i's y while sphere
          // shrinks (first half of segment), snap to section i+1's y as sphere
          // expands at destination (second half). The "jump" at segP=0.5 is
          // invisible because sphereScale is ~0 at that moment.
          //
          // Previously used smoothstep which made the cell visibly LINGER near
          // its starting y as it expanded — looked like it reformed at the wrong
          // side. Hard switch matches user mental model: cell shrinks where it
          // was, cell appears where it's going.
          let yPos = 0;
          if (p <= 0) yPos = sectionY(0);
          else if (p >= 1) yPos = sectionY(N - 1);
          else {
            let i2 = Math.floor(p / segmentSpan);
            if (i2 < 0) i2 = 0;
            if (i2 > N - 2) i2 = N - 2;
            const ci2 = i2 * segmentSpan;
            const segP2 = (p - ci2) / segmentSpan;
            yPos = segP2 < 0.5 ? sectionY(i2) : sectionY(i2 + 1);
          }

          // Shape writes split into two groups based on
          // disableScrollDrivenShape:
          //  - CELL shape (scale/opacity/position): always-page when
          //    disabled, scroll-driven otherwise.
          //  - TRAIL (stream/transition/prev/next): always scroll-driven
          //    so the dragon trail animation still plays during scroll
          //    even with the inversion enabled. Shamil round 19 part 3.
          const finalScale = sphereScale * (0.85 + Math.sin(p * Math.PI) * 0.2);
          // All shape + trail writes gated together now (Shamil round 20):
          // page owns the cell AND the trail completely when in inversion
          // mode. The old "always update trail" approach made the scroll
          // dragon flicker on during scroll, fighting the page's animated
          // dragon-on-stop.
          if (!disableScrollDrivenShape) {
            sphereOpacityRef.current = sphereOpacity;
            xRef.current = xPos;
            yRef.current = yPos;
            scaleRef.current = finalScale;
            pulseRef.current = sphereOpacity * 0.5;
            transitionProgressRef.current = trans;
            segProgressRef.current = currentSegP;
            streamOpacityRef.current = trans;
            prevXRef.current = fromX;
            nextXRef.current = toX;
            prevYRef.current = fromY;
            nextYRef.current = toY;
          }

          // External overlay hook — fires the cell-dragon's current world
          // position + scale + opacity so a 2D sprite can be positioned ON
          // TOP of the 3D cell. Camera params included so the caller can
          // project world coords to screen.
          if (onCellPositionChange) {
            // Section index: which scene the cell is "currently in" by xPos.
            // During the first half of a segment xPos = sectionX(i) (the
            // section it's leaving), second half xPos = sectionX(i+1)
            // (the section it's arriving at).
            let settledIdx = 0;
            if (p <= 0) settledIdx = 0;
            else if (p >= 1) settledIdx = N - 1;
            else {
              let i = Math.floor(p / segmentSpan);
              if (i < 0) i = 0;
              if (i > N - 2) i = N - 2;
              const ci = i * segmentSpan;
              const segP = (p - ci) / segmentSpan;
              settledIdx = segP < 0.5 ? i : i + 1;
            }
            onCellPositionChange({
              worldX: xPos,
              worldY: yPos,
              scale: finalScale,
              opacity: sphereOpacity,
              cameraZ: mob ? 2.2 : 2.9,
              fovDeg: 50,
              isMobile: mob,
              sectionIndex: settledIdx,
            });
          }
        },
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, { scope: stageRef, dependencies: [isMobile, sectionCount] });

  return (
    <div ref={stageRef} className="relative">
      {/* Fixed canvas — z-45 puts cell-dragon IN FRONT of Celly (z-40)
          so the dust visually SURROUNDS her body. Particles are mostly
          translucent so Celly's face still reads through the shimmer.
          Bubble at z-50 stays above the dust. (Shamil 2026-05-24 round 19.)
          pointer-events-none keeps clicks passing through. */}
      <div className="pointer-events-none fixed inset-0 z-[45]">
        {mounted && (
          <Canvas
            camera={{ position: [0, 0, isMobile ? 2.2 : 2.9], fov: 50 }}
            gl={{ alpha: true, antialias: true }}
            style={{ background: "transparent", pointerEvents: "none" }}
          >
            <ambientLight intensity={0.45} color={AMBIENT_TINT} />
            <directionalLight position={[2, 3, 4]} intensity={1.2} color={KEY_LIGHT} />
            <directionalLight position={[-3, -1, 2]} intensity={0.6} color={ACCENT} />
            <Sphere
              pulseRef={pulseRef}
              xRef={xRef}
              yRef={yRef}
              scaleRef={scaleRef}
              sphereOpacityRef={sphereOpacityRef}
              streamOpacityRef={streamOpacityRef}
              hideInnerCore={hideInnerCellCore}
            />
            <TrailLayer
              streamOpacityRef={streamOpacityRef}
              prevXRef={prevXRef}
              nextXRef={nextXRef}
              prevYRef={prevYRef}
              nextYRef={nextYRef}
              transitionProgressRef={transitionProgressRef}
              segProgressRef={segProgressRef}
              straightTrail={straightTrail}
            />
          </Canvas>
        )}
      </div>

      {/* Foreground sections — no z-index wrapper so per-element z values
          can interleave with the cell-dragon canvas above. Text gets
          z-30 inside each Section so it floats in FRONT of the cell;
          laptop media stays at default z which keeps it BEHIND the cell. */}
      <div className="relative">{children}</div>
    </div>
  );
}
