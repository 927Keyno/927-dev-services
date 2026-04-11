import { Suspense, lazy } from "react"
import { useInView } from "@/hooks/useInView"
import { Spotlight } from "@/components/ui/spotlight"
import { ScrollReveal } from "@/components/ui/ScrollReveal"
import { SplitText } from "@/components/ui/SplitText"

const SharedCanvas = lazy(() =>
  import("@/components/three/SharedCanvas").then((m) => ({ default: m.SharedCanvas }))
)
const ParticleField = lazy(() =>
  import("@/components/three/ParticleField").then((m) => ({ default: m.ParticleField }))
)

export function CTAFooter() {
  const [ref, inView] = useInView({ threshold: 0.1 })

  return (
    <section className="relative py-24 md:py-32 overflow-hidden" ref={ref}>
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        {inView && (
          <Suspense fallback={null}>
            <SharedCanvas camera={{ position: [0, 0, 6] }}>
              <ParticleField />
            </SharedCanvas>
          </Suspense>
        )}
      </div>

      <Spotlight className="top-0 left-1/2 -translate-x-1/2" size={600} />

      <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
        <ScrollReveal>
          <SplitText tag="h2" className="text-4xl md:text-6xl font-bold mb-6">
            Ready to Level Up Your Server?
          </SplitText>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <p className="text-lg text-[var(--color-text-secondary)] mb-10 max-w-xl mx-auto">
            Whether you need a full server build, custom scripts, or ongoing management
            — let&apos;s build something your players won&apos;t forget.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://discord.gg/hRZeHwWyHG"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-lg bg-[var(--color-accent)] text-white font-medium text-lg hover:shadow-[0_0_40px_rgba(147,51,234,0.5)] transition-all"
            >
              Get a Quote
            </a>
            <a
              href="https://927-development.tebex.io"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-lg border border-[rgba(147,51,234,0.3)] text-[var(--color-text-primary)] font-medium text-lg hover:border-[var(--color-accent)] hover:shadow-[0_0_20px_rgba(147,51,234,0.2)] transition-all"
            >
              Browse Scripts
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
