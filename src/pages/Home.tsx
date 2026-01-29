import PortfolioHero from "@/components/ui/portfolio-hero"
import { About } from "@/sections/About"
import { Skills } from "@/sections/Skills"
import { Projects } from "@/sections/Projects"
import { Contact } from "@/sections/Contact"

export function Home() {
    return (
        <main className="flex flex-col">
            <PortfolioHero />
            <About />
            <Skills />
            <Projects />
            <Contact />
        </main>
    )
}
