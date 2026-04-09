// src/components/Hero.jsx
import { useRef, useState, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Scene3D } from "@/components/ui/Scene3D"
import { SplitText } from "@/components/ui/SplitText"
import { ScrollReveal } from "@/components/ui/ScrollReveal"

/**
 * Full-viewport hero section.
 * - Three.js 927 scene as background
 * - GSAP ScrollTrigger scrub drives scrollProgress into Scene3D
 * - Floating gradient orbs drifting in background (CSS only)
 * - Tagline reveals with SplitText
 * - CTA button with pulse glow animation
 * - Animated bouncing scroll indicator
 */

// ─── Inline keyframe injection ────────────────────────────────────────────────
// We inject a <style> tag once so the Hero module is self-contained.
const HERO_STYLES = `
@keyframes hero-orb-drift-a {
  0%   { transform: translate(0px,   0px)   scale(1);    }
  33%  { transform: translate(40px,  -60px) scale(1.08); }
  66%  { transform: translate(-30px, 40px)  scale(0.95); }
  100% { transform: translate(0px,   0px)   scale(1);    }
}
@keyframes hero-orb-drift-b {
  0%   { transform: translate(0px,  0px)   scale(1);    }
  33%  { transform: translate(-50px, 30px) scale(1.05); }
  66%  { transform: translate(30px, -50px) scale(0.92); }
  100% { transform: translate(0px,  0px)   scale(1);    }
}
@keyframes hero-orb-drift-c {
  0%   { transform: translate(0px,  0px)   scale(1);    }
  50%  { transform: translate(60px, 20px)  scale(1.1);  }
  100% { transform: translate(0px,  0px)   scale(1);    }
}
@keyframes hero-cta-pulse {
  0%, 100% { box-shadow: 0 0 30px rgba(147,51,234,0.45), 0 0 60px rgba(147,51,234,0.18), 0 0 0px rgba(147,51,234,0); }
  50%       { box-shadow: 0 0 55px rgba(147,51,234,0.75), 0 0 110px rgba(147,51,234,0.35), 0 0 20px rgba(147,51,234,0.2); }
}
@keyframes hero-scroll-bounce {
  0%, 100% { transform: translateY(0px);  opacity: 0.9; }
  50%       { transform: translateY(10px); opacity: 0.5; }
}
@keyframes hero-scroll-line {
  0%   { transform: scaleY(0); transform-origin: top;    opacity: 1; }
  50%  { transform: scaleY(1); transform-origin: top;    opacity: 1; }
  51%  { transform: scaleY(1); transform-origin: bottom; opacity: 1; }
  100% { transform: scaleY(0); transform-origin: bottom; opacity: 0; }
}
`

