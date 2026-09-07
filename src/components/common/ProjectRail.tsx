"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ProjectCard } from "@/components/common/ProjectCard";
import type { Project } from "@/lib/schema";

/**
 * Horizontal rail with grab-and-fling inertia on md+, a plain vertical stack on
 * phones.
 *
 * Built on a native overflow container with scroll snapping rather than a
 * transformed track, which is the decision that keeps it accessible: wheel,
 * trackpad, touch, Tab-to-focus and screen-reader navigation all work for free,
 * and the browser scrolls a focused card into view on its own. The drag and the
 * momentum decay are layered on top for pointer users, writing scrollLeft.
 */
export function ProjectRail({ projects }: { projects: Project[] }) {
  const rail = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [scrollable, setScrollable] = useState(false);

  const drag = useRef({
    active: false,
    startX: 0,
    startScroll: 0,
    lastX: 0,
    lastT: 0,
    velocity: 0,
    moved: false,
  });
  const decay = useRef(0);

  const sync = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setScrollable(max > 8);
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft >= max - 4);
  }, []);

  useEffect(() => {
    sync();
    const el = rail.current;
    if (!el) return;
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, [sync]);

  const onPointerDown = (e: React.PointerEvent) => {
    const el = rail.current;
    if (!el || el.scrollWidth <= el.clientWidth) return;
    if (e.pointerType === "touch") return; // native touch scrolling is better
    cancelAnimationFrame(decay.current);
    drag.current = {
      active: true,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      lastX: e.clientX,
      lastT: performance.now(),
      velocity: 0,
      moved: false,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    const el = rail.current;
    if (!d.active || !el) return;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 3) d.moved = true;
    el.scrollLeft = d.startScroll - dx;

    const now = performance.now();
    const dt = now - d.lastT;
    if (dt > 0) {
      // px/ms, smoothed a little so a jittery mouse doesn't fling wildly.
      const v = (e.clientX - d.lastX) / dt;
      d.velocity = d.velocity * 0.6 + v * 0.4;
      d.lastX = e.clientX;
      d.lastT = now;
    }
    sync();
  };

  const release = () => {
    const d = drag.current;
    const el = rail.current;
    if (!d.active || !el) return;
    d.active = false;

    // Momentum: carry the fling, decaying exponentially. Same feel as the
    // `heavy` spring - it should read as mass, not as a scrollbar.
    let v = d.velocity * 16;
    const step = () => {
      v *= 0.94;
      el.scrollLeft -= v;
      sync();
      if (Math.abs(v) > 0.15) decay.current = requestAnimationFrame(step);
    };
    if (Math.abs(v) > 0.15) decay.current = requestAnimationFrame(step);
  };

  useEffect(() => () => cancelAnimationFrame(decay.current), []);

  const page = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={rail}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={release}
        onPointerLeave={release}
        onScroll={sync}
        // A click that followed a drag shouldn't open a project.
        onClickCapture={(e) => {
          if (drag.current.moved) {
            e.preventDefault();
            e.stopPropagation();
            drag.current.moved = false;
          }
        }}
        className="flex snap-x snap-mandatory flex-col gap-14 overflow-x-auto overflow-y-visible pb-4 [scrollbar-width:none] md:flex-row md:gap-10 md:[&::-webkit-scrollbar]:hidden"
      >
        {projects.map((project, i) => (
          <div
            key={project.slug}
            className="shrink-0 snap-start md:w-[min(46vw,34rem)]"
          >
            <ProjectCard project={project} priority={i === 0} />
          </div>
        ))}
      </div>

      {scrollable ? (
        <div className="mt-6 hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={() => page(-1)}
            disabled={atStart}
            aria-label="Previous projects"
            className="grid size-9 place-items-center border border-line text-ink-dim transition-colors duration-200 hover:border-ink hover:text-ink disabled:pointer-events-none disabled:opacity-30"
          >
            <ArrowLeft className="size-4" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={() => page(1)}
            disabled={atEnd}
            aria-label="More projects"
            className="grid size-9 place-items-center border border-line text-ink-dim transition-colors duration-200 hover:border-ink hover:text-ink disabled:pointer-events-none disabled:opacity-30"
          >
            <ArrowRight className="size-4" strokeWidth={1.5} />
          </button>
          <p className="pl-2 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-ink-dim">
            Drag or scroll
          </p>
        </div>
      ) : null}
    </div>
  );
}
