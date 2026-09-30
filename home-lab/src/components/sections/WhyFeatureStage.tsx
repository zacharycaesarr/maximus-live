import { useEffect, useRef } from 'react'
import { animate, motion, useInView, useMotionValue, useMotionValueEvent, useTransform, type MotionValue } from 'framer-motion'
import { ArrowUpRight, Check, Globe2, Megaphone, Palette, Sparkles } from 'lucide-react'
import WhyTestimonialsVisual from './WhyTestimonialsVisual'
import './why-feature-stage.css'

type Props = {
  active: number
  reducedMotion: boolean
  label: string
  progress?: MotionValue<number>
  isActive?: boolean
  testimonialsPlaying?: boolean
}

function PartnerModule({ progress, name, Icon, fromX, fromY, delay }: {
  progress: MotionValue<number>; name: string; Icon: typeof Globe2; fromX: number; fromY: number; delay: number
}) {
  const opacity = useTransform(progress, [delay, delay + .25], [.58, 1])
  const x = useTransform(progress, [delay, .9], [fromX, 0])
  const y = useTransform(progress, [delay, .9], [fromY, 0])
  const rotate = useTransform(progress, [delay, .9], [fromX < 0 ? -7 : 7, 0])
  return <motion.div className={`mr-partner-module mr-partner-module--${name.toLowerCase()}`} style={{ opacity, x, y, rotate }}>
    <span><Icon size={21} strokeWidth={1.7} /></span><b>{name}</b><i />
  </motion.div>
}

function PartnerVisual({ progress }: { progress: MotionValue<number> }) {
  const hubOpacity = useTransform(progress, [.36, .72], [0, 1])
  const hubScale = useTransform(progress, [.36, .85], [.72, 1])
  const lines = useTransform(progress, [.58, 1], [0, 1])
  const status = useTransform(progress, [.7, 1], [0, 1])
  return <div className="mr-partner-scene">
    <motion.svg className="mr-partner-lines" viewBox="0 0 800 320" preserveAspectRatio="none" aria-hidden="true">
      <motion.path d="M244 100 C310 100 320 165 400 165" style={{ pathLength: lines }} />
      <motion.path d="M556 100 C490 100 480 165 400 165" style={{ pathLength: lines }} />
      <motion.path d="M400 257 C400 225 400 205 400 165" style={{ pathLength: lines }} />
    </motion.svg>
    <PartnerModule progress={progress} name="Web" Icon={Globe2} fromX={-55} fromY={-28} delay={0} />
    <PartnerModule progress={progress} name="Ads" Icon={Megaphone} fromX={55} fromY={-30} delay={.08} />
    <PartnerModule progress={progress} name="Creative" Icon={Palette} fromX={0} fromY={48} delay={.16} />
    <motion.div className="mr-partner-hub" style={{ opacity: hubOpacity, scale: hubScale }}><strong>MR</strong><small>ONE SYSTEM</small></motion.div>
    <motion.span className="mr-partner-status" style={{ opacity: status }}>Everything connected <i /></motion.span>
  </div>
}

const tailorTiles = [
  { name: 'Strategy', start: [25, 19], end: [11, 13], size: [23, 28], rotate: -5 },
  { name: 'Identity', start: [52, 19], end: [58, 12], size: [23, 20], rotate: 5 },
  { name: 'Reach', start: [25, 53], end: [23, 57], size: [18, 22], rotate: 3 },
  { name: 'Systems', start: [52, 53], end: [48, 47], size: [35, 34], rotate: -3 },
] as const

function TailorTile({ progress, tile, index }: { progress: MotionValue<number>; tile: typeof tailorTiles[number]; index: number }) {
  const left = useTransform(progress, [.13, .88], [`${tile.start[0]}%`, `${tile.end[0]}%`])
  const top = useTransform(progress, [.13, .88], [`${tile.start[1]}%`, `${tile.end[1]}%`])
  const width = useTransform(progress, [.13, .88], ['23%', `${tile.size[0]}%`])
  const height = useTransform(progress, [.13, .88], ['28%', `${tile.size[1]}%`])
  const rotate = useTransform(progress, [.2, .9], [0, tile.rotate])
  const opacity = useTransform(progress, [index * .045, .25 + index * .045], [.62, 1])
  return <motion.div className={`mr-tailor-tile mr-tailor-tile--${index}`} style={{ left, top, width, height, rotate, opacity }}>
    <span className="mr-tailor-glyph">{index === 0 ? '✳' : index === 1 ? '◯' : index === 2 ? '↗' : '⌁'}</span>
    <small>{tile.name}</small>
  </motion.div>
}

function TailoredVisual({ progress }: { progress: MotionValue<number> }) {
  const rule = useTransform(progress, [.55, 1], [0, 1])
  return <div className="mr-tailor-scene">
    <span className="mr-tailor-guide mr-tailor-guide--one" /><span className="mr-tailor-guide mr-tailor-guide--two" />
    {tailorTiles.map((tile, index) => <TailorTile key={tile.name} progress={progress} tile={tile} index={index} />)}
    <motion.span className="mr-tailor-rule" style={{ scaleX: rule }} />
    <span className="mr-tailor-caption">FORM FOLLOWS YOUR BUSINESS</span>
  </div>
}

