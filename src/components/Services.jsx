// src/components/Services.jsx
import { useRef, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ServiceCard } from "@/components/ServiceCard"

gsap.registerPlugin(ScrollTrigger)

// ─── Per-service background layers ────────────────────────────────────────────

function BlueprintBg() {
  return (
    <svg
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", inset: 0 }}
    >
      <defs>
        <pattern id="grid-small" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(147,51,234,0.07)" strokeWidth="0.5" />
        </pattern>
        <pattern id="grid-large" width="200" height="200" patternUnits="userSpaceOnUse">
          <rect width="200" height="200" fill="url(#grid-small)" />
          <path d="M 200 0 L 0 0 0 200" fill="none" stroke="rgba(147,51,234,0.15)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-large)" />
      {/* Blueprint dimension lines */}
      {[15, 30, 50, 70, 85].map((pct, i) => (
        <line
          key={i}
          x1={`${pct}%`} y1="0" x2={`${pct}%`} y2="100%"
          stroke="rgba(147,51,234,0.04)"
          strokeWidth="1"
          strokeDasharray="8 16"
        />
      ))}
      {[20, 40, 60, 80].map((pct, i) => (
        <line
          key={i}
          x1="0" y1={`${pct}%`} x2="100%" y2={`${pct}%`}
          stroke="rgba(147,51,234,0.04)"
          strokeWidth="1"
          strokeDasharray="8 16"
        />
      ))}
    </svg>
  )
}

function CodeFragmentsBg() {
  const fragments = [
    "RegisterNetEvent('927:pay')",
    "exports['ox_inventory']:AddItem",
    "TriggerClientEvent('hud:sync', src)",
    "MySQL.query.await([[SELECT * FROM users]])",
    "SetNuiFocus(true, true)",
    "local money = bridge.getMoney(src)",
    "CreateThread(function()",
    "while true do Wait(0) end",
    "pcall(function() ... end)",
    "Config.Economy.startingCash",
  ]
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        fontFamily: "'Courier New', monospace",
        fontSize: "0.7rem",
        color: "rgba(147,51,234,0.12)",
        overflow: "hidden",
        userSelect: "none",
        pointerEvents: "none",
      }}
    >
      {fragments.map((frag, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            top: `${8 + i * 9}%`,
            left: `${(i * 17) % 70}%`,
            whiteSpace: "nowrap",
            transform: `rotate(${i % 2 === 0 ? -1 : 1}deg)`,
          }}
        >
          {frag}
        </span>
      ))}
    </div>
  )
}

function GradientMeshBg() {
  return (
    <svg
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", inset: 0 }}
    >
      <defs>
        <radialGradient id="mesh1" cx="25%" cy="35%" r="50%">
          <stop offset="0%" stopColor="rgba(147,51,234,0.15)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="mesh2" cx="75%" cy="65%" r="50%">
          <stop offset="0%" stopColor="rgba(59,130,246,0.1)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="mesh3" cx="50%" cy="20%" r="40%">
          <stop offset="0%" stopColor="rgba(192,132,252,0.08)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#mesh1)" />
      <rect width="100%" height="100%" fill="url(#mesh2)" />
      <rect width="100%" height="100%" fill="url(#mesh3)" />
    </svg>
  )
}

function HeartbeatBg() {
  // Two heartbeat lines at slightly different vertical positions
  const path1 = "M0,50 L120,50 L140,20 L160,80 L180,50 L210,50 L230,10 L250,90 L270,50 L300,50 L320,30 L340,70 L360,50 L500,50"
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", inset: 0 }}
    >
      {/* First line — centre */}
      <polyline
        points="0,450 200,450 240,300 280,600 320,450 400,450 440,200 480,700 520,450 600,450 640,350 680,550 720,450 1440,450"
        fill="none"
        stroke="rgba(147,51,234,0.1)"
        strokeWidth="1.5"
      />
      {/* Glow copy */}
      <polyline
        points="0,450 200,450 240,300 280,600 320,450 400,450 440,200 480,700 520,450 600,450 640,350 680,550 720,450 1440,450"
        fill="none"
        stroke="rgba(147,51,234,0.04)"
        strokeWidth="6"
      />
      {/* Second offset line */}
      <polyline
        points="0,600 300,600 340,520 380,680 420,600 520,600 560,480 600,720 640,600 780,600 820,560 860,640 900,600 1440,600"
        fill="none"
        stroke="rgba(147,51,234,0.06)"
        strokeWidth="1"
      />
    </svg>
  )
}

