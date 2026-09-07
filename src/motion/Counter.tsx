"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { DURATION } from "@/motion/tokens";

/**
 * Rolls a metric up to its value when it scrolls into view.
 *
 * Works on strings like "1.2k", "under 30s" or "100%" by animating only the
 * first number found and leaving the surrounding text intact, so content stays
 * authored in the MDX rather than split into value/unit fields.
 *
 * The resting state is the FINAL value, not zero: if the observer never fires,
 * or JS never runs, the real figure is what is on screen.
 */
export function Counter({ value }: { value: string }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const match = value.match(/(\d+(?:\.\d+)?)/);
  const target = match ? parseFloat(match[1]!) : null;
  const [display, setDisplay] = useState<string | null>(null);

  useEffect(() => {
    if (reduced || target === null || !inView) return;
    const decimals = (match?.[1]?.split(".")[1] ?? "").length;
    const duration = DURATION.slow * 1000;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // Same long-tail shape as --e-out, cheap closed form.
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay((target * eased).toFixed(decimals));
      if (t < 1) frame = requestAnimationFrame(tick);
      else setDisplay(null); // hand back to the authored string
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduced, target, match]);

  if (display === null || target === null) {
    return <span ref={ref}>{value}</span>;
  }

  return (
    <span ref={ref}>
      {value.replace(match![1]!, display)}
    </span>
  );
}
