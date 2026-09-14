"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ArrowUpRight } from "lucide-react"

// Vendored from 21st.dev (@jatin-yadav05 / project-showcase). Kept as a
// self-contained file - no registry URL - so upstream changes never affect us.
// Adapted to be data-driven (items prop), to render a themed fallback panel when
// an item has no local image, and to use the house semantic utilities.
//
// The cursor-following preview is driven imperatively: the target/smoothed
// positions live in refs and are written straight to the preview element's
// style inside a rAF loop that only runs while an item is hovered. React state
// holds only `hoveredIndex` (what actually changes the rendered markup), so the
// component does not re-render per animation frame.

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
  const isVisible = hoveredIndex !== null

  const containerRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  // Cursor target + smoothed position (relative to the container), and the
  // container's viewport origin - all refs so updating them never re-renders.
  const target = useRef({ x: 0, y: 0 })
  const smooth = useRef({ x: 0, y: 0 })
  const origin = useRef({ left: 0, top: 0 })

  // The rAF loop runs ONLY while something is hovered; it eases `smooth` toward
  // `target` and writes position straight to the preview node.
  useEffect(() => {
    if (!isVisible) return
    const lerp = (a: number, b: number, f: number) => a + (b - a) * f
    let raf = 0
    const animate = () => {
      smooth.current.x = lerp(smooth.current.x, target.current.x, 0.15)
      smooth.current.y = lerp(smooth.current.y, target.current.y, 0.15)
      const el = previewRef.current
      if (el) {
        el.style.left = `${origin.current.left}px`
        el.style.top = `${origin.current.top}px`
        el.style.transform = `translate3d(${smooth.current.x + 20}px, ${smooth.current.y - 100}px, 0)`
      }
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [isVisible])

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    origin.current = { left: rect.left, top: rect.top }
    target.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  return (
    <div ref={containerRef} onMouseMove={handleMouseMove} className="relative w-full">
      {/* Cursor-following preview (position written imperatively in the rAF loop) */}
      <div
        ref={previewRef}
        className="pointer-events-none fixed z-50 hidden overflow-hidden rounded-xl shadow-2xl md:block"
        style={{
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0.8,
          transition: "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), scale 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div className="relative h-[180px] w-[280px] overflow-hidden rounded-xl bg-surface">
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
          <div className="absolute inset-0 bg-gradient-to-t from-ground/20 to-transparent" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
        {items.map((item, index) => {
          const external = item.href.startsWith("http")
          return (
            <a
              key={item.title}
              href={item.href}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer" : undefined}
              className="group block"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="relative border-t border-line py-5 transition-all duration-300 ease-out">
                <div
                  className={`absolute inset-0 -mx-4 rounded-lg bg-surface/50 px-4 transition-all duration-300 ease-out ${
                    hoveredIndex === index ? "scale-100 opacity-100" : "scale-95 opacity-0"
                  }`}
                />

                <div className="relative flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="inline-flex items-center gap-2">
                      <h3 className="text-lg font-medium tracking-tight text-ink">
                        <span className="relative">
                          {item.title}
                          <span
                            className={`absolute -bottom-0.5 left-0 h-px bg-ink transition-all duration-300 ease-out ${
                              hoveredIndex === index ? "w-full" : "w-0"
                            }`}
                          />
                        </span>
                      </h3>
                      <ArrowUpRight
                        className={`h-4 w-4 text-ink-dim transition-all duration-300 ease-out ${
                          hoveredIndex === index
                            ? "translate-x-0 translate-y-0 opacity-100"
                            : "-translate-x-2 translate-y-2 opacity-0"
                        }`}
                      />
                    </div>

                    <p
                      className={`mt-1 text-sm leading-relaxed transition-all duration-300 ease-out ${
                        hoveredIndex === index ? "text-ink/70" : "text-ink-dim"
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>

                  <span
                    className={`font-mono text-xs tabular-nums text-ink-dim transition-all duration-300 ease-out ${
                      hoveredIndex === index ? "text-ink/60" : ""
                    }`}
                  >
                    {item.meta}
                  </span>
                </div>
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}
