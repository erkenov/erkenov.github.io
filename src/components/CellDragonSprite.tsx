"use client";

/**
 * CellDragonSprite — EVE-accurate robot (Shamil sent a Wall-E EVE
 * reference image 2026-05-24 round 35). Rebuilt from the ground up
 * to match the real EVE silhouette:
 *  - TWO-PIECE body: small dome head + separate tall teardrop body
 *    with a visible gap between them (this was the big miss before —
 *    a single egg never reads as EVE)
 *  - Dark-glass curved visor across the front of the head dome
 *  - Bright BLUE striped slot eyes inside the visor (the iconic EVE
 *    blue, with horizontal stripe pattern from the LED bars)
 *  - Flat curved blade-shaped floating hands (not rounded mittens)
 *  - Soft sage/gold halo behind so she still pops on the cream page
 *
 * API stays identical so preview-v6's orchestration keeps working.
 * pointDirection nudges the active-side hand slightly forward.
 */

import React from "react";

export type CellDragonSpriteProps = {
  scale?: number;
  pointDirection?: "left" | "right";
  onClick?: () => void;
  showOuterShell?: boolean;
  bubbleText?: string | null;
};

// Brand palette
const WHITE_BRIGHT = "#FFFFFF";
const CREAM_SOFT = "#F5F1E8";
const CREAM_SHADOW = "#D8CFB8";
const SAGE_GLOW = "#7ea687";
// EVE-accurate dark visor: very deep blue-black with subtle upper sheen
const VISOR_DARK = "#0A0E1A";
const VISOR_MID = "#141B2E";
const VISOR_SHEEN = "#26334F";
// Sage-green eyes to match brand theme (Shamil round 36)
const EYE_SAGE = "#7ea687";
const EYE_SAGE_BRIGHT = "#B8D4BD";
const EYE_WHITE = "#EAF3EC";

