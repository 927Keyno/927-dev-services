// src/hooks/useScrollTrigger.js
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

/**
 * Reusable ScrollTrigger wrapper hook.
 * Scopes all GSAP animations via gsap.context() and auto-reverts on unmount.
 *
 * @param {Function} animationFactory - Receives the trigger element, build animations inside
 * @param {Array} deps - Extra deps that should re-run the effect (defaults to [])
 *
 * @returns {React.RefObject} ref — attach to the trigger element
 *
 * Usage:
 *   const ref = useScrollTrigger((el) => {
 *     gsap.from(el.querySelectorAll(".word"), {
 *       y: 40, opacity: 0, stagger: 0.05,
 *       scrollTrigger: { trigger: el, start: "top 80%" }
 *     })
 *   })
 *   <section ref={ref}>...</section>
 */
export function useScrollTrigger(animationFactory, deps = []) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // gsap.context scopes all animations — ctx.revert() kills them all on cleanup
    const ctx = gsap.context(() => {
      animationFactory(el)
    }, el)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return ref
}
