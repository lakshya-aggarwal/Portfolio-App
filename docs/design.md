# Design system

The portfolio is a clean, light, lightweight one-page site. This document is the
reference for the visual language; the tokens themselves live in
`src/app/globals.css`.

## Principles

- **Light-first, refreshing.** A calm light canvas is the primary identity; dark
  is an opt-in alternative, not the default.
- **Lightweight.** No animation library, no heavy runtime. Motion is one subtle
  reveal. Runtime deps are `next`, `react`, `react-dom`, `lucide-react` and `ogl`
  (the last only for the cursor ribbon - see Motion).
- **Honest content.** Real experience and real repos; no invented products.
- **Type does the work.** A bold condensed display face carries the personality;
  colour is used sparingly, as accent.

## Colour

Two palettes, swapped on `:root[data-theme]`. Components never hard-code these -
they use the semantic utilities (`bg-ground`, `bg-surface`, `text-ink`,
`text-ink-dim`, `border-line`, `bg-accent`, `text-accent`, `text-accent-ink`).

### Light (default) - cool

| Role | Token | Hex |
| --- | --- | --- |
| Canvas | `--sem-ground` | `#EEF1F5` |
| Surface / cards | `--sem-surface` | `#FFFFFF` |
| Hairline | `--sem-line` | `#D7DDE5` |
| Ink | `--sem-ink` | `#0E1116` |
| Ink dim | `--sem-ink-dim` | `#55636F` |
| Accent (cobalt) | `--sem-accent` | `#0047AB` |
| Accent 2 (azure) | `--sem-accent-2` | `#007FFF` |
| On-accent text | `--sem-accent-ink` | `#FFFFFF` |

### Dark (opt-in) - warm

| Role | Token | Hex |
| --- | --- | --- |
| Canvas | `--sem-ground` | `#0B0B0D` |
| Surface / cards | `--sem-surface` | `#211811` |
| Hairline | `--sem-line` | `#362A1E` |
| Ink | `--sem-ink` | `#F4EFE6` |
| Ink dim | `--sem-ink-dim` | `#B0A288` |
| Accent (amber) | `--sem-accent` | `#E9A23C` |
| Accent 2 (burnt orange) | `--sem-accent-2` | `#E0692A` |
| On-accent text | `--sem-accent-ink` | `#1A1209` |

**Usage.** Accent is for one thing at a time: a keyword in the headline, a filled
button, the org name in an experience card, a link on hover. In light mode the
handwritten `.kicker` uses azure; in dark it uses amber (azure is too cold on
espresso). Keep large areas neutral; let accent punctuate.

The palettes come from two references: a cobalt/azure product page for light, and
a warm amber-on-espresso product page for dark.

## Typography

Three faces, each with one job:

- **Display - "balboa"** (`font-display`): condensed, bold, set UPPERCASE for
  headlines and card titles. Weights 300 / 700 / 900 from the Adobe Fonts kit.
- **Script - "shadows-into-light"** (`.kicker`): a handwritten accent for section
  kickers ("experience", "about") and the hero eyebrow. Small doses only.
- **Body - Poppins** (`font-body`, from the Typekit kit): all running text,
  labels, and the mono-style meta (via `font-mono` fallback).

The Typekit kit is linked in `layout.tsx` `<head>`; `@theme` maps the families to
`--font-display` / `--font-script` / `--font-body`.

### Scale

Fluid `clamp()` steps in `@theme`: `--text-micro`, `--text-body`, `--text-lead`,
`--text-h3`, `--text-h2`, `--text-h1`, `--text-mega`. Use the `text-*` utilities;
do not invent sizes off the scale.

## Layout and spacing

- `.shell` centres content at `--g-max` (64rem) with fluid side padding
  (`--g-margin`, clamped 1.25-3rem).
- Sections are separated by `border-t border-line` and vertical rhythm of
  `py-20 md:py-28`.
- Card surfaces, when used, take `rounded-2xl border border-line bg-surface` with
  `p-6 md:p-8` and lift their border toward accent on hover. (The current
  sections favour rules and rows over card surfaces; project links use
  `rounded-lg`, media panels `rounded-xl`.)
- Tag/skill pills: `rounded-full border border-line` with small uppercase text
  (`text-tag`/`text-meta` + `tracking-tag`).

## Motion

One reveal (`src/motion/Reveal.tsx`): a short opacity + translateY on scroll-in,
staggered by index. Resting state is visible (SSR-safe). Buttons and rows have
small hover transforms. Everything collapses under `prefers-reduced-motion`.

Two duration scales, by domain: `--t-fast/base/slow` govern CSS-authored
transitions (the reveal, the theme swap, the skip link); component
micro-interactions written in Tailwind use its `duration-200/300/500` scale with
tokenized easing (`ease-[var(--e-out)]`). Easings live only in `globals.css`
(`--e-*`); `src/motion/tokens.ts` keeps just the reveal `STAGGER`.

**Cursor ribbon.** `src/components/site/CursorRibbon.tsx` draws a neon,
accent-coloured WebGL ribbon that trails the pointer across the whole site (a
fixed, `pointer-events-none` overlay beneath the nav). It is the one deliberate
WebGL exception to "lightweight": built on `ogl` (~50KB, no deps), dynamically
imported so it is code-split and never server-rendered, and gated to
hover-capable fine-pointer devices with motion enabled - so touch/mobile and
reduced-motion visitors get nothing and never download it. The ribbon colour is
read from the live `--sem-accent` token and follows the theme toggle.

## Theming behaviour

- Default is light for all visitors. `ThemeToggle` flips `data-theme` on `<html>`,
  persists to `localStorage`, and a boot script applies it before first paint.
- We do not follow `prefers-color-scheme` - light is intentional.
- `useTheme` (`src/lib/media.ts`) reads the theme as an external store.

## Accessibility

- Colour pairs target legible contrast in both themes; accent-ink is chosen per
  theme so text on filled buttons stays readable.
- Visible focus ring (`:focus-visible`, accent-coloured), a skip link, semantic
  landmarks, and `aria-hidden` on decorative icons.
- Reduced motion is a first-class branch, not an afterthought.

## Changing the system

- Recolour: edit the `:root` / `:root[data-theme="dark"]` blocks in `globals.css`.
  Nothing else references raw hex.
- Retype: swap the Typekit families or the `--font-*` mappings in `@theme`.
- New section: add a component under `src/components/sections/`, pull content from
  `src/lib/profile.ts`, and compose it in `src/app/page.tsx`.
