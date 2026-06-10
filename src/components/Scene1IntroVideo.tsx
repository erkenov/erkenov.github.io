"use client";

/**
 * Scene1IntroVideo — Shamil's intro video for the opener scene.
 *
 * SELF-HOSTED (not YouTube) so it always plays at full 1080p quality with
 * no adaptive downscaling and no YouTube branding/related-videos. The
 * source is a vertical 9:16 talking-head clip; we compressed the 108 MB
 * export down to ~12 MB (visually identical) and serve it from /public.
 *
 * Lite pattern: show a poster frame + play button; on click, load the
 * <video> and play WITH sound (allowed — it's a user gesture). The video
 * only downloads when someone actually presses play (preload="none"), so
 * it's light on bandwidth even during a traffic spike.
 *
 * Files: /public/intro.mp4 (12 MB, 1080×1920) + /public/intro-poster.jpg
 */

import { useRef, useState } from "react";
import { IconPlayerPlayFilled } from "@tabler/icons-react";

export function Scene1IntroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const start = () => {
    setPlaying(true);
    // Play after the element mounts; with sound (user gesture).
    requestAnimationFrame(() => {
      const v = videoRef.current;
      if (v) {
        v.muted = false;
        v.play().catch(() => {});
      }
    });
  };

  return (
    <div className="relative w-full max-w-[22rem] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl bg-black">
      {playing ? (
        <video
          ref={videoRef}
          src="/intro.mp4"
          poster="/intro-poster.jpg"
          controls
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <button
          type="button"
          onClick={start}
          aria-label="Play Shamil's intro video"
          className="group absolute inset-0 h-full w-full cursor-pointer"
        >
          {/* Poster frame from the video */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/intro-poster.jpg"
            alt="Shamil, founder of Erken Systems"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Legibility gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25" />
          {/* Caption */}
          <div className="absolute inset-x-0 bottom-0 p-5 text-left">
            <div className="mono-label text-white/80 mb-1">A quick hello</div>
            <div
              className="text-white font-bold text-xl tracking-tight"
              style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
            >
              Intro from Shamil
            </div>
          </div>
          {/* Play button */}
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-black shadow-lg transition-transform duration-200 group-hover:scale-110">
            <IconPlayerPlayFilled size={28} className="ml-0.5" />
          </span>
        </button>
      )}
    </div>
  );
}
