# 927 Dev Services — Full 3D Redesign Spec

**Date:** 2026-04-11
**Author:** Keyno + Claude
**Status:** Draft

---

## Overview

Complete redesign of the 927 Development services website. Fresh build from scratch — every section gets its own interactive 3D element, scroll-triggered animations throughout, and premium interactive experience from top to bottom. The site's primary purpose is selling FiveM development services, with secondary links to the Tebex script store and 927 brand/community.

## Tech Stack

| Layer | Tool | Purpose |
|-------|------|---------|
| Framework | React 19 + Vite | Build system, HMR, fast dev |
| Styling | Tailwind CSS v4 | Utility-first CSS |
| 3D (hero) | Spline (`@splinetool/react-spline`) | Interactive 3D robot scene (swappable) |
| 3D (sections) | Three.js + React Three Fiber + Drei | Lightweight per-section 3D elements |
| Animation | GSAP (ScrollTrigger) + Framer Motion | Scroll-triggered + micro-interactions |
| Smooth Scroll | Lenis | Buttery scroll behavior |
| Components | 21st.dev Magic MCP + custom | AI-generated + hand-tuned components |
| Mouse Effects | Spotlight (framer-motion ibelick) | Mouse-follow glow effect |
| Cursor | Custom 927 cursor (128x128 PNG) | Brand identity |

## Design System

| Token | Value |
|-------|-------|
| Background | `#0a0a0a` (pure dark) |
| Accent | `#9333ea` (927 purple) |
| Text Primary | `#f5f5f5` |
| Text Secondary | `#a0a0a0` |
| Glass Panels | 40% opacity, NO backdrop-filter, heavy text shadows |
| Border on hover | Purple accent glow |
| Fonts | System fonts (existing) |
| Grain | Subtle noise texture overlay |

No navy blue anywhere. Purple is the identity color.

## Page Structure

Single-page smooth scroll. No routing. Sticky nav. 6 sections + nav + footer.

---

## Section 1: Hero

**Layout:** Full viewport height. Split layout — left 45% content, right 55% 3D scene.

**Left side:**
- Headline: Bold tagline (e.g., "We Build Worlds") — gradient text, `from-neutral-50 to-neutral-400`
- Subheadline: One-liner about premium FiveM development
- Two CTA buttons:
  - "Get a Quote" → Discord (927 Development server)
  - "Browse Scripts" → Tebex store
- Buttons use purple accent with glow on hover

**Right side:**
- SplineScene component — interactive robot demo scene
- Scene URL: `https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode`
- Robot head follows cursor, ambient idle animation
- Placeholder: swappable for custom GTA-style character later

**Effects:**
- Spotlight (ibelick) — mouse-follow glow across entire hero
- Grain texture overlay on background
- 927 custom cursor active globally

**Scroll exit:**
- GSAP ScrollTrigger: robot scales down + fades, hero content parallax-slides up
- Next section parallax-slides into view

**Performance:**
- Spline lazy-loaded but priority (loads first)
- Suspense fallback: centered loader spinner in glass panel

---

## Section 2: Services

**Layout:** 5 service rows, each full-width. Alternating left/right layout (odd rows: content left + 3D right, even rows: 3D left + content right).

**Services:**

1. **Full Server Builds**
   - Description: Framework, economy, scripts, configs. ESX/QBox setup, economy design, core script stack, performance tuning.
   - 3D Element: Floating wireframe city grid / server rack (R3F)
   - Mouse interaction: Subtle rotation on hover

2. **Custom Script Development**
   - Description: Exclusive server-only scripts. Full NUI design, database-backed, production-hardened, docs + support.
   - 3D Element: Holographic rotating code terminal (R3F)
   - Mouse interaction: Code lines animate/scroll on hover

3. **Custom 3D Design**
   - Description: Custom weapon models/textures, clothing/accessories, YMT addon packs, art direction.
   - 3D Element: Spinning 3D weapon model or character mesh (R3F)
   - Mouse interaction: Rotate model with cursor

4. **Server Management & Optimization**
   - Description: Script updates, compatibility fixes, performance profiling, resource conflict resolution, on-call support.
   - 3D Element: Pulsing 3D dashboard / heartbeat monitor (R3F)
   - Mouse interaction: Pulse speed reacts to cursor proximity

5. **Database & Infrastructure**
   - Description: MySQL/MariaDB optimization, VPS provisioning, backup/disaster recovery, txAdmin config.
   - 3D Element: Interconnected 3D node network / database visualization (R3F)
   - Mouse interaction: Nodes light up as cursor moves near them

**Scroll behavior:**
- GSAP ScrollTrigger pins each row briefly on enter
- Content slides in from the side (left or right depending on row)
- 3D element fades + scales in simultaneously
- Release pin after animation completes, smooth scroll continues

**Card style:** 927 glass panels — `#0a0a0a` base, 40% opacity, purple accent border on hover, heavy text shadows.

---

## Section 3: Social Proof / Stats

**Layout:** Full-width horizontal section. 4 stat counters in a row with a 3D centerpiece behind/between them.

**Stats (animated count-up on scroll entry):**
- Projects Completed
- Servers Built
- Scripts Deployed
- Lines of Code

**3D Element:** Holographic rotating 927 logo (3D extruded) OR globe with pulsing connection lines between nodes. Centered behind the stats, slower parallax scroll rate than content.

**Scroll behavior:**
- Numbers trigger count-up animation on viewport entry (GSAP)
- 3D element continuously rotates, parallax-locked (moves at 50% scroll speed)
- Stats cards use glass panel style with subtle glow

---

