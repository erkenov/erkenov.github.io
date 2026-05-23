"use client";

/**
 * Scene3ChannelsFunnel — animated SVG diagram for the Lead Capture scene.
 *
 * Five channels on the left (phone, web chat, WhatsApp, Instagram, form)
 * flow through curved paths that converge into a single funnel on the
 * right labeled "One pipeline". Dots animate along each path showing the
 * direction of flow.
 *
 * Pure SVG + Framer Motion — no Three.js, no images. Keeps the second
 * WebGL context cost limited to just the MacBook.
 */

import { motion } from "motion/react";
import {
  IconPhone,
  IconMessageCircle,
  IconBrandWhatsapp,
  IconBrandInstagram,
  IconForms,
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
  { Icon: IconBrandInstagram, label: "Instagram DM", color: "#E89F1F" },
  { Icon: IconForms, label: "Forms", color: "#8B7BB8" },
];

// SVG viewBox layout (in SVG units)
const VB_WIDTH = 460;
const VB_HEIGHT = 520;
const ICON_X = 60;
const FUNNEL_X = 360;
const FUNNEL_Y = VB_HEIGHT / 2;
const NODE_RADIUS = 32;

function pathFor(channelY: number): string {
  // Quadratic Bezier from channel node to funnel mouth
  const startX = ICON_X + NODE_RADIUS;
  const startY = channelY;
  const endX = FUNNEL_X - 10;
  const endY = FUNNEL_Y;
  // Control point pulls toward the horizontal midpoint at funnel Y
  const ctrlX = (startX + endX) / 2 + 20;
  const ctrlY = (startY + endY) / 2;
  return `M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`;
}

export function Scene3ChannelsFunnel() {
  // Spread channels vertically across the SVG
  const channelYs = CHANNELS.map((_, i) => {
    const span = VB_HEIGHT - 80;
    const step = span / (CHANNELS.length - 1);
    return 40 + i * step;
  });

  return (
    <div className="relative w-full max-w-[32rem]">
      <svg
        viewBox={`0 0 ${VB_WIDTH} ${VB_HEIGHT}`}
        className="w-full h-auto"
        aria-hidden="true"
      >
        {/* Subtle background guide rings around funnel — purely decorative */}
        <circle
          cx={FUNNEL_X + 30}
          cy={FUNNEL_Y}
          r={60}
          fill="none"
          stroke="#7ea687"
          strokeOpacity={0.15}
          strokeWidth={1}
        />
        <circle
          cx={FUNNEL_X + 30}
          cy={FUNNEL_Y}
          r={90}
          fill="none"
          stroke="#7ea687"
          strokeOpacity={0.08}
          strokeWidth={1}
        />

        {/* Paths from each channel to the funnel */}
        {CHANNELS.map((ch, i) => {
          const d = pathFor(channelYs[i]);
          return (
            <g key={ch.label}>
              {/* Static guide line */}
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
              {/* Flowing particle along the path */}
              <FlowingDot pathD={d} color={ch.color} delay={i * 0.3} />
            </g>
          );
        })}

        {/* Channel nodes (icons in circles) */}
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
          >
            <circle
              cx={ICON_X}
              cy={channelYs[i]}
              r={NODE_RADIUS}
              fill="#F5F1E8"
              stroke={ch.color}
              strokeWidth={2}
            />
            {/* Render icon as foreignObject so we can use the Tabler React component */}
            <foreignObject
              x={ICON_X - 16}
              y={channelYs[i] - 16}
              width={32}
              height={32}
            >
              <div className="flex h-full w-full items-center justify-center">
                <ch.Icon size={22} color={ch.color} strokeWidth={1.8} />
              </div>
            </foreignObject>
            {/* Label below node */}
            <text
              x={ICON_X}
              y={channelYs[i] + NODE_RADIUS + 16}
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

        {/* Funnel — triangle that narrows into the output stem */}
        <motion.g
          initial={{ scale: 0.6, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.4, type: "spring", bounce: 0.25 }}
        >
          {/* Funnel body */}
          <path
            d={`M ${FUNNEL_X - 10} ${FUNNEL_Y - 70}
                L ${FUNNEL_X + 70} ${FUNNEL_Y - 70}
                L ${FUNNEL_X + 50} ${FUNNEL_Y + 10}
                L ${FUNNEL_X + 50} ${FUNNEL_Y + 60}
                L ${FUNNEL_X + 10} ${FUNNEL_Y + 60}
                L ${FUNNEL_X + 10} ${FUNNEL_Y + 10}
                Z`}
            fill="#F5F1E8"
            stroke="#7ea687"
            strokeWidth={2}
          />
          {/* Inner highlight to suggest depth */}
          <path
            d={`M ${FUNNEL_X - 4} ${FUNNEL_Y - 64}
                L ${FUNNEL_X + 64} ${FUNNEL_Y - 64}
                L ${FUNNEL_X + 46} ${FUNNEL_Y + 6}
                L ${FUNNEL_X + 14} ${FUNNEL_Y + 6}
                Z`}
            fill="#7ea687"
            fillOpacity={0.08}
          />
        </motion.g>

        {/* Output label below funnel */}
        <motion.text
          x={FUNNEL_X + 30}
          y={FUNNEL_Y + 90}
          textAnchor="middle"
          fill="#2a2722"
          fontSize="14"
          fontFamily="var(--font-mono, monospace)"
          fontWeight="600"
          initial={{ opacity: 0, y: FUNNEL_Y + 80 }}
          whileInView={{ opacity: 1, y: FUNNEL_Y + 90 }}
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
