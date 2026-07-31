"use client";

/**
 * DemoVoiceWidget — in-browser voice call for /demo/[industry] pages.
 *
 * Adapted from src/components/ErkenVoiceWidget.tsx (same Retell plumbing,
 * same graceful email fallback) with two differences:
 *
 * 1. Installs window.__startDemoVoiceCall (not __startErkenVoiceCall) so a
 *    demo page can never clash with the main-site widget.
 * 2. POSTs the demo's industry context to /api/retell-web-call as
 *    { dynamic_variables } — the route forwards them to Retell as
 *    retell_llm_dynamic_variables, so the agent knows which fictional
 *    business it is answering for. (The agent prompt must reference
 *    {{demo_business}} / {{demo_context}} for it to change behavior.)
 */

import { useEffect, useRef, useState } from "react";
import { RetellWebClient } from "retell-client-js-sdk";
import { track } from "@/lib/track";
import type { DemoConfig } from "../config";

type CallState = "idle" | "connecting" | "live" | "fallback" | "sending" | "sent";

export default function DemoVoiceWidget({ config }: { config: DemoConfig }) {
  const [state, setState] = useState<CallState>("idle");
  const [agentTalking, setAgentTalking] = useState(false);
  const [fallbackMsg, setFallbackMsg] = useState("");
  const [email, setEmail] = useState("");
  const clientRef = useRef<RetellWebClient | null>(null);
  const activeRef = useRef(false);
  const businessName = config.business.name;

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
      track("demo_call_started", { industry: config.slug });
      unblockAudio();
      document.addEventListener("pointerdown", unblockAudio);
      document.addEventListener("keydown", unblockAudio);
    });
    client.on("call_ended", () => {
      activeRef.current = false;
      setState("idle");
      setAgentTalking(false);
      removeUnblockListeners();
      track("demo_call_completed", { industry: config.slug });
    });
    client.on("agent_start_talking", () => setAgentTalking(true));
    client.on("agent_stop_talking", () => setAgentTalking(false));
    client.on("error", (err) => {
      console.error("Demo voice call error:", err);
      activeRef.current = false;
      setAgentTalking(false);
      setFallbackMsg(
        "The assistant couldn't connect just now — leave your email and Shamil will reach out with a live demo.",
      );
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
        const res = await fetch("/api/retell-web-call", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dynamic_variables: config.voice.dynamicVariables }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}) as { message?: string; error?: string });
          activeRef.current = false;
          setFallbackMsg(
            data?.message ||
              "The assistant is busy right this second — leave your email and Shamil will reach out with a live demo.",
          );
          setState("fallback");
          track("demo_fallback_shown", {
            industry: config.slug,
            reason: data?.error || "blocked",
            status: res.status,
          });
          return;
        }
        const data = await res.json();
        if (!data?.access_token) throw new Error("No access token");
        await client.startCall({ accessToken: data.access_token });
      } catch (err) {
        console.error("Could not start demo voice call:", err);
        activeRef.current = false;
        setFallbackMsg(
          "The assistant couldn't connect just now — leave your email and Shamil will reach out with a live demo.",
        );
        setState("fallback");
        track("demo_fallback_shown", { industry: config.slug, reason: "error" });
      }
    };
    window.__startDemoVoiceCall = start;

    return () => {
      delete window.__startDemoVoiceCall;
      removeUnblockListeners();
      try {
        client.stopCall();
      } catch {}
    };
  }, [config]);

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
    track("demo_lead_captured", { industry: config.slug, via: "fallback" });
    setState("sent");
  }

  if (state === "idle") return null;

  // ── leave-your-email fallback (busy / capped / errored) ──────────────────
  if (state === "fallback" || state === "sending" || state === "sent") {
    return (
      <div
        className="fixed bottom-6 left-1/2 z-[60] w-[min(92vw,420px)] -translate-x-1/2 rounded-2xl border border-white/15 bg-black/80 px-5 py-4 shadow-xl backdrop-blur-md"
        style={{ pointerEvents: "auto" }}
      >
        {state === "sent" ? (
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-white/90">
              Got it — Shamil will reach out shortly with a live demo.
            </span>
            <button
              onClick={() => setState("idle")}
              className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-white/25"
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
                className="rounded-full px-4 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-60"
                style={{ background: "var(--d-accent)" }}
              >
                {state === "sending" ? "…" : "Send"}
              </button>
              <button
                onClick={() => setState("idle")}
                aria-label="Dismiss"
                className="rounded-full px-2 py-2 text-white/50 transition-colors hover:text-white/90"
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
      className="fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/15 bg-black/70 px-5 py-3 shadow-xl backdrop-blur-md"
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
          ? `Connecting to ${businessName}…`
          : agentTalking
            ? "Assistant is speaking…"
            : "Listening — go ahead"}
      </span>
      <button
        onClick={() => clientRef.current?.stopCall()}
        className="ml-1 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-white/25"
      >
        End
      </button>
    </div>
  );
}
