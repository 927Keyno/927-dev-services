// src/components/SocialProof.jsx
import { Counter } from "@/components/ui/Counter"
import { SplitText } from "@/components/ui/SplitText"
import { ScrollReveal } from "@/components/ui/ScrollReveal"

const STATS = [
  { target: 600,  suffix: "+",  label: "Concurrent Players"       },
  { target: 150,  suffix: "+",  label: "Peak Pop Servers Built"   },
  { target: 30,   suffix: "+",  label: "Custom Scripts Deployed"  },
  { prefix: "$", target: 15, suffix: "k+", label: "Monthly Revenue Generated" },
]

export function SocialProof() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[var(--color-base)] px-6 py-24">

      {/* Ambient purple radial glow — sits behind everything */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div
          className="h-[600px] w-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(147,51,234,0.18) 0%, rgba(147,51,234,0.06) 45%, transparent 72%)",
            filter: "blur(40px)",
          }}
        />
      </div>

      {/* Section heading */}
      <div className="relative z-10 mb-16 text-center">
        <SplitText
          tag="h2"
          className="text-4xl font-bold tracking-tight text-[var(--color-text-primary)] md:text-5xl"
          from="bottom"
          stagger={0.06}
          duration={0.8}
          start="top 85%"
        >
          The numbers speak for themselves
        </SplitText>

        <ScrollReveal direction="up" delay={0.3} duration={0.7} start="top 85%">
          <p className="mt-4 text-base text-[var(--color-text-secondary)] max-w-md mx-auto">
            Real results on production servers — built and operated by 927 Dev.
          </p>
        </ScrollReveal>
      </div>

      {/* Stats grid */}
      <div className="relative z-10 grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12 w-full max-w-4xl">
        {STATS.map((stat, i) => (
          <ScrollReveal
            key={stat.label}
            direction="up"
            delay={i * 0.12}
            duration={0.7}
            start="top 90%"
            className="flex flex-col items-center text-center"
          >
            {/* Subtle per-card glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-4 rounded-2xl"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(147,51,234,0.12) 0%, transparent 70%)",
                filter: "blur(12px)",
              }}
            />

            {/* The animated number — wrap in a span to apply glow text-shadow */}
            <span
              className="relative"
              style={{
                textShadow:
                  "0 0 30px rgba(147,51,234,0.55), 0 0 60px rgba(147,51,234,0.25)",
              }}
            >
              <Counter
                target={stat.target}
                prefix={stat.prefix ?? ""}
                suffix={stat.suffix}
                duration={2.2}
                start="top 90%"
                className="text-5xl font-extrabold leading-none text-[var(--color-text-primary)] md:text-6xl"
              />
            </span>

            {/* Label */}
            <span className="relative mt-3 text-sm font-medium uppercase tracking-widest text-[var(--color-text-secondary)]">
              {stat.label}
            </span>
          </ScrollReveal>
        ))}
      </div>

    </section>
  )
}
