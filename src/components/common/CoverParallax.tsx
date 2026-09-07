"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { SPRING } from "@/motion/tokens";

/**
 * Pointer parallax inside the cover frame: the image drifts against its mask
 * and lifts slightly, so the card reads as a window rather than a picture.
 *
 * The image itself stays a plain next/image in the DOM - this only transforms
 * it - so the LCP optimisation, srcset and alt text are all untouched.
 */
export function CoverParallax({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const frame = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const sx = useSpring(x, SPRING.soft);
  const sy = useSpring(y, SPRING.soft);
  const sScale = useSpring(scale, SPRING.soft);

  if (reduced) return <div className={className}>{children}</div>;

  const onMove = (e: React.PointerEvent) => {
    const box = frame.current?.getBoundingClientRect();
    if (!box) return;
    const dx = (e.clientX - (box.left + box.width / 2)) / (box.width / 2);
    const dy = (e.clientY - (box.top + box.height / 2)) / (box.height / 2);
    // Small: the frame is the subject, the drift is just enough to feel alive.
    x.set(dx * 14);
    y.set(dy * 14);
    scale.set(1.06);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
    scale.set(1);
  };

  return (
    <div
      ref={frame}
      className={className}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      <motion.div style={{ x: sx, y: sy, scale: sScale }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}
