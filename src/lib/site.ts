/**
 * The things that were previously literals scattered across four components.
 * One place, so a changed handle is a one-line diff.
 */
export const site = {
  name: "Lakshya Aggarwal",
  role: "Full Stack Developer",
  description:
    "Full stack developer building accessible, fast, physically-grounded web interfaces.",
  url: "https://lakshya.dev",
  email: "lakshya.a753@gmail.com",
  resume: "/resume.pdf",
  socials: [
    { label: "GitHub", href: "https://github.com/" },
    { label: "LinkedIn", href: "https://linkedin.com/in/" },
  ],
  nav: [
    { label: "Work", href: "/#work" },
    { label: "Stack", href: "/#stack" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
  ],
} as const;
