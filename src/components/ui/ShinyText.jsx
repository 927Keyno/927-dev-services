import { cn } from "@/lib/utils"

export function ShinyText({ children, className, shimmerWidth = 100 }) {
  return (
    <span
      className={cn("inline-block bg-clip-text bg-no-repeat", className)}
      style={{
        "--shiny-width": `${shimmerWidth}px`,
        backgroundSize: `${shimmerWidth}px 100%`,
        backgroundImage:
          "linear-gradient(90deg, transparent, rgba(255,255,255,0.8) 50%, transparent)",
        animation: "shiny-text 8s infinite",
        WebkitBackgroundClip: "text",
      }}
    >
      {children}
    </span>
  )
}
