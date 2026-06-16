"use client";

// Fires a "pageview" event on first load and on every client-side route change,
// with the path, referrer, and any UTM params (so you can see where traffic came
// from — your video, a post, Google). Mounted once in the root layout.
// Uses usePathname only (no useSearchParams, so no Suspense boundary needed).

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { track } from "@/lib/track";

export default function PageViewTracker() {
  const pathname = usePathname();
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    track("pageview", {
      path: pathname,
      referrer: document.referrer || "",
      utm_source: p.get("utm_source") || "",
      utm_medium: p.get("utm_medium") || "",
      utm_campaign: p.get("utm_campaign") || "",
    });
  }, [pathname]);
  return null;
}
