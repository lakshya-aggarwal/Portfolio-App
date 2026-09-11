import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { CursorRibbon } from "@/components/site/CursorRibbon";
import { site } from "@/lib/site";

/**
 * L6 - the shell. Owns fonts, theme boot, nav and footer. Everything below
 * receives data and tokens; nothing below reaches for a global.
 *
 * All three faces - display "balboa", script "shadows-into-light", and body
 * "poppins" - come from the Adobe Fonts (Typekit) kit linked in <head>. The
 * @theme block in globals.css maps them to --font-display / --font-script /
 * --font-body, so no next/font loader is needed for any of them.
 */

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
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0d" },
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/sam4epv.css" />
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <CursorRibbon />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
