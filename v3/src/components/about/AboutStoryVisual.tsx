type Kind = 'iteration' | 'tools' | 'connection'

/** Original lightweight placeholder studies, intentionally independent of final graphics. */
export default function AboutStoryVisual({ kind }: { kind: Kind }) {
  return (
    <svg className={`about-story-visual about-story-visual--${kind}`} viewBox="0 0 320 280" fill="none" aria-hidden="true">
      {kind === 'iteration' && <>
        {[0, 1, 2].map(i => <g data-paper={i} key={i}><path d="M65 47H213L238 72V225H65Z" stroke="currentColor" /><path d="M213 47V72H238" stroke="currentColor" /></g>)}
        <path d="M150 120V146M137 133H163" stroke="var(--ab-acid)" strokeWidth="2" /><circle cx="150" cy="133" r="3" fill="var(--ab-black)" />
      </>}
      {kind === 'tools' && <>
        <rect x="40" y="46" width="240" height="170" rx="2" stroke="currentColor" /><path d="M40 73H280M60 168H260M60 195H260" stroke="currentColor" />
        <circle cx="54" cy="60" r="2" fill="var(--ab-acid)" /><circle cx="64" cy="60" r="2" fill="currentColor" opacity=".3" />
        <path d="M72 112L60 124L72 136M98 112L110 124L98 136M89 106L81 142" stroke="currentColor" />
        <path d="M125 109H249M125 124H223M125 139H238M66 178V184M87 178V184M108 178V184M129 178V184M150 178V184M171 178V184M192 178V184M213 178V184M234 178V184M255 178V184" stroke="currentColor" opacity=".35" />
        <g data-playhead><path d="M64 158V201" stroke="var(--ab-acid)" strokeWidth="1.5" /><path d="M59 153H69L64 158Z" fill="var(--ab-black)" /></g>
      </>}
      {kind === 'connection' && <>
        <g stroke="currentColor"><path data-connect-path d="M50 65C120 65 100 140 164 140" /><path data-connect-path d="M44 140H164" /><path data-connect-path d="M50 214C120 214 100 140 164 140" /><circle cx="44" cy="65" r="6" /><circle cx="38" cy="140" r="6" /><circle cx="44" cy="214" r="6" /><circle cx="190" cy="140" r="27" /></g>
        <g className="about-story-visual__labels" fill="currentColor"><text x="64" y="48">WEB</text><text x="58" y="123">CREATIVE</text><text x="64" y="237">ADS</text><text x="180" y="144">MR</text></g>
        <circle data-connect-point cx="190" cy="140" r="3" fill="var(--ab-acid)" />
      </>}
    </svg>
  )
}
