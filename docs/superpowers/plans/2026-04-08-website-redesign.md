# 927 Dev Services Website Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the 927 Development website as a cinematic, scroll-driven GSAP + Lenis + Three.js experience targeting FiveM server owners.

**Architecture:** Single-page React app with GSAP ScrollTrigger for scroll-driven animations, Lenis for smooth scrolling, and Three.js (via @react-three/fiber) for 3D hero scene. Six viewport-height sections flow top to bottom: Hero → Problem → Services → Social Proof → 927 Suite → CTA.

**Tech Stack:** React 19, Vite, Tailwind CSS v4, GSAP (ScrollTrigger), Lenis, Three.js (@react-three/fiber, @react-three/drei, @react-three/postprocessing)

---

## Pre-Task Notes

- **No tests.** Verification is done by running `npm run dev` and checking in the browser.
- **Vite alias `@` maps to `src/`** — use `@/components/...` imports throughout.
- **Tailwind v4** uses `@theme {}` inside CSS, not `tailwind.config.js` — keep all token definitions in `index.css`.
- **Current stack uses Framer Motion** (`motion` package) — being fully replaced by GSAP.
- **Three.js ecosystem already installed** — `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing` are all in `package.json`. Keep them.
- **`three-custom-shader-material`** is in deps — keep it, may be useful for material effects.
- **`frameloop="demand"`** on Canvas — only re-renders when `.invalidate()` is called or scroll state changes. This is a perf requirement.
- **GSAP ScrollTrigger must be registered globally once** — do it in `main.jsx` or `App.jsx`, not per-component.
- **All GSAP animations inside `useEffect` must return cleanup** — `ctx.revert()` pattern kills all animations created in that context.

---

## Task 1: Foundation — Dependencies & Cleanup

**Files:**
- Modify: `package.json`
- Modify: `src/index.css`
- Modify: `vite.config.js`
- Modify: `src/App.jsx` (strip all old imports — full rewrite comes in Task 10)
- Delete: `src/components/ui/BootSequence.jsx`
- Delete: `src/components/ui/BorderBeam.jsx`
- Delete: `src/components/ui/ShinyText.jsx`
- Delete: `src/components/ui/HyperText.jsx`
- Delete: `src/components/ui/TiltCard.jsx`
- Delete: `src/components/ui/Background3D.jsx`
- Delete: `src/components/ui/Particles.jsx`

### Steps

- [ ] Install new dependencies and remove old ones:

```bash
cd C:/Users/keyno/Desktop/927-dev-services
npm remove motion
npm install gsap lenis
```

- [ ] Delete old components:

```bash
cd C:/Users/keyno/Desktop/927-dev-services/src/components/ui
rm BootSequence.jsx BorderBeam.jsx ShinyText.jsx HyperText.jsx TiltCard.jsx Background3D.jsx Particles.jsx
```

- [ ] Rewrite `src/App.jsx` to a minimal shell (just enough to render without errors — full assembly in Task 10):

```jsx
// src/App.jsx
import { useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  return (
    <div className="app">
      <div style={{ height: "200vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--color-text-primary)", fontSize: "2rem" }}>927 Dev Services — Building...</p>
      </div>
    </div>
  )
}
```

- [ ] Rewrite `src/index.css` with the full design system — **replace the entire file**:

```css
/* src/index.css */
@import "tailwindcss";

@theme {
  /* Base palette */
  --color-base: #0a0a0a;
  --color-surface: #141414;
  --color-border: #1f1f1f;

  /* Text */
  --color-text-primary: #f5f5f5;
  --color-text-secondary: #a0a0a0;

  /* Accent — purple */
  --color-accent: #9333ea;
  --color-accent-glow: #7c3aed;
  --color-accent-subtle: rgba(147, 51, 234, 0.1);
  --color-accent-glow-strong: rgba(147, 51, 234, 0.4);

  /* Legacy aliases (keep for any stray usage) */
  --color-bg: #0a0a0a;
  --color-bg2: #141414;
  --color-panel-bg: rgba(20, 20, 20, 0.80);
  --color-panel-border: rgba(147, 51, 234, 0.15);
  --color-card-bg: rgba(255, 255, 255, 0.03);
  --color-card-border: rgba(147, 51, 234, 0.2);

  /* Font */
  --font-sans: "Inter", system-ui, -apple-system, sans-serif;
}

/* ─── Reset ──────────────────────────────────────────────────────────────── */

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* ─── Base ───────────────────────────────────────────────────────────────── */

html {
  background: var(--color-base);
  color: var(--color-text-primary);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

body {
  background: var(--color-base);
  min-height: 100vh;
  overflow-x: hidden;
  cursor: none;
}

body * {
  cursor: none !important;
}

/* ─── Grain texture overlay ──────────────────────────────────────────────── */

body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 128px 128px;
}

/* ─── Scrollbar ───────────────────────────────────────────────────────────── */

::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: var(--color-base);
}
::-webkit-scrollbar-thumb {
  background: rgba(147, 51, 234, 0.3);
  border-radius: 2px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(147, 51, 234, 0.6);
}

/* ─── Typography ─────────────────────────────────────────────────────────── */

h1, h2, h3, h4, h5, h6 {
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.1;
  color: var(--color-text-primary);
}

p {
  line-height: 1.6;
  color: var(--color-text-secondary);
}

/* ─── Canvas baseline ────────────────────────────────────────────────────── */

canvas {
  cursor: none !important;
  display: block;
}

/* ─── Section baseline ────────────────────────────────────────────────────── */

.section {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

/* ─── Utility: purple glow shadow ─────────────────────────────────────────── */

.glow-purple {
  text-shadow: 0 0 40px rgba(147, 51, 234, 0.5), 0 0 80px rgba(147, 51, 234, 0.25);
}

.glow-border {
  box-shadow: 0 0 0 1px rgba(147, 51, 234, 0.3), 0 0 20px rgba(147, 51, 234, 0.1);
}

/* ─── GSAP initial states ────────────────────────────────────────────────── */

/* Elements that GSAP will animate in — hidden until GSAP touches them */
.gsap-reveal {
  opacity: 0;
}

/* ─── Custom cursor ──────────────────────────────────────────────────────── */

#custom-cursor {
  position: fixed;
  top: 0;
  left: 0;
  width: 32px;
  height: 32px;
  pointer-events: none;
  z-index: 10000;
  transform: translate(-50%, -50%);
  transition: transform 0.1s ease;
}
```

- [ ] Verify no TypeScript errors and the app renders with `npm run dev`:

```bash
cd C:/Users/keyno/Desktop/927-dev-services
npm run dev
```

Open `http://localhost:5173/927-dev-services/` — should see a dark page with "927 Dev Services — Building..." text. No console errors about missing imports.

- [ ] Commit:

```bash
cd C:/Users/keyno/Desktop/927-dev-services
git add package.json package-lock.json src/App.jsx src/index.css
git commit -m "task 1: replace framer-motion with gsap+lenis, delete old components, new design system"
```

---

## Task 2: Lenis + GSAP ScrollTrigger Setup

**Files:**
- Create: `src/hooks/useLenis.js`
- Create: `src/hooks/useScrollTrigger.js`
- Modify: `src/App.jsx` (add Lenis hook + GSAP register)
- Modify: `src/main.jsx` (register GSAP ScrollTrigger globally)

### Steps

