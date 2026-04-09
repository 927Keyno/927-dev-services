// src/components/ServiceCard.jsx

/**
 * Full-screen service slide — used inside Services.jsx pinned timeline.
 * Each slide takes over the entire viewport with a 50/50 desktop split.
 *
 * Props:
 *   service  — { id, icon, title, description, bullets[], visual }
 *   cardRef  — ref forwarded from parent for GSAP targeting
 *   bgRef    — ref for the per-slide background layer
 */
export function ServiceCard({ service, cardRef, bgRef }) {
  const num = String(service.id).padStart(2, "0")

  return (
    <div
      ref={cardRef}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: 0,
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      {/* Per-service background */}
      <div
        ref={bgRef}
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0,
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        {service.bg}
      </div>

      {/* Content wrapper — 50/50 split on desktop */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "1280px",
          padding: "0 3rem",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4rem",
          alignItems: "center",
        }}
      >
        {/* ── LEFT: Text content ─────────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Faded service number */}
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "clamp(5rem, 10vw, 9rem)",
              fontWeight: 900,
              letterSpacing: "-0.05em",
              color: "rgba(147,51,234,0.07)",
              lineHeight: 1,
              userSelect: "none",
              pointerEvents: "none",
              position: "absolute",
              top: "50%",
              left: "3rem",
              transform: "translateY(-50%)",
              zIndex: 0,
            }}
            aria-hidden
          >
            {num}
          </span>

          {/* Label */}
          <p
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.3em",
              color: "var(--color-accent)",
              textTransform: "uppercase",
              fontWeight: 700,
              position: "relative",
              zIndex: 1,
            }}
          >
            {num} &nbsp;/&nbsp; 05
          </p>

          {/* Title */}
          <h3
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              color: "var(--color-text-primary)",
              position: "relative",
              zIndex: 1,
            }}
          >
            {service.title}
          </h3>

          {/* Description */}
          <p
            style={{
              fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
              color: "var(--color-text-secondary)",
              lineHeight: 1.75,
              maxWidth: "480px",
              position: "relative",
              zIndex: 1,
            }}
          >
            {service.description}
          </p>

          {/* Accent rule */}
          <div
            style={{
              width: "48px",
              height: "2px",
              background: "var(--color-accent)",
              borderRadius: "2px",
              boxShadow: "0 0 12px var(--color-accent)",
              position: "relative",
              zIndex: 1,
            }}
          />

          {/* Bullet points */}
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              position: "relative",
              zIndex: 1,
            }}
          >
            {service.bullets.map((bullet, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.85rem",
                  color: "var(--color-text-secondary)",
                  fontSize: "1rem",
                  lineHeight: 1.5,
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "var(--color-accent)",
                    boxShadow: "0 0 8px var(--color-accent)",
                    flexShrink: 0,
                    marginTop: "6px",
                  }}
                />
                {bullet}
              </li>
            ))}
          </ul>
        </div>

        {/* ── RIGHT: Visual element ──────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 1,
            minHeight: "400px",
          }}
        >
          {service.visual}
        </div>
      </div>
    </div>
  )
}
