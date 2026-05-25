"use client";

/**
 * Scene2GoogleMapsVisual — "Google Maps scraping" card art for the
 * Lead Generation Apple Cards Carousel.
 *
 * The MAP itself now reads as Google Maps: cream/light "land", white
 * roads with subtle outlines, blue water (Lady Bird Lake — Austin),
 * green park polygons, and classic red Google-Maps-style teardrop pins.
 *
 * A dark translucent "results panel" docks over the bottom 55% of the
 * card showing the live scrape feed: 5 sample businesses with ICP
 * status tags. Matches the dark-on-map UX pattern that the actual
 * Google Maps search results use.
 */

import { motion } from "motion/react";

type ScrapedBusiness = {
  name: string;
  zip: string;
  rating: number;
  reviews: number;
  status: "NEW" | "QUEUED" | "DUPE";
};

const BUSINESSES: ScrapedBusiness[] = [
  { name: "Apex Auto Center",     zip: "78704", rating: 4.6, reviews: 218, status: "NEW" },
  { name: "West 6th Garage",      zip: "78703", rating: 4.4, reviews: 156, status: "QUEUED" },
  { name: "Lonestar Auto Repair", zip: "78701", rating: 4.8, reviews: 412, status: "NEW" },
];

export function Scene2GoogleMapsVisual() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Google-Maps-styled background */}
      <MapBackdrop />

      {/* Erken badge moved out of the visual to the card's topRightOverlay
          slot — was trapped in the visual's stacking context. */}

      {/* Translucent results panel — moved DOWN so the business list
          flows off the bottom of the card the way the cold-email card
          does (Shamil 2026-05-25). Footer row + last two businesses
          removed in the same pass to clean up the lower half. */}
      <div className="absolute inset-x-0 top-[55%] bottom-[-15%] z-20 flex flex-col px-5 pt-4 bg-gradient-to-t from-[#3f5e4a] via-[#3f5e4a]/95 to-[#3f5e4a]/0">
        {/* Counter header */}
        <div className="mb-3">
          <div className="text-[10px] text-white/55 uppercase tracking-wider font-mono">
            Scraped · last 24h
          </div>
          <div className="mt-0.5 text-base font-bold text-white tracking-tight tabular-nums">
            3,247 businesses · Austin TX
          </div>
        </div>

        {/* Business list — overflows off the bottom of the card */}
        <div className="space-y-1">
          {BUSINESSES.map((b, i) => (
            <BusinessRow key={b.name} biz={b} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Google-Maps-styled background: cream land, white roads with outlines,
 *  blue water polygon (Lady Bird Lake — Austin's actual river),
 *  scattered green park polygons, and classic red teardrop pins.       */
function MapBackdrop() {
  return (
    <svg
      className="absolute inset-0 z-0 w-full h-full"
      viewBox="0 0 400 600"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Subtle texture to keep the cream land from looking flat */}
        <pattern id="landTexture" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
          <rect width="32" height="32" fill="#F2EBDA" />
          <circle cx="16" cy="16" r="0.5" fill="#E6DFC9" />
        </pattern>
      </defs>

      {/* Land */}
      <rect width="400" height="600" fill="url(#landTexture)" />

      {/* Parks — Austin has a few. Faint green polygons. */}
      <path d="M 30 60 L 110 50 L 130 90 L 95 130 L 35 115 Z" fill="#C7DCC1" />
      <path d="M 290 180 L 360 175 L 380 230 L 320 250 L 280 220 Z" fill="#C7DCC1" />
      <path d="M 50 320 L 140 310 L 150 360 L 80 380 Z" fill="#C7DCC1" />

      {/* Water — Lady Bird Lake winding through Austin */}
      <path
        d="M -20 280 Q 80 240, 180 290 T 360 270 L 420 285 L 420 320 Q 320 350, 220 320 T 60 330 L -20 320 Z"
        fill="#A8D1F5"
      />
      <path
        d="M -20 280 Q 80 240, 180 290 T 360 270 L 420 285"
        stroke="#7CB6E8"
        strokeWidth="0.7"
        fill="none"
      />

      {/* Highways — wider, slightly yellowed white with darker outline */}
      <Road d="M 0 400 L 400 380" wide />
      <Road d="M 180 0 L 220 600" wide />
      <Road d="M 0 150 L 400 175" />

      {/* Streets — thinner */}
      <Road d="M 0 90 L 400 95" thin />
      <Road d="M 0 220 L 400 230" thin />
      <Road d="M 0 460 L 400 470" thin />
      <Road d="M 0 520 L 400 540" thin />
      <Road d="M 80 0 L 95 600" thin />
      <Road d="M 280 0 L 310 600" thin />
      <Road d="M 340 0 L 360 600" thin />

      {/* Highway shield labels */}
      <HighwayShield x={195} y={420} label="I-35" />

      {/* Classic Google Maps red teardrop pins at scattered business locations */}
      <MapPin cx={100} cy={195} />
      <MapPin cx={240} cy={155} />
      <MapPin cx={155} cy={235} />
      <MapPin cx={310} cy={140} />
      <MapPin cx={75}  cy={250} />
      <MapPin cx={205} cy={205} />
      <MapPin cx={285} cy={235} />
    </svg>
  );
}

function Road({ d, wide, thin }: { d: string; wide?: boolean; thin?: boolean }) {
  const widths = wide ? { outline: 7, inner: 5 } : thin ? { outline: 2.5, inner: 1.5 } : { outline: 4, inner: 2.8 };
  return (
    <>
      <path d={d} stroke="#E0D5B7" strokeWidth={widths.outline} fill="none" strokeLinecap="round" />
      <path d={d} stroke="#FFFFFF" strokeWidth={widths.inner} fill="none" strokeLinecap="round" />
    </>
  );
}

function HighwayShield({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <rect x={x - 13} y={y - 9} width="26" height="18" rx="3" fill="#7CB6E8" stroke="#FFFFFF" strokeWidth="1.2" />
      <text x={x} y={y + 4} textAnchor="middle" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="700" fill="#FFFFFF">
        {label}
      </text>
    </g>
  );
}

/** Classic Google Maps red teardrop pin with white inner circle */
function MapPin({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g transform={`translate(${cx - 9} ${cy - 22})`}>
      {/* shadow */}
      <ellipse cx="9" cy="22" rx="6" ry="1.5" fill="#000000" fillOpacity="0.2" />
      {/* teardrop */}
      <path
        d="M 9 0 C 4 0 0 4 0 9 C 0 16 9 22 9 22 C 9 22 18 16 18 9 C 18 4 14 0 9 0 Z"
        fill="#EA4335"
        stroke="#B23A2D"
        strokeWidth="0.5"
      />
      <circle cx="9" cy="9" r="3" fill="#FFFFFF" />
    </g>
  );
}

// Pills tuned for the deep-sage panel background.
const STATUS_STYLES: Record<ScrapedBusiness["status"], { bg: string; text: string }> = {
  NEW:    { bg: "bg-[#F5F1E8]/25 border border-[#F5F1E8]/45", text: "text-[#F5F1E8]" },
  QUEUED: { bg: "bg-[#E89F1F]/25 border border-[#E89F1F]/55", text: "text-[#FFD898]" },
  DUPE:   { bg: "bg-white/8 border border-white/15",          text: "text-white/40" },
};

function BusinessRow({ biz, delay }: { biz: ScrapedBusiness; delay: number }) {
  const dim = biz.status === "DUPE";
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
      className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${
        dim ? "bg-white/[0.02]" : "bg-white/[0.04]"
      }`}
    >
      {/* mini Google-style pin */}
      <div className="shrink-0">
        <svg width="12" height="12" viewBox="0 0 18 22" aria-hidden="true">
          <path
            d="M 9 0 C 4 0 0 4 0 9 C 0 16 9 22 9 22 C 9 22 18 16 18 9 C 18 4 14 0 9 0 Z"
            fill={dim ? "#ffffff" : "#EA4335"}
            fillOpacity={dim ? 0.25 : 1}
          />
          <circle cx="9" cy="9" r="3" fill="#FFFFFF" />
        </svg>
      </div>

      <div className="min-w-0 flex-1">
        <div className={`text-[11px] font-semibold tracking-tight truncate ${dim ? "text-white/50" : "text-white"}`}>
          {biz.name}
        </div>
        <div className="text-[9px] text-white/45 font-mono tabular-nums">
          {biz.zip} · ★{biz.rating.toFixed(1)} · {biz.reviews} reviews
        </div>
      </div>

      <div
        className={`shrink-0 rounded-full px-1.5 py-0.5 text-[8px] font-bold tracking-wider uppercase ${STATUS_STYLES[biz.status].bg} ${STATUS_STYLES[biz.status].text}`}
      >
        {biz.status}
      </div>
    </motion.div>
  );
}
