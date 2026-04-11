import { Counter } from "@/components/ui/Counter"
import { GlassCard } from "@/components/ui/GlassCard"

export function StatCard({ target, suffix = "", prefix = "", label, className }) {
  return (
    <GlassCard className={`p-6 text-center ${className || ""}`}>
      <div className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-2">
        <Counter target={target} prefix={prefix} suffix={suffix} />
      </div>
      <p className="text-sm text-[var(--color-text-secondary)] uppercase tracking-wider">
        {label}
      </p>
    </GlassCard>
  )
}
