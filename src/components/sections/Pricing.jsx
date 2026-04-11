import { ScrollReveal } from "@/components/ui/ScrollReveal"
import { SplitText } from "@/components/ui/SplitText"
import { GlassCard } from "@/components/ui/GlassCard"

const DISCORD_URL = "https://discord.gg/hRZeHwWyHG"

const TIERS = [
  {
    id: "maintain",
    glowClass: "card-glow-wrapper--maintain",
    accentColor: "#3b82f6",
    name: "Maintain",
    price: "Starting at $450",
    period: "/mo",
    hook: "Stop putting out fires alone.",
    benefits: [
      "Bugs fixed before your players notice",
      "Server running smooth 24/7",
      "Someone who actually knows your codebase",
      "Security holes patched, not ignored",
    ],
    bestFor: "You've got a server. You need it to stop breaking.",
    featured: false,
  },
  {
    id: "build",
    glowClass: "card-glow-wrapper--build",
    accentColor: "#9333ea",
    name: "Build",
    price: "Starting at $650",
    period: "/mo",
    hook: "Go from running a server to running a brand.",
    benefits: [
      "Custom scripts nobody else has",
      "Your server, your identity — not a template",
      "Weapons, vehicles, maps — configured right",
      "Database that scales with your player count",
      "Everything in Maintain, plus momentum",
    ],
    bestFor: "You know what you want. Time to build something real.",
    featured: false,
  },
  {
    id: "lead",
    glowClass: "card-glow-wrapper--lead",
    accentColor: "#f59e0b",
    name: "Lead",
    price: "Starting at $1,000",
    period: "/mo",
    hook: "Your full-time dev team. Without the full-time overhead.",
    benefits: [
      "Complete systems designed from scratch",
      "Architecture that handles 150+ players",
      "Priority turnaround on everything",
      "Long-term roadmap, not just quick fixes",
      "Everything in Build, plus vision",
    ],
    bestFor: "You're serious. You want a developer who thinks like an owner.",
    featured: true,
    badge: "RECOMMENDED",
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="snap-section relative py-16 flex flex-col justify-center">
      <div className="px-8">
        <ScrollReveal>
          <p className="text-sm font-medium tracking-widest uppercase text-[var(--color-accent)] mb-4">
            Packages
          </p>
        </ScrollReveal>
        <SplitText tag="h2" className="text-3xl md:text-4xl font-bold mb-12">
          Choose Your Path
        </SplitText>

        <div className="flex flex-col gap-6">
          {TIERS.map((tier, i) => {
            const isLead = tier.id === "lead"
            return (
              <ScrollReveal key={tier.id} delay={i * 0.1}>
                <div className={tier.glowClass} style={{ borderRadius: "16px" }}>
                  <div className="card-glow-inner">
                    <GlassCard className="p-6" hover={false}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <p
                            className="font-bold tracking-tight uppercase text-sm"
                            style={{ color: isLead ? "rgba(245,158,11,0.9)" : tier.accentColor }}
                          >
                            {tier.name}
                          </p>
                          {tier.badge && (
                            <span
                              className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
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
                            className="text-xl font-extrabold"
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

                      <p className="text-sm font-medium text-[var(--color-text-primary)] mb-4">
                        {tier.hook}
                      </p>

                      <ul className="flex flex-col gap-2 mb-4">
                        {tier.benefits.map((b) => (
                          <li key={b} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                            <svg width="14" height="14" viewBox="0 0 15 15" fill="none" className="flex-shrink-0 mt-0.5">
                              <circle cx="7.5" cy="7.5" r="7" fill={`${tier.accentColor}22`} />
                              <path d="M4.5 7.5l2 2 4-4" stroke={tier.accentColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {b}
                          </li>
                        ))}
                      </ul>

                      <div
                        className="rounded-lg px-3 py-2 mb-4 text-xs"
                        style={{
                          background: isLead ? "rgba(245,158,11,0.08)" : `${tier.accentColor}0d`,
                          border: `1px solid ${isLead ? "rgba(245,158,11,0.25)" : `${tier.accentColor}22`}`,
                        }}
                      >
                        <span className="font-semibold uppercase tracking-widest" style={{ color: isLead ? "rgba(245,158,11,0.8)" : `${tier.accentColor}88`, fontSize: "10px" }}>
                          Best for:{" "}
                        </span>
                        <span style={{ color: "var(--color-text-secondary)" }}>{tier.bestFor}</span>
                      </div>

                      <a
                        href={DISCORD_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full rounded-lg py-3 text-center text-sm font-semibold transition-all"
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
                    </GlassCard>
                  </div>
                </div>
              </ScrollReveal>
            )
          })}
        </div>

        {/* Payment terms */}
        <div className="mt-10 text-center">
          <p className="text-xs text-[var(--color-text-secondary)] opacity-75">
            50% to start&nbsp;&nbsp;&bull;&nbsp;&nbsp;Balance at day 14&nbsp;&nbsp;&bull;&nbsp;&nbsp;No long-term lock-in
          </p>
          <p className="text-xs text-[var(--color-text-secondary)] opacity-50 mt-1">
            All work tracked in ClickUp — full transparency, zero guesswork.
          </p>
        </div>
      </div>
    </section>
  )
}
