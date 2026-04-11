import { ScrollReveal } from "@/components/ui/ScrollReveal"
import { MagicCard } from "@/components/ui/magic-card"
import { BorderBeam } from "@/components/ui/border-beam"

export function ServiceRow({ title, description, index }) {
  return (
    <ScrollReveal delay={index * 0.05}>
      <MagicCard className="p-4 relative" gradientSize={200}>
        <div className="flex items-start gap-3">
          <span className="text-xs font-mono text-[var(--color-accent)] px-2 py-0.5 rounded border border-[rgba(147,51,234,0.3)] bg-[rgba(147,51,234,0.1)] flex-shrink-0">
            0{index + 1}
          </span>
          <div>
            <h3 className="text-base font-bold text-[var(--color-text-primary)] mb-1">{title}</h3>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{description}</p>
          </div>
        </div>
        <BorderBeam size={60} duration={10} />
      </MagicCard>
    </ScrollReveal>
  )
}
