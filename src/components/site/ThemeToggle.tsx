"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/media";

/**
 * The theme lives in the DOM (data-theme) and localStorage, applied by the boot
 * script before first paint. This reads that external store directly, so the
 * button can never disagree with the page.
 *
 * The previous build had a toggle like this that was never mounted, which is
 * why dark mode was unreachable despite dark variants existing throughout.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useTheme();
  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} theme`}
      className="grid size-9 place-items-center rounded-full border border-line text-ink-dim transition-colors duration-200 hover:border-ink hover:text-ink"
    >
      {theme === "light" ? (
        <Moon className="size-4" strokeWidth={1.5} />
      ) : (
        <Sun className="size-4" strokeWidth={1.5} />
      )}
    </button>
  );
}
