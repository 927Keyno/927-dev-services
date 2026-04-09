// src/components/Pricing.jsx
import { useRef, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { GlassCard } from "@/components/ui/GlassCard"
import { SplitText } from "@/components/ui/SplitText"
import { ScrollReveal } from "@/components/ui/ScrollReveal"

gsap.registerPlugin(ScrollTrigger)

/* ─── Tier icons ─── */
const ShieldIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
    <path
      d="M18 3L5 9v9c0 7.45 5.45 14.42 13 16.2C25.55 32.42 31 25.45 31 18V9L18 3z"
      fill="rgba(59,130,246,0.13)"
      stroke="rgba(59,130,246,0.5)"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M12.5 18l4 4 7-7"
      stroke="rgba(59,130,246,0.8)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const RocketIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
    <path
      d="M18 5c0 0 9 4 9 12v2l-3.5 3.5h-11L9 19v-2C9 9 18 5 18 5z"
      fill="rgba(147,51,234,0.13)"
      stroke="rgba(147,51,234,0.5)"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <circle cx="18" cy="16" r="2.5" fill="rgba(147,51,234,0.75)" />
    <path
      d="M13.5 24.5l-2.5 5M22.5 24.5l2.5 5"
      stroke="rgba(147,51,234,0.45)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
)

const CrownIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
    <path
      d="M7 26h22M7 26L5 13l7 5 6-9 6 9 7-5-2 13H7z"
      fill="rgba(245,158,11,0.15)"
      stroke="rgba(245,158,11,0.6)"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <circle cx="18" cy="27.5" r="1.5" fill="rgba(245,158,11,0.85)" />
    <circle cx="11" cy="27.5" r="1.5" fill="rgba(245,158,11,0.5)" />
    <circle cx="25" cy="27.5" r="1.5" fill="rgba(245,158,11,0.5)" />
  </svg>
)

