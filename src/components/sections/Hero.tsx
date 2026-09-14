import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { Reveal } from "@/motion/Reveal";
import { site } from "@/lib/site";

/**
 * Type-only hero. It is the LCP element, so it ships fully legible on the first
 * frame; the reveals below the fold arm themselves after paint.
 */
export function Hero() {
  return (
    <section className="shell relative pb-20 pt-36 md:pb-28 md:pt-44">
      <Reveal as="p" className="kicker">
        hi, I&#39;m Lakshya
      </Reveal>

      <h1 className="mt-3 max-w-[16ch] font-display text-h1 uppercase">
        Software that ships,
        <br className="hidden sm:block" /> and{" "}
        <span className="text-accent">stays shipped.</span>
      </h1>

      <Reveal as="p" index={1} className="mt-8 max-w-[52ch] text-lead text-ink-dim">
        {site.description} I turn fuzzy requirements into things people actually
        use — across enterprise AEM, full-stack web, and Android.
      </Reveal>

      <Reveal
        as="div"
        index={2}
        className="mt-10 flex flex-wrap items-center gap-3"
      >
        <Link
          href="/#work"
          className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-micro font-semibold uppercase tracking-tag text-accent-ink transition-transform duration-200 ease-[var(--e-out)] hover:-translate-y-0.5"
        >
          See my work
          <ArrowDown
            className="size-4 transition-transform duration-300 ease-[var(--e-out)] group-hover:translate-y-0.5"
            strokeWidth={2}
            aria-hidden="true"
          />
        </Link>
        <a
          href={site.resume}
          download
          className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-micro font-semibold uppercase tracking-tag text-ink transition-colors duration-200 hover:border-accent hover:text-accent"
        >
          Résumé
        </a>
      </Reveal>
    </section>
  );
}
