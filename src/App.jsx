import { useEffect, useRef } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Hero } from "@/components/sections/Hero"
import { Services } from "@/components/sections/Services"
import { Pricing } from "@/components/sections/Pricing"
import { Stats } from "@/components/sections/Stats"
import { Testimonials } from "@/components/sections/Testimonials"
import { About } from "@/components/sections/About"
import { CTAFooter } from "@/components/sections/CTAFooter"
import { SplineScene } from "@/components/ui/splite"
import cursorImg from "@/assets/927-cursor-lg.png"

export default function App() {
  const cursorRef = useRef(null)

  // Custom cursor
  useEffect(() => {
    const el = cursorRef.current
    if (!el) return
    const onMove = (e) => {
      el.style.transform = `translate(${e.clientX - 64}px, ${e.clientY - 64}px)`
    }
    window.addEventListener("mousemove", onMove, { passive: true })
    return () => window.removeEventListener("mousemove", onMove)
  }, [])

  return (
    <>
      <img
        ref={cursorRef}
        id="custom-cursor"
        src={cursorImg}
        alt=""
        aria-hidden="true"
        draggable={false}
      />
      <Navbar />

      <div className="flex h-screen pt-16">
        {/* Left — Snap-scroll content */}
        <div className="w-full md:w-[55%] h-full overflow-y-auto scroll-container">
          <Hero />
          <Services />
          <Pricing />
          <Stats />
          <Testimonials />
          <About />
          <CTAFooter />
          <Footer />
        </div>

        {/* Right — Fixed 3D Robot */}
        <div className="hidden md:flex w-[45%] h-full items-center justify-center relative bg-[var(--color-base)]">
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>
    </>
  )
}
