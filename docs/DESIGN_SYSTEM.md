# Design System - portable reference

A self-contained specification of the design system built for this portfolio,
written so **another app can adopt it**. It is framework-light: the core is plain
CSS custom properties + a Tailwind v4 `@theme` block, so it drops into any
Tailwind v4 project and most of it into any project at all.

Read it in two passes:

1. **The contract** (semantic tokens, motion tokens, theming mechanism, usage
   rules) - copy this **verbatim**. It is what every component depends on.
2. **The instantiation** (the specific palettes, fonts, and components) - this is
   *this* product's skin. Keep the shape, swap the values for your brand.

> Source of truth for the live values is [`src/app/globals.css`](../src/app/globals.css)
> (tokens) and [`src/motion/tokens.ts`](../src/motion/tokens.ts) (motion, for JS).
> Where this document and the narrative in [`design.md`](./design.md) disagree,
> `globals.css` wins (e.g. the content width is `64rem`, not the `78rem` an older
> note claimed).

---

## 1. Principles

1. **Light-first, refreshing.** A calm light canvas is the primary identity; dark
   is an opt-in alternative, never auto-selected from `prefers-color-scheme`.
2. **Lightweight.** No animation library, no heavy runtime. Motion is one house
   reveal plus a few rAF handlers. Runtime deps stay minimal.
3. **Two-layer color.** Components reference semantic names only; raw hex lives in
   one place per theme. Reskinning is a palette edit, not a component edit.
4. **Type does the work.** A bold condensed display face carries personality;
   color is used sparingly, as accent.
5. **Content is visible at rest.** Animations enhance a valid, visible resting
   state - they are never a prerequisite for content appearing (SSR / no-JS /
   print / reduced-motion all get the content).
6. **Document everything.** If it is not in this file or a token, it does not
   exist. No inline magic numbers for color, type, spacing, duration, or easing.

---

## 2. Adopt it in a new app (Tailwind v4)

1. Copy the **token layer** (§3–§7) into your global stylesheet, right after
   `@import "tailwindcss";`. It is three parts: the `@theme` block (exports
   utilities), the two `:root` palette blocks, and the `:root` motion/layout
   block.
2. Copy the **theme boot script** (§8) into your document `<head>` so the stored
   theme applies before first paint.
3. Copy the **theme store + toggle** (§8) if you want a light/dark switch.
4. Reskin: edit the ~16 hex values in the two palette blocks and the four
   `--font-*` families. Touch nothing in components.
5. Adopt the **usage rules** (§9) as lint-in-review conventions - each one
   encodes a bug that has actually shipped.
6. Pull in components (§10) as needed; they already speak the token contract.

Non-Tailwind projects: everything except the `@theme` utility export is plain
CSS. Use the custom properties directly (`color: var(--sem-ink)`), or generate
your own utility names from them.

---

## 3. Color

### The semantic model (the portable contract)

Eight semantic roles. **Components only ever use these** - never a raw hex, never
a palette name.

| Semantic token | Role | Typical use |
| --- | --- | --- |
| `--sem-ground` | Page canvas | `body` background, the base plane |
| `--sem-surface` | Raised surface | Cards, popovers, inputs |
| `--sem-line` | Hairline | Borders, dividers, rules |
| `--sem-ink` | Primary text | Headings, body copy |
| `--sem-ink-dim` | Secondary text | Meta, captions, muted labels |
| `--sem-accent` | Primary accent | One thing at a time: a keyword, a filled button, a link on hover |
| `--sem-accent-2` | Secondary accent | Gradients, the script kicker in light mode |
| `--sem-accent-ink` | On-accent text | Text/icons sitting on an accent fill |

The `@theme` block re-exports each as a Tailwind color utility, so you get
`bg-ground`, `text-ink`, `text-ink-dim`, `border-line`, `bg-accent`,
`text-accent`, `bg-surface`, `text-accent-ink`, `text-accent-2`, etc.

```css
@theme {
  --color-ground: var(--sem-ground);
  --color-surface: var(--sem-surface);
  --color-line: var(--sem-line);
  --color-ink: var(--sem-ink);
  --color-ink-dim: var(--sem-ink-dim);
  --color-accent: var(--sem-accent);
  --color-accent-2: var(--sem-accent-2);
  --color-accent-ink: var(--sem-accent-ink);
}
```

### shadcn / ui-primitive compatibility layer (optional - not in this repo)

