import { GlassCard } from "@/components/ui/GlassCard"

export function TestimonialCard({ quote, name, server }) {
  return (
    <GlassCard className="p-8">
      <p className="text-[var(--color-text-secondary)] leading-relaxed mb-6 italic">
        &ldquo;{quote}&rdquo;
      </p>
      <div>
        <p className="text-sm font-medium text-[var(--color-text-primary)]">{name}</p>
        <p className="text-xs text-[var(--color-accent)]">{server}</p>
      </div>
    </GlassCard>
  )
}
