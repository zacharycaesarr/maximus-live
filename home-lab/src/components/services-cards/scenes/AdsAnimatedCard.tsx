import { useCallback, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import * as m from 'framer-motion/m'
import { MegaphoneIcon, ServiceCard } from '../ServiceCard'
import { SceneAds } from './SceneAds'
import { entrance } from './webMotion'
import type { AdsTunerValues } from '../tuners/AdsTuners'
import { useDocumentVisible } from '@/hooks/useDocumentVisible'
import '../styles/ads-motion.css'

export type AdsMotionSettings = {
  enabled: boolean
  visible: boolean
  introComplete: boolean
  introStagger: number
  idleAd: number
  idleLanding: number
  idleLead: number
  idleBoost: number
  idleSway: number
  idleLabel: number
  idleAdDuration: number
  idleLandingDuration: number
  idleLeadDuration: number
}

export function AdsAnimatedCard({ values: t }: { values: AdsTunerValues }) {
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref, { amount: .1 })
  const pageVisible = useDocumentVisible()
  const reduced = useReducedMotion()
  const [introComplete, setIntroComplete] = useState(false)
  const onIntroComplete = useCallback(() => setIntroComplete(true), [])
  const enabled = Boolean(t.adsAnimationsOn) && !reduced
  const settings: AdsMotionSettings = {
    enabled, visible: visible && pageVisible, introComplete,
    introStagger: Number(t.adsIntroStagger),
    idleAd: Number(t.adsIdleAd), idleLanding: Number(t.adsIdleLanding), idleLead: Number(t.adsIdleLead),
    idleBoost: Number(t.adsIdleBoost),
    idleSway: Number(t.adsIdleSway), idleLabel: Number(t.adsIdleLabel),
    idleAdDuration: Number(t.adsIdleAdDuration),
    idleLandingDuration: Number(t.adsIdleLandingDuration),
    idleLeadDuration: Number(t.adsIdleLeadDuration),
  }
  const card = <ServiceCard
    number="02"
    title="Ad Management"
    description={<>Ads aimed at paying leads, not vanity.<br />Strategy, creative and optimization, end-to-end.</>}
    cta="Explore Ads"
    ctaHref="/capabilities/ad-management"
    icon={<MegaphoneIcon />}
  >
    <SceneAds values={t} motionSettings={settings} />
  </ServiceCard>

  return <div className="lab-artboard__live lab-artboard__live--ads">
    {enabled
      ? <m.div ref={ref} className="ads-card-motion" initial="hidden" whileInView="visible" variants={entrance(Number(t.adsIntroDistance), 0, Number(t.adsIntroDuration))} viewport={{ once: true, amount: .3 }} onAnimationComplete={definition => { if (definition === 'visible') onIntroComplete() }}>{card}</m.div>
      : card}
  </div>
}