function DotGridBg() {
  // Generates a grid of circles; some connected with faint lines to simulate DB graph
  const cols = 18
  const rows = 10
  const dots = []
  const lines = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = (c / (cols - 1)) * 100
      const y = (r / (rows - 1)) * 100
      dots.push({ x, y, key: `${r}-${c}` })
      // Connect some dots diagonally
      if (c < cols - 1 && r < rows - 1 && (r + c) % 3 === 0) {
        const x2 = ((c + 1) / (cols - 1)) * 100
        const y2 = ((r + 1) / (rows - 1)) * 100
        lines.push({ x1: x, y1: y, x2, y2, key: `l-${r}-${c}` })
      }
      if (c < cols - 2 && r % 2 === 0 && c % 4 === 0) {
        const x2 = ((c + 2) / (cols - 1)) * 100
        lines.push({ x1: x, y1: y, x2, y2: y, key: `h-${r}-${c}` })
      }
    }
  }
  return (
    <svg
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", inset: 0 }}
    >
      {lines.map((l) => (
        <line
          key={l.key}
          x1={`${l.x1}%`} y1={`${l.y1}%`}
          x2={`${l.x2}%`} y2={`${l.y2}%`}
          stroke="rgba(147,51,234,0.08)"
          strokeWidth="0.5"
        />
      ))}
      {dots.map((d) => (
        <circle
          key={d.key}
          cx={`${d.x}%`}
          cy={`${d.y}%`}
          r="1.5"
          fill="rgba(147,51,234,0.2)"
        />
      ))}
    </svg>
  )
}

// ─── Per-service right-side visuals ───────────────────────────────────────────

function ServerBuildVisual() {
  return (
    <svg width="340" height="340" viewBox="0 0 340 340" xmlns="http://www.w3.org/2000/svg">
      {/* Blueprint-style server rack */}
      <rect x="80" y="60" width="180" height="220" rx="4" fill="none" stroke="rgba(147,51,234,0.3)" strokeWidth="1.5" strokeDasharray="6 3" />
      {[0,1,2,3,4].map((i) => (
        <g key={i}>
          <rect x="96" y={80 + i * 38} width="148" height="28" rx="3" fill="rgba(147,51,234,0.06)" stroke="rgba(147,51,234,0.25)" strokeWidth="1" />
          <circle cx="116" cy={94 + i * 38} r="4" fill="rgba(147,51,234,0.6)" />
          <rect x="130" y={89 + i * 38} width="60" height="3" rx="1.5" fill="rgba(147,51,234,0.2)" />
          <rect x="130" y={96 + i * 38} width="40" height="3" rx="1.5" fill="rgba(147,51,234,0.12)" />
        </g>
      ))}
      {/* Glow underneath */}
      <ellipse cx="170" cy="295" rx="70" ry="10" fill="rgba(147,51,234,0.12)" />
    </svg>
  )
}

function ScriptVisual() {
  return (
    <svg width="340" height="340" viewBox="0 0 340 340" xmlns="http://www.w3.org/2000/svg"
      style={{ fontFamily: "'Courier New', monospace" }}>
      {/* Code editor frame */}
      <rect x="40" y="50" width="260" height="240" rx="8" fill="rgba(20,20,20,0.8)" stroke="rgba(147,51,234,0.2)" strokeWidth="1.5" />
      {/* Title bar */}
      <rect x="40" y="50" width="260" height="28" rx="8" fill="rgba(147,51,234,0.08)" />
      <rect x="40" y="68" width="260" height="10" fill="rgba(147,51,234,0.08)" />
      <circle cx="60" cy="64" r="5" fill="rgba(255,100,100,0.5)" />
      <circle cx="76" cy="64" r="5" fill="rgba(255,200,50,0.5)" />
      <circle cx="92" cy="64" r="5" fill="rgba(80,200,80,0.5)" />
      {/* Code lines */}
      {[
        { x: 62, w: 40, color: "rgba(192,132,252,0.7)" },
        { x: 62, w: 100, color: "rgba(147,51,234,0.5)" },
        { x: 78, w: 80, color: "rgba(200,200,200,0.3)" },
        { x: 78, w: 60, color: "rgba(200,200,200,0.3)" },
        { x: 78, w: 90, color: "rgba(147,51,234,0.4)" },
        { x: 62, w: 30, color: "rgba(192,132,252,0.5)" },
        { x: 62, w: 70, color: "rgba(200,200,200,0.2)" },
        { x: 78, w: 110, color: "rgba(147,51,234,0.35)" },
      ].map((line, i) => (
        <rect key={i} x={line.x} y={100 + i * 22} width={line.w} height="8" rx="3" fill={line.color} />
      ))}
      {/* Cursor blink */}
      <rect x="62" y={100 + 8 * 22} width="8" height="14" rx="1" fill="rgba(147,51,234,0.8)" />
    </svg>
  )
}

