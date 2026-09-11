import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { site } from "@/lib/site";

/**
 * L6 - the shell. Owns fonts, theme boot, nav and footer. Everything below
 * receives data and tokens; nothing below reaches for a global.
 *
 * Display "balboa" and script "shadows-into-light" come from the Adobe Fonts
 * (Typekit) kit linked in <head>; body is self-hosted Hanken Grotesk via
 * next/font. The @theme block in globals.css maps these to --font-display /
 * --font-script / --font-body.
 */
const body = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} - ${site.role}`,
    template: `%s - ${site.name}`,
  },
  description: site.description,
  authors: [{ name: site.name, url: site.url }],
  openGraph: {
    type: "website",
    url: site.url,
    title: `${site.name} - ${site.role}`,
    description: site.description,
    siteName: site.name,
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#16110c" },
    { media: "(prefers-color-scheme: light)", color: "#eef1f5" },
  ],
};

/** Applies the stored theme before first paint so the toggle never flashes. */
const themeBoot = `try{const t=localStorage.getItem("theme");if(t)document.documentElement.dataset.theme=t}catch{}`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={body.variable}
      suppressHydrationWarning
    >
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/sam4epv.css" />
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
