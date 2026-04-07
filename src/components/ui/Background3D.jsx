import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Text, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { useRef, useMemo, useEffect, useState } from 'react'
import * as THREE from 'three'

// ─── GLSL Simplex Noise (Ashima) ─────────────────────────────────────────────

const SIMPLEX_NOISE_GLSL = /* glsl */`
vec3 mod289_3(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289_4(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute4(vec4 x) { return mod289_4(((x*34.0)+10.0)*x); }
vec4 taylorInvSqrt4(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289_3(i);
  vec4 p = permute4(permute4(permute4(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt4(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`

// ─── Vertex Shader (displacement) ────────────────────────────────────────────

const vertexShader = /* glsl */`
${SIMPLEX_NOISE_GLSL}

uniform float uTime;
uniform float uDisplacementStrength;
uniform float uSpeed;
uniform float uFrequency;

varying vec3 vNormal;
varying vec3 vWorldPos;
varying float vDisplacement;

void main() {
  vec3 pos = position;

  // 3 octaves of noise for organic complexity
  float n1 = snoise(pos * uFrequency + uTime * uSpeed);
  float n2 = snoise(pos * uFrequency * 2.1 + uTime * uSpeed * 1.3 + 3.7);
  float n3 = snoise(pos * uFrequency * 4.3 + uTime * uSpeed * 0.7 + 7.1);

  float displacement = (n1 * 0.55 + n2 * 0.30 + n3 * 0.15) * uDisplacementStrength;
  vDisplacement = displacement;

  vec3 displaced = pos + normal * displacement;

  vNormal = normalize(normalMatrix * normal);
  vWorldPos = (modelMatrix * vec4(displaced, 1.0)).xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}
`

// ─── Fragment Shader (iridescent PBR-like) ───────────────────────────────────

const fragmentShader = /* glsl */`
uniform float uTime;
uniform vec3 uLightPos1;
uniform vec3 uLightColor1;
uniform vec3 uLightPos2;
uniform vec3 uLightColor2;

varying vec3 vNormal;
varying vec3 vWorldPos;
varying float vDisplacement;

// Fresnel
float fresnel(vec3 viewDir, vec3 normal, float power) {
  return pow(1.0 - clamp(dot(viewDir, normal), 0.0, 1.0), power);
}

// Iridescence — oil-slick rainbow hues based on angle
vec3 iridescence(float angle, float shift) {
  float t = angle + shift;
  vec3 col;
  col.r = 0.5 + 0.5 * sin(t * 6.28 + 0.0);
  col.g = 0.5 + 0.5 * sin(t * 6.28 + 2.09);
  col.b = 0.5 + 0.5 * sin(t * 6.28 + 4.19);
  return col;
}

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(cameraPosition - vWorldPos);

  // Fresnel factor
  float fr = fresnel(V, N, 3.0);

  // Iridescent hue — shifts with view angle and displacement
  float iriAngle = dot(V, N) + vDisplacement * 0.4 + uTime * 0.05;
  vec3 iriColor = iridescence(iriAngle, 0.0);

  // Simple PBR-like lighting with 2 point lights
  vec3 L1 = normalize(uLightPos1 - vWorldPos);
  vec3 L2 = normalize(uLightPos2 - vWorldPos);

  float diff1 = max(dot(N, L1), 0.0);
  float diff2 = max(dot(N, L2), 0.0);

  // Specular (Blinn-Phong)
  vec3 H1 = normalize(V + L1);
  vec3 H2 = normalize(V + L2);
  float spec1 = pow(max(dot(N, H1), 0.0), 96.0);
  float spec2 = pow(max(dot(N, H2), 0.0), 64.0);

  // Dark metallic base
  vec3 baseColor = vec3(0.04, 0.04, 0.05);

  // Emissive cyan glow
  vec3 emissive = vec3(0.0, 0.898, 1.0) * 0.08;

  // Combine
  vec3 diffuse = baseColor * (diff1 * uLightColor1 * 0.7 + diff2 * uLightColor2 * 0.4);
  vec3 specular = spec1 * uLightColor1 * 0.9 + spec2 * uLightColor2 * 0.5;

  // Iridescence applied at glancing angles
  vec3 iriContrib = iriColor * fr * 0.65;

  vec3 finalColor = diffuse + specular + iriContrib + emissive;

  // Rim glow
  finalColor += vec3(0.0, 0.898, 1.0) * fr * 0.12;

  gl_FragColor = vec4(finalColor, 0.9);
}
`

