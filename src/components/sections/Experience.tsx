import { Reveal } from "@/motion/Reveal";
import { Bullets } from "@/components/ui/bullets";
import { ProjectShowcase } from "@/components/ui/project-showcase";
import { Timeline, type TimelineEntry } from "@/components/ui/timeline";
import { experience, repos } from "@/lib/profile";

/**
 * The main section: a real experience timeline followed by a small open-source
 * strip linking public GitHub repos. Honest content, no invented products.
 */
export function Experience() {
  const timelineData: TimelineEntry[] = experience.map((e) => {
    const multiRole = e.positions.length > 1;
    return {
      // The period is the sticky "year" label; positions scroll past it.
      title: e.period,
      // key on this element: it is created inside experience.map() and passed to
      // the (client) Timeline, so React wants a key to treat the set as a list.
      content: (
        <div key={e.org} className="pb-2">
          <h3 className="font-display text-h3 uppercase leading-none text-ink">
            {e.org}
          </h3>
          <p className="mt-1 font-mono text-meta uppercase tracking-eyebrow text-ink-dim">
            {e.location}
          </p>

          <div className="mt-4 flex flex-col gap-5">
            {e.positions.map((pos, i) => (
              <Reveal
                key={pos.role}
                as="div"
                index={i}
                className={i > 0 ? "border-t border-line pt-5" : undefined}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                  <p className="font-semibold text-accent">{pos.role}</p>
                  {multiRole && (
                    <p className="font-mono text-tag uppercase tracking-eyebrow text-ink-dim">
                      {pos.period}
                    </p>
                  )}
                </div>
                <p className="mt-2 max-w-[60ch] text-ink-dim">{pos.blurb}</p>
                <Bullets points={pos.points} />
                <div className="mt-4 flex flex-wrap gap-2">
                  {pos.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-line px-3 py-1 text-tag font-medium uppercase tracking-tag text-ink-dim"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      ),
    };
  });

  return (
    <section id="work" className="shell border-t border-line py-20 md:py-28">
      <p className="kicker">experience</p>
      <h2 className="mt-2 font-display text-h2 uppercase">Where I&#39;ve built</h2>

      <div className="mt-12">
        <Timeline data={timelineData} />
      </div>

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
