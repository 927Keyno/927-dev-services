# 927 Dev Services — Website Redesign

**Date:** 2026-04-08  
**Status:** Approved  
**Goal:** Rebuild the 927 Development website as a cinematic, scroll-driven experience that showcases server development services to FiveM server owners. Apple product-page style with GSAP + Lenis + Three.js.

---

## Target Audience

FiveM server owners looking for professional server development — full builds, custom scripts, 3D work, optimization, database management. These are people running or starting RP servers who need quality dev work.

## Tech Stack

**Add:**
- `gsap` — core animation library + ScrollTrigger plugin
- `lenis` — smooth scroll library (`@studio-freight/lenis` or `lenis`)

**Remove:**
- `motion` (Framer Motion) — fully replaced by GSAP

**Keep:**
- `react`, `react-dom`, `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`
- `tailwindcss`, `vite`
- `clsx`, `tailwind-merge`, `class-variance-authority`

---

## Site Structure & Scroll Flow

Single continuous scroll — no page navigation. Each section is a full-viewport "scene" that reveals on scroll. Lenis handles smooth scroll, GSAP ScrollTrigger pins and animates each section.

### Section 1: Hero
- Full-screen Three.js scene
- 927 Old English logo as 3D extruded mesh (gold/chrome material with purple environment reflections)
- Floating purple particle field around the logo
- Subtle purple ambient light + directional light for metallic reflections
- As user scrolls: logo scales down and moves up, tagline reveals beneath (e.g., "We Build Worlds")
- CTA button fades in
- Scroll behavior: `scrub: true` — 3D rotation tied directly to scroll position

### Section 2: The Problem
- "Your server deserves more than drag-and-drop scripts."
- Quick scroll-triggered text animations speaking to server owners' pain points
- Sets up why custom development matters
- Text split animations (words stagger in from bottom with opacity)

### Section 3: Services Showcase
- The money section. 4-5 pinned scroll segments
- Each service gets its own dramatic reveal — section pins to viewport, elements animate in sequence, then unpins
- Apple product-page style: each service feels like its own mini-experience

**Services:**
1. Full Server Builds
2. Custom Script Development  
3. Custom 3D Design (chains, guns, clothing, skins)
4. Server Management & Optimization
5. Database & Infrastructure

### Section 4: Social Proof
- Stats that count up on scroll enter
- No server names — results only:
  - 600+ concurrent players across managed servers
  - 150+ peak population servers built
  - 30+ custom scripts deployed in production
  - $15k+/month revenue generated for server owners

### Section 5: The 927 Suite
- Showcase of published scripts (weapon manager, etc.)
- Cards with hover effects, links to Tebex
- Horizontal slide-in animation
- Not a full store — just a highlight reel

### Section 6: CTA / Contact
- "Ready to level up your server?"
- Discord link (primary CTA)
- Simple contact option
- The 3D 927 logo returns larger as a closing visual element

---

## Visual Design System

### Palette
| Token | Value | Usage |
|-------|-------|-------|
| Base | `#0a0a0a` | Page background |
| Surface | `#141414` | Cards, elevated elements |
| Border | `#1f1f1f` | Subtle dividers |
| Text primary | `#f5f5f5` | Headings, body text |
| Text secondary | `#a0a0a0` | Descriptions, labels |
| Accent | `#9333ea` | Purple-600 — primary accent |
| Accent glow | `#7c3aed` | Purple-500 — hover states, glows |
| Accent subtle | `rgba(147, 51, 234, 0.1)` | Background tints |

### Typography
- Headings: Inter (bold, tight letter-spacing, large)
- Body: Inter (clean, readable)
- 927 logo: Old English (rendered as SVG/3D, not a font)

### Design Language
- Glass-morphism cards with subtle purple border glow
- Lots of negative space — no clutter
- Elements animate IN from scroll, never pre-visible
- Purple accent used sparingly — glows, borders, highlights
- Grain/noise texture overlay on background for depth

