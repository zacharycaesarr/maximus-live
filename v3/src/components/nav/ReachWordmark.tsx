import type { ReachTuner } from '@/lib/reachDefaults'

const REACH_LETTERS = [
  { ch: 'R', key: 'R' as const },
  { ch: 'E', key: 'E' as const },
  { ch: 'A', key: 'A' as const },
  { ch: 'C', key: 'C' as const },
  { ch: 'H', key: 'H' as const },
]

const MAXIMUS_LETTERS = [
  { ch: 'M', key: 'Ma' as const },
  { ch: 'a', key: 'Ax' as const },
  { ch: 'x', key: 'Xx' as const },
  { ch: 'i', key: 'Ii' as const },
  { ch: 'm', key: 'Mm' as const },
  { ch: 'u', key: 'Uu' as const },
  { ch: 's', key: 'Ss' as const },
]

type Props = {
  settings: ReachTuner
  className?: string
}

export default function ReachWordmark({ settings, className = '' }: Props) {
  const maximusLabel = settings.maximusText || 'Maximus'
  const fontFamily =
    settings.fontFamily === 'druk'
      ? '"Druk Condensed", "Druk", Impact, sans-serif'
      : '"Neue Haas Grotesk Display", "Helvetica Neue", Helvetica, Arial, sans-serif'
  const fontClass = settings.fontFamily === 'druk' ? 'font-druk' : 'font-nhg'

  return (
    <span
      className={`inline-flex flex-col items-start justify-center leading-none ${className}`}
      style={{ color: settings.color, gap: settings.stackGap, fontFamily }}
    >
      <span className="sr-only">Maximus Reach</span>

      {settings.showMaximus && (
        <span
          aria-hidden
          className={`inline-flex items-baseline ${fontClass}`}
          style={{
            fontFamily,
            fontSize: settings.maximusSize,
            fontWeight: settings.fontFamily === 'druk' ? 900 : settings.maximusWeight,
            letterSpacing: `${settings.maximusTracking}em`,
            lineHeight: 1,
            opacity: settings.maximusOpacity,
            textTransform: settings.fontFamily === 'druk' ? 'uppercase' : undefined,
          }}
        >
          {settings.stretchMaximus
            ? MAXIMUS_LETTERS.map((letter, i) => {
                const sx = settings[letter.key] ?? 1
                const layoutPush = Math.max(0, (sx - 1) * 0.55)
                const ch = maximusLabel[i] ?? letter.ch
                return (
                  <span
                    key={letter.key}
                    className="inline-block"
                    style={{
                      transform: `scaleX(${sx})`,
                      transformOrigin: 'left center',
                      marginRight: `${layoutPush}em`,
                    }}
                  >
                    {ch}
                  </span>
                )
              })
            : maximusLabel}
        </span>
      )}

      <span
        aria-hidden
        className={`inline-flex items-baseline uppercase ${fontClass}`}
        style={{
          fontFamily,
          fontSize: settings.fontSize,
          letterSpacing: `${settings.letterSpacingEm}em`,
          fontWeight: settings.fontFamily === 'druk' ? 900 : 500,
          lineHeight: 1,
        }}
      >
        {REACH_LETTERS.map((letter) => {
          const sx = settings.enabled ? settings[letter.key] : 1
          const layoutPush = Math.max(0, (sx - 1) * 0.55)
          return (
            <span
              key={letter.key}
              className="inline-block"
              style={{
                transform: `scaleX(${sx})`,
                transformOrigin: 'left center',
                marginRight: `${layoutPush}em`,
              }}
            >
              {letter.ch}
            </span>
          )
        })}
      </span>
    </span>
  )
}
