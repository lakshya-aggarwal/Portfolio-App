"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Command } from "lucide-react";
import { DURATION, EASE } from "@/motion/tokens";
import { site } from "@/lib/site";

type Item = { label: string; hint: string; run: () => void };

/**
 * ⌘K palette. Recruiters skim; give them a keyboard.
 *
 * Deliberately a small hand-rolled dialog rather than a combobox library: it has
 * one input and one list, and the accessibility contract it needs is short -
 * role="dialog" with a label, focus moved in on open and restored on close,
 * Escape to dismiss, arrow keys to move, and aria-activedescendant so the
 * highlighted row is announced without stealing focus from the input.
 */
export function Palette() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  const items = useMemo<Item[]>(() => {
    const go = (href: string) => () => {
      setOpen(false);
      router.push(href);
    };
    return [
      { label: "Work", hint: "Selected projects", run: go("/#work") },
      { label: "Stack", hint: "The assembly", run: go("/#stack") },
      { label: "About", hint: "Who I am", run: go("/#about") },
      { label: "Contact", hint: "Get in touch", run: go("/#contact") },
      {
        label: "Résumé",
        hint: "Download PDF",
        run: () => {
          setOpen(false);
          window.open(site.resume, "_blank", "noopener");
        },
      },
      {
        label: "Email",
        hint: site.email,
        run: () => {
          setOpen(false);
          window.location.href = `mailto:${site.email}`;
        },
      },
      ...site.socials.map((s) => ({
        label: s.label,
        hint: "External",
        run: () => {
          setOpen(false);
          window.open(s.href, "_blank", "noopener");
        },
      })),
    ];
  }, [router]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.label.toLowerCase().includes(q) || i.hint.toLowerCase().includes(q),
    );
  }, [items, query]);

  // Global shortcut.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((wasOpen) => {
          if (!wasOpen) {
            restoreTo.current = document.activeElement as HTMLElement;
            setQuery("");
            setCursor(0);
          }
          return !wasOpen;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Focus in on open, back where it came from on close. State resets happen in
  // the handlers below rather than here: setState inside an effect causes a
  // cascading render, and these are all responses to events anyway.
  useEffect(() => {
    if (open) {
      // After the enter animation has started, so focus isn't stolen mid-paint.
      const id = window.setTimeout(() => input.current?.focus(), 20);
      return () => window.clearTimeout(id);
    }
    restoreTo.current?.focus?.();
    return undefined;
  }, [open]);

  // The cursor is clamped rather than reset by an effect, so a shrinking result
  // list can never leave it pointing past the end.
  const active = results.length ? Math.min(cursor, results.length - 1) : 0;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor(results.length ? (active + 1) % results.length : 0);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor(
        results.length ? (active - 1 + results.length) % results.length : 0,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      results[active]?.run();
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-70 flex items-start justify-center px-4 pt-[14vh] print:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : DURATION.fast }}
        >
          <button
            type="button"
            aria-label="Close command palette"
            className="absolute inset-0 cursor-default bg-[color-mix(in_oklab,var(--sem-ground)_72%,transparent)] backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="relative w-full max-w-lg border border-line bg-surface shadow-2xl"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: reduced ? 0 : DURATION.base, ease: EASE.out }}
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Command className="size-4 shrink-0 text-ink-dim" strokeWidth={1.5} aria-hidden="true" />
              <input
                ref={input}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setCursor(0);
                }}
                onKeyDown={onKeyDown}
                placeholder="Jump to…"
                aria-label="Search"
                aria-controls="palette-list"
                aria-activedescendant={
                  results[active] ? `palette-item-${active}` : undefined
                }
                className="w-full bg-transparent py-3.5 font-mono text-[0.8rem] text-ink outline-none placeholder:text-ink-dim"
              />
            </div>

            <ul id="palette-list" role="listbox" aria-label="Destinations" className="m-0 max-h-72 list-none overflow-y-auto p-0">
              {results.map((item, i) => (
                <li key={item.label} role="none">
                  <button
                    type="button"
                    id={`palette-item-${i}`}
                    role="option"
                    aria-selected={i === active}
                    onMouseEnter={() => setCursor(i)}
                    onClick={item.run}
                    className={`flex w-full items-center justify-between gap-4 px-4 py-2.5 text-left transition-colors duration-150 ${
                      i === active ? "bg-[color-mix(in_oklab,var(--sem-ink)_9%,transparent)]" : ""
                    }`}
                  >
                    <span className="text-[0.9rem]">{item.label}</span>
                    <span className="flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-[0.1em] text-ink-dim">
                      {item.hint}
                      {i === active ? (
                        <ArrowRight className="size-3" strokeWidth={2} aria-hidden="true" />
                      ) : null}
                    </span>
                  </button>
                </li>
              ))}
              {results.length === 0 ? (
                <li className="px-4 py-6 text-center font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink-dim">
                  Nothing matches “{query}”
                </li>
              ) : null}
            </ul>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
