// src/components/sections/Hero.jsx
import { Suspense, lazy } from "react"
import { Spotlight } from "@/components/ui/spotlight"
import { ScrollReveal } from "@/components/ui/ScrollReveal"

const SplineScene = lazy(() =>
  import("@/components/ui/splite").then((m) => ({ default: m.SplineScene }))
)

export function Hero() {
  return (
    <section id="hero" className="section relative min-h-screen flex items-center overflow-hidden">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" size={400} />

      <div className="max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row items-center gap-8 pt-16">
        {/* Left — Content */}
        <div className="flex-1 relative z-10 flex flex-col justify-center md:pr-8">
          <ScrollReveal>
            <p className="text-sm font-medium tracking-widest uppercase text-[var(--color-accent)] mb-4">
              Premium FiveM Development
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] mb-6">
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
            <p className="text-lg text-[var(--color-text-secondary)] max-w-md mb-8">
              Custom scripts, full server builds, and 3D assets — engineered for performance, designed for immersion.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="flex gap-4">
              <a
                href="https://discord.gg/hRZeHwWyHG"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-lg bg-[var(--color-accent)] text-white font-medium hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] transition-all"
              >
                Get a Quote
              </a>
              <a
                href="https://927-development.tebex.io"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-lg border border-[rgba(147,51,234,0.3)] text-[var(--color-text-primary)] font-medium hover:border-[var(--color-accent)] hover:shadow-[0_0_20px_rgba(147,51,234,0.2)] transition-all"
              >
                Browse Scripts
              </a>
            </div>
          </ScrollReveal>
        </div>

        {/* Right — 3D Scene */}
        <div className="flex-1 relative h-[500px] md:h-[600px]">
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </Suspense>
        </div>
      </div>
    </section>
  )
}
