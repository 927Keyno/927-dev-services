import { Suspense, lazy } from "react"
import { useInView } from "@/hooks/useInView"
import { ScrollReveal } from "@/components/ui/ScrollReveal"

const SharedCanvas = lazy(() =>
  import("@/components/three/SharedCanvas").then((m) => ({ default: m.SharedCanvas }))
)
const ParticleField = lazy(() =>
  import("@/components/three/ParticleField").then((m) => ({ default: m.ParticleField }))
)

export function CTAFooter() {
  const [ref, inView] = useInView({ threshold: 0.1 })

  return (
    <section className="snap-section relative py-20 overflow-hidden flex flex-col justify-center" ref={ref}>
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        {inView && (
          <Suspense fallback={null}>
            <SharedCanvas camera={{ position: [0, 0, 6] }}>
              <ParticleField />
            </SharedCanvas>
          </Suspense>
        )}
      </div>

      <div className="px-8 text-center relative z-10">
        <ScrollReveal>
          <p className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-4">
            Let&apos;s build something your players won&apos;t forget.
          </p>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Reach out on Discord or browse our scripts on Tebex.
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}
