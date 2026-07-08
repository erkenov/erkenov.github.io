"use client";

/**
 * "Request a call" section — the live-demo capture door (2026-07-08).
 *
 * Embeds the GHL "Request a Call" form (Erken Systems sub-account) inline.
 * Submitting it fires the GHL workflow: Form Submitted → Voice AI outbound
 * call — so the form IS a live demo of the product: the visitor's phone
 * rings and the AI is talking to them.
 *
 * Shamil pasted the POPUP embed variant; this renders the same form with
 * the INLINE layout attributes instead so it lives in the page flow.
 * form_embed.js handles iframe auto-resize via postMessage — the fixed
 * height below is only the pre-script fallback.
 */

import { useEffect } from "react";

const FORM_ID = "e3uSHlYnl0MrQe29KItJ";
const EMBED_SCRIPT_SRC = "https://link.msgsndr.com/js/form_embed.js";

export function CallbackSection() {
  useEffect(() => {
    if (document.querySelector(`script[src="${EMBED_SCRIPT_SRC}"]`)) return;
    const s = document.createElement("script");
    s.src = EMBED_SCRIPT_SRC;
    s.async = true;
    document.body.appendChild(s);
  }, []);

  return (
    <section className="relative px-6 md:px-12 pt-24 md:pt-36 pb-20 md:pb-32">
      <div
        data-celly-avoid
        className="relative z-30 max-w-3xl mx-auto text-center"
      >
        <div className="mono-label">See it in action</div>
        <h2
          className="mt-3 text-3xl md:text-5xl font-bold tracking-tight"
          style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
        >
          Request a call. The AI calls you back.
        </h2>
        <p className="mt-5 text-base md:text-lg text-text-muted leading-relaxed">
          Leave your number and the same AI assistant we set up for our
          clients will call you within a minute — live, not a recording.
          That call is the demo.
        </p>
      </div>
      <div
        data-celly-avoid
        className="relative z-30 mt-10 max-w-xl mx-auto rounded-2xl border border-border bg-surface p-4 md:p-6"
      >
        <iframe
          src={`https://api.leadconnectorhq.com/widget/form/${FORM_ID}`}
          style={{
            width: "100%",
            height: "560px",
            border: "none",
            borderRadius: "8px",
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
          data-height="527"
          data-layout-iframe-id={`inline-${FORM_ID}`}
          data-form-id={FORM_ID}
          title="Request a Call"
        />
        <p className="mt-3 text-xs text-text-dim text-center">
          Live callback works for US phone numbers right now.
        </p>
      </div>
    </section>
  );
}
