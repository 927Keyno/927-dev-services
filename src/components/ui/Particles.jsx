import { useEffect, useRef, useCallback } from "react"

export function Particles({
  quantity = 80,
  color = "#ffffff",
  size = 0.4,
  staticity = 50,
  ease = 50,
}) {
  const canvasRef = useRef(null)
  const mouse = useRef({ x: 0, y: 0 })
  const rafRef = useRef(null)
  const particlesRef = useRef([])

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 255, g: 255, b: 255 }
  }

  const rgb = hexToRgb(color)

  const initParticle = useCallback((canvas) => {
    const x = Math.random() * canvas.width
    const y = Math.random() * canvas.height
    const pSize = Math.random() * size * 2 + size * 0.5
    const alpha = Math.random() * 0.5 + 0.1
    return {
      x,
      y,
      originX: x,
      originY: y,
      vx: 0,
      vy: 0,
      size: pSize,
      alpha,
      targetAlpha: alpha,
    }
  }, [size])

  const drawParticle = useCallback((ctx, p) => {
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${p.alpha})`
    ctx.fill()
  }, [rgb.r, rgb.g, rgb.b])

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    particlesRef.current.forEach((p) => {
      const dx = mouse.current.x - p.x
      const dy = mouse.current.y - p.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      const force = Math.max(staticity - dist, 0) / staticity

      p.vx += (dx * force) / ease
      p.vy += (dy * force) / ease

      p.vx *= 0.9
      p.vy *= 0.9

      p.x += p.vx + (p.originX - p.x) * 0.02
      p.y += p.vy + (p.originY - p.y) * 0.02

      p.alpha += (p.targetAlpha - p.alpha) * 0.1

      drawParticle(ctx, p)
    })

    rafRef.current = requestAnimationFrame(animate)
  }, [staticity, ease, drawParticle])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      particlesRef.current = Array.from({ length: quantity }, () =>
        initParticle(canvas)
      )
    }

    resize()
    window.addEventListener("resize", resize)

    const onMouseMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener("mousemove", onMouseMove)

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", onMouseMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [quantity, initParticle, animate])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  )
}