function Design3DVisual() {
  return (
    <svg width="340" height="340" viewBox="0 0 340 340" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="orb1" cx="45%" cy="40%" r="50%">
          <stop offset="0%" stopColor="rgba(192,132,252,0.5)" />
          <stop offset="100%" stopColor="rgba(147,51,234,0)" />
        </radialGradient>
        <radialGradient id="orb2" cx="65%" cy="65%" r="40%">
          <stop offset="0%" stopColor="rgba(59,130,246,0.35)" />
          <stop offset="100%" stopColor="rgba(59,130,246,0)" />
        </radialGradient>
      </defs>
      <circle cx="150" cy="160" r="100" fill="url(#orb1)" />
      <circle cx="200" cy="200" r="80" fill="url(#orb2)" />
      {/* Isometric cube outline */}
      <polygon
        points="170,80 240,120 240,200 170,240 100,200 100,120"
        fill="none"
        stroke="rgba(192,132,252,0.4)"
        strokeWidth="1.5"
      />
      <line x1="170" y1="80" x2="170" y2="240" stroke="rgba(192,132,252,0.2)" strokeWidth="1" />
      <line x1="100" y1="120" x2="240" y2="200" stroke="rgba(192,132,252,0.2)" strokeWidth="1" />
      <line x1="240" y1="120" x2="100" y2="200" stroke="rgba(192,132,252,0.2)" strokeWidth="1" />
    </svg>
  )
}

function ServerMgmtVisual() {
  return (
    <svg width="340" height="340" viewBox="0 0 340 340" xmlns="http://www.w3.org/2000/svg">
      {/* CPU/server chip */}
      <rect x="110" y="110" width="120" height="120" rx="8" fill="rgba(147,51,234,0.06)" stroke="rgba(147,51,234,0.3)" strokeWidth="1.5" />
      {/* Pins top & bottom */}
      {[0,1,2,3,4].map((i) => (
        <g key={i}>
          <rect x={128 + i * 20} y="94" width="8" height="16" rx="2" fill="rgba(147,51,234,0.25)" />
          <rect x={128 + i * 20} y="230" width="8" height="16" rx="2" fill="rgba(147,51,234,0.25)" />
          <rect x="94" y={128 + i * 20} width="16" height="8" rx="2" fill="rgba(147,51,234,0.25)" />
          <rect x="230" y={128 + i * 20} width="16" height="8" rx="2" fill="rgba(147,51,234,0.25)" />
        </g>
      ))}
      {/* Inner core */}
      <rect x="138" y="138" width="64" height="64" rx="4" fill="rgba(147,51,234,0.15)" stroke="rgba(147,51,234,0.4)" strokeWidth="1" />
      <circle cx="170" cy="170" r="20" fill="rgba(147,51,234,0.25)" />
      <circle cx="170" cy="170" r="10" fill="rgba(147,51,234,0.5)" />
      {/* Pulse rings */}
      <circle cx="170" cy="170" r="35" fill="none" stroke="rgba(147,51,234,0.12)" strokeWidth="1" strokeDasharray="4 4" />
      <circle cx="170" cy="170" r="55" fill="none" stroke="rgba(147,51,234,0.07)" strokeWidth="1" strokeDasharray="3 6" />
    </svg>
  )
}

