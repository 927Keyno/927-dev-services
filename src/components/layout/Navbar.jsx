import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Stats", href: "#stats" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "About", href: "#about" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const handleClick = (e, href) => {
    e.preventDefault()
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: "smooth" })
    setMobileOpen(false)
  }

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[rgba(10,10,10,0.8)] border-b border-[rgba(147,51,234,0.15)]"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="text-xl font-bold text-[var(--color-text-primary)]">
          <span className="text-[var(--color-accent)]">927</span> Development
        </a>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://927-development.tebex.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            Scripts
          </a>
        </div>

        <div className="hidden md:block">
          <a
            href="https://discord.gg/hRZeHwWyHG"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 text-sm font-medium rounded-lg bg-[var(--color-accent)] text-white hover:shadow-[0_0_20px_rgba(147,51,234,0.4)] transition-shadow"
          >
            Get a Quote
          </a>
        </div>

        <button
          className="md:hidden flex flex-col gap-1.5"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span className={cn("w-6 h-0.5 bg-[var(--color-text-primary)] transition-transform", mobileOpen && "rotate-45 translate-y-2")} />
          <span className={cn("w-6 h-0.5 bg-[var(--color-text-primary)] transition-opacity", mobileOpen && "opacity-0")} />
          <span className={cn("w-6 h-0.5 bg-[var(--color-text-primary)] transition-transform", mobileOpen && "-rotate-45 -translate-y-2")} />
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[rgba(10,10,10,0.95)] border-t border-[rgba(147,51,234,0.15)] px-6 py-4 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://927-development.tebex.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
          >
            Scripts
          </a>
          <a
            href="https://discord.gg/hRZeHwWyHG"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 text-sm font-medium rounded-lg bg-[var(--color-accent)] text-white text-center"
          >
            Get a Quote
          </a>
        </div>
      )}
    </nav>
  )
}
