import { useRef } from "react"

export function TiltCard({ children, className, style }) {
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / 12) * -1
    const rotateY = (x - centerX) / 12
    el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
  }

  const handleMouseLeave = () => {
    const el = cardRef.current
    if (!el) return
    el.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)"
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        transition: "transform 0.15s ease",
        transformStyle: "preserve-3d",
        willChange: "transform",
        ...style,
      }}
    >
      {children}
    </div>
  )
}
