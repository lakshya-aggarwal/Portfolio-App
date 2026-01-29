import { ProjectCard } from "@/components/common/ProjectCard"
import { SectionHeader } from "@/components/common/SectionHeader"
import { projects } from "@/data/projects"

export function Projects() {
    return (
        <section id="projects" className="container space-y-8 py-12 md:py-24 lg:py-32">
            <SectionHeader
                title="Projects"
                subtitle="Check out some of my recent work."
            />
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </section>
    )
}
