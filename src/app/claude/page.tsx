"use client";

/**
 * /talk — Shamil's personal voice assistant, callable from any device incl.
 * phone. The page is just the client; the brain runs on his PC (the Claude
 * bridge behind the Retell agent's custom-LLM), so it works while the PC is on.
 * Locked behind a passphrase (POSTed to /api/assistant-token). The passphrase
 * is a normal password field so iOS Keychain / Face ID can save + auto-fill it,
 * and it's remembered in localStorage for one-tap reconnects after the first time.
 */

import { useEffect, useRef, useState } from "react";
import { RetellWebClient } from "retell-client-js-sdk";

type S = "locked" | "connecting" | "live" | "ended";

export default function TalkPage() {
  const [state, setState] = useState<S>("locked");
  const [secret, setSecret] = useState("");
  const [err, setErr] = useState("");
  const [talking, setTalking] = useState(false);
  const clientRef = useRef<RetellWebClient | null>(null);

  async function startCall(sec: string) {
    setErr("");
    setState("connecting");
    try {
      const res = await fetch("/api/assistant-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: sec }),
      });
      if (res.status === 401) {
        setErr("Wrong passphrase.");
        setState("locked");
        localStorage.removeItem("assistant_secret");
        return;
      }
      const data = await res.json();
      if (!data?.access_token) throw new Error(data?.error || "no token");
      localStorage.setItem("assistant_secret", sec);
      await clientRef.current!.startCall({ accessToken: data.access_token });
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Failed to start.");
      setState("locked");
    }
  }

  useEffect(() => {
    const c = new RetellWebClient();
    clientRef.current = c;
    c.on("call_started", () => setState("live"));
    c.on("call_ended", () => { setState("ended"); setTalking(false); });
    c.on("agent_start_talking", () => setTalking(true));
    c.on("agent_stop_talking", () => setTalking(false));
    c.on("error", (e) => { console.error("Retell error:", e); setErr("Call error."); setState("locked"); });

    const saved = typeof window !== "undefined" ? localStorage.getItem("assistant_secret") : null;
    if (saved) startCall(saved);

    return () => { try { c.stopCall(); } catch {} };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-7 bg-[#131813] text-[#e2efe2] px-6">
      <div
        className="h-28 w-28 rounded-full"
        style={{
          background: "radial-gradient(circle at 35% 30%, #8fe6ad, #2f8f5a)",
          boxShadow: "0 0 60px rgba(47,143,90,0.55)",
          transform: talking ? "scale(1.14)" : "scale(1)",
          transition: "transform 0.18s ease-out",
          animation: state === "live" ? "none" : "pulse 2.4s ease-in-out infinite",
        }}
      />
      <div className="text-xl tracking-wide text-center">
        {state === "locked" && "Enter passphrase to talk"}
        {state === "connecting" && "Connecting…"}
        {state === "live" && (talking ? "Claude is speaking…" : "🎙️ Listening — go ahead")}
        {state === "ended" && "Call ended"}
      </div>

      {state === "locked" && (
        <form
          className="flex flex-col items-center gap-3 w-full max-w-xs"
          onSubmit={(e) => { e.preventDefault(); if (secret) startCall(secret); }}
        >
          <input type="text" name="username" autoComplete="username" defaultValue="erken-assistant" hidden readOnly />
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="Passphrase"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-center outline-none focus:border-[#7dd87d]"
          />
          <button type="submit" className="w-full rounded-xl bg-[#2f8f5a] px-4 py-3 font-medium text-white hover:bg-[#37a368] transition-colors">
            Talk to Claude
          </button>
          {err && <div className="text-sm text-red-300">{err}</div>}
        </form>
      )}

      {(state === "live" || state === "connecting") && (
        <button
          onClick={() => clientRef.current?.stopCall()}
          className="rounded-full bg-white/15 px-5 py-2 text-sm font-medium text-white hover:bg-white/25 transition-colors"
        >
          End call
        </button>
      )}

      {state === "ended" && (
        <button
          onClick={() => { const s = localStorage.getItem("assistant_secret"); if (s) startCall(s); else setState("locked"); }}
          className="rounded-full bg-[#2f8f5a] px-5 py-2 text-sm font-medium text-white hover:bg-[#37a368] transition-colors"
        >
          Call again
        </button>
      )}

      <style>{`@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}`}</style>
    </main>
  );
}
