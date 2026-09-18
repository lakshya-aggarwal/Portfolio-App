import { Hero } from "@/components/sections/Hero";
import { Experience } from "@/components/sections/Experience";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";

/**
 * L6 - the route. A single-page portfolio: hero, experience (+ open source),
 * about, contact. All content is static (src/lib/profile.ts), so there is no
 * filesystem access and every section prerenders.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Experience />
      <About />
      <Contact />
    </>
  );
}
