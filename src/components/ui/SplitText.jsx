// src/components/ui/SplitText.jsx
import { useRef, useState, useEffect } from "react"

/**
 * Text reveal animation using IntersectionObserver + CSS transitions.
 * No GSAP dependency — works reliably in any scroll container.
 */
export function SplitText({
  children,
  className = "",
  tag: Tag = "p",
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

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
        ...style,
      }}
    >
      {children}
    </Tag>
  )
}
