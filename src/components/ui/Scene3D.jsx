// src/components/ui/Scene3D.jsx
import React, { useRef, useMemo, useEffect, Suspense, useCallback } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Text3D, Center, Environment, Preload } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import * as THREE from "three"
import gsap from "gsap"

// ─── Shared mouse position ref (normalized -1..1) ────────────────────────────
// Passed down from SceneContents via props to avoid context overhead.

// ─── Floating particles around the logo ──────────────────────────────────────

function ParticleField({ count = 500, mouseRef }) {
  const meshRef = useRef()

  // Store original positions separately so we can offset toward mouse
  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3) // small random drift velocities
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      // Mix of close-range and far-range particles for depth
      const r = 1.5 + Math.random() * 5.5
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
      // Tiny random drift
      vel[i * 3]     = (Math.random() - 0.5) * 0.002
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.002
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.001
    }
    return { positions: pos, velocities: vel }
  }, [count])

  // Working copy of positions that we mutate each frame
  const currentPositions = useMemo(() => new Float32Array(positions), [positions])

  useFrame((state) => {
    if (!meshRef.current) return

    const mouse = mouseRef?.current ?? { x: 0, y: 0 }
    const t = state.clock.elapsedTime

    // Slow drift rotation of the whole field
    meshRef.current.rotation.y = t * 0.04
    meshRef.current.rotation.x = Math.sin(t * 0.025) * 0.08

    // Per-particle mouse drift — subtle pull toward cursor
    const geo = meshRef.current.geometry
    const attr = geo.attributes.position
    for (let i = 0; i < count; i++) {
      const ox = positions[i * 3]
      const oy = positions[i * 3 + 1]
      const oz = positions[i * 3 + 2]

      // Drift particle slightly toward mouse (max ±0.4 units)
      const tx = ox + mouse.x * 0.4
      const ty = oy + mouse.y * 0.4

      currentPositions[i * 3]     += (tx - currentPositions[i * 3])     * 0.02 + velocities[i * 3]
      currentPositions[i * 3 + 1] += (ty - currentPositions[i * 3 + 1]) * 0.02 + velocities[i * 3 + 1]
      currentPositions[i * 3 + 2] += (oz - currentPositions[i * 3 + 2]) * 0.01 + velocities[i * 3 + 2]

      attr.array[i * 3]     = currentPositions[i * 3]
      attr.array[i * 3 + 1] = currentPositions[i * 3 + 1]
      attr.array[i * 3 + 2] = currentPositions[i * 3 + 2]
    }
    attr.needsUpdate = true
    state.invalidate()
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={currentPositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#9333ea"
        transparent
        opacity={0.75}
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
  const scaleRef = useRef(0.01) // starts tiny for entrance animation
  const entranceDoneRef = useRef(false)

  // GSAP entrance animation on mount
  useEffect(() => {
    if (!groupRef.current) return
    // Set initial scale to near-zero
    groupRef.current.scale.setScalar(0.01)

    gsap.to(scaleRef, {
      current: 1,
      duration: 1.4,
      ease: "back.out(1.4)",
      delay: 0.3,
      onComplete: () => {
        entranceDoneRef.current = true
      },
    })
  }, [])

  useFrame((state) => {
    if (!groupRef.current) return

    // Idle rotation + scroll offset
    groupRef.current.rotation.y =
      state.clock.elapsedTime * 0.15 + scrollProgress * Math.PI * 0.5

    // During entrance, let GSAP drive scale; after, apply scroll shrink
    const baseScale = entranceDoneRef.current
      ? 1 - scrollProgress * 0.45
      : scaleRef.current
    groupRef.current.scale.setScalar(Math.max(0.01, baseScale))
    groupRef.current.position.y = scrollProgress * 2.5

    state.invalidate()
  })

  return (
    <group ref={groupRef}>
      <Center>
        <Text3D
          font="/fonts/helvetiker_bold.typeface.json"
          size={1.2}
          height={0.35}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.03}
          bevelSize={0.02}
          bevelSegments={6}
        >
          927
          <meshPhysicalMaterial
            color="#d4af37"
            metalness={0.95}
            roughness={0.05}
            clearcoat={1}
            clearcoatRoughness={0.1}
            reflectivity={1}
            envMapIntensity={2.0}
          />
        </Text3D>
      </Center>
    </group>
  )
}

// ─── Dynamic point light that shifts with scroll ──────────────────────────────

function DynamicLights({ scrollProgress }) {
  const scrollLightRef = useRef()
  const ambientRef = useRef()

  useFrame((state) => {
    if (!scrollLightRef.current) return
    const t = state.clock.elapsedTime

    // Light orbits and shifts position with scroll
    scrollLightRef.current.position.x = Math.sin(t * 0.5) * 4
    scrollLightRef.current.position.y = 2 + scrollProgress * 4
    scrollLightRef.current.position.z = Math.cos(t * 0.3) * 3 + 2

    // Color transitions between purple and blue as scroll progresses
    const purple = new THREE.Color("#9333ea")
    const blue   = new THREE.Color("#3b82f6")
    scrollLightRef.current.color.lerpColors(purple, blue, scrollProgress)

    state.invalidate()
  })

  return (
    <>
      {/* Base ambient — subtle purple */}
      <ambientLight ref={ambientRef} color="#7c3aed" intensity={0.5} />

      {/* Static fill lights */}
      <directionalLight position={[5, 5, 5]}   intensity={1.4} color="#ffffff" />
      <directionalLight position={[-5, -2, -5]} intensity={0.5} color="#9333ea" />

      {/* Front glow */}
      <pointLight position={[0, 0, 3]} color="#9333ea" intensity={2.5} distance={10} />

      {/* Scroll-driven moving light */}
      <pointLight ref={scrollLightRef} position={[4, 2, 2]} color="#9333ea" intensity={3} distance={12} />

      {/* Rim light — opposite side */}
      <pointLight position={[-3, 1, -2]} color="#3b82f6" intensity={1.5} distance={8} />
    </>
  )
}

// ─── Camera parallax sway ─────────────────────────────────────────────────────

function CameraRig({ mouseRef }) {
  const { camera } = useThree()
  const targetPos = useRef({ x: 0, y: 0 })

  useFrame(() => {
    const mouse = mouseRef?.current ?? { x: 0, y: 0 }

    // Lerp target toward mouse offset (max ±0.6 units)
    targetPos.current.x += (mouse.x * 0.6 - targetPos.current.x) * 0.05
    targetPos.current.y += (mouse.y * 0.3 - targetPos.current.y) * 0.05

    camera.position.x += (targetPos.current.x - camera.position.x) * 0.08
    camera.position.y += (targetPos.current.y - camera.position.y) * 0.08
    camera.lookAt(0, 0, 0)
  })

  return null
}

// ─── Scene internals ──────────────────────────────────────────────────────────

function SceneContents({ scrollProgress, mouseRef }) {
  const { invalidate } = useThree()

  useEffect(() => {
    invalidate()
  }, [scrollProgress, invalidate])

  return (
    <>
      <DynamicLights scrollProgress={scrollProgress} />
      <Environment preset="night" />
      <Logo927 scrollProgress={scrollProgress} />
      <ParticleField count={500} mouseRef={mouseRef} />
      <CameraRig mouseRef={mouseRef} />

      <EffectComposer>
        <Bloom
          intensity={1.1}
          luminanceThreshold={0.25}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </>
  )
}

// ─── Error boundary so a Three.js crash never blanks the whole page ──────────

class Scene3DErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
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
  // Mouse position normalized to -1..1, shared across all Three.js internals
  const mouseRef = useRef({ x: 0, y: 0 })

  const handlePointerMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseRef.current = {
      x:  ((e.clientX - rect.left)  / rect.width)  * 2 - 1,
      y: -((e.clientY - rect.top)   / rect.height) * 2 + 1,
    }
  }, [])

  return (
    <Scene3DErrorBoundary>
      <div
        className={className}
        style={{ width: "100%", height: "100%" }}
        onPointerMove={handlePointerMove}
      >
        <Canvas
          frameloop="demand"
          camera={{ position: [0, 0, 6], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <Suspense fallback={null}>
            <SceneContents scrollProgress={scrollProgress} mouseRef={mouseRef} />
            <Preload all />
          </Suspense>
        </Canvas>
      </div>
    </Scene3DErrorBoundary>
  )
}
