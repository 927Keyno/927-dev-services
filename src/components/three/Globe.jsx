import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

function ConnectionArc({ startLat, startLng, endLat, endLng }) {
  const points = useMemo(() => {
    const toVec3 = (lat, lng, r) => {
      const phi = (90 - lat) * (Math.PI / 180)
      const theta = (lng + 180) * (Math.PI / 180)
      return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta))
    }
    const start = toVec3(startLat, startLng, 1.5)
    const end = toVec3(endLat, endLng, 1.5)
    const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(2.2)
    return new THREE.QuadraticBezierCurve3(start, mid, end).getPoints(30)
  }, [startLat, startLng, endLat, endLng])

  const positions = useMemo(() => new Float32Array(points.flatMap(p => [p.x, p.y, p.z])), [points])

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={points.length} array={positions} itemSize={3} />
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
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial color="#1f1f1f" wireframe transparent opacity={0.3} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.48, 32, 32]} />
        <meshStandardMaterial color="#0a0a0a" transparent opacity={0.6} />
      </mesh>
      {connections.map((c, i) => <ConnectionArc key={i} {...c} />)}
      <ambientLight intensity={0.2} />
      <pointLight position={[3, 3, 5]} color="#9333ea" intensity={1.5} />
    </group>
  )
}