## Section 4: Testimonials

**Layout:** Stacked testimonial cards or horizontal carousel. Each card is a 927 glass panel.

**Card content:**
- Client quote
- Client name / server name
- Star rating or simple endorsement

**3D Element:** Floating 3D speech bubbles or chat message icons drifting/bobbing in background. Subtle depth — not competing with text content.

**Effects:**
- Spotlight glow follows mouse across the testimonial area
- Cards stagger in with 21st.dev scroll reveal (each card slides up with slight delay)
- Glass panel style with purple accent on hover

---

## Section 5: About / Brand

**Layout:** Split — left side content, right side 3D element.

**Content:**
- Short, punchy brand story — "Built by devs who run servers"
- What makes 927 different (we use our own scripts in production)
- Link to Discord community
- No biography — identity and credibility only

**3D Element:** Interactive 927 logo scene:
- Logo floats and reacts to cursor movement (rotation + glow)
- Neon purple glow effect
- Particles drifting around the logo
- Built in R3F (custom, no Spline needed)

**Scroll behavior:** Content fades in from left, logo scene scales in from right. GSAP ScrollTrigger.

---

## Section 6: Footer / Final CTA

**Layout:** Two parts stacked:

**Part 1 — CTA Block:**
- Full-width dark section
- Big headline: "Ready to Level Up Your Server?"
- Two CTA buttons (same as hero): "Get a Quote" + "Browse Scripts"
- Spotlight effect active on this section

**Part 2 — Footer:**
- Logo left
- Nav links center (anchor links to sections)
- Social links right: Discord, YouTube, Tebex
- Copyright / 927 Development branding
- Subtle grain texture

**3D Element:** Faint 3D cityscape silhouette or particle field in background. Parallax on scroll. Very subtle — ambient, not attention-grabbing.

---

## Navigation

**Sticky top nav** — full width, transparent on hero, transitions to solid dark glass (`#0a0a0a` 80% opacity) on scroll.

**Layout:**
- Left: 927 logo
- Center: Section anchor links (Services, Stats, Testimonials, About)
- Right: "Scripts" link (→ Tebex, outbound) + "Get a Quote" button (purple accent, glows on hover)

**Behavior:**
- Smooth scroll to anchors via Lenis
- Active section highlighted in nav
- Mobile: hamburger menu with slide-in drawer (glass panel style)

---

## Performance Strategy

Multiple 3D scenes on one page requires careful loading:

1. **Lazy load all 3D** — every SplineScene and R3F canvas uses `React.lazy()` + `Suspense`
2. **Intersection Observer** — 3D scenes only mount when their section enters viewport (unmount when far out of view)
3. **Priority loading** — Hero Spline loads immediately, all other 3D deferred
4. **Fallback UI** — glass panel with shimmer/skeleton animation while 3D loads
5. **Three.js for lightweight scenes** — sections 2-6 use R3F (smaller bundle) not Spline
6. **Only one Spline scene** — the hero robot. Everything else is R3F to keep bundle size down
7. **GSAP cleanup** — kill ScrollTrigger instances on unmount to prevent memory leaks
8. **Image optimization** — any 2D assets use modern formats (WebP/AVIF)

**Target:** First Contentful Paint < 1.5s, hero interactive < 3s, full page loaded < 6s.

---

## File Structure

```
src/
  components/
    layout/
      Navbar.jsx
      Footer.jsx
    sections/
      Hero.jsx
      Services.jsx
      Stats.jsx
      Testimonials.jsx
      About.jsx
      CTAFooter.jsx
    ui/
      splite.jsx          (Spline wrapper — exists)
      spotlight.jsx       (mouse-follow glow — exists)
      spline-demo.jsx     (demo — exists, may not be used directly)
      GlassCard.jsx       (927 glass panel — exists)
      ScrollReveal.jsx    (GSAP reveal — exists)
      SplitText.jsx       (character animation — exists)
      Counter.jsx         (animated number — exists)
    three/
      CityGrid.jsx        (service 1 — wireframe city)
      CodeTerminal.jsx    (service 2 — holographic code)
      WeaponModel.jsx     (service 3 — spinning weapon)
      Dashboard.jsx       (service 4 — pulsing dashboard)
      NodeNetwork.jsx     (service 5 — database nodes)
      Logo927.jsx         (about section — interactive logo)
      ParticleField.jsx   (footer — ambient particles)
      Globe.jsx           (stats — connection globe)
  lib/
    utils.js              (cn helper — exists)
  hooks/
    useLenis.js           (smooth scroll — exists)
    useInView.js          (intersection observer for lazy 3D)
  App.jsx
  main.jsx
  index.css
```

---

## External Links

| Label | Destination |
|-------|-------------|
| Get a Quote | https://discord.gg/hRZeHwWyHG (927 Development Discord) |
| Browse Scripts / Scripts | Tebex store URL |
| YouTube | 927 Development YouTube |

---

## Future Upgrades (Not in Scope)

- Custom Spline character (GTA-style) to replace robot in hero
- Contact form replacing Discord CTA
- Script showcase section if product catalog grows
- Blog / changelog section
- Dark/light mode toggle (currently dark only — keep it)

---

## Success Criteria

- Every section has an interactive 3D element that reacts to mouse/scroll
- Smooth 60fps scroll throughout on mid-range hardware
- Hero 3D scene loads within 3 seconds
- All 21st.dev components feel cohesive with 927 glass panel design system
- Mobile responsive — 3D elements gracefully degrade (static fallbacks or simplified scenes)
- Custom 927 cursor works on all interactive elements
- Purple accent consistent across all hover/active states
