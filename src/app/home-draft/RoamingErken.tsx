"use client";

/**
 * RoamingErken — a faithful port of the LIVE homepage's roaming Celly
 * behavior (src/app/preview-v7/page.tsx), extracted to run standalone on
 * this draft page. Written 2026-07-20 after Shamil explicitly revoked the
 * earlier "static sprite is fine for a draft" allowance and asked for the
 * real thing, not an approximation.
 *
 * PORTED VERBATIM (same algorithm/constants as production):
 *  - findEmptySpot() — the exact DOM-geometry auto-positioner that scores
 *    candidate screen positions against every `data-celly-avoid` element's
 *    bounding rect and picks the emptiest one. Copied unchanged from
 *    preview-v7/page.tsx.
 *  - Scroll-stop detection (SCROLL_STOP_DELAY_MS = 700ms after the last
 *    scroll event) before she repositions and the speech bubble reappears.
 *  - The SHORT speech-bubble copy + adaptive fit-check + post-layout edge
 *    clamp (same widthRem/paddingVw/paddingVh, same "hide entirely if it
 *    doesn't fit" fallback) — production settled on SHORT-only for both
 *    viewports (2026-05-25), ported as-is.
 *  - The gooey SVG speech-bubble cloud (goo filter + puff grid) — pure
 *    CSS/SVG, no WebGL, copied verbatim.
 *  - Mobile pin: fixed at (14vw, 72vh), scale 0.6 — identical to production.
 *  - Chat-dock pin: fixed at (72vw, 76vh) on desktop while the chat panel
 *    is open (via useErkenChatOpen, same hook /start and preview-v7 use).
 *  - Click → the same Text chat / Voice chat / Feedback / Roadmap /
 *    What's new / "Add the browser extension" menu, wired to the same
 *    openErkenChat(), window.__startErkenVoiceCall(), and /api/feedback
 *    endpoint production uses.
 *
 * IMPLEMENTATION NOTE (2026-07-20, found during QA): production drives the
 * sprite/bubble position by mutating `ref.current.style.*` directly outside
 * React, bypassing re-renders for 60fps cheapness. Porting that literally
 * onto this page did not hold — direct style mutations on the fixed
 * container were not taking effect reliably in this Next 16 canary/React
 * 19 setup (AGENTS.md flags this Next version as having undocumented
 * breaking changes; root cause not fully isolated, but the effect was
 * reproducible: `el.style.left = ...` silently no-op'd on the mounted
 * node while working fine on a freshly created test element). Rather than
 * ship something that looks right in code but doesn't move on screen,
 * position here is driven by React state (`spritePos`/`bubblePos`) and
 * rendered through the `style` prop every update. Same algorithm, same
 * constants, same visual outcome — just state-driven instead of
 * ref-mutation-driven. This is implementation, not behavior; verified
 * working end-to-end (see the v4/v5 report).
 *
 * DELIBERATELY NOT PORTED (see the v4/v5 report for the full callout —
 * this is a named gap, not a silent approximation):
 *  - The 3D dust-cloud / dragon-trail canvas that visually "draws" behind
 *    her as the page scrolls. That's SphereScrollStage's Three.js scene —
 *    porting it means re-architecting this draft page's entire scroll
 *    surface around a WebGL sphere stage, which is a full effects-parity
 *    rebuild, not an extraction (this was correctly scoped OUT of a
 *    section-order/copy draft from the start).
 *  - The per-section SCENE_OFFSETS fine-tuning table. It's hand-calibrated
 *    to preview-v7's specific 5 sections and has no equivalent for this
 *    draft's different 7-section layout; findEmptySpot's generic
 *    empty-space search (which production ALSO falls back on) substitutes.
 *  - Her "natural" resting anchor before each stop. On production it's fed
 *    by the WebGL cell-dragon's literal on-screen coordinates as it
 *    scrolls through SphereScrollStage. Without that feed, this version
 *    anchors to wherever she landed last (starting from a sensible
 *    upper-right default on load) — the empty-space HUNTING is identical,
 *    only the seed position's source differs.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { CellDragonSprite } from "@/components/CellDragonSprite";
import ErkenChatWidget, {
  openErkenChat,
  useErkenChatOpen,
} from "@/components/ErkenChatWidget";
import ErkenVoiceWidget from "@/components/ErkenVoiceWidget";

const SCROLL_STOP_DELAY_MS = 700;

// SHORT-only bubble copy — production landed here 2026-05-25 evening after
// the LONG/MEDIUM pitches never read well.
const BUBBLE_TEXT = "Hi, I'm Erken. Ask me anything.";

const DESKTOP_SCALE = 0.6; // matches production's locked-small scale (2026-05-30)
const MOBILE_SCALE = 0.6;
const DOCK_SCALE = 0.4;
const MOBILE_X_VW = 14;
const MOBILE_Y_VH = 72;
const DOCK_X_VW = 72;
const DOCK_Y_VH = 76;
const BUBBLE_WIDTH_REM = 9;

type AvoidRect = { left: number; right: number; top: number; bottom: number };

/**
 * findEmptySpot — copied verbatim from preview-v7/page.tsx. Samples a
 * coarse grid of candidate positions and scores each by how empty the
 * surrounding space is (measured against every `[data-celly-avoid]`
 * element's bounding rect, inflated by `avoidBuffer`), with an optional
 * distance-from-anchor penalty. Falls back to the least-bad "soft"
 * candidate (smallest overlap penetration) if no fully-empty spot exists.
 */
