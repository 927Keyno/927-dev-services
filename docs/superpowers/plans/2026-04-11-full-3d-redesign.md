# 927 Dev Services — Full 3D Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the 927 Development services website from scratch with interactive 3D elements in every section, scroll-triggered animations, and premium interactive experience.

**Architecture:** Single-page React app (Vite + Tailwind v4). Hero uses Spline for interactive 3D robot. All other sections use React Three Fiber for lightweight custom 3D scenes. GSAP ScrollTrigger handles scroll animations, Lenis provides smooth scroll, Framer Motion handles micro-interactions. 21st.dev Magic MCP generates premium UI components throughout.

**Tech Stack:** React 19, Vite 8, Tailwind CSS v4, Three.js + R3F + Drei, Spline, GSAP + ScrollTrigger, Framer Motion, Lenis

**Spec:** `docs/superpowers/specs/2026-04-11-full-3d-redesign-design.md`

---

## File Structure

```
src/
  App.jsx                        — REWRITE: new section composition, keep cursor logic
  main.jsx                       — KEEP: GSAP registration, root render
  index.css                      — MODIFY: add new keyframes, keep design system tokens
  lib/
    utils.js                     — KEEP: cn() helper
  hooks/
    useLenis.js                  — KEEP: smooth scroll hook
    useInView.js                 — CREATE: intersection observer for lazy 3D mounting
    useMousePosition.js          — CREATE: shared normalized mouse position
  components/
    layout/
      Navbar.jsx                 — CREATE: new sticky nav with glass transition
      Footer.jsx                 — CREATE: footer with links + branding
    sections/
      Hero.jsx                   — CREATE: Spline robot + Spotlight + CTAs
      Services.jsx               — CREATE: 5 alternating rows with R3F scenes
      Stats.jsx                  — CREATE: counter section with 3D globe
      Testimonials.jsx           — CREATE: glass cards with Spotlight + floating 3D
      About.jsx                  — CREATE: brand story + interactive 927 logo
      CTAFooter.jsx              — CREATE: final CTA block + particle field
    ui/
      GlassCard.jsx              — KEEP: existing 3D tilt card
      ScrollReveal.jsx           — KEEP: GSAP scroll reveal wrapper
      SplitText.jsx              — KEEP: character-level text animation
      Counter.jsx                — KEEP: animated count-up
      splite.jsx                 — KEEP: Spline lazy wrapper
      spotlight.jsx              — KEEP: framer-motion mouse-follow glow
      ServiceRow.jsx             — CREATE: single service row (content + 3D)
      StatCard.jsx               — CREATE: single stat counter card
      TestimonialCard.jsx        — CREATE: single testimonial glass card
    three/
      CityGrid.jsx               — CREATE: wireframe city grid (Full Server Builds)
      CodeTerminal.jsx            — CREATE: holographic code block (Custom Scripts)
      WeaponModel.jsx             — CREATE: spinning geometric weapon (3D Design)
      Dashboard.jsx               — CREATE: pulsing heartbeat dashboard (Server Mgmt)
      NodeNetwork.jsx             — CREATE: interconnected nodes (Database/Infra)
      Logo927.jsx                 — CREATE: interactive neon 927 logo (About)
      Globe.jsx                   — CREATE: connection globe (Stats)
      ParticleField.jsx           — CREATE: ambient particles (Footer)
      SharedCanvas.jsx            — CREATE: reusable R3F Canvas wrapper with perf defaults
  assets/
    927-cursor-lg.png            — KEEP: custom cursor image
```

**Reusable from existing codebase:** GlassCard, ScrollReveal, SplitText, Counter, splite, spotlight, useLenis, utils.js, main.jsx, index.css (design tokens), vite.config.js, package.json (all deps already installed).

**Deleted after rebuild:** Hero.jsx, Problem.jsx, Services.jsx (old), Pricing.jsx, SocialProof.jsx, ScriptShowcase.jsx, Contact.jsx, Navbar.jsx (old), ServiceCard.jsx, Scene3D.jsx, spline-demo.jsx. These are replaced by the new structure.

---

## Task 1: Shared Hooks and Utilities

**Files:**
- Create: `src/hooks/useInView.js`
- Create: `src/hooks/useMousePosition.js`

These are dependencies for nearly every section — build first.

- [ ] **Step 1: Create useInView hook**

```jsx
// src/hooks/useInView.js
import { useState, useEffect, useRef } from "react"

export function useInView({ threshold = 0.1, rootMargin = "200px 0px" } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold, rootMargin }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return [ref, inView]
}
```

- [ ] **Step 2: Create useMousePosition hook**

```jsx
// src/hooks/useMousePosition.js
import { useState, useEffect } from "react"

export function useMousePosition() {
  const [mouse, setMouse] = useState({ x: 0, y: 0, nx: 0, ny: 0 })

  useEffect(() => {
    const onMove = (e) => {
      setMouse({
        x: e.clientX,
        y: e.clientY,
        nx: (e.clientX / window.innerWidth) * 2 - 1,
        ny: -(e.clientY / window.innerHeight) * 2 + 1,
      })
    }
    window.addEventListener("mousemove", onMove, { passive: true })
    return () => window.removeEventListener("mousemove", onMove)
  }, [])

  return mouse
}
```

- [ ] **Step 3: Verify dev server runs**

Run: `cd C:/Users/keyno/Desktop/927-dev-services && npm run dev`
Expected: Vite starts, no import errors.

- [ ] **Step 4: Commit**

```bash
cd C:/Users/keyno/Desktop/927-dev-services
git add src/hooks/useInView.js src/hooks/useMousePosition.js
git commit -m "feat: add useInView and useMousePosition hooks for 3D redesign"
```

---

## Task 2: SharedCanvas and R3F Wrapper

**Files:**
- Create: `src/components/three/SharedCanvas.jsx`

Reusable Canvas wrapper with performance defaults used by every 3D section.

- [ ] **Step 1: Create SharedCanvas component**

```jsx
// src/components/three/SharedCanvas.jsx
import { Canvas } from "@react-three/fiber"
import { cn } from "@/lib/utils"

export function SharedCanvas({ children, className, camera, ...props }) {
  return (
    <Canvas
      className={cn("w-full h-full", className)}
      camera={{ position: [0, 0, 5], fov: 50, ...camera }}
      frameloop="demand"
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, 1.5]}
      {...props}
    >
      {children}
    </Canvas>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/three/SharedCanvas.jsx
git commit -m "feat: add SharedCanvas R3F wrapper with perf defaults"
```

