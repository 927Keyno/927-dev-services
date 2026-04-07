import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"

const BOOT_LINES = [
  "> INITIALIZING 927 SYSTEMS...",
  "> LOADING MODULES... [████████████████] 100%",
  "> CONNECTING TO DEVELOPMENT NETWORK...",
  "> AUTHENTICATING DEVELOPER CREDENTIALS...",
  "> STATUS: ONLINE",
  "> WELCOME TO 927 DEVELOPMENT",
]

const LINE_DELAYS = [0, 500, 1100, 1600, 2050, 2400]
const COMPLETE_DELAY = 3200

export function BootSequence({ onComplete }) {
  const [visibleLines, setVisibleLines] = useState([])
  const [done, setDone] = useState(false)
  const [exiting, setExiting] = useState(false)
  const [cursorVisible, setCursorVisible] = useState(true)
  const timersRef = useRef([])

  const skip = () => {
    timersRef.current.forEach(clearTimeout)
    triggerExit()
  }

  const triggerExit = () => {
    setExiting(true)
    setTimeout(() => {
      setDone(true)
      onComplete?.()
    }, 600)
  }

  useEffect(() => {
    BOOT_LINES.forEach((line, i) => {
      const t = setTimeout(() => {
        setVisibleLines((prev) => [...prev, line])
      }, LINE_DELAYS[i])
      timersRef.current.push(t)
    })

    const doneT = setTimeout(() => {
      triggerExit()
    }, COMPLETE_DELAY)
    timersRef.current.push(doneT)

    // Blink cursor
    const blinkInterval = setInterval(() => {
      setCursorVisible((v) => !v)
    }, 530)

    return () => {
      timersRef.current.forEach(clearTimeout)
      clearInterval(blinkInterval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (done) return null

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
          onClick={skip}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "#000000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          {/* Subtle scanline overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(74,222,128,0.015) 2px, rgba(74,222,128,0.015) 4px)",
              pointerEvents: "none",
            }}
          />

          {/* Terminal box */}
          <div
            style={{
              position: "relative",
              width: "min(640px, 90vw)",
              fontFamily: "Consolas, 'Courier New', monospace",
              fontSize: "clamp(12px, 1.6vw, 15px)",
              lineHeight: 2,
              padding: "40px 36px",
              border: "1px solid rgba(74,222,128,0.2)",
              borderRadius: 4,
              background: "rgba(0,0,0,0.6)",
              boxShadow: "0 0 60px rgba(74,222,128,0.07), inset 0 0 40px rgba(0,0,0,0.5)",
            }}
          >
            {/* Corner accent */}
            <div style={{
              position: "absolute",
              top: -1, left: -1,
              width: 24, height: 24,
              borderTop: "2px solid #4ade80",
              borderLeft: "2px solid #4ade80",
              borderRadius: "4px 0 0 0",
            }} />
            <div style={{
              position: "absolute",
              bottom: -1, right: -1,
              width: 24, height: 24,
              borderBottom: "2px solid #4ade80",
              borderRight: "2px solid #4ade80",
              borderRadius: "0 0 4px 0",
            }} />

            {visibleLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                style={{
                  color: i === BOOT_LINES.length - 1
                    ? "#ffffff"
                    : i === BOOT_LINES.length - 2
                    ? "#4ade80"
                    : "rgba(74,222,128,0.85)",
                  textShadow: "0 0 12px rgba(74,222,128,0.5)",
                  fontWeight: i >= BOOT_LINES.length - 2 ? 700 : 400,
                  letterSpacing: i === BOOT_LINES.length - 1 ? "0.12em" : "0.02em",
                  fontSize: i === BOOT_LINES.length - 1 ? "1.15em" : "1em",
                }}
              >
                {line}
              </motion.div>
            ))}

            {/* Blinking cursor */}
            <span
              style={{
                display: "inline-block",
                color: "#4ade80",
                textShadow: "0 0 12px rgba(74,222,128,0.8)",
                opacity: cursorVisible ? 1 : 0,
                transition: "opacity 0.1s",
                fontWeight: 700,
              }}
            >
              █
            </span>
          </div>

          {/* Skip hint */}
          <div
            style={{
              position: "absolute",
              bottom: 28,
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: 11,
              color: "rgba(74,222,128,0.3)",
              fontFamily: "Consolas, 'Courier New', monospace",
              letterSpacing: "0.08em",
            }}
          >
            CLICK ANYWHERE TO SKIP
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