**This block is not currently in `globals.css`** - the portfolio uses only the
house semantic utilities, so it was removed. It is documented here as an optional
add-on: if you vendor shadcn-style primitives that expect names like `bg-card` or
`text-muted-foreground`, add this `@theme` block to map those names onto the same
`--sem-*` values so the primitives theme automatically. Omit it otherwise.

```css
@theme {
  --color-background: var(--sem-ground);
  --color-foreground: var(--sem-ink);
  --color-card: var(--sem-surface);
  --color-card-foreground: var(--sem-ink);
  --color-popover: var(--sem-surface);
  --color-popover-foreground: var(--sem-ink);
  --color-primary: var(--sem-accent);
  --color-primary-foreground: var(--sem-accent-ink);
  --color-secondary: var(--sem-surface);
  --color-secondary-foreground: var(--sem-ink);
  --color-muted: var(--sem-surface);
  --color-muted-foreground: var(--sem-ink-dim);
  --color-accent-foreground: var(--sem-accent-ink);
  --color-destructive: #b5432c;
  --color-destructive-foreground: #ffffff;
  --color-border: var(--sem-line);
  --color-input: var(--sem-line);
  --color-ring: var(--sem-accent);
}
```

### The palettes (this product's instantiation - reskin here)

Two palettes, swapped on `:root[data-theme]`. This is the **only** place raw hex
lives. To rebrand a new app, edit these values and nothing else.

```css
/* LIGHT (default) - cool: cobalt / azure / slate on light-gray */
:root {
  --sem-ground: #eef1f5;
  --sem-surface: #ffffff;
  --sem-line:   #d7dde5;
  --sem-ink:    #0e1116;
  --sem-ink-dim:#55636f;
  --sem-accent: #0047ab; /* cobalt */
  --sem-accent-2:#007fff; /* azure  */
  --sem-accent-ink:#ffffff;
  color-scheme: light;
}

/* DARK (opt-in) - warm: amber / burnt-orange on espresso */
:root[data-theme="dark"] {
  --sem-ground: #0b0b0d;
  --sem-surface:#211811;
  --sem-line:   #362a1e;
  --sem-ink:    #f4efe6;
  --sem-ink-dim:#b0a288;
  --sem-accent: #e9a23c; /* amber */
  --sem-accent-2:#e0692a; /* burnt orange */
  --sem-accent-ink:#1a1209;
  color-scheme: dark;
}
```

| Role | Light | Dark |
| --- | --- | --- |
| Ground | `#EEF1F5` | `#0B0B0D` |
| Surface | `#FFFFFF` | `#211811` |
| Line | `#D7DDE5` | `#362A1E` |
| Ink | `#0E1116` | `#F4EFE6` |
| Ink dim | `#55636F` | `#B0A288` |
| Accent | `#0047AB` cobalt | `#E9A23C` amber |
| Accent 2 | `#007FFF` azure | `#E0692A` burnt orange |
| On-accent | `#FFFFFF` | `#1A1209` |

**Usage.** Accent punctuates - one per view (a headline keyword, a filled button,
the org name in a card, a link on hover). Keep large areas neutral. `--sem-ink`
inverts between themes so text stays legible on the ground; `--sem-accent-ink` is
per-theme so text on an accent fill always has contrast.

---

## 4. Typography

Four font roles, each with one job. The families are app-specific; keep the roles
and swap the faces. Declared in `@theme` so `font-display` / `font-script` /
`font-body` / `font-mono` become utilities.

```css
@theme {
  --font-display: "balboa", "Arial Narrow", sans-serif;      /* condensed, bold, UPPERCASE headings */
  --font-script:  "shadows-into-light", "Comic Sans MS", cursive; /* handwritten kicker accent */
  --font-body:    "poppins", ui-sans-serif, system-ui, sans-serif;/* all running text */
  --font-mono:    ui-monospace, SFMono-Regular, Menlo, monospace; /* meta labels, tabular figures */
}
```

| Role | Utility | Job | Notes |
| --- | --- | --- | --- |
| Display | `font-display` | Headlines, card titles | Set `uppercase`, tight leading. Weights 300 / 700 / 900. |
| Script | `font-script` | Section kickers, hero eyebrow | Small doses only. See `.kicker`. |
| Body | `font-body` | All running text, labels | The workhorse. |
| Mono | `font-mono` | Dates, meta, tabular numbers | Uppercase + letter-spacing for meta rows. |

### Type scale (fluid)

Every size is a `clamp()` step in `@theme`, exposed as `text-*` utilities. **Do
not invent sizes off the scale.**