---

## Task 3: R3F 3D Scenes — CityGrid, CodeTerminal, WeaponModel

**Files:**
- Create: `src/components/three/CityGrid.jsx`
- Create: `src/components/three/CodeTerminal.jsx`
- Create: `src/components/three/WeaponModel.jsx`

First batch of service 3D elements. Each is a self-contained R3F scene content component (rendered inside SharedCanvas).

- [ ] **Step 1: Create CityGrid (Full Server Builds)**

```jsx
// src/components/three/CityGrid.jsx
import { useRef, useMemo } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

function Building({ position, height, width }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.15
      state.invalidate()
    }
  })

  return (
    <mesh ref={meshRef} position={[position[0], height / 2, position[1]]}>
      <boxGeometry args={[width, height, width]} />
      <meshStandardMaterial
        color="#9333ea"
        transparent
        opacity={0.3}
        wireframe
      />
    </mesh>
  )
}

export function CityGrid() {
  const groupRef = useRef()
  const mouseRef = useRef({ x: 0, y: 0 })

  const buildings = useMemo(() => {
    const arr = []
    for (let x = -4; x <= 4; x += 1.2) {
      for (let z = -3; z <= 3; z += 1.2) {
        arr.push({
          position: [x, z],
          height: 0.5 + Math.random() * 2.5,
          width: 0.4 + Math.random() * 0.4,
        })
      }
    }
    return arr
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      const pointer = state.pointer
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        pointer.x * 0.15,
        0.05
      )
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        pointer.y * 0.08 - 0.3,
        0.05
      )
      state.invalidate()
    }
  })

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      <gridHelper args={[10, 20, "#9333ea", "#1f1f1f"]} />
      {buildings.map((b, i) => (
        <Building key={i} {...b} />
      ))}
      <ambientLight intensity={0.3} />
      <pointLight position={[3, 5, 3]} color="#9333ea" intensity={1.5} />
    </group>
  )
}
```

- [ ] **Step 2: Create CodeTerminal (Custom Script Development)**

```jsx
// src/components/three/CodeTerminal.jsx
import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Text, RoundedBox } from "@react-three/drei"
import * as THREE from "three"

const CODE_LINES = [
  "RegisterNetEvent('927:server')",
  "  local src = source",
  "  local xPlayer = ESX.GetPlayer(src)",
  "  if not xPlayer then return end",
  "  local money = xPlayer.getMoney()",
  "  TriggerClientEvent('927:sync')",
  "  exports.oxmysql:execute(",
  "    'UPDATE users SET bank=?',",
  "    { money }, function(result)",
  "      print('Updated: '..src)",
  "    end",
  "  )",
  "end)",
]

export function CodeTerminal() {
  const groupRef = useRef()
  const scrollRef = useRef(0)

  useFrame((state) => {
    if (groupRef.current) {
      const pointer = state.pointer
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        pointer.x * 0.1,
        0.05
      )
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        pointer.y * 0.05,
        0.05
      )
      scrollRef.current += 0.003
      if (scrollRef.current > 1) scrollRef.current = 0
      state.invalidate()
    }
  })

  return (
    <group ref={groupRef}>
      <RoundedBox args={[4, 3, 0.15]} radius={0.08} smoothness={4}>
        <meshStandardMaterial color="#0a0a0a" transparent opacity={0.9} />
      </RoundedBox>

      {/* Terminal header bar */}
      <mesh position={[0, 1.3, 0.08]}>
        <planeGeometry args={[3.8, 0.25]} />
        <meshStandardMaterial color="#141414" />
      </mesh>

      {/* Dots */}
      {[[-1.6, 1.3, 0.1], [-1.45, 1.3, 0.1], [-1.3, 1.3, 0.1]].map((pos, i) => (
        <mesh key={i} position={pos}>
          <circleGeometry args={[0.04, 16]} />
          <meshStandardMaterial color={["#ff5f57", "#febc2e", "#28c840"][i]} />
        </mesh>
      ))}

      {/* Code lines */}
      {CODE_LINES.map((line, i) => (
        <Text
          key={i}
          position={[-1.7, 0.9 - i * 0.18, 0.08]}
          fontSize={0.09}
          color={line.includes("927") ? "#9333ea" : line.includes("function") || line.includes("end") ? "#f59e0b" : "#a0a0a0"}
          anchorX="left"
          anchorY="middle"
          font={undefined}
          maxWidth={3.5}
        >
          {line}
        </Text>
      ))}

      {/* Glow */}
      <pointLight position={[0, 0, 2]} color="#9333ea" intensity={0.8} distance={5} />
      <ambientLight intensity={0.2} />
    </group>
  )
}
```

- [ ] **Step 3: Create WeaponModel (Custom 3D Design)**

```jsx
// src/components/three/WeaponModel.jsx
import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

function GunShape() {
  const points = useMemo(() => {
    const shape = new THREE.Shape()
    // Simplified pistol silhouette
    shape.moveTo(0, 0)
    shape.lineTo(2, 0)
    shape.lineTo(2.3, 0.15)
    shape.lineTo(2.5, 0.15)
    shape.lineTo(2.5, 0.4)
    shape.lineTo(2.2, 0.4)
    shape.lineTo(2, 0.3)
    shape.lineTo(1.8, 0.3)
    shape.lineTo(1.8, 0.5)
    shape.lineTo(1.5, 0.5)
    shape.lineTo(1.5, 0.3)
    shape.lineTo(0.5, 0.3)
    shape.lineTo(0.3, -0.5)
    shape.lineTo(0.7, -0.5)
    shape.lineTo(0.8, 0)
    shape.lineTo(0, 0)

    const extrudeSettings = { depth: 0.15, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2 }
    return { shape, extrudeSettings }
  }, [])

  return (
    <mesh position={[-1.2, 0, -0.075]}>
      <extrudeGeometry args={[points.shape, points.extrudeSettings]} />
      <meshPhysicalMaterial
        color="#1a1a2e"
        metalness={0.9}
        roughness={0.2}
        clearcoat={0.5}
        clearcoatRoughness={0.1}
      />
    </mesh>
  )
}

export function WeaponModel() {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      const pointer = state.pointer
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        pointer.x * 0.4 + Math.sin(state.clock.elapsedTime * 0.3) * 0.1,
        0.05
      )
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        pointer.y * 0.15,
        0.05
      )
      state.invalidate()
    }
  })

  return (
    <group ref={groupRef}>
      <GunShape />

      {/* Wireframe overlay */}
      <mesh position={[-1.2, 0, -0.075]}>
        <extrudeGeometry args={[new THREE.Shape().moveTo(0,0).lineTo(2,0).lineTo(2.5,0.4).lineTo(0,0.3).lineTo(0,0), { depth: 0.15, bevelEnabled: false }]} />
        <meshBasicMaterial color="#9333ea" wireframe transparent opacity={0.15} />
      </mesh>

      <ambientLight intensity={0.3} />
      <pointLight position={[2, 2, 3]} color="#9333ea" intensity={1.5} />
      <pointLight position={[-2, -1, 2]} color="#7c3aed" intensity={0.5} />
    </group>
  )
}
```

