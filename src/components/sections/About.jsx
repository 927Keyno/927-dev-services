import { Suspense, lazy } from "react"
import { useInView } from "@/hooks/useInView"
import { ScrollReveal } from "@/components/ui/ScrollReveal"
import { SplitText } from "@/components/ui/SplitText"

const SharedCanvas = lazy(() =>
  import("@/components/three/SharedCanvas").then((m) => ({ default: m.SharedCanvas }))
)
const Logo927 = lazy(() =>
  import("@/components/three/Logo927").then((m) => ({ default: m.Logo927 }))
)

export function About() {
  const [ref, inView] = useInView({ threshold: 0.2 })

  return (
    <section id="about" className="section relative py-24 md:py-32" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12 md:gap-20">
        <div className="flex-1">
          <ScrollReveal direction="left">
            <p className="text-sm font-medium tracking-widest uppercase text-[var(--color-accent)] mb-4">
              Who We Are
            </p>
          </ScrollReveal>

          <SplitText tag="h2" className="text-4xl md:text-5xl font-bold mb-6">
            Built by Devs Who Run Servers
          </SplitText>

          <ScrollReveal delay={0.2}>
            <p className="text-[var(--color-text-secondary)] leading-relaxed mb-6">
              927 Development isn&apos;t just a dev shop — we run our own production servers.
              Every script we build gets battle-tested on live servers with real players
              before it ever touches your codebase. We don&apos;t ship code we wouldn&apos;t run ourselves.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <p className="text-[var(--color-text-secondary)] leading-relaxed mb-8">
              From custom scripts to full server builds, we bring the perspective of
              server owners who understand what players actually need — not just what
              looks good in a demo.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <a
              href="https://discord.gg/hRZeHwWyHG"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[var(--color-accent)] hover:text-[var(--color-text-primary)] transition-colors font-medium"
            >
              Join the Community &rarr;
            </a>
          </ScrollReveal>
        </div>

        <div className="flex-1 h-[400px] md:h-[500px]">
          {inView && (
            <Suspense
              fallback={
                <div className="w-full h-full rounded-lg bg-[rgba(20,20,20,0.5)] animate-pulse" />
              }
            >
              <SharedCanvas>
                <Logo927 />
              </SharedCanvas>
            </Suspense>
          )}
        </div>
      </div>
    </section>
  )
}
