'use client'

/**
 * Homepage Services Overview cards — migrated 1:1 from services-lab.
 * LazyMotion + m kept. Leva lives in ServicesOverviewTunerProvider (dev panel only).
 */

import { useEffect, useRef, useState } from 'react'
import { LazyMotion, domAnimation } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { WebAnimatedCard } from '@/components/services-cards/scenes/WebAnimatedCard'
import { AdsAnimatedCard } from '@/components/services-cards/scenes/AdsAnimatedCard'
import { CreativeAnimatedCard } from '@/components/services-cards/scenes/CreativeAnimatedCard'
import { useServicesOverviewTuner } from '@/context/ServicesOverviewTunerContext'

import '@/components/services-cards/styles/geist-cards.css'
import '@/components/services-cards/styles/tokens.css'
import '@/components/services-cards/styles/layout.css'

export default function ServicesOverviewCards() {
  const t = useServicesOverviewTuner()
  const wrapRef = useRef<HTMLDivElement>(null)
  const [entered, setEntered] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const touchRef = useRef<{ startX: number; lastX: number; scrollLeft: number } | null>(null)
  const wheelRef = useRef<{ travel: number; scrollLeft: number } | null>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return undefined
    const observer = new IntersectionObserver(([entry]) => setEntered(entry.isIntersecting), { threshold: .18 })
    observer.observe(wrap)
    return () => observer.disconnect()
  }, [])

  const onCardScroll = () => {
    if (dismissed) return
    const scrollLeft = wrapRef.current?.querySelector('.svc-cards-row')?.scrollLeft ?? 0
    const touch = touchRef.current
    const wheel = wheelRef.current
    if ((touch && Math.abs(touch.lastX - touch.startX) >= 24 && Math.abs(scrollLeft - touch.scrollLeft) >= 20)
      || (wheel && wheel.travel >= 24 && Math.abs(scrollLeft - wheel.scrollLeft) >= 20)) setDismissed(true)
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <div ref={wrapRef} className="svc-cards-wrap">
        <div className="svc-cards-row" onScroll={onCardScroll}
          onTouchStart={event => { touchRef.current = { startX: event.touches[0].clientX, lastX: event.touches[0].clientX, scrollLeft: event.currentTarget.scrollLeft } }}
          onTouchMove={event => { if (touchRef.current) touchRef.current.lastX = event.touches[0].clientX }}
          onTouchEnd={event => {
            const touch = touchRef.current
            if (touch && Math.abs(touch.lastX - touch.startX) >= 24 && Math.abs(event.currentTarget.scrollLeft - touch.scrollLeft) >= 20) setDismissed(true)
            touchRef.current = null
          }}
          onWheel={event => {
            if (Math.abs(event.deltaX) < Math.abs(event.deltaY)) return
            const wheel = wheelRef.current ?? { travel: 0, scrollLeft: event.currentTarget.scrollLeft }
            wheel.travel += Math.abs(event.deltaX)
            wheelRef.current = wheel
          }}>
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
        <span className={`svc-swipe-hint ${entered && !dismissed ? 'is-visible' : ''}`} aria-hidden="true"><ArrowRight size={18} strokeWidth={2} /></span>
      </div>
    </LazyMotion>
  )
}
