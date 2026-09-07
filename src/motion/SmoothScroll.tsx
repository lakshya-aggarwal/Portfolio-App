"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";

/**
 * L2 — the scroll signal, and the only scroll loop in the app.
 *
 * It publishes two values as CSS custom properties on <html>:
 *   --scroll-progress  0..1 down the document
 *   --scroll-velocity  signed, roughly -60..60, smoothed by Lenis
 *
 * CSS reads them directly, so scroll-linked effects (the reading-position bar,
 * the velocity skew) cost no React renders at all. The previous version pushed
 * these through MotionValues and re-rendered the header on every scroll tick.
 *
 * JS consumers that need the numbers (the WebGL layer, for shader uniforms) read
 * them off the ref via useScrollSignal() inside their own frame loop rather than
 * subscribing, which keeps this a one-way broadcast.
 */

type Signal = { progress: number; velocity: number };

const ScrollContext = createContext<{ current: Signal } | null>(null);

/** Read-on-demand scroll state. Poll it in a frame loop; never in render. */
export function useScrollSignal(): { current: Signal } {
  const ctx = useContext(ScrollContext);
  if (!ctx) throw new Error("useScrollSignal must be used inside <SmoothScroll>");
  return ctx;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const signal = useRef<Signal>({ progress: 0, velocity: 0 });

  useEffect(() => {
    const root = document.documentElement;
    const publish = (progress: number, velocity: number) => {
      signal.current.progress = progress;
      signal.current.velocity = velocity;
      root.style.setProperty("--scroll-progress", progress.toFixed(4));
      root.style.setProperty("--scroll-velocity", velocity.toFixed(3));
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Reduced motion gets native scrolling and a zero velocity signal. Not the
    // same animation faster — hijacked scroll is what makes people motion sick.
    if (reduced) {
      const onScroll = () => {
        const max = root.scrollHeight - window.innerHeight;
        publish(max > 0 ? window.scrollY / max : 0, 0);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    const lenis = new Lenis({
      duration: 1.05,
      // Long-tail exponential — the --e-out curve's continuous cousin.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.6,
    });

    lenis.on("scroll", (e: { progress: number; velocity: number }) => {
      publish(e.progress, e.velocity);
    });

    let frame = requestAnimationFrame(function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });

    // Anchor links have to go through Lenis or they fight it. The offset clears
    // the 64px fixed header.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      const anchor = (event.target as HTMLElement)?.closest?.('a[href^="/#"], a[href^="#"]');
      const href = anchor?.getAttribute("href");
      if (!href) return;
      const id = href.slice(href.indexOf("#"));
      if (id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -88 });
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("click", onClick);
      lenis.destroy();
      root.style.removeProperty("--scroll-progress");
      root.style.removeProperty("--scroll-velocity");
    };
  }, []);

  return (
    <ScrollContext.Provider value={signal}>{children}</ScrollContext.Provider>
  );
}
