import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/schema";

/**
 * next/image with real intrinsic dimensions from the file on disk. That pairing
 * is the whole CLS story: the box is reserved before the bytes arrive.
 */
export function ProjectCard({
  project,
  priority = false,
}: {
  project: Project;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/work/${project.slug}`}
      data-cursor="open"
      className="group block focus-visible:outline-offset-8"
    >
      <div className="relative overflow-hidden bg-surface">
        <Image
          src={project.cover.src}
          alt={project.cover.alt}
          width={project.cover.width}
          height={project.cover.height}
          priority={priority}
          sizes="(min-width: 64rem) 44vw, (min-width: 48rem) 60vw, 88vw"
          className="aspect-[4/3] w-full object-cover transition-transform duration-[900ms] ease-[var(--e-out)] group-hover:scale-[1.035]"
        />
      </div>

      <div className="flex items-baseline justify-between gap-4 pt-4">
        <h3 className="text-h3 leading-none">{project.title}</h3>
        <span className="font-mono text-[0.7rem] tabular-nums text-ink-dim">
          {project.year}
        </span>
      </div>

      <p className="max-w-[46ch] pt-2 text-ink-dim">
        {project.tagline}
      </p>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-3">
        {project.stack.map((t) => (
          <span
            key={t}
            className="font-mono text-[0.66rem] uppercase tracking-[0.1em] text-ink-dim"
          >
            {t}
          </span>
        ))}
        <ArrowUpRight
          className="ml-auto size-4 shrink-0 text-ink-dim transition-transform duration-300 ease-[var(--e-out)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}
