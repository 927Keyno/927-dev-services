// src/App.jsx
import { useEffect, useRef } from "react"
import { useLenis } from "@/hooks/useLenis"
import { Hero } from "@/components/Hero"
import { Problem } from "@/components/Problem"
import { Services } from "@/components/Services"
import { Pricing } from "@/components/Pricing"
import { SocialProof } from "@/components/SocialProof"
import { ScriptShowcase } from "@/components/ScriptShowcase"
import { Contact } from "@/components/Contact"
import cursorImg from "@/assets/927-cursor-lg.png"
import { Navbar } from "@/components/Navbar"

export default function App() {
  // Initialize Lenis smooth scroll + sync with GSAP ScrollTrigger
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
      {/* Custom cursor overlay */}
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
        <Problem />
        <Services />
        <Pricing />
        <SocialProof />
        <ScriptShowcase />
        <Contact />
      </main>
    </>
  )
}
