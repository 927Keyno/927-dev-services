import { MagicCard } from "@/components/ui/magic-card"
import { BorderBeam } from "@/components/ui/border-beam"
import { Spotlight } from "@/components/ui/spotlight"
import { ScrollReveal } from "@/components/ui/ScrollReveal"
import { HyperText } from "@/components/ui/hyper-text"

const TESTIMONIALS = [
  {
    quote: "927 completely rebuilt our server from scratch. The scripts are clean, performant, and our players noticed the difference immediately. Best investment we made.",
    name: "Server Owner",
    server: "Boot Town RP",
  },
  {
    quote: "The custom scripts are on another level. Every feature works exactly how we spec'd it, and the NUI design is next-gen. Our server stands out because of 927.",
    name: "Server Owner",
    server: "4DaRaw RP",
  },
  {
    quote: "Fast turnaround, solid communication, and the code is actually clean. No spaghetti, no bugs. 927 is the real deal for FiveM development.",
    name: "Server Owner",
    server: "SAWL RP",
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="snap-section relative flex flex-col justify-center overflow-hidden py-8">
      <Spotlight className="-top-20 right-0 md:right-10" size={400} />

      <div className="px-8">
        <ScrollReveal>
          <span className="text-xs font-medium tracking-widest uppercase text-[var(--color-accent)] mb-4 block">
            What They Say
          </span>
        </ScrollReveal>
        <HyperText
          className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-8"
          duration={1000}
          startOnView
        >
          TESTIMONIALS
        </HyperText>

        <div className="flex flex-col gap-4">
          {TESTIMONIALS.map((t, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <MagicCard className="p-5 relative" gradientSize={200}>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[rgba(147,51,234,0.2)] flex items-center justify-center">
                    <span className="text-xs font-bold text-[var(--color-accent)]">
                      {t.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[var(--color-text-primary)]">{t.name}</p>
                    <p className="text-[10px] text-[var(--color-accent)]">{t.server}</p>
                  </div>
                </div>
                <BorderBeam size={40} duration={10} colorFrom="#9333ea" colorTo="#7c3aed" />
              </MagicCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