function LaunchVisual({ progress }: { progress: MotionValue<number> }) {
  const arrowOpacity = useTransform(progress, [0, .2], [0, 1])
  const arrowY = useTransform(progress, [0, .35], [44, 0])
  const arrowScale = useTransform(progress, [0, .35], [.75, 1])
  const rippleScale = useTransform(progress, [.24, .58], [.65, 1.3])
  const rippleOpacity = useTransform(progress, [.2, .36, .58], [0, .45, 0])
  const timelineOpacity = useTransform(progress, [.45, .72], [0, 1])
  const timelineY = useTransform(progress, [.45, .72], [28, 0])
  const progressWidth = useTransform(progress, [.5, 1], ['0%', '100%'])
  const refineX = useTransform(progress, [.68, 1], [0, 66])
  return <div className="mr-launch-scene">
    <motion.span className="mr-launch-ripple" style={{ scale: rippleScale, opacity: rippleOpacity }} />
    <motion.div className="mr-launch-core" style={{ opacity: arrowOpacity, y: arrowY, scale: arrowScale }}>
      <ArrowUpRight size={51} strokeWidth={1.45} /><span><Check size={16} strokeWidth={2} /></span>
    </motion.div>
    <motion.div className="mr-launch-timeline" style={{ opacity: timelineOpacity, y: timelineY }}>
      <div className="mr-launch-track"><motion.i style={{ width: progressWidth }} /><motion.b style={{ x: refineX }} /></div>
      <div className="mr-launch-steps"><span>LAUNCH</span><span>OBSERVE</span><span>REFINE</span></div>
    </motion.div>
    <span className="mr-launch-note">A launch is a starting point.</span>
  </div>
}

function CountNumber({ progress, target, suffix = '' }: { progress: MotionValue<number>; target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const format = (value: number) => `${Math.round(target * Math.max(0, Math.min(1, (value - .12) / .68)))}${suffix}`
  useMotionValueEvent(progress, 'change', value => { if (ref.current) ref.current.textContent = format(value) })
  useEffect(() => { if (ref.current) ref.current.textContent = format(progress.get()) }, [progress])
  return <span ref={ref}>0{suffix}</span>
}

function ResultsVisual({ progress }: { progress: MotionValue<number> }) {
  const metricOpacity = useTransform(progress, [0, .24], [0, 1])
  const metricY = useTransform(progress, [0, .3], [20, 0])
  const chartOpacity = useTransform(progress, [.2, .48], [0, 1])
  const barOne = useTransform(progress, [.24, .72], ['5%', '42%'])
  const barTwo = useTransform(progress, [.24, .78], ['5%', '59%'])
  const barThree = useTransform(progress, [.24, .84], ['5%', '73%'])
  const barFour = useTransform(progress, [.24, .9], ['5%', '88%'])
  const line = useTransform(progress, [.5, .96], [0, 1])
  const outcome = useTransform(progress, [.78, 1], [0, 1])
  return <div className="mr-results-scene">
    <motion.div className="mr-results-primary" style={{ opacity: metricOpacity, y: metricY }}><small>LEADS · EXAMPLE VIEW</small><strong><CountNumber progress={progress} target={48} /></strong><span>Clear movement. Clear meaning.</span></motion.div>
    <motion.div className="mr-results-chart" style={{ opacity: chartOpacity }}>
      <div className="mr-results-grid"><i /><i /><i /></div>
      {[barOne, barTwo, barThree, barFour].map((height, index) => <motion.span key={index} className={`mr-results-bar mr-results-bar--${index}`} style={{ height }} />)}
      <svg viewBox="0 0 350 160" preserveAspectRatio="none" aria-hidden="true"><motion.path d="M8 136 C70 134 82 110 133 115 S210 98 248 66 S306 68 340 20" style={{ pathLength: line }} /><motion.circle cx="340" cy="20" r="5" style={{ opacity: outcome }} /></svg>
    </motion.div>
    <motion.span className="mr-results-outcome" style={{ opacity: outcome }}><Sparkles size={13} /> A clearer next move</motion.span>
  </div>
}

export default function WhyFeatureStage({ active, reducedMotion, label, progress, isActive = false, testimonialsPlaying = false }: Props) {
  const stageRef = useRef<HTMLDivElement>(null)
  const inView = useInView(stageRef, { amount: .35 })
  const localProgress = useMotionValue(reducedMotion ? 1 : 0)
  useEffect(() => {
    if (progress) return undefined
    if (reducedMotion) { localProgress.set(1); return undefined }
    const controls = animate(localProgress, isActive && inView ? 1 : 0, { duration: 1.05, ease: [.22, 1, .36, 1] })
    return () => controls.stop()
  }, [progress, reducedMotion, localProgress, isActive, inView])
  const amount = progress ?? localProgress
  return <div ref={stageRef} className={`mr-feature-stage mr-feature-stage--${active}`} role="group" aria-label={`Illustration: ${label}`}>
    <div className="mr-feature-frame">
      <div className="mr-feature-topbar"><span className="mr-feature-brand">MR</span><span>MAXIMUS / REACH</span><i /></div>
      <div className="mr-feature-workspace">
        {active === 0 && <PartnerVisual progress={amount} />}
        {active === 1 && <TailoredVisual progress={amount} />}
        {active === 2 && <LaunchVisual progress={amount} />}
        {active === 3 && <ResultsVisual progress={amount} />}
        {active === 4 && <WhyTestimonialsVisual playing={testimonialsPlaying && !reducedMotion} />}
      </div>
      <div className="mr-feature-bottom"><span>0{active + 1} / 05</span><span>{label}</span><div>{Array.from({ length: 5 }, (_, index) => <i key={index} className={index === active ? 'is-active' : ''} />)}</div></div>
    </div>
  </div>
}
