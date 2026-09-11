"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

/**
 * A bullet list whose dot markers pop in when the list scrolls into view.
 *
 * It has its own IntersectionObserver rather than piggy-backing on Reveal: the
 * house Reveal force-reveals after a 4s failsafe (so idle/no-JS content is never
 * stuck hidden), which fired the dot pop off-screen before anyone scrolled to
 * it. This triggers precisely on entry and is decoupled from any block fade, so
 * the pop is actually visible.
 *
 * Resting state (SSR, no-JS, print, or already on screen at mount) is a plain
 * visible dot - the markers are aria-hidden decoration, and the text is always
 * visible regardless.
 */
const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Bullets({ points }: { points: string[] }) {
  const ref = useRef<HTMLUListElement>(null);

  // Before paint: hide the dots only if the list is below the fold. Anything
  // already on screen stays visible and never animates in.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    el.dataset.bullets = "hidden";
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || el.dataset.bullets !== "hidden") return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          el.dataset.bullets = "shown";
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);

    // Long failsafe: reveal eventually if the observer never fires, but far
    // enough out that it does not pre-empt a normal scroll to this section.
    const failsafe = window.setTimeout(() => {
      el.dataset.bullets = "shown";
      io.disconnect();
    }, 8000);

    return () => {
      window.clearTimeout(failsafe);
      io.disconnect();
    };
  }, []);

  return (
    <ul ref={ref} className="mt-3 flex list-none flex-col gap-2 p-0">
      {points.map((pt, i) => (
        <li key={pt} className="flex gap-3 text-[0.95rem] text-ink-dim">
          <span
            aria-hidden="true"
            className="exp-dot shrink-0"
            style={{ "--dot-i": i } as React.CSSProperties}
          />
          <span>{pt}</span>
        </li>
      ))}
    </ul>
  );
}
