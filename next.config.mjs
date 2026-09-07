/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Covers are self-hosted under content/. No remote patterns on purpose:
    // hotlinked images were how two project covers ended up 404ing.
    formats: ["image/avif", "image/webp"],
  },
  // View Transitions between the work grid and a case study need React's
  // <ViewTransition>, which ships only on React's experimental channel — not on
  // stable 19.2.x. Left out deliberately rather than half-wired.
  // legacy/ holds the pre-rebuild Vite app for reference. Keep it out of the build.
  outputFileTracingExcludes: {
    "*": ["./legacy/**"],
  },
};

export default nextConfig;
