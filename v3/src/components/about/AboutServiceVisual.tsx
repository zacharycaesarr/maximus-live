import AboutDisciplineIcon, { type AboutDisciplineKind } from './AboutDisciplineIcon'

/** Original peripheral placeholders, not finished service graphics or copied card artwork. */
export default function AboutServiceVisual({ kind }: { kind: AboutDisciplineKind }) {
  return (
    <div className={`about-service-visual about-service-visual--${kind}`} aria-hidden="true">
      <AboutDisciplineIcon kind={kind} className="about-service-visual__icon" />
      <svg className="about-service-visual__left" viewBox="0 0 300 260" fill="none">
        {kind === 'web' && <>
          <rect x="32" y="30" width="232" height="175" rx="3" /><path d="M32 54H264M42 41H66M55 95L43 107L55 119M78 95L90 107L78 119M70 89L62 125" />
          <path d="M108 88H245M108 104H224M108 120H237" opacity=".45" /><rect x="48" y="148" width="86" height="40" /><rect x="144" y="148" width="102" height="40" />
          <path d="M199 172L207 209L217 198L232 194Z" fill="var(--ab-green)" />
        </>}
        {kind === 'ads' && <>
          <rect x="24" y="41" width="69" height="62" /><path d="M34 56H80M34 66H68" opacity=".5" />
          <rect x="118" y="95" width="78" height="80" /><path d="M130 111H184M130 123H173M130 157H184" opacity=".5" />
          <path d="M59 103V135H118M196 135H251V189" /><circle cx="251" cy="199" r="10" />
          <circle cx="59" cy="135" r="3" fill="var(--ab-acid)" stroke="none" />
          <g className="about-service-visual__labels" stroke="none" fill="currentColor"><text x="24" y="29">AD</text><text x="118" y="84">LANDING PAGE</text><text x="233" y="224">LEAD</text></g>
        </>}
        {kind === 'creative' && <>
          <path d="M39 69H95L112 51H180L197 69H244V179H39Z" /><circle cx="143" cy="122" r="37" /><circle cx="143" cy="122" r="25" opacity=".5" />
          <path d="M225 195H285M225 206H273M225 217H261" /><rect x="216" y="185" width="72" height="45" />
          <path d="M50 205H177M60 198V212M75 192V218M90 200V210M105 188V222M120 195V215M135 200V210M150 196V214M165 200V210" opacity=".6" />
        </>}
      </svg>
      <svg className="about-service-visual__right" viewBox="0 0 240 240" fill="none">
        {kind === 'web' && <><path d="M34 28V211M90 28V211M146 28V211M202 28V211M18 63H218M18 120H218M18 177H218" opacity=".35" /><rect x="90" y="63" width="112" height="114" /><path d="M113 100H179M113 116H158M113 145H180" /><circle cx="202" cy="63" r="3" fill="var(--ab-acid)" stroke="none" /></>}
        {kind === 'ads' && <><path d="M26 40V196H220M34 175L73 158L100 163L138 106L165 121L201 67" /><circle cx="138" cy="106" r="3" fill="var(--ab-acid)" stroke="none" /><path d="M34 66H99M34 82H78M34 98H89" opacity=".45" /></>}
        {kind === 'creative' && <><rect x="34" y="30" width="144" height="174" /><path d="M34 53H178M51 185H113" /><rect x="48" y="70" width="117" height="92" /><path d="M94 96L123 117L94 139Z" /><path d="M190 85V175M180 94H210M180 117H205M180 140H210M180 163H205" opacity=".5" /><circle cx="195" cy="94" r="3" fill="var(--ab-acid)" stroke="none" /></>}
      </svg>
    </div>
  )
}
