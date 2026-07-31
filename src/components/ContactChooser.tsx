"use client";

/**
 * ContactChooser — the "Talk to us now" popup (voice / text chat), ported
 * from src/app/fly-erken/FlyErkenClient.tsx's contact chooser (owner
 * addendum, 2026-07-30): every "Try for free" button on erken.systems and
 * /start becomes "Talk to us now" — the sales motion is call-first, no
 * self-serve trial framing.
 *
 * Voice wires to window.__startErkenVoiceCall, the SAME global the site's
 * existing voice widget (src/components/ErkenVoiceWidget.tsx) already
 * installs and that /start's "Talk to our receptionist" button already
 * calls — not the demo-only window.__startDemoVoiceCall Fly Erken uses.
 * Text opens the same GHL chat widget via openErkenChat().
 *
 * Callback option (owner ask, 2026-07-31): third menu item opens the main
 * site's own CallbackRequestModal (src/components/CallbackRequestModal.tsx
 * — plain name/phone/email form → /api/custom-request kind
 * "callback-request"), NOT Fly Erken's demo-branded GHL-iframe modal.
 *
 * Usage: mount <ContactChooser /> ONCE per page, and mount
 * <CallbackRequestModal /> alongside it (the callback item calls its
 * window.__openErkenCallbackModal global — without the mount it no-ops).
 * Any button anywhere on that page opens the chooser via
 * openContactChooser(anchorEl) — anchorEl positions the menu under that
 * element; omit it to center the menu on screen.
 */

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { openErkenChat } from "@/components/ErkenChatWidget";

declare global {
  interface Window {
    __startErkenVoiceCall?: () => void;
    __openErkenCallbackModal?: () => void;
  }
}

const CONTACT_EVENT = "erken:contact-chooser";

export function openContactChooser(anchorEl?: HTMLElement | null) {
  if (typeof window === "undefined") return;
  let x = window.innerWidth / 2;
  let y = window.innerHeight * 0.4;
  let anchored = false;
  if (anchorEl) {
    const r = anchorEl.getBoundingClientRect();
    const half = 150;
    x = Math.max(half, Math.min(window.innerWidth - half, r.left + r.width / 2));
    y = r.bottom;
    anchored = true;
  }
  window.dispatchEvent(new CustomEvent(CONTACT_EVENT, { detail: { x, y, anchored } }));
}

export default function ContactChooser() {
  const [menu, setMenu] = useState<{ x: number; y: number; anchored: boolean } | null>(null);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const d = (e as CustomEvent).detail as { x: number; y: number; anchored: boolean };
      setMenu(d);
    };
    window.addEventListener(CONTACT_EVENT, onOpen);
    return () => window.removeEventListener(CONTACT_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!menu) return;
    const close = () => setMenu(null);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(null);
    };
    window.addEventListener("scroll", close, { passive: true, once: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", close);
      window.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  if (!menu) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[215] bg-black/20"
        aria-hidden
        onClick={() => setMenu(null)}
      />
      <div
        role="menu"
        aria-label="Contact Erken Systems"
        className="fixed z-[216] flex w-[280px] flex-col gap-1 rounded-2xl border border-white/15 bg-black/85 p-2 shadow-2xl backdrop-blur-md"
        style={
          menu.anchored
            ? {
                left: menu.x,
                top: Math.min(menu.y + 8, window.innerHeight - 200),
                transform: "translateX(-50%)",
              }
            : { left: "50%", top: "40%", transform: "translate(-50%, -50%)" }
        }
      >
        <div className="flex items-center justify-between px-3 pb-1 pt-1">
          <span className="text-xs text-white/55">Contact Erken Systems</span>
          <button
            type="button"
            aria-label="Close"
            onClick={() => setMenu(null)}
            className="rounded-full p-1 text-white/40 transition-colors hover:text-white/90"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        <button
          role="menuitem"
          onClick={() => {
            setMenu(null);
            window.__startErkenVoiceCall?.();
          }}
          className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm text-white transition-colors hover:bg-white/15"
        >
          <span aria-hidden className="text-base">
            🎙️
          </span>
          <span>
            Voice — talk right now
            <span className="block text-xs text-white/50">We pick up instantly</span>
          </span>
        </button>
        <button
          role="menuitem"
          onClick={() => {
            setMenu(null);
            openErkenChat();
          }}
          className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm text-white transition-colors hover:bg-white/15"
        >
          <span aria-hidden className="text-base">
            💬
          </span>
          <span>
            Text chat
            <span className="block text-xs text-white/50">Type your question, get answers</span>
          </span>
        </button>
        <button
          role="menuitem"
          onClick={() => {
            setMenu(null);
            window.__openErkenCallbackModal?.();
          }}
          className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm text-white transition-colors hover:bg-white/15"
        >
          <span aria-hidden className="text-base">
            📞
          </span>
          <span>
            Request a callback
            <span className="block text-xs text-white/50">Leave your number, we call you</span>
          </span>
        </button>
      </div>
    </>
  );
}
