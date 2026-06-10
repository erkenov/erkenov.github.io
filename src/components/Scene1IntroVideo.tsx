"use client";

/**
 * Scene1IntroVideo — Shamil's intro video for the opener scene.
 *
 * The video is a VERTICAL (9:16) talking-head clip hosted on YouTube
 * ("Video Introduction" — Pyj05i9-Quw). We use a lite-embed pattern:
 * show the poster (the YouTube thumbnail, centre-cropped to the vertical
 * frame so the player's blurred side-bars are hidden) with a play button;
 * on click we swap in the real YouTube iframe and autoplay WITH sound
 * (allowed because it's a user gesture). Hosting on YouTube = no bandwidth
 * cost to us and no large file in /public.
 *
 * Portrait card on every breakpoint because the source video is vertical.
 */

import { useState } from "react";
import { IconPlayerPlayFilled } from "@tabler/icons-react";

const VIDEO_ID = "Pyj05i9-Quw";
const POSTER = `https://i.ytimg.com/vi/${VIDEO_ID}/maxresdefault.jpg`;

export function Scene1IntroVideo() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative w-full max-w-[22rem] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl bg-black">
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0&playsinline=1&modestbranding=1`}
          title="Video Introduction — Shamil Erkenov"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label="Play Shamil's intro video"
          className="group absolute inset-0 h-full w-full cursor-pointer"
        >
          {/* Poster — YouTube thumbnail, centre-cropped to the vertical
              frame (object-cover drops the blurred 16:9 side-bars). */}
          <img
            src={POSTER}
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
