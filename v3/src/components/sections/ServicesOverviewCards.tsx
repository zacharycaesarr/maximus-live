'use client'

/**
 * Homepage Services Overview cards — migrated 1:1 from services-lab.
 * LazyMotion + m kept. Leva lives in ServicesOverviewTunerProvider (dev panel only).
 */

import { LazyMotion, domAnimation } from 'framer-motion'
import { WebAnimatedCard } from '@/components/services-cards/scenes/WebAnimatedCard'
import { AdsAnimatedCard } from '@/components/services-cards/scenes/AdsAnimatedCard'
import { CreativeAnimatedCard } from '@/components/services-cards/scenes/CreativeAnimatedCard'
import { useServicesOverviewTuner } from '@/context/ServicesOverviewTunerContext'

import '@/components/services-cards/styles/geist-cards.css'
import '@/components/services-cards/styles/tokens.css'
import '@/components/services-cards/styles/layout.css'

export default function ServicesOverviewCards() {
  const t = useServicesOverviewTuner()

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="svc-cards-row">
        <div className="svc-card-slot">
          <WebAnimatedCard key={t.webReplayKey} values={t.web} />
        </div>
        <div className="svc-card-slot">
          <AdsAnimatedCard key={t.adsReplayKey} values={t.ads} />
        </div>
        <div className="svc-card-slot">
          <CreativeAnimatedCard key={t.creativeReplayKey} values={t.creative} />
        </div>
      </div>
    </LazyMotion>
  )
}
