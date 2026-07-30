"use client";

/**
 * CallbackModal — "Call me back" path for /demo/[industry] pages (and,
 * once the bot-menu addendum lands, a third option on Fly Erken's Celly
 * click-menu — same window.__openDemoCallbackModal trigger).
 *
 * Kept alongside the real GHL booking calendar (see sections2.tsx
 * BookingSection) as the low-friction fallback: no calendar to navigate,
 * just leave a number.
 *
 * Embeds GHL's own "Request a Callback" form (id VzQbRmbNTOwfeFDNOzlQ —
 * the same form the original fly.erken.systems GHL site used: first_name
 * optional, phone required, a "what do you want from this callback" custom
 * field, SMS-consent checkbox). Reusing the live GHL form widget — same
 * iframe + form_embed.js pattern the booking section already used for its
 * old lead form — means zero new backend surface: no site API route, no
 * new validation branch, and the SMS-consent language stays exactly as GHL
 * (and compliance) already configured it. Chosen over building a custom
 * name/phone/best-time form backed by a new /api/custom-request kind,
 * which would have meant loosening that route's existing email-required
 * contract for one caller and duplicating consent copy GHL already owns.
 *
 * Opened via window.__openDemoCallbackModal(), the same
 * install-on-mount-a-global-trigger pattern DemoVoiceWidget uses for
 * window.__startDemoVoiceCall — lets the nav button, the hero CTA row, and
 * any future entry point trigger the same modal instance without prop
 * drilling. Mounted once in DemoPageClient.
 *
 * PERFORMANCE / NO-JANK POLISH (owner fix, 2026-07-30 — flagged the old
 * version as "visibly resizing multiple times while the form loads" and
 * "slow to appear"):
 *   1. Fixed size from first paint — the iframe sits in a hard-height,
 *      overflow-clipped wrapper (FORM_AREA_HEIGHT). GHL's embed script does
 *      resize the iframe element itself once the form measures its content
 *      (that's the multi-resize jank); clipping the wrapper means that
 *      resize can no longer move anything the visitor sees — the modal's
 *      box is identical on open and once the form is ready.
 *   2. Loading state — a calm spinner fills the reserved space until the
 *      iframe fires `load` (plus a short settle delay for GHL's own JS to
 *      paint the fields), then the iframe fades in via opacity (no reflow).
 *   3. Speed — window.__prewarmDemoCallbackModal() lets a caller (the
 *      contact chooser, once wired) mount the iframe HIDDEN as soon as the
 *      chooser opens, not on page load (so it doesn't cost bandwidth on
 *      every visitor) and not only when "Request a callback" is actually
 *      clicked — by the time that click happens the form has usually
 *      already loaded. A preconnect + dns-prefetch pair for the GHL hosts
 *      is injected once per page so the very first request is faster too.
 */

import { useEffect, useRef, useState } from "react";
import { Phone, X } from "lucide-react";
import { track } from "@/lib/track";
import type { DemoConfig } from "../config";

declare global {
  interface Window {
    __openDemoCallbackModal?: () => void;
    __prewarmDemoCallbackModal?: () => void;
  }
}

// GHL "Request a Callback" form — lives in the same SRH sub-account as the
// "Demo - Discovery Flight (Fly Erken)" calendar (see config.ts booking.calendarId).
const CALLBACK_FORM_ID = "VzQbRmbNTOwfeFDNOzlQ";
const EMBED_SCRIPT_SRC = "https://link.msgsndr.com/js/form_embed.js";
const FORM_HOST = "https://api.leadconnectorhq.com";
const EMBED_SCRIPT_HOST = "https://link.msgsndr.com";

// The form's stable rendered size (name / phone / "what's this about" /
// SMS-consent checkbox) — hard-locked so GHL's own resize-on-load can't
// move the modal. Measured against the live form (Shamil 2026-07-30 polish).
const FORM_AREA_HEIGHT = 420;

/** One-time <link rel="preconnect"/"dns-prefetch"> pair for the GHL hosts —
 *  shaves the connection-setup time off the FIRST callback-form load of the
 *  session. Idempotent (checks for an existing tag) so mounting the modal
 *  on multiple pages never duplicates it. */
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

