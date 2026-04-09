// src/components/ui/Counter.jsx
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

/**
 * Animated number counter — counts from 0 to target when scrolled into view.
 *
 * Props:
 *   target    — number to count to (e.g. 600)
 *   duration  — animation duration in seconds (default 2)
 *   prefix    — string before number (default "")
 *   suffix    — string after number (default "")
 *   className — class on the outer span
 *   start     — ScrollTrigger start position (default "top 85%")
 */
export function Counter({
  target,
  duration = 2,
  prefix = "",
  suffix = "",
  className = "",
  start = "top 85%",
}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obj = { value: 0 }

    const ctx = gsap.context(() => {
      gsap.to(obj, {
        value: target,
        duration,
        ease: "power2.out",
        roundProps: "value",
        onUpdate: () => {
          el.textContent = `${prefix}${obj.value.toLocaleString()}${suffix}`
        },
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play none none none",
        },
      })
    }, el)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target])

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  )
}
