// src/components/ScriptShowcase.jsx
import { useRef, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { GlassCard } from "@/components/ui/GlassCard"
import { SplitText } from "@/components/ui/SplitText"
import { ScrollReveal } from "@/components/ui/ScrollReveal"

const SCRIPTS = [
  {
    id: 1,
    name: "927 Weapon Manager",
    description:
      "Full weapon management system with admin controls, presets, and enforcement.",
    price: "$15",
    tebexUrl: "https://927-mods.tebex.io/package/7324311",
    badge: "Live",
    version: "v1.0.0",
  },
  {
    id: 2,
    name: "927 Pistol Pack",
    description:
      "Free starter pack. Quality you can test before you buy.",
    price: "Free",
    tebexUrl: "https://927-mods.tebex.io",
    badge: "Free",
    version: "v1.0.0",
  },
  {
    id: 3,
    name: "927 Collision Manager",
    description:
      "In-game collision detection and removal with 3 scan modes and admin NUI.",
    price: "$25–30",
    tebexUrl: "https://927-mods.tebex.io",
    badge: "Coming Soon",
    version: "v1.0.0",
  },
]

export function ScriptShowcase() {
  const sectionRef = useRef(null)
  const cardsRef = useRef(null)

  useEffect(() => {
    const el = sectionRef.current
    const cardsEl = cardsRef.current
    if (!el || !cardsEl) return

    const ctx = gsap.context(() => {
      const cards = cardsEl.querySelectorAll(".script-card")

      gsap.from(cards, {
        x: 80,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardsEl,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="section"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "8rem 2rem",
        background: "var(--color-surface)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top border gradient */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(147,51,234,0.3), transparent)",
        }}
        aria-hidden
      />

      <div style={{ maxWidth: "1100px", width: "100%", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "5rem" }}>
          <ScrollReveal direction="up">
            <p
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.25em",
                color: "var(--color-accent)",
                textTransform: "uppercase",
                fontWeight: 600,
                marginBottom: "0.75rem",
              }}
            >
              The 927 Suite
            </p>
          </ScrollReveal>

          <SplitText
            tag="h2"
            stagger={0.06}
            from="bottom"
            duration={0.8}
            style={{
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "var(--color-text-primary)",
              marginBottom: "1rem",
            }}
          >
            Scripts built in production. Sold to the world.
          </SplitText>

          <ScrollReveal direction="up" delay={0.2}>
            <p
              style={{
                fontSize: "1rem",
                color: "var(--color-text-secondary)",
                maxWidth: "500px",
                margin: "0 auto",
                lineHeight: 1.7,
              }}
            >
              Production-tested scripts built from real server experience.
            </p>
          </ScrollReveal>
        </div>

        {/* Cards grid */}
        <div
          ref={cardsRef}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {SCRIPTS.map((script) => (
            <GlassCard key={script.id} className="script-card" hover>
              {/* Badge + version row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.25rem",
                }}
              >
                <span
                  style={{
                    fontSize: "0.7rem",
                    letterSpacing: "0.1em",
                    fontWeight: 700,
                    padding: "0.2rem 0.6rem",
                    borderRadius: "9999px",
                    background: "var(--color-accent-subtle)",
                    color: "var(--color-accent)",
                    border: "1px solid rgba(147,51,234,0.3)",
                    textTransform: "uppercase",
                  }}
                >
                  {script.badge}
                </span>
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: "rgba(160,160,160,0.5)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {script.version}
                </span>
              </div>

              {/* Name */}
              <h3
                style={{
                  fontSize: "1.15rem",
                  fontWeight: 700,
                  color: "var(--color-text-primary)",
                  marginBottom: "0.6rem",
                  letterSpacing: "-0.01em",
                }}
              >
                {script.name}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.6,
                  marginBottom: "1.5rem",
                  flexGrow: 1,
                }}
              >
                {script.description}
              </p>

              {/* Price + CTA */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: "auto",
                  paddingTop: "1.25rem",
                  borderTop: "1px solid rgba(147,51,234,0.1)",
                }}
              >
                <span
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: script.price === "Free"
                      ? "var(--color-accent)"
                      : script.tebexUrl
                      ? "var(--color-accent)"
                      : "var(--color-text-secondary)",
                  }}
                >
                  {script.price}
                </span>

                {script.tebexUrl ? (
                  <a
                    href={script.tebexUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: "#fff",
                      background: "var(--color-accent)",
                      padding: "0.4rem 1rem",
                      borderRadius: "9999px",
                      textDecoration: "none",
                      transition: "opacity 0.15s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.8" }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = "1" }}
                  >
                    View on Tebex →
                  </a>
                ) : (
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "rgba(160,160,160,0.4)",
                      fontStyle: "italic",
                    }}
                  >
                    Not yet listed
                  </span>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}
