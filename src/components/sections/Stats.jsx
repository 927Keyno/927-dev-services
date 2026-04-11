import { Suspense, lazy } from "react"
import { useInView } from "@/hooks/useInView"
import { NumberTicker } from "@/components/ui/number-ticker"
import { MagicCard } from "@/components/ui/magic-card"
import { ScrollReveal } from "@/components/ui/ScrollReveal"
import { HyperText } from "@/components/ui/hyper-text"

const SharedCanvas = lazy(() =>
  import("@/components/three/SharedCanvas").then((m) => ({ default: m.SharedCanvas }))
)
const Globe = lazy(() =>
  import("@/components/three/Globe").then((m) => ({ default: m.Globe }))
)

const STATS = [
  { value: 50, suffix: "+", label: "Projects Completed" },
  { value: 15, suffix: "+", label: "Servers Built" },
  { value: 25, suffix: "+", label: "Scripts Deployed" },
  { value: 100, suffix: "K+", label: "Lines of Code" },
]

export function Stats() {
  const [ref, inView] = useInView({ threshold: 0.1 })

  return (
    <section id="stats" className="snap-section relative flex flex-col justify-center overflow-hidden py-8" ref={ref}>
      <div className="absolute inset-0 opacity-20 pointer-events-none">
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
          <span className="text-xs font-medium tracking-widest uppercase text-[var(--color-accent)] mb-4 block">
            By the Numbers
          </span>
        </ScrollReveal>
        <HyperText
          className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-8"
          duration={1000}
          startOnView
        >
          TRACK RECORD
        </HyperText>

        <div className="grid grid-cols-2 gap-4">
          {STATS.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 0.1}>
              <MagicCard className="p-5 text-center" gradientSize={150}>
                <div className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-1">
                  <NumberTicker value={stat.value} delay={0.3 + i * 0.1} />
                  <span>{stat.suffix}</span>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider">
                  {stat.label}
                </p>
              </MagicCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
