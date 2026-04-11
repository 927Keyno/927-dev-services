import { ScrollReveal } from "@/components/ui/ScrollReveal"
import { MagicCard } from "@/components/ui/magic-card"
import { BorderBeam } from "@/components/ui/border-beam"

export function ServiceRow({ title, tag, description, index }) {
  return (
    <ScrollReveal delay={index * 0.06}>
      <MagicCard
        className="relative px-6 py-5 md:px-8 md:py-6 min-h-[13vh] flex flex-col"
        gradientSize={280}
        gradientColor="rgba(147, 51, 234, 0.12)"
      >
        {/* Top row — index badge + tag */}
        <div className="flex items-center gap-3 mb-auto">
          <span className="text-[11px] font-mono font-semibold text-[var(--color-accent)] tabular-nums">
            0{index + 1}
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-[rgba(147,51,234,0.3)] to-transparent" />
          {tag && (
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[var(--color-accent)] opacity-60">
              {tag}
            </span>
          )}
        </div>

        {/* Title — vertically centered via auto margins */}
        <h3 className="text-lg md:text-xl font-bold text-[var(--color-text-primary)] mb-4 leading-tight">
          {title}
        </h3>

        {/* Description — pushed toward bottom */}
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mt-auto">
          {description}
        </p>

        <BorderBeam size={50} duration={12} delay={index * 2} />
      </MagicCard>
    </ScrollReveal>
  )
}
