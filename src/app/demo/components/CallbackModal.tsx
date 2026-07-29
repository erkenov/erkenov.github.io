"use client";

/**
 * CallbackModal — "Call me back" path for /demo/[industry] pages.
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
 */

import { useEffect, useState } from "react";
import { Phone, X } from "lucide-react";
import { track } from "@/lib/track";
import type { DemoConfig } from "../config";

declare global {
  interface Window {
    __openDemoCallbackModal?: () => void;
  }
}

// GHL "Request a Callback" form — lives in the same SRH sub-account as the
// "Demo - Discovery Flight (Fly Erken)" calendar (see config.ts booking.calendarId).
const CALLBACK_FORM_ID = "VzQbRmbNTOwfeFDNOzlQ";
const EMBED_SCRIPT_SRC = "https://link.msgsndr.com/js/form_embed.js";

export default function CallbackModal({ config }: { config: DemoConfig }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    window.__openDemoCallbackModal = () => {
      setOpen(true);
      track("demo_callback_modal_opened", { industry: config.slug });
    };
    return () => {
      delete window.__openDemoCallbackModal;
    };
  }, [config.slug]);

  // Load the GHL embed script once, only when the modal has actually been
  // opened (no point loading it on every page view).
  useEffect(() => {
    if (!open) return;
    if (document.querySelector(`script[src="${EMBED_SCRIPT_SRC}"]`)) return;
    const s = document.createElement("script");
    s.src = EMBED_SCRIPT_SRC;
    s.async = true;
    document.body.appendChild(s);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center px-4"
      style={{ background: "rgba(10,10,15,0.6)" }}
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-sm rounded-2xl border p-6 shadow-xl"
        style={{ background: "var(--d-surface)", borderColor: "var(--d-border)" }}
        onClick={(e) => e.stopPropagation()}
      >
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
          Leave your number and {config.business.short} calls you back to book
          your flight.
        </p>

        <iframe
          src={`https://api.leadconnectorhq.com/widget/form/${CALLBACK_FORM_ID}`}
          style={{
            width: "100%",
            height: "420px",
            minHeight: "360px",
            border: "none",
            borderRadius: "8px",
            marginTop: "16px",
            // The GHL form renders on white; keep it readable on dark themes.
            background: "#FFFFFF",
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
          data-height="420"
          data-layout-iframe-id={`inline-${CALLBACK_FORM_ID}`}
          data-form-id={CALLBACK_FORM_ID}
          title="Request a callback"
        />
      </div>
    </div>
  );
}

/** Opens the callback modal from anywhere (nav, hero CTA row, …). */
export function openCallbackModal() {
  window.__openDemoCallbackModal?.();
}
