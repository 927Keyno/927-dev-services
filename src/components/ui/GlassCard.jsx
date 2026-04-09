// src/components/ui/GlassCard.jsx
import { useRef } from "react"
import { clsx } from "clsx"

/**
 * Glass-morphism card with purple border glow.
 *
 * Props:
 *   children  — card content
 *   className — additional classes
 *   hover     — boolean, enables hover tilt + glow intensification (default true)
 *   style     — inline style overrides
 */
export function GlassCard({ children, className = "", hover = true, style = {} }) {
  const cardRef = useRef(null)

  const handleMouseMove = hover
    ? (e) => {
        const el = cardRef.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        const rotateX = ((y - centerY) / 20) * -1
        const rotateY = (x - centerX) / 20

        // Dynamic glow follows cursor
        const glowX = (x / rect.width) * 100
        const glowY = (y / rect.height) * 100
        el.style.background = `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(147,51,234,0.08) 0%, rgba(20,20,20,0.95) 60%)`
        el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`
      }
    : undefined

  const handleMouseLeave = hover
    ? () => {
        const el = cardRef.current
        if (!el) return
        el.style.background = "rgba(20, 20, 20, 0.95)"
        el.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)"
      }
    : undefined

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={clsx(
        "relative rounded-2xl border p-6",
        "transition-[transform,box-shadow,background] duration-200",
        className
      )}
      style={{
        background: "rgba(20, 20, 20, 0.95)",
        borderColor: "rgba(147, 51, 234, 0.2)",
        boxShadow: "0 0 0 1px rgba(147, 51, 234, 0.1), inset 0 1px 0 rgba(255,255,255,0.04)",
        transformStyle: hover ? "preserve-3d" : undefined,
        willChange: hover ? "transform" : undefined,
        ...style,
      }}
    >
      {/* Top edge highlight */}
      <div
        className="absolute inset-x-0 top-0 h-px rounded-t-2xl"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(147,51,234,0.4), transparent)",
        }}
        aria-hidden
      />
      {children}
    </div>
  )
}
