"use client";

/**
 * ErkenChatWidget — loads the GoHighLevel chat widget. GHL's own default
 * bubble is the chat launcher now (Celly retired 2026-08-16, owner ruling).
 *
 * - Injects the GHL loader script once.
 * - openErkenChat() opens the panel via the official
 *   window.leadConnector.chatWidget.openWidget() API (probed live
 *   2026-06-05), retrying briefly if the script hasn't loaded yet.
 *   "Talk to us" buttons across the site call this.
 */

import { useEffect, useState } from "react";

// 2026-07-28: swapped from the OLD Erken Systems sub-account's widget
// (6a22cb7ced0ee22f92dd2085) to the "Erken Systems Website" widget in the
// consolidated Erken Systems sub-account (gHa4z3lLoqXA0Nvx802J).
const WIDGET_ID = "6a689c94702ca026d5646a27";

/**
 * useErkenChatOpen — true while the GHL chat panel is open.
 * Observes the <chat-widget> `data-active` attribute (flips true/false
 * on open/close) and also toggles `body.erken-chat-open` so plain CSS
 * can hide the roaming Celly without touching her 60fps movement code.
 */
export function useErkenChatOpen(): boolean {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    let observer: MutationObserver | null = null;
    let tries = 0;
    const attach = () => {
      const w = document.querySelector("chat-widget");
      if (w) {
        const update = () => {
          const active = w.getAttribute("data-active") === "true";
          setOpen(active);
          document.body.classList.toggle("erken-chat-open", active);
        };
        update();
        observer = new MutationObserver(update);
        observer.observe(w, {
          attributes: true,
          attributeFilter: ["data-active"],
        });
        return;
      }
      if (tries++ < 40) setTimeout(attach, 200);
    };
    attach();
    return () => {
      observer?.disconnect();
      document.body.classList.remove("erken-chat-open");
    };
  }, []);
  return open;
}

export function openErkenChat(attempt = 0): void {
  if (typeof window === "undefined") return;
  const cw = (window as unknown as {
    leadConnector?: { chatWidget?: { openWidget?: () => void } };
  }).leadConnector?.chatWidget;
  if (cw?.openWidget) {
    cw.openWidget();
    return;
  }
  // Widget script not ready yet — retry for ~3s then give up.
  if (attempt < 20) {
    setTimeout(() => openErkenChat(attempt + 1), 150);
  }
}

export default function ErkenChatWidget() {
  useEffect(() => {
    // 1) Inject the GHL loader script once.
    if (!document.getElementById("ghl-chat-loader")) {
      const s = document.createElement("script");
      s.id = "ghl-chat-loader";
      s.src = "https://beta.leadconnectorhq.com/loader.js";
      s.setAttribute(
        "data-resources-url",
        "https://beta.leadconnectorhq.com/chat-widget/loader.js"
      );
      s.setAttribute("data-widget-id", WIDGET_ID);
      document.body.appendChild(s);
    }
    // (2026-08-16: the hideLauncher step that hid GHL's default bubble is
    //  gone — Celly retired; GHL's own bubble is the launcher now.)
  }, []);

  return null;
}
