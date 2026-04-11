import { useRef } from "react"
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

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, state.pointer.x * 0.1, 0.05)
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, state.pointer.y * 0.05, 0.05)
      state.invalidate()
    }
  })

  return (
    <group ref={groupRef}>
      <RoundedBox args={[4, 3, 0.15]} radius={0.08} smoothness={4}>
        <meshStandardMaterial color="#0a0a0a" transparent opacity={0.9} />
      </RoundedBox>

      <mesh position={[0, 1.3, 0.08]}>
        <planeGeometry args={[3.8, 0.25]} />
        <meshStandardMaterial color="#141414" />
      </mesh>

      {[[-1.6, 1.3, 0.1], [-1.45, 1.3, 0.1], [-1.3, 1.3, 0.1]].map((pos, i) => (
        <mesh key={i} position={pos}>
          <circleGeometry args={[0.04, 16]} />
          <meshStandardMaterial color={["#ff5f57", "#febc2e", "#28c840"][i]} />
        </mesh>
      ))}

      {CODE_LINES.map((line, i) => (
        <Text
          key={i}
          position={[-1.7, 0.9 - i * 0.18, 0.08]}
          fontSize={0.09}
          color={line.includes("927") ? "#9333ea" : line.includes("function") || line.includes("end") ? "#f59e0b" : "#a0a0a0"}
          anchorX="left"
          anchorY="middle"
          maxWidth={3.5}
        >
          {line}
        </Text>
      ))}

      <pointLight position={[0, 0, 2]} color="#9333ea" intensity={0.8} distance={5} />
      <ambientLight intensity={0.2} />
    </group>
  )
}