```css
@theme {
  --text-micro: clamp(0.78rem, 0.76rem + 0.1vw, 0.84rem);
  --text-body:  clamp(1rem,   0.97rem + 0.15vw, 1.08rem);
  --text-lead:  clamp(1.1rem,  1rem   + 0.5vw,  1.35rem);
  --text-h3:    clamp(1.3rem,  1.15rem + 0.7vw, 1.7rem);
  --text-h2:    clamp(1.9rem,  1.4rem + 2.2vw,  3.2rem);
  --text-h1:    clamp(2.8rem,  1.5rem + 5.6vw,  6.5rem);
  --text-mega:  clamp(4rem,    1rem   + 13vw,   13rem);

  /* fixed micro-steps below the fluid scale, for small UI labels / meta / tags.
     Custom names (not xs/sm) so they never override Tailwind's built-in sizes. */
  --text-tag:  0.68rem; /* tags, fine meta */
  --text-meta: 0.72rem; /* mono meta rows, nav/link labels */
  --text-note: 0.95rem; /* dense body-adjacent copy (bullets) */

  /* letter-spacing steps for uppercase labels (custom names, non-colliding) */
  --tracking-tag:     0.08em;
  --tracking-eyebrow: 0.12em;
  --tracking-label:   0.14em;
}
```

Fluid heads/body: `text-micro` · `text-body` · `text-lead` · `text-h3` ·
`text-h2` · `text-h1` · `text-mega`. Fixed micro-labels: `text-tag` ·
`text-meta` · `text-note`, with `tracking-tag` · `tracking-eyebrow` ·
`tracking-label` for uppercase spacing. Base element defaults (`h1-h4` → display
face, tight leading, `text-wrap: balance`; `p` → `text-wrap: pretty`) live in
`@layer base`. Do not reintroduce arbitrary `text-[…]` / `tracking-[…]` values;
add a step here instead.

---

## 5. Spacing, layout & radius

```css
:root {
  --g-max: 64rem;                       /* max content width */
  --g-margin: clamp(1.25rem, 5vw, 3rem);/* fluid side gutter */
}
```

- **`.shell`** is the layout primitive: full width, capped at `--g-max`, centered,
  with `--g-margin` inline padding. Wrap every section's content in it.
- **Section rhythm:** sections are separated by `border-t border-line` and use
  vertical padding `py-20 md:py-28`.
- **Radius:** pills/controls `rounded-full`; small media/panels `rounded-xl`;
  hover rows `rounded-lg`. (Radius is conventional, not tokenized - keep to this
  set. If you add card surfaces, standardize them on `rounded-2xl`.)
- **`section[id]` / `:target`** get `scroll-margin-top: 5.5rem` so anchored jumps
  clear the fixed nav.

---

## 6. Motion

`globals.css` is the single source of truth for easings and durations; the JS
side (`src/motion/tokens.ts`) holds only the reveal `STAGGER` step and references
the CSS vars for everything else, so there is no duplicated timing to keep in
sync.

```css
:root {
  --e-out:       cubic-bezier(0.22, 1, 0.36, 1);   /* entrances, reveals */
  --e-in-out:    cubic-bezier(0.65, 0, 0.35, 1);   /* travel between states */
  --e-overshoot: cubic-bezier(0.34, 1.56, 0.64, 1);/* small objects landing */
  --e-linear:    linear;

  --t-fast: 180ms;
  --t-base: 420ms;
  --t-slow: 800ms;
}
```

**Two duration scales, by domain (intentional).** The `--t-*` tokens above drive
*CSS-authored* transitions - the scroll reveal, the theme swap on `body`, the
skip link. Component *micro-interactions* written in Tailwind (hover states, the
project rows) use Tailwind's own `duration-200 / 300 / 500` scale together with
tokenized easing (`ease-[var(--e-out)]`). This keeps the two concerns readable in
their own idiom; don't mix them (no `duration-[420ms]` on a hover, no Tailwind
`duration-*` on the reveal).

JS mirror (`src/motion/tokens.ts`): `EASE.out/inOut/overshoot`,
`DURATION.fast/base/slow` (seconds), `SPRING.soft/snappy/heavy` (for anything the
user is touching - springs respond to velocity, beziers cannot), and
`STAGGER.tight/base/loose` (`0.04 / 0.07 / 0.12`s) for grouped reveals.

