import { SectionHeader } from "@/components/common/SectionHeader"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { skills, type Skill } from "@/data/skills"

export function Skills() {
    const categories = Array.from(new Set(skills.map((s) => s.category)))

    return (
        <section id="skills" className="container space-y-8 py-12 md:py-24 lg:py-32 bg-slate-50 dark:bg-slate-950/50">
            <SectionHeader title="Skills" subtitle="The technologies I work with." />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {categories.map((category) => (
                    <Card key={category}>
                        <CardHeader>
                            <CardTitle>{category}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            {skills
                                .filter((skill: Skill) => skill.category === category)
                                .map((skill: Skill) => (
                                    <Badge key={skill.name} variant="secondary">
                                        {skill.name}
                                    </Badge>
                                ))}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    )
}
