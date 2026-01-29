import React from "react"
import { cn } from "@/lib/utils"

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string
    subtitle?: string
}

export function SectionHeader({
    title,
    subtitle,
    className,
    ...props
}: SectionHeaderProps) {
    return (
        <div className={cn("flex flex-col gap-2 pb-8", className)} {...props}>
            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>
    )
}
