/**
 * Fixed film-grain layer. SVG turbulence, no JS, no repaint cost.
 * Sits over the whole page; pointer-events off so it never blocks anything.
 */
export default function GrainOverlay({
  opacity = 0.06,
  blend = 'multiply',
}: {
  opacity?: number
  blend?: 'multiply' | 'overlay' | 'soft-light'
}) {
  if (opacity <= 0) return null
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[2]"
      style={{
        opacity: Math.min(0.18, Math.max(0.04, opacity)),
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E\")",
        backgroundSize: '180px 180px',
        mixBlendMode: blend,
      }}
    />
  )
}
