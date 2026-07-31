"use client";

/**
 * ErkenVoiceWidget — in-browser voice call with Erken (the site voice
 * agent) via Retell. The hero "Show the demo" button calls the global
 * window.__startErkenVoiceCall() this component installs. While a call is
 * active it shows a small status panel (connecting / live + talking pulse)
 * with an End button. Secret key stays server-side (see /api/retell-web-call).
 *
 * GRACEFUL FALLBACK (Shamil 2026-06-14): if a call can't start — the daily
 * spend cap is hit, the visitor hit their per-hour limit, or any error — we do
 * NOT silently vanish (the old "connecting then disappears" bug). Instead we
 * show a "leave your email and Shamil will reach out" form and capture the lead
 * via /api/signup. Nothing on the site ever looks broken; worst case still
 * converts.
 */

import { useEffect, useRef, useState } from "react";
import { RetellWebClient } from "retell-client-js-sdk";
import { track } from "@/lib/track";

type CallState = "idle" | "connecting" | "live" | "fallback" | "sending" | "sent";

declare global {
  interface Window {
    __startErkenVoiceCall?: () => void;
  }
}

export default function ErkenVoiceWidget() {
  const [state, setState] = useState<CallState>("idle");
  const [agentTalking, setAgentTalking] = useState(false);
  const [fallbackMsg, setFallbackMsg] = useState("");
  const [email, setEmail] = useState("");
  const clientRef = useRef<RetellWebClient | null>(null);
  const activeRef = useRef(false);

  useEffect(() => {
    const client = new RetellWebClient();
    clientRef.current = client;
    // Browsers can block audio that starts outside a FRESH user gesture:
    // minting the token costs two network round-trips (spend-cap check +
    // create-web-call), which can outlive Chrome's transient-activation
    // window. The call then connects fine (green light, transcript flows on
    // Retell's side) but the agent is silent. startAudioPlayback() is the
    // SDK's sanctioned unblock (LiveKit room.startAudio()) — try it as soon
    // as the call starts, and retry on every user gesture while live (no-op
    // once audio is already playing).
    const unblockAudio = () => {
      client.startAudioPlayback().catch(() => {});
    };
    const removeUnblockListeners = () => {
      document.removeEventListener("pointerdown", unblockAudio);
      document.removeEventListener("keydown", unblockAudio);
    };
    client.on("call_started", () => {
      activeRef.current = true;
      setState("live");
      track("bot_call_started");
      unblockAudio();
      document.addEventListener("pointerdown", unblockAudio);
      document.addEventListener("keydown", unblockAudio);
    });
    client.on("call_ended", () => {
      activeRef.current = false;
      setState("idle");
      setAgentTalking(false);
      removeUnblockListeners();
      track("bot_call_completed");
    });
    client.on("agent_start_talking", () => setAgentTalking(true));
    client.on("agent_stop_talking", () => setAgentTalking(false));
    client.on("error", (err) => {
      console.error("Retell web call error:", err);
      // auto-telemetry: visitors never report a dead call — we do it for them
      try {
        fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kind: "error",
            message: "[auto:error] site voice call failed: " + String(err).slice(0, 600),
            url: window.location.href,
            title: document.title,
          }),
        });
      } catch {}
      activeRef.current = false;
      setAgentTalking(false);
      // if the call never went live, offer the email fallback instead of vanishing
      setFallbackMsg("Erken couldn't connect just now — leave your email and Shamil will reach out personally.");
      setState((s) => (s === "connecting" ? "fallback" : "idle"));
      try {
        client.stopCall();
      } catch {}
    });

    const start = async () => {
      if (activeRef.current) return;
      activeRef.current = true;
      setEmail("");
      setFallbackMsg("");
      setState("connecting");
      try {
        const res = await fetch("/api/retell-web-call", { method: "POST" });
        if (!res.ok) {
          const data = await res.json().catch(() => ({} as { message?: string; error?: string }));
          activeRef.current = false;
          setFallbackMsg(
            data?.message ||
              "Erken's unavailable right this second — leave your email and Shamil will reach out personally.",
          );
          setState("fallback");
          track("bot_fallback_shown", { reason: data?.error || "blocked", status: res.status });
          return;
        }
        const data = await res.json();
        if (!data?.access_token) throw new Error("No access token");
        await client.startCall({ accessToken: data.access_token });
      } catch (err) {
        console.error("Could not start Erken voice call:", err);
        activeRef.current = false;
        setFallbackMsg(
          "Erken couldn't connect just now — leave your email and Shamil will reach out personally.",
        );
        setState("fallback");
        track("bot_fallback_shown", { reason: "error" });
      }
    };
    window.__startErkenVoiceCall = start;

    return () => {
      delete window.__startErkenVoiceCall;
      removeUnblockListeners();
      try {
        client.stopCall();
      } catch {}
    };
  }, []);

  async function submitFallback() {
    const e = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)) return;
    setState("sending");
    try {
      await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: e }),
      });
    } catch {}
    track("bot_lead_captured", { via: "fallback" });
    setState("sent");
  }

  if (state === "idle") return null;

  // ── leave-your-email fallback (busy / capped / errored) ──────────────────
  if (state === "fallback" || state === "sending" || state === "sent") {
    return (
      <div
        className="fixed z-[60] left-1/2 -translate-x-1/2 bottom-6 w-[min(92vw,420px)] rounded-2xl border border-white/15 bg-black/80 px-5 py-4 backdrop-blur-md shadow-xl"
        style={{ pointerEvents: "auto" }}
      >
        {state === "sent" ? (
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-white/90">
              Got it — Shamil will reach out shortly. Thanks for stopping by! 👋
            </span>
            <button
              onClick={() => setState("idle")}
              className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white hover:bg-white/25 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <p className="mb-3 text-sm text-white/90">{fallbackMsg}</p>
            <div className="flex items-center gap-2">
              <input
                type="email"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                onKeyDown={(ev) => {
                  if (ev.key === "Enter") submitFallback();
                }}
                placeholder="you@business.com"
                autoFocus
                disabled={state === "sending"}
                className="flex-1 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white placeholder-white/40 outline-none focus:border-white/40"
              />
              <button
                onClick={submitFallback}
                disabled={state === "sending"}
                className="rounded-full bg-[#7ea687] px-4 py-2 text-sm font-semibold text-[#08110a] hover:bg-[#B8D4BD] transition-colors disabled:opacity-60"
              >
                {state === "sending" ? "…" : "Send"}
              </button>
              <button
                onClick={() => setState("idle")}
                aria-label="Dismiss"
                className="rounded-full px-2 py-2 text-white/50 hover:text-white/90 transition-colors"
              >
                ✕
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // ── live call status pill (connecting / live) ────────────────────────────
  return (
    <div
      className="fixed z-[60] left-1/2 -translate-x-1/2 bottom-6 flex items-center gap-3 rounded-full border border-white/15 bg-black/70 px-5 py-3 backdrop-blur-md shadow-xl"
      style={{ pointerEvents: "auto" }}
    >
      <span
        className="inline-block h-2.5 w-2.5 rounded-full"
        style={{
          background: state === "live" ? "#7dd87d" : "#e0b94a",
          boxShadow: agentTalking ? "0 0 0 4px rgba(125,216,125,0.25)" : "none",
          transition: "box-shadow 0.15s ease-out",
        }}
      />
      <span className="text-sm text-white/90">
        {state === "connecting"
          ? "Connecting to Erken…"
          : agentTalking
            ? "Erken is speaking…"
            : "Listening — go ahead"}
      </span>
      <button
        onClick={() => clientRef.current?.stopCall()}
        className="ml-1 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white hover:bg-white/25 transition-colors"
      >
        End
      </button>
    </div>
  );
}
