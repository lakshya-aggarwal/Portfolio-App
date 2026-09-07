export type Project = {
    id: number;
    title: string;
    description: string;
    techStack: string[];
    githubUrl: string;
    liveUrl?: string; // Optional
    image?: string; // Added image property
};

export const projects: Project[] = [
    {
        id: 1,
        title: "Lumina",
        description: "AI-powered design system generator. Create consistent design tokens and components in seconds.",
        techStack: ["React", "TypeScript", "OpenAI"],
        githubUrl: "#",
        image: "https://plus.unsplash.com/premium_photo-1723489242223-865b4a8cf7b8?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D$0",
    },
    {
        id: 2,
        title: "Flux",
        description: "Real-time collaboration platform for creative teams to brainstorm and iterate together.",
        techStack: ["Next.js", "WebSockets", "Tailwind"],
        githubUrl: "#",
        image: "https://images.unsplash.com/photo-1530435460869-d13625c69bbf?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D$0",
    },
    {
        id: 3,
        title: "Prism",
        description: "Advanced color palette extraction tool that generates accessible schemes from any image.",
        techStack: ["React", "Canvas API", "Color.js"],
        githubUrl: "#",
        image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        id: 4,
        title: "Vertex",
        description: "3D modeling toolkit for the web, enabling low-poly asset creation directly in the browser.",
        techStack: ["Three.js", "WebGL", "React Three Fiber"],
        githubUrl: "#",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
];
