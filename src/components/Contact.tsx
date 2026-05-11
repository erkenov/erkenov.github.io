"use client";

import { motion } from "framer-motion";
import { Mail, MessageCircle } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

export function Contact() {
  return (
    <section id="contact" className="border-b border-border/40 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mono-label">Get started</div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl" style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}>
            One conversation. One free week. One booked job to pay for it.
          </h2>
          <p className="mt-6 text-lg text-text-muted md:text-xl">
            Tell me about your shop. I&apos;ll come back with a 5-minute audio demo using
            your services and pricing within 24 hours.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="mailto:shamil.erkenovv@gmail.com?subject=AI%20Receptionist%20for%20my%20shop"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-base font-medium text-bg transition-all hover:bg-accent-hover hover:scale-[1.02]"
            >
              <Mail className="h-4 w-4" strokeWidth={2.25} />
              shamil.erkenovv@gmail.com
            </a>
            <a
              href="https://wa.me/995000000000"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface/60 px-6 py-3.5 text-base font-medium text-text transition-all hover:border-border-strong hover:bg-surface"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={2.25} />
              WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