---

## Animation System (GSAP + Lenis)

### Lenis Config
- Smooth scroll with `lerp: 0.1` for premium buttery feel
- Integrated with GSAP ScrollTrigger ticker via `lenis.on('scroll', ScrollTrigger.update)`

### GSAP Animation Patterns

| Pattern | Where Used | Effect |
|---------|-----------|--------|
| Pin & reveal | Services showcase | Section pins to viewport, elements animate in sequence, then unpins |
| Text split animation | Hero tagline, section headers | Letters/words stagger in from bottom with opacity |
| Parallax layers | Backgrounds, floating elements | Different scroll speeds create depth |
| Counter | Social proof stats | Numbers count from 0 to target on scroll enter |
| Scale & fade | Hero 3D logo, service icons | Elements scale up from 0.8 with opacity |
| Horizontal slide | Script showcase cards | Cards slide in from right in sequence |
| Scrub | Hero 3D scene | 3D rotation tied directly to scroll position |

### ScrollTrigger Setup
- Pinned sections: `trigger` element, `start: "top top"`, `end: "+=150%"`, `pin: true`
- Enter animations: `start: "top 80%"`, `toggleActions: "play none none none"`
- Hero 3D: `scrub: true` for continuous scroll-linked animation

---

## Three.js Hero

### What It Renders
- 927 Old English logo as 3D extruded mesh
- Gold/chrome material with purple environment reflections
- Floating purple particle field
- Purple ambient light + directional light for metallic reflections
- Postprocessing bloom for purple glow

### Scroll Behavior
- On load: logo rotates slowly, centered
- Scroll down: logo scales down, moves up, tagline reveals
- Bottom of page (CTA): logo reappears larger as closing element

### Performance
- `@react-three/fiber` with `@react-three/drei` helpers
- Low poly count on extruded text
- `frameloop="demand"` — only render when needed
- Postprocessing bloom via `@react-three/postprocessing` (already in deps)

---

## Component Architecture

```
src/
├── App.jsx                    — Lenis + ScrollTrigger setup, section layout
├── components/
│   ├── Hero.jsx               — 3D scene + tagline + CTA
│   ├── Problem.jsx            — Pain point text animations
│   ├── Services.jsx           — Pinned scroll showcase (parent)
│   ├── ServiceCard.jsx        — Individual service reveal
│   ├── SocialProof.jsx        — Stats counter section
│   ├── ScriptShowcase.jsx     — 927 Suite Tebex cards
│   ├── Contact.jsx            — CTA + Discord link
│   └── ui/
│       ├── Scene3D.jsx        — Three.js canvas + 927 logo mesh
│       ├── SplitText.jsx      — GSAP text split animation wrapper
│       ├── ScrollReveal.jsx   — Reusable scroll-triggered fade/slide
│       ├── Counter.jsx        — Animated number counter
│       └── GlassCard.jsx      — Glass-morphism card component
├── hooks/
│   ├── useLenis.js            — Lenis initialization + GSAP sync
│   └── useScrollTrigger.js    — Reusable ScrollTrigger setup
├── styles/
│   └── index.css              — Tailwind + custom GSAP/grain styles
└── main.jsx
```

### Cleanup from Current Codebase
- Remove: BootSequence, BorderBeam, ShinyText, HyperText, TiltCard, Background3D
- Remove: Framer Motion dependency
- Keep: Three.js ecosystem, Tailwind, Vite

---

## Responsive Behavior

- Desktop-first design (target audience is server owners on desktop)
- Mobile: 3D scene simplified or replaced with static hero, animations reduced
- Pinned scroll sections become standard scroll on mobile (no pin)
- Cards stack vertically on mobile

---

## Performance Budget

- First contentful paint: under 2s
- Three.js scene lazy-loaded after initial HTML renders
- GSAP animations use `will-change` hints sparingly
- Images lazy-loaded, WebP format
- Total JS bundle target: under 300KB gzipped