- [ ] **Step 4: Verify no import errors — run dev server**

Run: `npm run dev`
Expected: Clean start, no errors. (Scenes aren't rendered yet, just importable.)

- [ ] **Step 5: Commit**

```bash
git add src/components/three/CityGrid.jsx src/components/three/CodeTerminal.jsx src/components/three/WeaponModel.jsx
git commit -m "feat: add CityGrid, CodeTerminal, WeaponModel R3F scenes"
```

---

## Task 4: R3F 3D Scenes — Dashboard, NodeNetwork, Logo927, Globe, ParticleField

**Files:**
- Create: `src/components/three/Dashboard.jsx`
- Create: `src/components/three/NodeNetwork.jsx`
- Create: `src/components/three/Logo927.jsx`
- Create: `src/components/three/Globe.jsx`
- Create: `src/components/three/ParticleField.jsx`

Second batch — remaining 3D elements for Stats, About, and Footer sections.

- [ ] **Step 1: Create Dashboard (Server Management)**

```jsx
// src/components/three/Dashboard.jsx
import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Line } from "@react-three/drei"
import * as THREE from "three"

function HeartbeatLine({ offset = 0 }) {
  const ref = useRef()
  const progressRef = useRef(0)

  const basePoints = useMemo(() => {
    const pts = []
    for (let i = 0; i <= 100; i++) {
      const x = (i / 100) * 6 - 3
      let y = 0
      const pos = i % 25
      if (pos >= 10 && pos < 12) y = 0.8
      else if (pos >= 12 && pos < 14) y = -0.4
      else if (pos >= 14 && pos < 16) y = 0.3
      pts.push(new THREE.Vector3(x, y + offset, 0))
    }
    return pts
  }, [offset])

  useFrame((state) => {
    progressRef.current += 0.005
    if (progressRef.current > 1) progressRef.current = 0
    state.invalidate()
  })

  return (
    <Line
      points={basePoints}
      color="#9333ea"
      lineWidth={2}
      transparent
      opacity={0.7}
    />
  )
}

export function Dashboard() {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        state.pointer.x * 0.08,
        0.04
      )
      state.invalidate()
    }
  })

  return (
    <group ref={groupRef}>
      {/* Monitor frame */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[5, 3]} />
        <meshStandardMaterial color="#0a0a0a" transparent opacity={0.8} />
      </mesh>

      {/* Heartbeat lines */}
      <HeartbeatLine offset={0.5} />
      <HeartbeatLine offset={0} />
      <HeartbeatLine offset={-0.5} />

      {/* Border glow */}
      <mesh position={[0, 0, -0.11]}>
        <planeGeometry args={[5.1, 3.1]} />
        <meshBasicMaterial color="#9333ea" transparent opacity={0.1} />
      </mesh>

      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 3]} color="#9333ea" intensity={1} />
    </group>
  )
}
```

- [ ] **Step 2: Create NodeNetwork (Database & Infrastructure)**

```jsx
// src/components/three/NodeNetwork.jsx
import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

function Node({ position, size = 0.12 }) {
  const ref = useRef()

  useFrame((state) => {
    if (ref.current) {
      const dist = Math.sqrt(
        Math.pow(state.pointer.x * 3 - position[0], 2) +
        Math.pow(state.pointer.y * 2 - position[1], 2)
      )
      const glow = Math.max(0, 1 - dist / 2.5)
      ref.current.material.emissiveIntensity = 0.3 + glow * 2
      ref.current.scale.setScalar(1 + glow * 0.3)
      state.invalidate()
    }
  })

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial
        color="#9333ea"
        emissive="#9333ea"
        emissiveIntensity={0.3}
      />
    </mesh>
  )
}

function Connection({ start, end }) {
  const points = useMemo(() => [
    new THREE.Vector3(...start),
    new THREE.Vector3(...end),
  ], [start, end])

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={2}
          array={new Float32Array([...start, ...end])}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#9333ea" transparent opacity={0.15} />
    </line>
  )
}

export function NodeNetwork() {
  const groupRef = useRef()

  const { nodes, connections } = useMemo(() => {
    const n = []
    for (let i = 0; i < 20; i++) {
      n.push([
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 2,
      ])
    }
    const c = []
    for (let i = 0; i < n.length; i++) {
      for (let j = i + 1; j < n.length; j++) {
        const dist = Math.sqrt(
          Math.pow(n[i][0] - n[j][0], 2) +
          Math.pow(n[i][1] - n[j][1], 2) +
          Math.pow(n[i][2] - n[j][2], 2)
        )
        if (dist < 2.5) c.push({ start: n[i], end: n[j] })
      }
    }
    return { nodes: n, connections: c }
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        state.pointer.x * 0.1,
        0.03
      )
      state.invalidate()
    }
  })

  return (
    <group ref={groupRef}>
      {nodes.map((pos, i) => (
        <Node key={i} position={pos} />
      ))}
      {connections.map((c, i) => (
        <Connection key={i} start={c.start} end={c.end} />
      ))}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 4]} color="#9333ea" intensity={1} />
    </group>
  )
}
```

- [ ] **Step 3: Create Logo927 (About section)**

```jsx
// src/components/three/Logo927.jsx
import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Text3D, Center } from "@react-three/drei"
import * as THREE from "three"

function FloatingParticle({ position }) {
  const ref = useRef()
  const speed = useMemo(() => 0.3 + Math.random() * 0.5, [])
  const offset = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime
      ref.current.position.y = position[1] + Math.sin(t * speed + offset) * 0.5
      ref.current.position.x = position[0] + Math.cos(t * speed * 0.7 + offset) * 0.3
      state.invalidate()
    }
  })

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshBasicMaterial color="#9333ea" transparent opacity={0.6} />
    </mesh>
  )
}

export function Logo927() {
  const groupRef = useRef()

  const particles = useMemo(() => {
    const pts = []
    for (let i = 0; i < 40; i++) {
      pts.push([
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 2,
      ])
    }
    return pts
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        state.pointer.x * 0.2,
        0.04
      )
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        state.pointer.y * 0.1,
        0.04
      )
      state.invalidate()
    }
  })

  return (
    <group ref={groupRef}>
      <Center>
        <Text3D
          font="/927-dev-services/fonts/Inter_Bold.json"
          size={1.2}
          height={0.3}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
        >
          927
          <meshPhysicalMaterial
            color="#9333ea"
            emissive="#7c3aed"
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
            clearcoat={1}
          />
        </Text3D>
      </Center>

      {particles.map((pos, i) => (
        <FloatingParticle key={i} position={pos} />
      ))}

      <ambientLight intensity={0.2} />
      <pointLight position={[3, 3, 5]} color="#9333ea" intensity={2} />
      <pointLight position={[-3, -2, 3]} color="#7c3aed" intensity={0.8} />
    </group>
  )
}
```

- [ ] **Step 4: Create Globe (Stats section)**

```jsx
// src/components/three/Globe.jsx
import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

function ConnectionArc({ startLat, startLng, endLat, endLng }) {
  const curve = useMemo(() => {
    const toVec3 = (lat, lng, r) => {
      const phi = (90 - lat) * (Math.PI / 180)
      const theta = (lng + 180) * (Math.PI / 180)
      return new THREE.Vector3(
        -r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
      )
    }
    const start = toVec3(startLat, startLng, 1.5)
    const end = toVec3(endLat, endLng, 1.5)
    const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(2.2)
    return new THREE.QuadraticBezierCurve3(start, mid, end)
  }, [startLat, startLng, endLat, endLng])

  const points = useMemo(() => curve.getPoints(30), [curve])

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#9333ea" transparent opacity={0.4} />
    </line>
  )
}

export function Globe() {
  const globeRef = useRef()

  const connections = useMemo(() => [
    { startLat: 40, startLng: -74, endLat: 51, endLng: 0 },
    { startLat: 40, startLng: -74, endLat: 35, endLng: 139 },
    { startLat: 51, startLng: 0, endLat: -33, endLng: 151 },
    { startLat: 34, startLng: -118, endLat: 40, endLng: -74 },
    { startLat: 40, startLng: -74, endLat: -23, endLng: -46 },
    { startLat: 51, startLng: 0, endLat: 55, endLng: 37 },
  ], [])

  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.002
      globeRef.current.rotation.y += state.pointer.x * 0.003
      state.invalidate()
    }
  })

  return (
    <group ref={globeRef}>
      {/* Wireframe globe */}
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial
          color="#1f1f1f"
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Solid inner glow */}
      <mesh>
        <sphereGeometry args={[1.48, 32, 32]} />
        <meshStandardMaterial
          color="#0a0a0a"
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Connection arcs */}
      {connections.map((c, i) => (
        <ConnectionArc key={i} {...c} />
      ))}

      <ambientLight intensity={0.2} />
      <pointLight position={[3, 3, 5]} color="#9333ea" intensity={1.5} />
    </group>
  )
}
```

- [ ] **Step 5: Create ParticleField (Footer)**

```jsx
// src/components/three/ParticleField.jsx
import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export function ParticleField({ count = 300 }) {
  const pointsRef = useRef()

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 15
      arr[i * 3 + 1] = (Math.random() - 0.5) * 6
      arr[i * 3 + 2] = (Math.random() - 0.5) * 5
    }
    return arr
  }, [count])

  useFrame((state) => {
    if (pointsRef.current) {
      const pos = pointsRef.current.geometry.attributes.position.array
      for (let i = 0; i < count; i++) {
        pos[i * 3 + 1] += Math.sin(state.clock.elapsedTime * 0.3 + i) * 0.001
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true
      state.invalidate()
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#9333ea"
        size={0.03}
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}
```

- [ ] **Step 6: Verify all imports clean**

Run: `npm run dev`
Expected: No errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/three/Dashboard.jsx src/components/three/NodeNetwork.jsx src/components/three/Logo927.jsx src/components/three/Globe.jsx src/components/three/ParticleField.jsx
git commit -m "feat: add Dashboard, NodeNetwork, Logo927, Globe, ParticleField R3F scenes"
```

---

## Task 5: Font Asset for Text3D

**Files:**
- Create: `public/fonts/Inter_Bold.json`

Text3D requires a typeface JSON font. Generate from existing Inter Bold.

- [ ] **Step 1: Generate the font JSON**

Run: `npx gltf-pipeline` won't work here. Instead, download a pre-converted Inter Bold typeface JSON from the three.js examples or use facetype.js.

Alternative approach — use Drei's `<Text>` instead of `<Text3D>` to avoid needing a font file. If Text3D font is not available, update Logo927.jsx to use billboard `<Text>` with thick styling:

```jsx
// If font file not available, replace Text3D in Logo927.jsx with:
import { Text } from "@react-three/drei"

<Text
  fontSize={2}
  color="#9333ea"
  anchorX="center"
  anchorY="middle"
  outlineWidth={0.05}
  outlineColor="#7c3aed"
>
  927
  <meshPhysicalMaterial
    color="#9333ea"
    emissive="#7c3aed"
    emissiveIntensity={0.5}
    metalness={0.8}
    roughness={0.2}
  />
</Text>
```

- [ ] **Step 2: Decide approach and commit**

If font file approach: download, place in `public/fonts/`, commit.
If Text approach: update Logo927.jsx to use `<Text>` from drei, commit.

```bash
git add -A
git commit -m "feat: add font asset or update Logo927 to use Drei Text"
```

---

## Task 6: Layout — Navbar

**Files:**
- Create: `src/components/layout/Navbar.jsx`

New sticky nav with glass transition on scroll.

- [ ] **Step 1: Create Navbar component**

```jsx
// src/components/layout/Navbar.jsx
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Stats", href: "#stats" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "About", href: "#about" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const handleClick = (e, href) => {
    e.preventDefault()
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: "smooth" })
    setMobileOpen(false)
  }

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[rgba(10,10,10,0.8)] border-b border-[rgba(147,51,234,0.15)]"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="text-xl font-bold text-[var(--color-text-primary)]">
          <span className="text-[var(--color-accent)]">927</span> Development
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://927-development.tebex.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            Scripts
          </a>
        </div>

        {/* CTA */}
        <div className="hidden md:block">
          <a
            href="https://discord.gg/hRZeHwWyHG"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 text-sm font-medium rounded-lg bg-[var(--color-accent)] text-white hover:shadow-[0_0_20px_rgba(147,51,234,0.4)] transition-shadow"
          >
            Get a Quote
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span className={cn("w-6 h-0.5 bg-[var(--color-text-primary)] transition-transform", mobileOpen && "rotate-45 translate-y-2")} />
          <span className={cn("w-6 h-0.5 bg-[var(--color-text-primary)] transition-opacity", mobileOpen && "opacity-0")} />
          <span className={cn("w-6 h-0.5 bg-[var(--color-text-primary)] transition-transform", mobileOpen && "-rotate-45 -translate-y-2")} />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-[rgba(10,10,10,0.95)] border-t border-[rgba(147,51,234,0.15)] px-6 py-4 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://927-development.tebex.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
          >
            Scripts
          </a>
          <a
            href="https://discord.gg/hRZeHwWyHG"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 text-sm font-medium rounded-lg bg-[var(--color-accent)] text-white text-center"
          >
            Get a Quote
          </a>
        </div>
      )}
    </nav>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/Navbar.jsx
