/**
 * L2 - the motion vocabulary. Every duration, curve and stagger in the app
 * resolves from here. A component writing `duration: 0.4` inline is the drift
 * this file exists to prevent.
 *
 * The four easings are mirrored in src/app/globals.css for CSS transitions.
 * Those are the only duplicated values in the system; change both or neither.
 */

/** Cubic-bezier control points, as Motion wants them. */
export const EASE = {
  /** Entrances, reveals, anything arriving. Fast out, long settle. */
  out: [0.22, 1, 0.36, 1],
  /** Page transitions, curtains, travel between two states. */
  inOut: [0.65, 0, 0.35, 1],
  /** Small objects landing. Never on anything large. */
  overshoot: [0.34, 1.56, 0.64, 1],
} as const;

export const DURATION = {
  fast: 0.18,
  base: 0.42,
  slow: 0.9,
} as const;

/**
 * Springs, not easings, for anything the user is touching - a spring responds
 * to velocity and a bezier cannot.
 */
export const SPRING = {
  /** Layout shifts, panels, reflow. */
  soft: { type: "spring", stiffness: 120, damping: 20 },
  /** Cursor, hover, anything that must feel immediate. */
  snappy: { type: "spring", stiffness: 260, damping: 26 },
  /** Physics objects and drag - mass makes them read as stone, not foam. */
  heavy: { type: "spring", stiffness: 80, damping: 18, mass: 1.4 },
} as const;

/** Stagger steps for grouped reveals. */
export const STAGGER = {
  tight: 0.04,
  base: 0.07,
  loose: 0.12,
} as const;

/**
 * The house reveal. Note the resting state is the *visible* one: elements are
 * rendered in place and animate from a visible offset, never parked at
 * opacity 0 waiting on an observer that might never fire.
 */
export const reveal = {
  hidden: { opacity: 0, y: 18 },
  shown: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASE.out },
  },
} as const;

export const revealGroup = (stagger: number = STAGGER.base) =>
  ({
    hidden: {},
    shown: { transition: { staggerChildren: stagger } },
  }) as const;
