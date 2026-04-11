import { cn } from "@/lib/utils"

const FOOTER_LINKS = [
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Scripts", href: "https://927-development.tebex.io", external: true },
]

const SOCIAL_LINKS = [
  { label: "Discord", href: "https://discord.gg/hRZeHwWyHG" },
  { label: "YouTube", href: "#" },
  { label: "Tebex", href: "https://927-development.tebex.io" },
]

export function Footer() {
  return (
    <footer className="border-t border-[rgba(147,51,234,0.1)] bg-[var(--color-base)]">
      <div className="px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-lg font-bold">
          <span className="text-[var(--color-accent)]">927</span>
          <span className="text-[var(--color-text-secondary)]"> Development</span>
        </div>

        <div className="flex gap-6">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex gap-4">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <div className="border-t border-[rgba(147,51,234,0.05)] py-4 text-center">
        <p className="text-xs text-[var(--color-text-secondary)] opacity-50">
          &copy; {new Date().getFullYear()} 927 Development. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
