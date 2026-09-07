"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { site } from "@/lib/site";

/**
 * The reading-position bar is driven entirely by --scroll-progress in CSS, so
 * scrolling never re-renders this component. The only state here is the two
 * things that genuinely change the markup: the menu, and whether the bar has a
 * background yet.
 *
 * That "has it left the hero" test is an IntersectionObserver on a sentinel
 * rather than a scroll handler, so it fires twice in the life of the page
 * instead of on every tick.
 */
export function Nav() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setSolid(!entry?.isIntersecting),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* Sits at the very top of the document; once it scrolls away, the bar
          earns its background. */}
      <div ref={sentinel} aria-hidden="true" className="absolute top-0 h-16 w-px" />

      <header
        className={`no-print fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          solid
            ? "border-b border-line bg-[color-mix(in_oklab,var(--sem-ground)_82%,transparent)] backdrop-blur-md"
            : "border-b border-transparent"
        }`}
      >
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px origin-left bg-accent"
          style={{ transform: "scaleX(var(--scroll-progress, 0))" }}
        />
        <div className="shell flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-ink"
          >
            {site.name.split(" ")[0]}
            <span className="text-ink-dim">.dev</span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-dim transition-colors duration-200 hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              className="grid size-9 place-items-center rounded-full border border-line text-ink-dim md:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? (
                <X className="size-4" strokeWidth={1.5} />
              ) : (
                <Menu className="size-4" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>

        <div
          id="mobile-nav"
          hidden={!open}
          className="border-t border-line bg-ground md:hidden"
        >
          <nav aria-label="Primary, mobile" className="shell flex flex-col py-4">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-2.5 font-mono text-[0.8rem] uppercase tracking-[0.14em] text-ink-dim"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}
