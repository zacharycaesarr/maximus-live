import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type LightGradientSettings = {
  stop0: string
  stop1: string
  stop2: string
  stop3: string
  stop4: string
  noiseOpacity: number
  gridOpacity: number
  diagonalOpacity: number
  gridSize: number
  diagonalSize: number
  showNoise: boolean
  showGrid: boolean
  showDiagonal: boolean
}

type Props = {
  settings: LightGradientSettings
  className?: string
  children?: ReactNode
}

/**
 * Exact structure from 21st.dev @jatin-yadav05/dark-gradient-background
 * (vertical gradient + noise + grid + diagonal). Colors remapped to near-white /
 * pale mocha for a Direct-like light hero — fully tunable via Leva.
 */
export function LightGradientBackground({ settings, className = '', children }: Props) {
  const gradient = `linear-gradient(180deg, ${settings.stop0} 0%, ${settings.stop1} 20%, ${settings.stop2} 40%, ${settings.stop3} 70%, ${settings.stop4} 100%)`

  return (
    <div className={cn('pointer-events-none absolute inset-0 z-0 overflow-hidden', className)} aria-hidden>
      {/* Main gradient background — same stops/angles as jatin component */}
      <div className="absolute inset-0" style={{ background: gradient }} />

      {/* Noise texture (same CDN asset as 21st component) */}
      {settings.showNoise && (
        <div
          className="absolute inset-0 bg-repeat"
          style={{
            opacity: settings.noiseOpacity,
            backgroundImage:
              'url("https://cdn.21st.dev/assets/mirror/f5/f55dfc553c100e6da0ad95258a042b4100f0ff4bb03a5313d1f541984275e262.png")',
            backgroundSize: '149.76px',
            mixBlendMode: 'multiply',
          }}
        />
      )}

      {/* Geometric grid overlay */}
      {settings.showGrid && (
        <div
          className="absolute inset-0"
          style={{
            opacity: settings.gridOpacity,
            backgroundImage: `
              linear-gradient(rgba(44,37,32,0.14) 1px, transparent 1px),
              linear-gradient(90deg, rgba(44,37,32,0.14) 1px, transparent 1px)
            `,
            backgroundSize: `${settings.gridSize}px ${settings.gridSize}px`,
          }}
        />
      )}

      {/* Diagonal lines overlay */}
      {settings.showDiagonal && (
        <div
          className="absolute inset-0"
          style={{
            opacity: settings.diagonalOpacity,
            backgroundImage: `
              linear-gradient(45deg, rgba(44,37,32,0.12) 1px, transparent 1px),
              linear-gradient(-45deg, rgba(44,37,32,0.12) 1px, transparent 1px)
            `,
            backgroundSize: `${settings.diagonalSize}px ${settings.diagonalSize}px`,
          }}
        />
      )}

      {children ? <div className="relative z-10">{children}</div> : null}
    </div>
  )
}

export const GradientBackground = LightGradientBackground
