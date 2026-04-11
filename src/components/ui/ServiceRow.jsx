import { Suspense, lazy } from "react"
import { useInView } from "@/hooks/useInView"
import { ScrollReveal } from "@/components/ui/ScrollReveal"
import { GlassCard } from "@/components/ui/GlassCard"
import { cn } from "@/lib/utils"

const SharedCanvas = lazy(() =>
  import("@/components/three/SharedCanvas").then((m) => ({ default: m.SharedCanvas }))
)

export function ServiceRow({ title, description, ThreeScene, reverse = false, index }) {
  const [ref, inView] = useInView({ threshold: 0.2 })

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col md:flex-row items-center gap-8 md:gap-16 py-16 md:py-24",
        reverse && "md:flex-row-reverse"
      )}
    >
      <div className="flex-1">
        <ScrollReveal direction={reverse ? "right" : "left"}>
          <GlassCard className="p-8">
            <span className="text-xs font-mono text-[var(--color-accent)] mb-2 block">
              0{index + 1}
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-4">
              {title}
            </h3>
            <p className="text-[var(--color-text-secondary)] leading-relaxed">
              {description}
            </p>
          </GlassCard>
        </ScrollReveal>
      </div>

      <div className="flex-1 h-[300px] md:h-[400px]">
        <ScrollReveal direction={reverse ? "left" : "right"}>
          {inView && ThreeScene ? (
            <Suspense
              fallback={
                <div className="w-full h-full rounded-lg bg-[rgba(20,20,20,0.5)] animate-pulse" />
              }
            >
              <SharedCanvas>
                <ThreeScene />
              </SharedCanvas>
            </Suspense>
          ) : (
            <div className="w-full h-full rounded-lg bg-[rgba(20,20,20,0.5)] animate-pulse" />
          )}
        </ScrollReveal>
      </div>
    </div>
  )
}
