import PortfolioHero from "@/components/ui/portfolio-hero"
import { PersonalLanding } from "@/components/ui/personal-landing"
import { Skills } from "@/sections/Skills"
import { Projects } from "@/sections/Projects"
import { Contact } from "@/sections/Contact"

export function Home() {
    return (
        <main className="flex flex-col">
            <PortfolioHero />
            <PersonalLanding />
            <Skills />
            <Projects />
            <Contact />
        </main>
    )
}
