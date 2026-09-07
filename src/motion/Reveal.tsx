"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { STAGGER } from "@/motion/tokens";

/**
 * L2 - the house reveal, and the only one.
 *
 * The rule it enforces: **the resting state is visible.** The server renders
 * the content with no hidden styling at all, so no-JS visitors, crawlers,
 * printers and full-page screenshots always get it. The hidden state is applied
 * on the client inside a layout effect - which runs before paint, so there is
 * no flash - and removed as soon as the element intersects.
 *
 * The earlier version used Motion's `whileInView` with `initial={{opacity: 0}}`.
 * That server-renders `opacity: 0` as an inline style, which means anything that
 * never fires an IntersectionObserver sees a permanently blank page. This is a
 * CSS transition instead, so it also costs no client JS beyond the observer.
 */

type RevealProps = {
  children: ReactNode;
  /** Index in a group, for stagger. */
  index?: number;
  /** px travelled on entry. */
  distance?: number;
  as?: "div" | "section" | "li" | "span" | "p";
  className?: string;
};

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Reveal({
  children,
  index = 0,
  distance = 18,
  as: Tag = "div",
  className,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  // Before first paint: arm the hidden state, but only for elements that are
  // actually below the fold. Anything already on screen is left alone, so the
  // first thing a visitor sees never animates in.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;
    const box = el.getBoundingClientRect();
    if (box.top < window.innerHeight * 0.9) return;
    el.dataset.reveal = "hidden";
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;
    if (el.dataset.reveal !== "hidden") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          el.dataset.reveal = "shown";
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    observer.observe(el);

    // Belt and braces: if the observer somehow never fires, reveal anyway
    // rather than leave content invisible.
    const failsafe = window.setTimeout(() => {
      el.dataset.reveal = "shown";
      observer.disconnect();
    }, 4000);

    return () => {
      window.clearTimeout(failsafe);
      observer.disconnect();
    };
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={className}
      style={
        {
          "--reveal-distance": `${distance}px`,
          "--reveal-delay": `${index * STAGGER.base}s`,
        } as React.CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