export default function CallbackModal({ config }: { config: DemoConfig }) {
  const [open, setOpen] = useState(false);
  // True once a caller (the contact chooser) has asked us to start loading
  // the form BEFORE the visitor has actually clicked "Request a callback" —
  // the iframe mounts (hidden) so it's usually already loaded by the time
  // the modal opens. Also flips true the normal way (opening the modal
  // directly) so the two triggers share one code path.
  const [warmed, setWarmed] = useState(false);
  const [formReady, setFormReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const mountIframe = open || warmed;

  useEffect(() => {
    ensurePreconnect();
  }, []);

  useEffect(() => {
    window.__openDemoCallbackModal = () => {
      setOpen(true);
      setWarmed(true);
      track("demo_callback_modal_opened", { industry: config.slug });
    };
    window.__prewarmDemoCallbackModal = () => setWarmed(true);
    return () => {
      delete window.__openDemoCallbackModal;
      delete window.__prewarmDemoCallbackModal;
    };
  }, [config.slug]);

  // Load the GHL embed script as soon as the iframe is mounted (open OR
  // prewarmed) — not only on open, so a prewarm actually gets ahead of the
  // click instead of still waiting on the script.
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
    // A short settle delay: `load` fires when the iframe's own HTML has
    // parsed, but GHL's in-page JS still paints/resizes the actual fields a
    // beat later — fading in immediately would just trade "resizing modal"
    // for "resizing content behind a transparent iframe". 250ms is enough
    // slack without feeling slow.
    window.setTimeout(() => setFormReady(true), 250);
  };

  if (!mountIframe) return null;

  // IMPORTANT: this is ONE return path for both "prewarming off-screen" and
  // "visibly open" — the iframe (and everything wrapping it) keeps the same
  // element types at the same tree position in both states, only classes/
  // styles/content toggle by `open`. Branching into two separate `return`s
  // (as the pre-polish version effectively did) would make React unmount
  // and remount the iframe when the modal opens after a prewarm — the
  // browser would restart the form's network request from zero, defeating
  // the whole point of prewarming.
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-[70] bg-black/60"
          onClick={() => setOpen(false)}
        />
      )}
      <div
        className={
          open
            ? "fixed inset-0 z-[71] flex items-center justify-center px-4"
            : "fixed"
        }
        style={open ? undefined : { left: "-9999px", top: 0, width: 1, height: 1, overflow: "hidden" }}
        aria-hidden={!open}
        onClick={open ? () => setOpen(false) : undefined}
      >
        <div
          className={open ? "w-full max-w-sm rounded-2xl border p-6 shadow-xl" : ""}
          style={open ? { background: "var(--d-surface)", borderColor: "var(--d-border)" } : undefined}
          onClick={open ? (e) => e.stopPropagation() : undefined}
        >
          {open && (
            <>
              <div className="flex items-start justify-between gap-4">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ background: "var(--d-accent-soft)", color: "var(--d-accent)" }}
                >
                  <Phone className="h-5 w-5" />
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="-mr-2 -mt-2 rounded-full p-2 transition-colors"
                  style={{ color: "var(--d-text-dim)" }}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <h3
                className="mt-4 text-lg font-semibold"
                style={{ color: "var(--d-text)", letterSpacing: "-0.02em" }}
              >
                Request a callback
              </h3>
              <p className="mt-1 text-sm" style={{ color: "var(--d-text-muted)" }}>
                Leave your number and {config.business.short} calls you back to
                book your flight.
              </p>
            </>
          )}

          {/* Fixed-height, overflow-clipped wrapper — the ONE thing that
              makes this jank-free: whatever GHL's script does to the
              iframe's own height, this box never changes size. Always the
              same size/position in the tree; only visually relocated by the
              ancestor's fixed positioning above. */}
          <div
            className="relative overflow-hidden rounded-lg"
            style={{
              height: `${FORM_AREA_HEIGHT}px`,
              width: `${FORM_AREA_HEIGHT}px`,
              maxWidth: "100%",
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
              src={`${FORM_HOST}/widget/form/${CALLBACK_FORM_ID}`}
              onLoad={handleIframeLoad}
              tabIndex={open ? undefined : -1}
              style={{
                width: "100%",
                height: `${FORM_AREA_HEIGHT}px`,
                border: "none",
                opacity: open && formReady ? 1 : 0,
                transition: "opacity 0.25s ease-out",
              }}
              id={`inline-${CALLBACK_FORM_ID}`}
              data-layout="{'id':'INLINE'}"
              data-trigger-type="alwaysShow"
              data-trigger-value=""
              data-activation-type="alwaysActivated"
              data-activation-value=""
              data-deactivation-type="neverDeactivate"
              data-deactivation-value=""
              data-form-name="Request a Callback"
              data-height={String(FORM_AREA_HEIGHT)}
              data-layout-iframe-id={`inline-${CALLBACK_FORM_ID}`}
              data-form-id={CALLBACK_FORM_ID}
              title="Request a callback"
            />
          </div>
        </div>
      </div>
    </>
  );
}

/** Opens the callback modal from anywhere (nav, hero CTA row, …). */
export function openCallbackModal() {
  window.__openDemoCallbackModal?.();
}

/** Starts loading the form ahead of time (e.g. as soon as the contact
 *  chooser opens) without showing the modal — see the perf note above. */
export function prewarmCallbackModal() {
  window.__prewarmDemoCallbackModal?.();
}
