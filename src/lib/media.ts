"use client";

import { useSyncExternalStore } from "react";

/**
 * Media queries and the document theme are external stores, not React state.
 * Reading them with useSyncExternalStore rather than setState-in-an-effect
 * avoids the cascading render React's lint rules (correctly) flag, and gives a
 * defined server snapshot so hydration is stable.
 */

const emptyUnsubscribe = () => {};

export function useMediaQuery(query: string, serverValue = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      if (typeof window === "undefined") return emptyUnsubscribe;
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

export type Theme = "dark" | "light";

/** Fires whenever this tab changes the theme, so every reader stays in sync. */
const THEME_EVENT = "themechange";

export function useTheme(): [Theme, (next: Theme) => void] {
  const theme = useSyncExternalStore<Theme>(
    (onChange) => {
      if (typeof window === "undefined") return emptyUnsubscribe;
      const mql = window.matchMedia("(prefers-color-scheme: light)");
      mql.addEventListener("change", onChange);
      window.addEventListener(THEME_EVENT, onChange);
      return () => {
        mql.removeEventListener("change", onChange);
        window.removeEventListener(THEME_EVENT, onChange);
      };
    },
    () => {
      const explicit = document.documentElement.dataset.theme as
        | Theme
        | undefined;
      if (explicit) return explicit;
      return window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark";
    },
    // The site is dark by default, and the boot script in the layout applies any
    // stored choice before first paint.
    () => "dark",
  );

  const setTheme = (next: Theme) => {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Private browsing. The page still works, it just won't remember.
    }
    window.dispatchEvent(new Event(THEME_EVENT));
  };

  return [theme, setTheme];
}
