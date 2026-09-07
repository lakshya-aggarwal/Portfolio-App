import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { Metadata } from "next";
import { getProject, getProjectSlugs } from "@/lib/content";

type Params = { params: Promise<{ slug: string }> };

/** Static at build time - every case study is a plain HTML file on the CDN. */
export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.tagline,
    openGraph: {
      title: project.title,
      description: project.tagline,
      images: [{ url: project.cover.src, ...{ width: project.cover.width, height: project.cover.height } }],
    },
    alternates: { canonical: `/work/${slug}` },
  };
}

const mdxComponents = {
  h2: (props: React.ComponentProps<"h2">) => (
    <h2 className="pt-12 text-h3" {...props} />
  ),
  p: (props: React.ComponentProps<"p">) => (
    <p className="max-w-[64ch] pt-4 text-ink-dim" {...props} />
  ),
  a: (props: React.ComponentProps<"a">) => (
    <a
      className="underline decoration-line underline-offset-4 hover:decoration-ink"
      {...props}
    />
  ),
  code: (props: React.ComponentProps<"code">) => (
    <code
      className="border border-line bg-surface px-1 py-0.5 font-mono text-[0.85em]"
      {...props}
    />
  ),
};

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <article className="shell pb-28 pt-32 md:pt-40">
      <Link
        href="/#work"
        className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-dim transition-colors duration-200 hover:text-ink"
      >
        <ArrowLeft className="size-3.5" strokeWidth={2} aria-hidden="true" />
        All work
      </Link>

      <header className="pt-10">
        <h1 className="max-w-[20ch] text-h1">{project.title}</h1>
        <p className="max-w-[56ch] pt-6 text-lead text-ink-dim">
          {project.tagline}
        </p>
      </header>

      <dl className="grid grid-cols-2 gap-x-8 gap-y-6 border-y border-line py-6 md:grid-cols-4">
        <div>
          <dt className="eyebrow">Year</dt>
          <dd className="m-0 pt-1.5 font-mono tabular-nums">{project.year}</dd>
        </div>
        <div>
          <dt className="eyebrow">Role</dt>
          <dd className="m-0 pt-1.5">{project.role}</dd>
        </div>
        <div className="col-span-2">
          <dt className="eyebrow">Stack</dt>
          <dd className="m-0 pt-1.5">{project.stack.join(" · ")}</dd>
        </div>
      </dl>

      <Image
        src={project.cover.src}
        alt={project.cover.alt}
        width={project.cover.width}
        height={project.cover.height}
        priority
        sizes="(min-width: 90rem) 84rem, 92vw"
        className="mt-10 w-full object-cover"
      />

      {/* auto-fit collapses empty tracks, so two metrics fill the row rather
          than leaving a stray empty panel at the end. */}
      {project.metrics.length > 0 ? (
        <dl
          className="mt-12 grid gap-px border border-line bg-line"
          style={{
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 12rem), 1fr))",
          }}
        >
          {project.metrics.map((m) => (
            <div key={m.label} className="bg-ground p-5">
              <dd className="m-0 font-mono text-[1.4rem] tabular-nums leading-none">
                {m.value}
              </dd>
              <dt className="eyebrow pt-2">{m.label}</dt>
            </div>
          ))}
        </dl>
      ) : null}

      <div className="pt-6">
        <MDXRemote source={project.body} components={mdxComponents} />
      </div>

      {project.links.repo || project.links.live ? (
        <div className="flex flex-wrap gap-3 pt-14">
          {project.links.live ? (
            <a
              href={project.links.live}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-ink bg-ink px-5 py-3 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ground transition-colors duration-200 hover:bg-transparent hover:text-ink"
            >
              Live site
              <ArrowUpRight className="size-3.5" strokeWidth={2} aria-hidden="true" />
            </a>
          ) : null}
          {project.links.repo ? (
            <a
              href={project.links.repo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-line px-5 py-3 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-dim transition-colors duration-200 hover:border-ink hover:text-ink"
            >
              Source
              <ArrowUpRight className="size-3.5" strokeWidth={2} aria-hidden="true" />
            </a>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