git commit -m "feat: add new sticky Navbar with glass scroll effect"
```

---

## Task 7: Layout — Footer

**Files:**
- Create: `src/components/layout/Footer.jsx`

- [ ] **Step 1: Create Footer component**

```jsx
// src/components/layout/Footer.jsx
import { cn } from "@/lib/utils"

const FOOTER_LINKS = [
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Scripts", href: "https://927-development.tebex.io", external: true },
]

const SOCIAL_LINKS = [
  { label: "Discord", href: "https://discord.gg/hRZeHwWyHG" },
  { label: "YouTube", href: "#" },
  { label: "Tebex", href: "https://927-development.tebex.io" },
]

export function Footer() {
  return (
    <footer className="border-t border-[rgba(147,51,234,0.1)] bg-[var(--color-base)]">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Logo */}
        <div className="text-lg font-bold">
          <span className="text-[var(--color-accent)]">927</span>
          <span className="text-[var(--color-text-secondary)]"> Development</span>
        </div>

        {/* Nav */}
        <div className="flex gap-6">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Social */}
        <div className="flex gap-4">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-[rgba(147,51,234,0.05)] py-4 text-center">
        <p className="text-xs text-[var(--color-text-secondary)] opacity-50">
          &copy; {new Date().getFullYear()} 927 Development. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/Footer.jsx
