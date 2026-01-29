export type Project = {
    id: number;
    title: string;
    description: string;
    techStack: string[];
    githubUrl: string;
    liveUrl?: string; // Optional
};

export const projects: Project[] = [
    {
        id: 1,
        title: "E-Commerce Platform",
        description: "A full-featured online store with cart functionality, user authentication, and payment processing.",
        techStack: ["React", "Node.js", "MongoDB", "Stripe"],
        githubUrl: "https://github.com/example/ecommerce",
        liveUrl: "https://example-ecommerce.com",
    },
    {
        id: 2,
        title: "Task Management App",
        description: "A Kanban-style task board for team collaboration with real-time updates.",
        techStack: ["Next.js", "Firebase", "Tailwind CSS"],
        githubUrl: "https://github.com/example/taskmanager",
    },
    {
        id: 3,
        title: "Weather Dashboard",
        description: "Real-time weather tracking application with location search and 5-day forecast.",
        techStack: ["React", "OpenWeatherMap API", "Chart.js"],
        githubUrl: "https://github.com/example/weather-app",
        liveUrl: "https://example-weather.com",
    },
];
