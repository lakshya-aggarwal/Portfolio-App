"use client";

import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";
import { prefersReducedMotion } from "@/lib/media";

/**
 * The house "reveal on scroll" primitive, shared by Reveal and Bullets.
 *
 * Contract (a "rule with teeth" - see CLAUDE.md): the resting state is VISIBLE.
 * Nothing is armed server-side. Before first paint a layout effect sets
 * `data-[attr]="hidden"` ONLY for elements that are actually below the fold, so
 * no-JS/print/crawlers and anything already on screen keep their content. An
 * IntersectionObserver flips it to `"shown"` on entry and disconnects; a
 * failsafe timer reveals anyway if the observer never fires. Reduced motion
 * skips arming entirely, so content stays put.
 *
 * The only per-consumer differences are the attribute name and the two timing
 * constants - passed explicitly so they can't silently diverge across copies.
 */
export function useInViewFlag<T extends HTMLElement>({
  attr,
  rootMargin,
  failsafeMs,
}: {
  /** dataset key, e.g. "reveal" -> data-reveal. */
  attr: string;
  rootMargin: string;
  failsafeMs: number;
}): RefObject<T | null> {
  const ref = useRef<T>(null);

  // Before paint: arm hidden only for below-the-fold elements.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    el.dataset[attr] = "hidden";
  }, [attr]);

  useEffect(() => {
    const el = ref.current;
    if (!el || el.dataset[attr] !== "hidden") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          el.dataset[attr] = "shown";
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(el);

    // Belt and braces: reveal even if the observer somehow never fires.
    const failsafe = window.setTimeout(() => {
      el.dataset[attr] = "shown";
      observer.disconnect();
    }, failsafeMs);

    return () => {
      window.clearTimeout(failsafe);
      observer.disconnect();
    };
  }, [attr, rootMargin, failsafeMs]);

  return ref;
}
