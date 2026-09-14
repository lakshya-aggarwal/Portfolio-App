"use client";

import { useInViewFlag } from "@/motion/useInViewFlag";

/**
 * A bullet list whose dot markers pop in when the list scrolls into view.
 *
 * It uses the shared `useInViewFlag` primitive with its OWN attribute and a
 * longer failsafe rather than piggy-backing on Reveal: Reveal's short 4s
 * failsafe would fire the dot pop off-screen before anyone scrolled to it. The
 * longer (8s) failsafe here is far enough out not to pre-empt a normal scroll,
 * so the pop is actually visible.
 *
 * Resting state (SSR, no-JS, print, or already on screen at mount) is a plain
 * visible dot - the markers are aria-hidden decoration, and the text is always
 * visible regardless.
 */
export function Bullets({ points }: { points: string[] }) {
  const ref = useInViewFlag<HTMLUListElement>({
    attr: "bullets",
    rootMargin: "0px 0px -15% 0px",
    failsafeMs: 8000,
  });

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