// ─── Mouse Parallax Camera ────────────────────────────────────────────────────

function MouseParallax() {
  const { camera } = useThree()
  const mouse = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame(() => {
    target.current.x += (mouse.current.x - target.current.x) * 0.03
    target.current.y += (mouse.current.y - target.current.y) * 0.03
    camera.position.x = target.current.x * 1.0
    camera.position.y = 0.5 + target.current.y * -0.5
    camera.lookAt(0, 0, 0)
  })

  return null
}

// ─── Morphing Sphere ─────────────────────────────────────────────────────────

function MorphingSphere() {
  const meshRef = useRef()

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uDisplacementStrength: { value: 0.5 },
    uSpeed: { value: 0.6 },
    uFrequency: { value: 1.5 },
    uLightPos1: { value: new THREE.Vector3(3, 3, 5) },
    uLightColor1: { value: new THREE.Color('#00e5ff') },
    uLightPos2: { value: new THREE.Vector3(-3, -2, -3) },
    uLightColor2: { value: new THREE.Color('#4ade80') },
  }), [])

  const geo = useMemo(() => new THREE.IcosahedronGeometry(2.5, 128), [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    uniforms.uTime.value = t

    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002
      const breathe = 1 + Math.sin(t * 0.5) * 0.03
      meshRef.current.scale.setScalar(breathe)
    }
  })

  return (
    <mesh ref={meshRef} geometry={geo} position={[0, 0.3, 0]}>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.FrontSide}
      />
    </mesh>
  )
}

// ─── Wireframe Cage ───────────────────────────────────────────────────────────

function WireframeCage() {
  const ref = useRef()
  const geo = useMemo(() => new THREE.IcosahedronGeometry(3.0, 1), [])

  useFrame(() => {
    if (ref.current) ref.current.rotation.y -= 0.001
  })

  return (
    <mesh ref={ref} geometry={geo} position={[0, 0.3, 0]}>
      <meshBasicMaterial color="#00e5ff" wireframe transparent opacity={0.06} depthWrite={false} />
    </mesh>
  )
}

// ─── Particle Ring ────────────────────────────────────────────────────────────

