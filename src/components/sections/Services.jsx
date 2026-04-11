import { ServiceRow } from "@/components/ui/ServiceRow"
import { HyperText } from "@/components/ui/hyper-text"
import { ScrollReveal } from "@/components/ui/ScrollReveal"

const SERVICES = [
  {
    title: "Full Server Builds",
    description: "Framework, economy, scripts, configs. ESX/QBox setup, economy design, core script stack (garage, inventory, banking, housing), performance tuning. Your server, built from the ground up.",
  },
  {
    title: "Custom Script Development",
    description: "Exclusive server-only scripts. Full NUI design, database-backed, production-hardened. Includes documentation and ongoing support. Built to your exact spec.",
  },
  {
    title: "Custom 3D Design",
    description: "One-of-one assets. Custom weapon models and textures, unique clothing and accessories, YMT addon packs, exclusive art direction. Stand out from every other server.",
  },
  {
    title: "Server Management & Optimization",
    description: "Script updates, compatibility fixes, performance profiling, resource conflict resolution, on-call support. Keep your server running smooth 24/7.",
  },
  {
    title: "Database & Infrastructure",
    description: "MySQL/MariaDB optimization, VPS provisioning, backup and disaster recovery, txAdmin configuration and monitoring. The backbone your server depends on.",
  },
]

export function Services() {
  return (
    <div id="services" className="snap-section flex flex-col px-8 py-8" style={{ height: '100%' }}>
      <div className="mb-4 flex-shrink-0">
        <ScrollReveal>
          <span className="text-xs font-medium tracking-widest uppercase text-[var(--color-accent)] mb-3 block">
            What We Do
          </span>
        </ScrollReveal>
        <HyperText
          className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-2"
          duration={1000}
          startOnView
        >
          SERVICES
        </HyperText>
      </div>

      <div className="flex-1 overflow-y-auto scroll-container space-y-3 pr-1">
        {SERVICES.map((service, i) => (
          <ServiceRow key={service.title} title={service.title} description={service.description} index={i} />
        ))}
      </div>
    </div>
  )
}
