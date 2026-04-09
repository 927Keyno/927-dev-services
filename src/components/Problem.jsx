// src/components/Problem.jsx
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "./ui/SplitText"
import { ScrollReveal } from "./ui/ScrollReveal"
import { Counter } from "./ui/Counter"

gsap.registerPlugin(ScrollTrigger)

const PAIN_POINTS = [
  "Cookie-cutter configs. Leaked scripts. Zero optimization.",
  "Your players notice. Your pop count shows it.",
  "It's time for something built from the ground up.",
]

// ─── Dot Grid Background ──────────────────────────────────────────────────────
function DotGrid() {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage:
          "radial-gradient(circle, rgba(147,51,234,0.18) 1px, transparent 1px)",
        backgroundSize: "36px 36px",
        maskImage:
          "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  )
}

// ─── Headline with glitch/clip-path reveal ────────────────────────────────────
function GlitchHeadline({ children }) {
  const containerRef = useRef(null)
  const sweepRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    const sweep = sweepRef.current
    const text = textRef.current
    if (!container || !sweep || !text) return

    const ctx = gsap.context(() => {
      // Start state: text is invisible, sweep at left edge
      gsap.set(text, { opacity: 0 })
      gsap.set(sweep, { scaleX: 0, transformOrigin: "left center" })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      })

      // 1. Sweep the purple highlight bar across
      tl.to(sweep, {
        scaleX: 1,
        duration: 0.6,
        ease: "power3.inOut",
      })

      // 2. Snap text visible at midpoint
      tl.to(
        text,
        { opacity: 1, duration: 0.01 },
        "-=0.3"
      )

      // 3. Short glitch burst on the text
      tl.to(
        text,
        {
          keyframes: [
            { x: -4, skewX: 2, duration: 0.04 },
            { x: 3, skewX: -2, duration: 0.04 },
            { x: -2, skewX: 1, duration: 0.03 },
            { x: 0, skewX: 0, duration: 0.03 },
          ],
        },
        "-=0.2"
      )

      // 4. Sweep bar retracts to the right
      tl.to(sweep, {
        scaleX: 0,
        transformOrigin: "right center",
        duration: 0.5,
        ease: "power3.inOut",
      })
    }, container)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", display: "inline-block", maxWidth: "100%" }}
    >
      {/* Purple sweep bar — sits behind text */}
      <div
        ref={sweepRef}
        aria-hidden
        style={{
          position: "absolute",
          inset: "0 -4px",
          background:
            "linear-gradient(90deg, var(--color-accent) 0%, rgba(147,51,234,0.4) 100%)",
          borderRadius: "2px",
          zIndex: 1,
          mixBlendMode: "screen",
        }}
      />

      {/* Actual headline text */}
      <h2
        ref={textRef}
        className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
        style={{
          color: "var(--color-text-primary)",
          letterSpacing: "-0.03em",
          position: "relative",
          zIndex: 2,
        }}
      >
        {children}
      </h2>
    </div>
  )
}

// ─── Animated divider line ────────────────────────────────────────────────────
function DrawLine({ delay = 0 }) {
  const lineRef = useRef(null)

  useEffect(() => {
    const el = lineRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.from(el, {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 0.8,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      })
    }, el)

    return () => ctx.revert()
  }, [delay])

  return (
    <div
      ref={lineRef}
      style={{
        height: "1px",
        width: "100%",
        background:
          "linear-gradient(90deg, var(--color-accent) 0%, rgba(147,51,234,0.15) 100%)",
        opacity: 0.5,
      }}
    />
  )
}

// ─── Parallax 927 watermark ───────────────────────────────────────────────────
function WatermarkParallax() {
  const wrapRef = useRef(null)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.to(el, {
        y: -120,
        ease: "none",
        scrollTrigger: {
          trigger: el.closest("section"),
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={wrapRef}
      aria-hidden
      style={{
        position: "absolute",
        right: "-5%",
        top: "50%",
        transform: "translateY(-50%)",
        fontSize: "clamp(10rem, 22vw, 22rem)",
        fontWeight: 900,
        letterSpacing: "-0.06em",
        color: "var(--color-text-primary)",
        opacity: 0.025,
        lineHeight: 1,
        userSelect: "none",
        pointerEvents: "none",
        zIndex: 0,
        whiteSpace: "nowrap",
      }}
    >
      927
    </div>
  )
}

// ─── Main section ─────────────────────────────────────────────────────────────
export function Problem() {
  return (
    <section
      className="section flex flex-col justify-center px-6 md:px-16 lg:px-32"
      style={{
        background: "var(--color-base)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Dot grid — ambient background texture */}
      <DotGrid />

      {/* Parallax 927 watermark */}
      <WatermarkParallax />

      {/* All content lives above bg layers */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Headline with glitch reveal */}
        <div className="max-w-4xl mb-20">
          <GlitchHeadline>
            Your server deserves more than drag-and-drop scripts.
          </GlitchHeadline>
        </div>

        {/* Pain point lines — SplitText with draw lines between */}
        <div className="max-w-2xl flex flex-col gap-0">
          {PAIN_POINTS.map((line, i) => (
            <div key={i}>
              {/* Divider above first item too */}
              <DrawLine delay={i * 0.12} />

              <div style={{ padding: "1.5rem 0" }}>
                <ScrollReveal
                  direction="up"
                  distance={30}
                  delay={i * 0.15}
                  duration={0.7}
                  start="top 85%"
                >
                  <p
                    className="text-xl md:text-2xl font-medium"
                    style={{
                      color:
                        i === PAIN_POINTS.length - 1
                          ? "var(--color-accent)"
                          : "var(--color-text-secondary)",
                      lineHeight: 1.5,
                    }}
                  >
                    {line}
                  </p>
                </ScrollReveal>
              </div>
            </div>
          ))}

          {/* Final divider after last pain point */}
          <DrawLine delay={PAIN_POINTS.length * 0.12} />
        </div>

        {/* Stat block */}
        <ScrollReveal
          direction="up"
          distance={40}
          delay={0.3}
          duration={0.9}
          start="top 88%"
          className="mt-20"
        >
          <div
            style={{
              display: "inline-flex",
              flexDirection: "column",
              gap: "0.4rem",
            }}
          >
            <div
              style={{
                fontSize: "clamp(4rem, 10vw, 7rem)",
                color: "var(--color-accent)",
                letterSpacing: "-0.04em",
                lineHeight: 1,
                fontWeight: 900,
              }}
            >
              <Counter
                target={98}
                suffix="%"
                duration={2.4}
                start="top 88%"
              />
            </div>
            <p
              style={{
                fontSize: "clamp(0.85rem, 2vw, 1rem)",
                color: "var(--color-text-secondary)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              of FiveM servers run the same 10 scripts
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
