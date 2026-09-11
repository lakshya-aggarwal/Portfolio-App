/**
 * L1 - profile content. Static data drawn from the resume and public GitHub, so
 * it needs no filesystem access and is safe to import anywhere. One source of
 * truth for the page; edit here, not in the components.
 */

export type Experience = {
  org: string;
  role: string;
  period: string;
  location: string;
  blurb: string;
  points: string[];
  tags: string[];
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
  "I'm a software engineer at Adobe, where I build demos and proofs-of-concept for enterprise Adobe tools and increasingly lean on AI to push what they can do. I'm a certified AEM and AEM Forms developer, and before Adobe I shipped a multi-locale CMS for Royal Enfield, an Android music app, and a handful of Django backends. I like turning fuzzy requirements into things people can actually use.";

export const experience: Experience[] = [
  {
    org: "Adobe",
    role: "Apps/Sys Engineer · Solutions Consultant",
    period: "2021 — Present",
    location: "Noida, India",
    blurb:
      "Building demos and POCs that showcase enterprise Adobe capabilities, and consulting on AEM solutions.",
    points: [
      "Build demos and proofs-of-concept highlighting the latest enterprise Adobe features.",
      "Use AI to extend what those applications can do and how they present.",
      "Consult on AEM solutions and align delivery across cross-functional teams.",
    ],
    tags: ["AEM", "Java", "Python", "AI"],
  },
  {
    org: "TechChefz (TCZ Digital)",
    role: "Senior Associate Technology",
    period: "2019 — 2021",
    location: "New Delhi, India",
    blurb:
      "AEM delivery on the Royal Enfield account — a multi-locale, multi-lingual, omni-channel CMS.",
    points: [
      "Spearheaded the AEM 6.3 → 6.5 migration and GDPR-compliance work.",
      "Built custom templated email and PDF-builder modules reused across projects.",
      "Delivered a multi-locale, multi-lingual CMS improving engagement and accessibility.",
    ],
    tags: ["AEM", "Java", "CMS"],
  },
  {
    org: "Ziasy Technologies",
    role: "Mobile Application Developer",
    period: "2018",
    location: "Remote",
    blurb: "KhaZaaNa — an Android karaoke app with real-time lyrics and recording.",
    points: [
      "Built the music player with a synchronized lyrics scroller.",
      "Added simultaneous audio-and-video recording.",
    ],
    tags: ["Android", "Java"],
  },
  {
    org: "Saathi Re",
    role: "Software Engineer (Backend)",
    period: "2018",
    location: "Gurgaon, India",
    blurb: "Django backends and automation for an early-stage startup.",
    points: [
      "Built Django modules: a social-link web scraper and an Elasticsearch log analyzer.",
      "Automated WordPress site creation from Google Forms.",
    ],
    tags: ["Python", "Django"],
  },
];

export const certifications: string[] = [
  "Adobe Certified Expert — AEM Sites Developer",
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
