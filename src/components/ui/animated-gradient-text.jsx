import { cn } from "@/lib/utils"

export function AnimatedGradientText({
  children,
  className,
  speed = 1,
  colorFrom = "#9333ea",
  colorTo = "#7c3aed",
  ...props
}) {
  return (
    <span
      className={cn("inline bg-clip-text text-transparent", className)}
      style={{
        backgroundImage: `linear-gradient(90deg, ${colorFrom}, ${colorTo}, ${colorFrom})`,
        backgroundSize: `${speed * 300}% 100%`,
        animation: `gradient-shift ${3 / speed}s ease infinite`,
      }}
      {...props}
    >
      {children}
    </span>
  )
}
