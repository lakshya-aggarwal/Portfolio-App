import { Button } from "@/components/ui/button"
import { ArrowDown, FileText } from "lucide-react"

export function Hero() {
    return (
        <section className="container flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-8 py-24 text-center md:py-32">
            <div className="space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                    Hi, I'm <span className="text-primary">Lakshya</span>
                </h1>
                <h2 className="text-2xl font-medium text-muted-foreground sm:text-3xl">
                    Full Stack Developer
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                    I build accessible, pixel-perfect, performant, and reliable web applications.
                </p>
            </div>
            <div className="flex space-x-4">
                <Button size="lg" asChild>
                    <a href="#projects">
                        View Projects
                        <ArrowDown className="ml-2 h-4 w-4" />
                    </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                    <a href="/resume.pdf" download>
                        Download Resume
                        <FileText className="ml-2 h-4 w-4" />
                    </a>
                </Button>
            </div>
        </section>
    )
}
