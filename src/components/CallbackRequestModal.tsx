"use client";

/**
 * CallbackRequestModal — "Request a callback" path for erken.systems (the
 * contact chooser's third option, alongside Voice / Text chat).
 *
 * 2026-08-05 rewrite (owner ask): the modal now embeds the SAME GHL
 * "Request a Call" form (e3uSHlYnl0MrQe29KItJ, Erken Systems sub-account)
 * that the homepage's CallbackSection renders inline — instead of the old
 * custom name/phone/email form that posted to /api/custom-request. One
 * reason for the swap: submitting this GHL form fires the GHL workflow
 * Form Submitted → Voice AI outbound call, so the callback actually happens
 * (the custom form only created a tagged contact). The Fly Erken demo form
 * (VzQbRmbNTOwfeFDNOzlQ) stays demo-scoped and is NOT reused here — it
 * hardcodes Fly Erken copy and the demo SMS-consent flow.
 *
 * Rendering copies the demo modal's no-jank pattern
 * (src/app/demo/components/CallbackModal.tsx): fixed-size box from first
 * paint with an overflow-clipped wrapper so GHL's embed-script resize can't
 * move the modal, a spinner until the iframe's content settles, opacity
 * fade-in (no reflow), and window.__prewarmErkenCallbackModal() so the
 * contact chooser can start loading the form hidden as soon as it opens.
 *
 * Opened via window.__openErkenCallbackModal(), the same install-on-mount
 * global-trigger pattern as window.__startErkenVoiceCall
 * (src/components/ErkenVoiceWidget.tsx). Mount ONCE per page wherever
 * ContactChooser lives (home-v8-draft, /start).
 */

import { useEffect, useRef, useState } from "react";
import { Phone, X } from "lucide-react";

declare global {
  interface Window {
    __openErkenCallbackModal?: () => void;
    __prewarmErkenCallbackModal?: () => void;
  }
}

// GHL "Request a Call" form — same id as src/components/CallbackSection.tsx.
const FORM_ID = "e3uSHlYnl0MrQe29KItJ";
const FORM_HOST = "https://api.leadconnectorhq.com";
const EMBED_SCRIPT_SRC = "https://link.msgsndr.com/js/form_embed.js";
const EMBED_SCRIPT_HOST = "https://link.msgsndr.com";

// The form's stable rendered height (CallbackSection embeds it at 560px
// with data-height 527) — hard-locked so GHL's own resize-on-load can't
// move the modal; the wrapper clips/scrolls instead.
const FORM_AREA_HEIGHT = 560;

/** One-time <link rel="preconnect"/"dns-prefetch"> pair for the GHL hosts —
 *  shaves the connection-setup time off the FIRST form load of the session.
 *  Idempotent so mounting on multiple pages never duplicates it. */
function ensurePreconnect() {
  if (typeof document === "undefined") return;
  const add = (rel: string, href: string) => {
    const id = `${rel}-${href}`;
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = rel;
    link.href = href;
    if (rel === "preconnect") link.crossOrigin = "anonymous";
    document.head.appendChild(link);
  };
  add("preconnect", FORM_HOST);
  add("dns-prefetch", FORM_HOST);
  add("preconnect", EMBED_SCRIPT_HOST);
  add("dns-prefetch", EMBED_SCRIPT_HOST);
}

