"use client";

/**
 * GhlWidgetLoader — RETIRED 2026-08-16 (owner ruling, Shamil).
 *
 * This component used to hide the GHL chat widget's floating launcher
 * bubble sitewide (shadow-DOM style injection) so Celly was the only
 * visible chat trigger. Celly is retired; GHL's own default bubble is the
 * chat launcher now, so the suppression is removed. The component stays
 * mounted in app/layout.tsx as a no-op so no layout edit is needed.
 */
export default function GhlWidgetLoader() {
  return null;
}
