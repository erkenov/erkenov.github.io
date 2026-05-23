"use client";

/**
 * Scene2GoogleMapsVisual — atmospheric "Google Maps scraping" card art
 * for the Lead Generation Apple Cards Carousel.
 *
 * Stylized scraping dashboard: dark sage background with a faint map
 * grid pattern, list of recently-scraped businesses with their ICP
 * status tags (NEW / QUEUED / DUPE), and a header summary showing the
 * total count and the target market.
 *
 * Built to match the visual rhythm of Scene2VoiceAgentVisual so the
 * carousel feels cohesive.
 */

import { motion } from "motion/react";

type ScrapedBusiness = {
  name: string;
  zip: string;
  rating: number;
  reviews: number;
  phone: string;
  status: "NEW" | "QUEUED" | "DUPE";
};

const BUSINESSES: ScrapedBusiness[] = [
  { name: "Apex Auto Center",       zip: "78704", rating: 4.6, reviews: 218, phone: "(512) 555-0142", status: "NEW" },
  { name: "West 6th Garage",        zip: "78703", rating: 4.4, reviews: 156, phone: "(512) 555-0287", status: "QUEUED" },
  { name: "Lonestar Auto Repair",   zip: "78701", rating: 4.8, reviews: 412, phone: "(512) 555-0455", status: "NEW" },
  { name: "ZipCar Repair",          zip: "78705", rating: 4.2, reviews: 89,  phone: "(512) 555-0671", status: "DUPE" },
  { name: "Downtown Motors",        zip: "78702", rating: 4.5, reviews: 267, phone: "(512) 555-0834", status: "NEW" },
];

export function Scene2GoogleMapsVisual() {
  return (
    <div className="absolute inset-0 flex flex-col justify-end px-5 pb-6 bg-gradient-to-b from-[#0f2018] via-[#143025] to-[#0a1a13]">
      {/* Faint map grid background — suggests cartography without being
          a literal map */}
      <MapGrid />

      {/* Erken Systems mark in upper-right corner */}
      <div className="absolute top-10 right-5 z-20 flex items-center gap-1.5">
        <div className="w-5 h-5 rounded-full bg-[#7ea687] flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#C76B58]" />
        </div>
        <span className="text-[10px] font-medium text-white/70">Erken · scraper</span>
      </div>

      {/* Counter header */}
      <div className="relative z-10 mb-4">
        <div className="text-[11px] text-white/55 uppercase tracking-wider font-mono">
          Scraped · last 24h
        </div>
        <div className="mt-1 text-lg font-bold text-white tracking-tight tabular-nums">
          3,247 businesses
        </div>
        <div className="text-[12px] text-white/65">
          Austin TX · Auto repair · 8mi radius
        </div>
      </div>

      {/* Business list */}
      <div className="relative z-10 mb-3 space-y-1">
        {BUSINESSES.map((b, i) => (
          <BusinessRow key={b.name} biz={b} delay={i * 0.08} />
        ))}
      </div>

      {/* Footer ICP score */}
      <div className="relative z-10 flex items-center justify-between text-[11px] text-white/55 font-mono">
        <span>ICP score · 8.3 / 10</span>
        <span>→ outreach queue</span>
      </div>
    </div>
  );
}

function MapGrid() {
  // Render a faint isometric-leaning grid of "streets" via SVG so the
  // background reads as a map without consuming much visual weight.
  return (
    <svg
      className="absolute inset-0 z-0 w-full h-full opacity-[0.18]"
      viewBox="0 0 400 600"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="streetGrid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#7ea687" strokeWidth="0.7" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#streetGrid)" />
      {/* a couple of stylized "main streets" */}
      <path d="M 0 200 L 400 280" stroke="#7ea687" strokeWidth="1.4" strokeOpacity="0.5" fill="none" />
      <path d="M 130 0 L 200 600" stroke="#7ea687" strokeWidth="1.4" strokeOpacity="0.5" fill="none" />
      <path d="M 0 470 L 400 410" stroke="#7ea687" strokeWidth="1.0" strokeOpacity="0.4" fill="none" />
      {/* a few pin-style dots scattered to suggest businesses on map */}
      <Pin cx={70}  cy={130} />
      <Pin cx={210} cy={90}  />
      <Pin cx={310} cy={170} />
      <Pin cx={140} cy={250} />
      <Pin cx={330} cy={310} />
      <Pin cx={90}  cy={400} />
      <Pin cx={250} cy={460} />
      <Pin cx={350} cy={510} />
    </svg>
  );
}

function Pin({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="3.5" fill="#C76B58" />
      <circle cx={cx} cy={cy} r="7" fill="none" stroke="#C76B58" strokeOpacity="0.4" strokeWidth="0.8" />
    </g>
  );
}

const STATUS_STYLES: Record<ScrapedBusiness["status"], { bg: string; text: string }> = {
  NEW:    { bg: "bg-[#7ea687]/20 border border-[#7ea687]/40", text: "text-[#7ea687]" },
  QUEUED: { bg: "bg-[#E89F1F]/15 border border-[#E89F1F]/40", text: "text-[#E89F1F]" },
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
      {/* map pin */}
      <div className="shrink-0">
        <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 2 C7.6 2 4 5.6 4 10 C4 16 12 22 12 22 C12 22 20 16 20 10 C20 5.6 16.4 2 12 2 Z"
            fill={dim ? "#ffffff" : "#C76B58"}
            fillOpacity={dim ? 0.25 : 1}
          />
          <circle cx="12" cy="10" r="3" fill="#0f2018" />
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
