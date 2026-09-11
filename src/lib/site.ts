/**
 * Identity, links and nav in one place, so a changed handle is a one-line diff.
 * Richer profile data (experience, repos) lives in ./profile.ts.
 */
export const site = {
  name: "Lakshya Aggarwal",
  role: "Software Engineer",
  description:
    "Software engineer at Adobe building enterprise experiences on AEM, full-stack web apps, and Android.",
  url: "https://lakshya.dev",
  email: "lakshya.a753@gmail.com",
  resume: "/resume.pdf",
  socials: [
    { label: "GitHub", href: "https://github.com/lakshya-aggarwal" },
    { label: "LinkedIn", href: "https://linkedin.com/in/lakshyaaggarwal" },
  ],
  nav: [
    { label: "Work", href: "/#work" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
  ],
} as const;
