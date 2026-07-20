"use client";

/**
 * GhlWidgetLoader — sitewide GHL chat-widget launcher-bubble suppression.
 *
 * Used to also inject the temporary SRH A2P-compliance chat widget loader
 * (required while the Trust Center campaign registration was pending).
 * Shamil confirmed 2026-07-20 that registration is finished and approved,
 * so that injection was removed — ErkenChatWidget's loader (widget id
 * 6a22cb7ced0ee22f92dd2085) is now the only <chat-widget> loader on the
 * site.
 *
 * What's left: hides the floating launcher bubble of EVERY <chat-widget>
 * on the page (shadow-DOM style injection), current and future. Celly is
 * the only visible chat trigger on this site — the GHL bubble must never
 * show, regardless of how many widget loaders are present or which one
 * wins the loader race. This also fixes the double-widget bubble
 * regression seen on 2026-07-05. Kept as a standing safety net even with
 * a single widget loader, since it's a no-cost MutationObserver + shadow
 * DOM CSS injection (no extra script/network request).
 */

import { useEffect } from "react";

function hideBubble(w: Element & { shadowRoot: ShadowRoot | null }) {
  if (!w.shadowRoot) return false;
  if (!w.shadowRoot.getElementById("erken-hide-launcher-global")) {
    const style = document.createElement("style");
    style.id = "erken-hide-launcher-global";
    style.textContent = ".lc_text-widget--bubble{display:none !important;}";
    w.shadowRoot.appendChild(style);
  }
  return true;
}

export default function GhlWidgetLoader() {
  useEffect(() => {
    // Keep every chat-widget launcher hidden, forever.
    const sweep = () => {
      document
        .querySelectorAll<Element & { shadowRoot: ShadowRoot | null }>(
          "chat-widget"
        )
        .forEach((w) => {
          if (!hideBubble(w)) {
            // shadow root not ready yet — retry shortly
            setTimeout(() => hideBubble(w), 500);
            setTimeout(() => hideBubble(w), 2000);
          }
        });
    };
    sweep();
    const observer = new MutationObserver(sweep);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
