"use client";

/**
 * v6 preview — extends /sphere-preview with:
 *   - Lead Capture scene now uses Apple Cards (replaces funnel SVG)
 *   - NEW "Built for your industry" scene with 16 vertical tiles
 *   - NEW dashboard modules carousel below the MacBook
 *   - Keap-style disarming one-liner added to the hero
 *   - "Replaces..." copy pattern on every card
 *   - CellDragonSprite overlays the 3D cell-dragon: face+limbs tracks the
 *     actual cell position as it transforms/moves through scroll
 *
 * Original at /sphere-preview is unchanged. Visit http://localhost:3000/preview-v6
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { SphereScrollStage, type CellPositionInfo } from "@/components/SphereScrollStage";
import { Scene1IntroVideo } from "@/components/Scene1IntroVideo";
import { Scene2Channels } from "@/components/Scene2Channels";
import { Scene3LeadCaptureCarousel } from "@/components/Scene3LeadCaptureCarousel";
import { Scene4LeadMgmtCarousel } from "@/components/Scene4LeadMgmtCarousel";
import { Scene5ControlPanelCarousel } from "@/components/Scene5ControlPanelCarousel";
import { SceneIndustriesCarousel } from "@/components/SceneIndustriesCarousel";
import { CellDragonSprite } from "@/components/CellDragonSprite";

const SECTIONS = [
  {
    side: "left" as const,
    kicker: "Erken Systems",
    headline: "Full-spectrum business systems, with AI inside.",
    body: "If you can answer your phone, you can run an Erken system. Every business runs the same pipeline — leads come in, get captured, get tracked, get reported on. I build all four steps — bundled as one connected system, or piece by piece. Pick what you're missing. Workflow automation is the wiring between them. One operator. Any business.",
    cta: "Show the demo",
  },
  {
    side: "right" as const,
    kicker: "Step 1 · Lead generation",
    headline: "Where your next ten customers come from.",
    body: "Your channel, my approach. Google Maps scraping for local businesses. Cold email at scale. AI voice agent that runs outbound calls — qualifies, pitches, books. Meta Business AI agents on Instagram and Facebook ads. LinkedIn outreach when the work is white-collar. Every method ends the same way — leads land structured, ready for the next step.",
  },
  {
    side: "left" as const,
    kicker: "Step 2 · Lead capture",
    headline: "Every channel answered.",
    body: "Your phone, your inbox, your DMs, your forms — all wired into one pipeline. The AI voice receptionist picks up in two rings. The web chat books appointments. WhatsApp and Instagram DMs route through the same flow. Missed calls trigger an instant text-back. Leads can come from anywhere — they all land in one place.",
  },
  {
    side: "right" as const,
    kicker: "Step 3 · Lead management",
    headline: "Every lead tracked, every follow-up automated.",
    body: "Your branded CRM, your pipeline, your automation — all in one place. Leads come in, get scored, get routed, get followed up — no manual touchpoints. Calendar, SMS, email, funnels, integrations to your tools. The platform sets up before you log in, so you don't learn anything — you just use it.",
  },
  {
    side: "left" as const,
    kicker: "Step 4 · The control panel",
    headline: "Your whole operation, one screen.",
    body: "Calls, chats, forms, emails, deals — all visible in one dashboard. Workflow automation runs underneath everything, moving data between tools without you touching a thing. You see exactly where every customer is. Your operation runs. You read the dashboard.",
  },
];
// Note (2026-05-24): "Built for your industry" used to live in this array
// at index 4 between Lead Management and Control Panel. Shamil moved it
// BELOW Step 4 so the step numbering 1→2→3→4 stays uninterrupted. It now
// renders as a full-width section after the SphereScrollStage's main
// L/R-alternating sections — see JSX below.

type SectionProps = typeof SECTIONS[number] & {
  media?: React.ReactNode;
  /** Full wrapper className for the absolute media container. Default is
   *  set for the 3D MacBook (large transparent canvas extending past the
   *  section). Compact HTML media (carousel/tabs) should override with a
   *  tighter wrapper that sits within the section bounds. */
  mediaWrapperClassName?: string;
  /** Whether the media wrapper should mark itself as a Celly-avoid zone.
   *  Default true (compact opaque media like cards/carousels need it).
   *  Set false for sparse 3D scenes (MacBook) where Celly can safely
   *  float over the transparent canvas — otherwise the wrapper's 90%-wide
   *  bounding box leaves no room for Celly in the section (Shamil round
   *  43). */
  mediaAvoidCelly?: boolean;
};

const DEFAULT_MEDIA_WRAPPER = (isLeft: boolean) =>
  `absolute -top-[55vh] -bottom-[10vh] ${isLeft ? "-right-12" : "-left-12"} hidden md:flex md:w-[90%] items-center justify-center px-2 lg:px-4 pointer-events-none`;

function Section({
  kicker,
  headline,
  body,
  side,
  cta,
  media,
  mediaWrapperClassName,
  mediaAvoidCelly = true,
  isMobile = false,
  useCompactLayout = false,
  isHero = false,
}: SectionProps & { isMobile?: boolean; useCompactLayout?: boolean; isHero?: boolean }) {
  const isLeft = side === "left";
  const wrapperClass = mediaWrapperClassName ?? DEFAULT_MEDIA_WRAPPER(isLeft);
  // L/R-split breakpoint differs between hero and step sections (Shamil
  // 2026-05-27):
  //   - HERO (i===0): video placeholder is small + fits beside text at
  //     md+ widths. L/R stays at md:(768). Text always left-aligned.
  //   - STEP sections (i===1-4): full carousels need width to render
  //     properly. Below 1400px they stack vertically with CENTERED
  //     text (Shamil's preference for the stacked variant). At >=1400
  //     they go side-by-side with left-aligned text in their column.
  const sectionFlexClasses = isHero
    ? "relative md:min-h-screen md:flex md:items-center px-6 md:px-12 py-10 md:py-0"
    : "relative min-[1400px]:min-h-screen min-[1400px]:flex min-[1400px]:items-center px-6 md:px-12 py-10 min-[1400px]:py-0";
  const textColClasses = isHero
    ? `relative z-30 w-full md:w-1/2 ${isLeft ? "md:mr-auto" : "md:ml-auto"} max-w-xl`
    : `relative z-30 w-full min-[1400px]:w-1/2 ${isLeft ? "min-[1400px]:mr-auto" : "min-[1400px]:ml-auto"} max-w-xl mx-auto text-center min-[1400px]:text-left min-[1400px]:mx-0`;
  return (
    <section className={sectionFlexClasses}>
      <div
        data-celly-avoid
        className={textColClasses}
      >
        <div className="mono-label">{kicker}</div>
        <h2
          className="mt-3 text-3xl md:text-5xl font-bold tracking-tight"
          style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
        >
          {headline}
        </h2>
        <p className="mt-5 text-base md:text-lg text-text-muted leading-relaxed">
          {body}
        </p>
        {cta && (
          <button className="mt-7 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-medium text-bg transition-all hover:bg-accent-hover">
            {cta} →
          </button>
        )}
      </div>
      {/* STACKED vs L/R media render. Threshold differs by section type:
          - HERO uses isMobile (< 768) — at 768+ goes side-by-side
          - STEP sections use useCompactLayout (< 1400) — at 1400+ goes side-by-side
          (Shamil 2026-05-27.) */}
      {media && (isHero ? isMobile : useCompactLayout) && (
        <div
          {...(mediaAvoidCelly ? { "data-celly-avoid": "" } : {})}
          className="mt-10 w-full"
        >
          {media}
        </div>
      )}
      {media && !(isHero ? isMobile : useCompactLayout) && (
        <div
          {...(mediaAvoidCelly ? { "data-celly-avoid": "" } : {})}
          className={wrapperClass}
        >
          {media}
        </div>
      )}
    </section>
  );
}

