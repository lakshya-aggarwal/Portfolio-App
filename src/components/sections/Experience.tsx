import { Briefcase } from "lucide-react";
import { Reveal } from "@/motion/Reveal";
import { ProjectShowcase } from "@/components/ui/project-showcase";
import { Timeline, type TimelineItem } from "@/components/ui/timeline";
import { experience, repos } from "@/lib/profile";

/**
 * The main section: a real experience timeline followed by a small open-source
 * strip linking public GitHub repos. Honest content, no invented products.
 */
export function Experience() {
  const timelineItems: TimelineItem[] = experience.map((e, i) => ({
    id: `${e.org}-${e.role}`,
    title: e.role,
    // Most recent role is "active" (pulsing dot); the rest are "completed".
    status: i === 0 ? "active" : "completed",
    icon: <Briefcase className="h-3 w-3" />,
    content: (
      <div>
        <p className="font-semibold text-accent">{e.org}</p>
        <p className="mt-0.5 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink-dim">
          {e.period} · {e.location}
        </p>
        <p className="mt-3 max-w-[62ch] text-ink-dim">{e.blurb}</p>
        <ul className="mt-3 flex list-none flex-col gap-2 p-0">
          {e.points.map((pt) => (
            <li key={pt} className="flex gap-3 text-[0.95rem] text-ink-dim">
              <span aria-hidden="true" className="mt-2 h-px w-4 shrink-0 bg-accent" />
              <span>{pt}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          {e.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-line px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.08em] text-ink-dim"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    ),
  }));

  return (
    <section id="work" className="shell border-t border-line py-20 md:py-28">
      <p className="kicker">experience</p>
      <h2 className="mt-2 font-display text-h2 uppercase">Where I&#39;ve built</h2>

      <Reveal className="mt-12">
        <Timeline items={timelineItems} variant="spacious" showTimestamps={false} />
      </Reveal>

      {/* Open source */}
      <div id="open-source" className="mt-20">
        <p className="kicker">open source</p>
        <h2 className="mt-2 font-display text-h2 uppercase">On GitHub</h2>

        <Reveal className="mt-10">
          <ProjectShowcase
            items={repos.map((r) => ({
              title: r.name,
              description: r.note,
              meta: r.language,
              href: r.href,
              image: r.image,
            }))}
          />
        </Reveal>
      </div>
    </section>
  );
}
