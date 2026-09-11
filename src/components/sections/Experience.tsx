import { Reveal } from "@/motion/Reveal";
import { ProjectShowcase } from "@/components/ui/project-showcase";
import { experience, repos } from "@/lib/profile";

/**
 * The main section: a real experience timeline followed by a small open-source
 * strip linking public GitHub repos. Honest content, no invented products.
 */
export function Experience() {
  return (
    <section id="work" className="shell border-t border-line py-20 md:py-28">
      <p className="kicker">experience</p>
      <h2 className="mt-2 font-display text-h2 uppercase">Where I&#39;ve built</h2>

      <ol className="mt-12 flex list-none flex-col gap-4 p-0">
        {experience.map((e, i) => (
          <Reveal as="li" index={i} key={`${e.org}-${e.role}`}>
            <article className="rounded-2xl border border-line bg-surface p-6 transition-colors duration-300 hover:border-accent/50 md:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className="font-display text-h3 uppercase leading-none">
                  {e.role}
                </h3>
                <p className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink-dim">
                  {e.period} · {e.location}
                </p>
              </div>
              <p className="mt-1 font-semibold text-accent">{e.org}</p>

              <p className="mt-4 max-w-[62ch] text-ink-dim">{e.blurb}</p>

              <ul className="mt-4 flex list-none flex-col gap-2 p-0">
                {e.points.map((pt) => (
                  <li key={pt} className="flex gap-3 text-[0.95rem] text-ink-dim">
                    <span aria-hidden="true" className="mt-2 h-px w-4 shrink-0 bg-accent" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex flex-wrap gap-2">
                {e.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-line px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.08em] text-ink-dim"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </article>
          </Reveal>
        ))}
      </ol>

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
