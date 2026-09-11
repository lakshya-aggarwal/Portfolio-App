import { Reveal } from "@/motion/Reveal";
import { about, skills, certifications, education } from "@/lib/profile";

export function About() {
  return (
    <section id="about" className="shell border-t border-line py-20 md:py-28">
      <div className="grid gap-x-12 gap-y-10 md:grid-cols-[1.35fr_1fr]">
        <div>
          <p className="kicker">about</p>
          <h2 className="mt-2 font-display text-h2 uppercase">The short version</h2>
          <Reveal as="p" className="mt-6 max-w-[58ch] text-lead text-ink-dim">
            {about}
          </Reveal>

          <ul className="mt-8 flex list-none flex-col gap-2 p-0">
            {certifications.map((c) => (
              <li key={c} className="flex gap-3 text-[0.95rem]">
                <span aria-hidden="true" className="mt-2 h-px w-4 shrink-0 bg-accent" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-8">
          <div>
            <p className="kicker">stack</p>
            <dl className="mt-4 flex flex-col gap-4">
              {skills.map((group) => (
                <div key={group.label}>
                  <dt className="eyebrow border-b border-line pb-2">{group.label}</dt>
                  <dd className="m-0 mt-3 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-line px-3 py-1 text-[0.72rem] font-medium text-ink"
                      >
                        {item}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <p className="kicker">education</p>
            {education.map((ed) => (
              <div key={ed.school} className="mt-4">
                <p className="font-semibold">{ed.school}</p>
                <p className="text-[0.92rem] text-ink-dim">
                  {ed.detail} · {ed.period}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
