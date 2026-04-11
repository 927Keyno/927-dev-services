// src/components/ui/ScrollReveal.jsx
import { useRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"

/**
 * Wrapper that fades/slides children in when scrolled into view.
 * Uses IntersectionObserver + CSS transitions (no GSAP dependency).
 *
 * Props:
 *   children   — any React children
 *   className  — class applied to wrapper div
 *   direction  — "up" | "down" | "left" | "right" (default "up")
 *   delay      — delay in seconds (default 0)
 *   style      — inline styles
 */
export function ScrollReveal({
  children,
  className = "",
  direction = "up",
  delay = 0,
  style = {},
}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const transforms = {
    up: "translateY(30px)",
    down: "translateY(-30px)",
    left: "translateX(-30px)",
    right: "translateX(30px)",
  }

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translate(0)" : transforms[direction],
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
