import { TestimonialCard } from "@/components/ui/TestimonialCard"
import { Spotlight } from "@/components/ui/spotlight"
import { ScrollReveal } from "@/components/ui/ScrollReveal"
import { SplitText } from "@/components/ui/SplitText"

const TESTIMONIALS = [
  {
    quote: "927 completely rebuilt our server from scratch. The scripts are clean, performant, and our players noticed the difference immediately. Best investment we made.",
    name: "Server Owner",
    server: "Boot Town RP",
  },
  {
    quote: "The custom scripts are on another level. Every feature works exactly how we spec'd it, and the NUI design is next-gen. Our server stands out because of 927.",
    name: "Server Owner",
    server: "4DaRaw RP",
  },
  {
    quote: "Fast turnaround, solid communication, and the code is actually clean. No spaghetti, no bugs. 927 is the real deal for FiveM development.",
    name: "Server Owner",
    server: "SAWL RP",
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="section relative py-24 md:py-32 overflow-hidden">
      <Spotlight className="-top-20 right-0 md:right-40" size={500} />

      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <p className="text-sm font-medium tracking-widest uppercase text-[var(--color-accent)] mb-4 text-center">
            What They Say
          </p>
        </ScrollReveal>
        <SplitText tag="h2" className="text-4xl md:text-5xl font-bold text-center mb-16">
          Client Testimonials
        </SplitText>

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <ScrollReveal key={i} delay={i * 0.15}>
              <TestimonialCard {...t} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
