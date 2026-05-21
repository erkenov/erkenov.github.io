---
name: frontend-design
description: Design system and visual taste for Erken Systems (Shamil Erkenov) — smart business systems builder. Use this skill whenever building or editing UI components, sections, or pages — it defines spacing, typography, color, motion, audience character, and component patterns that make the site look like a $10K agency build instead of a generic AI-generated template.
---

# Frontend Design Skill — Erken Systems (Shamil Erkenov)

**Updated 2026-05-21** — repositioned from "AI receptionist for auto repair shops" → "smart business systems builder" (see `vault/05-decisions/2026-05-21-website-positioning-and-mvp-rebuild.md` for full context).

The site sells **smart business systems** — voice agents, workflow automations, CRM integrations, dashboards — to **small business operators and Upwork clients** in the US/UK and EU. Visitors range from a 45-year-old service-business owner (auto repair, dental, agency, restaurant, e-commerce) to a 32-year-old solo founder. What they share: they've been pitched AI for 18+ months and are tired of hype; they want to see the future actually working at a business their size; they have budget but not endless budget; they will judge the site in 5–8 seconds. The site has to look **expensive but real** — like a working product showcase, not a marketing brochure.

**One-sentence positioning:** *I build smart systems for businesses. AI is part of every system, but the system is the product.*

## Aesthetic Direction

- **Dark, restrained.** Off-black background (`#0a0a0f`), deep neutrals, single accent color used sparingly.
- **No purple-pink AI gradients.** Avoid `from-purple-500 to-pink-500` and any "Stripe-clone" gradient look — it screams "AI-generated landing page from 2024."
- **Industrial undertone.** Subtle metallic accents, hairline borders, mono-typography for technical accents. Think: workshop precision tool catalog meets premium SaaS dashboard.
- **Generous whitespace.** Sections breathe. Don't pack content.
- **Tactile, not glassy.** Avoid heavy `backdrop-blur` and translucent panels — those date fast. Use clean borders and solid surfaces.
- **Futuristic-CONFIDENT, NOT futuristic-HYPE.** Apple Vision Pro launch vibe — restrained, expensive, real cinematography. NOT Web3-NFT-hype vibe with neon chrome and floating crystals. The "calm one in the AI hype storm" brand persona must hold at every visual beat.
- **The product IS the visual hero.** Real workflows, real dashboards, real voice waveforms, real laptop screens. NOT abstract glowing brains, floating voxels, or generic "AI sphere" art. When a video clip plays, it shows the actual thing happening, with industrial color grading.

## Color Tokens

Use Tailwind arbitrary values via these tokens (defined in `globals.css` as CSS custom properties):

| Token | Hex | Use |
|-------|-----|-----|
| `bg` | `#0a0a0f` | page background |
| `surface` | `#13131c` | cards, elevated surfaces |
| `surface-2` | `#1a1a26` | nested surfaces, popover |
| `border` | `#26263a` | hairline borders |
| `border-strong` | `#3a3a52` | hover/focus borders |
| `text` | `#f5f5fa` | primary text |
| `text-muted` | `#a0a0b8` | secondary text |
| `text-dim` | `#6a6a82` | tertiary text |
| `accent` | `#ff7849` | primary accent (industrial orange — auto-repair appropriate, NOT generic AI purple) |
| `accent-hover` | `#ff8d65` | accent hover |
| `success` | `#4ade80` | rare positive signals only |

**Use accent sparingly** — primary CTA, key emphasis word in hero, active states. If everything is accent, nothing is.

## Typography

- **Sans:** `Inter` (already loaded). Body, headings.
- **Mono:** `JetBrains Mono` or system `ui-monospace`. Technical accents, code, numbers/stats.
- **Scale (rem):** 0.75, 0.875, 1, 1.125, 1.25, 1.5, 2, 2.5, 3.25, 4.5. Do **not** invent sizes between these.
- **Tracking:** `-0.03em` on large headings, `-0.02em` on subheads, `0` on body, `0.05em` UPPERCASE on micro-labels.
- **Weight:** 400 body, 500 buttons, 600 subheads, 700 hero only. Don't go heavier.
- **Line height:** 1.1 hero, 1.2 subhead, 1.6 body, 1.7 long-form paragraphs.

## Spacing System

