import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Text } from "@react-three/drei"
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
      pts.push([(Math.random() - 0.5) * 5, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 2])
    }
    return pts
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, state.pointer.x * 0.2, 0.04)
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, state.pointer.y * 0.1, 0.04)
      state.invalidate()
    }
  })

  return (
    <group ref={groupRef}>
      <Text
        fontSize={2.5}
        color="#9333ea"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.08}
        outlineColor="#7c3aed"
      >
        927
      </Text>
      {particles.map((pos, i) => <FloatingParticle key={i} position={pos} />)}
      <ambientLight intensity={0.2} />
      <pointLight position={[3, 3, 5]} color="#9333ea" intensity={2} />
      <pointLight position={[-3, -2, 3]} color="#7c3aed" intensity={0.8} />
    </group>
  )
}