git commit -m "feat: add Footer with nav, social links, and branding"
```

---

## Task 8: Hero Section

**Files:**
- Create: `src/components/sections/Hero.jsx`

The showstopper — Spline robot + Spotlight + CTAs.

- [ ] **Step 1: Create Hero section**

```jsx
// src/components/sections/Hero.jsx
import { Suspense, lazy } from "react"
import { Spotlight } from "@/components/ui/spotlight"
import { ScrollReveal } from "@/components/ui/ScrollReveal"

const SplineScene = lazy(() =>
  import("@/components/ui/splite").then((m) => ({ default: m.SplineScene }))
)

export function Hero() {
  return (
    <section id="hero" className="section relative min-h-screen flex items-center overflow-hidden">
      {/* Spotlight */}
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" size={400} />

      <div className="max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row items-center gap-8 pt-16">
        {/* Left — Content */}
        <div className="flex-1 relative z-10 flex flex-col justify-center md:pr-8">
          <ScrollReveal>
            <p className="text-sm font-medium tracking-widest uppercase text-[var(--color-accent)] mb-4">
              Premium FiveM Development
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-[var(--color-text-primary)] to-[var(--color-text-secondary)]">
                We Build
              </span>
              <br />
              <span className="text-[var(--color-accent)] glow-purple">
                Worlds
              </span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="text-lg text-[var(--color-text-secondary)] max-w-md mb-8">
              Custom scripts, full server builds, and 3D assets — engineered for performance, designed for immersion.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="flex gap-4">
              <a
                href="https://discord.gg/hRZeHwWyHG"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-lg bg-[var(--color-accent)] text-white font-medium hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] transition-all"
              >
                Get a Quote
              </a>
              <a
                href="https://927-development.tebex.io"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-lg border border-[rgba(147,51,234,0.3)] text-[var(--color-text-primary)] font-medium hover:border-[var(--color-accent)] hover:shadow-[0_0_20px_rgba(147,51,234,0.2)] transition-all"
              >
                Browse Scripts
              </a>
            </div>
          </ScrollReveal>
        </div>

        {/* Right — 3D Scene */}
        <div className="flex-1 relative h-[500px] md:h-[600px]">
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </Suspense>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify Hero renders in isolation**

Temporarily update App.jsx to render only Hero. Check in browser.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Hero.jsx
git commit -m "feat: add Hero section with Spline robot and Spotlight"
```

---

## Task 9: ServiceRow UI Component + Services Section

**Files:**
- Create: `src/components/ui/ServiceRow.jsx`
- Create: `src/components/sections/Services.jsx`

- [ ] **Step 1: Create ServiceRow component**

```jsx
// src/components/ui/ServiceRow.jsx
import { Suspense, lazy } from "react"
import { useInView } from "@/hooks/useInView"
import { ScrollReveal } from "@/components/ui/ScrollReveal"
import { GlassCard } from "@/components/ui/GlassCard"
import { cn } from "@/lib/utils"

const SharedCanvas = lazy(() =>
  import("@/components/three/SharedCanvas").then((m) => ({ default: m.SharedCanvas }))
)

export function ServiceRow({ title, description, ThreeScene, reverse = false, index }) {
  const [ref, inView] = useInView({ threshold: 0.2 })

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col md:flex-row items-center gap-8 md:gap-16 py-16 md:py-24",
        reverse && "md:flex-row-reverse"
      )}
    >
      {/* Content */}
      <div className="flex-1">
        <ScrollReveal direction={reverse ? "right" : "left"}>
          <GlassCard className="p-8">
            <span className="text-xs font-mono text-[var(--color-accent)] mb-2 block">
              0{index + 1}
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-4">
              {title}
            </h3>
            <p className="text-[var(--color-text-secondary)] leading-relaxed">
              {description}
            </p>
          </GlassCard>
        </ScrollReveal>
      </div>

      {/* 3D Scene */}
      <div className="flex-1 h-[300px] md:h-[400px]">
        <ScrollReveal direction={reverse ? "left" : "right"}>
          {inView && ThreeScene ? (
            <Suspense
              fallback={
                <div className="w-full h-full rounded-lg bg-[rgba(20,20,20,0.5)] animate-pulse" />
              }
            >
              <SharedCanvas>
                <ThreeScene />
              </SharedCanvas>
            </Suspense>
          ) : (
            <div className="w-full h-full rounded-lg bg-[rgba(20,20,20,0.5)] animate-pulse" />
          )}
        </ScrollReveal>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create Services section**

