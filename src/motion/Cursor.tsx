"use client";

import { useEffect, useRef, useState } from "react";

/**
 * L2 - state-aware cursor. Lerped toward the pointer, and it reads a verb off
 * whatever is under it via [data-cursor], so a project card says "open" and the
 * physics scene says "drag".
 *
 * The lerp runs in one rAF loop writing transforms straight to the node - no
 * React state per frame, no spring library. This is the same approach the
 * reference site takes (it exposes the factor as a `cursor-lerp` setting).
 *
 * Mounts only for fine pointers: on touch there is no cursor to augment, and
 * under reduced motion the lag itself is the problem.
 */

const LERP = 0.18;

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const node = dot.current;
    if (!node) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const at = { ...target };

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      const el = (e.target as HTMLElement)?.closest?.<HTMLElement>("[data-cursor]");
      const verb = el?.dataset.cursor ?? null;
      setLabel((current) => (current === verb ? current : verb));
      const isActive =
        Boolean(verb) || Boolean((e.target as HTMLElement)?.closest?.("a, button"));
      setActive((current) => (current === isActive ? current : isActive));
    };

    let frame = requestAnimationFrame(function tick() {
      at.x += (target.x - at.x) * LERP;
      at.y += (target.y - at.y) * LERP;
      node.style.transform = `translate3d(${at.x}px, ${at.y}px, 0)`;
      frame = requestAnimationFrame(tick);
    });

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, [enabled]);

  if (!enabled) return null;

  const size = label ? 76 : active ? 34 : 12;

  return (
    <div
      ref={dot}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-60 hidden md:block"
    >
      <div
        className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ink font-mono text-[0.6rem] uppercase tracking-[0.12em] text-ink transition-[width,height,background-color] duration-300 ease-[var(--e-out)]"
        style={{
          width: size,
          height: size,
          backgroundColor: label
            ? "color-mix(in oklab, var(--sem-ink) 12%, transparent)"
            : "rgba(0, 0, 0, 0)",
        }}
      >
        {label}
      </div>
    </div>
  );
}
