import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Background3D } from "@/components/ui/Background3D"
import cursorImg from "@/assets/927-cursor-lg.png"
import { BorderBeam } from "@/components/ui/BorderBeam"
import { ShinyText } from "@/components/ui/ShinyText"
import { HyperText } from "@/components/ui/HyperText"
import { TiltCard } from "@/components/ui/TiltCard"
import { BootSequence } from "@/components/ui/BootSequence"

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function IconDiscord() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function IconClickUp() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M3.727 14.118l3.472-2.659c1.554 2.035 3.156 2.985 4.874 2.985 1.735 0 3.286-.923 4.83-2.923l3.443 2.724C17.926 17.407 15.462 19 12.073 19c-3.372 0-5.865-1.61-8.346-4.882z" />
      <path d="M12.103 7.354l-6.234 5.19L3.727 14.118l3.472-2.659 4.874-4.053 4.86 4.091 3.443-2.724-4.86-4.091z" opacity="0.4" />
    </svg>
  )
}

// ─── Shared Styles ────────────────────────────────────────────────────────────

const panelStyle = {
  background: "rgba(5, 5, 5, 0.75)",
  border: "1px solid rgba(255, 255, 255, 0.10)",
  borderRadius: 14,
  boxShadow:
    "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(5,5,5,0.80), inset 0 -1px 0 rgba(255,255,255,0.02)",
}

const sectionAnim = {
  initial: { opacity: 0, y: 30, filter: "blur(6px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.6, ease: "easeOut" },
  viewport: { once: true, margin: "-50px" },
}

// ─── Feature Item ─────────────────────────────────────────────────────────────

function FeatureItem({ text, accent }) {
  return (
    <li
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        padding: "7px 0",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        fontSize: 13,
        color: "rgba(255,255,255,0.72)",
        textShadow: "0 1px 8px rgba(0,0,0,0.95), 0 0 16px rgba(0,0,0,0.5)",
        lineHeight: 1.5,
        listStyle: "none",
      }}
    >
      <span style={{ color: accent || "#00e5ff", marginTop: 3, flexShrink: 0 }}>
        <IconCheck />
      </span>
      {text}
    </li>
  )
}

// ─── Pricing Card ─────────────────────────────────────────────────────────────

