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
