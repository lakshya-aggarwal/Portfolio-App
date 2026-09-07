import { ArrowUpRight } from "lucide-react";
import { site } from "@/lib/site";

export function Contact() {
  return (
    <section
      id="contact"
      className="shell border-t border-line py-24 md:py-32"
    >
      <p className="eyebrow">Contact</p>
      <h2 className="max-w-[24ch] pt-8 text-h2">
        Got something that needs building properly?
      </h2>

      <a
        href={`mailto:${site.email}`}
        data-cursor="write"
        className="group mt-10 inline-flex items-baseline gap-3 border-b border-line pb-2 text-h3 transition-colors duration-200 hover:border-ink"
      >
        {site.email}
        <ArrowUpRight
          className="size-5 shrink-0 self-center text-ink-dim transition-transform duration-300 ease-[var(--e-out)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </a>

      <ul className="flex flex-wrap gap-x-8 gap-y-2 pt-10">
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
