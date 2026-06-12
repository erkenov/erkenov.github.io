"use client";

/**
 * ErkenVoiceWidget — in-browser voice call with Erken (the site voice
 * agent) via Retell. The hero "Show the demo" button calls the global
 * window.__startErkenVoiceCall() this component installs. While a call is
 * active it shows a small status panel (connecting / live + talking pulse)
 * with an End button. Secret key stays server-side (see /api/retell-web-call).
 */

import { useEffect, useRef, useState } from "react";
import { RetellWebClient } from "retell-client-js-sdk";

type CallState = "idle" | "connecting" | "live";

declare global {
  interface Window {
    __startErkenVoiceCall?: () => void;
  }
}

export default function ErkenVoiceWidget() {
  const [state, setState] = useState<CallState>("idle");
  const [agentTalking, setAgentTalking] = useState(false);
  const clientRef = useRef<RetellWebClient | null>(null);
  const activeRef = useRef(false);

  useEffect(() => {
    const client = new RetellWebClient();
    clientRef.current = client;
    client.on("call_started", () => {
      activeRef.current = true;
      setState("live");
    });
    client.on("call_ended", () => {
      activeRef.current = false;
      setState("idle");
      setAgentTalking(false);
    });
    client.on("agent_start_talking", () => setAgentTalking(true));
    client.on("agent_stop_talking", () => setAgentTalking(false));
    client.on("error", (err) => {
      console.error("Retell web call error:", err);
      // auto-telemetry: visitors never report a dead call — we do it for them
      // (same feedback pipe as the bots; reviewed in the supervisor sweep)
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
      setState("idle");
      setAgentTalking(false);
      try {
        client.stopCall();
      } catch {}
    });

    const start = async () => {
      if (activeRef.current) return;
      activeRef.current = true;
      setState("connecting");
      try {
        const res = await fetch("/api/retell-web-call", { method: "POST" });
        const data = await res.json();
        if (!data?.access_token) throw new Error("No access token");
        await client.startCall({ accessToken: data.access_token });
      } catch (err) {
        console.error("Could not start Erken voice call:", err);
        activeRef.current = false;
        setState("idle");
      }
    };
    window.__startErkenVoiceCall = start;

    return () => {
      delete window.__startErkenVoiceCall;
      try {
        client.stopCall();
      } catch {}
    };
  }, []);

  if (state === "idle") return null;

  return (
    <div
      className="fixed z-[60] left-1/2 -translate-x-1/2 bottom-6 flex items-center gap-3 rounded-full border border-white/15 bg-black/70 px-5 py-3 backdrop-blur-md shadow-xl"
      style={{ pointerEvents: "auto" }}
    >
      <span
        className="inline-block h-2.5 w-2.5 rounded-full"
        style={{
          background: state === "live" ? "#7dd87d" : "#e0b94a",
          boxShadow: agentTalking
            ? "0 0 0 4px rgba(125,216,125,0.25)"
            : "none",
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
