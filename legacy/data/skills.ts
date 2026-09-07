export type Skill = {
    name: string;
    category: "Languages" | "Frameworks" | "Tools" | "Design";
};

export const skills: Skill[] = [
    { name: "TypeScript", category: "Languages" },
    { name: "JavaScript", category: "Languages" },
    { name: "React", category: "Frameworks" },
    { name: "Next.js", category: "Frameworks" },
    { name: "Tailwind CSS", category: "Frameworks" },
    { name: "Node.js", category: "Frameworks" },
    { name: "Git", category: "Tools" },
    { name: "Docker", category: "Tools" },
    { name: "Figma", category: "Design" },
    { name: "PostgreSQL", category: "Tools" },
];