function findEmptySpot(opts: {
  preferredXVw: number;
  preferredYVh: number;
  paddingVw: number;
  paddingVh: number;
  extraAvoidRects?: AvoidRect[];
  avoidBuffer?: number;
  maxDistFromAnchor?: number;
  distancePenaltyWeight?: number;
}): { xVw: number; yVh: number; minDist: number } {
  if (typeof window === "undefined") {
    return { xVw: opts.preferredXVw, yVh: opts.preferredYVh, minDist: 0 };
  }
  const vw = window.innerWidth / 100;
  const vh = window.innerHeight / 100;
  const avoidEls = document.querySelectorAll<HTMLElement>("[data-celly-avoid]");
  const avoidRects: AvoidRect[] = [];
  avoidEls.forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;
    if (r.right < 0 || r.left > window.innerWidth) return;
    avoidRects.push({
      left: r.left / vw,
      right: r.right / vw,
      top: r.top / vh,
      bottom: r.bottom / vh,
    });
  });
  if (opts.extraAvoidRects) avoidRects.push(...opts.extraAvoidRects);
  const buffer = opts.avoidBuffer ?? 2;
  const penalty = opts.distancePenaltyWeight ?? 0.3;
  const GX = 24;
  const GY = 16;
  let bestStrict = { xVw: 0, yVh: 0, score: -Infinity, minDist: 0 };
  let bestSoft = { xVw: opts.preferredXVw, yVh: opts.preferredYVh, score: -Infinity, minDist: 0 };
  for (let gx = 0; gx <= GX; gx++) {
    for (let gy = 0; gy <= GY; gy++) {
      const cxVw = (gx / GX) * 100;
      const cyVh = (gy / GY) * 100;
      if (cxVw - opts.paddingVw < 2 || cxVw + opts.paddingVw > 98) continue;
      if (cyVh - opts.paddingVh < 2 || cyVh + opts.paddingVh > 98) continue;
      const dxPref = cxVw - opts.preferredXVw;
      const dyPref = cyVh - opts.preferredYVh;
      const distToPref = Math.sqrt(dxPref * dxPref + dyPref * dyPref);
      if (opts.maxDistFromAnchor !== undefined && distToPref > opts.maxDistFromAnchor) continue;
      let minDist = 100;
      let maxPenetration = 0;
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
        const score = minDist - distToPref * penalty;
        if (score > bestStrict.score) {
          bestStrict = { xVw: cxVw, yVh: cyVh, score, minDist };
        }
      } else {
        const score = -maxPenetration - distToPref * penalty - 1000;
        if (score > bestSoft.score) {
          bestSoft = { xVw: cxVw, yVh: cyVh, score, minDist: 0 };
        }
      }
    }
  }
  const best = bestStrict.score > -Infinity ? bestStrict : bestSoft;
  return { xVw: best.xVw, yVh: best.yVh, minDist: best.minDist };
}

