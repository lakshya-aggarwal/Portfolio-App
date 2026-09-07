import Link from "next/link";
import { ArrowDown, FileText } from "lucide-react";
import { SplitText } from "@/motion/SplitText";
import { Magnetic } from "@/motion/Magnetic";
import { Reveal } from "@/motion/Reveal";
import { site } from "@/lib/site";

/**
 * The hero is type-only by design: no canvas, no photograph. It is the LCP
 * element, so it paints on the first frame while the relief backdrop and the
 * physics scene load behind and below it.
 *
 * The entrance is one orchestrated sequence rather than four independent
 * effects - eyebrow, then the headline rising out of its mask word by word,
 * then the standfirst, then the controls.
 */
export function Hero() {
  return (
    <section className="shell pb-24 pt-36 md:pb-36 md:pt-44">
      <SplitText as="p" className="eyebrow" delay={0.1} immediate>
        {`${site.role} · Available for work`}
      </SplitText>

      <h1 className="max-w-[18ch] pt-6 text-mega" aria-label="Builds that hold weight.">
        <SplitText as="span" className="block" delay={0.24} immediate>
          Builds that
        </SplitText>
        <SplitText as="span" className="block italic" delay={0.4} immediate>
          hold weight.
        </SplitText>
      </h1>

      <Reveal distance={14}>
        <p className="max-w-[54ch] pt-8 text-lead text-ink-dim">
          I build interfaces that are fast on a mid-range phone, legible to a
          screen reader, and physical enough that people remember them.
          Currently working across React, Next.js and WebGL.
        </p>
      </Reveal>

      <Reveal distance={14} index={1}>
        <div className="flex flex-wrap items-center gap-3 pt-10">
          <Magnetic strength={6}>
            <Link
              href="/#work"
              className="group inline-flex items-center gap-2 border border-ink bg-ink px-5 py-3 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ground transition-colors duration-200 hover:bg-transparent hover:text-ink"
            >
              See the work
              <ArrowDown
                className="size-3.5 transition-transform duration-300 ease-[var(--e-out)] group-hover:translate-y-0.5"
                strokeWidth={2}
                aria-hidden="true"
              />
            </Link>
          </Magnetic>
          <Magnetic strength={6}>
            <a
              href={site.resume}
              download
              className="inline-flex items-center gap-2 border border-line px-5 py-3 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-dim transition-colors duration-200 hover:border-ink hover:text-ink"
            >
              Résumé
              <FileText className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
            </a>
          </Magnetic>
          <p className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-ink-dim">
            or press{" "}
            <kbd className="border border-line px-1.5 py-0.5 not-italic">⌘K</kbd>
          </p>
        </div>
      </Reveal>
    </section>
  );
}
