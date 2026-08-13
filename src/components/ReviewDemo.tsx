"use client";

import { useEffect, useState } from "react";
import { BellRing, RotateCcw, ShieldCheck, Star } from "lucide-react";

/**
 * ReviewDemo — interactive phone mockup showing the post-flight follow-up
 * and review flow. The compliance story is the point: the visitor picks a
 * star rating and sees BOTH branches — happy students get a nudge, unhappy
 * students get the owner alerted first — and in both branches the Google
 * review link still goes out. No gating, ever.
 */

const GOOGLE_LINK = "g.page/flyerken/review";

const HAPPY_MESSAGES = [
  `Love hearing that! If you have 30 seconds, a Google review helps future students find us: ${GOOGLE_LINK}`,
];

const UNHAPPY_MESSAGES = [
  "Thanks for the honesty — that's not the experience we want to give. The owner has just been notified and will reach out to you personally today.",
  `If you'd like to share your experience publicly, the door is always open: ${GOOGLE_LINK}. Leave a review now — or let us own up to this and fix it first, then decide with the full picture. Either way, it's your call.`,
];

export default function ReviewDemo() {
  const [rating, setRating] = useState<number | null>(null);
  const [shown, setShown] = useState(0);

  const happy = rating !== null && rating >= 4;
  const messages = rating === null ? [] : happy ? HAPPY_MESSAGES : UNHAPPY_MESSAGES;

  // Staged reveal of the branch messages.
  useEffect(() => {
    setShown(0);
    if (rating === null) return;
    const timers = messages.map((_, i) =>
      setTimeout(() => setShown(i + 1), 600 + i * 900),
    );
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rating]);

  return (
    <div className="mx-auto max-w-md">
      {/* Phone frame */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0e120f] shadow-[0_0_60px_rgba(0,0,0,0.4)]">
        {/* Phone header */}
        <div className="border-b border-white/10 px-5 py-3 text-center">
          <p className="text-sm font-semibold">Fly Erken Academy</p>
          <p className="font-mono text-[10px] tracking-[0.14em] text-[#a7ada3] uppercase">
            Demo SMS thread
          </p>
        </div>

        <div className="space-y-4 px-5 py-6">
          {/* Outgoing message from the receptionist */}
          <div className="flex justify-end">
            <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-[#8fb496]/15 px-4 py-3 text-sm leading-relaxed text-[#d8d5cb]">
              Hi Sarah! Thanks for flying with us yesterday. How was your
              discovery flight?
            </div>
          </div>

          {/* Star picker = the student's reply */}
          <div className="flex flex-col items-center gap-2 py-1">
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  onClick={() => setRating(n)}
                  className="group p-1 transition hover:scale-110"
                >
                  <Star
                    className={`h-7 w-7 transition ${
                      rating !== null && n <= rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-white/25 group-hover:text-amber-400/60"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs text-[#a7ada3]">
              {rating === null ? "Tap a star — you're the student" : `You rated ${rating}/5`}
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

          {/* Reset */}
          {rating !== null && (
            <div className="flex justify-center pt-1">
              <button
                type="button"
                onClick={() => setRating(null)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#8fb496] transition hover:text-[#a8c7ae]"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Try a different rating
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Compliance note */}
      <div className="mt-6 flex items-start gap-3 rounded-xl border border-[#8fb496]/20 bg-[#8fb496]/[0.06] px-5 py-4">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#8fb496]" />
        <p className="text-sm leading-relaxed text-[#a7ada3]">
          Notice what you just saw:{" "}
          <span className="text-[#d8d5cb]">
            the review link goes to every customer, happy or not.
          </span>{" "}
          Unhappy ones get you first so you can fix it — but nobody gets
          filtered out. That's what keeps your Google profile safe, and it's
          not how most agencies build this.
        </p>
      </div>
    </div>
  );
}
