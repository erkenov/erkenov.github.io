"use client";

// Loads PostHog ONLY for session replay (watching real visitor sessions). All
// the named analytics — pageviews, bot events — go through the server pipe
// (/api/events) so the dashboard stays clean and geo is real. So here we turn
// autocapture and client pageviews OFF and leave only session recording ON.
// The distinct_id is the same visitor id the server events use, so a recording
// lines up with that visitor's events. (Shamil 2026-06-14)
//
// Note: session recording also has to be enabled in the PostHog project settings
// ("Record user sessions") — the SDK flag alone isn't enough.
//
// The apiKey is the public phc_ project key (safe in the browser — it's in every
// PostHog snippet); it's passed down from the server layout.

import { useEffect } from "react";
import posthog from "posthog-js";
import { visitorId } from "@/lib/track";

let started = false;

export default function PostHogProvider({ apiKey, host }: { apiKey: string; host: string }) {
  useEffect(() => {
    if (started || !apiKey) return;
    started = true;
    posthog.init(apiKey, {
      api_host: host || "https://us.i.posthog.com",
      autocapture: false, // we send our own named events server-side
      capture_pageview: false, // pageviews tracked server-side (with real geo)
      capture_pageleave: true,
      disable_session_recording: false, // ← session replay ON
      bootstrap: { distinctID: visitorId() },
      persistence: "localStorage+cookie",
    });
  }, [apiKey, host]);
  return null;
}
