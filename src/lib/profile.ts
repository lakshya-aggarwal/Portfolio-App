/**
 * L1 - profile content. Static data drawn from the resume and public GitHub, so
 * it needs no filesystem access and is safe to import anywhere. One source of
 * truth for the page; edit here, not in the components.
 */

/** One title held within an org - a promotion produces a new entry. */
export type Position = {
  role: string;
  period: string;
  blurb: string;
  points: string[];
  tags: string[];
};

export type Experience = {
  org: string;
  /** Combined span shown as the timeline's sticky label. */
  period: string;
  location: string;
  /** Most recent first. Multiple positions render as one timeline tile. */
  positions: Position[];
};

export type Repo = {
  name: string;
  href: string;
  note: string;
  language: string;
  /** Optional local screenshot for the showcase hover preview, e.g.
   *  "/showcase/pdol-demo.jpg". Drop the file in public/showcase/ and set this;
   *  until then the showcase renders a themed fallback panel. No external URLs. */
  image?: string;
};

export const about =
  "I'm a software engineer at Adobe, where I build demos and proofs-of-concept for enterprise Adobe tools and increasingly lean on AI to push what they can do. I'm a certified AEM Forms developer, and before Adobe I shipped a multi-locale CMS for Royal Enfield, an Android music app, and a handful of Django backends. I like turning fuzzy requirements into things people can actually use.";

export const experience: Experience[] = [
  {
    org: "Adobe",
    period: "Sep 2021 — Present",
    location: "Noida, India",
    positions: [
      {
        role: "Apps/Sys Engineer 3",
        period: "Feb 2026 — Present",
        blurb:
          "Developing solutions that showcase Adobe's enterprise tools and enhance user experience.",
        points: [
          "Create engaging demos and proofs-of-concept to highlight new features and capabilities.",
          "Use AI technologies to improve application functionality and appeal.",
          "Work closely with cross-functional teams to ensure project alignment and success.",
        ],
        tags: ["AEM", "AI"],
      },
      {
        role: "Apps/Sys Engineer",
        period: "Jun 2025 — Feb 2026",
        blurb:
          "Building demos and POCs that showcase enterprise Adobe capabilities.",
        points: [
          "Developed demos and POCs highlighting the latest features of enterprise Adobe tools.",
          "Leveraged AI technologies to enhance application functionality and appeal.",
          "Collaborated with cross-functional teams to align on project goals and deliverables.",
        ],
        tags: ["AEM", "AI"],
      },
      {
        role: "Solutions Consultant",
        period: "Sep 2021 — Jun 2025",
        blurb:
          "Supported enterprise AEM solutions, drawing on AEM, Python, and Java to meet organizational goals.",
        points: [],
        tags: ["AEM", "Java", "Python"],
      },
    ],
  },
  {
    org: "TechChefz (TCZ Digital)",
    period: "2019 — 2021",
    location: "New Delhi, India",
    positions: [
      {
        role: "Senior Associate Technology",
        period: "2019 — 2021",
        blurb:
          "AEM delivery on the Royal Enfield account — a multi-locale, multi-lingual, omni-channel CMS.",
        points: [
          "Spearheaded the AEM 6.3 → 6.5 migration and GDPR-compliance work.",
          "Built custom templated email and PDF-builder modules reused across projects.",
          "Delivered a multi-locale, multi-lingual CMS improving engagement and accessibility.",
        ],
        tags: ["AEM", "Java", "CMS"],
      },
    ],
  },
  {
    org: "Ziasy Technologies",
    period: "2018",
    location: "Remote",
    positions: [
      {
        role: "Mobile Application Developer",
        period: "2018",
        blurb: "KhaZaaNa — an Android karaoke app with real-time lyrics and recording.",
        points: [
          "Built the music player with a synchronized lyrics scroller.",
          "Added simultaneous audio-and-video recording.",
        ],
        tags: ["Android", "Java"],
      },
    ],
  },
  {
    org: "Saathi Re",
    period: "2018",
    location: "Gurgaon, India",
    positions: [
      {
        role: "Software Engineer (Backend)",
        period: "2018",
        blurb: "Django backends and automation for an early-stage startup.",
        points: [
          "Built Django modules: a social-link web scraper and an Elasticsearch log analyzer.",
          "Automated WordPress site creation from Google Forms.",
        ],
        tags: ["Python", "Django"],
      },
    ],
  },
];

export const certifications: string[] = [
  "Adobe Certified Expert — AEM Forms Developer",
];

export const repos: Repo[] = [
  {
    name: "pdol-demo",
    href: "https://github.com/lakshya-aggarwal/pdol-demo",
    note: "Storefront commerce demo on Edge Delivery Services + Adobe Commerce drop-ins.",
    language: "JavaScript",
  },
  {
    name: "pdol-aem-site",
    href: "https://github.com/lakshya-aggarwal/pdol-aem-site",
    note: "AEM site scaffold for the PDOL demo storefront.",
    language: "JavaScript",
  },
  {
    name: "rules-engine-editor",
    href: "https://github.com/lakshya-aggarwal/rules-engine-editor",
    note: "Visual editor for authoring JSON rule sets.",
    language: "JavaScript",
  },
  {
    name: "adobe-app-builder-api-mesh-demo",
    href: "https://github.com/lakshya-aggarwal/adobe-app-builder-api-mesh-demo",
    note: "App Builder demo wiring services together through API Mesh.",
    language: "JavaScript",
  },
  {
    name: "BEProject",
    href: "https://github.com/lakshya-aggarwal/BEProject",
    note: "Final-year Android speech-recognition app (published in IJRITCC).",
    language: "Android",
  },
];
