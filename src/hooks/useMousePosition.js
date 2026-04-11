import { useState, useEffect } from "react"

export function useMousePosition() {
  const [mouse, setMouse] = useState({ x: 0, y: 0, nx: 0, ny: 0 })

  useEffect(() => {
    const onMove = (e) => {
      setMouse({
        x: e.clientX,
        y: e.clientY,
        nx: (e.clientX / window.innerWidth) * 2 - 1,
        ny: -(e.clientY / window.innerHeight) * 2 + 1,
      })
    }
    window.addEventListener("mousemove", onMove, { passive: true })
    return () => window.removeEventListener("mousemove", onMove)
  }, [])

  return mouse
}
