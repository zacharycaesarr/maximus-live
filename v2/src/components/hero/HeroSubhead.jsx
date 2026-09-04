import ParallaxLayer from '../parallax/ParallaxLayer'
import { useParallaxTuner } from '../../context/ParallaxTunerContext'
import { splitBrandText } from './subheadDefaults'
import './hero-subhead.css'

export default function HeroSubhead({ settings }) {
  const { settings: parallax } = useParallaxTuner()
  const segments = splitBrandText(settings.text, settings.brandLabel)

  const backdropBg = settings.backdropEnabled
    ? `rgba(${hexToRgb(settings.backdropColor).join(',')}, ${settings.backdropOpacity})`
    : 'transparent'

  return (
    <ParallaxLayer
      depth={parallax.subheadDepth}
      className="hero-subhead"
      style={{
        left: `${settings.posX}%`,
        top: `${settings.posY}%`,
        maxWidth: settings.maxWidth,
        '--subhead-delay': `${settings.animDelay}s`,
        '--subhead-duration': `${settings.animDuration}s`,
      }}
    >
      <div
        className="hero-subhead-card"
        style={{
          padding: settings.backdropEnabled ? settings.backdropPadding : 0,
          borderRadius: settings.backdropEnabled ? settings.backdropRadius : 0,
          background: backdropBg,
          backdropFilter: settings.backdropEnabled ? `blur(${settings.backdropBlur}px)` : 'none',
          WebkitBackdropFilter: settings.backdropEnabled ? `blur(${settings.backdropBlur}px)` : 'none',
        }}
      >
        <p
          className="hero-subhead-text"
          style={{
            fontSize: settings.fontSize,
            fontWeight: settings.fontWeight,
            color: settings.color,
            lineHeight: settings.lineHeight,
            letterSpacing: settings.letterSpacing,
          }}
        >
          {segments.map((segment, index) =>
            segment.type === 'brand' ? (
              <span
                key={`brand-${index}`}
                className="hero-subhead-brand"
                style={{
                  fontWeight: settings.brandWeight,
                  color: settings.brandColor,
                }}
              >
                {segment.value}
              </span>
            ) : (
              <span key={`text-${index}`}>{segment.value}</span>
            ),
          )}
        </p>
      </div>
    </ParallaxLayer>
  )
}

function hexToRgb(hex) {
  const n = (hex || '#ebe1ca').replace('#', '')
  return [
    parseInt(n.slice(0, 2), 16),
    parseInt(n.slice(2, 4), 16),
    parseInt(n.slice(4, 6), 16),
  ]
}
