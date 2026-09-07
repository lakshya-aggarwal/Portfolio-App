"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

/**
 * Per-word (or per-letter) reveal with stagger - the effect the reference site
 * builds with its own getSplitText.
 *
 * Two properties this has to keep, both learned the hard way:
 *
 * 1. **The text ships visible.** The server renders the fragments with no hidden
 *    styling at all. A Motion `initial={{opacity: 0}}` version server-renders
 *    `opacity: 0`, so anything without JS - a crawler, a printer, reader mode -
 *    gets a blank heading. The hidden state is applied here in a layout effect,
 *    before paint, so there is no flash either.
 * 2. **It reads as one phrase.** The split is decorative, so the whole string
 *    goes on aria-label and every fragment is aria-hidden. A screen reader says
 *    "Builds that hold weight." rather than spelling out eight fragments.
 */

type SplitTextProps = {
  children: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  by?: "word" | "letter";
  className?: string;
  /** Seconds before the first fragment moves. */
  delay?: number;
  /** Animate on mount (hero) rather than when scrolled into view. */
  immediate?: boolean;
};

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function SplitText({
  children,
  as: Tag = "span",
  by = "word",
  className,
  delay = 0,
  immediate = false,
}: SplitTextProps) {
  const host = useRef<HTMLElement>(null);
  const parts = by === "word" ? children.split(/(\s+)/) : Array.from(children);

  useLayoutEffect(() => {
    const el = host.current;
    if (!el || prefersReduced()) return;
    if (!immediate) {
      // Anything already on screen is left alone: the first thing a visitor
      // sees should not animate in after the fact.
      const box = el.getBoundingClientRect();
      if (box.top < window.innerHeight * 0.92) return;
    }
    el.dataset.split = "hidden";
  }, [immediate]);

  useEffect(() => {
    const el = host.current;
    if (!el || prefersReduced()) return;
    if (el.dataset.split !== "hidden") return;

    const show = () => {
      el.dataset.split = "shown";
    };

    if (immediate) {
      // The hidden state was set in a layout effect one tick ago, which the
      // browser can coalesce with this change into a single style resolution -
      // and a transition with no painted starting value simply snaps. Reading a
      // layout property forces the hidden state to flush first.
      void el.offsetHeight;
      show();
      return undefined;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          show();
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    // Never leave text hidden because an observer misfired.
    const failsafe = window.setTimeout(show, 4000);
    return () => {
      window.clearTimeout(failsafe);
      io.disconnect();
    };
  }, [immediate]);

  return (
    <Tag
      ref={host as React.Ref<never>}
      className={className}
      aria-label={children}
      style={{ "--split-delay": `${delay}s` } as React.CSSProperties}
    >
      <span aria-hidden="true">
        {parts.map((part, i) =>
          /^\s+$/.test(part) ? (
            <span key={i}> </span>
          ) : (
            // The clipping wrapper is what makes each fragment rise out of a
            // mask rather than just fade upward.
            <span key={i} className="split-mask">
              <span className="split-part" style={{ "--i": i } as React.CSSProperties}>
                {part}
              </span>
            </span>
          ),
        )}
      </span>
    </Tag>
  );
}
