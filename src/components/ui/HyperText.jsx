import { useEffect, useRef, useState, useCallback } from "react"
import { cn } from "@/lib/utils"

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"

function scramble(target, progress) {
  return target
    .split("")
    .map((char, i) => {
      if (char === " ") return " "
      const resolved = i / target.length <= progress
      if (resolved) return char
      return CHARS[Math.floor(Math.random() * CHARS.length)]
    })
    .join("")
}

export function HyperText({
  children,
  duration = 800,
  delay = 0,
  className,
  startOnView = true,
  animateOnHover = true,
}) {
  const [displayed, setDisplayed] = useState(children)
  const [isAnimating, setIsAnimating] = useState(false)
  const rafRef = useRef(null)
  const containerRef = useRef(null)
  const hasAnimated = useRef(false)

  const runScramble = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)

    const start = performance.now()
    const target = children

    const step = (now) => {
      const elapsed = now - start - delay
      if (elapsed < 0) {
        rafRef.current = requestAnimationFrame(step)
        return
      }
      const progress = Math.min(elapsed / duration, 1)
      setDisplayed(scramble(target, progress))

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        setDisplayed(target)
        setIsAnimating(false)
      }
    }

    rafRef.current = requestAnimationFrame(step)
  }, [children, duration, delay, isAnimating])

  useEffect(() => {
    if (!startOnView) {
      runScramble()
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true
            runScramble()
          }
        })
      },
      { threshold: 0.1 }
    )

    if (containerRef.current) observer.observe(containerRef.current)

    return () => {
      observer.disconnect()
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startOnView])

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <span
      ref={containerRef}
      className={cn("inline-block font-mono", className)}
      onMouseEnter={() => {
        if (animateOnHover) runScramble()
      }}
      style={{ letterSpacing: "0.02em" }}
    >
      {displayed}
    </span>
  )
}
