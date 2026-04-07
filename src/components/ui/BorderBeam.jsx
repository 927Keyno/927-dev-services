import { motion } from "motion/react"
import { cn } from "@/lib/utils"

export function BorderBeam({
  size = 50,
  duration = 6,
  delay = 0,
  colorFrom = "#4ade80",
  colorTo = "#00e5ff",
  className,
  borderWidth = 1,
}) {
  return (
    <div
      className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden"
      style={{
        border: `${borderWidth}px solid transparent`,
        mask: "linear-gradient(transparent,transparent), linear-gradient(#000,#000)",
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
        maskClip: "padding-box, border-box",
        WebkitMaskClip: "padding-box, border-box",
      }}
    >
      <motion.div
        className={cn("absolute aspect-square", className)}
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          background: `linear-gradient(to left, ${colorFrom}, ${colorTo}, transparent)`,
        }}
        initial={{ offsetDistance: "0%" }}
        animate={{ offsetDistance: "100%" }}
        transition={{ repeat: Infinity, ease: "linear", duration, delay: -delay }}
      />
    </div>
  )
}
