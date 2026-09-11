import { ArrowUpRight } from "lucide-react";
import { site } from "@/lib/site";

export function Contact() {
  return (
    <section id="contact" className="shell border-t border-line py-20 md:py-28">
      <p className="kicker">contact</p>
      <h2 className="mt-2 max-w-[20ch] font-display text-h2 uppercase">
        Got something that needs building?
      </h2>

      <div className="mt-8">
        <a
          href={`mailto:${site.email}`}
          className="group inline-flex items-center gap-3 border-b border-line pb-2 text-h3 transition-colors duration-200 hover:border-accent hover:text-accent"
        >
          {site.email}
          <ArrowUpRight
            className="size-5 shrink-0 text-ink-dim transition-transform duration-300 ease-[var(--e-out)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
            strokeWidth={1.75}
            aria-hidden="true"
          />
        </a>
      </div>

      <ul className="mt-10 flex list-none flex-wrap gap-x-8 gap-y-2 p-0">
        {site.socials.map((s) => (
          <li key={s.label}>
            <a
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-dim transition-colors duration-200 hover:text-ink"
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