```jsx
// src/components/sections/Services.jsx
import { lazy } from "react"
import { ServiceRow } from "@/components/ui/ServiceRow"
import { SplitText } from "@/components/ui/SplitText"
import { ScrollReveal } from "@/components/ui/ScrollReveal"

const CityGrid = lazy(() => import("@/components/three/CityGrid").then((m) => ({ default: m.CityGrid })))
const CodeTerminal = lazy(() => import("@/components/three/CodeTerminal").then((m) => ({ default: m.CodeTerminal })))
const WeaponModel = lazy(() => import("@/components/three/WeaponModel").then((m) => ({ default: m.WeaponModel })))
const Dashboard = lazy(() => import("@/components/three/Dashboard").then((m) => ({ default: m.Dashboard })))
const NodeNetwork = lazy(() => import("@/components/three/NodeNetwork").then((m) => ({ default: m.NodeNetwork })))

const SERVICES = [
  {
    title: "Full Server Builds",
    description: "Framework, economy, scripts, configs. ESX/QBox setup, economy design, core script stack (garage, inventory, banking, housing), performance tuning. Your server, built from the ground up.",
    Scene: CityGrid,
  },
  {
    title: "Custom Script Development",
    description: "Exclusive server-only scripts. Full NUI design, database-backed, production-hardened. Includes documentation and ongoing support. Built to your exact spec.",
    Scene: CodeTerminal,
  },
  {
    title: "Custom 3D Design",
    description: "One-of-one assets. Custom weapon models and textures, unique clothing and accessories, YMT addon packs, exclusive art direction. Stand out from every other server.",
    Scene: WeaponModel,
  },
  {
    title: "Server Management & Optimization",
    description: "Script updates, compatibility fixes, performance profiling, resource conflict resolution, on-call support. Keep your server running smooth 24/7.",
    Scene: Dashboard,
  },
  {
    title: "Database & Infrastructure",
    description: "MySQL/MariaDB optimization, VPS provisioning, backup and disaster recovery, txAdmin configuration and monitoring. The backbone your server depends on.",
    Scene: NodeNetwork,
  },
]

export function Services() {
  return (
    <section id="services" className="section relative py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <p className="text-sm font-medium tracking-widest uppercase text-[var(--color-accent)] mb-4 text-center">
            What We Do
          </p>
        </ScrollReveal>
        <SplitText tag="h2" className="text-4xl md:text-5xl font-bold text-center mb-16">
          Services
        </SplitText>

        {SERVICES.map((service, i) => (
          <ServiceRow
            key={service.title}
            title={service.title}
            description={service.description}
            ThreeScene={service.Scene}
            reverse={i % 2 !== 0}
            index={i}
          />
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/ServiceRow.jsx src/components/sections/Services.jsx
git commit -m "feat: add Services section with alternating 3D rows"
```

---

## Task 10: Stats Section

**Files:**
- Create: `src/components/ui/StatCard.jsx`
- Create: `src/components/sections/Stats.jsx`

- [ ] **Step 1: Create StatCard**

```jsx
// src/components/ui/StatCard.jsx
import { Counter } from "@/components/ui/Counter"
import { GlassCard } from "@/components/ui/GlassCard"

export function StatCard({ target, suffix = "", prefix = "", label, className }) {
  return (
    <GlassCard className={`p-6 text-center ${className || ""}`}>
      <div className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-2">
        <Counter target={target} prefix={prefix} suffix={suffix} />
      </div>
      <p className="text-sm text-[var(--color-text-secondary)] uppercase tracking-wider">
        {label}
      </p>
    </GlassCard>
  )
}
```

- [ ] **Step 2: Create Stats section**

```jsx
// src/components/sections/Stats.jsx
import { Suspense, lazy } from "react"
import { useInView } from "@/hooks/useInView"
import { StatCard } from "@/components/ui/StatCard"
import { ScrollReveal } from "@/components/ui/ScrollReveal"

const SharedCanvas = lazy(() =>
  import("@/components/three/SharedCanvas").then((m) => ({ default: m.SharedCanvas }))
)
const Globe = lazy(() =>
  import("@/components/three/Globe").then((m) => ({ default: m.Globe }))
)

const STATS = [
  { target: 50, suffix: "+", label: "Projects Completed" },
  { target: 15, suffix: "+", label: "Servers Built" },
  { target: 25, suffix: "+", label: "Scripts Deployed" },
  { target: 100, suffix: "K+", label: "Lines of Code" },
]

export function Stats() {
  const [ref, inView] = useInView({ threshold: 0.1 })

  return (
    <section id="stats" className="section relative py-24 md:py-32 overflow-hidden" ref={ref}>
      {/* 3D Globe background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        {inView && (
          <Suspense fallback={null}>
            <SharedCanvas camera={{ position: [0, 0, 4.5] }}>
              <Globe />
            </SharedCanvas>
          </Suspense>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <ScrollReveal>
          <p className="text-sm font-medium tracking-widest uppercase text-[var(--color-accent)] mb-4 text-center">
            By the Numbers
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-[var(--color-text-primary)]">
            Proven Track Record
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 0.1}>
              <StatCard {...stat} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/StatCard.jsx src/components/sections/Stats.jsx
git commit -m "feat: add Stats section with counter cards and 3D globe"
```

