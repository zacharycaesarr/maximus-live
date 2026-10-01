import { PerformanceGraph } from '@/components/services-cards/parts/PerformanceGraph'
import { webText, type WebValues } from '@/components/services-cards/scenes/webDetails'
import * as m from 'framer-motion/m'
import { fade } from '@/components/services-cards/scenes/webMotion'

export function MiniAnalytics({ values = {}, animated = false, introStagger = .17 }: { values?: WebValues; animated?: boolean; introStagger?: number }) {
  return (
    <div className="panel mini-analytics" aria-hidden>
      <div className="mini-analytics__top">
        <m.span className="mini-analytics__label" variants={animated ? fade(introStagger * 2.5, .42) : undefined}>{webText(values, 'webPerformance')}</m.span>
      </div>
      <PerformanceGraph path={webText(values, 'webGraphPath')} animated={animated} introStagger={introStagger} />
      <m.span className="mini-analytics__delta" variants={animated ? fade(introStagger * 4.6, .45) : undefined}>{webText(values, 'webDelta')}</m.span>
    </div>
  )
}
