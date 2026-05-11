"use client";

import { motion } from "framer-motion";
import { Phone, ArrowRight } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

export function Demo() {
  return (
    <section id="demo" className="border-b border-border/40 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease }}
          className="relative overflow-hidden rounded-3xl border border-border bg-surface p-10 md:p-16"
        >
          <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative grid gap-10 md:grid-cols-12 md:items-center">
            <div className="md:col-span-7">
              <div className="mono-label">Hear it yourself</div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl" style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}>
                Call the live demo line.
              </h2>
              <p className="mt-5 max-w-lg text-base text-text-muted md:text-lg">
                Pretend you&apos;re a customer trying to book a brake check after hours.
                See how the AI handles it. 60 seconds. No commitment.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href="tel:+10000000000"
                  className="group inline-flex w-fit items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-accent px-6 py-3.5 text-base font-medium text-bg transition-all hover:bg-accent-hover hover:scale-[1.02]"
                >
                  <Phone className="h-4 w-4" strokeWidth={2.25} />
                  Call demo line
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.25} />
                </a>
                <a
                  href="#contact"
                  className="inline-flex w-fit items-center justify-center whitespace-nowrap rounded-lg border border-border bg-bg/50 px-6 py-3.5 text-base font-medium text-text transition-all hover:border-border-strong hover:bg-bg"
                >
                  Get a custom demo for your shop
                </a>
              </div>
            </div>

            <div className="md:col-span-5">
              <div className="rounded-2xl border border-border bg-bg/60 p-6">
                <div className="flex items-center justify-between">
                  <div className="mono-label">Sample call</div>
                  <div className="flex items-center gap-2 text-xs text-text-dim">
                    <span className="h-2 w-2 rounded-full bg-success" />
                    Live
                  </div>
                </div>
                <div className="mt-5 space-y-4">
                  <Line who="caller" text="Hi, do you do brakes? My car is making a grinding noise." />
                  <Line who="ai" text="We do. Sounds like the pads might be worn down to the metal — that's not driveable for long. What year and model is the car?" />
                  <Line who="caller" text="2019 Honda Civic." />
                  <Line who="ai" text="Got it. We can fit you in tomorrow at 8 a.m. or Thursday at 2 p.m. Which works better?" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Line({ who, text }: { who: "caller" | "ai"; text: string }) {
  return (
    <div className="flex gap-3 text-sm">
      <div
        className={`shrink-0 font-mono text-xs uppercase tracking-wider ${
          who === "ai" ? "text-accent" : "text-text-dim"
        }`}
        style={{ width: 48 }}
      >
        {who === "ai" ? "AI" : "Caller"}
      </div>
      <div className={who === "ai" ? "text-text" : "text-text-muted"}>{text}</div>
    </div>
  );
}