---

## Task 11: Testimonials Section

**Files:**
- Create: `src/components/ui/TestimonialCard.jsx`
- Create: `src/components/sections/Testimonials.jsx`

- [ ] **Step 1: Create TestimonialCard**

```jsx
// src/components/ui/TestimonialCard.jsx
import { GlassCard } from "@/components/ui/GlassCard"

export function TestimonialCard({ quote, name, server }) {
  return (
    <GlassCard className="p-8">
      <p className="text-[var(--color-text-secondary)] leading-relaxed mb-6 italic">
        &ldquo;{quote}&rdquo;
      </p>
      <div>
        <p className="text-sm font-medium text-[var(--color-text-primary)]">{name}</p>
        <p className="text-xs text-[var(--color-accent)]">{server}</p>
      </div>
    </GlassCard>
  )
}
```

- [ ] **Step 2: Create Testimonials section**

```jsx
// src/components/sections/Testimonials.jsx
import { TestimonialCard } from "@/components/ui/TestimonialCard"
import { Spotlight } from "@/components/ui/spotlight"
import { ScrollReveal } from "@/components/ui/ScrollReveal"
import { SplitText } from "@/components/ui/SplitText"

const TESTIMONIALS = [
  {
    quote: "927 completely rebuilt our server from scratch. The scripts are clean, performant, and our players noticed the difference immediately. Best investment we made.",
    name: "Server Owner",
    server: "Boot Town RP",
  },
  {
    quote: "The custom scripts are on another level. Every feature works exactly how we spec'd it, and the NUI design is next-gen. Our server stands out because of 927.",
    name: "Server Owner",
    server: "4DaRaw RP",
  },
  {
    quote: "Fast turnaround, solid communication, and the code is actually clean. No spaghetti, no bugs. 927 is the real deal for FiveM development.",
    name: "Server Owner",
    server: "SAWL RP",
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="section relative py-24 md:py-32 overflow-hidden">
      <Spotlight className="-top-20 right-0 md:right-40" size={500} />

      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <p className="text-sm font-medium tracking-widest uppercase text-[var(--color-accent)] mb-4 text-center">
            What They Say
          </p>
        </ScrollReveal>
        <SplitText tag="h2" className="text-4xl md:text-5xl font-bold text-center mb-16">
          Client Testimonials
        </SplitText>

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <ScrollReveal key={i} delay={i * 0.15}>
              <TestimonialCard {...t} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/TestimonialCard.jsx src/components/sections/Testimonials.jsx
git commit -m "feat: add Testimonials section with glass cards and Spotlight"
```

---

## Task 12: About Section

**Files:**
- Create: `src/components/sections/About.jsx`

- [ ] **Step 1: Create About section**

```jsx
// src/components/sections/About.jsx
import { Suspense, lazy } from "react"
import { useInView } from "@/hooks/useInView"
import { ScrollReveal } from "@/components/ui/ScrollReveal"
import { SplitText } from "@/components/ui/SplitText"

const SharedCanvas = lazy(() =>
  import("@/components/three/SharedCanvas").then((m) => ({ default: m.SharedCanvas }))
)
const Logo927 = lazy(() =>
  import("@/components/three/Logo927").then((m) => ({ default: m.Logo927 }))
)

export function About() {
  const [ref, inView] = useInView({ threshold: 0.2 })

  return (
    <section id="about" className="section relative py-24 md:py-32" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12 md:gap-20">
        {/* Content */}
        <div className="flex-1">
          <ScrollReveal direction="left">
            <p className="text-sm font-medium tracking-widest uppercase text-[var(--color-accent)] mb-4">
              Who We Are
            </p>
          </ScrollReveal>

          <SplitText tag="h2" className="text-4xl md:text-5xl font-bold mb-6">
            Built by Devs Who Run Servers
          </SplitText>

          <ScrollReveal delay={0.2}>
            <p className="text-[var(--color-text-secondary)] leading-relaxed mb-6">
              927 Development isn&apos;t just a dev shop — we run our own production servers.
              Every script we build gets battle-tested on live servers with real players
              before it ever touches your codebase. We don&apos;t ship code we wouldn&apos;t run ourselves.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <p className="text-[var(--color-text-secondary)] leading-relaxed mb-8">
              From custom scripts to full server builds, we bring the perspective of
              server owners who understand what players actually need — not just what
              looks good in a demo.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <a
              href="https://discord.gg/hRZeHwWyHG"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[var(--color-accent)] hover:text-[var(--color-text-primary)] transition-colors font-medium"
            >
              Join the Community &rarr;
            </a>
          </ScrollReveal>
        </div>

        {/* 3D Logo */}
        <div className="flex-1 h-[400px] md:h-[500px]">
          {inView && (
            <Suspense
              fallback={
                <div className="w-full h-full rounded-lg bg-[rgba(20,20,20,0.5)] animate-pulse" />
              }
            >
              <SharedCanvas>
                <Logo927 />
              </SharedCanvas>
            </Suspense>
          )}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/About.jsx
git commit -m "feat: add About section with interactive 3D 927 logo"
```

---

## Task 13: CTA Footer Section

**Files:**
- Create: `src/components/sections/CTAFooter.jsx`

- [ ] **Step 1: Create CTAFooter section**

```jsx
// src/components/sections/CTAFooter.jsx
import { Suspense, lazy } from "react"
import { useInView } from "@/hooks/useInView"
import { Spotlight } from "@/components/ui/spotlight"
import { ScrollReveal } from "@/components/ui/ScrollReveal"
import { SplitText } from "@/components/ui/SplitText"

const SharedCanvas = lazy(() =>
  import("@/components/three/SharedCanvas").then((m) => ({ default: m.SharedCanvas }))
)
const ParticleField = lazy(() =>
  import("@/components/three/ParticleField").then((m) => ({ default: m.ParticleField }))
)

export function CTAFooter() {
  const [ref, inView] = useInView({ threshold: 0.1 })

  return (
    <section className="relative py-24 md:py-32 overflow-hidden" ref={ref}>
      {/* Particle field background */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        {inView && (
          <Suspense fallback={null}>
            <SharedCanvas camera={{ position: [0, 0, 6] }}>
              <ParticleField />
            </SharedCanvas>
          </Suspense>
        )}
      </div>

      <Spotlight className="top-0 left-1/2 -translate-x-1/2" size={600} />

      <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
        <ScrollReveal>
          <SplitText tag="h2" className="text-4xl md:text-6xl font-bold mb-6">
            Ready to Level Up Your Server?
          </SplitText>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <p className="text-lg text-[var(--color-text-secondary)] mb-10 max-w-xl mx-auto">
            Whether you need a full server build, custom scripts, or ongoing management
            — let&apos;s build something your players won&apos;t forget.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://discord.gg/hRZeHwWyHG"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-lg bg-[var(--color-accent)] text-white font-medium text-lg hover:shadow-[0_0_40px_rgba(147,51,234,0.5)] transition-all"
            >
              Get a Quote
            </a>
            <a
              href="https://927-development.tebex.io"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-lg border border-[rgba(147,51,234,0.3)] text-[var(--color-text-primary)] font-medium text-lg hover:border-[var(--color-accent)] hover:shadow-[0_0_20px_rgba(147,51,234,0.2)] transition-all"
            >
              Browse Scripts
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/CTAFooter.jsx
git commit -m "feat: add CTA Footer section with particle field background"
```

