"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ArrowUpRight } from "lucide-react"

// Vendored from 21st.dev (@jatin-yadav05 / project-showcase). Kept as a
// self-contained file - no registry URL - so upstream changes never affect us.
// Adapted to be data-driven (items prop) and to render a themed fallback panel
// when an item has no local image, so it works with content that has no cover.

export interface ShowcaseItem {
  title: string
  description: string
  /** Right-aligned meta (e.g. year or language). */
  meta: string
  href: string
  /** Optional local image path, e.g. "/showcase/foo.jpg". No external URLs. */
  image?: string
}

export function ProjectShowcase({ items }: { items: ShowcaseItem[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 })
  // The container's viewport origin, captured in the move handler (never read
  // from the ref during render, which react-hooks/refs forbids).
  const [origin, setOrigin] = useState({ left: 0, top: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor
    }

    const animate = () => {
      setSmoothPosition((prev) => ({
        x: lerp(prev.x, mousePosition.x, 0.15),
        y: lerp(prev.y, mousePosition.y, 0.15),
      }))
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [mousePosition])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setOrigin({ left: rect.left, top: rect.top })
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index)
    setIsVisible(true)
  }

  const handleMouseLeave = () => {
    setHoveredIndex(null)
    setIsVisible(false)
  }

  return (
    <div ref={containerRef} onMouseMove={handleMouseMove} className="relative w-full max-w-2xl">
      {/* Cursor-following preview */}
      <div
        className="pointer-events-none fixed z-50 hidden overflow-hidden rounded-xl shadow-2xl md:block"
        style={{
          left: origin.left,
          top: origin.top,
          transform: `translate3d(${smoothPosition.x + 20}px, ${smoothPosition.y - 100}px, 0)`,
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0.8,
          transition: "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), scale 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div className="relative h-[180px] w-[280px] overflow-hidden rounded-xl bg-secondary">
          {items.map((item, index) =>
            item.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={item.title}
                src={item.image}
                alt={item.title}
                className="absolute inset-0 h-full w-full object-cover transition-all duration-500 ease-out"
                style={{
                  opacity: hoveredIndex === index ? 1 : 0,
                  scale: hoveredIndex === index ? 1 : 1.1,
                  filter: hoveredIndex === index ? "none" : "blur(10px)",
                }}
              />
            ) : (
              // Fallback when no local image yet: a themed panel with the title.
              <div
                key={item.title}
                className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-accent/25 to-surface transition-opacity duration-500 ease-out"
                style={{ opacity: hoveredIndex === index ? 1 : 0 }}
              >
                <span className="font-display text-2xl uppercase text-ink">{item.title}</span>
                <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ink-dim">
                  {item.meta}
                </span>
              </div>
            ),
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
        </div>
      </div>

      <div className="space-y-0">
        {items.map((item, index) => {
          const external = item.href.startsWith("http")
          return (
            <a
              key={item.title}
              href={item.href}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer" : undefined}
              className="group block"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="relative border-t border-border py-5 transition-all duration-300 ease-out">
                <div
                  className={`absolute inset-0 -mx-4 rounded-lg bg-secondary/50 px-4 transition-all duration-300 ease-out ${
                    hoveredIndex === index ? "scale-100 opacity-100" : "scale-95 opacity-0"
                  }`}
                />

                <div className="relative flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="inline-flex items-center gap-2">
                      <h3 className="text-lg font-medium tracking-tight text-foreground">
                        <span className="relative">
                          {item.title}
                          <span
                            className={`absolute -bottom-0.5 left-0 h-px bg-foreground transition-all duration-300 ease-out ${
                              hoveredIndex === index ? "w-full" : "w-0"
                            }`}
                          />
                        </span>
                      </h3>
                      <ArrowUpRight
                        className={`h-4 w-4 text-muted-foreground transition-all duration-300 ease-out ${
                          hoveredIndex === index
                            ? "translate-x-0 translate-y-0 opacity-100"
                            : "-translate-x-2 translate-y-2 opacity-0"
                        }`}
                      />
                    </div>

                    <p
                      className={`mt-1 text-sm leading-relaxed transition-all duration-300 ease-out ${
                        hoveredIndex === index ? "text-foreground/70" : "text-muted-foreground"
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>

                  <span
                    className={`font-mono text-xs tabular-nums text-muted-foreground transition-all duration-300 ease-out ${
                      hoveredIndex === index ? "text-foreground/60" : ""
                    }`}
                  >
                    {item.meta}
                  </span>
                </div>
              </div>
            </a>
          )
        })}
        <div className="border-t border-border" />
      </div>
    </div>
  )
}