function DatabaseVisual() {
  return (
    <svg width="340" height="340" viewBox="0 0 340 340" xmlns="http://www.w3.org/2000/svg">
      {/* DB cylinder stack */}
      {[0,1,2].map((i) => (
        <g key={i}>
          <ellipse cx="170" cy={100 + i * 60} rx="75" ry="20"
            fill={`rgba(147,51,234,${0.12 - i * 0.03})`}
            stroke="rgba(147,51,234,0.3)" strokeWidth="1.2" />
          <rect x="95" y={100 + i * 60} width="150" height="60"
            fill={`rgba(147,51,234,${0.05 - i * 0.01})`}
            stroke="rgba(147,51,234,0.15)" strokeWidth="1" />
        </g>
      ))}
      {/* Top cap */}
      <ellipse cx="170" cy="100" rx="75" ry="20"
        fill="rgba(147,51,234,0.18)"
        stroke="rgba(147,51,234,0.5)" strokeWidth="1.5" />
      {/* Connector lines */}
      <line x1="170" y1="220" x2="130" y2="280" stroke="rgba(147,51,234,0.2)" strokeWidth="1" />
      <line x1="170" y1="220" x2="170" y2="290" stroke="rgba(147,51,234,0.2)" strokeWidth="1" />
      <line x1="170" y1="220" x2="210" y2="280" stroke="rgba(147,51,234,0.2)" strokeWidth="1" />
      <circle cx="130" cy="285" r="6" fill="rgba(147,51,234,0.4)" />
      <circle cx="170" cy="295" r="6" fill="rgba(147,51,234,0.4)" />
      <circle cx="210" cy="285" r="6" fill="rgba(147,51,234,0.4)" />
    </svg>
  )
}

// ─── Service definitions ───────────────────────────────────────────────────────

const SERVICES = [
  {
    id: 1,
    title: "Full Server Builds",
    description:
      "From zero to launch. Framework, economy, scripts, configs — the full stack. We set it up the right way so it runs for years, not weeks.",
    bullets: [
      "ESX / QBox framework setup and configuration",
      "Economy design — money, drugs, jobs, shops",
      "Core script stack — garage, inventory, banking, housing",
      "Performance tuned from day one",
    ],
    bg: <BlueprintBg />,
    visual: <ServerBuildVisual />,
  },
  {
    id: 2,
    title: "Custom Script Development",
    description:
      "Built for your server. Not another leaked script with your name on it. Clean code, your branding, your rules.",
    bullets: [
      "Exclusive to your server — not resold or leaked",
      "Full NUI with your design language",
      "Database-backed, production-hardened",
      "Documentation + support included",
    ],
    bg: <CodeFragmentsBg />,
    visual: <ScriptVisual />,
  },
  {
    id: 3,
    title: "Custom 3D Design",
    description:
      "Chains, guns, clothing, skins — one-of-one pieces your players can't get anywhere else. Not from a pack. Made for you.",
    bullets: [
      "Custom weapon models and textures",
      "Unique clothing and accessory designs",
      "YMT addon packs — fully integrated",
      "Exclusive art direction per project",
    ],
    bg: <GradientMeshBg />,
    visual: <Design3DVisual />,
  },
  {
    id: 4,
    title: "Server Management & Optimization",
    description:
      "Keep your server running smooth. Updates, fixes, performance tuning. You run the city, we keep the engine alive.",
    bullets: [
      "Ongoing script updates and compatibility fixes",
      "Performance profiling and optimization",
      "Resource conflict resolution",
      "On-call support during peak hours",
    ],
    bg: <HeartbeatBg />,
    visual: <ServerMgmtVisual />,
  },
  {
    id: 5,
    title: "Database & Infrastructure",
    description:
      "Clean data, fast queries, zero downtime. The backbone nobody sees but everyone feels when it breaks.",
    bullets: [
      "MySQL / MariaDB optimization and indexing",
      "VPS provisioning and hardening",
      "Backup systems and disaster recovery",
      "txAdmin configuration and monitoring",
    ],
    bg: <DotGridBg />,
    visual: <DatabaseVisual />,
  },
]

// ─── Component ─────────────────────────────────────────────────────────────────

