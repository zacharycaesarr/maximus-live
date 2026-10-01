import { useCallback, useRef, useState, type CSSProperties } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import * as m from 'framer-motion/m'
import { MonitorIcon, ServiceCard } from '@/components/services-cards/ServiceCard'
import { SceneWeb } from '@/components/services-cards/scenes/SceneWeb'
import { tunersToCssVars, type LabTunerValues } from '@/components/services-cards/tuners/LabTuners'
import { webDetailCss, webText } from '@/components/services-cards/scenes/webDetails'
import { entrance, type WebMotionSettings } from '@/components/services-cards/scenes/webMotion'
import { useDocumentVisible } from '@/hooks/useDocumentVisible'
import '@/components/services-cards/styles/web-motion.css'

export function WebAnimatedCard({ values: t }: { values: LabTunerValues }) {
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref, { amount: .1 })
  const pageVisible = useDocumentVisible()
  const reduced = useReducedMotion()
  const [introComplete, setIntroComplete] = useState(false)
  const onIntroComplete = useCallback(() => setIntroComplete(true), [])
  const enabled = Boolean(t.webAnimationsOn) && !reduced
  const motionSettings: WebMotionSettings = {
    enabled, visible: visible && pageVisible, introComplete,
    introDuration: Number(t.webIntroDuration), introDistance: Number(t.webIntroDistance),
    introStagger: Number(t.webIntroStagger), idleBrowser: Number(t.webIdleBrowser),
    idleRail: Number(t.webIdleRail), idleAnalytics: Number(t.webIdleAnalytics),
    idleBoost: Number(t.webIdleBoost),
    idleSway: Number(t.webIdleSway),
    idleBrowserDuration: Number(t.webIdleBrowserDuration),
    idleRailDuration: Number(t.webIdleRailDuration),
    idleAnalyticsDuration: Number(t.webIdleAnalyticsDuration),
  }
  const card = <ServiceCard
    number={webText(t, 'webNumber')}
    title={webText(t, 'webTitle')}
    description={webText(t, 'webDescription')}
    cta={webText(t, 'webCta')}
    ctaHref="/capabilities/web-development"
    icon={<MonitorIcon />}
  >
    <SceneWeb values={t} motionSettings={motionSettings} />
  </ServiceCard>
  return <div className="lab-artboard__live lab-artboard__live--web" style={tunersToCssVars(t) as CSSProperties}>
    <style>{webDetailCss(t)}</style>
    {enabled ? <m.div ref={ref} className="web-card-motion" initial="hidden" whileInView="visible" variants={entrance(motionSettings.introDistance, 0, motionSettings.introDuration)} viewport={{ once: true, amount: .3 }} onAnimationComplete={definition => { if (definition === 'visible') onIntroComplete() }}>{card}</m.div> : card}
  </div>
}
