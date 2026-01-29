import { Mail, Linkedin, Github } from "lucide-react"

import { SectionHeader } from "@/components/common/SectionHeader"
import { Button } from "@/components/ui/button"

export function Contact() {
    return (
        <section id="contact" className="container space-y-8 py-12 md:py-24 lg:py-32 bg-slate-50 dark:bg-slate-950/50">
            <SectionHeader
                title="Get in Touch"
                subtitle="Feel free to reach out for collaborations or just a friendly hello."
            />
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <a
                    href="mailto:user@example.com"
                    className="text-2xl font-medium text-primary hover:underline"
                >
                    user@example.com
                </a>
                <div className="flex space-x-4">
                    <Button variant="outline" size="icon" asChild>
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="GitHub"
                        >
                            <Github className="h-5 w-5" />
                        </a>
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                        <a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="LinkedIn"
                        >
                            <Linkedin className="h-5 w-5" />
                        </a>
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                        <a href="mailto:user@example.com" aria-label="Email">
                            <Mail className="h-5 w-5" />
                        </a>
                    </Button>
                </div>
            </div>
        </section>
    )
}
