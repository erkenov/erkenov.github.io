"use client";

/**
 * Scene1IntroVideo — looping intro video of Shamil for the opener scene.
 *
 * Phase 1 (now): polished placeholder card. The video file lives at
 *   /public/intro.mp4
 * and will be wired in once Shamil records it. If the file is missing the
 * placeholder stays visible.
 *
 * Phase 2 (when video ships): autoplay muted on loop, click to unmute.
 * Chrome autoplay policy requires muted=true for autoplay without user
 * gesture, so the unmute control is essential.
 */

import { useRef, useState, useEffect } from "react";
import { IconPlayerPlayFilled, IconVolume, IconVolumeOff } from "@tabler/icons-react";

const VIDEO_SRC = "/intro.mp4";

export function Scene1IntroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // Force load attempt. Browser will fire 'error' if the file doesn't exist.
    v.load();
  }, []);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  return (
    <div className="relative w-full max-w-[28rem] aspect-[9/16] md:aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
      {/* Placeholder gradient — visible until video loads, and remains as
          fallback if the file is missing */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
        style={{
          background:
            "linear-gradient(135deg, #E89F1F 0%, #C76B58 60%, #7ea687 120%)",
        }}
      >
        <div className="mono-label text-white/80 mb-3">Coming soon</div>
        <IconPlayerPlayFilled
          size={56}
          className="text-white/90 mb-4"
          strokeWidth={1}
        />
        <div className="text-white font-bold text-xl md:text-2xl tracking-tight" style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}>
          Quick intro from Shamil
        </div>
        <p className="mt-3 text-sm text-white/85 leading-relaxed max-w-[18rem]">
          Sixty seconds on what Erken Systems is and why
        </p>
      </div>

      {/* Real video — fades in over the placeholder once loaded */}
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onLoadedData={() => setLoaded(true)}
        onError={() => setErrored(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          loaded && !errored ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Mute toggle — only visible once video plays */}
      {loaded && !errored && (
        <button
          onClick={toggleMute}
          aria-label={muted ? "Unmute" : "Mute"}
          className="absolute bottom-4 right-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70"
        >
          {muted ? <IconVolumeOff size={20} /> : <IconVolume size={20} />}
        </button>
      )}
    </div>
  );
}
