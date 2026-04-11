import { useCallback } from "react"
import { motion, useMotionTemplate, useMotionValue } from "framer-motion"
import { cn } from "@/lib/utils"

export function MagicCard({
  children,
  className,
  gradientSize = 200,
  gradientColor = "rgba(147, 51, 234, 0.15)",
  gradientFrom = "#9333ea",
  gradientTo = "#7c3aed",
}) {
  const mouseX = useMotionValue(-gradientSize)
  const mouseY = useMotionValue(-gradientSize)

  const handlePointerMove = useCallback(
    (e) => {
      const rect = e.currentTarget.getBoundingClientRect()
      mouseX.set(e.clientX - rect.left)
      mouseY.set(e.clientY - rect.top)
    },
    [mouseX, mouseY]
  )

  const handlePointerLeave = useCallback(() => {
    mouseX.set(-gradientSize)
    mouseY.set(-gradientSize)
  }, [mouseX, mouseY, gradientSize])

  const background = useMotionTemplate`
    radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
      ${gradientFrom}22,
      transparent 100%
    ),
    linear-gradient(to bottom, rgba(20,20,20,0.8), rgba(10,10,10,0.9))
  `

  const spotlightBg = useMotionTemplate`
    radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
      ${gradientColor},
      transparent 100%
    )
  `

  return (
    <motion.div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-[rgba(147,51,234,0.2)]",
        className
      )}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ background }}
    >
      {/* Inner spotlight glow */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: spotlightBg }}
      />
      <div className="relative z-10 flex-1 flex flex-col">{children}</div>
    </motion.div>
  )
}
