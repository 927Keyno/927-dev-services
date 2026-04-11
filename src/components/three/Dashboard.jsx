import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Line } from "@react-three/drei"
import * as THREE from "three"

function HeartbeatLine({ offset = 0 }) {
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

  return <Line points={basePoints} color="#9333ea" lineWidth={2} transparent opacity={0.7} />
}

export function Dashboard() {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, state.pointer.x * 0.08, 0.04)
      state.invalidate()
    }
  })

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[5, 3]} />
        <meshStandardMaterial color="#0a0a0a" transparent opacity={0.8} />
      </mesh>
      <HeartbeatLine offset={0.5} />
      <HeartbeatLine offset={0} />
      <HeartbeatLine offset={-0.5} />
      <mesh position={[0, 0, -0.11]}>
        <planeGeometry args={[5.1, 3.1]} />
        <meshBasicMaterial color="#9333ea" transparent opacity={0.1} />
      </mesh>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 3]} color="#9333ea" intensity={1} />
    </group>
  )
}
