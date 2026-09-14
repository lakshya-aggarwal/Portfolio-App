"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/media";

/**
 * Scroll-beam timeline in the spirit of Aceternity's (manuarora700) component:
 * a sticky title per entry, and a vertical track whose accent gradient "beam"
 * fills as you scroll through the section.
 *
 * Reimplemented natively - the original uses framer-motion's useScroll/
 * useTransform; this drives the beam height from a rAF-throttled scroll handler
 * so the site keeps its no-animation-library footprint. Reduced motion shows a
 * full, static beam.
 */

export interface TimelineEntry {
  title: string;
  content: ReactNode;
}

export function Timeline({ data }: { data: TimelineEntry[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  // Measure the track height (grows/shrinks with content and viewport). The
  // ResizeObserver fires once on observe, so state is only set from its (async)
  // callback - never synchronously in the effect body.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() =>
      setHeight(el.getBoundingClientRect().height),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Beam fill from scroll position. 0 as the block enters, 1 once it has mostly
  // scrolled through - the same feel as framer offset ["start 10%","end 50%"].
  // The beam height/opacity are written straight to the beam node in the rAF
  // callback (not via state), so scrolling never re-renders the mapped entries.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const reduced = prefersReducedMotion();
    let raf = 0;
    const paint = (p: number) => {
      const beam = beamRef.current;
      if (!beam) return;
      beam.style.height = `${p * 100}%`;
      beam.style.opacity = p > 0.02 ? "1" : "0";
    };
    const update = () => {
      if (reduced) {
        paint(1);
        return;
      }
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const startLine = vh * 0.15;
      const span = rect.height - vh * 0.5;
      const p = span > 0 ? (startLine - rect.top) / span : rect.top <= startLine ? 1 : 0;
      paint(Math.min(1, Math.max(0, p)));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    if (!reduced) {
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={trackRef} className="relative w-full">
      {data.map((item, index) => (
        <div key={index} className="flex justify-start pt-10 md:gap-10 md:pt-24">
          {/* Sticky title + dot */}
          <div className="sticky top-28 z-30 flex max-w-xs flex-col items-start self-start md:w-52 md:flex-row lg:max-w-sm">
            <div className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full bg-ground">
              <div className="h-3 w-3 rounded-full border border-line bg-surface" />
            </div>
            <h3 className="hidden pl-16 font-display text-h3 uppercase leading-none text-ink-dim md:block">
              {item.title}
            </h3>
          </div>

          {/* Content */}
          <div className="relative w-full pl-16 pr-1 md:pl-4">
            <h3 className="mb-3 block font-display text-h3 uppercase leading-none text-ink-dim md:hidden">
              {item.title}
            </h3>
            {item.content}
          </div>
        </div>
      ))}

      {/* Track + animated beam */}
      <div
        style={{ height: `${height}px` }}
        className="absolute left-5 top-0 w-[2px] overflow-hidden bg-line/60"
        aria-hidden="true"
      >
        {/* Initial hidden state is set via classes (h-0 opacity-0); the rAF
            paint() then owns the inline height/opacity outright - no dual
            ownership between a JSX style prop and imperative writes. */}
        <div
          ref={beamRef}
          className="absolute inset-x-0 top-0 h-0 w-[2px] rounded-full bg-gradient-to-t from-accent via-accent-2 to-transparent opacity-0 transition-opacity duration-300"
        />
      </div>
    </div>
  );
}
