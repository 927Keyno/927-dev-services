import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
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
      <meshStandardMaterial color="#9333ea" transparent opacity={0.3} wireframe />
    </mesh>
  )
}

export function CityGrid() {
  const groupRef = useRef()

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
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, state.pointer.x * 0.15, 0.05)
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, state.pointer.y * 0.08 - 0.3, 0.05)
      state.invalidate()
    }
  })

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      <gridHelper args={[10, 20, "#9333ea", "#1f1f1f"]} />
      {buildings.map((b, i) => <Building key={i} {...b} />)}
      <ambientLight intensity={0.3} />
      <pointLight position={[3, 5, 3]} color="#9333ea" intensity={1.5} />
    </group>
  )
}
