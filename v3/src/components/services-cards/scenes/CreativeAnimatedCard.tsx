import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import { PaletteIcon, ServiceCard } from '../ServiceCard'
import { SceneCreative } from './SceneCreative'
import type { CreativeTunerValues } from '../tuners/CreativeTuners'
import type { CreativeMotionSettings } from './creativeMotion'
import { useDocumentVisible } from '@/hooks/useDocumentVisible'
import '../styles/creative-motion.css'

export function CreativeAnimatedCard({ values: t }: { values: CreativeTunerValues }) {
  const ref = useRef<HTMLDivElement>(null)
  const entered = useInView(ref, { once: true, amount: .3 })
  const visible = useInView(ref, { amount: .1 })
  const pageVisible = useDocumentVisible()
  const reduced = useReducedMotion()
  const [introComplete, setIntroComplete] = useState(false)
  const enabled = Boolean(t.creativeAnimationsOn) && !reduced
  const introDuration = Number(t.creativeIntroDuration)

  useEffect(() => {
    if (!enabled || !entered) return
    const timer = window.setTimeout(() => setIntroComplete(true), introDuration * 1000)
    return () => window.clearTimeout(timer)
  }, [enabled, entered, introDuration])

  const motion: CreativeMotionSettings = {
    enabled, entered, visible: visible && pageVisible, introComplete, introDuration,
    introStagger: Number(t.creativeIntroStagger),
    introDistance: Number(t.creativeIntroDistance),
    idleVideo: Number(t.creativeIdleVideo),
    idleSocial: Number(t.creativeIdleSocial),
    idleBrand: Number(t.creativeIdleBrand),
    idleVideoDuration: Number(t.creativeIdleVideoDuration),
    idleSocialDuration: Number(t.creativeIdleSocialDuration),
    idleBrandDuration: Number(t.creativeIdleBrandDuration),
  }

  return <div ref={ref} className="lab-artboard__live lab-artboard__live--creative">
    <ServiceCard
      number="03"
      title="Creative Studio"
      description="Brand, video, and creative that matches the ambition of your business."
      cta="Explore Creative"
      ctaHref="/capabilities/creative-studio"
      icon={<PaletteIcon />}
      creativeMotion={motion}
    >
      <SceneCreative values={t} motionSettings={motion} />
    </ServiceCard>
  </div>
}
