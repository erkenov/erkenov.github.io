"use client";

/**
 * Scene3ChannelsFunnel — animated SVG diagram for the Lead Capture scene.
 *
 * Five channels arranged horizontally across the top (voice agent, web chat,
 * WhatsApp, Instagram DM, forms). Curved paths drop DOWN from each channel
 * into the funnel mouth below, then converge through the funnel stem into a
 * single labeled output: "One pipeline".
 *
 * Pure SVG + Framer Motion — no Three.js, no images. Keeps the second WebGL
 * context cost limited to just the MacBook.
 */

import { motion } from "motion/react";
import {
  IconPhone,
  IconMessageCircle,
  IconBrandWhatsapp,
  IconBrandInstagram,
  IconClipboardList,
} from "@tabler/icons-react";

type Channel = {
  Icon: typeof IconPhone;
  label: string;
  color: string;
};

const CHANNELS: Channel[] = [
  { Icon: IconPhone, label: "Voice agent", color: "#C76B58" },
  { Icon: IconMessageCircle, label: "Web chat", color: "#7ea687" },
  { Icon: IconBrandWhatsapp, label: "WhatsApp", color: "#25D366" },
  { Icon: IconBrandInstagram, label: "Instagram", color: "#E89F1F" },
  { Icon: IconClipboardList, label: "Forms", color: "#8B7BB8" },
];

// SVG viewBox layout (in SVG units). Layout flows TOP → BOTTOM.
const VB_WIDTH = 520;
const VB_HEIGHT = 520;
const NODE_RADIUS = 28;

// Channel row sits near the top.
const NODE_ROW_Y = 60;
const NODE_LABEL_Y_OFFSET = NODE_RADIUS + 18;
const ROW_LEFT_PAD = 60;
const ROW_RIGHT_PAD = 60;

// Funnel sits below the channel row.
const FUNNEL_CX = VB_WIDTH / 2;
const FUNNEL_MOUTH_Y = 220;
const FUNNEL_MOUTH_HALF_WIDTH = 130;
const FUNNEL_NECK_Y = 340;
const FUNNEL_NECK_HALF_WIDTH = 25;
const FUNNEL_STEM_BOTTOM_Y = 420;
const FUNNEL_OUTPUT_LABEL_Y = 470;

function nodeX(i: number, total: number): number {
  const usable = VB_WIDTH - ROW_LEFT_PAD - ROW_RIGHT_PAD;
  const step = usable / (total - 1);
  return ROW_LEFT_PAD + i * step;
}

function pathFromChannelToMouth(channelX: number): string {
  // Cubic Bezier from channel node down into the funnel mouth.
  const startY = NODE_ROW_Y + NODE_RADIUS;
  // Aim at a point along the funnel mouth proportional to the channel's
  // horizontal position so paths spread across the mouth instead of
  // bunching at the center.
  const t =
    (channelX - (FUNNEL_CX - FUNNEL_MOUTH_HALF_WIDTH)) /
    (2 * FUNNEL_MOUTH_HALF_WIDTH);
  const clampedT = Math.max(0.15, Math.min(0.85, t));
  const endX =
    FUNNEL_CX - FUNNEL_MOUTH_HALF_WIDTH + clampedT * (2 * FUNNEL_MOUTH_HALF_WIDTH);
  const endY = FUNNEL_MOUTH_Y;

  // Two control points: first below the channel (slight curve), second
  // above the mouth (gently leaning toward target X).
  const ctrl1X = channelX;
  const ctrl1Y = startY + (endY - startY) * 0.4;
  const ctrl2X = endX;
  const ctrl2Y = endY - (endY - startY) * 0.25;
  return `M ${channelX} ${startY} C ${ctrl1X} ${ctrl1Y}, ${ctrl2X} ${ctrl2Y}, ${endX} ${endY}`;
}

const FUNNEL_PATH = `
  M ${FUNNEL_CX - FUNNEL_MOUTH_HALF_WIDTH} ${FUNNEL_MOUTH_Y}
  L ${FUNNEL_CX + FUNNEL_MOUTH_HALF_WIDTH} ${FUNNEL_MOUTH_Y}
  L ${FUNNEL_CX + FUNNEL_NECK_HALF_WIDTH} ${FUNNEL_NECK_Y}
  L ${FUNNEL_CX + FUNNEL_NECK_HALF_WIDTH} ${FUNNEL_STEM_BOTTOM_Y}
  L ${FUNNEL_CX - FUNNEL_NECK_HALF_WIDTH} ${FUNNEL_STEM_BOTTOM_Y}
  L ${FUNNEL_CX - FUNNEL_NECK_HALF_WIDTH} ${FUNNEL_NECK_Y}
  Z
`;

