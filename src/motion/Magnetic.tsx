"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { SPRING } from "@/motion/tokens";

/**
 * Magnetic hover: the element leans toward the pointer and springs back on
 * exit. The reference site does this to its buttons via its own cursor engine.
 *
 * `strength` is the maximum lean in px. Keep it small - past about 12px it
 * stops reading as attraction and starts reading as a bug.
 */
export function Magnetic({
  children,
  strength = 8,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const host = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, SPRING.snappy);
  const sy = useSpring(y, SPRING.snappy);

  if (reduced) return <span className={className}>{children}</span>;

  const onMove = (e: React.PointerEvent) => {
    const box = host.current?.getBoundingClientRect();
    if (!box) return;
    // -1..1 from the element's centre, scaled to `strength`.
    const dx = (e.clientX - (box.left + box.width / 2)) / (box.width / 2);
    const dy = (e.clientY - (box.top + box.height / 2)) / (box.height / 2);
    x.set(Math.max(-1, Math.min(1, dx)) * strength);
    y.set(Math.max(-1, Math.min(1, dy)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      ref={host}
      className={className}
      style={{ x: sx, y: sy, display: "inline-block" }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.span>
  );
}
