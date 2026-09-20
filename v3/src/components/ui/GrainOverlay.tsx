/**
 * Fixed film-grain layer. SVG turbulence, no JS, no repaint cost.
 * Sits over the whole page; pointer-events off so it never blocks anything.
 */
export default function GrainOverlay({ opacity = 0.045 }: { opacity?: number }) {
  if (opacity <= 0) return null
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[70]"
      style={{
        opacity,
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E\")",
        backgroundSize: '160px 160px',
        mixBlendMode: 'multiply',
      }}
    />
  )
}
