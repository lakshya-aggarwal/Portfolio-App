"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { ProjectRail } from "@/components/common/ProjectRail";
import { SplitText } from "@/motion/SplitText";
import type { Project, Skill } from "@/lib/schema";

/**
 * The stack and the work are one component because they share one piece of
 * state: the selected technology. Grabbing a tile in the canvas and pressing a
 * chip in the DOM are the same action.
 *
 * The canvas is loaded lazily and never server-rendered - three.js and Rapier's
 * WASM must not be in the first-paint path.
 */
const Assembly = dynamic(() => import("@/gl/Assembly"), {
  ssr: false,
  loading: () => null,
});

type Props = {
  projects: Project[];
  tech: { tech: string; count: number }[];
  skills: Skill[];
};

export function StackWork({ projects, tech, skills }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = useMemo(
    () => (selected ? projects.filter((p) => p.stack.includes(selected as never)) : projects),
    [projects, selected],
  );

  const toggle = (label: string) =>
    setSelected((current) => (current === label ? null : label));

  const categories = useMemo(
    () => [...new Set(skills.map((s) => s.category))],
    [skills],
  );

  return (
    <>
      <section
        id="stack"
        className="border-t border-line py-24 md:py-32"
      >
        <div className="shell">
          <p className="eyebrow">Stack</p>
          <SplitText as="h2" className="block max-w-[26ch] pt-8 text-h2">
            Grab a stone. It filters the work.
          </SplitText>
          <p className="max-w-[52ch] pt-5 text-ink-dim">
            Everything I actually build with, given mass. Throw them around, or
            use the buttons below if you would rather just get on with it.
          </p>
        </div>

        {/* The simulation. Decorative and duplicated by the chips below. */}
        <div className="relative mt-10 h-[40vh] min-h-[280px] w-full overflow-hidden border-y border-line bg-surface md:h-[44vh]">
          <Assembly
            tech={tech.map((t) => t.tech)}
            selected={selected}
            onSelect={toggle}
          />
          <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-dim">
            Drag · throw · tap to filter
          </p>
        </div>

        {/* The accessible path: real buttons, keyboard reachable, announced. */}
        <div className="shell pt-8">
          <div
            role="group"
            aria-label="Filter work by technology"
            className="flex flex-wrap gap-2"
          >
            {tech.map(({ tech: label, count }) => {
              const on = selected === label;
              return (
                <button
                  key={label}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(label)}
                  className={`inline-flex items-center gap-2 border px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.1em] transition-colors duration-200 ${
                    on
                      ? "border-accent bg-accent text-white"
                      : "border-line text-ink-dim hover:border-ink hover:text-ink"
                  }`}
                >
                  {label}
                  <span className="tabular-nums opacity-60">{count}</span>
                </button>
              );
            })}
          </div>

          <dl className="grid gap-x-10 gap-y-6 pt-12 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <div key={category}>
                <dt className="eyebrow border-b border-line pb-2">
                  {category}
                </dt>
                <dd className="m-0 pt-3">
                  <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
                    {skills
                      .filter((s) => s.category === category)
                      .map((s) => (
                        <li
                          key={s.name}
                          className="flex items-baseline justify-between gap-3 text-micro"
                        >
                          <span>{s.name}</span>
                          {s.years ? (
                            <span className="font-mono text-[0.65rem] tabular-nums text-ink-dim">
                              {s.years}y
                            </span>
                          ) : null}
                        </li>
                      ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section
        id="work"
        className="shell border-t border-line py-24 md:py-32"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <p className="eyebrow">Selected work</p>
          <p
            aria-live="polite"
            className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink-dim"
          >
            {selected
              ? `${filtered.length} of ${projects.length} · ${selected}`
              : `${projects.length} projects`}
          </p>
        </div>

        {/* A couple of degrees of skew proportional to scroll speed, straight
            from the scroll loop's CSS variable - no React renders involved.
            The reduced-motion rule in globals.css zeroes it out. */}
        <div className="velocity-skew pt-12">
          <ProjectRail projects={filtered} />
        </div>

        {filtered.length === 0 ? (
          <p className="pt-12 text-ink-dim">
            Nothing built with {selected} yet.{" "}
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="underline decoration-line underline-offset-4 hover:decoration-ink"
            >
              Show everything
            </button>
          </p>
        ) : null}
      </section>
    </>
  );
}
