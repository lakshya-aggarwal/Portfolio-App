import Link from "next/link";
import { ArrowDown, FileText } from "lucide-react";
import { site } from "@/lib/site";

/**
 * The hero is deliberately type-only: no canvas, no image. It is the LCP
 * element, so it paints on the first frame and the WebGL work stays below the
 * fold where it can load lazily.
 */
export function Hero() {
  return (
    <section className="shell pb-24 pt-36 md:pb-36 md:pt-44">
      <p className="eyebrow">
        {site.role} · Available for work
      </p>

      <h1 className="max-w-[18ch] pt-6 text-mega">
        Builds that
        <br />
        <span className="italic">hold weight.</span>
      </h1>

      <p className="max-w-[54ch] pt-8 text-lead text-ink-dim">
        I build interfaces that are fast on a mid-range phone, legible to a
        screen reader, and physical enough that people remember them. Currently
        working across React, Next.js and WebGL.
      </p>

      <div className="flex flex-wrap items-center gap-3 pt-10">
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 border border-ink bg-ink px-5 py-3 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ground transition-colors duration-200 hover:bg-transparent hover:text-ink"
        >
          See the work
          <ArrowDown className="size-3.5" strokeWidth={2} aria-hidden="true" />
        </Link>
        <a
          href={site.resume}
          download
          className="inline-flex items-center gap-2 border border-line px-5 py-3 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-dim transition-colors duration-200 hover:border-ink hover:text-ink"
        >
          Résumé
          <FileText className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
