import { useHeroLayoutTuner } from '@/context/HeroLayoutTunerContext'

/** Darkroom-style condensed wordmark test — bottom-right of hero by default */
export default function HeroWatermark() {
  const layout = useHeroLayoutTuner()
  if (!layout.showWatermark) return null

  return (
    <div
      className="pointer-events-none absolute z-[3] select-none uppercase leading-none"
      style={{
        right: `${layout.watermarkRight}%`,
        bottom: `${layout.watermarkBottom}%`,
        opacity: layout.watermarkOpacity,
        fontFamily: '"Druk Condensed", "Druk", Impact, sans-serif',
        fontWeight: 900,
        fontSize: `clamp(2.5rem, ${layout.watermarkSize}vw, 9rem)`,
        letterSpacing: `${layout.watermarkTracking}em`,
        color: layout.watermarkColor,
        textAlign: 'right',
        maxWidth: '70vw',
        lineHeight: 0.85,
        transform: `translate(${layout.watermarkOffsetX}px, ${layout.watermarkOffsetY}px)`,
      }}
      aria-hidden
    >
      {layout.watermarkLine1}
      <br />
      {layout.watermarkLine2}
    </div>
  )
}
