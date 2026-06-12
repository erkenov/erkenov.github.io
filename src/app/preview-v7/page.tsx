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
import { MacbookFrame3D } from "@/components/MacbookFrame3D";
import { Scene1IntroVideo } from "@/components/Scene1IntroVideo";
import { Scene2Channels } from "@/components/Scene2Channels";
import { Scene3LeadCaptureCarousel } from "@/components/Scene3LeadCaptureCarousel";
import { Scene4LeadMgmtCarousel } from "@/components/Scene4LeadMgmtCarousel";
import { SceneIndustriesCarousel } from "@/components/SceneIndustriesCarousel";
import { CellDragonSprite } from "@/components/CellDragonSprite";
import ErkenChatWidget, {
  openErkenChat,
  useErkenChatOpen,
} from "@/components/ErkenChatWidget";
import ErkenVoiceWidget from "@/components/ErkenVoiceWidget";

const SECTIONS = [
  {
    side: "left" as const,
    kicker: "Erken Systems",
    headline: "Full-spectrum business systems, with AI inside.",
    body: "If you can answer your phone, you can run an Erken system. Every business runs the same pipeline — leads come in, get captured, get tracked, get reported on. I build all four steps — bundled as one connected system, or piece by piece. Pick what you're missing. Workflow automation is the wiring between them. One operator. Any business.",
    cta: "Try for free",
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
  stacked = false,
}: SectionProps & { isMobile?: boolean; stacked?: boolean }) {
  const isLeft = side === "left";
  const wrapperClass = mediaWrapperClassName ?? DEFAULT_MEDIA_WRAPPER(isLeft);
  return (
    // When media is stacked under the text the section must NOT be a flex
    // row — otherwise the w-full media lands BESIDE the text column and
    // overflows the viewport (2026-06-10 responsive QA).
    <section
      className={`relative px-6 md:px-12 py-10 ${
        stacked && media
          ? "md:py-16"
          : "md:min-h-screen md:flex md:items-center md:py-0"
      }`}
    >
      {/* 2026-06-10 responsive fix (Shamil: keep side-by-side at EVERY
          width, never stack): the column takes 44% instead of 50% so the
          media wrapper can anchor at the 48vw line without ever crossing
          it, and the type scales down on narrow laptops/tablets instead
          of overflowing into the media. */}
      <div
        data-celly-avoid
        className={`relative z-30 w-full md:w-[44%] ${isLeft ? "md:mr-auto" : "md:ml-auto"} max-w-xl`}
      >
        <div className="mono-label">{kicker}</div>
        <h2
          className="mt-3 text-3xl md:text-4xl xl:text-5xl font-bold tracking-tight"
          style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
        >
          {headline}
        </h2>
        <p className="mt-5 text-base xl:text-lg text-text-muted leading-relaxed">
          {body}
        </p>
        {cta && (
          /* CTA → the /start trial funnel (was the voice call — repositioned
             2026-06-12: the site sells the products, Celly handles talking) */
          <a
            href="/start"
            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-medium text-bg transition-all hover:bg-accent-hover"
          >
            {cta} →
          </a>
        )}
      </div>
      {/* STACKED media — rendered OUTSIDE the text column so it breaks
          out of the max-w-xl cap and spans the full section width.
          (Shamil 2026-05-25: especially needed for the MacBook 3D
          scene that has no side text on mobile.)
          2026-06-10: now also used on TABLET + SMALL-LAPTOP widths —
          the absolute side-by-side wrappers mathematically overlap the
          text column below ~1280px (responsive QA: text painted over
          carousel cards on every width 768–1640), so those widths stack
          text-then-media instead. */}
      {media && (isMobile || stacked) && (
        <div
          {...(mediaAvoidCelly ? { "data-celly-avoid": "" } : {})}
          className="mt-10 w-full"
        >
          {media}
        </div>
      )}
      {media && !isMobile && !stacked && (
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
  // Text/Voice choice menu shown when Celly is clicked, anchored to her
  // current screen position. Text → opens the chat; Voice → starts the call.
  const [choiceMenu, setChoiceMenu] = useState<{ x: number; y: number } | null>(
    null,
  );
  // Sub-panel inside the choice menu (mirrors the extension menu — Shamil
  // 2026-06-12): Feedback (any feedback → /api/feedback → his Telegram) and
  // Roadmap (where Erken is going). null = the plain Text/Voice menu.
  const [menuPanel, setMenuPanel] = useState<"feedback" | "roadmap" | null>(null);
  const [fbText, setFbText] = useState("");
  const [fbState, setFbState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const closeChoiceMenu = () => {
    setChoiceMenu(null);
    setMenuPanel(null);
    setFbText("");
    setFbState("idle");
  };
  const sendSiteFeedback = async () => {
    const message = fbText.trim();
    if (!message || fbState === "sending") return;
    setFbState("sending");
    try {
      const r = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "idea",
          message,
          url: window.location.href,
          title: document.title,
        }),
      });
      setFbState(r.ok ? "sent" : "error");
    } catch {
      setFbState("error");
    }
  };
  const openChoiceMenu = () => {
    setMenuPanel(null);
    const el = spriteContainerRef.current;
    if (el) {
      const r = el.getBoundingClientRect();
      // Keep the (center-anchored) menu within the viewport sides so it can't
      // clip off the left/right edges when Celly roams to a corner.
      const half = 120;
      const x = Math.max(half, Math.min(window.innerWidth - half, r.left + r.width / 2));
      setChoiceMenu({ x, y: r.top + r.height * 0.28 });
    } else {
      setChoiceMenu({ x: window.innerWidth / 2, y: window.innerHeight * 0.5 });
    }
  };
  // True while the GHL chat panel is open. When open, the roaming Celly
  // (+ her bubble) is hidden via the body.erken-chat-open CSS rule below,
  // and a second, docked Celly is rendered beside the chat panel.
  const chatOpen = useErkenChatOpen();
  // Mirrors chatOpen into a ref so SphereScrollStage's onUpdate can freeze
  // scroll-driven cell movement while Celly is docked at the chat.
  const chatFreezeRef = useRef(false);
  useEffect(() => {
    chatFreezeRef.current = chatOpen;
  }, [chatOpen]);
  // Close the Text/Voice menu the moment the user scrolls — otherwise it
  // stays stranded where Celly used to be after she repositions on stop.
  useEffect(() => {
    if (!choiceMenu) return;
    const close = () => closeChoiceMenu();
    window.addEventListener("scroll", close, { passive: true, once: true });
    return () => window.removeEventListener("scroll", close);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choiceMenu]);
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
  // Viewport width — drives per-scene media stacking: the absolute
  // side-by-side media wrappers only have room beside the max-w-xl text
  // column from ~1280px up (MacBook 3D scene: ~1536px). Below that the
  // Section stacks media under the text (2026-06-10 responsive QA fix).
  const [viewportW, setViewportW] = useState(1920);
  useEffect(() => {
    const compute = () => {
      setIsMobile(window.innerWidth < 768);
      setViewportW(window.innerWidth);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);
  // ── Chat dock ──────────────────────────────────────────────────────
  // While the GHL chat is open, pin the REAL Celly — her sprite, the 3D
  // dragon cell, and the dust — to a fixed spot beside the chat panel,
  // re-applying every frame so scroll can't drag her away. Reuses the
  // same vw/vh→world projection the mobile-pin branch uses (round 17-18).
  // On close, the RAF stops and normal roaming resumes. Desktop only —
  // on mobile the chat panel is full-screen.
  useEffect(() => {
    if (!chatOpen) return;
    if (typeof window !== "undefined" && window.innerWidth < 768) return;
    const el = spriteContainerRef.current;
    const DOCK_X_VW = 72; // left of the bottom-right chat panel (tunable)
    const DOCK_Y_VH = 76;
    let raf = 0;
    const pin = () => {
      if (el) {
        el.style.left = `${DOCK_X_VW}vw`;
        el.style.top = `${DOCK_Y_VH}vh`;
        el.style.transform = "translate(-50%, -50%) scale(0.62)";
        el.style.opacity = "1";
      }
      const refs = cellRefsRef.current;
      if (refs) {
        const { cameraZ, fovDeg } = cameraParamsRef.current;
        const verticalHalf = cameraZ * Math.tan((fovDeg / 2) * (Math.PI / 180));
        const aspect =
          window.innerHeight > 0 ? window.innerWidth / window.innerHeight : 16 / 9;
        const horizontalHalf = verticalHalf * aspect;
        const wx = ((DOCK_X_VW - 50) / 100) * (2 * horizontalHalf);
        const wy = ((50 - DOCK_Y_VH) / 100) * (2 * verticalHalf);
        refs.xRef.current = wx;
        refs.yRef.current = wy;
        // Pin the trail refs to the dock too, so no stray dragon/stream
        // lingers or animates at her old spot while scrolling.
        refs.prevXRef.current = wx;
        refs.prevYRef.current = wy;
        refs.nextXRef.current = wx;
        refs.nextYRef.current = wy;
        refs.transitionProgressRef.current = 1;
        refs.segProgressRef.current = 0.5;
        refs.scaleRef.current = 1;
        refs.sphereOpacityRef.current = 1; // dust stays visible (even mid-scroll)
        refs.streamOpacityRef.current = 0;
      }
      raf = requestAnimationFrame(pin);
    };
    raf = requestAnimationFrame(pin);
    return () => cancelAnimationFrame(raf);
  }, [chatOpen]);
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
    if (cellRefsRef.current && !bubbleVisible && !isMobileNow && !chatOpen) {
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
    if (bubbleVisible && el && bubbleEl && !chatOpen) {
      // 1. Apply the desired pointing direction (only changes once per stop).
      if (lastSideRef.current !== lastDesiredDirectionRef.current) {
        lastSideRef.current = lastDesiredDirectionRef.current;
        setPointDirection(lastDesiredDirectionRef.current);
      }
      // Mobile (Shamil 2026-05-25): pin Celly to the bottom-LEFT corner.
      // No findEmptySpot, no scale-from-space — she sits in one fixed
      // place across all sections. Bubble still auto-positions above her.
      if (window.innerWidth < 768) {
        const fixedXVw = 14;
        // Shamil 2026-05-30: raised 94 → 85 → 72 so the bot clears the iOS
        // Safari bottom toolbar (address bar + tabs) even when expanded.
        // Static vh (not dvh) on purpose — dvh made the bot jiggle as the
        // bar animated (tried + reverted earlier).
        const fixedYVh = 72;
        // 2026-06-10 (responsive QA): past the hero the full-width text
        // column occupies the 59–72vh band, so the pinned bubble sat
        // directly on headings/body at almost every scroll stop. Show the
        // intro bubble on the hero only; Celly herself stays pinned.
        const pastHero = window.scrollY > window.innerHeight * 0.6;
        bubbleEl.style.display = pastHero ? "none" : "";
        el.style.left = `${fixedXVw}vw`;
        el.style.top = `${fixedYVh}vh`;
        el.style.transform = "translate(-50%, -50%) scale(0.6)";
        // Tighter bubble: narrower variant (text re-wraps to fewer chars
        // per line but font stays the same), and sits closer to Celly.
        const variant = { ...CELLY_VARIANTS[2], widthRem: 8 };
        setActiveVariant(variant);
        bubbleEl.style.right = "auto";
        bubbleEl.style.bottom = "auto";
        bubbleEl.style.left = `${fixedXVw + 7}vw`;
        bubbleEl.style.top = `${fixedYVh - 13}vh`;
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
      // 2. Find empty spot for Celly. paddingVw/Vh = HALF her sprite at
      //    the SMALLEST scale we'd allow — so finder considers more
      //    candidates. Actual scale is then derived from minDist.
      const natural = lastNaturalPosRef.current;
      const cellyTarget = findEmptySpot({
        preferredXVw: natural.xVw,
        preferredYVh: natural.yVh,
        paddingVw: 4,
        paddingVh: 5,
        // Round 49 (Shamil): drop penalty all the way to 0 — the 0.05
        // version was still letting some scenes land Celly inside text.
        // With 0 weight, the algorithm picks the position with maximum
        // empty space, period, regardless of distance from the cell-
        // dragon's natural Y. Trade-off: she may land in spots that
        // feel slightly disconnected from where the cell-dragon's
        // dust cloud actually is, but it guarantees no content overlap.
        distancePenaltyWeight: 0,
      });
      el.style.left = `${cellyTarget.xVw}vw`;
      el.style.top = `${cellyTarget.yVh}vh`;
      // Celly's SCALE adapts to available empty space (Shamil round
      // 46). When the scene is tight (e.g. Step 4 where the laptop
      // hogs the canvas), minDist is small → Celly shrinks so she
      // (and her bubble) fit beside the obstacle. When there's plenty
      // of room she stays at max scale. Clamped so she's never too
      // small to see or too big to fit.
      // Mobile got half the size 2026-05-25 afternoon; same evening Shamil
      // applied the same shrink to desktop ("50% of what she is now").
      // Both viewports now share these bounds.
      // Shamil 2026-05-30: lock Celly to her smallest size — never grow
      // with available space (was an adaptive 0.6–1.0 scaleFromSpace).
      const MIN_SCALE = 0.6;
      const scaleFromSpace = MIN_SCALE;
      el.style.transform = `translate(-50%, -50%) scale(${scaleFromSpace})`;

      // VIEWPORT EDGE CLAMP for Celly herself (Shamil 2026-05-24 round
      // 44 — sprite was getting clipped, especially head, when
      // findEmptySpot picked a spot near a viewport edge that didn't
      // account for the sprite's full scaled half-size). Same approach
      // as the bubble clamp below: measure post-layout and shove back
      // in if any edge would clip.
      requestAnimationFrame(() => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const vw = window.innerWidth / 100;
        const vh = window.innerHeight / 100;
        const SAFE_MARGIN_PX = 12;
        let dxPx = 0;
        let dyPx = 0;
        if (rect.left < SAFE_MARGIN_PX) dxPx = SAFE_MARGIN_PX - rect.left;
        else if (rect.right > window.innerWidth - SAFE_MARGIN_PX)
          dxPx = window.innerWidth - SAFE_MARGIN_PX - rect.right;
        if (rect.top < SAFE_MARGIN_PX) dyPx = SAFE_MARGIN_PX - rect.top;
        else if (rect.bottom > window.innerHeight - SAFE_MARGIN_PX)
          dyPx = window.innerHeight - SAFE_MARGIN_PX - rect.bottom;
        if (dxPx !== 0 || dyPx !== 0) {
          const newXVw = cellyTarget.xVw + dxPx / vw;
          const newYVh = cellyTarget.yVh + dyPx / vh;
          el.style.left = `${newXVw}vw`;
          el.style.top = `${newYVh}vh`;
        }
      });
      // 3. Find empty spot for bubble — must stay NEAR Celly (Shamil
      //    2026-05-24 round 16: bubble was wandering to opposite corners).
      //    Hard cap of 25vw from Celly, plus much heavier distance
      //    penalty so the finder strongly prefers nearby spots.
      //
      //    Round 47 (Shamil hypothesis confirmed): the avoid rect uses
      //    Celly's CENTER, but the check only verifies the bubble's
      //    CENTER is outside the rect — bubble body can still extend
      //    INTO Celly's space, covering her head. Fixes:
      //      (a) Convert rem→vh/vw using actual viewport (was treating
      //          rem-values as vh/vw directly, undersizing by ~30%).
      //      (b) Inflate the avoid rect by the BUBBLE's half-size per
      //          variant, so the bubble's body can't reach Celly's body.
      //    The CellDragonSprite container is 13rem × 13rem at scale 1.
      //    Inside it sits a 5.5×9.5rem body (button) + dangling hands.
      //    We use a visible half-extent that covers head+body+hands.
      const remToVw = 16 / Math.max(1, window.innerWidth / 100);
      const remToVh = 16 / Math.max(1, window.innerHeight / 100);
      const VISIBLE_HALF_W_REM = 3.4; // half of widest part (hands flare ~6.8rem at scale 1)
      const VISIBLE_HALF_H_REM = 5.0; // half of tallest part — covers head dome at top
      const cellyHalfVw = VISIBLE_HALF_W_REM * scaleFromSpace * remToVw;
      const cellyHalfVh = VISIBLE_HALF_H_REM * scaleFromSpace * remToVh;
      const FIT_THRESHOLD = 2;
      // Re-tuned (Shamil 2026-05-25 late evening): at 12 the bubble had
      // nowhere to go on Section 0 (Erken intro — text on left, Celly
      // on left) and the soft fallback landed it on top of Celly. 20vw
      // gives findEmptySpot enough room to escape her avoid rect while
      // still keeping the bubble visually tethered to her.
      const MAX_BUBBLE_DIST_FROM_CELLY = 20;
      let chosenVariant: BubbleVariant | null = null;
      let chosenTarget = { xVw: 50, yVh: 50, minDist: 0 };

      const buildCellyAvoid = (variant: BubbleVariant): AvoidRect => {
        // Bubble body extents — half-width straight from widthRem, half-
        // height estimated as ~45% of widthRem (cloud shape with text
        // wrap roughly proportional to width). Plus an extra 4vh top/
        // bottom padding so the bubble doesn't sit right on her head
        // even when math is generous (Shamil round 48 still seeing
        // touching).
        const bubbleHalfWVw = (variant.widthRem / 2) * remToVw;
        const bubbleHalfHVh = (variant.widthRem * 0.45 / 2) * remToVh;
        const EXTRA_GAP_VH = 4;
        return {
          left: cellyTarget.xVw - cellyHalfVw - bubbleHalfWVw,
          right: cellyTarget.xVw + cellyHalfVw + bubbleHalfWVw,
          top: cellyTarget.yVh - cellyHalfVh - bubbleHalfHVh - EXTRA_GAP_VH,
          bottom: cellyTarget.yVh + cellyHalfVh + bubbleHalfHVh + EXTRA_GAP_VH,
        };
      };

      // SHORT-only on both viewports (Shamil 2026-05-25 evening): the
      // long pitch never landed visually — bubble too big, copy felt
      // sales-y. The one-liner reads cleaner and matches mobile.
      // Width re-tuned: at 9rem the desktop bubble read like a "poem"
      // (text wrapping to too many lines). Back up to 11rem; paired
      // with smaller 12px text below.
      const variants = [
        { ...CELLY_VARIANTS[2], widthRem: isMobile ? 8 : 9 },
      ];
      for (const variant of variants) {
        const cellyAvoid = buildCellyAvoid(variant);
        const target = findEmptySpot({
          preferredXVw: cellyTarget.xVw,
          // Bias the preferred Y so it lands ABOVE her head, not just
          // 16vh above her center.
          preferredYVh:
            cellyTarget.yVh - cellyHalfVh - (variant.widthRem * 0.45 / 2) * remToVh - 8,
          paddingVw: variant.paddingVw,
          paddingVh: variant.paddingVh,
          extraAvoidRects: [cellyAvoid],
          maxDistFromAnchor: MAX_BUBBLE_DIST_FROM_CELLY,
          distancePenaltyWeight: 1.2,
        });
        if (target.minDist >= FIT_THRESHOLD) {
          chosenVariant = variant;
          chosenTarget = target;
          break;
        }
      }
      if (!chosenVariant) {
        chosenVariant = variants[variants.length - 1];
        const cellyAvoid = buildCellyAvoid(chosenVariant);
        chosenTarget = findEmptySpot({
          preferredXVw: cellyTarget.xVw,
          preferredYVh:
            cellyTarget.yVh -
            cellyHalfVh -
            (chosenVariant.widthRem * 0.45 / 2) * remToVh -
            8,
          paddingVw: chosenVariant.paddingVw,
          paddingVh: chosenVariant.paddingVh,
          extraAvoidRects: [cellyAvoid],
          maxDistFromAnchor: MAX_BUBBLE_DIST_FROM_CELLY,
          distancePenaltyWeight: 1.2,
        });
      }
      setActiveVariant(chosenVariant);
      bubbleEl.style.right = "auto";
      bubbleEl.style.bottom = "auto";
      bubbleEl.style.left = `${chosenTarget.xVw}vw`;
      bubbleEl.style.top = `${chosenTarget.yVh}vh`;
      bubbleEl.style.transform = "translate(-50%, -50%)";
      bubbleEl.style.width = `${chosenVariant.widthRem}rem`;

      // VIEWPORT EDGE CLAMP (Shamil 2026-05-24 round 42). In tight
      // scenes like Step 4 where the laptop dominates and Celly gets
      // jammed near a viewport edge, findEmptySpot's paddingVw can be
      // under-estimated (the bubble's rendered width includes padding
      // and text wrap that exceeds the declared `widthRem`). Measure
      // the bubble AFTER layout and shove it back inside if it spills
      // off the page. We prefer staying in-bounds over staying perfectly
      // centered relative to Celly.
      requestAnimationFrame(() => {
        if (!bubbleEl) return;
        const rect = bubbleEl.getBoundingClientRect();
        const vw = window.innerWidth / 100;
        const vh = window.innerHeight / 100;
        const SAFE_MARGIN_PX = 12; // keep this many px from each edge
        let dxPx = 0;
        let dyPx = 0;
        if (rect.left < SAFE_MARGIN_PX) dxPx = SAFE_MARGIN_PX - rect.left;
        else if (rect.right > window.innerWidth - SAFE_MARGIN_PX)
          dxPx = window.innerWidth - SAFE_MARGIN_PX - rect.right;
        if (rect.top < SAFE_MARGIN_PX) dyPx = SAFE_MARGIN_PX - rect.top;
        else if (rect.bottom > window.innerHeight - SAFE_MARGIN_PX)
          dyPx = window.innerHeight - SAFE_MARGIN_PX - rect.bottom;
        if (dxPx !== 0 || dyPx !== 0) {
          const newXVw = chosenTarget.xVw + dxPx / vw;
          const newYVh = chosenTarget.yVh + dyPx / vh;
          bubbleEl.style.left = `${newXVw}vw`;
          bubbleEl.style.top = `${newYVh}vh`;
        }
      });

      // 4. Animate cell-dragon flying from its LAST position to Celly's
      //    new spot, then expanding (Shamil 2026-05-24 round 20 — path 3).
      //    Three phases: (a) trail flies prev→new over 400ms, (b) cell
      //    expands at new spot over 250ms, (c) trail fades out over 200ms
      //    (overlaps with expand).
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
        const targetX = ((cellyTarget.xVw - 50) / 100) * (2 * horizontalHalf);
        const targetY = ((50 - cellyTarget.yVh) / 100) * (2 * verticalHalf);
        // Starting position = dragon's CURRENT HEAD if there was scroll
        // (pen-tip where drawing ended), otherwise last cell pos, or
        // current refs as final fallback. Shamil round 23.
        // (Rounds 45 + 46 reverted at Shamil's request — neither
        // tail-anchor variant felt right. Coming back to this another
        // day; not urgent.)
        const startX =
          dragonHeadWorldPosRef.current?.x ??
          lastCellWorldPosRef.current?.x ??
          refs.xRef.current;
        const startY =
          dragonHeadWorldPosRef.current?.y ??
          lastCellWorldPosRef.current?.y ??
          refs.yRef.current;
        // Clear head ref — next scroll will set it again.
        dragonHeadWorldPosRef.current = null;
        // Cancel any in-flight animation so we don't have two updating
        // the same refs.
        if (cellAnimRafRef.current !== null) {
          cancelAnimationFrame(cellAnimRafRef.current);
          cellAnimRafRef.current = null;
        }
        // Setup phase A: trail from start to target, cell invisible.
        refs.prevXRef.current = startX;
        refs.prevYRef.current = startY;
        refs.nextXRef.current = targetX;
        refs.nextYRef.current = targetY;
        refs.segProgressRef.current = 0;
        refs.transitionProgressRef.current = 1;
        refs.streamOpacityRef.current = 1;
        refs.scaleRef.current = 0;
        refs.sphereOpacityRef.current = 0;
        // Run the animation. Total budget ~600ms.
        const FLY_MS = 400;
        const EXPAND_MS = 250;
        const animStart = performance.now();
        const tick = (now: number) => {
          const elapsed = now - animStart;
          // Trail position progress 0..1 over first FLY_MS.
          const flyT = Math.min(1, elapsed / FLY_MS);
          refs.segProgressRef.current = flyT;
          // Cell xRef/yRef track the trail's leading point — lerp from
          // start to target. So when trail finishes, cell is at target.
          refs.xRef.current = startX + (targetX - startX) * flyT;
          refs.yRef.current = startY + (targetY - startY) * flyT;
          // After fly finishes, expand cell + fade trail.
          if (elapsed >= FLY_MS) {
            const expandT = Math.min(1, (elapsed - FLY_MS) / EXPAND_MS);
            refs.scaleRef.current = expandT;
            refs.sphereOpacityRef.current = expandT;
            refs.streamOpacityRef.current = 1 - expandT;
          }
          if (elapsed < FLY_MS + EXPAND_MS) {
            cellAnimRafRef.current = requestAnimationFrame(tick);
          } else {
            // Done — snap final values.
            refs.scaleRef.current = 1;
            refs.sphereOpacityRef.current = 1;
            refs.streamOpacityRef.current = 0;
            refs.xRef.current = targetX;
            refs.yRef.current = targetY;
            cellAnimRafRef.current = null;
            lastCellWorldPosRef.current = { x: targetX, y: targetY };
          }
        };
        cellAnimRafRef.current = requestAnimationFrame(tick);
      }
    }
  }, [bubbleVisible, isMobile, chatOpen]);
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
      // Chat docked: the dock pin owns the cell; ignore scroll entirely so
      // the dust doesn't slide off to the old scroll-driven spot.
      if (chatFreezeRef.current) return;
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
          const targetY = ((50 - 72) / 100) * (2 * verticalHalf);
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
      showDust
      freezeRef={chatFreezeRef}
      onCellPositionChange={handleCellMove}
      onCellRefsReady={(refs) => {
        cellRefsRef.current = refs;
        // On mobile, immediately pin the cell to Celly's bottom-left
        // spot so the very first frame doesn't show a giant center-left
        // dust cloud (Shamil 2026-05-25 evening).
        if (typeof window !== "undefined" && window.innerWidth < 768) {
          // Use the SphereScrollStage mobile camera defaults — exact
          // params live in cameraParamsRef which the page populates on
          // the first onCellPositionChange tick.
          const cameraZ = 2.2;
          const fovDeg = 50;
          const halfFovRad = (fovDeg / 2) * (Math.PI / 180);
          const verticalHalf = cameraZ * Math.tan(halfFovRad);
          const aspect =
            window.innerHeight > 0
              ? window.innerWidth / window.innerHeight
              : 16 / 9;
          const horizontalHalf = verticalHalf * aspect;
          refs.xRef.current = ((14 - 50) / 100) * (2 * horizontalHalf);
          refs.yRef.current = ((50 - 72) / 100) * (2 * verticalHalf);
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
      // Mobile (Shamil 2026-05-25): trailing dragon disabled. Keep just
      // the cell/dust cloud around Celly — no chasing snake of particles.
      hideTrail={isMobile}
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
          // Side-by-side at EVERY md+ width (Shamil 2026-06-10: "carousel
          // on one side, text on the other" must hold on TVs and small
          // laptops too — no stacking). The non-overlap guarantee comes
          // from the 44%-wide text column + media anchored at the 48vw
          // line below. Stacking remains mobile-only (<768).
          stacked={false}
          {...s}
          media={
            i === 0 ? <Scene1IntroVideo />
            : i === 1 ? <Scene2Channels />
            : i === 2 ? <Scene3LeadCaptureCarousel />
            : i === 3 ? <Scene4LeadMgmtCarousel />
            : i === 4 ? <MacbookFrame3D />
            : null
          }
          mediaWrapperClassName={
            // Opaque HTML media gets a tight wrapper anchored opposite
            // the text column so it doesn't overlap the copy.
            //  - Scenes 0, 2 have text on the LEFT, so media anchors RIGHT.
            //  - Scenes 1, 3 have text on the RIGHT, so media anchors LEFT.
            //  - Scene 4 (MacBook) uses the default wide wrapper.
            // 2026-06-10 responsive fix: anchors bounded at the 48vw line
            // so they can never cross the (44%-wide, max-w-xl-capped) text
            // column at ANY md+ width — the old anchors mathematically
            // overlapped it below ~1640px. From 2xl: up the original wider
            // anchors apply (text is capped at 576px there, leaving room).
            i === 0
              ? "absolute inset-y-[8vh] right-[4vw] left-[48vw] 2xl:left-auto 2xl:w-[50%] hidden md:flex items-center justify-center pointer-events-auto"
              : i === 2
              ? // Lead Capture carousel — anchored on BOTH sides
                // (Shamil 2026-05-24). 2xl left edge moved 38vw → 42vw
                // (2026-06-10): 38vw still crossed the text column up to
                // ~1642px wide.
                "absolute inset-y-[8vh] left-[48vw] right-[3vw] 2xl:left-[42vw] hidden md:flex items-center justify-center pointer-events-auto"
              : i === 1 || i === 3
              ? "absolute inset-y-[8vh] left-[4vw] right-[48vw] 2xl:right-auto 2xl:w-[55%] hidden md:flex items-center justify-start pointer-events-auto"
              : i === 4
              ? // MacBook scene — confined to section bounds since
                // 2026-05-25 (lid bleed). 2026-06-10: anchored to the
                // RIGHT half below 1920px — the centered full-width canvas
                // put the laptop model under the text column (verified by
                // screenshot at 1536). At 1920+ the original centered
                // full-bleed layout applies unchanged.
                "absolute inset-y-0 left-[44vw] right-0 min-[1920px]:left-0 hidden md:flex items-center justify-center px-2 lg:px-4 pointer-events-none"
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
      <section className="relative px-6 md:px-12 pt-36 md:pt-52 pb-16 md:pb-24">
        {/* Text block pushed FURTHER down (Shamil 2026-05-26 morning):
            laptop shadow from the section above was covering the headline.
            pt-28/40 → pt-36/52 brings the text down, and mb-10/14 → mb-6/8
            shrinks the gap to the carousel below — net halfway closure
            of the text-to-carousel gap, carousel stays put. */}
        <div
          data-celly-avoid
          className="relative z-30 max-w-3xl mx-auto mb-6 md:mb-8 text-center"
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
          openChoiceMenu();
        }}
      />
    </div>
    {/* Docked Celly — appears beside the GHL chat panel (always
        bottom-right) while the chat is open, so it reads as "you're
        chatting with Celly." The roaming Celly is hidden via CSS above.
        Hidden on mobile, where the chat panel is full-screen. */}
    <ErkenChatWidget />
    <ErkenVoiceWidget />
    {/* Text/Voice choice menu — appears at Celly when she's clicked. */}
    {choiceMenu && (
      <>
        <div
          className="fixed inset-0 z-[55]"
          aria-hidden
          onClick={closeChoiceMenu}
        />
        <div
          role="menu"
          aria-label="How would you like to talk to Erken?"
          className="fixed z-[56] flex flex-col gap-1 rounded-2xl border border-white/15 bg-black/80 p-2 shadow-2xl backdrop-blur-md"
          style={{
            left: choiceMenu.x,
            top: choiceMenu.y,
            // Open ABOVE Celly normally; when she's near the top of the page the
            // menu would be clipped behind the browser bar, so flip it to open
            // BELOW her instead. (~260px ≈ tallest panel height + margin.)
            transform: choiceMenu.y < 260
              ? "translate(-50%, 12%)"
              : "translate(-50%, -115%)",
          }}
        >
          {menuPanel === null && (
            <>
              <div className="px-3 pb-1 pt-1 text-xs text-white/55">
                Talk to Erken
              </div>
              <button
                role="menuitem"
                onClick={() => {
                  closeChoiceMenu();
                  openErkenChat();
                }}
                className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm text-white transition-colors hover:bg-white/15"
              >
                <span aria-hidden className="text-base">
                  💬
                </span>{" "}
                Text chat
              </button>
              <button
                role="menuitem"
                onClick={() => {
                  closeChoiceMenu();
                  window.__startErkenVoiceCall?.();
                }}
                className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm text-white transition-colors hover:bg-white/15"
              >
                <span aria-hidden className="text-base">
                  🎙️
                </span>{" "}
                Voice chat
              </button>
              <div className="mx-2 h-px bg-white/10" aria-hidden />
              <button
                role="menuitem"
                onClick={() => setMenuPanel("feedback")}
                className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm text-white transition-colors hover:bg-white/15"
              >
                <span aria-hidden className="text-base">
                  📝
                </span>{" "}
                Feedback
              </button>
              <button
                role="menuitem"
                onClick={() => setMenuPanel("roadmap")}
                className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm text-white transition-colors hover:bg-white/15"
              >
                <span aria-hidden className="text-base">
                  🗺️
                </span>{" "}
                Roadmap
              </button>
              {/* LIVE on the Chrome Web Store since 2026-06-12 🎉 */}
              <a
                role="menuitem"
                href="https://chromewebstore.google.com/detail/erken/mggcbjggcbdpmbglbodkadgmpapcmelc"
                target="_blank"
                rel="noopener"
                className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm text-white transition-colors hover:bg-white/15"
              >
                <span aria-hidden className="text-base">
                  🧩
                </span>{" "}
                Add the browser extension
              </a>
            </>
          )}
          {menuPanel === "roadmap" && (
            <div className="w-[280px] px-3 py-2 text-sm text-white">
              <div className="pb-1.5 text-xs text-white/55">
                Where Erken is going
              </div>
              <div className="flex flex-col gap-1.5 leading-snug">
                <div>
                  📚 <b>New skills in training:</b> Excel &amp; Google Sheets,
                  Canva, QuickBooks — taught step by step
                </div>
                <div>🔊 Voice answers on every page</div>
                <div>
                  🧠 <b>Personal memory:</b> Erken remembers you — your
                  business, your setup, what you&apos;ve already learned
                </div>
                <div>
                  🖥️ <b>Desktop version on the way</b> — unlike the browser
                  extension, it can do tasks on your computer for you
                </div>
              </div>
              <div className="pt-2 text-xs text-white/55">
                Your vote decides what Erken learns next — tell us via 📝
                Feedback.
              </div>
            </div>
          )}
          {menuPanel === "feedback" && (
            <div className="w-[280px] px-3 py-2">
              <div className="pb-1.5 text-xs text-white/55">
                Your feedback — bugs, ideas, anything
              </div>
              {fbState === "sent" ? (
                <div className="py-2 text-sm text-white">
                  ✅ Got it — passed along. Thank you!
                </div>
              ) : (
                <>
                  <textarea
                    value={fbText}
                    onChange={(e) => setFbText(e.target.value)}
                    rows={3}
                    autoFocus
                    className="w-full resize-none rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40 outline-none focus:border-white/30"
                    placeholder="Tell us…"
                  />
                  <button
                    onClick={sendSiteFeedback}
                    disabled={fbState === "sending" || !fbText.trim()}
                    className="mt-1.5 w-full rounded-xl bg-white/15 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/25 disabled:opacity-40"
                  >
                    {fbState === "sending"
                      ? "Sending…"
                      : fbState === "error"
                        ? "Couldn't send — try again"
                        : "Send"}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </>
    )}
    {/* Bump Celly to full opacity when the cursor is on her. */}
    <style>{`
      .celly-container:hover,
      .celly-container:focus-within {
        opacity: var(--celly-hover-opacity, 1) !important;
      }
      /* While the chat is open, only Celly's intro bubble steps aside —
         the real Celly herself flies to the chat dock (pinned via the
         chat-dock effect), so we do NOT hide .celly-container. */
      body.erken-chat-open [aria-label="Talk to Celly"] {
        opacity: 0 !important;
        pointer-events: none !important;
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
        openChoiceMenu();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          openChoiceMenu();
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
