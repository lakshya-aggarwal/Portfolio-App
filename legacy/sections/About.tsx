import { SectionHeader } from "@/components/common/SectionHeader"

export function About() {
    return (
        <section id="about" className="container space-y-8 py-12 md:py-24 lg:py-32">
            <SectionHeader title="About Me" subtitle="A little bit about who I am." />
            <div className="flex flex-col gap-8 md:flex-row md:gap-12">
                <div className="flex-1 space-y-4 text-muted-foreground">
                    <p>
                        I'm a passionate Full Stack Developer with experience in building
                        modern web applications. I love creating elegant solutions to complex
                        problems and am always eager to learn new technologies.
                    </p>
                    <p>
                        My journey started when I built my first website for a school project,
                        and since then, I've been hooked on the infinite possibilities of code.
                    </p>
                    <p>
                        When I'm not coding, I enjoy reading tech blogs, contributing to
                        open-source projects, and exploring new coffee shops.
                    </p>
                </div>
            </div>
        </section>
    )
}