// Celly's introduction copy — three variants for adaptive sizing
// (Shamil 2026-05-24 round 14). Auto-positioner picks the largest
// variant that fits without overlapping content. If even SHORT doesn't
// fit, bubble is hidden entirely.
type BubbleVariant = {
  text: string;
  widthRem: number;
  paddingVw: number;
  paddingVh: number;
};
const CELLY_VARIANTS: BubbleVariant[] = [
  {
    // LONG — full pitch
    text:
      "Hi, I'm Erken. Shamil built this site with me — I'm wired into everything he knows. Every project, every system, every lesson from ten years of building. Ask me anything about him, his work, or what we'd build for you.",
    widthRem: 22,
    paddingVw: 9,
    paddingVh: 11,
  },
  {
    // MEDIUM — condensed
    text:
      "Hi, I'm Erken. I'm Shamil's assistant — I know every project, every system, every lesson. Ask me anything.",
    widthRem: 17,
    paddingVw: 7,
    paddingVh: 7,
  },
  {
    // SHORT — one-liner
    text: "Hi, I'm Erken. Ask me anything.",
    widthRem: 12,
    paddingVw: 5,
    paddingVh: 4,
  },
];
const CELLY_INTRO = CELLY_VARIANTS[0].text; // initial / fallback

const SCROLL_STOP_DELAY_MS = 700; // wait this long after scrolling stops before showing the bubble

/**
 * Find an empty spot in the viewport for Celly (or the bubble) to land
 * when scroll stops. Queries all elements with the data-celly-avoid
 * attribute, gets their bounding rects, then samples a coarse grid of
 * candidate positions and scores each by how empty the surrounding
 * space is + how close it is to a "preferred" anchor.
 *
 * Shamil 2026-05-24 round 11: this replaces hand-tuned per-scene
 * positions. Every section just tags its content elements with
 * data-celly-avoid and the auto-positioner picks the empty corner.
 */
type AvoidRect = { left: number; right: number; top: number; bottom: number };

function findEmptySpot(opts: {
  preferredXVw: number;
  preferredYVh: number;
  /** Approximate sprite half-size in vw — used to keep candidate
   *  positions clear of viewport edges by this margin. */
  paddingVw: number;
  paddingVh: number;
  /** Extra rects to avoid beyond what's in the DOM (e.g. Celly herself
   *  when positioning the bubble — bubble should avoid her body). */
  extraAvoidRects?: AvoidRect[];
  /** Inflate every avoid rect by this many vw on all sides before the
   *  inside-rect check. Gives the chosen spot some breathing room from
   *  content edges. Default = 2vw. */
  avoidBuffer?: number;
  /** Hard cap: reject any candidate further than this many vw from the
   *  preferred anchor. Used to keep bubble near Celly. */
  maxDistFromAnchor?: number;
  /** Weight on the distance-to-anchor penalty. Higher = pickier about
   *  proximity to the anchor. Default = 0.3. */
  distancePenaltyWeight?: number;
}): { xVw: number; yVh: number; minDist: number } {
  if (typeof window === "undefined") {
    return { xVw: opts.preferredXVw, yVh: opts.preferredYVh, minDist: 0 };
  }
  const vw = window.innerWidth / 100;
  const vh = window.innerHeight / 100;
  // Pull avoid rects from the DOM.
  const avoidEls = document.querySelectorAll<HTMLElement>("[data-celly-avoid]");
  const avoidRects: AvoidRect[] = [];
  avoidEls.forEach((el) => {
    const r = el.getBoundingClientRect();
    // Only count elements at least partially visible in the viewport
    if (r.bottom < 0 || r.top > window.innerHeight) return;
    if (r.right < 0 || r.left > window.innerWidth) return;
    avoidRects.push({
      left: r.left / vw,
      right: r.right / vw,
      top: r.top / vh,
      bottom: r.bottom / vh,
    });
  });
  if (opts.extraAvoidRects) {
    avoidRects.push(...opts.extraAvoidRects);
  }
  // Sample a denser 25x17 grid of candidate positions and score each
  // (was 13x9 — Shamil round 47: too coarse to find the narrow ~6-8vw
  // gaps between content columns in Step 1/2/3 layouts, so Celly was
  // falling back to her preferred position which landed on body text).
  // Avoid rects are INFLATED by avoidBuffer so the chosen spot has
  // breathing room from any content edge.
  const buffer = opts.avoidBuffer ?? 2;
  const penalty = opts.distancePenaltyWeight ?? 0.3;
  const GX = 24;
  const GY = 16;
  // Strict-pass best (no avoid-rect overlap). Used when we find at
  // least one truly empty candidate.
  let bestStrict = { xVw: 0, yVh: 0, score: -Infinity, minDist: 0 };
  // Soft-pass best — best candidate even if it overlaps avoid rects,
  // scored by how SHALLOWLY it penetrates (smaller penetration = better).
  // Used as a fallback when no strict candidate exists.
  let bestSoft = { xVw: opts.preferredXVw, yVh: opts.preferredYVh, score: -Infinity, minDist: 0 };
  for (let gx = 0; gx <= GX; gx++) {
    for (let gy = 0; gy <= GY; gy++) {
      const cxVw = (gx / GX) * 100;
      const cyVh = (gy / GY) * 100;
      // Skip candidates too close to viewport edge.
      if (cxVw - opts.paddingVw < 2 || cxVw + opts.paddingVw > 98) continue;
      if (cyVh - opts.paddingVh < 2 || cyVh + opts.paddingVh > 98) continue;
      // Hard distance cap from anchor (used for the bubble to stay near
      // Celly).
      const dxPref = cxVw - opts.preferredXVw;
      const dyPref = cyVh - opts.preferredYVh;
      const distToPref = Math.sqrt(dxPref * dxPref + dyPref * dyPref);
      if (opts.maxDistFromAnchor !== undefined && distToPref > opts.maxDistFromAnchor) continue;
      // For each avoid rect, compute either:
      //   distance OUTSIDE the inflated rect (positive — strict pass)
      //   OR penetration depth INSIDE the rect (positive — soft pass)
      let minDist = 100;       // smallest "outside" distance
      let maxPenetration = 0;  // deepest "inside" penetration across all rects
      let inside = false;
      for (const r of avoidRects) {
        const inflLeft = r.left - buffer;
        const inflRight = r.right + buffer;
        const inflTop = r.top - buffer;
        const inflBottom = r.bottom + buffer;
        const dx = Math.max(inflLeft - cxVw, 0, cxVw - inflRight);
        const dy = Math.max(inflTop - cyVh, 0, cyVh - inflBottom);
        const dyAsVw = dy * (window.innerHeight / window.innerWidth);
        const d = Math.sqrt(dx * dx + dyAsVw * dyAsVw);
        if (d === 0) {
          // Inside this rect — measure how deep (distance from candidate
          // to the NEAREST rect edge).
          inside = true;
          const penLeft = cxVw - inflLeft;
          const penRight = inflRight - cxVw;
          const penTop = cyVh - inflTop;
          const penBottom = inflBottom - cyVh;
          const nearestEdge = Math.min(penLeft, penRight, penTop, penBottom);
          if (nearestEdge > maxPenetration) maxPenetration = nearestEdge;
        } else if (d < minDist) {
          minDist = d;
        }
      }
      if (!inside) {
        // Strict candidate — score normally.
        const score = minDist - distToPref * penalty;
        if (score > bestStrict.score) {
          bestStrict = { xVw: cxVw, yVh: cyVh, score, minDist };
        }
      } else {
        // Soft candidate — score by NEGATIVE penetration (shallower
        // overlap is better). Distance-to-anchor penalty still applies
        // so it prefers nearby fallbacks. Subtract a big constant so
        // even the best soft score is worse than any strict score.
        const score = -maxPenetration - distToPref * penalty - 1000;
        if (score > bestSoft.score) {
          bestSoft = { xVw: cxVw, yVh: cyVh, score, minDist: 0 };
        }
      }
    }
  }
  // Prefer the strict candidate. Fall back to soft if no strict found.
  const best = bestStrict.score > -Infinity ? bestStrict : bestSoft;
  return { xVw: best.xVw, yVh: best.yVh, minDist: best.minDist };
}

