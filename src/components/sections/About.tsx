import { Reveal } from "@/motion/Reveal";
import { about, certifications } from "@/lib/profile";

export function About() {
  return (
    <section id="about" className="shell border-t border-line py-20 md:py-28">
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
    </section>
  );
}