---

## Task 14: Wire Up App.jsx — Full Page Assembly

**Files:**
- Modify: `src/App.jsx`

Replace old section imports with new structure.

- [ ] **Step 1: Rewrite App.jsx**

```jsx
// src/App.jsx
import { useEffect, useRef } from "react"
import { useLenis } from "@/hooks/useLenis"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Hero } from "@/components/sections/Hero"
import { Services } from "@/components/sections/Services"
import { Stats } from "@/components/sections/Stats"
import { Testimonials } from "@/components/sections/Testimonials"
import { About } from "@/components/sections/About"
import { CTAFooter } from "@/components/sections/CTAFooter"
import cursorImg from "@/assets/927-cursor-lg.png"

export default function App() {
  useLenis()
  const cursorRef = useRef(null)

  useEffect(() => {
    const el = cursorRef.current
    if (!el) return
    const onMove = (e) => {
      el.style.transform = `translate(${e.clientX - 64}px, ${e.clientY - 64}px)`
    }
    window.addEventListener("mousemove", onMove, { passive: true })
    return () => window.removeEventListener("mousemove", onMove)
  }, [])

  return (
    <>
      <img
        ref={cursorRef}
        id="custom-cursor"
        src={cursorImg}
        alt=""
        aria-hidden="true"
        draggable={false}
      />
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Stats />
        <Testimonials />
        <About />
        <CTAFooter />
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Verify full page loads in browser**

Run: `npm run dev` — open `http://localhost:5173/927-dev-services/`
Expected: All 6 sections render, scroll works, 3D scenes load on scroll, Spline robot in hero, no console errors.

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat: wire up new App with all redesigned sections"
```

---

## Task 15: CSS Updates — New Keyframes and Utilities

**Files:**
- Modify: `src/index.css`

Add any missing animation keyframes and utilities needed by the new sections.

- [ ] **Step 1: Add spotlight animation keyframe to index.css**

Append after existing keyframes in `index.css`:

```css
/* Spotlight entrance animation */
@keyframes spotlight-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Skeleton shimmer for 3D loading placeholders */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.animate-shimmer {
  background: linear-gradient(90deg, rgba(20,20,20,0.5) 25%, rgba(40,40,40,0.5) 50%, rgba(20,20,20,0.5) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/index.css
git commit -m "feat: add shimmer and spotlight keyframe animations"
```

---

## Task 16: Cleanup Old Components

**Files:**
- Delete: `src/components/Hero.jsx`
- Delete: `src/components/Problem.jsx`
- Delete: `src/components/Services.jsx`
- Delete: `src/components/ServiceCard.jsx`
- Delete: `src/components/Pricing.jsx`
- Delete: `src/components/SocialProof.jsx`
- Delete: `src/components/ScriptShowcase.jsx`
- Delete: `src/components/Contact.jsx`
- Delete: `src/components/Navbar.jsx`
- Delete: `src/components/ui/Scene3D.jsx`
- Delete: `src/components/ui/spline-demo.jsx`

- [ ] **Step 1: Remove old component files**

```bash
cd C:/Users/keyno/Desktop/927-dev-services
rm src/components/Hero.jsx src/components/Problem.jsx src/components/Services.jsx src/components/ServiceCard.jsx src/components/Pricing.jsx src/components/SocialProof.jsx src/components/ScriptShowcase.jsx src/components/Contact.jsx src/components/Navbar.jsx src/components/ui/Scene3D.jsx src/components/ui/spline-demo.jsx
```

- [ ] **Step 2: Verify site still runs clean**

Run: `npm run dev`
Expected: No missing import errors. All new sections render correctly.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove old section components replaced by redesign"
```

---

## Task 17: Visual QA and Polish

**Files:**
- Possibly modify: any section or component that needs tweaking

This is a visual review pass — check every section in the browser and fix issues.

- [ ] **Step 1: Review each section in browser**

Open `http://localhost:5173/927-dev-services/` and check:
- [ ] Hero: Spline loads, Spotlight follows mouse, CTAs styled correctly, responsive
- [ ] Services: All 5 rows render, alternating layout works, 3D scenes load on scroll
- [ ] Stats: Counter animates on scroll entry, Globe visible in background
- [ ] Testimonials: Cards stagger in, Spotlight works, glass panel style consistent
- [ ] About: Content left, 3D logo right, particles animate
- [ ] CTA Footer: Big headline, buttons styled, particle field background
- [ ] Footer: Links, socials, copyright
- [ ] Navbar: Transparent → glass on scroll, mobile hamburger works
- [ ] Custom cursor: Visible and following mouse on all sections
- [ ] Scroll: Smooth via Lenis, no jank

- [ ] **Step 2: Fix any issues found**

Address each issue directly in the relevant component file.

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "polish: visual QA fixes across all sections"
```

---

## Task 18: Build Verification

- [ ] **Step 1: Run production build**

```bash
cd C:/Users/keyno/Desktop/927-dev-services && npm run build
```

Expected: Build succeeds with no errors. Check for any warnings about bundle size.

- [ ] **Step 2: Preview production build**

```bash
npm run preview
```

Open in browser — verify everything works in production mode (lazy loading, 3D scenes, scroll animations).

- [ ] **Step 3: Final commit if any build fixes needed**

```bash
git add -A
git commit -m "fix: production build fixes"
```