export default function PreviewV6Page() {
  // Sprite container we'll move imperatively (60fps onUpdate calls would
  // thrash React if we used setState).
  const spriteContainerRef = useRef<HTMLDivElement>(null);
  // Bubble container — sibling of the sprite (NOT inside the flipped
  // sprite frame), so its position math isn't mirrored when Celly faces
  // left. Positioned upper-LEFT of Celly in screen space.
  const bubbleContainerRef = useRef<HTMLDivElement>(null);
  // Bubble visibility — true when user has stopped scrolling for the
  // SCROLL_STOP_DELAY window, false the instant scroll begins again.
  const [bubbleVisible, setBubbleVisible] = useState(false);
  // Mirror of bubbleVisible into a ref so the 60fps handleCellMove
  // callback (deps: []) can read the latest value without re-creating.
  // Drives Celly's opacity in the same scroll-stop logic as the bubble.
  const stoppedRef = useRef(false);
  // Last cell opacity from handleCellMove — needed because when scrolling
  // stops, handleCellMove STOPS firing, so we need this value to
  // re-compute Celly's opacity in the bubbleVisible useEffect below.
  const lastCellOpacityRef = useRef(1);
  // Last "natural" Celly position from handleCellMove, used by the
  // auto-positioner as the anchor when finding an empty spot on stop.
  const lastNaturalPosRef = useRef({ xVw: 50, yVh: 50 });
  // Cell-dragon refs received from SphereScrollStage on mount. Used
  // to FORCE the cell's world position AND fully-expanded state when
  // Celly auto-positions after scroll stops (Shamil 2026-05-24 round
  // 17-18: "dragon cell follows Celly + dust fully expands at her spot
  // regardless of scroll math").
  const cellRefsRef = useRef<{
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
  } | null>(null);
  // Tracks the cell's last WORLD position so the trail-fly animation
  // has a starting point on the next scroll-stop.
  const lastCellWorldPosRef = useRef<{ x: number; y: number } | null>(null);
  // Tracks the dragon's CURRENT HEAD position during scroll. Used as
  // the launch point for the on-stop fly-to-new-spot animation (Shamil
  // round 23 — head is the "pen tip" by the time scroll ends).
  const dragonHeadWorldPosRef = useRef<{ x: number; y: number } | null>(null);
  // Active animation handle (so we can cancel if a new stop fires
  // mid-animation).
  const cellAnimRafRef = useRef<number | null>(null);
  // Camera params captured from the last cell position event — needed
  // to project Celly's screen-space (vw/vh) back to world coords.
  const cameraParamsRef = useRef({ cameraZ: 2.9, fovDeg: 50 });
  // Celly's facing direction (state) + tracking refs. Declared BEFORE
  // the useEffect below because that effect uses setPointDirection on
  // scroll-stop. Moving these declarations later in the source caused
  // a TDZ error.
  const [pointDirection, setPointDirection] = useState<"left" | "right">("right");
  const lastSideRef = useRef<"left" | "right">("right");
  const lastDesiredDirectionRef = useRef<"left" | "right">("right");
  // Mobile flag — drives bubble-variant cap (SHORT only) and smaller
  // cloud puffs / tighter padding. Initial false → matches SSR; set
  // truthy after mount so we never mismatch on first paint.
  const [isMobile, setIsMobile] = useState(false);
  // useCompactLayout = true on any viewport narrower than 1400px. Drives
  // section media to stack vertically (mobile-style) instead of using
  // the L/R-split layout. Bumped from 768 to 1400 on 2026-05-27 because
  // the L/R-split's absolute-positioned media overlapped the text col
  // on viewports between 768 and ~1400 (Shamil's laptop at 1270px and
  // most TVs hit this).
  const [useCompactLayout, setUseCompactLayout] = useState(false);
  useEffect(() => {
    const compute = () => {
      setIsMobile(window.innerWidth < 768);
      setUseCompactLayout(window.innerWidth < 1400);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);
  // Active bubble variant — adaptive (LONG/MEDIUM/SHORT). Auto-positioner
  // picks the largest variant that fits in the available empty zone on
  // stop. Null = no variant fits, bubble is hidden entirely.
  const [activeVariant, setActiveVariant] = useState<BubbleVariant | null>(
    CELLY_VARIANTS[0],
  );
  useEffect(() => {
    stoppedRef.current = bubbleVisible;
    const el = spriteContainerRef.current;
    const bubbleEl = bubbleContainerRef.current;
    // Re-apply Celly's opacity — 0 when scrolling, 1 when stopped.
    // Mobile (Shamil 2026-05-25): always 1, she stays visible during scroll.
    if (el) {
      const mobile = typeof window !== "undefined" && window.innerWidth < 768;
      const restOpacity = mobile ? 1 : bubbleVisible ? 1 : 0;
      el.style.setProperty("--celly-rest-opacity", String(restOpacity));
      el.style.setProperty("--celly-hover-opacity", "1");
      el.style.opacity = "var(--celly-rest-opacity)";
    }
    // Scroll-start: smoothly shrink Celly's body to invisible over
    // ~200ms (Shamil round 27), then start dragon-trail at her last
    // position. The shrink RAF tweens scaleRef + sphereOpacityRef from
    // their current values down to 0. Skipped on mobile — there's no
    // trail (hideTrail={isMobile}) and the dust cloud should stay
    // visible around Celly at all times. (Shamil 2026-05-25 evening.)
    const isMobileNow = typeof window !== "undefined" && window.innerWidth < 768;
    if (cellRefsRef.current && !bubbleVisible && !isMobileNow) {
      const refs = cellRefsRef.current;
      if (cellAnimRafRef.current !== null) {
        cancelAnimationFrame(cellAnimRafRef.current);
        cellAnimRafRef.current = null;
      }
      const startScale = refs.scaleRef.current;
      const startOpacity = refs.sphereOpacityRef.current;
      const SHRINK_MS = 220;
      const t0 = performance.now();
      const last = lastCellWorldPosRef.current;
      const shrinkTick = (now: number) => {
        const t = Math.min(1, (now - t0) / SHRINK_MS);
        refs.scaleRef.current = startScale * (1 - t);
        refs.sphereOpacityRef.current = startOpacity * (1 - t);
        if (t < 1) {
          cellAnimRafRef.current = requestAnimationFrame(shrinkTick);
        } else {
          refs.scaleRef.current = 0;
          refs.sphereOpacityRef.current = 0;
          cellAnimRafRef.current = null;
          // After shrink, set trail to visible at last position. The
          // scroll listener will keep updating prev/next based on scroll.
          if (last) {
            refs.streamOpacityRef.current = 1;
            refs.transitionProgressRef.current = 1;
            refs.segProgressRef.current = 0.5;
            refs.prevXRef.current = last.x;
            refs.prevYRef.current = last.y;
            refs.nextXRef.current = last.x;
            refs.nextYRef.current = last.y;
          }
        }
      };
      cellAnimRafRef.current = requestAnimationFrame(shrinkTick);
    }
    // Auto-position Celly + bubble in empty zones on scroll-stop. This
    // is now the ONLY place Celly's position and pointDirection update
    // (handleCellMove is detached — Shamil 2026-05-24 round 13).
    if (bubbleVisible && el && bubbleEl) {
      // 1. Apply the desired pointing direction (only changes once per stop).
      if (lastSideRef.current !== lastDesiredDirectionRef.current) {
        lastSideRef.current = lastDesiredDirectionRef.current;
        setPointDirection(lastDesiredDirectionRef.current);
      }
      // Pin Celly to the bottom-LEFT corner on ALL viewports
      // (Shamil 2026-05-27: "leave the Erken bot with the text window
      // in the left corner always — same way as mobile"). Coords
      // retuned 2026-05-27 evening after Shamil flagged "bot's head
      // covered by the bubble" on TV and "bot not visible on laptop":
      //   - yPercent pulled in from the bottom edge (94→90 mobile,
      //     88→85 desktop) so the sprite fully fits short-height
      //     viewports (TV browsers often run at ~540px tall).
      //   - bubble top offset bumped (mobile -13→-20, desktop -12→-25)
      //     so the bubble sits well ABOVE the bot's head with no
      //     overlap.
      //   - desktop bubble width tightened (14rem → 10rem) — text is
      //     short, the wide variant felt oversized.
      {
        const mobileNow = window.innerWidth < 768;
        const fixedXVw = mobileNow ? 14 : 7;
        const fixedYVh = mobileNow ? 90 : 85;
        const fixedScale = mobileNow ? 0.6 : 0.7;
        el.style.left = `${fixedXVw}vw`;
        el.style.top = `${fixedYVh}vh`;
        el.style.transform = `translate(-50%, -50%) scale(${fixedScale})`;
        // Bubble variant + offset: tight + close on mobile, slightly
        // wider with more breathing room on desktop.
        const variant = mobileNow
          ? { ...CELLY_VARIANTS[2], widthRem: 8 }
          : { ...CELLY_VARIANTS[2], widthRem: 10 };
        setActiveVariant(variant);
        bubbleEl.style.right = "auto";
        bubbleEl.style.bottom = "auto";
        bubbleEl.style.left = mobileNow
          ? `${fixedXVw + 7}vw`
          : `${fixedXVw + 7}vw`;
        bubbleEl.style.top = mobileNow
          ? `${fixedYVh - 20}vh`
          : `${fixedYVh - 25}vh`;
        bubbleEl.style.transform = "translate(-50%, -50%)";
        bubbleEl.style.width = `${variant.widthRem}rem`;
        // Pin the cell-dragon (the dust cloud) to Celly's screen position
        // too (Shamil 2026-05-25 evening). Without this the cell renders
        // wherever the scroll math wants, and Celly looks isolated from
        // her dust. Project Celly's (vw, vh) into the camera's world
        // coordinates and write directly to the refs.
        if (cellRefsRef.current) {
          const refs = cellRefsRef.current;
          const { cameraZ, fovDeg } = cameraParamsRef.current;
          const halfFovRad = (fovDeg / 2) * (Math.PI / 180);
          const verticalHalf = cameraZ * Math.tan(halfFovRad);
          const aspect =
            typeof window !== "undefined" && window.innerHeight > 0
              ? window.innerWidth / window.innerHeight
              : 16 / 9;
          const horizontalHalf = verticalHalf * aspect;
          const targetX = ((fixedXVw - 50) / 100) * (2 * horizontalHalf);
          const targetY = ((50 - fixedYVh) / 100) * (2 * verticalHalf);
          if (cellAnimRafRef.current !== null) {
            cancelAnimationFrame(cellAnimRafRef.current);
            cellAnimRafRef.current = null;
          }
          refs.xRef.current = targetX;
          refs.yRef.current = targetY;
          refs.scaleRef.current = 1;
          refs.sphereOpacityRef.current = 1;
          refs.streamOpacityRef.current = 0;
          lastCellWorldPosRef.current = { x: targetX, y: targetY };
        }
        return;
      }
    }
  }, [bubbleVisible, isMobile]);
  // (pointDirection state + lastSideRef + lastDesiredDirectionRef
  //  moved to top of component to avoid TDZ error in the stop-handler
  //  useEffect above.)
  // Bubble tail corner state was used when the bubble followed Celly
  // around. With bubble fixed at top (Shamil 2026-05-24 round 8), tail
  // is hardcoded at bottom-center pointing down. State kept around as
  // commented-out reference for future tail-tracking work.

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let scrollStartY: number | null = null;
    const CELL_VISIBILITY_THRESHOLD = 0.2;
    const showBubbleIfCellVisible = () => {
      if (lastCellOpacityRef.current > CELL_VISIBILITY_THRESHOLD) {
        setBubbleVisible(true);
      }
      scrollStartY = null; // reset for next scroll
    };
    const onScroll = () => {
      if (scrollStartY === null) scrollStartY = window.scrollY;
      setBubbleVisible(false);
      // Mobile (Shamil 2026-05-25 evening): skip the dragon-draw logic.
      // The trail is hidden on mobile (`hideTrail` prop) and Celly is
      // pinned, so we DON'T want the cell-dragon's world Y to slide with
      // scroll — that's what was making the dust appear to "stay where
      // it was" while the page scrolled past it.
      const isMobileNow =
        typeof window !== "undefined" && window.innerWidth < 768;
      if (isMobileNow) {
        // Pin the cell-dragon to Celly's bottom-left spot DURING scroll
        // too, not just on stop (Shamil 2026-05-25 evening). Otherwise
        // the cell sits at its initial center-left position with scale
        // 0.9 dust filling most of the viewport — Shamil's "dust expands
        // to full page" complaint. Re-applies on every scroll tick.
        const refs = cellRefsRef.current;
        if (refs) {
          const { cameraZ, fovDeg } = cameraParamsRef.current;
          const halfFovRad = (fovDeg / 2) * (Math.PI / 180);
          const verticalHalf = cameraZ * Math.tan(halfFovRad);
          const aspect =
            window.innerHeight > 0
              ? window.innerWidth / window.innerHeight
              : 16 / 9;
          const horizontalHalf = verticalHalf * aspect;
          const targetX = ((14 - 50) / 100) * (2 * horizontalHalf);
          const targetY = ((50 - 90) / 100) * (2 * verticalHalf);
          refs.xRef.current = targetX;
          refs.yRef.current = targetY;
          refs.scaleRef.current = 1;
          refs.sphereOpacityRef.current = 1;
          refs.streamOpacityRef.current = 0;
        }
        if (timer) clearTimeout(timer);
        timer = setTimeout(showBubbleIfCellVisible, SCROLL_STOP_DELAY_MS);
        return;
      }
      // Dragon DRAWS in scroll direction (Shamil round 22): trail tail
      // anchored at Celly's last spot, head extends in scroll direction
      // proportional to scroll delta. The further you scroll, the
      // longer the dragon.
      const refs = cellRefsRef.current;
      const last = lastCellWorldPosRef.current;
      if (refs && last && scrollStartY !== null) {
        const { cameraZ, fovDeg } = cameraParamsRef.current;
        const halfFovRad = (fovDeg / 2) * (Math.PI / 180);
        const verticalHalf = cameraZ * Math.tan(halfFovRad);
        const pxToWorldY = (verticalHalf * 2) / window.innerHeight;
        // Round 26 (Shamil): DRAW_RATE bumped to 1.0 and cap removed.
        // At 1.0 with no cap, the math becomes: tailY moves UP at scroll
        // rate, headY stays at last.y constant in world coords — i.e.
        // head stays FIXED at Celly's original viewport position while
        // tail recedes up into the page. Dragon length grows continuously
        // with scroll, head always visible.
        const DRAW_RATE = 1.0;
        const rawScrollDeltaPx = window.scrollY - scrollStartY;
        const pageOffsetWorld = rawScrollDeltaPx * pxToWorldY;
        const drawDeltaPx = rawScrollDeltaPx * DRAW_RATE;
        const drawWorldY = -drawDeltaPx * pxToWorldY;
        refs.prevXRef.current = last.x;
        refs.prevYRef.current = last.y + pageOffsetWorld;
        refs.nextXRef.current = last.x;
        refs.nextYRef.current = last.y + pageOffsetWorld + drawWorldY;
        refs.segProgressRef.current = 0.5;
        refs.streamOpacityRef.current = 1;
        refs.xRef.current = last.x;
        refs.yRef.current = last.y + pageOffsetWorld;
        // Don't write scaleRef/sphereOpacityRef here — the shrink RAF
        // animation in the bubbleVisible useEffect handles those.
        dragonHeadWorldPosRef.current = {
          x: last.x,
          y: last.y + pageOffsetWorld + drawWorldY,
        };
      }
      if (timer) clearTimeout(timer);
      timer = setTimeout(showBubbleIfCellVisible, SCROLL_STOP_DELAY_MS);
    };
    timer = setTimeout(showBubbleIfCellVisible, SCROLL_STOP_DELAY_MS);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timer) clearTimeout(timer);
    };
  }, []);

  // Convert the cell's 3D world position to a screen position and slap it
  // onto the sprite container's style. Camera is fov=50 looking down -Z at
  // a sphere at world y=0; the screen half-width in world units is
  // cameraZ * tan(fov/2). We then map worldX → 50vw ± offset.
  const handleCellMove = useCallback((pos: CellPositionInfo) => {
    const el = spriteContainerRef.current;
    if (!el) return;
    // Three.js perspective camera: `fov` is the VERTICAL fov. The vertical
    // half-height in world units at the cell's z=0 plane is:
    //    verticalHalf = cameraZ * tan(fov/2)
    // The horizontal half-width depends on viewport aspect ratio:
    //    horizontalHalf = verticalHalf * (viewport width / viewport height)
    // Missing the aspect multiplier was why Celly was landing way off to
    // the side — the math was treating the screen as square.
    const halfFovRad = (pos.fovDeg / 2) * (Math.PI / 180);
    const verticalHalf = pos.cameraZ * Math.tan(halfFovRad);
    const aspect =
      typeof window !== "undefined" && window.innerHeight > 0
        ? window.innerWidth / window.innerHeight
        : 16 / 9;
    const horizontalHalf = verticalHalf * aspect;
    // Per-section Celly placement tweaks (Shamil 2026-05-24, walking through
    // each scene). xPushIn = how far to push toward viewport center from
    // the cell's worldX (in world units, positive = toward center).
    // yOffset = vertical nudge in world units (positive = down).
    // These are per scene because each scene's content layout has different
    // "empty corners" inside the dust cloud where Celly fits without
    // covering text or cards.
    // Section indices: 0 hero, 1 lead gen, 2 lead capture, 3 lead mgmt,
    // 4 control panel, 5 industries (added 2026-05-24 round 2).
    //
    // ORCHESTRATION RESET (Shamil 2026-05-24 round 2): cell-dragon now
    // lifts to upper-half of viewport in SphereScrollStage (sectionY=0.4),
    // and follows the alternating L/R pattern (same side as text). That
    // means Celly naturally sits in the upper-LEFT corner for even-index
    // scenes and upper-RIGHT for odd-index scenes, ABOVE the text. No
    // need for the old per-scene yOffset tricks to lift her individually.
    //
    // xPushIn reset to 0 for all scenes so Celly sits AT the cell's
    // natural position. pointOverride still used where she needs to
    // point at something on the opposite side (e.g. the laptop).
    // xPushIn restored to 0.55 (Shamil 2026-05-24 round 3): with cell
    // lifted to Y=+0.4, the Y lift alone doesn't clear the text column
    // horizontally — Celly still overlapped the headline because her
    // body width straddles the text column edge. Pushing her 0.55 world
    // units toward center moves her past the text edge so she sits in
    // the upper-corner-but-clear-of-text zone. Matches the "before was
    // perfect" position Shamil called out for Hero.
    // Per-scene Celly + bubble placement. Each scene has its own "empty
    // zone" where Celly can sit without covering content.
    // - xPushIn (world units): push Celly toward viewport center from
    //   the cell's natural left/right edge. 0.55 ≈ clear of text column.
    // - yOffset (world units, Three.js Y is UP): negative pushes Celly
    //   DOWN on screen from the cell's lifted Y=+0.4 default.
    // - pointOverride: force a facing direction.
    // - bubble: per-scene override for bubble position + tail corner.
    //   rightOffsetVw positive = bubble to LEFT of Celly. bottomOffsetVh
    //   positive = bubble ABOVE Celly. tailCorner = which corner of the
    //   bubble has the tail (and which direction it points). Tail should
    //   point TOWARD Celly's screen position.
    //     "tl" = top-left, points up-left
    //     "tr" = top-right, points up-right
    //     "bl" = bottom-left, points down-left
    //     "br" = bottom-right, points down-right
    // Bubble offsets — rightOffsetVw positive = bubble's RIGHT edge that
    // many vw to the LEFT of Celly's center (bubble is to Celly's left).
    // Negative = bubble to Celly's right. bottomOffsetVh positive =
    // bubble ABOVE Celly's center. tailCorner kept in type for future
    // (currently unused since bubble is cloud-shaped without a tail).
    type TailCorner = "tl" | "tr" | "bl" | "br" | "none";
    // Default = bubble ABOVE Celly (centered horizontally on her, sitting
    // above her head). rightOffsetVw=-6 puts bubble's right edge ~6vw to
    // the right of Celly's center, which combined with bubble width ~12vw
    // centers it on Celly. bottomOffsetVh=8 puts its bottom edge 8vh
    // above Celly's center — clear of her body, above section text.
    const DEFAULT_BUBBLE: {
      rightOffsetVw: number;
      bottomOffsetVh: number;
      tailCorner: TailCorner;
    } = { rightOffsetVw: -6, bottomOffsetVh: 8, tailCorner: "none" };
    const SCENE_OFFSETS: Record<
      number,
      {
        xPushIn: number;
        yOffset: number;
        pointOverride?: "left" | "right";
        bubble?: {
          rightOffsetVw: number;
          bottomOffsetVh: number;
          tailCorner: TailCorner;
        };
      }
    > = {
      0: { xPushIn: 0.55, yOffset: 0 },                          // Hero — upper-left
      // Lead gen — Shamil 2026-05-24 round 7: bubble shifted further to
      // the LOWER-RIGHT of Celly (rightOffsetVw=-10 puts its right edge
      // near viewport edge; bottomOffsetVh=-8 puts it BELOW Celly's
      // vertical center) so it clears the text body above AND Celly
      // herself. Tail in top-LEFT corner of bubble points UP-LEFT,
      // straight at Celly who now sits to the bubble's upper-left.
      1: {
        xPushIn: 0,
        yOffset: 0,
        pointOverride: "left",
        bubble: { rightOffsetVw: -22, bottomOffsetVh: 0, tailCorner: "none" },
      },
      2: { xPushIn: 0.55, yOffset: 0 },                                       // Lead capture — upper-left (TODO likely needs Step-1-style treatment)
      3: { xPushIn: 0.55, yOffset: 0 },                                       // Lead mgmt — upper-right
      4: { xPushIn: 0.55, yOffset: 0, pointOverride: "right" },               // Control panel — upper-left, points at laptop
      5: { xPushIn: 0.55, yOffset: 0 },                                       // Industries — upper-right
    };
    const sceneOffset = SCENE_OFFSETS[pos.sectionIndex] ?? {
      xPushIn: 0.5,
      yOffset: 0,
    };
    const { xPushIn, yOffset, pointOverride, bubble: bubbleOffset } = sceneOffset;
    const cellySide = pos.worldX < 0 ? -1 : 1; // -1 = cell on left, +1 = cell on right
    // Update facing direction via React state ONLY when side actually
    // flips. Default rule: cell on left → Celly points LEFT (toward text
    // on left). Cell on right → points RIGHT. Per-scene pointOverride
    // beats the default rule.
    const desiredDirection: "left" | "right" =
      pointOverride ?? (cellySide < 0 ? "left" : "right");
    // 2026-05-24 round 13: pointDirection update DISABLED during scroll
    // (Celly was flipping back and forth as the cell-dragon swept L/R).
    // Direction change now happens only on scroll-stop via the
    // bubbleVisible useEffect, where it's a single stable update per stop.
    // (Tracked here so the stop-handler can read the latest desired direction.)
    lastDesiredDirectionRef.current = desiredDirection;
    const cellyWorldX = pos.worldX - cellySide * xPushIn;
    const cellyWorldY = pos.worldY + yOffset; // positive yOffset = down on screen
    const xVw = 50 + (cellyWorldX / (2 * horizontalHalf)) * 100;
    // Map world y ∈ [-verticalHalf, +verticalHalf] to viewport %
    const yVh = 50 - (cellyWorldY / (2 * verticalHalf)) * 100;
    // Record natural position for auto-positioner to use as anchor on stop.
    lastNaturalPosRef.current = { xVw, yVh };
    // Capture camera params for the screen→world projection on stop.
    cameraParamsRef.current = { cameraZ: pos.cameraZ, fovDeg: pos.fovDeg };
    // 2026-05-24 round 13 (Shamil): position updates DISABLED during
    // scroll. Celly was flapping around chasing the cell-dragon's L/R
    // motion. Now her position is only updated on scroll-STOP via the
    // bubbleVisible useEffect. Between stops, she stays put.
    // Celly's opacity (Shamil 2026-05-24 round 17): FULLY HIDDEN during
    // scroll. Was translucent at 55%; now goes to 0 so she completely
    // disappears mid-scroll, leaving just the dragon-trail visual. Fades
    // back to full opacity when scroll stops at her new auto-position.
    lastCellOpacityRef.current = 1;
    // Mobile: Celly is always visible (she's pinned bottom-left, no scroll fade).
    const mobile = typeof window !== "undefined" && window.innerWidth < 768;
    const restOpacity = mobile ? 1 : stoppedRef.current ? 1 : 0;
    const hoverOpacity = 1;
    el.style.setProperty("--celly-rest-opacity", String(restOpacity));
    el.style.setProperty("--celly-hover-opacity", String(hoverOpacity));
    el.style.opacity = "var(--celly-rest-opacity)";
    // Scale: Celly REPLACES the inner cell core (3D sphereGeometry radius
    // 0.55, so diameter 1.1 in world units). The on-screen pixel diameter
    // of that sphere is roughly:
    //    pxDiameter = (1.1 / (2 * verticalHalf)) * viewportHeight
    // Celly's CSS body is 24 (Tailwind) = 6rem ≈ 96px when scale=1.
    // We compute the exact pixel scale needed to match the 3D sphere size.
    // Scale + position + bubble positioning REMOVED from handleCellMove
    // (Shamil 2026-05-24 round 15). Celly's size, position, and the
    // bubble's position are all computed at scroll-stop based on
    // available empty space. handleCellMove now only records the
    // natural anchor + sets opacity. Suppress unused-var lint:
    void bubbleOffset;
  }, []);

  return (
    <>
    <SphereScrollStage
      // sectionCount = SECTIONS.length (5 alternating sections) + 1 for
      // the Industries full-width section below.
      sectionCount={SECTIONS.length + 1}
      onCellPositionChange={handleCellMove}
      onCellRefsReady={(refs) => {
        cellRefsRef.current = refs;
        // Pin the Erken bot to a fixed bottom-left spot on ALL viewports
        // — mobile, desktop, big TVs. (Shamil 2026-05-27: "leave the
        // Erken bot with the text window in the left corner always".)
        // Previously only mobile got this pin; desktop let the cell sit
        // at the SphereScrollStage default top-left position which moved
        // around as scroll-driven shape math fired. Now both behave the
        // same: fixed bottom-left, no scroll movement, no dust cloud.
        if (typeof window !== "undefined") {
          const mob = window.innerWidth < 768;
          const cameraZ = mob ? 2.2 : 2.9;
          const fovDeg = 50;
          const halfFovRad = (fovDeg / 2) * (Math.PI / 180);
          const verticalHalf = cameraZ * Math.tan(halfFovRad);
          const aspect =
            window.innerHeight > 0
              ? window.innerWidth / window.innerHeight
              : 16 / 9;
          const horizontalHalf = verticalHalf * aspect;
          // Pin position as % of viewport. Mobile keeps the existing
          // 14% / 94% (bottom-left, hugging the corner). Desktop uses
          // a slightly less extreme spot — the bot + bubble combo needs
          // breathing room on wide viewports, and TV viewports get
          // empty side margins which makes a too-cornery pin float in
          // negative space.
          const xPercent = mob ? 14 : 7;
          const yPercent = mob ? 90 : 85;
          refs.xRef.current = ((xPercent - 50) / 100) * (2 * horizontalHalf);
          refs.yRef.current = ((50 - yPercent) / 100) * (2 * verticalHalf);
          refs.scaleRef.current = 1;
          refs.sphereOpacityRef.current = 1;
          refs.streamOpacityRef.current = 0;
        }
      }}
      // hide the 3D cell-core — Celly is the visual stand-in for it.
      hideInnerCellCore
      // Round 19 (Shamil): disable the old per-segment shrink/expand
      // math. Page now owns the cell entirely via onCellRefsReady.
      disableScrollDrivenShape
      // Round 23: straight dragon — no bend, no sin arc — matches the
      // pen-drawing-down-the-page mental model.
      straightTrail
      // Trailing dragon disabled on ALL viewports (Shamil 2026-05-27):
      // "remove the dust cloud, the dragon, just leave the Erken bot
      // with the text window in the left corner always."
      hideTrail={true}
      // Per-section Y overrides so the dust CLOUD follows Celly when
      // she's not in the default upper-third position. Step 1 puts the
      // cell + cloud at bottom-right (Y=-0.8) so Celly is INSIDE the
      // cloud, not separated from it. Other sections fall back to the
      // default +0.4 lift.
      sectionYOverrides={{
        1: -0.8, // Step 1 Lead Gen — bottom-right corner
      }}
    >
      {SECTIONS.map((s, i) => (
        <Section
          key={i}
          isMobile={isMobile}
          useCompactLayout={useCompactLayout}
          isHero={i === 0}
          {...s}
          media={
            i === 0 ? <Scene1IntroVideo />
            : i === 1 ? <Scene2Channels />
            : i === 2 ? <Scene3LeadCaptureCarousel />
            : i === 3 ? <Scene4LeadMgmtCarousel />
            : i === 4 ? <Scene5ControlPanelCarousel />
            : null
          }
          mediaWrapperClassName={
            // Opaque HTML media gets a tight wrapper anchored opposite
            // the text column so it doesn't overlap the copy.
            //  - Scenes 0, 2 have text on the LEFT, so media anchors RIGHT.
            //  - Scenes 1, 3 have text on the RIGHT, so media anchors LEFT.
            //  - Scene 4 (MacBook) uses the default wide wrapper.
            i === 0
              ? "absolute inset-y-[8vh] right-[4vw] hidden md:flex md:w-[50%] items-center justify-center pointer-events-auto"
              : i === 2
              ? // Lead Capture carousel — anchored on BOTH sides now
                // (Shamil 2026-05-24): left edge closer to the text
                // column on the left, right edge aligned with the right
                // text edge of the section above. Replaces the previous
                // md:w-[50%] fixed-width approach.
                "absolute inset-y-[8vh] left-[38vw] right-[3vw] hidden md:flex items-center justify-center pointer-events-auto"
              : i === 1 || i === 3
              ? "absolute inset-y-[8vh] left-[4vw] hidden md:flex md:w-[55%] items-center justify-start pointer-events-auto"
              : i === 4
              ? // Control Panel carousel — text on LEFT, carousel anchors
                // RIGHT. Mirrors the i===1/i===3 wrapper but reflected.
                // (Shamil 2026-05-27: replaced 3D MacBook with carousel
                // for consistency across the page.)
                "absolute inset-y-[8vh] right-[4vw] hidden md:flex md:w-[55%] items-center justify-end pointer-events-auto"
              : undefined
          }
          // Step 4 keeps mediaAvoidCelly = true (Shamil round 46):
          // when real screenshots eventually project onto the laptop
          // screen, the bubble would cover them. The wrapper-wide
          // avoidance is restored, AND Celly's scale + bubble variant
          // both shrink when space is tight so they fit into the narrow
          // sliver beside the laptop instead of falling back to the
          // edge-of-page position.
          mediaAvoidCelly={true}
        />
      ))}

      {/* "Built for your industry" — moved BELOW the four pipeline steps
          (Shamil 2026-05-24) so the step numbering 1→2→3→4 stays
          uninterrupted. Full-width layout (not L/R split) so the 16
          industry tiles get the whole viewport. Still inside the
          SphereScrollStage so the cell-dragon canvas keeps rendering
          through this scroll. The dashboard modules section that used to
          sit here was deleted — its content is being merged into the
          laptop screen in a follow-up session. */}
      {/* z-10 (NOT z-30 like the other scenes) so the cell-dragon canvas
          at z-20 renders IN FRONT of these cards — Shamil 2026-05-24:
          the dust cloud should pass over the industry tiles, making them
          feel part of the cell-cloud world. Headline keeps z-30 so the
          intro text stays fully readable (dust mostly affects the card
          row below). */}
      <section className="relative px-6 md:px-12 pt-10 md:pt-16 pb-16 md:pb-24">
        {/* Tight top padding (Shamil 2026-05-27 evening). Previous value
            was pt-36 md:pt-52 — needed because the 3D MacBook's shadow
            in the section above was covering the headline. That section
            is now a carousel (no shadow), so the giant top gap is dead
            weight. Pulled back to pt-10/16 to match the visual rhythm
            of the four step sections above. */}
        <div
          data-celly-avoid
          className="relative z-30 max-w-3xl mx-auto mb-6 md:mb-8 text-left md:text-center"
        >
          <div className="mono-label">Built for your industry</div>
          <h2
            className="mt-3 text-3xl md:text-5xl font-bold tracking-tight"
            style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
          >
            Pre-configured for what you actually do.
          </h2>
          <p className="mt-5 text-base md:text-lg text-text-muted leading-relaxed">
            Sixteen industries with the pipeline already wired for your
            operation. Voice scripts in your language. Intake forms with
            the questions that matter. Pipeline stages that match your
            sales cycle. Click your industry to see what comes pre-built.
          </p>
        </div>
        <div data-celly-avoid className="relative z-10">
          <SceneIndustriesCarousel />
        </div>
      </section>

      {/* Trailing space so scroll has room to finish its tween */}
      <div className="h-[20vh]" />
    </SphereScrollStage>

    {/* AI character overlay — sits ABOVE the 3D cell-dragon canvas and
        TRACKS the cell-dragon's screen position as the user scrolls.
        SphereScrollStage fires onCellPositionChange every onUpdate; we
        translate world→screen and write directly to this container's
        CSS (no React re-renders at 60fps). The CellDragonSprite renders
        without its own scale — parent scales/positions it instead. */}
    <div
      ref={spriteContainerRef}
      aria-hidden={false}
      className="celly-container fixed z-40 pointer-events-none"
      style={{
        // Initial position before first onUpdate fires — section 0 left.
        left: "30vw",
        top: "50vh",
        transform: "translate(-50%, -50%) scale(0.7)",
        transformOrigin: "center",
        // Round 27 (Shamil): removed position transitions. Celly was
        // visibly "travelling" from old to new spot during the on-stop
        // animation. Now position snaps; only opacity + transform
        // (scale) animate. She appears AT the new spot, not animated
        // toward it.
        transition: "opacity 0.25s ease-out, transform 0.3s ease-out",
      }}
    >
      <CellDragonSprite
        scale={1}
        pointDirection={pointDirection}
        showOuterShell={false}
        // Bubble moved OUTSIDE the sprite (see sibling div below) so its
        // position math isn't affected by sprite's horizontal flip.
        bubbleText={null}
        onClick={() => {
          alert(
            "I'd open a full chat here. For now this is just my intro — production version lets you ask me anything about Erken Systems."
          );
        }}
      />
    </div>
    {/* Bump Celly to full opacity when the cursor is on her. */}
    <style>{`
      .celly-container:hover,
      .celly-container:focus-within {
        opacity: var(--celly-hover-opacity, 1) !important;
      }
    `}</style>

    {/* SVG "gooey" filter for the cloud bubble. Defined once at the
        document level so the bubble can reference it via filter: url(#).
        How it works: Gaussian blur softens all input shapes; the color
        matrix then sharpens the alpha channel back, creating a metaballs
        / blob effect where overlapping shapes melt into ONE continuous
        silhouette. This is what gives the cloud its smooth merged edges
        instead of looking like a grid of circles. */}
    <svg
      aria-hidden
      className="fixed pointer-events-none"
      style={{ width: 0, height: 0, position: "fixed" }}
    >
      <defs>
        <filter id="cloud-goo" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 22 -10
            "
            result="goo"
          />
        </filter>
      </defs>
    </svg>

    {/* Celly's speech bubble — Shamil 2026-05-24 round 12: REAL CLOUD
        via SVG gooey filter. Many overlapping white circles inside a
        filtered container melt into ONE continuous blob silhouette.
        Text sits in a SEPARATE sibling on top (NOT inside the filtered
        container, otherwise text would be blurred too). */}
    <div
      ref={bubbleContainerRef}
      role="button"
      tabIndex={bubbleVisible ? 0 : -1}
      aria-label="Talk to Celly"
      onClick={() => {
        alert(
          "I'd open a full chat here. For now this is just my intro — production version lets you ask me anything about Erken Systems."
        );
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          alert(
            "I'd open a full chat here. For now this is just my intro — production version lets you ask me anything about Erken Systems."
          );
        }
      }}
      className="fixed z-50 cursor-pointer"
      style={{
        width: "22rem",
        right: "100vw",
        bottom: "100vh",
        opacity: bubbleVisible ? 1 : 0,
        transition: "opacity 0.3s ease-out",
        pointerEvents: bubbleVisible ? "auto" : "none",
        filter: "drop-shadow(0 8px 14px rgba(0, 0, 0, 0.18))",
      }}
    >
      {/* Container with gooey filter — puffs inside get merged */}
      <div
        className="absolute inset-0"
        style={{ filter: "url(#cloud-goo)" }}
      >
        {(() => {
          // Cloud-shaped distribution: wider than tall, with extra puffs
          // top and bottom to give cloud-like scalloped edges.
          // Mobile (Shamil 2026-05-25): puffs scaled down so the cloud
          // hugs the short text instead of ballooning around it.
          // Bubble cloud puffs shrink on both viewports now that the SHORT
          // variant + smaller widthRem is universal. Desktop 0.7 keeps
          // the cloud silhouette but tightens it around the text.
          const PUFF_SCALE = isMobile ? 0.4 : 0.7;
          const puffs: React.ReactNode[] = [];
          const ROWS = 4;
          const COLS = 7;
          for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
              const offsetX = (r % 2) * (50 / (COLS - 1));
              const xPct = (c / (COLS - 1)) * 100 + offsetX - 7;
              const yPct = 20 + (r / (ROWS - 1)) * 60;
              puffs.push(
                <div
                  key={`fill-${r}-${c}`}
                  className="absolute bg-white rounded-full"
                  style={{
                    width: `${80 * PUFF_SCALE}px`,
                    height: `${80 * PUFF_SCALE}px`,
                    left: `${xPct}%`,
                    top: `${yPct}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              );
            }
          }
          const topPuffs = [
            { x: 12, y: 5, size: 70 },
            { x: 28, y: -2, size: 90 },
            { x: 45, y: 0, size: 100 },
            { x: 62, y: -3, size: 95 },
            { x: 80, y: 5, size: 75 },
          ];
          topPuffs.forEach((p, i) => {
            puffs.push(
              <div
                key={`top-${i}`}
                className="absolute bg-white rounded-full"
                style={{
                  width: `${p.size * PUFF_SCALE}px`,
                  height: `${p.size * PUFF_SCALE}px`,
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            );
          });
          const botPuffs = [
            { x: 15, y: 92, size: 65 },
            { x: 35, y: 98, size: 80 },
            { x: 55, y: 100, size: 85 },
            { x: 78, y: 92, size: 70 },
          ];
          botPuffs.forEach((p, i) => {
            puffs.push(
              <div
                key={`bot-${i}`}
                className="absolute bg-white rounded-full"
                style={{
                  width: `${p.size * PUFF_SCALE}px`,
                  height: `${p.size * PUFF_SCALE}px`,
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            );
          });
          return puffs;
        })()}
      </div>
      {/* Text content — SEPARATE sibling, NOT inside the goo filter.
          Sits on top of the merged cloud silhouette. Copy is the active
          variant chosen by the auto-positioner (LONG/MEDIUM/SHORT
          depending on available space). */}
      <div className={`relative z-10 ${isMobile ? "px-4 py-4" : "px-6 py-5"}`}>
        <div className={`${isMobile ? "text-[11px]" : "text-[12px]"} leading-relaxed text-neutral-800`}>
          {activeVariant?.text ?? CELLY_INTRO}
        </div>
      </div>
    </div>
    </>
  );
}