- [ ] Register ScrollTrigger globally in `src/main.jsx`:

```jsx
// src/main.jsx
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import "@/index.css"
import App from "@/App"

gsap.registerPlugin(ScrollTrigger)

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

- [ ] Create `src/hooks/useLenis.js`:

```js
// src/hooks/useLenis.js
import { useEffect, useRef } from "react"
import Lenis from "lenis"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

/**
 * Initializes Lenis smooth scroll and syncs it with GSAP ScrollTrigger.
 * Returns the lenis instance so callers can access scroll position if needed.
 */
export function useLenis() {
  const lenisRef = useRef(null)

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,           // Buttery smooth — lower = smoother but slower to catch up
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    })

    lenisRef.current = lenis

    // Sync Lenis scroll events with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update)

    // Drive Lenis via GSAP ticker (ensures they share the same RAF loop)
    const ticker = gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    // Disable GSAP's built-in lag smoothing — Lenis handles this
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(ticker)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return lenisRef
}
```

- [ ] Create `src/hooks/useScrollTrigger.js`:

```js
// src/hooks/useScrollTrigger.js
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

/**
 * Reusable hook for creating a GSAP ScrollTrigger tied to a ref element.
 *
 * @param {Function} animationFactory - (element, ctx) => { ... } — receives the DOM element
 *   and a gsap.context(). Build your gsap animations inside. Return nothing.
 * @param {Array} deps - Extra deps that should re-run the effect (defaults to [])
 *
 * @returns {React.RefObject} ref — attach to the trigger element
 *
 * Usage:
 *   const ref = useScrollTrigger((el) => {
 *     gsap.from(el.querySelectorAll(".word"), {
 *       y: 40, opacity: 0, stagger: 0.05,
 *       scrollTrigger: { trigger: el, start: "top 80%" }
 *     })
 *   })
 *   <section ref={ref}>...</section>
 */
export function useScrollTrigger(animationFactory, deps = []) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // gsap.context scopes all animations — ctx.revert() kills them all on cleanup
    const ctx = gsap.context(() => {
      animationFactory(el)
    }, el)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return ref
}
```

- [ ] Update `src/App.jsx` to initialize Lenis:

```jsx
// src/App.jsx
import { useLenis } from "@/hooks/useLenis"

export default function App() {
  // Initialize Lenis smooth scroll + sync with GSAP ScrollTrigger
  useLenis()

  return (
    <div className="app">
      {/* Sections will be added in Task 10 */}
      <div style={{ height: "300vh", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "40vh" }}>
        <p style={{ color: "var(--color-text-primary)", fontSize: "2rem", position: "sticky", top: "40vh" }}>
          927 Dev Services — Lenis Active
        </p>
      </div>
    </div>
  )
}
```

- [ ] Verify in browser: Run `npm run dev`, scroll the page. Scrolling should feel noticeably smoother/buttery compared to native scroll. Open DevTools console — no errors.

- [ ] Commit:

```bash
cd C:/Users/keyno/Desktop/927-dev-services
git add src/main.jsx src/hooks/useLenis.js src/hooks/useScrollTrigger.js src/App.jsx
git commit -m "task 2: lenis smooth scroll + gsap scrolltrigger setup, hooks created"
```

---

## Task 3: Reusable UI Components

**Files:**
- Create: `src/components/ui/SplitText.jsx`
- Create: `src/components/ui/ScrollReveal.jsx`
- Create: `src/components/ui/Counter.jsx`
- Create: `src/components/ui/GlassCard.jsx`

### Steps

- [ ] Create `src/components/ui/SplitText.jsx`:

```jsx
// src/components/ui/SplitText.jsx
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

/**
 * GSAP-powered text split animation.
 * Splits text into word spans, animates them in with stagger on scroll.
 *
 * Props:
 *   children  — string text content
 *   className — class applied to the outer wrapper
 *   tag       — HTML tag for wrapper (default "p")
 *   stagger   — delay between each word (default 0.05)
 *   from      — direction: "bottom" | "top" | "left" | "right" (default "bottom")
 *   delay     — initial delay before animation starts (default 0)
 *   duration  — animation duration per word (default 0.7)
 *   start     — ScrollTrigger start position (default "top 85%")
 *   once      — only play once (default true)
 */
export function SplitText({
  children,
  className = "",
  tag: Tag = "p",
  stagger = 0.05,
  from = "bottom",
  delay = 0,
  duration = 0.7,
  start = "top 85%",
  once = true,
}) {
  const wrapperRef = useRef(null)

  // Build the from/to values based on direction
  const getFromVars = () => {
    const base = { opacity: 0, duration, ease: "power3.out" }
    switch (from) {
      case "bottom": return { ...base, y: 40 }
      case "top":    return { ...base, y: -40 }
      case "left":   return { ...base, x: -40 }
      case "right":  return { ...base, x: 40 }
      default:       return { ...base, y: 40 }
    }
  }

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return

    // Split text into word spans
    const text = el.textContent || ""
    const words = text.split(" ")
    el.innerHTML = words
      .map((word) => `<span class="split-word" style="display:inline-block; overflow:hidden; vertical-align:bottom;"><span class="split-inner" style="display:inline-block;">${word}</span></span>`)
      .join(" ")

    const wordSpans = el.querySelectorAll(".split-inner")

    const ctx = gsap.context(() => {
      gsap.from(wordSpans, {
        ...getFromVars(),
        stagger,
        delay,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: once ? "play none none none" : "play none none reverse",
        },
      })
    }, el)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children])

  return (
    <Tag ref={wrapperRef} className={className}>
      {children}
    </Tag>
  )
}
```

- [ ] Create `src/components/ui/ScrollReveal.jsx`:

```jsx
// src/components/ui/ScrollReveal.jsx
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

/**
 * Wrapper that fades/slides children in when scrolled into view.
 *
 * Props:
 *   children   — any React children
 *   className  — class applied to wrapper div
 *   direction  — "up" | "down" | "left" | "right" (default "up")
 *   distance   — pixels to travel (default 40)
 *   delay      — delay in seconds (default 0)
 *   duration   — animation duration (default 0.8)
 *   start      — ScrollTrigger start (default "top 85%")
 *   once       — only play once (default true)
 */
export function ScrollReveal({
  children,
  className = "",
  direction = "up",
  distance = 40,
  delay = 0,
  duration = 0.8,
  start = "top 85%",
  once = true,
}) {
  const ref = useRef(null)

  const getFromVars = () => {
    const base = { opacity: 0 }
    switch (direction) {
      case "up":    return { ...base, y: distance }
      case "down":  return { ...base, y: -distance }
      case "left":  return { ...base, x: distance }
      case "right": return { ...base, x: -distance }
      default:      return { ...base, y: distance }
    }
  }

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.from(el, {
        ...getFromVars(),
        duration,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: once ? "play none none none" : "play none none reverse",
        },
      })
    }, el)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
```

- [ ] Create `src/components/ui/Counter.jsx`:

```jsx
// src/components/ui/Counter.jsx
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

/**
 * Animated number counter — counts from 0 to target when scrolled into view.
 *
 * Props:
 *   target    — number to count to (e.g. 600)
 *   duration  — animation duration in seconds (default 2)
 *   prefix    — string before number (default "")
 *   suffix    — string after number (default "")
 *   className — class on the outer span
 *   start     — ScrollTrigger start position (default "top 85%")
 */
