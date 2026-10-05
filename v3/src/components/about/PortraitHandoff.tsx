import { useId, type CSSProperties } from 'react'
import { m, useTransform, type MotionValue } from 'framer-motion'
import { portraitPanel, type AboutStageSize } from './aboutLayout'

const ease = (v: number) => v * v * (3 - 2 * v)

/** Section 2 stays in the same pinned stage; the preceding cards become its lower rail. */
export default function PortraitHandoff({ progress, size, reduced }: { progress: MotionValue<number>; size: AboutStageSize; reduced: boolean }) {
  const { mobile } = size
  const panel = portraitPanel(size)
  const featherId = `${useId().replace(/:/g, '')}-portrait-feather`
  const typeMaskId = `${featherId}-type`
  const frontAlphaId = `${typeMaskId}-silhouette`
  const panelOpacity = useTransform(progress, [.62, .8], [0, 1], { ease })
  const portraitOpacity = useTransform(progress, [.64, .76, .92], [0, mobile ? .3 : .68, 1], { ease })
  const portraitY = useTransform(progress, [.64, .92], [mobile ? 65 : 150, 0], { ease })
  const portraitScale = useTransform(progress, [.64, .92], [1.08, 1], { ease })
  const shadowOpacity = useTransform(progress, [.64, .92], [1, mobile ? .12 : .08], { ease })
  const titleOpacity = useTransform(progress, mobile ? [.63, .73, .84, .94] : [.66, .82], mobile ? [0, .14, .40, .68] : [0, 1], { ease })
  const frontOpacity = useTransform(progress, [.80, .92], [0, 1], { ease })
  const titleY = useTransform(progress, [.66, .94], [mobile ? 28 : -100, mobile ? -16 : 0], { ease })
  const titleScale = useTransform(progress, [.73, .94], [1, mobile ? .92 : 1], { ease })
  const maskX = useTransform(portraitScale, scale => (.475 - .60 * scale + .04) / 1.08 * 1600)
  const maskY = useTransform([portraitY, portraitScale, titleY], ([rise, scale, titleOffset]) =>
    (-.01 * panel.height + Number(rise) + (1 - Number(scale)) * panel.width * 1.20 * 1402 / 1122 / 2 - Number(titleOffset)) / (panel.width * 1.08) * 1600)
  const maskWidth = useTransform(portraitScale, scale => 1.20 / 1.08 * 1600 * scale)
  const maskHeight = useTransform(maskWidth, width => width * 1402 / 1122)
  const letters = <><text x="0" y="300" textLength="1000" lengthAdjust="spacingAndGlyphs" fontSize="430">MAXIMUS</text><text x="0" y="650" textLength="1000" lengthAdjust="spacingAndGlyphs" fontSize="500">REACH</text></>
  // Whole R/E and C/H shapes weave in front, only within the portrait silhouette.
  // The previous x=560 cut bisected E's arms; 635 clears the entire E before A begins.
  const frontRegions = mobile
    ? <><rect width="300" height="660" /><rect x="700" width="300" height="660" /></>
    : <><rect x="75" y="450" width="560" height="460" /><rect x="970" y="450" width="560" height="460" /></>
  const type = (front: boolean) => mobile
    ? <svg viewBox="0 0 1000 660" preserveAspectRatio="none" focusable="false"><g clipPath={front ? `url(#${typeMaskId})` : undefined}>{letters}</g></svg>
    : <svg viewBox="0 0 1600 910" preserveAspectRatio="xMidYMid meet" focusable="false"><g mask={front ? `url(#${frontAlphaId})` : undefined} clipPath={front ? `url(#${typeMaskId})` : undefined}><image href="/about/maximus-reach-title.svg" width="1600" height="910" /></g></svg>
  const panelStyle = mobile ? undefined : { top: panel.top, left: panel.left, width: panel.width, height: panel.height, '--ab-portrait-width': `${panel.width * 1.20}px`, '--ab-portrait-height': `${panel.width * 1.20 * 1402 / 1122}px` } as CSSProperties
  return (
    <section id="about-portrait" className={`ab-portrait-scene ${mobile ? 'ab-black-room' : 'ab-portrait-behind-type'}`} aria-labelledby="about-portrait-title" style={{ '--ab-portrait-feather': `url(#${featherId})` } as CSSProperties}>
      <svg className="ab-portrait-filters" width="0" height="0" aria-hidden="true" focusable="false"><defs>
        <clipPath id={typeMaskId} clipPathUnits="userSpaceOnUse">{frontRegions}</clipPath>
        {!mobile && <mask id={frontAlphaId} maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="910" style={{ maskType: 'alpha' }}>
          {/* Map the unchanged portrait placement into the title artwork's coordinates. */}
          <m.image href="/about/zcme-transbg-v2.png" x={reduced ? (-.125 + .04) / 1.08 * 1600 : maskX} y={reduced ? -.01 * panel.height / (panel.width * 1.08) * 1600 : maskY} width={reduced ? 1.20 / 1.08 * 1600 : maskWidth} height={reduced ? 1.20 / 1.08 * 1600 * 1402 / 1122 : maskHeight} />
        </mask>}
        <filter id={featherId} x="-1%" y="-1%" width="102%" height="102%" colorInterpolationFilters="sRGB">
          {/* Feather only the native alpha edge, preserving the face and hair detail. */}
          <feMorphology in="SourceAlpha" operator="erode" radius=".55" result="inset" />
          <feGaussianBlur in="inset" stdDeviation=".45" result="soft-edge" />
          <feComposite in="SourceGraphic" in2="soft-edge" operator="in" />
        </filter>
      </defs></svg>
      <div className="ab-portrait-panel" style={panelStyle}>
      {!mobile && <m.div className="ab-portrait-frame" style={reduced ? {} : { opacity: panelOpacity }} aria-hidden="true" />}
      <m.div className="ab-portrait-type ab-type-back" style={reduced ? { opacity: mobile ? .68 : 1 } : { opacity: titleOpacity, y: titleY, scale: titleScale }} aria-hidden="true">{type(false)}</m.div>
      <m.div className="ab-portrait-rise" style={reduced ? {} : { opacity: portraitOpacity, y: portraitY, scale: portraitScale }}>
        <div className="ab-portrait-photo">
          <img className="ab-portrait-source" src={mobile ? '/about/mobile-portrait.png' : '/about/zcme-transbg-v2.png'} width={mobile ? 941 : 1122} height={mobile ? 1672 : 1402} alt="Zachary, founder of Maximus Reach" decoding="async" />
          <div className="ab-portrait-atmosphere" aria-hidden="true" />
          <m.div className="ab-portrait-darkness" style={reduced ? { opacity: mobile ? .12 : .08 } : { opacity: shadowOpacity }} aria-hidden="true" />
        </div>
      </m.div>
      {!mobile && <m.div className="ab-portrait-type ab-type-front" style={reduced ? { opacity: 1 } : { opacity: frontOpacity, y: titleY, scale: titleScale }} aria-hidden="true">{type(true)}</m.div>}
      </div>
      <h2 id="about-portrait-title" className="ab-sr-only">MAXIMUS REACH</h2>
    </section>
  )
}
