"use client";

/**
 * CallbackRequestModal — "Request a callback" path for erken.systems (the
 * bot's click-menu third option, owner addition 2026-07-30, alongside its
 * existing Text chat / Voice chat buttons).
 *
 * Fly Erken's own callback path (src/app/demo/components/CallbackModal.tsx)
 * embeds a demo-branded GHL form (hardcodes "Fly Erken" copy and a
 * demo-scoped form id) — not a fit for the main site. Instead this posts a
 * small name/phone/email form straight to /api/custom-request with
 * kind: "callback-request" (added additively to that route's whitelist,
 * tag "callback-request" — see the route for the full contract). Email is
 * still required by that route's validation, so it's asked for here too,
 * framed as "so we can confirm" rather than as the primary field — phone is
 * the actual ask and gets first position + autofocus.
 *
 * Being a plain form (no third-party iframe), it has none of the GHL-embed
 * loading jank the Fly Erken modal needed fixing — it just needs to render,
 * so there's no skeleton/prewarm machinery here.
 *
 * Opened via window.__openErkenCallbackModal(), the same install-on-mount
 * global-trigger pattern as window.__startErkenVoiceCall
 * (src/components/ErkenVoiceWidget.tsx) and ContactChooser. Mount ONCE per
 * page (home-v8-draft, wherever the bot's click-menu lives).
 */

import { useEffect, useState } from "react";
import { Phone, X } from "lucide-react";

declare global {
  interface Window {
    __openErkenCallbackModal?: () => void;
  }
}

type SendState = "idle" | "sending" | "sent" | "error";

export default function CallbackRequestModal() {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [state, setState] = useState<SendState>("idle");

  useEffect(() => {
    window.__openErkenCallbackModal = () => setOpen(true);
    return () => {
      delete window.__openErkenCallbackModal;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "sending" || !phone.trim() || !email.trim()) return;
    setState("sending");
    try {
      const r = await fetch("/api/custom-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          phone: phone.trim(),
          kind: "callback-request",
          channel: "form",
          ...(name.trim() ? { name: name.trim() } : {}),
        }),
      });
      setState(r.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[220] flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-white/15 bg-black/85 p-6 shadow-2xl backdrop-blur-md"
        onClick={(e) => e.stopPropagation()}
      >
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

        <div className="mt-4 min-h-[9rem]">
          {state === "sent" ? (
            <p className="rounded-xl border border-white/15 bg-white/10 p-4 text-sm leading-relaxed text-white/90">
              Got it — we&apos;ll call you back shortly.
            </p>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-2">
              <p className="text-sm text-white/60">Leave your number and we&apos;ll call you back.</p>
              <input
                type="tel"
                required
                autoFocus
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="your phone"
                className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-base text-white placeholder-white/40 outline-none transition-colors focus:border-white/40"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your email — so we can confirm"
                className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-base text-white placeholder-white/40 outline-none transition-colors focus:border-white/40"
              />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="name (optional)"
                className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-base text-white placeholder-white/40 outline-none transition-colors focus:border-white/40"
              />
              <button
                type="submit"
                disabled={state === "sending"}
                className="mt-1 w-full cursor-pointer rounded-xl bg-[#7ea687] px-6 py-3 text-base font-semibold text-[#08110a] transition-colors hover:bg-[#B8D4BD] disabled:opacity-50"
              >
                {state === "sending"
                  ? "One second…"
                  : state === "error"
                    ? "Didn't go through — try again"
                    : "Request callback"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/** Opens the callback modal from anywhere (the bot's click-menu, once wired). */
export function openErkenCallbackModal() {
  window.__openErkenCallbackModal?.();
}
