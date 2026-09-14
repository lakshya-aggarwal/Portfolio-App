/**
 * L2 - the JS motion tokens.
 *
 * The app's easings and durations live in CSS (`--e-*` / `--t-*` in
 * globals.css); components reference those directly (`ease-[var(--e-out)]`,
 * `var(--t-slow)`), so they are the single source of truth and are NOT mirrored
 * here. The only value the JS side needs is the reveal stagger step, used by
 * Reveal to offset grouped entrances.
 */

/** Stagger steps for grouped reveals (seconds). */
export const STAGGER = {
  tight: 0.04,
  base: 0.07,
  loose: 0.12,
} as const;
