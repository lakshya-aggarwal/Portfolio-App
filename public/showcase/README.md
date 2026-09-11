# Showcase images

Local screenshots for the GitHub showcase hover preview
(`src/components/ui/project-showcase.tsx`). No external URLs.

To add an image for a repo:

1. Drop a `.jpg`/`.png`/`.webp` here (a 280×180-ish crop looks best), e.g.
   `pdol-demo.jpg`.
2. Set the `image` field on that repo in `src/lib/profile.ts`, e.g.
   `image: "/showcase/pdol-demo.jpg"`.

Until a repo has an `image`, the showcase renders a themed fallback panel with
the repo name and language.
