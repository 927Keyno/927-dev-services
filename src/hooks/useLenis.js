// src/hooks/useLenis.js
import { useEffect, useRef } from "react"
import Lenis from "lenis"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

/**
 * Initializes Lenis smooth scroll and syncs it with GSAP ScrollTrigger.
 * Returns the lenis instance so callers can access scroll position if needed.
 */
export function useLenis() {
  const lenisRef = useRef(null)

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,           // Buttery smooth — lower = smoother but slower to catch up
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    })

    lenisRef.current = lenis

    // Sync Lenis scroll events with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update)

    // Drive Lenis via GSAP ticker (ensures they share the same RAF loop)
    const ticker = gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    // Disable GSAP's built-in lag smoothing — Lenis handles this
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(ticker)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return lenisRef
}
