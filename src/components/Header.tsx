"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 w-full border-b border-border/60 bg-bg/80 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-8">
        <Link href="/" className="font-mono text-sm font-medium tracking-tight uppercase">
          erken<span className="text-accent"> </span>systems
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#how-it-works"
            className="text-sm text-text-muted transition-colors hover:text-text"
          >
            How it works
          </a>
          <a
            href="#pricing"
            className="text-sm text-text-muted transition-colors hover:text-text"
          >
            Pricing
          </a>
          <a
            href="#contact"
            className="text-sm text-text-muted transition-colors hover:text-text"
          >
            Contact
          </a>
        </nav>
        <a
          href="#demo"
          className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text transition-all hover:border-border-strong hover:bg-surface-2"
        >
          See demo
        </a>
      </div>
    </motion.header>
  );
}
