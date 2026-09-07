// import { ProjectShowcase } from "@/components/ui/project-showcase"
import { projects } from "@/data/projects"
import { ProjectCard } from "@/components/common/ProjectCard"
import { SectionHeader } from "@/components/common/SectionHeader"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

export function Projects() {
    return (
        <section id="projects" className="container space-y-8 py-12 md:py-24 lg:py-32">
            <SectionHeader
                title="Projects"
                subtitle="Check out some of my recent work."
            />

            <div className="px-12">
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-4">
                        {projects.map((project) => (
                            <CarouselItem key={project.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                <div className="h-full">
                                    <ProjectCard project={project} />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        </section>
    )
}
