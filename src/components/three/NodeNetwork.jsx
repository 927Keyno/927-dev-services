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
      <meshStandardMaterial color="#9333ea" emissive="#9333ea" emissiveIntensity={0.3} />
    </mesh>
  )
}

function Connection({ start, end }) {
  const positions = useMemo(() => new Float32Array([...start, ...end]), [start, end])

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={2} array={positions} itemSize={3} />
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
      n.push([(Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 2])
    }
    const c = []
    for (let i = 0; i < n.length; i++) {
      for (let j = i + 1; j < n.length; j++) {
        const dist = Math.sqrt(Math.pow(n[i][0]-n[j][0],2) + Math.pow(n[i][1]-n[j][1],2) + Math.pow(n[i][2]-n[j][2],2))
        if (dist < 2.5) c.push({ start: n[i], end: n[j] })
      }
    }
    return { nodes: n, connections: c }
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, state.pointer.x * 0.1, 0.03)
      state.invalidate()
    }
  })

  return (
    <group ref={groupRef}>
      {nodes.map((pos, i) => <Node key={i} position={pos} />)}
      {connections.map((c, i) => <Connection key={i} start={c.start} end={c.end} />)}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 4]} color="#9333ea" intensity={1} />
    </group>
  )
}
