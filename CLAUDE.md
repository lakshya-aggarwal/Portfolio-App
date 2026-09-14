# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Next dev server (Turbopack)
npm run build      # production build; typechecks and prerenders every route
npm start          # serve the production build
npm run lint       # eslint (flat config, eslint-config-next native)
npm run typecheck  # tsc --noEmit
```

There is no test framework. `npm run build` plus `npm run lint` are the only
correctness gates, and `noUnusedLocals` / `noUnusedParameters` /
`noUncheckedIndexedAccess` are on, so they catch more than they look like they
will. If a stale route type lingers in `.next/` after deleting a page, `rm -rf
.next` and rebuild.

## Stack

Next.js 16 (App Router) - React 19 - TypeScript strict - Tailwind v4 (CSS-first,
no JS config). Fonts: Balboa (display), Shadows Into Light (script accent) and
Poppins (body), all from an Adobe Fonts / Typekit kit linked in `<head>`.
Icons: lucide-react. `@/*` maps to `./src/*`. Deployment target is static /
Vercel; there is no backend.

The site is deliberately lightweight: **no animation library, no MDX / content
pipeline.** Runtime dependencies are `next`, `react`, `react-dom`,
`lucide-react` and `ogl`. Scroll-linked effects (e.g. the timeline beam in
`src/components/ui/timeline.tsx`) are done with a small rAF scroll handler rather
than a motion library. Do not reintroduce a heavy motion or 3D stack without a
strong reason - the redesign removed exactly that (see `docs/design.md`).

**One deliberate WebGL exception:** `src/components/site/CursorRibbon.tsx` uses
`ogl` (a ~50KB, zero-dependency WebGL lib) for a cursor-trailing ribbon. It is
kept contained: OGL is dynamically `import()`ed inside the effect (code-split,
never on the server), and the effect no-ops - and never downloads OGL - unless
the device is hover-capable + fine-pointer with `prefers-reduced-motion` off. Do
not add further WebGL/3D without the same containment and a comparable reason.

## Architecture

A single-page portfolio. Layers, each importing only from beneath it:

| Layer | Location | Owns |
| --- | --- | --- |
| Shell | `src/app/layout.tsx` | fonts, theme boot, nav, footer, metadata |
| Route | `src/app/page.tsx` | composes the sections; `not-found.tsx` is the 404 |
| Sections | `src/components/sections/` | Hero, Experience, About, Contact |
| Site chrome | `src/components/site/` | Nav, Footer, ThemeToggle |
| Motion | `src/motion/` | Reveal (the one house animation) + tokens |
| Content | `src/lib/profile.ts`, `src/lib/site.ts` | static profile data and links |
| Tokens | `src/app/globals.css` | colour, type scale, easing, spacing |

All content is static in `src/lib/`, so every route prerenders and no section
touches the filesystem.

## Theme and tokens (L0)

`src/app/globals.css` defines two palettes swapped on `:root[data-theme]`:

- **light (default)** - cool: cobalt `#0047AB` / azure `#007FFF` on light-gray `#EEF1F5`.
- **dark (opt-in)** - warm: amber `#E9A23C` / burnt-orange `#E0692A` on near-black `#0B0B0D`.

Light is the default for everyone. Dark is opt-in via `ThemeToggle`, stored in
`localStorage`, and applied by the boot script in `layout.tsx` before first
paint. We deliberately do **not** auto-switch on `prefers-color-scheme`: the
light palette is the primary identity. `src/lib/media.ts` (`useTheme`) reads the
theme as an external store, never via setState-in-an-effect.

Components only ever use the semantic utilities (`text-ink`, `text-ink-dim`,
`bg-surface`, `border-line`, `bg-accent`, `text-accent`, `text-accent-ink`), the
type scale (`text-h1/h2/h3/lead`), and the fonts (`font-display`, `font-body`).

## Fonts

The Typekit kit is linked in `layout.tsx`'s `<head>`
(`https://use.typekit.net/sam4epv.css`). Family names: `"balboa"` (display,
weights 300/700/900), `"shadows-into-light"` (script) and `"poppins"` (body).
The `@theme` block maps them to `--font-display`, `--font-script` and
`--font-body`. The `.kicker` class is the handwritten section accent.

## Rules with teeth

These each cost real debugging time; breaking them reintroduces a shipped bug.

**Never use bare `text-[var(--foo)]` in Tailwind v4.** It is ambiguous between
font-size and color and Tailwind infers wrong, silently. Use the theme-generated
utilities (`text-ink`, `text-accent`, `text-h1`, ...) or an explicit hint like
`text-(length:--text-h1)`.

**Base element styles must live inside `@layer base`.** Unlayered CSS beats
everything in `@layer utilities`, so a bare `a { color: inherit }` outside a
layer silently kills every colour utility on every link. Component classes
(`.shell`, `.kicker`, `.eyebrow`, `.skip`) go in `@layer components`.

**Content is visible at rest.** `src/motion/Reveal.tsx` renders children with no
hidden styling server-side, arms the hidden state in a `useLayoutEffect` (before
paint) only for elements below the fold, and has a 4s failsafe. Any new reveal
must keep this - the earlier `initial={{opacity:0}}` approach server-rendered a
blank page for no-JS visitors, crawlers and printers.

**Reduced motion is honoured.** `globals.css` has a `prefers-reduced-motion`
block that forces reveals visible and zeroes transitions. Keep animated additions
inside that contract.

## Content

`src/lib/profile.ts` is the single source for experience, skills, certifications,
education and the GitHub repo strip. `src/lib/site.ts` holds identity, nav and
social links. Edit these, not the components. The section content is real (drawn
from the resume and public GitHub) - do not invent projects or roles.

`public/resume.pdf` backs the "Résumé" download.
