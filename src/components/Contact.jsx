// src/components/Contact.jsx
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "@/components/ui/SplitText"
import { ScrollReveal } from "@/components/ui/ScrollReveal"

const DiscordIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="24"
    height="24"
    aria-hidden="true"
  >
    <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 13.83 13.83 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.175 13.175 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z" />
  </svg>
)

export function Contact() {
  const sectionRef = useRef(null)
  const glowRef = useRef(null)
  const btnRef = useRef(null)

  // Pulse animation on the ambient glow
  useEffect(() => {
    const el = glowRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.to(el, {
        opacity: 0.55,
        scale: 1.08,
        duration: 3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      })
    }, el)

    return () => ctx.revert()
  }, [])

  // Button hover glow — managed via CSS classes, GSAP handles scale snap
  const handleBtnEnter = () => {
    gsap.to(btnRef.current, { scale: 1.04, duration: 0.2, ease: "power2.out" })
  }
  const handleBtnLeave = () => {
    gsap.to(btnRef.current, { scale: 1, duration: 0.25, ease: "power2.inOut" })
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden"
      style={{ background: "var(--color-base)" }}
    >
      {/* Ambient purple glow behind CTA */}
      <div
        ref={glowRef}
        className="absolute pointer-events-none"
        style={{
          width: "640px",
          height: "640px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(147,51,234,0.28) 0%, rgba(124,58,237,0.12) 45%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          filter: "blur(60px)",
          opacity: 0.4,
          zIndex: 0,
        }}
      />

      {/* Content stack */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl mx-auto">

        {/* Eyebrow label */}
        <ScrollReveal delay={0} direction="up" distance={20}>
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase mb-6"
            style={{
              color: "var(--color-accent)",
              letterSpacing: "0.2em",
            }}
          >
            Get Started
          </span>
        </ScrollReveal>

        {/* Headline — SplitText stagger */}
        <SplitText
          tag="h2"
          className="font-bold leading-tight mb-5"
          style={{
            fontSize: "clamp(2.2rem, 5vw, 3.75rem)",
            color: "var(--color-text-primary)",
            textShadow: "0 0 40px rgba(147,51,234,0.25)",
          }}
          from="bottom"
          stagger={0.06}
          duration={0.75}
          start="top 88%"
        >
          Ready to level up your server?
        </SplitText>

        {/* Subtitle */}
        <ScrollReveal delay={0.15} direction="up" distance={24} start="top 88%">
          <p
            className="mb-10 text-lg leading-relaxed"
            style={{
              color: "var(--color-text-secondary)",
              maxWidth: "480px",
            }}
          >
            Let&apos;s talk about what your server needs. Drop into the Discord
            and we&apos;ll figure out the rest.
          </p>
        </ScrollReveal>

        {/* Primary CTA — Discord button */}
        <ScrollReveal delay={0.28} direction="up" distance={28} start="top 88%">
          <a
            ref={btnRef}
            href="https://discord.gg/hRZeHwWyHG"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={handleBtnEnter}
            onMouseLeave={handleBtnLeave}
            className="group inline-flex items-center gap-3 font-semibold select-none"
            style={{
              padding: "1rem 2.25rem",
              fontSize: "1.0625rem",
              borderRadius: "0.6rem",
              background: "var(--color-accent)",
              color: "#fff",
              border: "1px solid rgba(147,51,234,0.6)",
              boxShadow:
                "0 0 0 0 rgba(147,51,234,0), 0 4px 24px rgba(147,51,234,0.35)",
              transition: "box-shadow 0.25s ease, background 0.2s ease",
              textDecoration: "none",
              willChange: "transform",
              display: "inline-flex",
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow =
                "0 0 0 3px rgba(147,51,234,0.45), 0 4px 32px rgba(147,51,234,0.55)"
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow =
                "0 0 0 0 rgba(147,51,234,0), 0 4px 24px rgba(147,51,234,0.35)"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow =
                "0 0 0 2px rgba(147,51,234,0.5), 0 6px 40px rgba(147,51,234,0.6)"
              e.currentTarget.style.background = "#7c3aed"
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow =
                "0 0 0 0 rgba(147,51,234,0), 0 4px 24px rgba(147,51,234,0.35)"
              e.currentTarget.style.background = "var(--color-accent)"
            }}
          >
            <DiscordIcon />
            Join the Discord
          </a>
        </ScrollReveal>

        {/* Secondary text */}
        <ScrollReveal delay={0.38} direction="up" distance={16} start="top 88%">
          <p
            className="mt-5 text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Free to join &mdash; no obligations. We respond fast.
          </p>
        </ScrollReveal>
      </div>

      {/* Footer */}
      <div
        className="absolute bottom-0 left-0 right-0 flex flex-col items-center gap-2 pb-8 z-10"
        style={{ borderTop: "1px solid var(--color-border)", paddingTop: "1.5rem" }}
      >
        <ScrollReveal direction="up" distance={12} delay={0.45} start="top 95%">
          <div className="flex items-center gap-2">
            <span
              className="font-bold tracking-tight text-sm"
              style={{ color: "var(--color-text-primary)" }}
            >
              927 Development
            </span>
            <span
              className="text-xs"
              style={{ color: "var(--color-border)" }}
            >
              &mdash;
            </span>
            <span
              className="text-xs"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Premium FiveM scripting &amp; server builds
            </span>
          </div>
          <p
            className="text-xs text-center mt-1"
            style={{ color: "var(--color-text-secondary)", opacity: 0.5 }}
          >
            &copy; {new Date().getFullYear()} 927 Development. All rights reserved.
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}
