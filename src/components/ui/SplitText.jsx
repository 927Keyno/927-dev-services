// src/components/ui/SplitText.jsx
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

/**
 * GSAP-powered text split animation.
 * Splits text into word spans, animates them in with stagger on scroll.
 *
 * Props:
 *   children  — string text content
 *   className — class applied to the outer wrapper
 *   tag       — HTML tag for wrapper (default "p")
 *   stagger   — delay between each word (default 0.05)
 *   from      — direction: "bottom" | "top" | "left" | "right" (default "bottom")
 *   delay     — initial delay before animation starts (default 0)
 *   duration  — animation duration per word (default 0.7)
 *   start     — ScrollTrigger start position (default "top 85%")
 *   once      — only play once (default true)
 */
export function SplitText({
  children,
  className = "",
  tag: Tag = "p",
  stagger = 0.05,
  from = "bottom",
  delay = 0,
  duration = 0.7,
  start = "top 85%",
  once = true,
}) {
  const wrapperRef = useRef(null)

  // Build the from/to values based on direction
  const getFromVars = () => {
    const base = { opacity: 0, duration, ease: "power3.out" }
    switch (from) {
      case "bottom": return { ...base, y: 40 }
      case "top":    return { ...base, y: -40 }
      case "left":   return { ...base, x: -40 }
      case "right":  return { ...base, x: 40 }
      default:       return { ...base, y: 40 }
    }
  }

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return

    // Split text into word spans
    const text = el.textContent || ""
    const words = text.split(" ")
    el.innerHTML = words
      .map((word) => `<span class="split-word" style="display:inline-block; overflow:hidden; vertical-align:bottom;"><span class="split-inner" style="display:inline-block;">${word}</span></span>`)
      .join(" ")

    const wordSpans = el.querySelectorAll(".split-inner")

    const ctx = gsap.context(() => {
      gsap.from(wordSpans, {
        ...getFromVars(),
        stagger,
        delay,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: once ? "play none none none" : "play none none reverse",
        },
      })
    }, el)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children])

  return (
    <Tag ref={wrapperRef} className={className}>
      {children}
    </Tag>
  )
}
