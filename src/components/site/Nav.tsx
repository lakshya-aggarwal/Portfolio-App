"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { site } from "@/lib/site";

/**
 * The "has it left the hero" test is an IntersectionObserver on a sentinel
 * rather than a scroll handler, so it fires twice in the life of the page
 * instead of on every tick. No scroll library needed.
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
      <div ref={sentinel} aria-hidden="true" className="absolute top-0 h-16 w-px" />

      <header
        className={`no-print fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          solid
            ? "border-b border-line bg-[color-mix(in_oklab,var(--sem-ground)_85%,transparent)] backdrop-blur-md"
            : "border-b border-transparent"
        }`}
      >
        <div className="shell flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            className="font-display text-lg uppercase tracking-wide text-ink"
          >
            {site.name.split(" ")[0]}
            <span className="text-accent">.</span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-micro font-semibold uppercase tracking-eyebrow text-ink-dim transition-colors duration-200 hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={site.resume}
              download
              className="rounded-full bg-accent px-4 py-2 text-meta font-semibold uppercase tracking-tag text-accent-ink transition-transform duration-200 ease-[var(--e-out)] hover:-translate-y-0.5"
            >
              Résumé
            </a>
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
                className="py-2.5 text-micro font-semibold uppercase tracking-eyebrow text-ink-dim"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={site.resume}
              download
              onClick={() => setOpen(false)}
              className="py-2.5 text-micro font-semibold uppercase tracking-eyebrow text-accent"
            >
              Résumé
            </a>
          </nav>
        </div>
      </header>
    </>
  );
}