export function Services() {
  const sectionRef  = useRef(null)
  const cardRefs    = useRef([])
  const bgRefs      = useRef([])
  const dotRefs     = useRef([])
  const progressRef = useRef(null)

  cardRefs.current = cardRefs.current.slice(0, SERVICES.length)
  bgRefs.current   = bgRefs.current.slice(0, SERVICES.length)
  dotRefs.current  = dotRefs.current.slice(0, SERVICES.length)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    if (cardRefs.current.some((r) => !r)) return
    if (bgRefs.current.some((r) => !r)) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          // 500% = 100% per service slide with a little breathing room
          end: "+=500%",
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      })

      // ── Slide 1: enter immediately ──────────────────────────────────────
      tl.set(cardRefs.current[0], { opacity: 1, x: 0, pointerEvents: "auto" })
      tl.set(bgRefs.current[0],   { opacity: 1 })
      tl.set(dotRefs.current[0],  { scale: 1.6, opacity: 1 })

      // ── Sequence slides 1→5 ────────────────────────────────────────────
      for (let i = 1; i < SERVICES.length; i++) {
        const prev     = cardRefs.current[i - 1]
        const curr     = cardRefs.current[i]
        const prevBg   = bgRefs.current[i - 1]
        const currBg   = bgRefs.current[i]
        const prevDot  = dotRefs.current[i - 1]
        const currDot  = dotRefs.current[i]
        const label    = `s${i}`

        // Exit: previous slide slides out left + fades
        tl.to(prev, { opacity: 0, x: -80, pointerEvents: "none", duration: 0.4, ease: "power2.in" }, label)
        // Background crossfade
        tl.to(prevBg, { opacity: 0, duration: 0.4, ease: "power1.inOut" }, label)
        tl.fromTo(currBg, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power1.inOut" }, `${label}+=0.1`)
        // Progress dot
        tl.to(prevDot,  { scale: 1, opacity: 0.35, duration: 0.3 }, label)
        tl.fromTo(currDot, { scale: 1, opacity: 0.35 }, { scale: 1.6, opacity: 1, duration: 0.3 }, `${label}+=0.15`)
        // Enter: current slide from right
        tl.fromTo(
          curr,
          { opacity: 0, x: 80, pointerEvents: "none" },
          { opacity: 1, x: 0, pointerEvents: "auto", duration: 0.5, ease: "power3.out" },
          `${label}+=0.15`
        )
      }
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        height: "100vh",
        background: "var(--color-base)",
        overflow: "hidden",
      }}
    >
      {/* Top accent line */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: "linear-gradient(90deg, transparent, var(--color-accent), transparent)",
          opacity: 0.4,
          zIndex: 10,
        }}
      />

      {/* Section eyebrow — fixed at top */}
      <div
        style={{
          position: "absolute",
          top: "2.25rem",
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <p
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.28em",
            color: "var(--color-accent)",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          What We Build
        </p>
      </div>

      {/* Background layers (one per service, stacked) */}
      {SERVICES.map((service, i) => (
        <div
          key={service.id}
          ref={(el) => { bgRefs.current[i] = el }}
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0,
            zIndex: 0,
            overflow: "hidden",
          }}
        >
          {service.bg}
        </div>
      ))}

      {/* Slide cards */}
      {SERVICES.map((service, i) => (
        <ServiceCard
          key={service.id}
          service={service}
          cardRef={(el) => { cardRefs.current[i] = el }}
          bgRef={() => {}} // bg managed above at section level
        />
      ))}

      {/* ── Side progress dots ──────────────────────────────────────────── */}
      <div
        ref={progressRef}
        style={{
          position: "absolute",
          right: "2rem",
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.85rem",
          zIndex: 20,
        }}
        aria-hidden
      >
        {SERVICES.map((service, i) => (
          <div
            key={service.id}
            ref={(el) => { dotRefs.current[i] = el }}
            title={service.title}
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "var(--color-accent)",
              opacity: i === 0 ? 1 : 0.35,
              transform: i === 0 ? "scale(1.6)" : "scale(1)",
              boxShadow: "0 0 8px var(--color-accent)",
              transition: "box-shadow 0.2s",
            }}
          />
        ))}
      </div>
    </section>
  )
}
