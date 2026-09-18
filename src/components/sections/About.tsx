import { Reveal } from "@/motion/Reveal";
import { about } from "@/lib/profile";

// Certifications are intentionally not rendered yet - pending a badge/link
// treatment. The data still lives in src/lib/profile.ts (certifications).
export function About() {
  return (
    <section id="about" className="shell border-t border-line py-20 md:py-28">
      <p className="kicker">about</p>
      <h2 className="mt-2 font-display text-h2 uppercase">The short version</h2>
      <Reveal as="p" className="mt-6 max-w-[58ch] text-lead text-ink-dim">
        {about}
      </Reveal>
    </section>
  );
}
