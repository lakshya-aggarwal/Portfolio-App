"use client";

import { usePathname } from "next/navigation";

/**
 * The curtain: an ink panel that wipes away to reveal the page, on first load
 * and on every navigation.
 *
 * Driven by a CSS keyframe rather than Motion, for one specific reason. Motion's
 * `initial` prop is server-rendered as an inline style, so a curtain built that
 * way ships `scaleY(1)` in the HTML - and a visitor without JavaScript gets a
 * full-screen opaque rectangle and nothing else, permanently. A CSS animation
 * still runs without JS, and its resting state is cleared, so the worst case is
 * the animation simply never plays.
 *
 * Keying on the pathname remounts the element on navigation, which restarts the
 * keyframe. No state, no refs, no AnimatePresence.
 */
export function RouteTransition() {
  const pathname = usePathname();

  return (
    <div
      key={pathname}
      aria-hidden="true"
      className="curtain pointer-events-none fixed inset-0 z-40 bg-ink print:hidden"
    />
  );
}
