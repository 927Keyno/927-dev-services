import { Suspense, lazy } from "react"
import { useInView } from "@/hooks/useInView"
import { ScrollReveal } from "@/components/ui/ScrollReveal"
import { GlassCard } from "@/components/ui/GlassCard"
import { cn } from "@/lib/utils"

const SharedCanvas = lazy(() =>
  import("@/components/three/SharedCanvas").then((m) => ({ default: m.SharedCanvas }))
)

export function ServiceRow({ title, description, ThreeScene, index }) {
  const [ref, inView] = useInView({ threshold: 0.2 })

  return (
    <div ref={ref} className="snap-section py-12 flex flex-col justify-center">
      {/* 3D Scene */}
      <div className="h-[250px] mb-6 rounded-lg overflow-hidden">
        <ScrollReveal>
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

      {/* Content */}
      <ScrollReveal delay={0.1}>
        <GlassCard className="p-6">
          <span className="text-xs font-mono text-[var(--color-accent)] mb-2 block">
            0{index + 1}
          </span>
          <h3 className="text-xl md:text-2xl font-bold text-[var(--color-text-primary)] mb-3">
            {title}
          </h3>
          <p className="text-[var(--color-text-secondary)] leading-relaxed text-sm">
            {description}
          </p>
        </GlassCard>
      </ScrollReveal>
    </div>
  )
}
