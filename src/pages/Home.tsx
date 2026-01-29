import { Hero } from "@/sections/Hero"
import { About } from "@/sections/About"
import { Skills } from "@/sections/Skills"
import { Projects } from "@/sections/Projects"
import { Contact } from "@/sections/Contact"

export function Home() {
    return (
        <main className="flex flex-col">
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Contact />
        </main>
    )
}