export default function CallbackRequestModal() {
  const [open, setOpen] = useState(false);
  // True once a caller (the contact chooser) has asked us to start loading
  // the form BEFORE the visitor clicks "Request a callback" — the iframe
  // mounts hidden so it's usually loaded by the time the modal opens.
  const [warmed, setWarmed] = useState(false);
  const [formReady, setFormReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const mountIframe = open || warmed;

  useEffect(() => {
    ensurePreconnect();
  }, []);

  useEffect(() => {
    window.__openErkenCallbackModal = () => {
      setOpen(true);
      setWarmed(true);
    };
    window.__prewarmErkenCallbackModal = () => setWarmed(true);
    return () => {
      delete window.__openErkenCallbackModal;
      delete window.__prewarmErkenCallbackModal;
    };
  }, []);

  // Load the GHL embed script as soon as the iframe is mounted (open OR
  // prewarmed) — not only on open, so a prewarm actually gets ahead of the
  // click.
  useEffect(() => {
    if (!mountIframe) return;
    if (document.querySelector(`script[src="${EMBED_SCRIPT_SRC}"]`)) return;
    const s = document.createElement("script");
    s.src = EMBED_SCRIPT_SRC;
    s.async = true;
    document.body.appendChild(s);
  }, [mountIframe]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const handleIframeLoad = () => {
    // `load` fires when the iframe's HTML parsed, but GHL's in-page JS
    // paints the fields a beat later — a short settle delay avoids trading
    // "resizing modal" for "resizing content behind a transparent iframe".
    window.setTimeout(() => setFormReady(true), 250);
  };

  if (!mountIframe) return null;

  // IMPORTANT: ONE return path for both "prewarming off-screen" and
  // "visibly open" — the iframe keeps the same element types at the same
  // tree position in both states, only classes/styles toggle by `open`.
  // Branching into two `return`s would make React remount the iframe on
  // open, restarting the form's network request and defeating the prewarm.
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-[219] bg-black/60"
          onClick={() => setOpen(false)}
        />
      )}
      <div
        className={
          open
            ? "fixed inset-0 z-[220] flex items-center justify-center px-4"
            : "fixed"
        }
        style={open ? undefined : { left: "-9999px", top: 0, width: 1, height: 1, overflow: "hidden" }}
        aria-hidden={!open}
        onClick={open ? () => setOpen(false) : undefined}
      >
        <div
          className={open ? "w-full max-w-sm rounded-2xl border border-white/15 bg-black/85 p-6 shadow-2xl backdrop-blur-md" : ""}
          onClick={open ? (e) => e.stopPropagation() : undefined}
        >
          {open && (
            <>
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white">
                  <Phone className="h-5 w-5" />
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="-mr-2 -mt-2 rounded-full p-2 text-white/40 transition-colors hover:text-white/90"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <h3 className="mt-4 text-lg font-semibold text-white" style={{ letterSpacing: "-0.02em" }}>
                Request a callback
              </h3>
              <p className="mt-1 text-sm text-white/60">
                Leave your number and our AI assistant calls you back within a minute.
              </p>
            </>
          )}

          {/* Fixed-height, overflow-clipped wrapper — whatever GHL's script
              does to the iframe's own height, this box never changes size. */}
          <div
            className="relative rounded-lg"
            style={{
              // Capped by the viewport so the modal always fits; when the
              // cap bites the wrapper scrolls so the submit button stays
              // reachable.
              height: `min(${FORM_AREA_HEIGHT}px, calc(100dvh - 260px))`,
              width: "100%",
              overflowY: "auto",
              overflowX: "hidden",
              marginTop: open ? "16px" : 0,
              background: "#FFFFFF",
            }}
          >
            {open && !formReady && (
              <div
                aria-hidden
                className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                style={{ background: "#FFFFFF" }}
              >
                <span
                  className="h-6 w-6 animate-spin rounded-full"
                  style={{ border: "2px solid rgba(0,0,0,0.1)", borderTopColor: "rgba(0,0,0,0.4)" }}
                />
                <span className="text-xs" style={{ color: "rgba(0,0,0,0.4)" }}>
                  Loading form…
                </span>
              </div>
            )}
            <iframe
              ref={iframeRef}
              src={`${FORM_HOST}/widget/form/${FORM_ID}`}
              onLoad={handleIframeLoad}
              tabIndex={open ? undefined : -1}
              style={{
                width: "100%",
                height: `${FORM_AREA_HEIGHT}px`,
                border: "none",
                opacity: open && formReady ? 1 : 0,
                transition: "opacity 0.25s ease-out",
              }}
              id={`inline-${FORM_ID}`}
              data-layout="{'id':'INLINE'}"
              data-trigger-type="alwaysShow"
              data-trigger-value=""
              data-activation-type="alwaysActivated"
              data-activation-value=""
              data-deactivation-type="neverDeactivate"
              data-deactivation-value=""
              data-form-name="Request a Call"
              data-height={String(FORM_AREA_HEIGHT)}
              data-layout-iframe-id={`inline-${FORM_ID}`}
              data-form-id={FORM_ID}
              title="Request a callback"
            />
          </div>
        </div>
      </div>
    </>
  );
}

/** Opens the callback modal from anywhere (the contact chooser's third item). */
export function openErkenCallbackModal() {
  window.__openErkenCallbackModal?.();
}
