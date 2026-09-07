# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Next dev server (Turbopack)
npm run build      # production build; typechecks and prerenders every route
npm start          # serve the production build
npm run lint       # eslint (flat config, eslint-config-next 16 native)
npm run typecheck  # tsc --noEmit
```

There is no test framework. `npm run build` plus `npm run lint` are the only
correctness gates, and `noUnusedLocals`/`noUnusedParameters`/`noUncheckedIndexedAccess`
are on, so they catch more than they look like they will.

**Verify the WebGL work against a production build, not `npm run dev`.** React
StrictMode double-mounts in development, which makes React Three Fiber lose its
WebGL context - the canvas renders nothing and the console logs
`THREE.WebGLRenderer: Context Lost`. That is a dev-only artifact. Use
`npm run build && npx next start -p 3001` to see the real behaviour.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind v4 (CSS-first,
no JS config) · Lenis · React Three Fiber + drei + Rapier · MDX + Zod.
`@/*` maps to `./src/*`. Deployment target is static/Vercel; there is no backend.

Notably **not** installed: no animation library. Scroll-linked motion is driven
by CSS custom properties written from one rAF loop (see below), and `motion` was
removed after measuring it at ~40KB gzipped on the critical path for four small
effects.

## Layer architecture

The rule that keeps this honest: **a layer may only import from layers beneath
it.** Sections read content and tokens; motion primitives never read content;
nothing below the route layer contains a content literal or a timing number.

| Layer | Location | Owns |
| --- | --- | --- |
| L6 routes/shell | `src/app/` | fonts, theme boot, metadata, the scroll provider, cursor. The only layer that touches the filesystem. |
| L5 sections | `src/components/sections/` | composition only; everything arrives as props |
| L4 primitives | `src/components/ui/`, `src/components/common/` | shadcn primitives (forwardRef + cva + `cn()`) |
| L3 WebGL | `src/gl/` | the one `<Canvas>`, lazy, never server-rendered |
| L2 motion | `src/motion/` | scroll signal, reveal, cursor, and the motion vocabulary |
| L1 content | `src/lib/content.ts`, `src/lib/schema.ts`, `content/` | MDX + Zod; fails the build, not the page |
| L0 tokens | `src/app/globals.css` | colour, easing, timing, grid |

### The scroll signal

`src/motion/SmoothScroll.tsx` is the only scroll loop in the app. Lenis publishes
two CSS custom properties on `<html>`:

- `--scroll-progress` - 0..1 down the document
- `--scroll-velocity` - signed, roughly -60..60

CSS consumes them directly (the reading-position bar in `Nav`, `.velocity-skew`
in `globals.css`), so scroll-linked effects cost **zero React renders**. JS
consumers that need the numbers - shader uniforms, for instance - read them from
the ref via `useScrollSignal()` inside their own frame loop. Never read that ref
during render.

### Motion vocabulary

`src/motion/tokens.ts` holds every easing, duration, spring and stagger. A
component writing `duration: 0.4` inline is the drift that file exists to
prevent. The four easings are mirrored in `globals.css` for CSS transitions -
those are the only duplicated values in the system; change both or neither.

## Rules with teeth

These each cost real debugging time. Breaking them reintroduces a shipped bug.

**Never use bare `text-[var(--foo)]` in Tailwind v4.** It is ambiguous between
font-size and color, and Tailwind's type inference picks wrong - silently. It
broke every heading size *and* every link colour on the site. Use the
theme-generated utilities (`text-h1`, `text-ink-dim`, `bg-surface`, `border-line`)
which are declared in the `@theme` block, or an explicit hint like
`text-(length:--text-h1)`.

**Base element styles must live inside `@layer base`.** Unlayered CSS beats
everything inside `@layer utilities`, so a bare `a { color: inherit }` after
`@import "tailwindcss"` silently killed every colour utility on every link.
Component classes (`.shell`, `.eyebrow`, `.skip`, `.velocity-skew`) go in
`@layer components` so utilities can still override them.

**Content is visible at rest.** `src/motion/Reveal.tsx` renders children with no
hidden styling server-side, then arms the hidden state in a `useLayoutEffect`
(before paint) only for elements below the fold, and has a 4s failsafe. The
earlier version used `initial={{opacity: 0}}`, which server-renders `opacity: 0`
 - so no-JS visitors, crawlers, printers and full-page screenshots all saw a blank
page. Any new reveal must keep this property.

**One `<Canvas>` per document.** Each extra canvas is another WebGL context, and
several will thermally throttle a mid-range phone. Portal additional scenes with
drei's `<View>`.

**Don't texture a `RoundedBox`.** Its UVs wrap the whole solid, so a face-mapped
texture comes out smeared and clipped. Put the label on its own `planeGeometry`
in front of the stone - that is why `Assembly` has a separate label mesh.

**Media queries and the theme are external stores, not state.** Use
`useMediaQuery`/`useTheme` from `src/lib/media.ts` (`useSyncExternalStore`).
Reading them via `setState` in an effect trips `react-hooks/set-state-in-effect`
and causes a cascading render on mount.

**Reduced motion is a branch, not a dimmer.** Lenis is not constructed, the
cursor never mounts, reveals render immediately, and the skew is zeroed. Check
`globals.css`'s reduced-motion block and the three `matchMedia` guards in
`src/motion/` when adding anything animated.

## Content

Projects are `content/projects/<slug>/index.mdx` with Zod-validated frontmatter;
covers are served from `public/media/<slug>/cover.jpg` and **measured on disk** at
build time by `src/lib/content.ts`, so `next/image` always gets true intrinsic
dimensions (this is the CLS fix - don't hand-write dimensions into frontmatter).
`status: draft` keeps a project out of `getProjects()` entirely.

`stack` values must come from the `TECH` enum in `src/lib/schema.ts`; the filter
chips and the physics tiles are both derived from what projects actually use, via
`getUsedTech()`.

**The four projects are placeholder content** carried over from the original
build (Lumina/Flux/Prism/Vertex, with stock cover photos and example.com links).
Replace them with real work before this goes anywhere public.

## Measured budgets

Not aspirations - these are measured against the production build.

- **First-load JS: ~190KB gzipped.** React 19 + Next 16's client runtime is
  roughly 150KB of that and is effectively a floor, so treat ~170KB as the
  realistic target rather than the 150KB the original plan assumed.
- **three.js + Rapier are excluded from the first load** and must stay that way.
  `src/gl/` is reached only through `next/dynamic(..., { ssr: false })` in
  `StackWork.tsx`. Verify after any change to that import.
- Physics bodies: 14 desktop / 8 mobile, DPR capped at 2, `frameloop` drops to
  `"demand"` and Rapier pauses when the canvas is offscreen or the tab is hidden.

## `legacy/`

The pre-rebuild Vite app, moved aside rather than deleted so the old markup stays
readable. It is excluded from tsconfig, eslint and the build. Safe to delete.
