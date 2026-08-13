"use client";

import { useEffect, useState } from "react";
import { BellRing, Star } from "lucide-react";

/**
 * ReviewDemo — AUTOPLAY phone mockup showing the post-job follow-up and
 * review flow (owner ruling 2026-08-13: NOT interactive — "not many will
 * understand they have to click; it should auto play the clicking").
 * Loops forever: a 2-star branch (unhappy → owner alert → fix first) then
 * a 5-star branch (happy → review nudge). The compliance notice block was
 * removed by the same ruling — the positioning lives in the section copy.
 */

const GOOGLE_LINK = "g.page/flyerken/review";

const UNHAPPY_MESSAGES = [
  "Thanks for the honesty — that's not the experience we want to give. The owner has just been notified and will reach out to you personally today.",
  `If you'd like to share your experience publicly, the door is always open: ${GOOGLE_LINK}. Leave a review now — or let us own up to this and fix it first, then decide with the full picture. Either way, it's your call.`,
];

const HAPPY_MESSAGES = [
  `Love hearing that! If you have 30 seconds, a Google review helps future students find us: ${GOOGLE_LINK}`,
];

// Timeline: [rating, messagesShown]. Steps advance on an interval and loop.
const STEPS: [number | null, number][] = [
  [null, 0],
  [2, 0],
  [2, 1],
  [2, 2],
  [2, 2], // hold
  [null, 0],
  [5, 0],
  [5, 1],
  [5, 1], // hold
  [null, 0],
];

const STEP_MS = 1600;

export default function ReviewDemo() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % STEPS.length), STEP_MS);
    return () => clearInterval(t);
  }, []);

  const [rating, shown] = STEPS[step];
  const happy = rating !== null && rating >= 4;
  const messages = rating === null ? [] : happy ? HAPPY_MESSAGES : UNHAPPY_MESSAGES;

  return (
    <div className="mx-auto max-w-md">
      {/* Phone frame */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0e120f] shadow-[0_0_60px_rgba(0,0,0,0.4)]">
        {/* Phone header */}
        <div className="border-b border-white/10 px-5 py-3 text-center">
          <p className="text-sm font-semibold">Fly Erken Academy</p>
          <p className="font-mono text-[10px] tracking-[0.14em] text-[#a7ada3] uppercase">
            Watch how it works
          </p>
        </div>

        <div className="min-h-[420px] space-y-4 px-5 py-6">
          {/* Outgoing message from the receptionist */}
          <div className="flex justify-end">
            <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-[#8fb496]/15 px-4 py-3 text-sm leading-relaxed text-[#d8d5cb]">
              Hi Sarah! Thanks for flying with us yesterday. How was your
              discovery flight?
            </div>
          </div>

          {/* Stars — display only, they light up on their own */}
          <div className="flex flex-col items-center gap-2 py-1">
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  className={`h-7 w-7 transition ${
                    rating !== null && n <= rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-white/25"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-[#a7ada3]">
              {rating === null
                ? "The customer taps a star…"
                : `The customer rated ${rating}/5`}
            </p>
          </div>

          {/* Branch messages */}
          {messages.slice(0, shown).map((msg) => (
            <div key={msg} className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-[#8fb496]/15 px-4 py-3 text-sm leading-relaxed text-[#d8d5cb]">
                {msg}
              </div>
            </div>
          ))}

          {/* Owner alert — unhappy branch only */}
          {!happy && shown >= 1 && rating !== null && (
            <div className="rounded-xl border border-amber-400/30 bg-amber-400/[0.07] px-4 py-3">
              <div className="flex items-center gap-2">
                <BellRing className="h-4 w-4 shrink-0 text-amber-400" />
                <p className="text-xs font-semibold text-amber-300">
                  Owner's phone, right now
                </p>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[#d8d5cb]">
                Sarah left {rating}-star feedback after yesterday's discovery
                flight. Reach out today and make it right — before it becomes
                a public review.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
