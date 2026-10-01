import { MiniAnalytics } from '@/components/services-cards/parts/MiniAnalytics'
import { MiniBrowser } from '@/components/services-cards/parts/MiniBrowser'
import { SceneGrid } from '@/components/services-cards/parts/SceneGrid'
import { ToolRail } from '@/components/services-cards/parts/ToolRail'
import type { WebValues } from '@/components/services-cards/scenes/webDetails'
import * as m from 'framer-motion/m'
import type { WebMotionSettings } from '@/components/services-cards/scenes/webMotion'
import type { ReactNode } from 'react'

function AnimatedObject({ name, children, settings }: { name: 'browser' | 'rail' | 'analytics'; children: ReactNode; settings: WebMotionSettings }) {
  const drift = { browser: settings.idleBrowser, rail: settings.idleRail, analytics: settings.idleAnalytics }[name] * settings.idleBoost
  const period = { browser: settings.idleBrowserDuration, rail: settings.idleRailDuration, analytics: settings.idleAnalyticsDuration }[name]
  const sway = drift * settings.idleSway * (name === 'rail' ? -1 : 1)
  const looping = settings.introComplete && settings.visible && drift > 0
  return <m.div
    className={`web-motion-layer web-motion-layer--${name}`}
  >
    <m.div className="web-motion-idle"
      animate={looping ? { y: [0, -drift, 0, drift * .45, 0], x: [0, sway, 0, -sway * .6, 0] } : { x: 0, y: 0 }}
      transition={looping ? { duration: period, repeat: Infinity, ease: 'easeInOut' } : { duration: .3, ease: 'easeOut' }}
    >{children}</m.div>
  </m.div>
}

export function SceneWeb({ values = {}, motionSettings }: { values?: WebValues; motionSettings?: WebMotionSettings }) {
  const animated = Boolean(motionSettings?.enabled)
  return (
    <>
      {/* Light is a 2D backdrop, never a plane intersecting the 3D objects. */}
      <SceneGrid />
      <div className="browser-ground-glow" aria-hidden />
      <div className="scene-perspective">
      <div className="scene-world">
        {animated && motionSettings ? <>
          <AnimatedObject name="browser" settings={motionSettings}><MiniBrowser values={values} animated introStagger={motionSettings.introStagger} /></AnimatedObject>
          <AnimatedObject name="rail" settings={motionSettings}><ToolRail animated introStagger={motionSettings.introStagger} /></AnimatedObject>
          <AnimatedObject name="analytics" settings={motionSettings}><MiniAnalytics values={values} animated introStagger={motionSettings.introStagger} /></AnimatedObject>
        </> : <>
          <MiniBrowser values={values} />
          <ToolRail />
          <MiniAnalytics values={values} />
        </>}
      </div>
      </div>
    </>
  )
}