export function Counter({
  target,
  duration = 2,
  prefix = "",
  suffix = "",
  className = "",
  start = "top 85%",
}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obj = { value: 0 }

    const ctx = gsap.context(() => {
      gsap.to(obj, {
        value: target,
        duration,
        ease: "power2.out",
        roundProps: "value",
        onUpdate: () => {
          el.textContent = `${prefix}${obj.value.toLocaleString()}${suffix}`
        },
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play none none none",
        },
      })
    }, el)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target])

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  )
}
```

- [ ] Create `src/components/ui/GlassCard.jsx`:

```jsx
// src/components/ui/GlassCard.jsx
import { useRef } from "react"
import { clsx } from "clsx"

/**
 * Glass-morphism card with purple border glow.
 *
 * Props:
 *   children  — card content
 *   className — additional classes
 *   hover     — boolean, enables hover tilt + glow intensification (default true)
 *   style     — inline style overrides
 */
export function GlassCard({ children, className = "", hover = true, style = {} }) {
  const cardRef = useRef(null)

  const handleMouseMove = hover
    ? (e) => {
        const el = cardRef.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        const rotateX = ((y - centerY) / 20) * -1
        const rotateY = (x - centerX) / 20

        // Dynamic glow follows cursor
        const glowX = (x / rect.width) * 100
        const glowY = (y / rect.height) * 100
        el.style.background = `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(147,51,234,0.08) 0%, rgba(20,20,20,0.95) 60%)`
        el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`
      }
    : undefined

  const handleMouseLeave = hover
    ? () => {
        const el = cardRef.current
        if (!el) return
        el.style.background = "rgba(20, 20, 20, 0.95)"
        el.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)"
      }
    : undefined

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={clsx(
        "relative rounded-2xl border p-6",
        "transition-[transform,box-shadow,background] duration-200",
        className
      )}
      style={{
        background: "rgba(20, 20, 20, 0.95)",
        borderColor: "rgba(147, 51, 234, 0.2)",
        boxShadow: "0 0 0 1px rgba(147, 51, 234, 0.1), inset 0 1px 0 rgba(255,255,255,0.04)",
        transformStyle: hover ? "preserve-3d" : undefined,
        willChange: hover ? "transform" : undefined,
        ...style,
      }}
    >
      {/* Top edge highlight */}
      <div
        className="absolute inset-x-0 top-0 h-px rounded-t-2xl"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(147,51,234,0.4), transparent)",
        }}
        aria-hidden
      />
      {children}
    </div>
  )
}
```

- [ ] Verify by running `npm run dev` — no import errors. These components are not rendered yet but should parse without issues.

- [ ] Commit:

```bash
cd C:/Users/keyno/Desktop/927-dev-services
git add src/components/ui/SplitText.jsx src/components/ui/ScrollReveal.jsx src/components/ui/Counter.jsx src/components/ui/GlassCard.jsx
git commit -m "task 3: reusable ui components — SplitText, ScrollReveal, Counter, GlassCard"
```

---

## Task 4: Three.js Hero Scene

**Files:**
- Create: `src/components/ui/Scene3D.jsx`
- Create: `src/components/Hero.jsx`

### Steps

- [ ] Create `src/components/ui/Scene3D.jsx`:

```jsx
// src/components/ui/Scene3D.jsx
import { useRef, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Text3D, Center, Float, Environment, OrbitControls } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import * as THREE from "three"

// ─── Floating particles around the logo ──────────────────────────────────────

function ParticleField({ count = 120 }) {
  const meshRef = useRef()

  const { positions, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      // Spread particles in a sphere around the logo
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 2.5 + Math.random() * 3.5
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
      sizes[i] = Math.random() * 0.04 + 0.01
    }
    return { positions, sizes }
  }, [count])

  useFrame((state) => {
    if (!meshRef.current) return
    // Slow drift rotation
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.05
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.1
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#9333ea"
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

// ─── 927 3D text mesh ─────────────────────────────────────────────────────────

function Logo927({ scrollProgress = 0 }) {
  const groupRef = useRef()

  useFrame((state) => {
    if (!groupRef.current) return

    // Idle rotation when not scrolling
    groupRef.current.rotation.y =
      state.clock.elapsedTime * 0.15 + scrollProgress * Math.PI * 0.5

    // Scroll-driven scale and Y position
    const scale = 1 - scrollProgress * 0.45
    groupRef.current.scale.setScalar(Math.max(0.3, scale))
    groupRef.current.position.y = scrollProgress * 2.5

    // Invalidate for frameloop="demand"
    state.invalidate()
  })

  return (
    <group ref={groupRef}>
      <Center>
        <Text3D
          font="/fonts/helvetiker_bold.typeface.json"
          size={1.2}
          height={0.35}
          curveSegments={8}
          bevelEnabled
          bevelThickness={0.03}
          bevelSize={0.02}
          bevelSegments={4}
        >
          927
          <meshStandardMaterial
            color="#d4af37"
            metalness={0.95}
            roughness={0.05}
            envMapIntensity={1.5}
          />
        </Text3D>
      </Center>
    </group>
  )
}

// ─── Scene internals ──────────────────────────────────────────────────────────

function SceneContents({ scrollProgress }) {
  const { invalidate } = useThree()

  // Invalidate on every scroll progress change
  useMemo(() => {
    invalidate()
  }, [scrollProgress, invalidate])

  return (
    <>
      {/* Lights */}
      <ambientLight color="#7c3aed" intensity={0.6} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.2}
        color="#ffffff"
      />
      <directionalLight
        position={[-5, -2, -5]}
        intensity={0.4}
        color="#9333ea"
      />
      <pointLight position={[0, 0, 3]} color="#9333ea" intensity={2} distance={8} />

      {/* Environment for metallic reflections */}
      <Environment preset="night" />

      {/* 927 Logo */}
      <Logo927 scrollProgress={scrollProgress} />

      {/* Particle field */}
      <ParticleField count={150} />

      {/* Postprocessing */}
      <EffectComposer>
        <Bloom
          intensity={0.8}
          luminanceThreshold={0.3}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </>
  )
}

// ─── Exported component ───────────────────────────────────────────────────────

/**
 * Three.js canvas with 927 logo and particle field.
 *
 * Props:
 *   scrollProgress — 0 to 1 value driven by GSAP ScrollTrigger scrub
 *   className      — class on the canvas wrapper div
 */
export function Scene3D({ scrollProgress = 0, className = "" }) {
  return (
    <div className={className} style={{ width: "100%", height: "100%" }}>
      <Canvas
        frameloop="demand"
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <SceneContents scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  )
}
```

- [ ] Download the Helvetiker Bold typeface.json font that drei's Text3D expects. Place it at `public/fonts/helvetiker_bold.typeface.json`:

```bash
cd C:/Users/keyno/Desktop/927-dev-services
mkdir -p public/fonts
curl -o public/fonts/helvetiker_bold.typeface.json \
  "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/helvetiker_bold.typeface.json"
```

If curl is not available, use PowerShell:

```powershell
New-Item -ItemType Directory -Force -Path "C:/Users/keyno/Desktop/927-dev-services/public/fonts"
Invoke-WebRequest `
  -Uri "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/helvetiker_bold.typeface.json" `
  -OutFile "C:/Users/keyno/Desktop/927-dev-services/public/fonts/helvetiker_bold.typeface.json"
```

- [ ] Create `src/components/Hero.jsx`:

```jsx
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
 * - Tagline reveals with SplitText
 * - CTA button ScrollReveal
 */
export function Hero() {
  const sectionRef = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      // Proxy object for scrubbing
      const proxy = { progress: 0 }

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
      {/* Three.js canvas — fills entire hero */}
      <Scene3D
        scrollProgress={scrollProgress}
        className="absolute inset-0"
      />

      {/* Gradient overlay — darkens bottom so text reads cleanly */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent 40%, rgba(10,10,10,0.7) 70%, var(--color-base) 100%)",
        }}
        aria-hidden
      />

      {/* Content layer */}
      <div
        className="relative z-10 text-center px-6"
        style={{ maxWidth: "800px" }}
      >
        {/* Main tagline */}
        <SplitText
          tag="h1"
          className="glow-purple"
          stagger={0.08}
          from="bottom"
          duration={0.9}
          start="top 90%"
          style={{
            fontSize: "clamp(3rem, 8vw, 7rem)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            color: "var(--color-text-primary)",
            marginBottom: "1.5rem",
          }}
        >
          We Build Worlds
        </SplitText>

        {/* Sub tagline */}
        <ScrollReveal direction="up" delay={0.3} duration={0.8}>
          <p
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
              color: "var(--color-text-secondary)",
              marginBottom: "2.5rem",
              lineHeight: 1.6,
            }}
          >
            Custom FiveM development. Full servers, scripts, 3D assets, and infrastructure —
            built to run, not just launch.
          </p>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal direction="up" delay={0.5} duration={0.8}>
          <a
            href="https://discord.gg/hRZeHwWyHG"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              padding: "1rem 2.5rem",
              borderRadius: "9999px",
              background: "var(--color-accent)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "1rem",
              letterSpacing: "-0.01em",
              textDecoration: "none",
              boxShadow: "0 0 30px rgba(147,51,234,0.4), 0 0 60px rgba(147,51,234,0.15)",
              transition: "box-shadow 0.2s, transform 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 0 50px rgba(147,51,234,0.7), 0 0 100px rgba(147,51,234,0.3)"
              e.currentTarget.style.transform = "scale(1.04)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 0 30px rgba(147,51,234,0.4), 0 0 60px rgba(147,51,234,0.15)"
              e.currentTarget.style.transform = "scale(1)"
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
            </svg>
            Join Discord
          </a>
        </ScrollReveal>
      </div>

      {/* Scroll indicator */}
      <ScrollReveal
        direction="up"
        delay={1.2}
        className="absolute bottom-8 left-1/2"
        style={{ transform: "translateX(-50%)" }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.4rem",
            opacity: 0.4,
          }}
        >
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.15em", color: "var(--color-text-secondary)", textTransform: "uppercase" }}>
            scroll
          </span>
          <div
            style={{
              width: "1px",
              height: "40px",
              background: "linear-gradient(to bottom, var(--color-accent), transparent)",
              animation: "pulse 2s ease-in-out infinite",
            }}
          />
        </div>
      </ScrollReveal>
    </section>
  )
}
```

- [ ] Run `npm run dev`. Open browser — should see the hero section with the 3D "927" text, purple particles, and bloom. Scroll down — the 3D logo should scale down and move upward as you scroll.

- [ ] Commit:

```bash
cd C:/Users/keyno/Desktop/927-dev-services
git add public/fonts/helvetiker_bold.typeface.json src/components/ui/Scene3D.jsx src/components/Hero.jsx
git commit -m "task 4: three.js hero scene with 927 logo, particles, bloom, scroll scrub"
```

---

## Task 5: Problem Section

**Files:**
- Create: `src/components/Problem.jsx`

### Steps

- [ ] Create `src/components/Problem.jsx`:

```jsx
// src/components/Problem.jsx
import { useRef, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "@/components/ui/SplitText"
import { ScrollReveal } from "@/components/ui/ScrollReveal"

const PAIN_POINTS = [
  {
    id: 1,
    text: "Leaked scripts that break on update. Configs you can't touch without crashing everything.",
  },
  {
    id: 2,
    text: "\"Dev\" stopped responding after payment. The economy is broken and you can't find the bug.",
  },
  {
    id: 3,
    text: "Generic servers. Your players have seen it all before. Nothing keeps them logging back in.",
  },
]

export function Problem() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      // Stagger in the pain point items
      const items = el.querySelectorAll(".pain-item")
      gsap.from(items, {
        opacity: 0,
        x: -30,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 60%",
          toggleActions: "play none none none",
        },
      })

      // Accent line width animation
      const lines = el.querySelectorAll(".pain-line")
      gsap.from(lines, {
        scaleX: 0,
        transformOrigin: "left center",
        stagger: 0.15,
        duration: 0.6,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: el,
          start: "top 60%",
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
        background: "var(--color-base)",
        position: "relative",
      }}
    >
      {/* Subtle radial glow in background */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(147,51,234,0.06) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
        aria-hidden
      />

      <div style={{ maxWidth: "800px", width: "100%", position: "relative", zIndex: 1 }}>
        {/* Headline */}
        <SplitText
          tag="h2"
          stagger={0.06}
          from="bottom"
          duration={0.8}
          start="top 75%"
          style={{
            fontSize: "clamp(2rem, 5vw, 4rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "var(--color-text-primary)",
            marginBottom: "1rem",
            lineHeight: 1.1,
          }}
        >
          Your server deserves more than drag-and-drop scripts.
        </SplitText>

        {/* Setup line */}
        <ScrollReveal direction="up" delay={0.2} duration={0.8} start="top 75%">
          <p
            style={{
              fontSize: "1.1rem",
              color: "var(--color-text-secondary)",
              marginBottom: "4rem",
              lineHeight: 1.7,
            }}
          >
            Most FiveM servers are built from the same leaked scripts, the same broken
            economy, the same Fivem.store assets everyone else has. Here&apos;s what that
            actually costs you.
          </p>
        </ScrollReveal>

        {/* Pain points */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {PAIN_POINTS.map((point, i) => (
            <div
              key={point.id}
              className="pain-item"
              style={{
                display: "flex",
                gap: "1.5rem",
                alignItems: "flex-start",
              }}
            >
              {/* Number + accent line */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "var(--color-accent)",
                    letterSpacing: "0.1em",
                  }}
                >
                  0{i + 1}
                </span>
                <div
                  className="pain-line"
                  style={{
                    width: "1px",
                    height: "100%",
                    minHeight: "40px",
                    background: "linear-gradient(to bottom, var(--color-accent), transparent)",
                    opacity: 0.4,
                  }}
                />
              </div>

              {/* Text */}
              <p
                style={{
                  fontSize: "clamp(1rem, 2vw, 1.2rem)",
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.7,
                  paddingTop: "0.1rem",
                }}
              >
                {point.text}
              </p>
            </div>
          ))}
        </div>

        {/* Closing statement */}
        <ScrollReveal direction="up" delay={0} duration={0.9} start="top 90%">
          <div
            style={{
              marginTop: "4rem",
              padding: "2rem",
              borderLeft: "2px solid var(--color-accent)",
              background: "var(--color-accent-subtle)",
              borderRadius: "0 12px 12px 0",
            }}
          >
            <p
              style={{
                fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
                fontWeight: 600,
                color: "var(--color-text-primary)",
                lineHeight: 1.5,
              }}
            >
              The difference between a server that peaks at 20 players and one that runs
              150+ isn&apos;t luck. It&apos;s what&apos;s under the hood.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
```

- [ ] Update `App.jsx` to include Hero and Problem (temporary — full assembly in Task 10):

```jsx
// src/App.jsx
import { useLenis } from "@/hooks/useLenis"
import { Hero } from "@/components/Hero"
import { Problem } from "@/components/Problem"

export default function App() {
  useLenis()
  return (
    <main>
      <Hero />
      <Problem />
    </main>
  )
}
```

- [ ] Run `npm run dev`. Scroll past hero — Problem section should appear with text animations staggering in.

- [ ] Commit:

```bash
cd C:/Users/keyno/Desktop/927-dev-services
git add src/components/Problem.jsx src/App.jsx
git commit -m "task 5: problem section with pain point stagger animations"
```

---

## Task 6: Services Showcase (Pinned Scroll)

**Files:**
- Create: `src/components/ServiceCard.jsx`
- Create: `src/components/Services.jsx`

### Steps

- [ ] Create `src/components/ServiceCard.jsx`:

```jsx
// src/components/ServiceCard.jsx

/**
 * Individual service card — used inside Services.jsx pinned timeline.
 * These cards are NOT scroll-triggered independently; the parent Services
 * component manages their entrance/exit via a GSAP timeline.
 *
 * Props:
 *   service  — { id, icon, title, description, bullets[] }
 *   cardRef  — ref forwarded from parent for GSAP targeting
 */
export function ServiceCard({ service, cardRef }) {
  return (
    <div
      ref={cardRef}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem 2rem",
        opacity: 0,
        transform: "translateY(60px) scale(0.95)",
        pointerEvents: "none",
      }}
    >
      <div style={{ maxWidth: "700px", width: "100%", textAlign: "center" }}>
        {/* Icon */}
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "20px",
            background: "var(--color-accent-subtle)",
            border: "1px solid rgba(147,51,234,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 2rem",
            fontSize: "2.5rem",
            boxShadow: "0 0 30px rgba(147,51,234,0.2)",
          }}
        >
          {service.icon}
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: "clamp(1.8rem, 4vw, 3rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "var(--color-text-primary)",
            marginBottom: "1rem",
          }}
        >
          {service.title}
        </h3>

        {/* Description */}
        <p
          style={{
            fontSize: "clamp(1rem, 2vw, 1.2rem)",
            color: "var(--color-text-secondary)",
            lineHeight: 1.7,
            marginBottom: "2rem",
          }}
        >
          {service.description}
        </p>

        {/* Accent divider */}
        <div
          style={{
            width: "60px",
            height: "2px",
            background: "var(--color-accent)",
            margin: "0 auto 2rem",
            borderRadius: "2px",
            boxShadow: "0 0 10px var(--color-accent)",
          }}
        />

        {/* Bullet points */}
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            alignItems: "center",
          }}
        >
          {service.bullets.map((bullet, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                color: "var(--color-text-secondary)",
                fontSize: "0.95rem",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "var(--color-accent)",
                  flexShrink: 0,
                  boxShadow: "0 0 6px var(--color-accent)",
                }}
              />
              {bullet}
            </li>
          ))}
        </ul>

        {/* Service number */}
        <div
          style={{
            position: "absolute",
            top: "2rem",
            right: "2rem",
            fontSize: "0.7rem",
            letterSpacing: "0.2em",
            color: "rgba(147,51,234,0.4)",
            fontWeight: 700,
          }}
        >
          {String(service.id).padStart(2, "0")} / 05
        </div>
      </div>
    </div>
  )
}
```

- [ ] Create `src/components/Services.jsx`:

```jsx
// src/components/Services.jsx
import { useRef, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ServiceCard } from "@/components/ServiceCard"

const SERVICES = [
  {
    id: 1,
    icon: "🏗️",
    title: "Full Server Builds",
    description:
      "From zero to launch. Framework, economy, scripts, configs — the full stack. We set it up the right way so it runs for years, not weeks.",
    bullets: [
      "ESX / QBox framework setup and configuration",
      "Economy design — money, drugs, jobs, shops",
      "Core script stack — garage, inventory, banking, housing",
      "Performance tuned from day one",
    ],
  },
  {
    id: 2,
    icon: "💻",
    title: "Custom Script Development",
    description:
      "Built for your server. Not another leaked script with your name on it. Clean code, your branding, your rules.",
    bullets: [
      "Exclusive to your server — not resold or leaked",
      "Full NUI with your design language",
      "Database-backed, production-hardened",
      "Documentation + support included",
    ],
  },
  {
    id: 3,
    icon: "🎨",
    title: "Custom 3D Design",
    description:
      "Chains, guns, clothing, skins — one-of-one pieces your players can't get anywhere else. Not from a pack. Made for you.",
    bullets: [
      "Custom weapon models and textures",
      "Unique clothing and accessory designs",
      "YMT addon packs — fully integrated",
      "Exclusive art direction per project",
    ],
  },
  {
    id: 4,
    icon: "⚙️",
    title: "Server Management & Optimization",
    description:
      "Keep your server running smooth. Updates, fixes, performance tuning. You run the city, we keep the engine alive.",
    bullets: [
      "Ongoing script updates and compatibility fixes",
      "Performance profiling and optimization",
      "Resource conflict resolution",
      "On-call support during peak hours",
    ],
  },
  {
    id: 5,
    icon: "🗄️",
    title: "Database & Infrastructure",
    description:
      "Clean data, fast queries, zero downtime. The backbone nobody sees but everyone feels when it breaks.",
    bullets: [
      "MySQL / MariaDB optimization and indexing",
      "VPS provisioning and hardening",
      "Backup systems and disaster recovery",
      "txAdmin configuration and monitoring",
    ],
  },
]

export function Services() {
  const sectionRef = useRef(null)
  const cardRefs = useRef([])

  // Initialize card refs array
  cardRefs.current = cardRefs.current.slice(0, SERVICES.length)

  useEffect(() => {
    const el = sectionRef.current
    if (!el || cardRefs.current.some((r) => !r)) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          // 400% gives ~80% per card (5 cards), enough room to breathe
          end: "+=400%",
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
        },
      })

      // Show first card immediately (no "from" — just set it visible)
      tl.set(cardRefs.current[0], { opacity: 1, y: 0, scale: 1, pointerEvents: "auto" })

      // Sequence through remaining cards
      for (let i = 1; i < SERVICES.length; i++) {
        const prev = cardRefs.current[i - 1]
        const curr = cardRefs.current[i]

        // Exit previous
        tl.to(
          prev,
          {
            opacity: 0,
            y: -50,
            scale: 0.9,
            pointerEvents: "none",
            duration: 0.4,
            ease: "power2.in",
          },
          `card${i}`
        )
        // Enter current
        tl.fromTo(
          curr,
          { opacity: 0, y: 60, scale: 0.95, pointerEvents: "none" },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            pointerEvents: "auto",
            duration: 0.5,
            ease: "power3.out",
          },
          `card${i}+=0.1`
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
      {/* Section header — fixed at top during pin */}
      <div
        style={{
          position: "absolute",
          top: "2rem",
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        <p
          style={{
            fontSize: "0.75rem",
            letterSpacing: "0.25em",
            color: "var(--color-accent)",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          What We Build
        </p>
        <h2
          style={{
            fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "var(--color-text-primary)",
            marginTop: "0.25rem",
          }}
        >
          Services
        </h2>
      </div>

      {/* Subtle top border */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: "linear-gradient(90deg, transparent, var(--color-accent), transparent)",
          opacity: 0.4,
        }}
        aria-hidden
      />

      {/* Cards stacked — GSAP shows/hides them */}
      {SERVICES.map((service, i) => (
        <ServiceCard
          key={service.id}
          service={service}
          cardRef={(el) => { cardRefs.current[i] = el }}
        />
      ))}
    </section>
  )
}
```

- [ ] Update `App.jsx` to include Services:

```jsx
// src/App.jsx
import { useLenis } from "@/hooks/useLenis"
import { Hero } from "@/components/Hero"
import { Problem } from "@/components/Problem"
import { Services } from "@/components/Services"

export default function App() {
  useLenis()
  return (
    <main>
      <Hero />
      <Problem />
      <Services />
    </main>
  )
}
```

- [ ] Run `npm run dev`. Scroll through — after the Problem section, the Services section should pin to the viewport. Continuing to scroll sequences through all 5 services. After the last service, the page should unpin and continue scrolling naturally.

- [ ] Commit:

```bash
cd C:/Users/keyno/Desktop/927-dev-services
git add src/components/ServiceCard.jsx src/components/Services.jsx src/App.jsx
git commit -m "task 6: services showcase with gsap pinned scroll — 5 services sequence"
```

---

## Task 7: Social Proof Section

**Files:**
- Create: `src/components/SocialProof.jsx`

### Steps

- [ ] Create `src/components/SocialProof.jsx`:

```jsx
// src/components/SocialProof.jsx
import { Counter } from "@/components/ui/Counter"
import { ScrollReveal } from "@/components/ui/ScrollReveal"
import { SplitText } from "@/components/ui/SplitText"

const STATS = [
  {
    id: 1,
    target: 600,
    suffix: "+",
    label: "Concurrent players across managed servers",
    delay: 0,
  },
  {
    id: 2,
    target: 150,
    suffix: "+",
    label: "Peak pop servers built",
    delay: 0.15,
  },
  {
    id: 3,
    target: 30,
    suffix: "+",
    label: "Custom scripts deployed in production",
    delay: 0.3,
  },
  {
    id: 4,
    target: 15,
    prefix: "$",
    suffix: "k+/mo",
    label: "Monthly revenue generated for server owners",
    delay: 0.45,
  },
]

export function SocialProof() {
  return (
    <section
      className="section"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "8rem 2rem",
        background: "var(--color-base)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "800px",
          height: "400px",
          background: "radial-gradient(ellipse, rgba(147,51,234,0.08) 0%, transparent 65%)",
        }}
        aria-hidden
      />

      <div style={{ maxWidth: "1000px", width: "100%", position: "relative", zIndex: 1 }}>
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
              Track Record
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
            }}
          >
            The numbers speak for themselves.
          </SplitText>
        </div>

        {/* Stats grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "2rem",
          }}
        >
          {STATS.map((stat) => (
            <ScrollReveal key={stat.id} direction="up" delay={stat.delay} duration={0.8}>
              <div
                style={{
                  textAlign: "center",
                  padding: "2.5rem 2rem",
                  borderRadius: "16px",
                  background: "rgba(20, 20, 20, 0.8)",
                  border: "1px solid rgba(147,51,234,0.15)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Top glow accent */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "80px",
                    height: "1px",
                    background: "var(--color-accent)",
                    boxShadow: "0 0 20px var(--color-accent), 0 0 40px rgba(147,51,234,0.5)",
                  }}
                  aria-hidden
                />

                {/* Counter number */}
                <Counter
                  target={stat.target}
                  prefix={stat.prefix || ""}
                  suffix={stat.suffix || ""}
                  duration={2.5}
                  start="top 90%"
                  className=""
                  style={{
                    display: "block",
                    fontSize: "clamp(2.5rem, 5vw, 4rem)",
                    fontWeight: 900,
                    letterSpacing: "-0.04em",
                    color: "var(--color-text-primary)",
                    textShadow: "0 0 40px rgba(147,51,234,0.5)",
                    marginBottom: "1rem",
                    lineHeight: 1,
                  }}
                />

                {/* Label */}
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.5,
                  }}
                >
                  {stat.label}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Bottom note */}
        <ScrollReveal direction="up" delay={0.6} duration={0.8}>
          <p
            style={{
              textAlign: "center",
              marginTop: "3rem",
              fontSize: "0.85rem",
              color: "rgba(160, 160, 160, 0.5)",
            }}
          >
            Results from active production servers. No agencies, no resellers — direct dev work.
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}
```

- [ ] Update `App.jsx`:

```jsx
// src/App.jsx
import { useLenis } from "@/hooks/useLenis"
import { Hero } from "@/components/Hero"
import { Problem } from "@/components/Problem"
import { Services } from "@/components/Services"
import { SocialProof } from "@/components/SocialProof"

export default function App() {
  useLenis()
  return (
    <main>
      <Hero />
      <Problem />
      <Services />
      <SocialProof />
    </main>
  )
}
```

- [ ] Run `npm run dev`. Scroll to the Social Proof section — numbers should count up from 0 to their targets when the section enters the viewport. Each stat card staggered in with scroll reveal.

- [ ] Commit:

```bash
cd C:/Users/keyno/Desktop/927-dev-services
git add src/components/SocialProof.jsx src/App.jsx
git commit -m "task 7: social proof section with animated counters and staggered reveal"
```

---

## Task 8: Script Showcase (927 Suite)

**Files:**
- Create: `src/components/ScriptShowcase.jsx`

### Steps

- [ ] Create `src/components/ScriptShowcase.jsx`:

```jsx
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
      "In-game weapon shop, attachments, and management system. Clean NUI, ESX + QBox support.",
    price: "$15",
    tebexUrl: "https://store.927dev.com",
    badge: "Live",
    version: "v1.0.0",
  },
  {
    id: 2,
    name: "927 Fraud System",
    description:
      "Credit card fraud, black market, and credit scoring — a full underground economy layer.",
    price: "Releasing Soon",
    tebexUrl: null,
    badge: "88/100",
    version: "v1.1.0",
  },
  {
    id: 3,
    name: "927 Banking",
    description:
      "Full-featured banking system with transactions, ATM, robbery, and NUI dashboard.",
    price: "Releasing Soon",
    tebexUrl: null,
    badge: "In Testing",
    version: "v1.0.0",
  },
  {
    id: 4,
    name: "927 Collision Manager",
    description:
      "In-game IPL collision detection and removal. 3 scan modes, conflict scanner, 5-tab NUI.",
    price: "$25–30",
    tebexUrl: null,
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
              Every script in the 927 Suite runs on live servers first. By the time it ships,
              the bugs are already dead.
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
              {/* Badge */}
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
                    color: script.tebexUrl ? "var(--color-accent)" : "var(--color-text-secondary)",
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
```

- [ ] Update `App.jsx`:

```jsx
// src/App.jsx
import { useLenis } from "@/hooks/useLenis"
import { Hero } from "@/components/Hero"
import { Problem } from "@/components/Problem"
import { Services } from "@/components/Services"
import { SocialProof } from "@/components/SocialProof"
import { ScriptShowcase } from "@/components/ScriptShowcase"

export default function App() {
  useLenis()
  return (
    <main>
      <Hero />
      <Problem />
      <Services />
      <SocialProof />
      <ScriptShowcase />
    </main>
  )
}
```

- [ ] Run `npm run dev`. Scroll to the 927 Suite section — cards should slide in from the right in sequence. Hover over them — the dynamic radial glow and tilt should respond to cursor position. The "View on Tebex" link on the Weapon Manager card should open in a new tab.

- [ ] Commit:

```bash
cd C:/Users/keyno/Desktop/927-dev-services
git add src/components/ScriptShowcase.jsx src/App.jsx
git commit -m "task 8: script showcase section — 927 suite cards with horizontal slide animation"
```

---

## Task 9: Contact / CTA Section

**Files:**
- Create: `src/components/Contact.jsx`

### Steps

- [ ] Create `src/components/Contact.jsx`:

```jsx
// src/components/Contact.jsx
import { useRef, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "@/components/ui/SplitText"
import { ScrollReveal } from "@/components/ui/ScrollReveal"
import { Scene3D } from "@/components/ui/Scene3D"

export function Contact() {
  const sectionRef = useRef(null)
  const glowRef = useRef(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      // Pulse the background glow on enter
      gsap.from(glowRef.current, {
        opacity: 0,
        scale: 0.5,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 70%",
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
        padding: "8rem 2rem 4rem",
        background: "var(--color-base)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 3D logo reappears as background element */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "400px",
          opacity: 0.15,
        }}
        aria-hidden
      >
        <Scene3D scrollProgress={0} className="w-full h-full" />
      </div>

      {/* Ambient glow */}
      <div
        ref={glowRef}
        className="absolute pointer-events-none"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "700px",
          height: "700px",
          background: "radial-gradient(circle, rgba(147,51,234,0.12) 0%, transparent 65%)",
          borderRadius: "50%",
        }}
        aria-hidden
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          maxWidth: "700px",
        }}
      >
        {/* Eyebrow */}
        <ScrollReveal direction="up">
          <p
            style={{
              fontSize: "0.75rem",
              letterSpacing: "0.25em",
              color: "var(--color-accent)",
              textTransform: "uppercase",
              fontWeight: 600,
              marginBottom: "1rem",
            }}
          >
            Get Started
          </p>
        </ScrollReveal>

        {/* Headline */}
        <SplitText
          tag="h2"
          stagger={0.06}
          from="bottom"
          duration={0.9}
          style={{
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            color: "var(--color-text-primary)",
            marginBottom: "1.5rem",
            lineHeight: 1.0,
          }}
        >
          Ready to level up your server?
        </SplitText>

        {/* Sub text */}
        <ScrollReveal direction="up" delay={0.2} duration={0.8}>
          <p
            style={{
              fontSize: "1.1rem",
              color: "var(--color-text-secondary)",
              lineHeight: 1.7,
              marginBottom: "3rem",
            }}
          >
            Drop into the Discord. Tell us what you&apos;re building.
            We&apos;ll tell you what&apos;s possible.
          </p>
        </ScrollReveal>

        {/* Discord CTA — primary */}
        <ScrollReveal direction="up" delay={0.35} duration={0.8}>
          <a
            href="https://discord.gg/hRZeHwWyHG"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "1.1rem 3rem",
              borderRadius: "9999px",
              background: "var(--color-accent)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "1.05rem",
              letterSpacing: "-0.01em",
              textDecoration: "none",
              boxShadow: "0 0 40px rgba(147,51,234,0.5), 0 0 80px rgba(147,51,234,0.2)",
              transition: "box-shadow 0.2s, transform 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 0 60px rgba(147,51,234,0.8), 0 0 120px rgba(147,51,234,0.4)"
              e.currentTarget.style.transform = "scale(1.05)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 0 40px rgba(147,51,234,0.5), 0 0 80px rgba(147,51,234,0.2)"
              e.currentTarget.style.transform = "scale(1)"
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
            </svg>
            Join the Discord
          </a>
        </ScrollReveal>

        {/* Footer */}
        <ScrollReveal direction="up" delay={0.6} duration={0.8}>
          <div style={{ marginTop: "5rem", paddingTop: "2rem", borderTop: "1px solid var(--color-border)" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                marginBottom: "0.75rem",
              }}
            >
              <span
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  color: "var(--color-text-primary)",
                }}
              >
                927
              </span>
              <span
                style={{
                  fontSize: "0.85rem",
                  color: "var(--color-text-secondary)",
                  fontWeight: 500,
                }}
              >
                Development
              </span>
            </div>
            <p
              style={{
                fontSize: "0.78rem",
                color: "rgba(160,160,160,0.35)",
                letterSpacing: "0.02em",
              }}
            >
              Built for FiveM. Tested in production. © 2026 927 Development.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
```

- [ ] Update `App.jsx`:

```jsx
// src/App.jsx
import { useLenis } from "@/hooks/useLenis"
import { Hero } from "@/components/Hero"
import { Problem } from "@/components/Problem"
import { Services } from "@/components/Services"
import { SocialProof } from "@/components/SocialProof"
import { ScriptShowcase } from "@/components/ScriptShowcase"
import { Contact } from "@/components/Contact"

export default function App() {
  useLenis()
  return (
    <main>
      <Hero />
      <Problem />
      <Services />
      <SocialProof />
      <ScriptShowcase />
      <Contact />
    </main>
  )
}
```

- [ ] Run `npm run dev`. Scroll to the bottom — CTA section should appear with the ghost 3D logo in the background, headline animates in, Discord button glows on hover.

- [ ] Commit:

```bash
cd C:/Users/keyno/Desktop/927-dev-services
git add src/components/Contact.jsx src/App.jsx
git commit -m "task 9: contact/cta section with 3d logo return, discord cta, footer"
```

---

## Task 10: App.jsx Assembly & Final Polish

**Files:**
- Modify: `src/App.jsx` — final assembly with custom cursor
- Modify: `src/index.css` — pulse keyframe for scroll indicator
- Modify: `src/main.jsx` — verify ScrollTrigger registration is clean

### Steps

- [ ] Add the `@keyframes pulse` animation to `src/index.css` (append to end of file):

```css
/* Append to src/index.css */

@keyframes pulse {
  0%, 100% { opacity: 0.4; transform: scaleY(1); }
  50%       { opacity: 1;   transform: scaleY(1.2); }
}

/* Prevent content from flashing before GSAP initializes */
.gsap-hidden {
  visibility: hidden;
}
```

- [ ] Write the final `src/App.jsx` with all sections, custom cursor, and cleanup:

```jsx
// src/App.jsx
import { useEffect, useRef } from "react"
import { useLenis } from "@/hooks/useLenis"
import { Hero } from "@/components/Hero"
import { Problem } from "@/components/Problem"
import { Services } from "@/components/Services"
import { SocialProof } from "@/components/SocialProof"
import { ScriptShowcase } from "@/components/ScriptShowcase"
import { Contact } from "@/components/Contact"
import cursorImg from "@/assets/927-cursor-lg.png"

export default function App() {
  // Initialize Lenis smooth scroll + GSAP ScrollTrigger sync
  useLenis()

  // Custom cursor
  const cursorRef = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    let rafId

    const moveCursor = (e) => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        cursor.style.left = `${e.clientX}px`
        cursor.style.top  = `${e.clientY}px`
      })
    }

    window.addEventListener("mousemove", moveCursor, { passive: true })

    return () => {
      window.removeEventListener("mousemove", moveCursor)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      {/* Custom cursor */}
      <img
        ref={cursorRef}
        src={cursorImg}
        alt=""
        aria-hidden
        id="custom-cursor"
        style={{
          width: "32px",
          height: "32px",
          objectFit: "contain",
        }}
      />

      {/* Main page */}
      <main>
        <Hero />
        <Problem />
        <Services />
        <SocialProof />
        <ScriptShowcase />
        <Contact />
      </main>
    </>
  )
}
```

- [ ] Verify `src/main.jsx` is clean with global GSAP plugin registration (should already be done in Task 2, but confirm):

```jsx
// src/main.jsx — verify it looks like this
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import "@/index.css"
import App from "@/App"

gsap.registerPlugin(ScrollTrigger)

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

- [ ] Run `npm run dev` and do a full scroll-through verification checklist in the browser:

  - [ ] Hero: 3D "927" text visible, particles floating, bloom glow active
  - [ ] Hero: Scrolling causes logo to scale down + move up (scrub working)
  - [ ] Hero: "We Build Worlds" text splits and animates in
  - [ ] Hero: CTA button glows on hover
  - [ ] Hero: Scroll indicator visible at bottom
  - [ ] Problem: Headline splits in, pain points stagger with number + line animation
  - [ ] Services: Section pins to viewport on scroll
  - [ ] Services: Each of 5 services animates in as previous exits
  - [ ] Services: After service 5, page unpins and continues scrolling
  - [ ] SocialProof: 4 stat cards reveal with stagger, numbers count up from 0
  - [ ] ScriptShowcase: Cards slide in from right, GlassCard hover tilt/glow works
  - [ ] Contact: Ghost 3D logo visible in background, headline animates in, Discord button glows
  - [ ] Footer: Visible with copyright
  - [ ] Custom cursor: 927 cursor image follows mouse across entire page
  - [ ] Grain overlay: Subtle noise texture visible over all sections
  - [ ] Smooth scroll: Lenis buttery scroll feel throughout
  - [ ] No console errors

- [ ] Run production build to verify no build errors:

```bash
cd C:/Users/keyno/Desktop/927-dev-services
npm run build
```

Expected: Build completes without errors. Check the output for bundle size — target is under 300KB gzipped for JS.

- [ ] Commit final assembly:

```bash
cd C:/Users/keyno/Desktop/927-dev-services
git add src/App.jsx src/main.jsx src/index.css
git commit -m "task 10: final app assembly — all sections wired, custom cursor, production verified"
```

---

## Known Gotchas & Watchpoints

### Three.js Text3D Font
- `Text3D` from `@react-three/drei` requires a `typeface.json` font file at a public URL, not an import.
- The Helvetiker Bold font from the three.js repo is the safest default. Placed at `public/fonts/helvetiker_bold.typeface.json`, it will be served at `/927-dev-services/fonts/helvetiker_bold.typeface.json` (because of `base: '/927-dev-services/'` in vite.config.js).
- If the font 404s, the 3D canvas will render empty. Check Network tab for the font request.

### Lenis + React StrictMode
- In development, React StrictMode double-invokes effects. Lenis will be initialized twice and destroyed once — this is harmless in dev but the lerp value may feel slightly off. Irrelevant in production builds.

### GSAP ScrollTrigger + Pinned Sections
- `anticipatePin: 1` on the Services section prevents a flash/jump when pinning begins. Keep it.
- If scrolling feels "jumpy" in the Services section, increase `scrub` from `0.5` to `1` for smoother playback.
- ScrollTrigger must be refreshed after layout changes (e.g., window resize). Add `ScrollTrigger.refresh()` on `window.resize` if needed.

### frameloop="demand" and Scroll Scrub
- With `frameloop="demand"`, Three.js only renders when `.invalidate()` is called.
- The `SceneContents` component calls `invalidate()` inside a `useMemo` triggered by `scrollProgress` changes — this ensures the canvas re-renders on every scroll update.
- If the 3D logo stops responding to scroll, this is the first place to debug.

### Tailwind v4 Color Tokens
- Tailwind v4 reads color tokens from `@theme {}` in CSS. To use them as Tailwind utility classes (e.g., `text-accent`, `bg-surface`), the token name must be `--color-*`. All tokens defined in `index.css` follow this pattern and are available as Tailwind utilities automatically.
- The old green/cyan tokens from the previous design system are kept as fallbacks under legacy aliases — remove them in a cleanup pass after launch.

### Services Section on Mobile
- The `pin: true` ScrollTrigger setup works best on desktop. On mobile (touch), pinning can feel laggy.
- For a future mobile pass: detect `window.innerWidth < 768` and skip the pin, letting all 5 cards render as a normal vertical stack with individual ScrollReveal animations instead.

### GlassCard Hover on Touch Devices
- The mouse-tracking radial glow in `GlassCard` won't fire on touch. This is expected — the static glass appearance is still clean.

### `@react-three/postprocessing` Bloom
- The `Bloom` effect from `@react-three/postprocessing` wraps the `three` postprocessing library. Version compatibility between `postprocessing` (already in deps at `^6.39.0`) and `@react-three/postprocessing` (at `^3.0.4`) is already satisfied — do not upgrade either independently without testing.

---

## File Tree After All Tasks Complete

```
src/
├── App.jsx                          — Lenis init, all sections, custom cursor
├── main.jsx                         — GSAP plugin registration, React root
├── index.css                        — Design system tokens, grain, base styles
├── assets/
│   └── 927-cursor-lg.png            — Custom cursor (existing, keep)
├── components/
│   ├── Hero.jsx                     — Full-screen 3D hero + tagline
│   ├── Problem.jsx                  — Pain point text section
│   ├── Services.jsx                 — Pinned scroll services showcase
│   ├── ServiceCard.jsx              — Individual service card (used by Services)
│   ├── SocialProof.jsx              — Animated stat counters
│   ├── ScriptShowcase.jsx           — 927 Suite script cards
│   ├── Contact.jsx                  — CTA + Discord link + footer
│   └── ui/
│       ├── Scene3D.jsx              — Three.js canvas, 927 logo mesh, particles
│       ├── SplitText.jsx            — GSAP word-split animation component
│       ├── ScrollReveal.jsx         — Scroll-triggered fade/slide wrapper
│       ├── Counter.jsx              — Animated number counter
│       └── GlassCard.jsx           — Glass-morphism card with cursor glow
├── hooks/
│   ├── useLenis.js                  — Lenis init + GSAP ticker sync
│   └── useScrollTrigger.js         — Reusable ScrollTrigger hook
└── lib/
    └── (existing utils, unchanged)

public/
└── fonts/
    └── helvetiker_bold.typeface.json  — Three.js Text3D font
```

**Deleted files (from old design):**
- `src/components/ui/BootSequence.jsx`
- `src/components/ui/BorderBeam.jsx`
- `src/components/ui/ShinyText.jsx`
- `src/components/ui/HyperText.jsx`
- `src/components/ui/TiltCard.jsx`
- `src/components/ui/Background3D.jsx`
- `src/components/ui/Particles.jsx`
