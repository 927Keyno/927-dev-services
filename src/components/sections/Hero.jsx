import { HyperText } from "@/components/ui/hyper-text"
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text"
import { Spotlight } from "@/components/ui/spotlight"
import { ScrollReveal } from "@/components/ui/ScrollReveal"

export function Hero() {
  return (
    <section id="hero" className="snap-section relative flex flex-col justify-center overflow-hidden px-10 md:px-14 py-24 md:py-32">
      <Spotlight className="-top-40 left-0 md:left-20 md:-top-20" size={500} />

      <div className="relative z-10">
        <ScrollReveal>
          <div className="inline-block rounded-full border border-[rgba(147,51,234,0.5)] px-6 py-2.5 mb-14 bg-[rgba(147,51,234,0.1)] shadow-[0_0_30px_rgba(147,51,234,0.15)]">
            <span className="text-sm md:text-base font-semibold tracking-[0.25em] uppercase text-[var(--color-accent)]">
              Premium FiveM Development
            </span>
          </div>
        </ScrollReveal>

        <HyperText
          className="text-6xl md:text-8xl font-bold leading-[0.95] mb-4 text-[var(--color-text-primary)]"
          duration={1200}
          startOnView
          animateOnHover
        >
          WE BUILD
        </HyperText>

        <AnimatedGradientText
          className="text-6xl md:text-8xl font-bold leading-[0.95] mb-16 block"
          colorFrom="#9333ea"
          colorTo="#c084fc"
          speed={1.5}
        >
          WORLDS
        </AnimatedGradientText>

        <ScrollReveal delay={0.3}>
          <p className="text-xl md:text-2xl text-[var(--color-text-secondary)] max-w-lg mb-14 leading-relaxed">
            Custom scripts, full server builds, and 3D assets — engineered for performance, designed for immersion.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <div className="h-px w-48 bg-gradient-to-r from-[var(--color-accent)] via-[rgba(147,51,234,0.5)] to-transparent mb-6" />
          <div className="h-px w-32 bg-gradient-to-r from-[rgba(147,51,234,0.3)] to-transparent mb-8 ml-4" />
          <p className="text-sm text-[var(--color-text-secondary)] opacity-50 tracking-widest uppercase">
            Scroll to explore
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}
