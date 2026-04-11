import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export function WeaponModel() {
  const groupRef = useRef()

  const { shape, extrudeSettings } = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(0, 0)
    s.lineTo(2, 0)
    s.lineTo(2.3, 0.15)
    s.lineTo(2.5, 0.15)
    s.lineTo(2.5, 0.4)
    s.lineTo(2.2, 0.4)
    s.lineTo(2, 0.3)
    s.lineTo(1.8, 0.3)
    s.lineTo(1.8, 0.5)
    s.lineTo(1.5, 0.5)
    s.lineTo(1.5, 0.3)
    s.lineTo(0.5, 0.3)
    s.lineTo(0.3, -0.5)
    s.lineTo(0.7, -0.5)
    s.lineTo(0.8, 0)
    s.lineTo(0, 0)
    return { shape: s, extrudeSettings: { depth: 0.15, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2 } }
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        state.pointer.x * 0.4 + Math.sin(state.clock.elapsedTime * 0.3) * 0.1,
        0.05
      )
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, state.pointer.y * 0.15, 0.05)
      state.invalidate()
    }
  })

  return (
    <group ref={groupRef}>
      <mesh position={[-1.2, 0, -0.075]}>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshPhysicalMaterial color="#1a1a2e" metalness={0.9} roughness={0.2} clearcoat={0.5} clearcoatRoughness={0.1} />
      </mesh>
      <ambientLight intensity={0.3} />
      <pointLight position={[2, 2, 3]} color="#9333ea" intensity={1.5} />
      <pointLight position={[-2, -1, 2]} color="#7c3aed" intensity={0.5} />
    </group>
  )
}
