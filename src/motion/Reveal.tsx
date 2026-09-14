"use client";

import { type ReactNode } from "react";
import { STAGGER } from "@/motion/tokens";
import { useInViewFlag } from "@/motion/useInViewFlag";

/**
 * L2 - the house reveal, and the only one.
 *
 * The rule it enforces: **the resting state is visible.** The server renders
 * the content with no hidden styling at all, so no-JS visitors, crawlers,
 * printers and full-page screenshots always get it. The hidden state is applied
 * on the client inside a layout effect - which runs before paint, so there is
 * no flash - and removed as soon as the element intersects. That whole lifecycle
 * lives in the shared `useInViewFlag` primitive; this component adds the stagger
 * delay and the element tag.
 */

type RevealProps = {
  children: ReactNode;
  /** Index in a group, for stagger. */
  index?: number;
  /** px travelled on entry. */
  distance?: number;
  as?: "div" | "section" | "li" | "span" | "p";
  className?: string;
};

export function Reveal({
  children,
  index = 0,
  distance = 18,
  as: Tag = "div",
  className,
}: RevealProps) {
  const ref = useInViewFlag<HTMLElement>({
    attr: "reveal",
    rootMargin: "0px 0px -12% 0px",
    failsafeMs: 4000,
  });

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={className}
      style={
        {
          "--reveal-distance": `${distance}px`,
          "--reveal-delay": `${index * STAGGER.base}s`,
        } as React.CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