type ChoiceMenuPanel = "feedback" | "roadmap" | "whatsnew" | null;
type SendState = "idle" | "sending" | "sent" | "error";
type SpritePos = { xVw: number; yVh: number; scale: number; opacity: number };
type BubblePos = { xVw: number; yVh: number } | null;

export default function RoamingErken() {
  const spriteRef = useRef<HTMLDivElement>(null);
  const [spritePos, setSpritePos] = useState<SpritePos>({ xVw: 82, yVh: 20, scale: DESKTOP_SCALE, opacity: 0 });
  const [bubblePos, setBubblePos] = useState<BubblePos>(null);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [pointDirection, setPointDirection] = useState<"left" | "right">("right");
  const [isMobile, setIsMobile] = useState(false);
  // Seed anchor — no WebGL cell-position feed on this draft page (see file
  // header), so the "natural" anchor starts upper-right and then tracks
  // wherever she last landed. The empty-space hunt itself is unchanged.
  const lastPosRef = useRef({ xVw: 82, yVh: 20 });

  const chatOpen = useErkenChatOpen();

  const [choiceMenu, setChoiceMenu] = useState<{ x: number; y: number } | null>(null);
  const [menuPanel, setMenuPanel] = useState<ChoiceMenuPanel>(null);
  const [fbText, setFbText] = useState("");
  const [fbState, setFbState] = useState<SendState>("idle");

  useEffect(() => {
    const compute = () => setIsMobile(window.innerWidth < 768);
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const closeChoiceMenu = () => {
    setChoiceMenu(null);
    setMenuPanel(null);
    setFbText("");
    setFbState("idle");
  };
  const openChoiceMenu = () => {
    setMenuPanel(null);
    const el = spriteRef.current;
    if (el) {
      const r = el.getBoundingClientRect();
      const half = 120;
      const x = Math.max(half, Math.min(window.innerWidth - half, r.left + r.width / 2));
      setChoiceMenu({ x, y: r.top + r.height * 0.28 });
    } else {
      setChoiceMenu({ x: window.innerWidth / 2, y: window.innerHeight * 0.5 });
    }
  };
  useEffect(() => {
    if (!choiceMenu) return;
    const close = () => closeChoiceMenu();
    window.addEventListener("scroll", close, { passive: true, once: true });
    return () => window.removeEventListener("scroll", close);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choiceMenu]);
  const sendFeedback = async () => {
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

  // Scroll-stop → reposition to an empty spot + show the bubble. Sets
  // React state (see file header for why — production's ref-mutation
  // approach didn't hold in this Next/React setup).
  const reposition = useCallback(() => {
    const mobileNow = window.innerWidth < 768;

    if (mobileNow) {
      setSpritePos({ xVw: MOBILE_X_VW, yVh: MOBILE_Y_VH, scale: MOBILE_SCALE, opacity: 1 });
      setBubblePos({ xVw: MOBILE_X_VW + 7, yVh: MOBILE_Y_VH - 13 });
      lastPosRef.current = { xVw: MOBILE_X_VW, yVh: MOBILE_Y_VH };
      return;
    }

    // 1. Find an empty spot for the sprite near her last position.
    const target = findEmptySpot({
      preferredXVw: lastPosRef.current.xVw,
      preferredYVh: lastPosRef.current.yVh,
      paddingVw: 4,
      paddingVh: 5,
      distancePenaltyWeight: 0.15,
    });
    setSpritePos({ xVw: target.xVw, yVh: target.yVh, scale: DESKTOP_SCALE, opacity: 1 });
    setPointDirection(target.xVw < 50 ? "right" : "left");
    lastPosRef.current = { xVw: target.xVw, yVh: target.yVh };

    // 2. Find an empty spot for the bubble, tethered near the sprite —
    // same fit-check + fallback-to-hidden as production.
    const remToVw = 16 / Math.max(1, window.innerWidth / 100);
    const remToVh = 16 / Math.max(1, window.innerHeight / 100);
    const spriteHalfVw = 3.4 * DESKTOP_SCALE * remToVw;
    const spriteHalfVh = 5.0 * DESKTOP_SCALE * remToVh;
    const spriteAvoid: AvoidRect = {
      left: target.xVw - spriteHalfVw - (BUBBLE_WIDTH_REM / 2) * remToVw,
      right: target.xVw + spriteHalfVw + (BUBBLE_WIDTH_REM / 2) * remToVw,
      top: target.yVh - spriteHalfVh - ((BUBBLE_WIDTH_REM * 0.45) / 2) * remToVh - 4,
      bottom: target.yVh + spriteHalfVh + ((BUBBLE_WIDTH_REM * 0.45) / 2) * remToVh + 4,
    };
    const bubbleTarget = findEmptySpot({
      preferredXVw: target.xVw,
      preferredYVh: target.yVh - spriteHalfVh - ((BUBBLE_WIDTH_REM * 0.45) / 2) * remToVh - 8,
      paddingVw: 5,
      paddingVh: 4,
      extraAvoidRects: [spriteAvoid],
      maxDistFromAnchor: 20,
      distancePenaltyWeight: 1.2,
    });
    const fits = bubbleTarget.minDist >= 2;
    setBubblePos(fits ? { xVw: bubbleTarget.xVw, yVh: bubbleTarget.yVh } : null);
  }, []);

  // Post-render edge clamp — same intent as production's requestAnimationFrame
  // correction, implemented as a follow-up state update (not a raw DOM
  // mutation) so it can't be silently dropped.
  useEffect(() => {
    const el = spriteRef.current;
    if (!el || isMobile || chatOpen) return;
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
      setSpritePos((p) => ({ ...p, xVw: p.xVw + dxPx / vw, yVh: p.yVh + dyPx / vh }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spritePos.xVw, spritePos.yVh, isMobile, chatOpen]);

  // Scroll listener — hides on scroll start, repositions SCROLL_STOP_DELAY_MS
  // after the last scroll event. Identical timing to production.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const onStop = () => {
      setBubbleVisible(true);
      reposition();
    };
    const onScroll = () => {
      if (chatOpen) return;
      setBubbleVisible(false);
      const mobileNow = typeof window !== "undefined" && window.innerWidth < 768;
      if (!mobileNow) setSpritePos((p) => ({ ...p, opacity: 0 }));
      if (timer) clearTimeout(timer);
      timer = setTimeout(onStop, SCROLL_STOP_DELAY_MS);
    };
    // Initial placement on mount.
    timer = setTimeout(onStop, 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timer) clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatOpen]);

  // Chat-dock effect — takes over positioning while the chat is open.
  useEffect(() => {
    if (!chatOpen) return;
    setBubbleVisible(false);
    if (window.innerWidth >= 768) {
      setSpritePos({ xVw: DOCK_X_VW, yVh: DOCK_Y_VH, scale: DOCK_SCALE, opacity: 1 });
    }
  }, [chatOpen]);

  const spriteStyle: React.CSSProperties = {
    left: `${spritePos.xVw}vw`,
    top: `${spritePos.yVh}vh`,
    transform: `translate(-50%, -50%) scale(${spritePos.scale})`,
    transformOrigin: "center",
    opacity: spritePos.opacity,
    transition: "opacity 0.25s ease-out, left 0.3s ease-out, top 0.3s ease-out, transform 0.3s ease-out",
  };
  const bubbleShown = bubbleVisible && !chatOpen && bubblePos !== null;
  const bubbleStyle: React.CSSProperties = {
    width: isMobile ? "8rem" : `${BUBBLE_WIDTH_REM}rem`,
    left: `${(bubblePos ?? { xVw: spritePos.xVw }).xVw}vw`,
    top: `${(bubblePos ?? { yVh: spritePos.yVh }).yVh}vh`,
    transform: "translate(-50%, -50%)",
    opacity: bubbleShown ? 1 : 0,
    transition: "opacity 0.3s ease-out",
    pointerEvents: bubbleShown ? "auto" : "none",
    filter: "drop-shadow(0 8px 14px rgba(0, 0, 0, 0.18))",
  };

  return (
    <>
      <div
        ref={spriteRef}
        data-testid="roaming-erken-sprite"
        className="fixed z-30 pointer-events-none"
        style={spriteStyle}
      >
        <div className="pointer-events-auto" title="Chat with Erken">
          <CellDragonSprite
            scale={1}
            pointDirection={pointDirection}
            showOuterShell={false}
            onClick={openChoiceMenu}
          />
        </div>
      </div>

      {/* Speech bubble — gooey SVG cloud, ported verbatim. Hidden while
          scrolling, while the chat is open, or when it doesn't fit. */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <defs>
          <filter id="celly-cloud-goo" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"
              result="goo"
            />
          </filter>
        </defs>
      </svg>
      <div
        data-testid="roaming-erken-bubble"
        role="button"
        tabIndex={bubbleShown ? 0 : -1}
        aria-label="Talk to Erken"
        onClick={openChoiceMenu}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") openChoiceMenu();
        }}
        className="fixed z-30 cursor-pointer"
        style={bubbleStyle}
      >
        <div className="absolute inset-0" style={{ filter: "url(#celly-cloud-goo)" }}>
          {(() => {
            const scale = isMobile ? 0.4 : 0.6;
            const puffs: React.ReactNode[] = [];
            const ROWS = 3;
            const COLS = 5;
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
                      width: `${70 * scale}px`,
                      height: `${70 * scale}px`,
                      left: `${xPct}%`,
                      top: `${yPct}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                );
              }
            }
            return puffs;
          })()}
        </div>
        <div className="relative z-10 px-4 py-3.5">
          <div className="text-[11px] leading-relaxed text-neutral-800">{BUBBLE_TEXT}</div>
        </div>
      </div>

      {/* Chat + voice engines — same components /start and preview-v7 use.
          ErkenChatWidget also hides the GHL default launcher bubble so
          this sprite is the only visible "open chat" affordance. */}
      <ErkenChatWidget />
      <ErkenVoiceWidget />

      {/* Text/Voice choice menu — ported verbatim from preview-v7,
          including the Feedback / Roadmap / What's new sub-panels. */}
      {choiceMenu && (
        <>
          <div className="fixed inset-0 z-[55]" aria-hidden onClick={closeChoiceMenu} />
          <div
            role="menu"
            aria-label="How would you like to talk to Erken?"
            className="fixed z-[56] flex w-[280px] flex-col gap-1 rounded-2xl border border-white/15 bg-black/80 p-2 shadow-2xl backdrop-blur-md"
            style={{
              left: choiceMenu.x,
              top: choiceMenu.y,
              transform: choiceMenu.y < 260 ? "translate(-50%, 12%)" : "translate(-50%, -115%)",
            }}
          >
            {menuPanel === null && (
              <>
                <div className="px-3 pb-1 pt-1 text-xs text-white/55">Talk to Erken</div>
                <button
                  role="menuitem"
                  onClick={() => {
                    closeChoiceMenu();
                    openErkenChat();
                  }}
                  className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm text-white transition-colors hover:bg-white/15"
                >
                  <span aria-hidden className="text-base">💬</span> Text chat
                </button>
                <button
                  role="menuitem"
                  onClick={() => {
                    closeChoiceMenu();
                    window.__startErkenVoiceCall?.();
                  }}
                  className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm text-white transition-colors hover:bg-white/15"
                >
                  <span aria-hidden className="text-base">🎙️</span> Voice chat
                </button>
                <div className="mx-2 h-px bg-white/10" aria-hidden />
                <button
                  role="menuitem"
                  onClick={() => setMenuPanel("feedback")}
                  className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm text-white transition-colors hover:bg-white/15"
                >
                  <span aria-hidden className="text-base">📝</span> Feedback
                </button>
                <button
                  role="menuitem"
                  onClick={() => setMenuPanel("roadmap")}
                  className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm text-white transition-colors hover:bg-white/15"
                >
                  <span aria-hidden className="text-base">🗺️</span> Roadmap
                </button>
                <button
                  role="menuitem"
                  onClick={() => setMenuPanel("whatsnew")}
                  className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm text-white transition-colors hover:bg-white/15"
                >
                  <span aria-hidden className="text-base">✨</span> What&apos;s new
                </button>
                <a
                  role="menuitem"
                  href="https://chromewebstore.google.com/detail/erken/mggcbjggcbdpmbglbodkadgmpapcmelc"
                  target="_blank"
                  rel="noopener"
                  className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm text-white transition-colors hover:bg-white/15"
                >
                  <span aria-hidden className="text-base">🧩</span> Add the browser extension
                </a>
              </>
            )}
            {menuPanel === "roadmap" && (
              <div className="w-full px-3 py-2 text-sm text-white">
                <button
                  onClick={() => setMenuPanel(null)}
                  className="mb-2 flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/15"
                >
                  <span aria-hidden>←</span> Back to main menu
                </button>
                <div className="pb-1.5 text-xs text-white/55">Where Erken is going</div>
                <div className="flex flex-col gap-1.5 leading-snug">
                  <div>🧠 <b>Memory is here</b> — Erken remembers you, your business, and where you left off. It keeps getting smarter over time.</div>
                  <div>⚡ <b>Actions are coming</b> — Erken won&apos;t just show you the button, it will do the task for you, right in your account.</div>
                  <div>🌐 <b>Works on the Erken platform today</b> — expanding to Zapier, QuickBooks, and the popular apps you already connect</div>
                  <div>🧰 <b>Universal helpers on the way</b> — summarize any page, size up a competitor, quick market research</div>
                  <div>💬 <b>Real conversation</b> — talk back-and-forth by voice, not one question at a time</div>
                  <div>🖥️ <b>A desktop companion</b> — Erken on your screen, working across every app you use, not just this one</div>
                </div>
                <div className="mt-2 border-t border-white/10 pt-2 text-xs text-white/55">
                  Your vote decides what Erken learns next — tell us via{" "}
                  <button onClick={() => setMenuPanel("feedback")} className="underline decoration-white/40 underline-offset-2 transition-colors hover:text-white/90">
                    📝 Feedback
                  </button>
                  .
                </div>
              </div>
            )}
            {menuPanel === "whatsnew" && (
              <div className="w-full px-3 py-2 text-sm text-white">
                <button
                  onClick={() => setMenuPanel(null)}
                  className="mb-2 flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/15"
                >
                  <span aria-hidden>←</span> Back to main menu
                </button>
                <div className="pb-1.5 text-xs text-white/55">What&apos;s new in Erken</div>
                <div className="flex flex-col gap-1.5 leading-snug">
                  <div>🧭 <b>Meet the Platform</b> — a guided tour of everything the platform can do</div>
                  <div>📂 Erken now <b>opens the menu for you</b> so it can point things out</div>
                  <div>🚩 <b>&ldquo;Wrong instruction&rdquo; button</b> — flag Erken if it points at the wrong spot</div>
                  <div>🔊 Smoother step-by-step voice walkthroughs</div>
                </div>
                <div className="mt-2 border-t border-white/10 pt-2 text-xs text-white/55">
                  Got an idea or found a bug? Tell us via{" "}
                  <button onClick={() => setMenuPanel("feedback")} className="underline decoration-white/40 underline-offset-2 transition-colors hover:text-white/90">
                    📝 Feedback
                  </button>
                  .
                </div>
              </div>
            )}
            {menuPanel === "feedback" && (
              <div className="w-full px-3 py-2">
                <button
                  onClick={() => setMenuPanel(null)}
                  className="mb-2 flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/15"
                >
                  <span aria-hidden>←</span> Back to main menu
                </button>
                <div className="pb-1.5 text-xs text-white/55">Your feedback — bugs, ideas, anything</div>
                {fbState === "sent" ? (
                  <div className="py-2 text-sm text-white">✅ Got it — passed along. Thank you!</div>
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
                      onClick={sendFeedback}
                      disabled={fbState === "sending" || !fbText.trim()}
                      className="mt-1.5 w-full rounded-xl bg-white/15 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/25 disabled:opacity-40"
                    >
                      {fbState === "sending" ? "Sending…" : fbState === "error" ? "Couldn't send — try again" : "Send"}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
