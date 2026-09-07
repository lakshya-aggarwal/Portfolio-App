import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { imageSize } from "image-size";
import { ProjectFrontmatter, Skill, type Project } from "@/lib/schema";

/**
 * L1 - the content reader. Server-only: it touches the filesystem, so importing
 * it from a client component is a build error, which is the intent.
 *
 * Covers are served straight from /public/media/<slug>/ and measured there, so
 * there is no copy step and no second source of truth. Intrinsic size is read
 * off the file rather than written into frontmatter by hand, because
 * hand-written dimensions go stale the first time an image is re-exported.
 */

const CONTENT_DIR = path.join(process.cwd(), "content", "projects");
const MEDIA_DIR = path.join(process.cwd(), "public", "media");

function readProject(slug: string): Project {
  const dir = path.join(CONTENT_DIR, slug);
  const file = path.join(dir, "index.mdx");
  const { data, content } = matter(readFileSync(file, "utf8"));

  const parsed = ProjectFrontmatter.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      `Invalid frontmatter in content/projects/${slug}/index.mdx\n` +
        parsed.error.issues
          .map((i) => `  · ${i.path.join(".") || "(root)"}: ${i.message}`)
          .join("\n"),
    );
  }
  const fm = parsed.data;

  const coverPath = path.join(MEDIA_DIR, slug, fm.cover);
  if (!existsSync(coverPath)) {
    throw new Error(
      `Missing cover for "${slug}": expected public/media/${slug}/${fm.cover}`,
    );
  }
  const dims = imageSize(readFileSync(coverPath));
  if (!dims.width || !dims.height) {
    throw new Error(`Could not measure cover for "${slug}"`);
  }

  const { cover: _cover, coverAlt, ...rest } = fm;
  return {
    ...rest,
    slug,
    cover: {
      src: `/media/${slug}/${fm.cover}`,
      width: dims.width,
      height: dims.height,
      alt: coverAlt,
    },
    body: content,
  };
}

/** Published projects in deterministic order. Drafts never reach the client. */
export function getProjects(): Project[] {
  return readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => readProject(e.name))
    .filter((p) => p.status === "published")
    .sort((a, b) => a.order - b.order || b.year - a.year);
}

export function getProject(slug: string): Project | null {
  if (!existsSync(path.join(CONTENT_DIR, slug, "index.mdx"))) return null;
  const project = readProject(slug);
  return project.status === "published" ? project : null;
}

export function getProjectSlugs(): string[] {
  return getProjects().map((p) => p.slug);
}

/** The tech vocabulary actually in use, most-used first - drives the filter chips. */
export function getUsedTech(): { tech: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of getProjects()) {
    for (const t of p.stack) counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tech, count]) => ({ tech, count }))
    .sort((a, b) => b.count - a.count || a.tech.localeCompare(b.tech));
}

export function getSkills(): Skill[] {
  const file = path.join(process.cwd(), "content", "skills.json");
  return Skill.array().parse(JSON.parse(readFileSync(file, "utf8")));
}
