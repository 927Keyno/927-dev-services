import { Suspense, lazy } from "react"
import { useInView } from "@/hooks/useInView"
import { StatCard } from "@/components/ui/StatCard"
import { ScrollReveal } from "@/components/ui/ScrollReveal"

const SharedCanvas = lazy(() =>
  import("@/components/three/SharedCanvas").then((m) => ({ default: m.SharedCanvas }))
)
const Globe = lazy(() =>
  import("@/components/three/Globe").then((m) => ({ default: m.Globe }))
)

const STATS = [
  { target: 50, suffix: "+", label: "Projects Completed" },
  { target: 15, suffix: "+", label: "Servers Built" },
  { target: 25, suffix: "+", label: "Scripts Deployed" },
  { target: 100, suffix: "K+", label: "Lines of Code" },
]

export function Stats() {
  const [ref, inView] = useInView({ threshold: 0.1 })

  return (
    <section id="stats" className="snap-section relative py-24 overflow-hidden flex flex-col justify-center" ref={ref}>
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        {inView && (
          <Suspense fallback={null}>
            <SharedCanvas camera={{ position: [0, 0, 4.5] }}>
              <Globe />
            </SharedCanvas>
          </Suspense>
        )}
      </div>

      <div className="px-8 relative z-10">
        <ScrollReveal>
          <p className="text-sm font-medium tracking-widest uppercase text-[var(--color-accent)] mb-4 text-center">
            By the Numbers
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[var(--color-text-primary)]">
            Proven Track Record
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-2 gap-6">
          {STATS.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 0.1}>
              <StatCard {...stat} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
