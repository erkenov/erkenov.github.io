"use client";

/**
 * GhlWidgetLoader — sitewide GHL chat-widget management.
 *
 * 1) Injects the SRH A2P-compliance chat widget loader once (required by
 *    the Trust Center campaign registration: the widget must exist on
 *    https://erken.systems/).
 * 2) Hides the floating launcher bubble of EVERY <chat-widget> on the page
 *    (shadow-DOM style injection), current and future. Celly is the only
 *    visible chat trigger on this site — the GHL bubble must never show,
 *    regardless of how many widget loaders are present or which one wins
 *    the loader race. This also fixes the double-widget bubble regression
 *    seen on 2026-07-05.
 */

import { useEffect } from "react";

// Widget swapped 2026-07-09 during the GHL A2P support call — support issued a
// fresh widget id to register as the site's opt-in. Old id: 6a4a18bfc5790660801f7b13.
const SRH_WIDGET_ID = "6a4f6d5988718db6dd6bd252";

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
    // 1) Inject the SRH compliance widget loader once.
    if (!document.getElementById("srh-a2p-widget-loader")) {
      const s = document.createElement("script");
      s.id = "srh-a2p-widget-loader";
      s.src = "https://widgets.leadconnectorhq.com/loader.js";
      s.setAttribute(
        "data-resources-url",
        "https://widgets.leadconnectorhq.com/chat-widget/loader.js"
      );
      s.setAttribute("data-widget-id", SRH_WIDGET_ID);
      s.setAttribute("data-source", "WEB_USER");
      document.body.appendChild(s);
    }

    // 2) Keep every chat-widget launcher hidden, forever.
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