function ParticleRing() {
  const ref = useRef()
  const count = 2500

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    const R = 5    // torus major radius
    const r = 1.5  // torus minor radius

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI * 2
      const jitter = (Math.random() - 0.5) * 0.4

      arr[i * 3]     = (R + (r + jitter) * Math.cos(phi)) * Math.cos(theta)
      arr[i * 3 + 1] = (r + jitter) * Math.sin(phi) * 0.4  // flatten vertically
      arr[i * 3 + 2] = (R + (r + jitter) * Math.cos(phi)) * Math.sin(theta)
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.08
    }
  })

  return (
    <points ref={ref} position={[0, 0.3, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#00e5ff"
        size={0.02}
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

// ─── Floating Game Text ───────────────────────────────────────────────────────

const GAME_TEXTS = [
  { text: 'FiveM',              position: [-8,  4,   -9],  color: '#00e5ff', size: 0.60, speed: 0.30 },
  { text: 'ESX',                position: [ 7,  1,   -7],  color: '#4ade80', size: 0.50, speed: 0.40 },
  { text: 'QBCore',             position: [-5, -1,  -11],  color: '#ffffff', size: 0.45, speed: 0.35 },
  { text: 'Lua',                position: [ 9,  3,   -8],  color: '#00e5ff', size: 0.55, speed: 0.25 },
  { text: 'NUI',                position: [-6, -3,   -8],  color: '#4ade80', size: 0.50, speed: 0.38 },
  { text: 'TriggerServerEvent', position: [-9,  5,  -13],  color: '#4ade80', size: 0.28, speed: 0.20 },
  { text: 'RegisterNetEvent',   position: [ 6, -2,  -12],  color: '#ffffff', size: 0.26, speed: 0.30 },
  { text: "exports['927']",     position: [-4,  6,  -10],  color: '#00e5ff', size: 0.30, speed: 0.22 },
  { text: 'ox_inventory',       position: [10,  0,  -14],  color: '#ffffff', size: 0.28, speed: 0.28 },
  { text: 'server.lua',         position: [-10, 2,  -15],  color: '#4ade80', size: 0.24, speed: 0.32 },
  { text: 'client.lua',         position: [ 3,  5,  -16],  color: '#00e5ff', size: 0.24, speed: 0.18 },
  { text: 'MySQL.Async',        position: [ 8,  4,  -11],  color: '#ffffff', size: 0.26, speed: 0.26 },
  // City / server names
  { text: 'fxmanifest',          position: [-7, -4,  -10],  color: '#00e5ff', size: 0.32, speed: 0.28 },
  { text: 'bridge.lua',         position: [ 11, 2,   -9],  color: '#4ade80', size: 0.30, speed: 0.22 },
  { text: 'pcall()',            position: [-11, 3,  -12],  color: '#ffffff', size: 0.34, speed: 0.24 },
  { text: 'SetNuiFocus',        position: [  5, -5,  -11], color: '#00e5ff', size: 0.28, speed: 0.31 },
  { text: 'QBox',               position: [ -3,  7,  -14], color: '#4ade80', size: 0.45, speed: 0.19 },
  { text: 'ox_lib',             position: [  8,  6,  -13], color: '#ffffff', size: 0.35, speed: 0.27 },
]

function FloatingGameText({ config, index }) {
  const ref = useRef()
  const originY = config.position[1]

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + index * 2.1
    ref.current.position.y = originY + Math.sin(t * config.speed) * 0.5
    ref.current.rotation.y = Math.sin(t * 0.15 + index) * 0.2
    ref.current.rotation.x = Math.sin(t * 0.10 + index * 0.5) * 0.05
  })

  return (
    <group ref={ref} position={config.position}>
      <Text
        fontSize={config.size}
        color={config.color}
        anchorX="center"
        anchorY="middle"
        fillOpacity={0.12}
        font={undefined}
      >
        {config.text}
        <meshBasicMaterial
          color={config.color}
          transparent
          opacity={0.12}
          depthWrite={false}
        />
      </Text>
    </group>
  )
}

function FloatingGameTexts() {
  return (
    <>
      {GAME_TEXTS.map((cfg, i) => (
        <FloatingGameText key={i} config={cfg} index={i} />
      ))}
    </>
  )
}

// ─── Post Effects ─────────────────────────────────────────────────────────────

function PostEffects() {
  return (
    <EffectComposer>
      <Bloom
        luminanceThreshold={0.15}
        luminanceSmoothing={0.9}
        intensity={1.5}
        mipmapBlur
      />
      <ChromaticAberration
        offset={[0.002, 0.002]}
        blendFunction={BlendFunction.NORMAL}
      />
      <Vignette
        darkness={0.7}
        offset={0.3}
      />
    </EffectComposer>
  )
}

// ─── Scene ────────────────────────────────────────────────────────────────────

function Scene() {
  return (
    <>
      <fog attach="fog" args={['#0a0a0a', 10, 45]} />

      {/* Very dim ambient */}
      <ambientLight intensity={0.05} />

      {/* Key light — cyan */}
      <pointLight position={[3, 3, 5]} intensity={1.0} color="#00e5ff" />

      {/* Fill — green */}
      <pointLight position={[-3, -2, -3]} intensity={0.4} color="#4ade80" />

      {/* Top rim */}
      <pointLight position={[0, 5, -5]} intensity={0.15} color="#ffffff" />

      {/* Subtle environment reflections for iridescence */}
      <Environment preset="night" />

      {/* The star: morphing sphere */}
      <MorphingSphere />

      {/* Wireframe cage */}
      <WireframeCage />

      {/* Particle ring */}
      <ParticleRing />

      {/* Floating code text */}
      <FloatingGameTexts />

      {/* Mouse camera parallax */}
      <MouseParallax />
    </>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function Background3D() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0.5, 7], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      >
        <Scene />
        <PostEffects />
      </Canvas>
    </div>
  )
}