**8px base grid.** Tailwind defaults already follow this. Allowed values: `1, 1.5, 2, 3, 4, 6, 8, 12, 16, 20, 24, 32`. Never `5, 7, 9, 11` etc.

**Vertical rhythm:**
- Section padding y: `py-20` (mobile) → `py-32` (desktop) — never less
- Section heading mb: `mb-12` or `mb-16`
- Component vertical gap: `gap-6` (cards), `gap-4` (text lines), `gap-2` (label-to-value)

**Horizontal:**
- Page max width: `max-w-6xl` for content, `max-w-7xl` for full-bleed sections
- Page padding x: `px-6` mobile, `px-8` desktop
- Card internal padding: `p-8` standard, `p-10` for premium feel on the hero CTA card

## Component Patterns

### Buttons
- **Primary:** Solid accent, white text, `rounded-lg`, `px-6 py-3`, font-medium, subtle scale-up on hover (`hover:scale-[1.02]`), 200ms ease.
- **Secondary:** Transparent, `border border-border`, white text, `hover:border-border-strong hover:bg-surface`. Same padding.
- **Ghost / nav:** Just text with `text-muted hover:text-white` transition.
- Never use shadows on buttons — flat, confident.

### Cards
- Background `bg-surface`, border `border border-border`, `rounded-2xl`, `p-8`.
- Hover: `hover:border-border-strong` and a 1px upward translate (`hover:-translate-y-0.5`).
- Inside: icon (top), heading (xl, semibold), body (sm, muted), CTA link if any (small, accent).

### Section heading pattern
```
<small uppercase mono accent>SECTION KICKER</small>
<h2 large bold>Real headline that lands</h2>
<p muted max-w-2xl>One-sentence subhead explaining what this section delivers.</p>
```
Always this three-tier shape. Never just an h2 alone.

### Borders & dividers
- Hairline (`1px solid var(--border)`) only. Never thicker.
- Section separators: subtle gradient div, NOT a hard line — `bg-gradient-to-r from-transparent via-border to-transparent h-px`.

## Motion (Framer Motion)

**Principle: motion confirms intent, never decorates.** If an animation doesn't help the user feel the structure, kill it.

Approved patterns:
- **Hero entry:** Staggered fade-up on text — `initial={{ opacity: 0, y: 24 }}` → `animate={{ opacity: 1, y: 0 }}`, `transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}`, delay each child by 0.08s.
- **Scroll reveals:** `whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}` — 0.5s duration, the same custom ease curve.
- **Hover lift on cards:** `whileHover={{ y: -2 }}` — that's it. No rotate, no scale dance.
- **CTA pulse:** AVOID. No infinite breathing buttons. Looks desperate.

Default ease: `[0.16, 1, 0.3, 1]` (gentle out-cubic). Default duration: `0.5–0.6s` for entry, `0.2s` for hover.

Don't use:
- Spring animations with bounce — feel cheap
- Mouse-follow parallax — distracting
- Marquee scrollers unless we have actual logos to put in one
- Number count-up animations unless we have real, verifiable numbers

## Copy Voice

- **Plain English.** No "leverage", "unlock", "synergy", "revolutionize", "next-generation".
- **Short sentences.** Subject-verb-object. If a sentence is over 20 words, split it.
- **Specific over abstract.** "$2,400 in missed appointments per month" beats "lost revenue."
- **Talk like the owner.** "Your shop misses calls after 6pm. We answer them." Not: "Capture leads outside business hours."
- **No exclamation marks.** None.
- **No emoji in headlines.** Sparingly in inline body if it adds clarity.

## Things to NEVER ship

- Stock photos of generic office workers smiling at laptops
- "Trusted by" logo strip with fake logos
- Animated SVG hero blob backgrounds (over-used)
- Tilted phone mockups screenshot above the fold
- "Get started — it's free" CTA on a paid service (lying)
- More than ONE accent color
- Gradient text on body copy (only hero h1 emphasis word, maybe)
- Auto-playing video with sound
- Cookie banner before the user has done anything

## Component checklist before merging any section

- [ ] Spacing values from the allowed list?
- [ ] Typography from the scale?
- [ ] Only one accent in this section?
- [ ] Section heading uses the three-tier kicker+h2+subhead pattern?
- [ ] Motion serves the user, not the designer?
- [ ] Copy passes the "would a 55-year-old auto shop owner roll their eyes" test?
- [ ] Looks correct at 375px, 768px, 1280px, 1920px?