/* ─── Checkmark icon ─── */
const CheckIcon = ({ featured, accent }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    aria-hidden="true"
    className="flex-shrink-0 mt-0.5"
  >
    <circle
      cx="7.5"
      cy="7.5"
      r="7"
      fill={featured ? `${accent}33` : `${accent}1a`}
    />
    <path
      d="M4.5 7.5l2 2 4-4"
      stroke={featured ? accent : `${accent}cc`}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

/* ─── Tier data ─── */
const TIERS = [
  {
    id: "maintain",
    glowClass: "card-glow-wrapper--maintain",
    accentColor: "#3b82f6",
    icon: ShieldIcon,
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
    badge: null,
    audienceLabel: "For established servers",
  },
  {
    id: "build",
    glowClass: "card-glow-wrapper--build",
    accentColor: "#9333ea",
    icon: RocketIcon,
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
    badge: null,
    audienceLabel: "For experienced owners",
  },
  {
    id: "lead",
    glowClass: "card-glow-wrapper--lead",
    accentColor: "#f59e0b",
    icon: CrownIcon,
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
    audienceLabel: "For new & growing servers",
  },
]

const DISCORD_URL = "https://discord.gg/hRZeHwWyHG"

export function Pricing() {
  const cardWrapperRefs = useRef([])
  const universalRef = useRef(null)

  useEffect(() => {
    const els = cardWrapperRefs.current.filter(Boolean)
    if (!els.length) return

    const ctx = gsap.context(() => {
      els.forEach((el, i) => {
        gsap.from(el, {
          opacity: 0,
          y: 70,
          duration: 0.85,
          delay: i * 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        })
      })

      if (universalRef.current) {
        gsap.from(universalRef.current, {
          opacity: 0,
          y: 30,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: universalRef.current,
            start: "top 92%",
            toggleActions: "play none none none",
          },
        })
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-[var(--color-base)] px-6 py-28 flex flex-col items-center justify-center"
      style={{ minHeight: "100vh" }}
    >
      {/* Ambient glow — centered, large */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          style={{
            width: "1100px",
            height: "1100px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(147,51,234,0.12) 0%, rgba(245,158,11,0.04) 40%, rgba(147,51,234,0.03) 60%, transparent 75%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* Top divider */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, var(--color-accent), transparent)",
          opacity: 0.35,
        }}
      />

      {/* ── Section heading — fully centered ── */}
      <div className="relative z-10 mb-4 flex flex-col items-center text-center">
        <ScrollReveal direction="up" duration={0.55}>
          <p
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.28em",
              color: "var(--color-accent)",
              textTransform: "uppercase",
              fontWeight: 600,
              marginBottom: "0.75rem",
            }}
          >
            Monthly Retainer
          </p>
        </ScrollReveal>

        <SplitText
          tag="h2"
          className="text-4xl font-bold tracking-tight text-[var(--color-text-primary)] md:text-5xl lg:text-6xl text-center"
          from="bottom"
          stagger={0.055}
          duration={0.75}
          start="top 85%"
        >
          Choose Your Level
        </SplitText>

        <ScrollReveal direction="up" delay={0.3} duration={0.7} start="top 85%">
          <p
            className="mt-5 text-base text-center mx-auto max-w-lg"
            style={{ color: "var(--color-text-secondary)", lineHeight: "1.7" }}
          >
            Every server is different. Pick the tier that fits where you're at.
          </p>
        </ScrollReveal>
      </div>

      {/* ── Universal perks bar — centered ── */}
      <ScrollReveal direction="up" delay={0.4} duration={0.65} start="top 88%" className="relative z-10">
        <div className="mx-auto mt-6 mb-0 flex items-center justify-center text-center max-w-3xl overflow-x-auto">
          <p
            className="text-sm whitespace-nowrap text-center"
            style={{ color: "rgba(180,180,200,0.72)" }}
          >
            <span
              className="font-medium uppercase tracking-widest mr-2"
              style={{ color: "rgba(147,51,234,0.7)", letterSpacing: "0.18em", fontSize: "0.7rem" }}
            >
              All tiers include:
            </span>
            ClickUp management&nbsp;&nbsp;·&nbsp;&nbsp;Professional communication&nbsp;&nbsp;·&nbsp;&nbsp;Monthly billing
          </p>
        </div>
      </ScrollReveal>

      {/* ── Cards grid — mt-16 so badge clears the subline ── */}
      <div className="relative z-10 mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3 md:items-start">
        {TIERS.map((tier, i) => {
          const Icon = tier.icon
          const isLead = tier.id === "lead"

          return (
            <div
              key={tier.id}
              ref={(el) => { cardWrapperRefs.current[i] = el }}
              className="flex flex-col"
              /* Lead card gets a slight upward offset to signal dominance */
              style={isLead ? { marginTop: "-12px" } : undefined}
            >
              {/* Audience label pill */}
              <div className="flex justify-center mb-3">
                <span
                  className="text-xs font-semibold rounded-full px-3.5 py-1"
                  style={{
                    background: `rgba(${
                      tier.id === "maintain" ? "59,130,246" :
                      tier.id === "build"    ? "147,51,234" :
                                              "245,158,11"
                    },0.15)`,
                    color: tier.accentColor,
                    border: `1px solid ${tier.accentColor}55`,
                    letterSpacing: "0.03em",
                  }}
                >
                  {tier.audienceLabel}
                </span>
              </div>

              {/* Badge — Lead only, sits above the glow wrapper so overflow:hidden can't clip it */}
              {tier.badge && (
                <div className="flex justify-center mb-3">
                  <span
                    className="text-xs font-bold uppercase tracking-widest px-5 py-1.5 rounded-full"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(245,158,11,0.95) 0%, rgba(217,119,6,0.95) 100%)",
                      color: "#0a0a0a",
                      letterSpacing: "0.18em",
                      boxShadow: "0 2px 24px rgba(245,158,11,0.55)",
                    }}
                  >
                    {tier.badge}
                  </span>
                </div>
              )}

              {/* Rotating border glow wrapper */}
              <div className={`card-glow-wrapper ${tier.glowClass} flex flex-col flex-1`}>
                <div className="card-glow-inner flex flex-col flex-1">
                  <GlassCard
                    className="relative flex flex-col flex-1"
                    style={{
                      padding: "2rem",
                      minHeight: "540px",
                      background: "transparent",
                      border: "none",
                      borderRadius: "15px",
                      ...(isLead
                        ? {
                            backgroundImage:
                              "radial-gradient(ellipse at top, rgba(245,158,11,0.1) 0%, rgba(147,51,234,0.06) 45%, rgba(10,10,10,0) 70%)",
                            boxShadow:
                              "0 0 100px rgba(245,158,11,0.18), 0 20px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.07)",
                          }
                        : {
                            backgroundImage: "none",
                            boxShadow: "0 8px 40px rgba(0,0,0,0.35)",
                          }),
                    }}
                  >

                    {/* Icon + Tier name */}
                    <div className="mb-6 flex items-center gap-3">
                      <Icon />
                      <p
                        className="font-bold tracking-tight"
                        style={{
                          fontSize: "1.05rem",
                          color: isLead ? "rgba(245,158,11,0.9)" : "var(--color-text-secondary)",
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                        }}
                      >
                        {tier.name}
                      </p>
                    </div>

                    {/* Hook line */}
                    <p
                      className="mb-8 font-semibold leading-snug"
                      style={{
                        fontSize: "1.1rem",
                        color: "var(--color-text-primary)",
                        lineHeight: "1.4",
                        textShadow: isLead
                          ? "0 0 28px rgba(245,158,11,0.25)"
                          : "none",
                      }}
                    >
                      {tier.hook}
                    </p>

                    {/* Price */}
                    <div className="mb-8 flex items-baseline gap-1.5 whitespace-nowrap">
                      <span
                        className="font-extrabold leading-none tracking-tight whitespace-nowrap"
                        style={{
                          fontSize: "clamp(1.45rem, 2.8vw, 2rem)",
                          color: isLead
                            ? "#f59e0b"
                            : "var(--color-text-primary)",
                          textShadow: isLead
                            ? "0 0 32px rgba(245,158,11,0.45)"
                            : "none",
                        }}
                      >
                        {tier.price}
                      </span>
                      <span
                        className="text-sm font-medium whitespace-nowrap"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        {tier.period}
                      </span>
                    </div>

                    {/* Separator */}
                    <div
                      className="mb-8 h-px w-full"
                      style={{
                        background: isLead
                          ? "linear-gradient(90deg, transparent, rgba(245,158,11,0.55), transparent)"
                          : `linear-gradient(90deg, transparent, ${tier.accentColor}22, transparent)`,
                      }}
                      aria-hidden="true"
                    />

                    {/* Benefits list */}
                    <ul className="mb-8 flex flex-col gap-5 flex-1">
                      {tier.benefits.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <CheckIcon featured={isLead} accent={tier.accentColor} />
                          <span
                            className="text-sm leading-relaxed"
                            style={{
                              color: isLead
                                ? "rgba(220,220,235,0.9)"
                                : "var(--color-text-secondary)",
                            }}
                          >
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* "Best for" box */}
                    <div
                      className="mb-9 rounded-lg px-4 py-3"
                      style={{
                        background: isLead
                          ? "rgba(245,158,11,0.09)"
                          : `${tier.accentColor}0d`,
                        border: `1px solid ${isLead ? "rgba(245,158,11,0.3)" : `${tier.accentColor}28`}`,
                      }}
                    >
                      <p
                        className="text-xs font-semibold uppercase tracking-widest mb-1.5"
                        style={{
                          color: isLead
                            ? "rgba(245,158,11,0.85)"
                            : `${tier.accentColor}99`,
                          letterSpacing: "0.15em",
                        }}
                      >
                        Best for
                      </p>
                      <p
                        className="text-sm leading-relaxed"
                        style={{
                          color: isLead
                            ? "rgba(210,210,220,0.85)"
                            : "rgba(160,160,180,0.75)",
                        }}
                      >
                        {tier.bestFor}
                      </p>
                    </div>

                    {/* CTA */}
                    <a
                      href={DISCORD_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full rounded-xl py-4 text-center text-base font-semibold transition-all duration-200"
                      style={
                        isLead
                          ? {
                              background:
                                "linear-gradient(135deg, rgba(245,158,11,0.92) 0%, rgba(217,119,6,0.92) 100%)",
                              color: "#0a0a0a",
                              boxShadow: "0 4px 30px rgba(245,158,11,0.4)",
                              letterSpacing: "0.02em",
                              fontWeight: 700,
                            }
                          : {
                              background: `${tier.accentColor}14`,
                              color: tier.accentColor,
                              border: `1px solid ${tier.accentColor}44`,
                              letterSpacing: "0.02em",
                            }
                      }
                      onMouseEnter={(e) => {
                        if (isLead) {
                          e.currentTarget.style.boxShadow = "0 6px 40px rgba(245,158,11,0.6)"
                          e.currentTarget.style.transform = "translateY(-2px)"
                        } else {
                          e.currentTarget.style.background = `${tier.accentColor}28`
                          e.currentTarget.style.borderColor = `${tier.accentColor}66`
                          e.currentTarget.style.transform = "translateY(-2px)"
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (isLead) {
                          e.currentTarget.style.boxShadow = "0 4px 30px rgba(245,158,11,0.4)"
                        } else {
                          e.currentTarget.style.background = `${tier.accentColor}14`
                          e.currentTarget.style.borderColor = `${tier.accentColor}44`
                        }
                        e.currentTarget.style.transform = "translateY(0)"
                      }}
                    >
                      Get Started
                    </a>
                  </GlassCard>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Payment terms — centered ── */}
      <div ref={universalRef} className="relative z-10 mx-auto mt-20 max-w-xl text-center">
        <div
          className="mb-5 h-px w-16 mx-auto"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(147,51,234,0.45), transparent)",
          }}
          aria-hidden="true"
        />
        <p
          className="text-sm font-medium mb-2 text-center"
          style={{ color: "rgba(200,200,215,0.75)", letterSpacing: "0.01em" }}
        >
          50% to start&nbsp;&nbsp;•&nbsp;&nbsp;Balance at day 14&nbsp;&nbsp;•&nbsp;&nbsp;No long-term lock-in
        </p>
        <p
          className="text-sm text-center"
          style={{ color: "rgba(150,150,170,0.55)" }}
        >
          All work tracked in ClickUp — full transparency, zero guesswork.
        </p>
      </div>
    </section>
  )
}
