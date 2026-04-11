import { Suspense, lazy } from "react"
import { useInView } from "@/hooks/useInView"
import { ScrollReveal } from "@/components/ui/ScrollReveal"
import { HyperText } from "@/components/ui/hyper-text"
import { MagicCard } from "@/components/ui/magic-card"

const SharedCanvas = lazy(() =>
  import("@/components/three/SharedCanvas").then((m) => ({ default: m.SharedCanvas }))
)
const Logo927 = lazy(() =>
  import("@/components/three/Logo927").then((m) => ({ default: m.Logo927 }))
)

export function About() {
  const [ref, inView] = useInView({ threshold: 0.2 })

  return (
    <section id="about" className="snap-section relative flex flex-col justify-center py-8" ref={ref}>
      <div className="px-8">
        <ScrollReveal>
          <span className="text-xs font-medium tracking-widest uppercase text-[var(--color-accent)] mb-4 block">
            Who We Are
          </span>
        </ScrollReveal>
        <HyperText
          className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-6"
          duration={1000}
          startOnView
        >
          BUILT BY DEVS
        </HyperText>

        {/* 3D Logo inline */}
        <div className="h-[180px] mb-6 rounded-xl overflow-hidden">
          {inView && (
            <Suspense
              fallback={<div className="w-full h-full bg-[rgba(20,20,20,0.5)] animate-pulse rounded-xl" />}
            >
              <SharedCanvas>
                <Logo927 />
              </SharedCanvas>
            </Suspense>
          )}
        </div>

        <ScrollReveal delay={0.2}>
          <MagicCard className="p-6" gradientSize={200}>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
              927 Development isn&apos;t just a dev shop — we run our own production servers.
              Every script gets battle-tested on live servers with real players
              before it touches your codebase.
            </p>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
              From custom scripts to full server builds, we bring the perspective of
              server owners who understand what players actually need.
            </p>
            <a
              href="https://discord.gg/hRZeHwWyHG"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[var(--color-accent)] hover:text-[var(--color-text-primary)] transition-colors font-medium"
            >
              Join the Community &rarr;
            </a>
          </MagicCard>
        </ScrollReveal>
      </div>
    </section>
  )
}