function PricingCard({ tier, price, hours, features, blurb, excludes, isPopular, beamFrom, beamTo, yOffset }) {
  return (
    <TiltCard
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 14,
        padding: isPopular ? "34px 28px 28px" : "26px 24px 24px",
        display: "flex",
        flexDirection: "column",
        background: isPopular
          ? "rgba(5, 5, 5, 0.80)"
          : "rgba(5, 5, 5, 0.75)",
        border: isPopular
          ? "1px solid rgba(74,222,128,0.28)"
          : "1px solid rgba(255,255,255,0.10)",
        boxShadow: isPopular
          ? "0 8px 40px rgba(0,0,0,0.5), 0 0 60px rgba(74,222,128,0.07), inset 0 1px 0 rgba(255,255,255,0.06)"
          : "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
        transform: `translateY(${yOffset || 0}px)`,
        transition: "box-shadow 0.2s ease",
      }}
    >
      <BorderBeam colorFrom={beamFrom} colorTo={beamTo} duration={7} size={isPopular ? 80 : 60} />

      {isPopular && (
        <div
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            background: "rgba(74,222,128,0.10)",
            border: "1px solid rgba(74,222,128,0.35)",
            borderRadius: 20,
            padding: "3px 10px",
            fontSize: 10,
            fontWeight: 700,
            color: "#4ade80",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            textShadow: "0 0 12px rgba(74,222,128,0.5)",
          }}
        >
          Most Popular
        </div>
      )}

      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.3)",
          marginBottom: 10,
          textShadow: "0 1px 6px rgba(0,0,0,1), 0 0 14px rgba(0,0,0,0.5)",
        }}
      >
        {tier}
      </div>

      <div
        style={{
          fontSize: isPopular ? 28 : 24,
          fontWeight: 800,
          color: isPopular ? "#4ade80" : "#ffffff",
          textShadow: isPopular
            ? "0 0 24px rgba(74,222,128,0.4), 0 2px 8px rgba(0,0,0,0.7)"
            : "0 2px 12px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,1), 0 0 20px rgba(0,0,0,0.6)",
          lineHeight: 1.15,
          marginBottom: 4,
        }}
      >
        {price}
      </div>

      <div
        style={{
          fontSize: 12,
          color: "rgba(255,255,255,0.35)",
          marginBottom: 18,
          textShadow: "0 1px 4px rgba(0,0,0,0.7)",
          fontFamily: "Consolas, 'Courier New', monospace",
        }}
      >
        {hours}
      </div>

      <ul style={{ margin: 0, padding: 0, flex: 1 }}>
        {features.map((f, i) => (
          <FeatureItem key={i} text={f} accent={isPopular ? "#4ade80" : "#00e5ff"} />
        ))}
      </ul>

      <div
        style={{
          marginTop: 18,
          marginBottom: 20,
          fontSize: 12,
          color: "rgba(255,255,255,0.45)",
          lineHeight: 1.6,
          fontStyle: "italic",
          textShadow: "0 1px 8px rgba(0,0,0,0.95), 0 0 16px rgba(0,0,0,0.5)",
          padding: "12px 14px",
          background: "rgba(255,255,255,0.03)",
          borderRadius: 8,
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {blurb}
      </div>

      {excludes && (
        <div style={{
          fontSize: 11,
          color: "rgba(255,255,255,0.3)",
          fontFamily: "Consolas, 'Courier New', monospace",
          marginBottom: 20,
          padding: "8px 12px",
          background: "rgba(255,255,255,0.02)",
          borderRadius: 6,
          border: "1px solid rgba(255,255,255,0.04)",
          textShadow: "0 1px 6px rgba(0,0,0,1), 0 0 14px rgba(0,0,0,0.5)",
          lineHeight: 1.5,
        }}>
          {excludes}
        </div>
      )}

      <a
        href="https://discord.gg/hRZeHwWyHG"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: "12px 20px",
          borderRadius: 8,
          background: isPopular ? "rgba(74,222,128,0.15)" : "rgba(5,5,5,0.80)",
          border: isPopular ? "1px solid rgba(74,222,128,0.4)" : "1px solid rgba(255,255,255,0.12)",
          color: isPopular ? "#4ade80" : "#ffffff",
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "0.06em",
          textDecoration: "none",
          textShadow: isPopular ? "0 0 12px rgba(74,222,128,0.4)" : "0 1px 8px rgba(0,0,0,0.95), 0 0 16px rgba(0,0,0,0.5)",
          cursor: "pointer",
          transition: "background 0.2s ease, border-color 0.2s ease",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = isPopular ? "rgba(74,222,128,0.22)" : "rgba(255,255,255,0.10)"
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = isPopular ? "rgba(74,222,128,0.15)" : "rgba(5,5,5,0.80)"
        }}
      >
        <IconDiscord />
        Get Started
      </a>
    </TiltCard>
  )
}

// ─── Terminal Line ─────────────────────────────────────────────────────────────

function TerminalLine({ children, delay = 0, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: "easeOut", delay }}
      viewport={{ once: true }}
      style={{
        fontFamily: "Consolas, 'Courier New', monospace",
        fontSize: 13,
        lineHeight: 1.8,
        color: color || "rgba(255,255,255,0.7)",
        textShadow: "0 1px 8px rgba(0,0,0,0.95), 0 0 16px rgba(0,0,0,0.5)",
        whiteSpace: "pre",
      }}
    >
      {children}
    </motion.div>
  )
}

// ─── Scroll Indicator ─────────────────────────────────────────────────────────

function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.6 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        marginTop: 56,
      }}
    >
      <span style={{
        fontSize: 10,
        letterSpacing: "0.2em",
        color: "rgba(255,255,255,0.25)",
        textTransform: "uppercase",
        fontFamily: "Consolas, 'Courier New', monospace",
        textShadow: "0 1px 6px rgba(0,0,0,1), 0 0 14px rgba(0,0,0,0.5)",
      }}>
        scroll
      </span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        style={{
          width: 1,
          height: 40,
          background: "linear-gradient(to bottom, rgba(0,229,255,0.6), transparent)",
          borderRadius: 1,
        }}
      />
    </motion.div>
  )
}

// ─── Section Label ─────────────────────────────────────────────────────────────