export function CellDragonSprite({
  scale = 1,
  pointDirection = "right",
  onClick,
  showOuterShell: _showOuterShell = true, // forced-on; needed for cream-bg visibility
  bubbleText,
}: CellDragonSpriteProps) {
  const pointsLeft = pointDirection === "left";

  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        width: `${13 * scale}rem`,
        height: `${13 * scale}rem`,
      }}
    >
      {/* Speech bubble (parent-controlled visibility). Inline bubble
          used only by creature lab; preview-v6 renders its own. */}
      {bubbleText && (
        <div
          className="absolute left-1/2 z-10 pointer-events-auto"
          style={{
            bottom: "-1rem",
            transform: "translate(-50%, 100%)",
            width: "16rem",
          }}
        >
          <div className="relative rounded-2xl bg-white shadow-lg ring-1 ring-black/5 px-4 py-3">
            <div
              className="absolute left-1/2 -top-1.5 w-3 h-3 bg-white ring-1 ring-black/5"
              style={{
                clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
                transform: "translate(-50%, 0)",
              }}
            />
            <div className="text-[13px] leading-snug text-neutral-800">
              {bubbleText}
            </div>
          </div>
        </div>
      )}

      {/* OUTER GLOW HALO — sage/gold dust bleed so the white robot
          has presence against the cream page. */}
      <div
        className="absolute inset-0 rounded-full animate-[csHaloBreath_5s_ease-in-out_infinite]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(126,166,135,0.55) 0%, rgba(126,166,135,0.30) 28%, rgba(242,201,76,0.18) 50%, transparent 72%)",
          filter: "blur(14px)",
        }}
      />

      {/* INNER GLOW RING — tighter halo hugging the body. */}
      <div
        className="absolute inset-8 rounded-full animate-[csPulseSoft_4s_ease-in-out_infinite]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,224,122,0.40) 0%, rgba(126,166,135,0.40) 45%, transparent 75%)",
          filter: "blur(6px)",
        }}
      />

      {/* ============================================================
          THE ROBOT — wraps head + body + hands in one click target.
          Bobbing animation lives here so everything floats together.
          ============================================================ */}
      <button
        type="button"
        onClick={onClick}
        aria-label="Talk to the Erken Systems assistant"
        className="relative animate-[csBobble_4s_ease-in-out_infinite] pointer-events-auto cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C94C] focus-visible:ring-offset-2 bg-transparent"
        style={{
          width: "5.5rem",
          height: "9.5rem",
          overflow: "visible",
          border: "none",
          padding: 0,
          // Subtle ground shadow lives here as a backdrop drop
          filter: `drop-shadow(0 18px 12px rgba(94, 130, 104, 0.20))`,
        }}
      >
        {/* ========== LEFT MAGNETIC SHOULDER GLOW ==========
            Small sage spark at the shoulder area indicating the
            "aero-magnetic" attachment point between body and floating
            hand. Sells the EVE-style detached-but-connected feel. */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "3.7rem",
            left: "0.3rem",
            width: "0.55rem",
            height: "0.55rem",
            borderRadius: "50%",
            background: `radial-gradient(circle at 50% 50%, ${SAGE_GLOW}DD 0%, ${SAGE_GLOW}88 40%, transparent 75%)`,
            filter: "blur(2px)",
            animation: "csMagPulse 2.4s ease-in-out infinite",
            zIndex: 3,
          }}
        />

        {/* ========== LEFT HAND ==========
            Vertical hanging blade — detached from the body with a
            small magnetic gap. Round 39 moves it further outward
            (into negative-left territory) so the gap reads. */}
        <div
          className="absolute pointer-events-none"
          style={{
            // Shoulder position — clearly OUTSIDE body's left edge.
            // Body is 4.2rem wide, centered in 5.5rem container, so
            // body left edge = 0.65rem. We put the hand at -0.4rem
            // so there's a clean ~1rem gap from body to hand.
            top: "3.5rem",
            left: "-0.4rem",
            width: "0.9rem",
            height: "4.6rem",
            transformOrigin: "50% 0%", // pivot at the shoulder (top-center)
            transform: `rotate(-12deg) ${pointsLeft ? "rotate(-3deg)" : ""}`,
            animation: "csHandLeft 3.6s ease-in-out infinite",
            zIndex: 4,
          }}
        >
          <div
            className="w-full h-full"
            style={{
              // Vertical tapered blade: rounded top (shoulder), narrow
              // pointed bottom (fingertip). Using vertical gradient
              // direction for the taper highlight.
              borderRadius: "55% 55% 50% 50% / 25% 25% 75% 75%",
              background: `linear-gradient(170deg, ${WHITE_BRIGHT} 0%, ${WHITE_BRIGHT} 50%, ${CREAM_SOFT} 85%, ${CREAM_SHADOW} 100%)`,
              boxShadow: [
                `0 4px 10px rgba(94, 130, 104, 0.30)`,
                `0 0 0 1px ${SAGE_GLOW}44`,
                `0 0 8px ${SAGE_GLOW}44`,
                `inset -2px 0 3px ${CREAM_SHADOW}55`,
                `inset 2px 1px 3px rgba(255,255,255,0.95)`,
              ].join(", "),
            }}
          />
        </div>

        {/* ========== RIGHT MAGNETIC SHOULDER GLOW ========== */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "3.7rem",
            right: "0.3rem",
            width: "0.55rem",
            height: "0.55rem",
            borderRadius: "50%",
            background: `radial-gradient(circle at 50% 50%, ${SAGE_GLOW}DD 0%, ${SAGE_GLOW}88 40%, transparent 75%)`,
            filter: "blur(2px)",
            animation: "csMagPulse 2.4s ease-in-out infinite",
            animationDelay: "0.4s",
            zIndex: 3,
          }}
        />

        {/* ========== RIGHT HAND ==========
            Mirror — detached vertical blade off the right side with
            magnetic gap. */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "3.5rem",
            right: "-0.4rem",
            width: "0.9rem",
            height: "4.6rem",
            transformOrigin: "50% 0%",
            transform: `rotate(12deg) ${!pointsLeft ? "rotate(3deg)" : ""}`,
            animation: "csHandRight 4.1s ease-in-out infinite",
            zIndex: 4,
          }}
        >
          <div
            className="w-full h-full"
            style={{
              borderRadius: "55% 55% 50% 50% / 25% 25% 75% 75%",
              background: `linear-gradient(190deg, ${WHITE_BRIGHT} 0%, ${WHITE_BRIGHT} 50%, ${CREAM_SOFT} 85%, ${CREAM_SHADOW} 100%)`,
              boxShadow: [
                `0 4px 10px rgba(94, 130, 104, 0.30)`,
                `0 0 0 1px ${SAGE_GLOW}44`,
                `0 0 8px ${SAGE_GLOW}44`,
                `inset 2px 0 3px ${CREAM_SHADOW}55`,
                `inset -2px 1px 3px rgba(255,255,255,0.95)`,
              ].join(", "),
            }}
          />
        </div>

        {/* ========== HEAD DOME ==========
            Small rounded dome at the top — narrower than the body, sits
            on top with a visible gap. White shell + dark glass visor
            covering most of the front face. */}
        <div
          className="absolute left-1/2"
          style={{
            top: "0",
            transform: "translateX(-50%)",
            width: "3.6rem",
            height: "3rem",
            // Dome shape: rounder at top, slight flatten at bottom
            borderRadius: "55% 55% 50% 50% / 70% 70% 30% 30%",
            background: `linear-gradient(160deg, ${WHITE_BRIGHT} 0%, ${WHITE_BRIGHT} 45%, ${CREAM_SOFT} 82%, ${CREAM_SHADOW} 100%)`,
            boxShadow: [
              `0 6px 14px rgba(94, 130, 104, 0.30)`,
              `0 0 0 1px ${SAGE_GLOW}55`,
              `0 0 16px ${SAGE_GLOW}55`,
              `inset -4px -6px 12px ${CREAM_SHADOW}55`,
              `inset 3px 4px 8px rgba(255,255,255,0.95)`,
            ].join(", "),
            overflow: "hidden",
            zIndex: 3,
          }}
        >
          {/* Top sheen highlight */}
          <div
            className="absolute"
            style={{
              top: "8%",
              left: "22%",
              width: "1.2rem",
              height: "0.5rem",
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse at center, rgba(255,255,255,1) 0%, rgba(255,255,255,0.4) 60%, transparent 90%)",
              filter: "blur(1.5px)",
              opacity: 0.85,
            }}
          />

          {/* DARK VISOR — curved band across the head face. Narrower
              than full-width to leave white shell visible at edges,
              like real EVE. */}
          <div
            className="absolute left-[8%] right-[8%]"
            style={{
              top: "32%",
              height: "52%",
              background: `linear-gradient(180deg, ${VISOR_SHEEN} 0%, ${VISOR_MID} 18%, ${VISOR_DARK} 55%, ${VISOR_DARK} 100%)`,
              // Curve the visor to track the dome contour — wider at
              // top, narrower at bottom (the EVE "frown" curve)
              borderRadius: "50% 50% 50% 50% / 55% 55% 45% 45%",
              boxShadow: [
                `inset 0 1px 2px rgba(255,255,255,0.30)`,
                `inset 0 -1px 2px rgba(0,0,0,0.7)`,
                `0 1px 3px rgba(0,0,0,0.4)`,
              ].join(", "),
            }}
          >
            {/* Top edge sheen on the glass */}
            <div
              className="absolute left-[18%] right-[18%] top-[10%] h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)",
              }}
            />

            {/* LEFT EYE — sage striped slot with "soulful glossy"
                reflection highlights. Default state is a slim slot;
                on parent button hover, the eye grows into a big
                rounded puppy-eye shape with bigger reflections —
                Celly's Puss in Boots "supersight" expression. */}
            <div
              className="csEye csEye--left absolute"
              style={{
                top: "32%",
                left: "18%",
                width: "1rem",
                height: "0.6rem",
                borderRadius: "50%",
                background: `repeating-linear-gradient(
                  0deg,
                  ${EYE_WHITE} 0px,
                  ${EYE_SAGE_BRIGHT} 1px,
                  ${EYE_SAGE} 2px,
                  ${EYE_SAGE_BRIGHT} 3px
                )`,
                boxShadow: `0 0 12px ${EYE_SAGE}EE, 0 0 4px ${EYE_SAGE_BRIGHT}, inset 0 0 3px ${EYE_WHITE}`,
                animation: "csEyeShift 6s ease-in-out infinite",
                transition: "width 0.35s ease-out, height 0.35s ease-out, top 0.35s ease-out, border-radius 0.35s ease-out, background 0.35s ease-out, box-shadow 0.35s ease-out",
              }}
            >
              {/* Big white reflection — top-left, gives "wet eye" gloss */}
              <div
                className="csEyeShine csEyeShine--primary absolute"
                style={{
                  top: "18%",
                  left: "20%",
                  width: "30%",
                  height: "35%",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.95)",
                  filter: "blur(0.5px)",
                  transition: "all 0.35s ease-out",
                }}
              />
              {/* Smaller secondary reflection */}
              <div
                className="csEyeShine csEyeShine--secondary absolute"
                style={{
                  bottom: "20%",
                  right: "22%",
                  width: "14%",
                  height: "18%",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.7)",
                  filter: "blur(0.3px)",
                  transition: "all 0.35s ease-out",
                }}
              />
            </div>
            {/* RIGHT EYE — mirror of left */}
            <div
              className="csEye csEye--right absolute"
              style={{
                top: "32%",
                right: "18%",
                width: "1rem",
                height: "0.6rem",
                borderRadius: "50%",
                background: `repeating-linear-gradient(
                  0deg,
                  ${EYE_WHITE} 0px,
                  ${EYE_SAGE_BRIGHT} 1px,
                  ${EYE_SAGE} 2px,
                  ${EYE_SAGE_BRIGHT} 3px
                )`,
                boxShadow: `0 0 12px ${EYE_SAGE}EE, 0 0 4px ${EYE_SAGE_BRIGHT}, inset 0 0 3px ${EYE_WHITE}`,
                animation: "csEyeShift 6s ease-in-out infinite",
                transition: "width 0.35s ease-out, height 0.35s ease-out, top 0.35s ease-out, border-radius 0.35s ease-out, background 0.35s ease-out, box-shadow 0.35s ease-out",
              }}
            >
              <div
                className="csEyeShine csEyeShine--primary absolute"
                style={{
                  top: "18%",
                  right: "20%",
                  width: "30%",
                  height: "35%",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.95)",
                  filter: "blur(0.5px)",
                  transition: "all 0.35s ease-out",
                }}
              />
              <div
                className="csEyeShine csEyeShine--secondary absolute"
                style={{
                  bottom: "20%",
                  left: "22%",
                  width: "14%",
                  height: "18%",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.7)",
                  filter: "blur(0.3px)",
                  transition: "all 0.35s ease-out",
                }}
              />
            </div>
          </div>
        </div>

        {/* ========== GAP between head and body ==========
            Just empty space — the visible separation IS the EVE detail.
            Head ends at top:3rem, body starts at top:3.4rem (0.4rem gap). */}

        {/* ========== BODY ==========
            Tall teardrop — wider than head, tapers toward bottom.
            Sits below the head with a visible gap. */}
        <div
          className="absolute left-1/2"
          style={{
            top: "3.4rem",
            transform: "translateX(-50%)",
            width: "4.2rem",
            height: "5.4rem",
            // Slimmer EVE silhouette (Shamil round 39: thinner body).
            // Bottom corners 50% horizontal so they meet at center-
            // bottom = pointed; 75% vertical so the taper carries
            // most of the height.
            borderRadius: "55% 55% 50% 50% / 28% 28% 75% 75%",
            background: `linear-gradient(170deg, ${WHITE_BRIGHT} 0%, ${WHITE_BRIGHT} 35%, ${CREAM_SOFT} 80%, ${CREAM_SHADOW} 100%)`,
            boxShadow: [
              `0 10px 24px rgba(94, 130, 104, 0.32)`,
              `0 0 0 1px ${SAGE_GLOW}55`,
              `0 0 20px ${SAGE_GLOW}55`,
              `inset -6px -10px 18px ${CREAM_SHADOW}66`,
              `inset 4px 6px 12px rgba(255,255,255,0.95)`,
            ].join(", "),
            zIndex: 2,
          }}
        >
          {/* Body top-left sheen */}
          <div
            className="absolute"
            style={{
              top: "10%",
              left: "18%",
              width: "1.4rem",
              height: "0.6rem",
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse at center, rgba(255,255,255,1) 0%, rgba(255,255,255,0.35) 55%, transparent 85%)",
              filter: "blur(2px)",
              opacity: 0.75,
            }}
          />
        </div>
      </button>

      <style jsx>{`
        @keyframes csHaloBreath {
          0%, 100% { transform: scale(1); opacity: 0.95; }
          50% { transform: scale(1.08); opacity: 1; }
        }
        @keyframes csPulseSoft {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
        @keyframes csBobble {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50% { transform: translateY(-5px) rotate(1deg); }
        }
        @keyframes csEyeShift {
          0%, 100% { transform: translate(0, 0); }
          30% { transform: translate(1px, -0.5px); }
          70% { transform: translate(-1px, 0.5px); }
        }
        @keyframes csHandLeft {
          0%, 100% { transform: rotate(-12deg); }
          50% { transform: rotate(-6deg); }
        }
        @keyframes csHandRight {
          0%, 100% { transform: rotate(12deg); }
          50% { transform: rotate(6deg); }
        }
        @keyframes csMagPulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        /* ============================================================
           PUSS IN BOOTS "SUPERSIGHT" — on hover, the slot eyes morph
           into round dark puppy-eyes with prominent glossy highlights.
           Round 41 fix: eyes stay clearly SEPARATE (don't merge into
           one blob like round 40), become ROUND not stripey, and use
           a solid dark-sage pupil with strong white highlight — real
           Puss eyes are dark pupils, not bright slots.
           ============================================================ */
        button:hover .csEye {
          width: 0.95rem !important;
          height: 0.95rem !important;
          top: 26% !important;
          border-radius: 50% !important;
          /* Solid dark-sage pupil with subtle bright sage rim "iris" —
             override the stripe gradient so it doesn't look slotty. */
          background: radial-gradient(circle at 38% 30%,
            #2a3b30 0%,
            #1a2620 55%,
            #3d5544 85%,
            ${EYE_SAGE_BRIGHT} 100%) !important;
          box-shadow: 0 0 16px ${EYE_SAGE}99, inset 0 0 4px rgba(0,0,0,0.5) !important;
        }
        button:hover .csEye .csEyeShine--primary {
          width: 32% !important;
          height: 32% !important;
          background: rgba(255,255,255,1) !important;
        }
        button:hover .csEye .csEyeShine--secondary {
          width: 14% !important;
          height: 14% !important;
          background: rgba(255,255,255,0.9) !important;
        }
      `}</style>
    </div>
  );
}
