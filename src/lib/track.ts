// Lightweight client-side analytics → server /api/events → PostHog.
//
// Why server-side (not posthog-js): the events pipe + write key already live in
// /api/events, and going through the server lets it stamp the REAL visitor IP so
// PostHog resolves true geography (client-side we'd need to expose a key, and the
// old server events showed the datacenter location instead of the visitor). We
// send clearly-named events (pageview, bot_call_started, bot_lead_captured…) so
// the PostHog dashboard reads plainly. (Shamil 2026-06-14)

export function visitorId(): string {
  try {
    let id = localStorage.getItem("erk_vid");
    if (!id) {
      id = "v_" + Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
      localStorage.setItem("erk_vid", id);
    }
    return id;
  } catch {
    return "anon";
  }
}

export function track(event: string, data: Record<string, unknown> = {}): void {
  try {
    const body = JSON.stringify({
      event,
      session_id: visitorId(),
      data: { url: typeof location !== "undefined" ? location.href : "", ...data },
      ts: new Date().toISOString(),
      version: "site",
    });
    // sendBeacon survives page-unload (e.g. a click that navigates away); fall
    // back to keepalive fetch where it's unavailable.
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon("/api/events", new Blob([body], { type: "application/json" }));
    } else {
      fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // analytics must never break the page
  }
}