function SectionLabel({ children, color }) {
  return (
    <div style={{
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: "0.22em",
      textTransform: "uppercase",
      color: color || "#00e5ff",
      textShadow: "0 0 12px rgba(0,229,255,0.4)",
      marginBottom: 10,
      fontFamily: "Consolas, 'Courier New', monospace",
    }}>
      {children}
    </div>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [booted, setBooted] = useState(false)
  const cursorRef = useRef(null)

  useEffect(() => {
    const move = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX - 48}px`
        cursorRef.current.style.top = `${e.clientY - 48}px`
        cursorRef.current.style.opacity = '0.85'
      }
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #0a0a0a 0%, #0d0d0d 50%, #111111 100%)",
        color: "#ffffff",
        fontFamily: "Arial, sans-serif",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      {/* JS Cursor follower — 96px 927 logo */}
      <img
        ref={cursorRef}
        src={cursorImg}
        alt=""
        draggable={false}
        style={{
          position: 'fixed',
          left: -100,
          top: -100,
          width: 96,
          height: 96,
          pointerEvents: 'none',
          zIndex: 9999,
          filter: 'drop-shadow(0 0 12px rgba(0,229,255,0.3))',
          opacity: 0,
          userSelect: 'none',
        }}
      />

      {/* 3D Background */}
      <Background3D />

      {/* Boot Sequence */}
      <AnimatePresence>
        {!booted && (
          <motion.div
            key="boot"
            exit={{ opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            style={{ position: "fixed", inset: 0, zIndex: 100 }}
          >
            <BootSequence onComplete={() => setBooted(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page content */}
      <AnimatePresence>
        {booted && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ position: "relative", zIndex: 1 }}
          >
            {/* ── HERO ──────────────────────────────────────────────────────── */}
            <section
              style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "80px 24px 60px",
              }}
            >
              {/* Top accent line */}
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                style={{
                  width: 1,
                  height: 60,
                  background: "linear-gradient(to bottom, transparent, rgba(0,229,255,0.5))",
                  marginBottom: 40,
                }}
              />

              {/* Logo */}
              <motion.img
                src={`${import.meta.env.BASE_URL}927-logo.png`}
                alt="927"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
                style={{
                  height: 72,
                  marginBottom: 20,
                  filter: "invert(1) drop-shadow(0 0 20px rgba(255,255,255,0.15))",
                  userSelect: "none",
                }}
              />

              {/* Sub-label */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.3em",
                  color: "rgba(0,229,255,0.6)",
                  textTransform: "uppercase",
                  marginBottom: 36,
                  fontFamily: "Consolas, 'Courier New', monospace",
                  textShadow: "0 0 16px rgba(0,229,255,0.3)",
                }}
              >
                Development Studio
              </motion.div>

              {/* Main headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
                style={{
                  fontSize: "clamp(26px, 5vw, 46px)",
                  fontWeight: 800,
                  lineHeight: 1.2,
                  maxWidth: 720,
                  margin: "0 auto 16px",
                  textShadow: "0 2px 12px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,1), 0 0 20px rgba(0,0,0,0.6)",
                  letterSpacing: "-0.01em",
                }}
              >
                <HyperText duration={900} delay={200}>
                  Monthly Development Retainer Packages
                </HyperText>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: 0.6, ease: "easeOut" }}
                style={{
                  fontSize: 16,
                  color: "rgba(255,255,255,0.5)",
                  maxWidth: 480,
                  margin: "0 auto",
                  lineHeight: 1.7,
                  textShadow: "0 1px 8px rgba(0,0,0,0.95), 0 0 16px rgba(0,0,0,0.5)",
                }}
              >
                Professional FiveM Development &amp; Technical Services
              </motion.p>

              <ScrollIndicator />
            </section>

            {/* ── PRICING ───────────────────────────────────────────────────── */}
            <motion.section
              {...sectionAnim}
              style={{ padding: "80px 24px 100px", maxWidth: 1200, margin: "0 auto" }}
            >
              <div style={{ textAlign: "center", marginBottom: 64 }}>
                <SectionLabel>// pricing tiers</SectionLabel>
                <h2 style={{
                  fontSize: "clamp(22px, 3.5vw, 36px)",
                  fontWeight: 800,
                  margin: 0,
                  textShadow: "0 2px 12px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,1), 0 0 20px rgba(0,0,0,0.6)",
                }}>
                  <ShinyText>Choose Your Tier</ShinyText>
                </h2>
              </div>

              {/* Staggered asymmetric card layout */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: 24,
                  alignItems: "start",
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, ease: "easeOut", delay: 0 }}
                  viewport={{ once: true }}
                  style={{ marginTop: 40 }}
                >
                  <PricingCard
                    tier="Support & Maintenance"
                    price="$450 – $500/mo"
                    hours="12 – 16 hrs/month"
                    yOffset={0}
                    beamFrom="#00e5ff"
                    beamTo="#0066ff"
                    features={[
                      "Script debugging & crash/log analysis",
                      "Performance optimization & tuning",
                      "Configuration adjustments",
                      "Framework integration (ESX, QBox, OX)",
                      "Minor UI/NUI adjustments",
                      "Security review & server stability",
                    ]}
                    blurb="Best for servers that already know what they're doing and just need a real developer to step in when something breaks or needs optimizing."
                    excludes="Excludes: mapping, custom systems, weapons, textures, or 3D asset work."
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, ease: "easeOut", delay: 0.12 }}
                  viewport={{ once: true }}
                  style={{ marginTop: 0 }}
                >
                  <PricingCard
                    tier="Developer"
                    price="$650 – $750/mo"
                    hours="24 – 30 hrs/month"
                    isPopular
                    yOffset={0}
                    beamFrom="#4ade80"
                    beamTo="#00e5ff"
                    features={[
                      "Custom script development",
                      "System integration & database work",
                      "Weapon balancing & texture edits",
                      "Map merging & placement (YMAP/IPL/collisions)",
                      "Housing offsets & NUI/UI customization",
                      "Optimization & exploit prevention",
                    ]}
                    blurb="For servers that want an active developer building, fixing, and improving systems on a regular basis — not just putting out fires."
                    excludes="Limits: No MLOs from scratch, no heavy 3D modeling, no full framework rewrites."
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, ease: "easeOut", delay: 0.24 }}
                  viewport={{ once: true }}
                  style={{ marginTop: 40 }}
                >
                  <PricingCard
                    tier="Lead Developer"
                    price="$1,000 – $1,200/mo"
                    hours="45 – 60 hrs/month"
                    yOffset={0}
                    beamFrom="#fbbf24"
                    beamTo="#ff6b00"
                    features={[
                      "Full system design (phones, banks, admin, gangs, jobs)",
                      "Advanced optimization & profiling",
                      "Security architecture & exploit prevention",
                      "Weapon systems & asset streaming optimization",
                      "Custom UI frameworks",
                      "Server architecture planning",
                    ]}
                    blurb="For servers that want me acting as their main developer and technical lead — handling complex systems, performance, and long-term architecture."
                    excludes="Excludes: MLO creation from scratch."
                  />
                </motion.div>
              </div>

              {/* Tier comparison note */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                viewport={{ once: true }}
                style={{
                  textAlign: "center",
                  marginTop: 48,
                  fontSize: 12,
                  color: "rgba(255,255,255,0.3)",
                  fontFamily: "Consolas, 'Courier New', monospace",
                  textShadow: "0 1px 6px rgba(0,0,0,1), 0 0 14px rgba(0,0,0,0.5)",
                }}
              >
                all tiers · payment in advance · hours reset monthly · no MLOs from scratch
              </motion.div>
            </motion.section>

            {/* ── WORKFLOW ──────────────────────────────────────────────────── */}
            <motion.section {...sectionAnim} style={{ padding: "60px 24px", maxWidth: 860, margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: 40 }}>
                <SectionLabel>// workflow</SectionLabel>
                <h2 style={{
                  fontSize: "clamp(20px, 3vw, 30px)",
                  fontWeight: 800,
                  margin: 0,
                  textShadow: "0 2px 12px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,1), 0 0 20px rgba(0,0,0,0.6)",
                }}>
                  How We Operate
                </h2>
              </div>

              <div style={{ ...panelStyle, padding: "28px 32px", position: "relative", overflow: "hidden" }}>
                <BorderBeam colorFrom="#00e5ff" colorTo="#4ade80" duration={10} size={100} />

                {/* Terminal header bar */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  marginBottom: 24,
                  paddingBottom: 16,
                  borderBottom: "1px solid rgba(5,5,5,0.80)",
                }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(255,95,86,0.7)" }} />
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(255,189,46,0.7)" }} />
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(39,201,63,0.7)" }} />
                  <span style={{
                    marginLeft: 8,
                    fontSize: 11,
                    color: "rgba(255,255,255,0.2)",
                    fontFamily: "Consolas, 'Courier New', monospace",
                    letterSpacing: "0.05em",
                  }}>
                    927-dev — bash
                  </span>
                </div>

                <TerminalLine delay={0} color="#00e5ff">
                  {`$ 927 --workflow status`}
                </TerminalLine>
                <TerminalLine delay={0.1} color="rgba(255,255,255,0.25)">
                  {`> initializing workflow config...`}
                </TerminalLine>
                <div style={{ marginTop: 16 }} />

                <TerminalLine delay={0.2}>
                  <span style={{ color: "rgba(255,255,255,0.4)" }}>TASK_TRACKING       </span>
                  <span style={{ color: "rgba(255,255,255,0.6)" }}>= ClickUp          </span>
                  <span style={{ color: "#4ade80", textShadow: "0 0 10px rgba(74,222,128,0.4)" }}>[EXCLUSIVE]</span>
                </TerminalLine>

                <TerminalLine delay={0.32}>
                  <span style={{ color: "rgba(255,255,255,0.4)" }}>PRIORITIES          </span>
                  <span style={{ color: "rgba(255,255,255,0.6)" }}>= ClickUp          </span>
                  <span style={{ color: "#4ade80", textShadow: "0 0 10px rgba(74,222,128,0.4)" }}>[ACTIVE]</span>
                </TerminalLine>

                <TerminalLine delay={0.44}>
                  <span style={{ color: "rgba(255,255,255,0.4)" }}>TIMELINES           </span>
                  <span style={{ color: "rgba(255,255,255,0.6)" }}>= ClickUp          </span>
                  <span style={{ color: "#4ade80", textShadow: "0 0 10px rgba(74,222,128,0.4)" }}>[ACTIVE]</span>
                </TerminalLine>

                <TerminalLine delay={0.56}>
                  <span style={{ color: "rgba(255,255,255,0.4)" }}>AVAILABILITY        </span>
                  <span style={{ color: "rgba(255,255,255,0.6)" }}>= contracted       </span>
                  <span style={{ color: "#fbbf24", textShadow: "0 0 10px rgba(251,191,36,0.4)" }}>[NOT ON-CALL]</span>
                </TerminalLine>

                <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <TerminalLine delay={0.68} color="rgba(255,255,255,0.2)">
                    {`> all systems operational`}
                  </TerminalLine>
                </div>

                {/* ClickUp note */}
                <div style={{
                  marginTop: 20,
                  padding: "12px 14px",
                  background: "rgba(255,255,255,0.025)",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.05)",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                }}>
                  <span style={{ color: "#00e5ff", marginTop: 1 }}>
                    <IconClickUp />
                  </span>
                  <span style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.4)",
                    lineHeight: 1.6,
                    textShadow: "0 1px 8px rgba(0,0,0,0.95), 0 0 16px rgba(0,0,0,0.5)",
                  }}>
                    I operate as a contracted developer, not on-call staff. Communication is professional, scheduled, and efficient. Issues are logged in ClickUp, discussed as needed, and resolved within your tier's response times.
                  </span>
                </div>
              </div>
            </motion.section>

            {/* ── PAYMENT ───────────────────────────────────────────────────── */}
            <motion.section {...sectionAnim} style={{ padding: "60px 24px", maxWidth: 860, margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: 40 }}>
                <SectionLabel>// payment</SectionLabel>
                <h2 style={{
                  fontSize: "clamp(20px, 3vw, 30px)",
                  fontWeight: 800,
                  margin: 0,
                  textShadow: "0 2px 12px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,1), 0 0 20px rgba(0,0,0,0.6)",
                }}>
                  Billing & Payment
                </h2>
              </div>

              <div style={{ ...panelStyle, padding: "28px 32px", position: "relative", overflow: "hidden" }}>
                <BorderBeam colorFrom="#fbbf24" colorTo="#00e5ff" duration={9} size={100} />

                {/* Terminal header bar */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  marginBottom: 24,
                  paddingBottom: 16,
                  borderBottom: "1px solid rgba(5,5,5,0.80)",
                }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(255,95,86,0.7)" }} />
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(255,189,46,0.7)" }} />
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(39,201,63,0.7)" }} />
                  <span style={{
                    marginLeft: 8,
                    fontSize: 11,
                    color: "rgba(255,255,255,0.2)",
                    fontFamily: "Consolas, 'Courier New', monospace",
                    letterSpacing: "0.05em",
                  }}>
                    927-dev — bash
                  </span>
                </div>

                <TerminalLine delay={0} color="#00e5ff">
                  {`$ 927 --payment config`}
                </TerminalLine>
                <div style={{ marginTop: 16 }} />

                <TerminalLine delay={0.1} color="rgba(255,255,255,0.5)">
                  ACCEPTED_METHODS:
                </TerminalLine>

                <TerminalLine delay={0.2}>
                  <span style={{ color: "rgba(255,255,255,0.3)" }}>  {"├── "}</span>
                  <span style={{ color: "rgba(255,255,255,0.5)" }}>CashApp   → </span>
                  <a
                    href="https://cash.app/$927kxyno"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#4ade80",
                      textDecoration: "none",
                      textShadow: "0 0 10px rgba(74,222,128,0.4)",
                      cursor: "pointer",
                    }}
                    onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                    onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
                  >
                    $927kxyno
                  </a>
                </TerminalLine>

                <TerminalLine delay={0.3}>
                  <span style={{ color: "rgba(255,255,255,0.3)" }}>  {"└── "}</span>
                  <span style={{ color: "rgba(255,255,255,0.5)" }}>Tebex    → </span>
                  <a
                    href="https://927-mods.tebex.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#00e5ff",
                      textDecoration: "none",
                      textShadow: "0 0 10px rgba(0,229,255,0.4)",
                      cursor: "pointer",
                    }}
                    onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                    onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
                  >
                    927-mods.tebex.io
                  </a>
                </TerminalLine>

                <div style={{ marginTop: 20 }} />

                <TerminalLine delay={0.42} color="rgba(255,255,255,0.5)">
                  TERMS:
                </TerminalLine>

                <TerminalLine delay={0.5}>
                  <span style={{ color: "rgba(255,255,255,0.3)" }}>  PAYMENT_DUE    </span>
                  <span style={{ color: "rgba(255,255,255,0.55)" }}>= in advance, before work begins</span>
                </TerminalLine>

                <TerminalLine delay={0.58}>
                  <span style={{ color: "rgba(255,255,255,0.3)" }}>  HOURS          </span>
                  <span style={{ color: "rgba(255,255,255,0.55)" }}>= do not roll over</span>
                </TerminalLine>

                <TerminalLine delay={0.66}>
                  <span style={{ color: "rgba(255,255,255,0.3)" }}>  SCOPE          </span>
                  <span style={{ color: "rgba(255,255,255,0.55)" }}>= limited to selected tier</span>
                </TerminalLine>

                <TerminalLine delay={0.74}>
                  <span style={{ color: "rgba(255,255,255,0.3)" }}>  PLANNING       </span>
                  <span style={{ color: "rgba(255,255,255,0.55)" }}>= coordinated through ClickUp</span>
                </TerminalLine>
              </div>
            </motion.section>

            {/* ── SOCIAL PROOF ──────────────────────────────────────────────── */}
            <motion.section {...sectionAnim} style={{ padding: "60px 24px", maxWidth: 860, margin: "0 auto" }}>
              <div
                style={{
                  ...panelStyle,
                  padding: "32px 36px",
                  textAlign: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <BorderBeam colorFrom="#4ade80" colorTo="#00e5ff" duration={8} size={120} />

                <div style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  color: "rgba(255,255,255,0.2)",
                  textTransform: "uppercase",
                  marginBottom: 16,
                  fontFamily: "Consolas, 'Courier New', monospace",
                }}>
                  // tech stack
                </div>

                <p style={{
                  fontSize: "clamp(15px, 2.5vw, 20px)",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.82)",
                  lineHeight: 1.7,
                  margin: "0 0 24px",
                  textShadow: "0 2px 12px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,1), 0 0 20px rgba(0,0,0,0.6)",
                }}>
                  Full-stack FiveM development across every major framework.
                </p>

                <div style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: 10,
                }}>
                  {["ESX", "QBCore", "QBox", "ox_inventory", "ox_lib", "MySQL", "NUI / React", "Full-Stack Lua"].map((tech) => (
                    <span key={tech} style={{
                      fontSize: 12,
                      fontFamily: "Consolas, 'Courier New', monospace",
                      color: "rgba(0,229,255,0.7)",
                      background: "rgba(0,229,255,0.06)",
                      border: "1px solid rgba(0,229,255,0.15)",
                      borderRadius: 6,
                      padding: "6px 14px",
                      textShadow: "0 0 10px rgba(0,229,255,0.2)",
                      letterSpacing: "0.05em",
                    }}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* ── CTA + FOOTER ──────────────────────────────────────────────── */}
            <motion.section
              {...sectionAnim}
              style={{
                padding: "80px 24px 120px",
                maxWidth: 700,
                margin: "0 auto",
                textAlign: "center",
              }}
            >
              {/* Divider line */}
              <div style={{
                width: 1,
                height: 60,
                background: "linear-gradient(to bottom, rgba(74,222,128,0.4), transparent)",
                margin: "0 auto 48px",
              }} />

              <p style={{
                fontSize: 11,
                letterSpacing: "0.22em",
                color: "rgba(255,255,255,0.2)",
                textTransform: "uppercase",
                marginBottom: 20,
                fontFamily: "Consolas, 'Courier New', monospace",
              }}>
                // ready?
              </p>

              <h2 style={{
                fontSize: "clamp(24px, 4vw, 40px)",
                fontWeight: 800,
                lineHeight: 1.2,
                margin: "0 0 40px",
                textShadow: "0 2px 12px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,1), 0 0 20px rgba(0,0,0,0.6)",
              }}>
                Ready to level up your server?
              </h2>

              <a
                href="https://discord.gg/hRZeHwWyHG"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "16px 36px",
                  borderRadius: 10,
                  background: "rgba(74,222,128,0.12)",
                  border: "1px solid rgba(74,222,128,0.4)",
                  color: "#4ade80",
                  fontSize: 16,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textDecoration: "none",
                  textShadow: "0 0 16px rgba(74,222,128,0.4), 0 1px 8px rgba(0,0,0,0.95), 0 0 16px rgba(0,0,0,0.5)",
                  boxShadow: "0 0 40px rgba(74,222,128,0.08)",
                  transition: "background 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(74,222,128,0.20)"
                  e.currentTarget.style.boxShadow = "0 0 60px rgba(74,222,128,0.15)"
                  e.currentTarget.style.borderColor = "rgba(74,222,128,0.6)"
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "rgba(74,222,128,0.12)"
                  e.currentTarget.style.boxShadow = "0 0 40px rgba(74,222,128,0.08)"
                  e.currentTarget.style.borderColor = "rgba(74,222,128,0.4)"
                }}
              >
                <IconDiscord />
                Join the Discord
              </a>

              {/* Footer tagline */}
              <div style={{ marginTop: 64, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                <img
                  src={`${import.meta.env.BASE_URL}927-logo.png`}
                  alt="927"
                  style={{
                    height: 32,
                    filter: "invert(1) opacity(0.2)",
                    userSelect: "none",
                  }}
                />
                <p style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.2)",
                  margin: 0,
                  textShadow: "0 1px 6px rgba(0,0,0,1), 0 0 14px rgba(0,0,0,0.5)",
                  letterSpacing: "0.04em",
                }}>
                  Real servers. Real code. Real results.
                </p>
              </div>
            </motion.section>

            {/* ── FIXED BOTTOM HUD ──────────────────────────────────────────── */}
            <div
              style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                height: 36,
                background: "rgba(10, 10, 10, 0.80)",
                borderTop: "1px solid rgba(255, 255, 255, 0.07)",
                boxShadow: "0 -4px 24px rgba(0,0,0,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 20px",
                zIndex: 50,
              }}
            >
              <span
                style={{
                  fontFamily: "Consolas, 'Courier New', monospace",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                  color: "rgba(255,255,255,0.18)",
                  textShadow: "0 1px 6px rgba(0,0,0,1), 0 0 14px rgba(0,0,0,0.5)",
                }}
              >
                927 DEV SYSTEMS
              </span>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <motion.div
                  animate={{ opacity: [1, 0.25, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#4ade80",
                    boxShadow: "0 0 8px rgba(74,222,128,0.8)",
                  }}
                />
                <span
                  style={{
                    fontFamily: "Consolas, 'Courier New', monospace",
                    fontSize: 11,
                    color: "rgba(255,255,255,0.25)",
                    letterSpacing: "0.1em",
                    textShadow: "0 1px 6px rgba(0,0,0,1), 0 0 14px rgba(0,0,0,0.5)",
                  }}
                >
                  STATUS: ONLINE
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