export function Scene3ChannelsFunnel() {
  const channelXs = CHANNELS.map((_, i) => nodeX(i, CHANNELS.length));

  return (
    <div className="relative w-full max-w-[32rem]">
      <svg
        viewBox={`0 0 ${VB_WIDTH} ${VB_HEIGHT}`}
        className="w-full h-auto"
        aria-hidden="true"
      >
        {/* Decorative concentric rings around funnel stem output */}
        <circle
          cx={FUNNEL_CX}
          cy={FUNNEL_STEM_BOTTOM_Y}
          r={50}
          fill="none"
          stroke="#7ea687"
          strokeOpacity={0.15}
          strokeWidth={1}
        />
        <circle
          cx={FUNNEL_CX}
          cy={FUNNEL_STEM_BOTTOM_Y}
          r={75}
          fill="none"
          stroke="#7ea687"
          strokeOpacity={0.08}
          strokeWidth={1}
        />

        {/* Paths from each channel down into the funnel mouth */}
        {CHANNELS.map((ch, i) => {
          const d = pathFromChannelToMouth(channelXs[i]);
          return (
            <g key={`path-${ch.label}`}>
              <motion.path
                d={d}
                stroke={ch.color}
                strokeOpacity={0.35}
                strokeWidth={1.5}
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.35 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1.2, delay: i * 0.15, ease: "easeOut" }}
              />
              <FlowingDot pathD={d} color={ch.color} delay={i * 0.3} />
            </g>
          );
        })}

        {/* Funnel body — drawn AFTER paths so its fill covers the path
            endpoints, making the dots appear to enter the funnel cleanly */}
        <motion.g
          initial={{ scale: 0.85, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.4, type: "spring", bounce: 0.2 }}
          style={{ transformOrigin: `${FUNNEL_CX}px ${FUNNEL_MOUTH_Y}px` }}
        >
          <path
            d={FUNNEL_PATH}
            fill="#F5F1E8"
            stroke="#7ea687"
            strokeWidth={2}
          />
          {/* Inner depth highlight along the funnel's top opening */}
          <ellipse
            cx={FUNNEL_CX}
            cy={FUNNEL_MOUTH_Y}
            rx={FUNNEL_MOUTH_HALF_WIDTH - 6}
            ry={6}
            fill="#7ea687"
            fillOpacity={0.12}
          />
        </motion.g>

        {/* Channel nodes (icons + labels) — drawn LAST so they sit on top */}
        {CHANNELS.map((ch, i) => (
          <motion.g
            key={`node-${ch.label}`}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.5,
              delay: i * 0.1,
              type: "spring",
              bounce: 0.35,
            }}
            style={{ transformOrigin: `${channelXs[i]}px ${NODE_ROW_Y}px` }}
          >
            <circle
              cx={channelXs[i]}
              cy={NODE_ROW_Y}
              r={NODE_RADIUS}
              fill="#F5F1E8"
              stroke={ch.color}
              strokeWidth={2}
            />
            <foreignObject
              x={channelXs[i] - 14}
              y={NODE_ROW_Y - 14}
              width={28}
              height={28}
            >
              <div className="flex h-full w-full items-center justify-center">
                <ch.Icon size={20} color={ch.color} strokeWidth={1.8} />
              </div>
            </foreignObject>
            <text
              x={channelXs[i]}
              y={NODE_ROW_Y + NODE_LABEL_Y_OFFSET}
              textAnchor="middle"
              className="fill-[var(--text-muted,#5a554e)]"
              fontSize="11"
              fontFamily="var(--font-mono, monospace)"
              fontWeight="500"
            >
              {ch.label}
            </text>
          </motion.g>
        ))}

        {/* Output label below the funnel stem */}
        <motion.text
          x={FUNNEL_CX}
          y={FUNNEL_OUTPUT_LABEL_Y}
          textAnchor="middle"
          fill="#2a2722"
          fontSize="14"
          fontFamily="var(--font-mono, monospace)"
          fontWeight="600"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          One pipeline
        </motion.text>
      </svg>
    </div>
  );
}

/** A small circle that loops along the given SVG path. */
function FlowingDot({
  pathD,
  color,
  delay,
}: {
  pathD: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.circle
      r={4}
      fill={color}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{
        duration: 2.4,
        delay,
        repeat: Infinity,
        repeatDelay: 1.2,
        times: [0, 0.1, 0.85, 1],
        ease: "easeInOut",
      }}
    >
      <animateMotion
        dur="2.4s"
        repeatCount="indefinite"
        begin={`${delay}s`}
        path={pathD}
        rotate="auto"
      />
    </motion.circle>
  );
}
