import { useEffect, useId, useRef } from 'react'
import './reality-dot-pattern.css'

/**
 * Reality background dots — port of 21st.dev/@designali-in/components/dot-pattern
 * (MagicUI Dot Pattern). No Tailwind; Leva drives width/height/cx/cy/cr/mask/fill.
 * Light mouse + scroll offset kept as requested interactivity.
 */
export default function RealityDotPattern({ settings, scrollProgress = 0 }) {
  const id = useId().replace(/:/g, '')
  const patternRef = useRef(null)

  useEffect(() => {
    if (!settings.dotPatternEnabled) return undefined

    const onMove = (e) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * settings.dotPatternMouseShift
      const ny = (e.clientY / window.innerHeight - 0.5) * settings.dotPatternMouseShift
      if (patternRef.current) {
        patternRef.current.style.setProperty('--dot-offset-x', `${nx}px`)
        patternRef.current.style.setProperty('--dot-offset-y', `${ny}px`)
      }
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [settings.dotPatternEnabled, settings.dotPatternMouseShift])

  useEffect(() => {
    if (!patternRef.current) return
    const scrollShift = scrollProgress * settings.dotPatternScrollShift
    patternRef.current.style.setProperty('--dot-scroll-y', `${scrollShift}px`)
  }, [scrollProgress, settings.dotPatternScrollShift])

  if (!settings.dotPatternEnabled) return null

  const spacing = settings.dotPatternSpacing
  const maskSize = settings.dotPatternMaskSize
  const maskStyle =
    maskSize > 0
      ? {
          maskImage: `radial-gradient(${maskSize}px circle at center, white, transparent)`,
          WebkitMaskImage: `radial-gradient(${maskSize}px circle at center, white, transparent)`,
        }
      : undefined

  return (
    <div
      ref={patternRef}
      className="reality-dot-pattern"
      style={{
        opacity: settings.dotPatternOpacity,
        ...maskStyle,
      }}
      aria-hidden="true"
    >
      {/* Matches 21st DotPattern: fill lives on the SVG; circle inherits it */}
      <svg
        className="reality-dot-pattern__svg"
        width="100%"
        height="100%"
        aria-hidden="true"
        style={{ fill: settings.dotPatternColor }}
      >
        <defs>
          <pattern
            id={id}
            width={spacing}
            height={spacing}
            patternUnits="userSpaceOnUse"
            patternContentUnits="userSpaceOnUse"
            x={settings.dotPatternX}
            y={settings.dotPatternY}
          >
            <circle
              cx={settings.dotPatternCx}
              cy={settings.dotPatternCy}
              r={settings.dotPatternRadius}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
      </svg>
    </div>
  )
}
