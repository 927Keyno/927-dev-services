import { useEffect, useRef } from "react"
import { useLenis } from "@/hooks/useLenis"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Hero } from "@/components/sections/Hero"
import { Services } from "@/components/sections/Services"
import { Stats } from "@/components/sections/Stats"
import { Testimonials } from "@/components/sections/Testimonials"
import { About } from "@/components/sections/About"
import { CTAFooter } from "@/components/sections/CTAFooter"
import cursorImg from "@/assets/927-cursor-lg.png"

export default function App() {
  useLenis()
  const cursorRef = useRef(null)

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
      <main>
        <Hero />
        <Services />
        <Stats />
        <Testimonials />
        <About />
        <CTAFooter />
      </main>
      <Footer />
    </>
  )
}