**Reduced motion is a first-class branch.** A global block forces all reveals
visible and zeroes transitions:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  /* plus: force any armed "hidden" reveal/marker state back to visible */
}
```

A matching `@media print` block also forces reveals visible and hides
`.no-print`.

---

## 7. Layer order (non-negotiable)

Tailwind v4 cascade layers, in this order: **theme → base → components →
utilities**. Two rules with teeth follow from it (see §9).

- `@layer base` - element resets and defaults (`box-sizing`, `body`, `h1–h4`,
  `a`, `img`, `:focus-visible`, `section[id]` scroll margin).
- `@layer components` - the named classes: `.shell`, `.kicker`, `.eyebrow`,
  `.skip`, and any marker classes.

---

## 8. Theming mechanism (portable)

Light is the default for everyone. Dark is opt-in, stored in `localStorage`, and
applied to `document.documentElement.dataset.theme` **before first paint** so the
toggle never flashes. `prefers-color-scheme` is deliberately **not** followed.

**Boot script** (inline in `<head>`, before any paint):

```js
try { const t = localStorage.getItem("theme"); if (t) document.documentElement.dataset.theme = t; } catch {}
```

**Theme store** - read the theme as an *external store* via
`useSyncExternalStore`, never `setState`-in-an-effect (avoids cascading renders
and gives a stable SSR snapshot). Default snapshot is `"light"`. Setting the
theme writes `data-theme` + `localStorage` and dispatches a `themechange` event
so every reader in the tab stays in sync. See [`src/lib/media.ts`](../src/lib/media.ts).

```ts
const [theme, setTheme] = useTheme(); // "light" | "dark"
```

**Toggle** - a button that reads the store and flips it; because it reads the
same external store, it can never disagree with the page. See
[`ThemeToggle`](../src/components/site/ThemeToggle.tsx).

---

## 9. Rules with teeth

Each encodes a bug that has actually shipped. Adopt them as review conventions.

1. **Never use bare `text-[var(--foo)]` in Tailwind v4.** It is ambiguous between
   font-size and color and Tailwind infers wrong, silently. Use the generated
   utilities (`text-ink`, `text-accent`, `text-h1`) or an explicit hint
   (`text-(length:--text-h1)`).
2. **Base element styles must live inside `@layer base`.** Unlayered CSS beats
   every `@layer utilities` rule, so a bare `a { color: inherit }` outside a layer
   silently kills every color utility on every link.
3. **Content is visible at rest.** Any reveal must render visible server-side and
   only *arm* the hidden state on the client (in a layout effect, before paint),
   with a failsafe. Never server-render `opacity: 0`.
4. **Honor reduced motion.** Every animated addition must collapse under the
   `prefers-reduced-motion` block. Looping/decorative motion especially.
5. **No magic numbers.** Color, type size, spacing, duration, and easing come from
   tokens. An inline `duration: 0.4` is the drift the token layer exists to
   prevent.

---

## 10. Component inventory

All components speak the token contract, so they theme automatically. Props below
are the public API.

### Reveal - the one house animation
`src/motion/Reveal.tsx` · client

Scroll-in opacity + translateY, staggered by index. **Resting state is visible**
(§9.3): renders children with no hidden styling server-side, arms `data-reveal`
only for elements below the fold in a `useLayoutEffect`, reveals on
IntersectionObserver, 4s failsafe.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `children` | `ReactNode` | - | - |
| `index` | `number` | `0` | Position in a group → stagger delay (`index × STAGGER.base`). |
| `distance` | `number` | `18` | px travelled on entry. |
| `as` | `"div"·"section"·"li"·"span"·"p"` | `"div"` | Rendered element. |
| `className` | `string` | - | - |

The CSS side keys off `[data-reveal="hidden"|"shown"]` with
`--reveal-distance` / `--reveal-delay`. Reduced motion forces shown.

### Timeline - scroll-beam vertical timeline
`src/components/ui/timeline.tsx` · client

Sticky per-entry title and a vertical track whose accent gradient "beam" fills as
you scroll (rAF scroll handler, no motion library). Reduced motion shows a full
static beam.

| Prop | Type | Notes |
| --- | --- | --- |
| `data` | `TimelineEntry[]` | `{ title: string; content: ReactNode }`. |

Beam is `bg-gradient-to-t from-accent via-accent-2 to-transparent`; dots use
`border-line bg-surface`.

### Bullets - markers that animate on view
`src/components/ui/bullets.tsx` · client

A bullet list whose markers animate in **only when the list scrolls into view** -
its own IntersectionObserver (with a long 8s failsafe), decoupled from `Reveal`
so the animation is never spent off-screen. Arms `data-bullets` on the `<ul>`;
resting state is a plain visible marker.

| Prop | Type | Notes |
| --- | --- | --- |
| `points` | `string[]` | One marker + line per entry, staggered via `--dot-i`. |

Pattern to reuse: **an animated decoration must trigger on genuine viewport
entry, not on a shared reveal whose failsafe may fire while it is below the
fold.**

### ProjectShowcase - hover-preview link list
`src/components/ui/project-showcase.tsx` · client

Data-driven, 2-column link list with a cursor-following image/preview panel
(`hidden md:block`); a themed fallback panel renders when an item has no image.
Vendored self-contained (no registry URL).

| Prop | Type | Notes |
| --- | --- | --- |
| `items` | `ShowcaseItem[]` | `{ title; description; meta; href; image? }`. External `href` opens in a new tab with `rel="noreferrer"`. |

### CursorRibbon - the one WebGL exception
`src/components/site/CursorRibbon.tsx` · client

A fixed, `pointer-events-none`, whole-site overlay drawing an accent-colored
ribbon that trails the cursor (OGL `Polyline`, velocity-driven width, head→tail
taper, theme-synced color). Takes no props. **Contained by design:** OGL is
dynamically `import()`ed inside the effect (code-split, never server-rendered),
and the effect no-ops - and never downloads OGL - unless the device is
hover-capable + fine-pointer with `prefers-reduced-motion` off. Adopt only with
the same containment. Colour reads from `--sem-accent` and follows the theme via
a `MutationObserver` on `data-theme`.

### Nav - fixed header
`src/components/site/Nav.tsx` · client

Fixed header that turns solid (border + blurred ground) once a sentinel scrolls
out of the hero, via IntersectionObserver (no scroll handler). Desktop links +
Résumé button; mobile disclosure menu with `aria-expanded`/`aria-controls`.
Content from a `site` data module (name, nav items, resume link).

### ThemeToggle - light/dark switch
`src/components/site/ThemeToggle.tsx` · client

Reads the theme store (§8) and flips it; `aria-label` names the target theme.
Moon in light, Sun in dark.

---

## 11. Patterns (composition)

- **Section:** `<section class="shell border-t border-line py-20 md:py-28">` with
  a `.kicker` script label, then an `h2 font-display uppercase text-h2`.
- **Card:** `rounded-2xl border border-line bg-surface p-6 md:p-8`; lift the
  border toward accent on hover.
- **Pill / tag:** `rounded-full border border-line px-3 py-1` with small
  uppercase tracked text (`text-ink-dim`).
- **Filled button:** `rounded-full bg-accent text-accent-ink` with a small
  `hover:-translate-y-0.5` on `--e-out`.
- **Meta row:** `font-mono` uppercase with `tracking` and `text-ink-dim`.
- **Kicker (`.kicker`):** handwritten section accent - `font-script`, azure in
  light / amber in dark.
- **Skip link (`.skip`):** off-screen until focused; first focusable element.

---

## 12. Accessibility standards

- **Contrast:** color pairs target legible contrast in both themes;
  `--sem-accent-ink` is chosen per theme so text on filled accents stays readable.
- **Focus:** a visible `:focus-visible` ring (accent, 2px, offset 3px) on every
  interactive element.
- **Landmarks & skip link:** semantic landmarks; a `.skip` link as the first
  focusable element jumps to `#main`.
- **Decorative vs meaningful:** decorative visuals carry `aria-hidden="true"`
  (markers, the cursor ribbon, timeline dots).
- **Motion:** `prefers-reduced-motion` is honored globally - reveals shown,
  transitions zeroed, loops flattened.
- **Keyboard:** disclosure controls expose `aria-expanded` / `aria-controls`;
  toggles carry a state-naming `aria-label`.

---

## 13. Porting checklist

- [ ] `@import "tailwindcss";` then the `@theme` block (§3–§6).
- [ ] Two `:root` palette blocks (§3) - reskinned to your brand.
- [ ] `:root` motion + layout block (§5–§6); mirror easings/durations in JS if used.
- [ ] `@layer base` element defaults; `@layer components` for `.shell`, `.kicker`, `.eyebrow`, `.skip`.
- [ ] `prefers-reduced-motion` + `print` blocks.
- [ ] Theme boot script in `<head>` (§8).
- [ ] Theme store + toggle if you want dark mode (§8).
- [ ] Swap the four `--font-*` families; keep the four roles.
- [ ] Bring in components as needed (§10) - they already speak the contract.
- [ ] Adopt the rules with teeth (§9) in review.
