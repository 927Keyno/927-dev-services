import { Suspense, lazy } from "react"
import { useInView } from "@/hooks/useInView"
import { ScrollReveal } from "@/components/ui/ScrollReveal"
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text"

const SharedCanvas = lazy(() =>
  import("@/components/three/SharedCanvas").then((m) => ({ default: m.SharedCanvas }))
)
const ParticleField = lazy(() =>
  import("@/components/three/ParticleField").then((m) => ({ default: m.ParticleField }))
)

export function CTAFooter() {
  const [ref, inView] = useInView({ threshold: 0.1 })

  return (
    <section className="snap-section relative flex flex-col justify-center overflow-hidden py-8" ref={ref}>
      <div className="absolute inset-0 opacity-30 pointer-events-none">
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
          <AnimatedGradientText
            className="text-2xl md:text-3xl font-bold block mb-4"
            colorFrom="#9333ea"
            colorTo="#c084fc"
          >
            Let's build something your players won't forget.
          </AnimatedGradientText>
          <p className="text-sm text-[var(--color-text-secondary)] opacity-60">
            Reach out on Discord or browse our scripts on Tebex.
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}
