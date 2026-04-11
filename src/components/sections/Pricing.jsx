import { ScrollReveal } from "@/components/ui/ScrollReveal"
import { HyperText } from "@/components/ui/hyper-text"
import { MagicCard } from "@/components/ui/magic-card"
import { BorderBeam } from "@/components/ui/border-beam"

const DISCORD_URL = "https://discord.gg/hRZeHwWyHG"

const TIERS = [
  {
    id: "maintain",
    accentColor: "#3b82f6",
    name: "Maintain",
    price: "$450",
    period: "/mo",
    hook: "Stop putting out fires alone.",
    benefits: [
      "Bugs fixed before your players notice",
      "Server running smooth 24/7",
      "Someone who actually knows your codebase",
      "Security holes patched, not ignored",
    ],
    bestFor: "Established servers that need reliability.",
  },
  {
    id: "build",
    accentColor: "#9333ea",
    name: "Build",
    price: "$650",
    period: "/mo",
    hook: "Go from running a server to running a brand.",
    benefits: [
      "Custom scripts nobody else has",
      "Your identity — not a template",
      "Weapons, vehicles, maps — configured right",
      "Database that scales with your players",
      "Everything in Maintain, plus momentum",
    ],
    bestFor: "Experienced owners ready to build something real.",
  },
  {
    id: "lead",
    accentColor: "#f59e0b",
    name: "Lead",
    price: "$1,000",
    period: "/mo",
    hook: "Your full-time dev team. Without the overhead.",
    benefits: [
      "Complete systems from scratch",
      "Architecture for 150+ players",
      "Priority turnaround on everything",
      "Long-term roadmap, not quick fixes",
      "Everything in Build, plus vision",
    ],
    bestFor: "Serious owners who want a dev partner.",
    featured: true,
    badge: "RECOMMENDED",
  },
]

export function Pricing() {
  return (
    <div id="pricing" className="snap-section flex flex-col px-8 py-8" style={{ height: '100%' }}>
      <div className="mb-4 flex-shrink-0">
        <ScrollReveal>
          <span className="text-xs font-medium tracking-widest uppercase text-[var(--color-accent)] mb-3 block">
            Packages
          </span>
        </ScrollReveal>
        <HyperText
          className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-2"
          duration={1000}
          startOnView
        >
          CHOOSE YOUR PATH
        </HyperText>
      </div>

      <div className="flex-1 overflow-y-auto scroll-container space-y-3 pr-1">
        {TIERS.map((tier, i) => {
          const isLead = tier.id === "lead"
          return (
            <ScrollReveal key={tier.id} delay={i * 0.1}>
              <MagicCard
                className="relative p-5"
                gradientSize={250}
                gradientFrom={tier.accentColor}
                gradientTo={tier.accentColor}
                gradientColor={`${tier.accentColor}22`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3
                      className="font-bold tracking-wide uppercase text-base"
                      style={{ color: tier.accentColor }}
                    >
                      {tier.name}
                    </h3>
                    {tier.badge && (
                      <span
                        className="text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
                        style={{
                          background: "rgba(245,158,11,0.15)",
                          color: "#f59e0b",
                          border: "1px solid rgba(245,158,11,0.3)",
                        }}
                      >
                        {tier.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span
                      className="text-2xl font-extrabold"
                      style={{
                        color: isLead ? "#f59e0b" : "var(--color-text-primary)",
                        textShadow: isLead ? "0 0 20px rgba(245,158,11,0.4)" : "none",
                      }}
                    >
                      {tier.price}
                    </span>
                    <span className="text-xs text-[var(--color-text-secondary)]">{tier.period}</span>
                  </div>
                </div>

                <p className="text-sm font-medium text-[var(--color-text-primary)] mb-3">{tier.hook}</p>

                <ul className="flex flex-col gap-2 mb-4">
                  {tier.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-xs text-[var(--color-text-secondary)]">
                      <svg width="12" height="12" viewBox="0 0 15 15" fill="none" className="flex-shrink-0 mt-0.5">
                        <circle cx="7.5" cy="7.5" r="7" fill={`${tier.accentColor}22`} />
                        <path d="M4.5 7.5l2 2 4-4" stroke={tier.accentColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {b}
                    </li>
                  ))}
                </ul>

                <p className="text-xs text-[var(--color-text-secondary)] opacity-60 mb-3">{tier.bestFor}</p>

                <a
                  href={DISCORD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-lg py-2.5 text-center text-sm font-semibold transition-all"
                  style={
                    isLead
                      ? {
                          background: "linear-gradient(135deg, rgba(245,158,11,0.9), rgba(217,119,6,0.9))",
                          color: "#0a0a0a",
                          boxShadow: "0 4px 20px rgba(245,158,11,0.35)",
                        }
                      : {
                          background: `${tier.accentColor}14`,
                          color: tier.accentColor,
                          border: `1px solid ${tier.accentColor}44`,
                        }
                  }
                >
                  Get Started
                </a>

                <BorderBeam
                  size={60}
                  duration={isLead ? 5 : 8}
                  colorFrom={tier.accentColor}
                  colorTo={isLead ? "#f59e0b" : "#7c3aed"}
                />
              </MagicCard>
            </ScrollReveal>
          )
        })}

        <div className="pt-3 pb-2 text-center flex-shrink-0">
          <p className="text-xs text-[var(--color-text-secondary)] opacity-60">
            50% to start · Balance at day 14 · No lock-in
          </p>
        </div>
      </div>
    </div>
  )
}
