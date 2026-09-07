import { Hero } from "@/components/sections/Hero";
import { StackWork } from "@/components/sections/StackWork";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { getProjects, getSkills, getUsedTech } from "@/lib/content";

/**
 * L6 — the route reads content and hands it down. This is the only layer that
 * touches the filesystem, and the only layer that knows what a "project" is
 * before it becomes props.
 */
export default function HomePage() {
  const projects = getProjects();
  const tech = getUsedTech();
  const skills = getSkills();

  return (
    <>
      <Hero />
      <StackWork projects={projects} tech={tech} skills={skills} />
      <About />
      <Contact />
    </>
  );
}
