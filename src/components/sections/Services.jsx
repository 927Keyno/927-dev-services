import { ServiceRow } from "@/components/ui/ServiceRow"
import { HyperText } from "@/components/ui/hyper-text"
import { ScrollReveal } from "@/components/ui/ScrollReveal"

const SERVICES = [
  {
    title: "Full Server Builds",
    tag: "TURNKEY",
    description:
      "Framework, economy, scripts, configs. ESX/QBox setup, economy design, core script stack (garage, inventory, banking, housing), performance tuning. Your server, built from the ground up.",
  },
  {
    title: "Custom Script Development",
    tag: "EXCLUSIVE",
    description:
      "Exclusive server-only scripts. Full NUI design, database-backed, production-hardened. Includes documentation and ongoing support. Built to your exact spec.",
  },
  {
    title: "Custom 3D Design",
    tag: "ONE-OF-ONE",
    description:
      "Custom weapon models and textures, unique clothing and accessories, YMT addon packs, exclusive art direction. Stand out from every other server.",
  },
  {
    title: "Server Management & Optimization",
    tag: "24/7",
    description:
      "Script updates, compatibility fixes, performance profiling, resource conflict resolution, on-call support. Keep your server running smooth around the clock.",
  },
  {
    title: "Database & Infrastructure",
    tag: "BACKBONE",
    description:
      "MySQL/MariaDB optimization, VPS provisioning, backup and disaster recovery, txAdmin configuration and monitoring. The backbone your server depends on.",
  },
]

export function Services() {
  return (
    <div
      id="services"
      className="snap-section flex flex-col justify-center items-center px-6 md:px-12 py-8"
    >
      <div className="w-full max-w-2xl flex flex-col h-full max-h-[90vh]">
        {/* Header */}
        <div className="mb-4 flex-shrink-0">
          <ScrollReveal>
            <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[var(--color-accent)] mb-2 block">
              What We Do
            </span>
          </ScrollReveal>
          <HyperText
            className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]"
            duration={1000}
            startOnView
          >
            SERVICES
          </HyperText>
        </div>

        {/* Scrollable card list — no snap, hidden scrollbar */}
        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
          <div className="flex flex-col gap-6 py-4">
            {SERVICES.map((service, i) => (
              <ServiceRow
                key={service.title}
                title={service.title}
                tag={service.tag}
                description={service.description}
                index={i}
              />
            ))}
            {/* Bottom breathing room so last card isn't flush against edge */}
            <div className="h-4 flex-shrink-0" />
          </div>
        </div>
      </div>
    </div>
  )
}
