'use client'

import { MeshGradient } from '@paper-design/shaders-react'

export type MeshWaveSettings = {
  color0: string
  color1: string
  color2: string
  color3: string
  color4: string
  speed: number
  wireOpacity: number
  vignetteStrength: number
}

/** Near-white remapped MeshGradient from 21st @reuno-ui/hero (paper shaders). */
export function MeshWaveBackground({
  settings,
  className = '',
}: {
  settings: MeshWaveSettings
  className?: string
}) {
  const colors = [settings.color0, settings.color1, settings.color2, settings.color3, settings.color4]
  const v = Math.min(1.5, Math.max(0, settings.vignetteStrength))

  return (
    <div className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`} aria-hidden>
      <div className="absolute inset-0 bg-[#fafafa]" />
      <MeshGradient
        className="absolute inset-0 h-full w-full"
        colors={colors}
        speed={settings.speed}
        distortion={0.55}
        swirl={0.35}
        grainMixer={0.12}
        grainOverlay={0.08}
      />
      {/* Soft second wash for wave depth */}
      <div
        className="absolute inset-0"
        style={{
          opacity: settings.wireOpacity * 0.55,
          background:
            'radial-gradient(ellipse 80% 60% at 70% 40%, rgba(120,110,95,0.18), transparent 60%), radial-gradient(ellipse 50% 40% at 20% 80%, rgba(80,75,68,0.12), transparent 55%)',
        }}
      />
      {/* Section + corner vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 75% 65% at 50% 45%, transparent 35%, rgba(20,16,12,${0.18 * v}) 100%),
            radial-gradient(ellipse 100% 100% at 50% 50%, transparent 42%, rgba(10,8,6,${0.32 * v}) 100%)
          `,
        }}
      />
    </div>
  )
}
