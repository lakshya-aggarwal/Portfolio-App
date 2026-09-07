import { z } from "zod";

/**
 * L1 - content shape. This is the boundary: anything that fails here fails the
 * build, not the page. Nothing downstream re-validates or defends against bad
 * content, because nothing downstream can receive any.
 */

/** Controlled vocabulary. Free strings can't be filtered on without a migration. */
export const TECH = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Three.js",
  "WebGL",
  "Tailwind",
  "PostgreSQL",
  "Python",
  "WebSockets",
  "Rust",
  "Docker",
] as const;

export const Tech = z.enum(TECH);
export type Tech = z.infer<typeof Tech>;

export const Media = z.object({
  /** Path under /public, or a content-relative filename resolved at read time. */
  src: z.string().min(1),
  /** Intrinsic size. Present so next/image can reserve the box: this is the CLS fix. */
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  /** Required, not optional - an optional alt field is a field that stays empty. */
  alt: z.string().min(1),
});
export type Media = z.infer<typeof Media>;

/** Frontmatter as authored. Sizes are measured on disk, so they aren't written by hand. */
export const ProjectFrontmatter = z.object({
  title: z.string().min(1),
  tagline: z.string().min(1).max(140),
  year: z.number().int().min(2015).max(2100),
  role: z.string().min(1),
  stack: z.array(Tech).min(1),
  cover: z.string().min(1),
  coverAlt: z.string().min(1),
  links: z
    .object({
      repo: z.url().optional(),
      live: z.url().optional(),
    })
    .default({}),
  featured: z.boolean().default(false),
  /** Explicit order beats array position, which breaks once files are read off disk. */
  order: z.number().int().default(999),
  status: z.enum(["draft", "published"]).default("draft"),
  metrics: z
    .array(z.object({ label: z.string().min(1), value: z.string().min(1) }))
    .default([]),
});
export type ProjectFrontmatter = z.infer<typeof ProjectFrontmatter>;

/** Frontmatter plus everything derived at read time. */
export type Project = Omit<ProjectFrontmatter, "cover" | "coverAlt"> & {
  slug: string;
  cover: Media;
  body: string;
};

export const SKILL_CATEGORIES = [
  "Languages",
  "Frameworks",
  "Tools",
  "Design",
] as const;

export const Skill = z.object({
  name: z.string().min(1),
  category: z.enum(SKILL_CATEGORIES),
  years: z.number().positive().optional(),
});
export type Skill = z.infer<typeof Skill>;
