// src/components/ui/ScrollReveal.jsx
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

/**
 * Wrapper that fades/slides children in when scrolled into view.
 *
 * Props:
 *   children   — any React children
 *   className  — class applied to wrapper div
 *   direction  — "up" | "down" | "left" | "right" (default "up")
 *   distance   — pixels to travel (default 40)
 *   delay      — delay in seconds (default 0)
 *   duration   — animation duration (default 0.8)
 *   start      — ScrollTrigger start (default "top 85%")
 *   once       — only play once (default true)
 */
export function ScrollReveal({
  children,
  className = "",
  style = {},
  direction = "up",
  distance = 40,
  delay = 0,
  duration = 0.8,
  start = "top 85%",
  once = true,
}) {
  const ref = useRef(null)

  const getFromVars = () => {
    const base = { opacity: 0 }
    switch (direction) {
      case "up":    return { ...base, y: distance }
      case "down":  return { ...base, y: -distance }
      case "left":  return { ...base, x: distance }
      case "right": return { ...base, x: -distance }
      default:      return { ...base, y: distance }
    }
  }

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.from(el, {
        ...getFromVars(),
        duration,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: once ? "play none none none" : "play none none reverse",
        },
      })
    }, el)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  )
}
