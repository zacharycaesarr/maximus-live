/**
 * Dedicated grain layer ABOVE gradients, BELOW content.
 * 21st-style feTurbulence + contrast/brightness so it reads as texture, not dirt.
 * Leva: amount, size, contrast, brightness, blend.
 */
export function twentyFirstGrainDataUrl(amount = 100) {
  const op = Math.max(0.08, Math.min(0.72, (amount / 100) * 0.55))
  return `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='${op}'/></svg>")`
}

export default function GrainOverlay({
  amount = 90,
  opacity,
  blend = 'overlay',
  grainSize = 120,
  contrast = 1.35,
  brightness = 1.05,
  fixed = true,
  className = '',
}: {
  /** 0–100, matches 21st grain slider */
  amount?: number
  /** @deprecated use amount */
  opacity?: number
  blend?: 'multiply' | 'overlay' | 'soft-light' | 'normal'
  grainSize?: number
  /** CSS filter contrast — bump this if grain disappears on light bg */
  contrast?: number
  brightness?: number
  fixed?: boolean
  className?: string
}) {
  const level =
    opacity != null ? Math.min(100, Math.max(0, (opacity / 0.5) * 100)) : amount
  if (level <= 0) return null
  const tile = Math.max(60, Math.min(240, Math.round(grainSize)))
  return (
    <div
      aria-hidden
      className={
        fixed
          ? `pointer-events-none fixed inset-0 z-[2] ${className}`
          : `pointer-events-none absolute inset-0 z-[2] ${className}`
      }
      style={{
        backgroundImage: twentyFirstGrainDataUrl(level),
        backgroundSize: `${tile}px ${tile}px`,
        mixBlendMode: blend,
        filter: `contrast(${contrast}) brightness(${brightness})`,
        opacity: 1,
      }}
    />
  )
}
