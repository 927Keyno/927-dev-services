import { lazy } from "react"
import { ServiceRow } from "@/components/ui/ServiceRow"
import { SplitText } from "@/components/ui/SplitText"
import { ScrollReveal } from "@/components/ui/ScrollReveal"

const CityGrid = lazy(() => import("@/components/three/CityGrid").then((m) => ({ default: m.CityGrid })))
const CodeTerminal = lazy(() => import("@/components/three/CodeTerminal").then((m) => ({ default: m.CodeTerminal })))
const WeaponModel = lazy(() => import("@/components/three/WeaponModel").then((m) => ({ default: m.WeaponModel })))
const Dashboard = lazy(() => import("@/components/three/Dashboard").then((m) => ({ default: m.Dashboard })))
const NodeNetwork = lazy(() => import("@/components/three/NodeNetwork").then((m) => ({ default: m.NodeNetwork })))

const SERVICES = [
  {
    title: "Full Server Builds",
    description: "Framework, economy, scripts, configs. ESX/QBox setup, economy design, core script stack (garage, inventory, banking, housing), performance tuning. Your server, built from the ground up.",
    Scene: CityGrid,
  },
  {
    title: "Custom Script Development",
    description: "Exclusive server-only scripts. Full NUI design, database-backed, production-hardened. Includes documentation and ongoing support. Built to your exact spec.",
    Scene: CodeTerminal,
  },
  {
    title: "Custom 3D Design",
    description: "One-of-one assets. Custom weapon models and textures, unique clothing and accessories, YMT addon packs, exclusive art direction. Stand out from every other server.",
    Scene: WeaponModel,
  },
  {
    title: "Server Management & Optimization",
    description: "Script updates, compatibility fixes, performance profiling, resource conflict resolution, on-call support. Keep your server running smooth 24/7.",
    Scene: Dashboard,
  },
  {
    title: "Database & Infrastructure",
    description: "MySQL/MariaDB optimization, VPS provisioning, backup and disaster recovery, txAdmin configuration and monitoring. The backbone your server depends on.",
    Scene: NodeNetwork,
  },
]

export function Services() {
  return (
    <section id="services" className="section relative py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <p className="text-sm font-medium tracking-widest uppercase text-[var(--color-accent)] mb-4 text-center">
            What We Do
          </p>
        </ScrollReveal>
        <SplitText tag="h2" className="text-4xl md:text-5xl font-bold text-center mb-16">
          Services
        </SplitText>

        {SERVICES.map((service, i) => (
          <ServiceRow
            key={service.title}
            title={service.title}
            description={service.description}
            ThreeScene={service.Scene}
            reverse={i % 2 !== 0}
            index={i}
          />
        ))}
      </div>
    </section>
  )
}