let heroStylesInjected = false
function injectHeroStyles() {
  if (heroStylesInjected) return
  heroStylesInjected = true
  const el = document.createElement("style")
  el.textContent = HERO_STYLES
  document.head.appendChild(el)
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Hero() {
  const sectionRef = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    injectHeroStyles()
  }, [])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          setScrollProgress(self.progress)
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
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        background: "var(--color-base)",
      }}
    >
      {/* ── Floating gradient orbs (CSS, no Three.js) ── */}
      {/* Orb A — large purple, top-left quadrant */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "-10%",
          left: "-15%",
          width: "680px",
          height: "680px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(147,51,234,0.22) 0%, rgba(147,51,234,0.06) 55%, transparent 75%)",
          filter: "blur(60px)",
          animation: "hero-orb-drift-a 18s ease-in-out infinite",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      {/* Orb B — blue, bottom-right */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "-5%",
          right: "-10%",
          width: "560px",
          height: "560px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.18) 0%, rgba(59,130,246,0.05) 55%, transparent 75%)",
          filter: "blur(70px)",
          animation: "hero-orb-drift-b 22s ease-in-out infinite",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      {/* Orb C — smaller accent, center-right */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "30%",
          right: "5%",
          width: "360px",
          height: "360px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(168,85,247,0.15) 0%, rgba(168,85,247,0.04) 55%, transparent 75%)",
          filter: "blur(50px)",
          animation: "hero-orb-drift-c 14s ease-in-out infinite",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── Three.js canvas — fills entire hero ── */}
      <Scene3D
        scrollProgress={scrollProgress}
        className="absolute inset-0"
      />

      {/* ── Gradient overlay — darkens bottom so text reads cleanly ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent 35%, rgba(10,10,10,0.65) 65%, var(--color-base) 100%)",
          zIndex: 1,
        }}
        aria-hidden
      />

      {/* ── Content layer ── */}
      <div
        className="relative text-center px-6"
        style={{ maxWidth: "960px", zIndex: 2 }}
      >
        {/* Primary tagline — oversized and dominant */}
        <SplitText
          tag="h1"
          className="glow-purple"
          stagger={0.07}
          from="bottom"
          duration={0.9}
          start="top 90%"
          style={{
            fontSize: "clamp(3.5rem, 12vw, 9rem)",
            fontWeight: 900,
            letterSpacing: "-0.05em",
            lineHeight: 0.95,
            color: "var(--color-text-primary)",
            marginBottom: "1rem",
          }}
        >
          We Build Worlds
        </SplitText>

        {/* Secondary line — service descriptor */}
        <ScrollReveal direction="up" delay={0.2} duration={0.7}>
          <p
            style={{
              fontSize: "clamp(1rem, 2.2vw, 1.35rem)",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--color-accent)",
              marginBottom: "1.25rem",
              opacity: 0.9,
            }}
          >
            Custom FiveM Development
          </p>
        </ScrollReveal>

        {/* Sub tagline */}
        <ScrollReveal direction="up" delay={0.35} duration={0.8}>
          <p
            style={{
              fontSize: "clamp(0.95rem, 2vw, 1.15rem)",
              color: "var(--color-text-secondary)",
              marginBottom: "2.75rem",
              lineHeight: 1.65,
              maxWidth: "600px",
              margin: "0 auto 2.75rem",
            }}
          >
            Full servers, scripts, 3D assets, and infrastructure —
            built to run, not just launch.
          </p>
        </ScrollReveal>

        {/* CTA — pulsing glow */}
        <ScrollReveal direction="up" delay={0.5} duration={0.8}>
          <a
            href="https://discord.gg/hRZeHwWyHG"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              padding: "1.1rem 2.75rem",
              borderRadius: "9999px",
              background: "var(--color-accent)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "1.05rem",
              letterSpacing: "-0.01em",
              textDecoration: "none",
              animation: "hero-cta-pulse 2.4s ease-in-out infinite",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)"
              e.currentTarget.style.animation = "none"
              e.currentTarget.style.boxShadow = "0 0 60px rgba(147,51,234,0.8), 0 0 120px rgba(147,51,234,0.4)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)"
              e.currentTarget.style.animation = "hero-cta-pulse 2.4s ease-in-out infinite"
              e.currentTarget.style.boxShadow = ""
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
            </svg>
            Join Discord
          </a>
        </ScrollReveal>
      </div>

      {/* ── Scroll indicator — prominent bouncing arrow ── */}
      <ScrollReveal
        direction="up"
        delay={1.3}
        className="absolute"
        style={{
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
              color: "var(--color-text-secondary)",
              textTransform: "uppercase",
              opacity: 0.6,
            }}
          >
            scroll
          </span>
          {/* Animated line */}
          <div
            style={{
              width: "1px",
              height: "36px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(to bottom, var(--color-accent), rgba(147,51,234,0))",
                animation: "hero-scroll-line 1.8s ease-in-out infinite",
              }}
            />
          </div>
          {/* Bouncing chevron arrow */}
          <svg
            width="16"
            height="10"
            viewBox="0 0 16 10"
            fill="none"
            style={{
              animation: "hero-scroll-bounce 1.8s ease-in-out infinite",
              color: "var(--color-accent)",
            }}
            aria-hidden
          >
            <path
              d="M1 1L8 8L15 1"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </ScrollReveal>
    </section>
  )
}
