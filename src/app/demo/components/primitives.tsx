"use client";

/**
 * Shared building blocks for /demo/[industry] pages: scroll-reveal
 * wrapper, three-tier section heading, and the config-driven icon map.
 * Motion follows the site design system: fade-up, ease [0.16,1,0.3,1],
 * once-only viewport reveals.
 *
 * All colors come from the demo theme CSS custom properties
 * (--d-accent, --d-surface, …) set on the page wrapper in
 * DemoPageClient, so these components are industry-agnostic.
 */

import { motion } from "framer-motion";
import {
  CalendarCheck,
  Clock,
  Compass,
  Gauge,
  GraduationCap,
  KeyRound,
  MapPin,
  Phone,
  Plane,
  RadioTower,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { DemoIconName } from "../config";

export const EASE = [0.16, 1, 0.3, 1] as const;

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Uppercase mono kicker in the demo accent color. */
export function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="font-mono text-xs font-medium uppercase"
      style={{ letterSpacing: "0.12em", color: "var(--d-accent)" }}
    >
      {children}
    </div>
  );
}

/** Three-tier section heading: kicker → h2 → subhead. */
export function SectionHeading({
  kicker,
  headline,
  sub,
  center = false,
}: {
  kicker: string;
  headline: string;
  sub?: string;
  center?: boolean;
}) {
  return (
    <Reveal className={center ? "text-center" : ""}>
      <Kicker>{kicker}</Kicker>
      <h2
        className="mt-3 text-3xl md:text-[2.5rem] font-bold"
        style={{ letterSpacing: "-0.03em", lineHeight: 1.15, color: "var(--d-text)" }}
      >
        {headline}
      </h2>
      {sub ? (
        <p
          className={`mt-4 max-w-2xl text-base md:text-lg ${center ? "mx-auto" : ""}`}
          style={{ color: "var(--d-text-muted)", lineHeight: 1.6 }}
        >
          {sub}
        </p>
      ) : null}
    </Reveal>
  );
}

/** Hairline gradient divider between sections. */
export function Divider() {
  return (
    <div
      className="h-px w-full"
      style={{
        background:
          "linear-gradient(to right, transparent, var(--d-border), transparent)",
      }}
    />
  );
}

const ICONS: Record<DemoIconName, React.ComponentType<{ className?: string }>> = {
  plane: Plane,
  compass: Compass,
  gauge: Gauge,
  key: KeyRound,
  graduation: GraduationCap,
  radio: RadioTower,
  phone: Phone,
  calendar: CalendarCheck,
  shield: ShieldCheck,
  clock: Clock,
  map: MapPin,
  users: Users,
};

export function DemoIcon({
  name,
  className,
}: {
  name: DemoIconName;
  className?: string;
}) {
  const C = ICONS[name] ?? Plane;
  return <C className={className} />;
}

/** Primary button — solid accent. */
export function PrimaryButton({
  children,
  onClick,
  href,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
}) {
  const cls =
    "inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:scale-[1.02]";
  const style = { background: "var(--d-accent)" };
  if (href) {
    return (
      <a href={href} onClick={onClick} className={cls} style={style}>
        {children}
      </a>
    );
  }
  return (
    <button onClick={onClick} className={cls} style={style}>
      {children}
    </button>
  );
}

/** Secondary button — hairline border, transparent. */
export function SecondaryButton({
  children,
  onClick,
  light = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  /** Set true when the button sits on the dark band. */
  light?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2 rounded-lg border px-6 py-3 text-sm font-medium transition-colors duration-200"
      style={{
        borderColor: light ? "rgba(255,255,255,0.25)" : "var(--d-border)",
        color: light ? "var(--d-dark-text)" : "var(--d-text)",
        background: "transparent",
      }}
    >
      {children}
    </button>
  );
}
