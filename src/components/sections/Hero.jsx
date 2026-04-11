import { Spotlight } from "@/components/ui/spotlight"
import { ScrollReveal } from "@/components/ui/ScrollReveal"

export function Hero() {
  return (
    <section id="hero" className="snap-section relative flex items-center overflow-hidden">
      <Spotlight className="-top-40 left-0 md:left-20 md:-top-20" size={400} />

      <div className="w-full px-8 py-16">
        <ScrollReveal>
          <p className="text-sm font-medium tracking-widest uppercase text-[var(--color-accent)] mb-4">
            Premium FiveM Development
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h1 className="text-4xl md:text-6xl font-bold leading-[1.05] mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-[var(--color-text-primary)] to-[var(--color-text-secondary)]">
              We Build
            </span>
            <br />
            <span className="text-[var(--color-accent)] glow-purple">
              Worlds
            </span>
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-md mb-4">
            Custom scripts, full server builds, and 3D assets — engineered for performance, designed for immersion.
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}
