import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { useInView } from 'framer-motion'
import { BarChart3, Box, ChevronDown, Globe2, Megaphone, Palette, Plus, Rocket, Target, UserRound, WandSparkles } from 'lucide-react'
import WhyFloatLayer from './WhyFloatLayer'
import WhyTestimonialsVisual from './WhyTestimonialsVisual'
import { useWhyVisuals, type Position } from './WhyVisualTuner'
import './why-feature-stage.css'
import './why-premium.css'
import './why-motion-fix.css'

type Props = { active: number; reducedMotion: boolean; label: string; progress?: unknown; isActive?: boolean; testimonialsPlaying?: boolean }

// Stage instances stay mounted during the horizontal scrub. These guards also preserve
// first-visit state if the responsive desktop/mobile branch is swapped mid-session.
const revealedPanels = new Set<number>()
let chartIntroSeen = false
let appliedGraphResetToken = 0

function placed(position: Position, scale = 1): React.CSSProperties {
  return { left: `${position.x}%`, top: `${position.y}%`, transform: `translate(-50%, -50%) rotate(${position.rotation}deg) scale(${scale})` }
}

function OnePartner() {
  const { global, one } = useWhyVisuals()
  const c = one.center, curve = one.connectorCurve
  const endpoint = (position: Position, side: 'left' | 'right') => ({ x: position.x * 6 + (side === 'left' ? 95 : -95), y: position.y * 3.6 - 7 })
  const ads = endpoint(one.ads, 'left'), creative = endpoint(one.creative, 'right')
  const hubLeft = { x: c.x * 6 - 46, y: c.y * 3.6 + 58 }, hubRight = { x: c.x * 6 + 46, y: c.y * 3.6 + 58 }
  const route = (start: typeof ads, end: typeof ads) => one.connectorStyle === 'Radial'
    ? `M${start.x} ${start.y} Q${(start.x + end.x) / 2} ${Math.min(start.y, end.y) - curve} ${end.x} ${end.y}`
    : `M${start.x} ${start.y} H${end.x + Math.sign(start.x - end.x) * curve} Q${end.x} ${start.y} ${end.x} ${start.y - curve} V${end.y}`
  const paths = [
    `M${one.web.x * 6} ${one.web.y * 3.6 + 34} V${c.y * 3.6 - 59}`,
    route(ads, hubLeft), route(creative, hubRight),
  ]
  return <div className="why-art why-one" style={{ transform: `scale(${global.globalScale * one.scale})`, '--why-dot': one.dotColor, '--why-dot-inset': `${one.dotInset}%`, '--why-dot-y': `${one.dotY}%`, '--why-one-float': one.smallFloat, '--why-center-lift': `${one.centerLift}px` } as React.CSSProperties}>
    <svg className="why-one-lines" viewBox="0 0 600 360" preserveAspectRatio="none" aria-hidden="true" style={{ opacity: one.connectorOpacity, '--why-connector-width': one.connectorThickness } as React.CSSProperties}>
      {paths.map((path, index) => <g key={index}><path className="why-one-line-glow" d={path} /><path d={path} /></g>)}
    </svg>
    <div className="why-one-rings" style={{ opacity: one.ringOpacity }}><i /><i /><i /></div>
    <div className="why-placement why-placement--hub" style={placed(one.center, one.centerScale)}><WhyFloatLayer panel={0} object={3} weight={one.centerLift / 5}><div className="why-one-hub"><img src={one.logoPath} alt="Maximus Reach monogram" /><small>Maximus Reach</small></div></WhyFloatLayer></div>
    <div className="why-placement why-placement--one-card why-placement--web" style={{ ...placed(one.web), '--why-sequence': 0 } as React.CSSProperties}><WhyFloatLayer panel={0} object={0} weight={one.smallFloat}><div className="why-one-card why-one-card--web"><Globe2 /><strong>Web</strong><i /></div></WhyFloatLayer></div>
    <div className="why-placement why-placement--one-card why-placement--ads" style={{ ...placed(one.ads), '--why-sequence': 1 } as React.CSSProperties}><WhyFloatLayer panel={0} object={1} weight={one.smallFloat}><div className="why-one-card why-one-card--ads"><Megaphone /><strong>Ads</strong><i /></div></WhyFloatLayer></div>
    <div className="why-placement why-placement--one-card why-placement--creative" style={{ ...placed(one.creative), '--why-sequence': 2 } as React.CSSProperties}><WhyFloatLayer panel={0} object={2} weight={one.smallFloat}><div className="why-one-card why-one-card--creative"><Palette /><strong>Creative</strong><i /></div></WhyFloatLayer></div>
  </div>
}

const stack = [
  { key: 'goals', label: 'Your Goals', Icon: UserRound }, { key: 'audience', label: 'Your Audience', Icon: Target },
  { key: 'strategy', label: 'Your Strategy', Icon: BarChart3 }, { key: 'creative', label: 'Your Creative', Icon: Box },
] as const

function BuiltAroundYou() {
  const { global, two } = useWhyVisuals()
  return <div className="why-art why-two" style={{ transform: `scale(${global.globalScale * two.scale})`, '--why-active': two.activeColor, '--why-stack-accent': two.accentColor, '--why-stack-shadow': two.shadow, '--why-stack-tilt': `${two.tilt}deg`, '--why-stack-hover': `${two.hoverLift}px`, '--why-active-emphasis': two.activeEmphasis, '--why-icon-response': two.iconReaction } as React.CSSProperties}>
    <div className="why-two-dots" style={{ opacity: two.gridOpacity }} />
    {stack.map(({ key, label, Icon }, index) => <div key={key} className={`why-placement why-placement--stack why-placement--stack-${key}`} style={{ ...placed({ ...two[key], y: 50 + (two[key].y - 50) * two.spacing }), '--why-sequence': index } as React.CSSProperties}>
      <WhyFloatLayer panel={1} object={index} weight={key === 'strategy' ? .58 : 1}><div className={`why-stack-card why-stack-card--${key}`}><Icon /><strong>{label}</strong><span className="why-stack-plus"><Plus /></span></div></WhyFloatLayer>
    </div>)}
  </div>
}

function FlowCard({ name, number, Icon, position, weight }: { name: string; number: string; Icon: typeof Rocket; position: Position; weight: number }) {
  const index = Number(number) - 1
  return <div className="why-placement why-placement--flow" style={{ ...placed(position), '--why-sequence': index } as React.CSSProperties}><WhyFloatLayer panel={2} object={index} weight={weight}><div className="why-flow-card"><Icon /><strong>{name}</strong><span>{number}</span></div></WhyFloatLayer></div>
}

function LaunchImprove() {
  const { global, three } = useWhyVisuals()
  return <div className="why-art why-three" style={{ transform: `scale(${global.globalScale * three.scale})`, '--why-flow-float': three.cardFloat, '--why-stage-emphasis': three.stageEmphasis, '--why-route-speed': `${three.routeSpeed}s` } as React.CSSProperties}>
    <div className="why-three-grid" style={{ opacity: global.gridOpacity }} />
    <svg className="why-three-arrows" viewBox="0 0 600 360" preserveAspectRatio="none" aria-hidden="true" style={{ opacity: three.arrowOpacity, '--why-arrow-scale': three.arrowScale } as React.CSSProperties}>
      <defs><marker id="why-arrow" markerWidth={10 * three.arrowScale} markerHeight={10 * three.arrowScale} refX="7" refY="5" orient="auto"><path d="M1 1 L8 5 L1 9" /></marker></defs>
      <path d="M437 79 C500 82 545 116 529 176" markerEnd={three.showArrows ? 'url(#why-arrow)' : undefined} />
      <path d="M527 211 C549 246 510 280 457 286" markerEnd={three.showArrows ? 'url(#why-arrow)' : undefined} />
      <path className="why-three-return" d="M165 284 C112 261 98 208 113 152 C121 121 134 111 143 102" />
    </svg>
    <span className="why-three-repeat" style={{ left: `${three.repeatX}%`, top: `${three.repeatY}%`, color: three.repeatColor }}>{three.repeatLabel}</span>
    <FlowCard name="Launch" number="01" Icon={Rocket} position={three.launch} weight={three.cardFloat} />
    <FlowCard name="Measure" number="02" Icon={BarChart3} position={three.measure} weight={three.cardFloat} />
    <FlowCard name="Improve" number="03" Icon={WandSparkles} position={three.improve} weight={three.cardFloat} />
  </div>
}

function Results({ graphPhase, onGraphIntroEnd }: { graphPhase: 'idle' | 'running' | 'done'; onGraphIntroEnd: () => void }) {
  const { global, four } = useWhyVisuals()
  // Reference mockup figures. Replace with approved results before production use.
  return <div className={`why-art why-four chart-intro-${graphPhase} why-endpoint-${four.endpointStyle.toLowerCase()}`} style={{ transform: `scale(${global.globalScale})`, '--why-bar': four.barColor, '--why-line': four.lineColor, '--why-highlight': four.highlightColor, '--why-chart-shadow': four.shadow, '--why-endpoint-size': four.endpointSize, '--why-arrow-gap': `${four.arrowGap}px`, '--why-arrow-y': `${four.arrowY}px`, '--why-line-width': four.lineThickness, '--why-label-scale': four.labelSize, '--why-value-scale': four.valueSize, '--why-chart-ambient': four.ambientAmount } as React.CSSProperties}>
    <div className="why-results-layout" style={{ left: `${four.x}%`, top: `${four.y}%`, transform: `translate(-50%, -50%) scale(${four.scale})` }}>
      <div className="why-results-main-slot"><WhyFloatLayer panel={3} object={0} weight={four.ambientAmount}><div className="why-results-main">
        <div className="why-results-heading"><span>Total Revenue <i /></span><button type="button" aria-label="Example date range">Last 90 days <ChevronDown /></button></div>
        <strong className="why-results-total">$48K</strong>
        <div className="why-results-growth"><b>↑ +24%</b><span>vs previous period</span></div>
        <div className="why-results-graph"><div className="why-results-grid" style={{ opacity: four.gridOpacity }} /><div className="why-results-bars"><i /><i /><i /><i /><i /></div><svg viewBox="0 0 500 150" preserveAspectRatio="none" aria-hidden="true"><path d="M0 130 C75 130 95 106 157 106 S250 113 305 84 S400 44 500 31" onAnimationEnd={onGraphIntroEnd} /><circle cx="500" cy="31" r={four.endpointSize} /></svg></div>
      </div></WhyFloatLayer></div>
      <div className="why-results-metrics-slot" style={{ transform: `scale(${four.metricScale})` }}><WhyFloatLayer panel={3} object={1} weight={four.ambientAmount * .67}><div className="why-results-metrics"><div><span>ROAS</span><strong>4.2x <b>↑</b></strong></div><div><span>CPA</span><strong>$18 <b>↑</b></strong></div><div><span>Conversions</span><strong>1,260 <b>↑</b></strong></div></div></WhyFloatLayer></div>
    </div>
  </div>
}

export default function WhyFeatureStage({ active, reducedMotion, label, isActive = false, testimonialsPlaying = false }: Props) {
  const stageRef = useRef<HTMLDivElement>(null)
  const pressedRef = useRef<HTMLElement | null>(null)
  const pauseTimer = useRef<number | null>(null)
  const [interacting, setInteracting] = useState(false)
  const [tabVisible, setTabVisible] = useState(() => !document.hidden)
  const inView = useInView(stageRef, { amount: .25 })
  const { global, motion, floating, four, five } = useWhyVisuals()
  const relevant = isActive && inView && tabVisible
  const [introRunning, setIntroRunning] = useState(false)
  const [graphPhase, setGraphPhase] = useState<'idle' | 'running' | 'done'>(() => chartIntroSeen ? 'done' : 'idle')
  useEffect(() => {
    const onVisibility = () => setTabVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])
  useEffect(() => {
    if (four.graphResetToken === appliedGraphResetToken) return
    appliedGraphResetToken = four.graphResetToken
    chartIntroSeen = false
    revealedPanels.delete(3)
    if (active === 3) { setGraphPhase('idle'); setIntroRunning(false) }
  }, [active, four.graphResetToken])
  useEffect(() => {
    if (revealedPanels.has(active) || !relevant || introRunning) return
    if (motion.enabled && motion.introEnabled && !reducedMotion) setIntroRunning(true)
    else revealedPanels.add(active)
  }, [active, relevant, introRunning, motion.enabled, motion.introEnabled, reducedMotion])
  useEffect(() => {
    if (active !== 3 || graphPhase !== 'idle') return
    if (chartIntroSeen || !motion.enabled || reducedMotion || !motion.introEnabled) { chartIntroSeen = true; setGraphPhase('done') }
    else if (relevant) { chartIntroSeen = true; setGraphPhase('running') }
  }, [active, relevant, graphPhase, motion.enabled, motion.introEnabled, reducedMotion])
  useEffect(() => () => {
    if (pauseTimer.current !== null) window.clearTimeout(pauseTimer.current)
    pressedRef.current?.removeAttribute('data-pressed')
  }, [])
  const reactToPress = (event: PointerEvent<HTMLDivElement>) => {
    if (!motion.enabled || reducedMotion) return
    if (pauseTimer.current !== null) window.clearTimeout(pauseTimer.current)
    pressedRef.current?.removeAttribute('data-pressed')
    const target = (event.target as Element).closest<HTMLElement>('.why-one-card,.why-one-hub,.why-stack-card,.why-flow-card,.why-results-main,.why-results-metrics,.why-testimonial-card')
    pressedRef.current = target
    target?.setAttribute('data-pressed', 'true')
    setInteracting(true)
    pauseTimer.current = window.setTimeout(() => {
      pressedRef.current?.removeAttribute('data-pressed')
      pressedRef.current = null
      setInteracting(false)
      pauseTimer.current = null
    }, motion.interactionPause * 1000)
  }
  const style = {
    '--why-stage': global.stageBackground, '--why-surface': global.elevatedSurface, '--why-ink': global.ink,
    '--why-muted': global.mutedInk, '--why-sage': global.sage, '--why-acid': global.acid,
    '--why-border': global.borderColor, '--why-border-opacity': `${global.borderOpacity}%`,
    '--why-shadow-opacity': global.shadowOpacity / 100, '--why-shadow-blur': `${global.shadowBlur}px`,
    '--why-shadow-y': `${global.shadowY}px`, '--why-shadow-depth': motion.shadowDepth, '--why-stage-radius': `${global.stageRadius}px`,
    '--why-card-radius': `${global.cardRadius}px`,
    '--why-intro-duration': `${motion.introDuration}s`, '--why-ambient-duration': `${motion.ambientDuration}s`,
    '--why-motion-intensity': motion.intensity, '--why-carousel-transition': `${motion.carouselTransition}s`,
    '--why-intro-stagger': `${motion.introStagger}s`, '--why-hover-response': motion.hoverResponse,
    '--why-tilt': `${motion.tiltAmount}deg`,
    '--why-orbit-scale': 1 + .025 * motion.intensity, '--why-accent-scale': 1 + .055 * motion.intensity,
    '--why-point-scale': 1 + .18 * motion.intensity, '--why-bar-scale': 1 + .025 * motion.intensity,
    '--why-float': `${motion.floatAmount * motion.intensity}px`, '--why-stack-float': `${motion.floatAmount * .7 * motion.intensity}px`,
    '--why-float-neg': `${-motion.floatAmount * motion.intensity}px`, '--why-stack-float-neg': `${-motion.floatAmount * .7 * motion.intensity}px`,
    '--why-carousel-fade': `${motion.carouselTransition * .65}s`,
    '--why-stack-duration': `${motion.ambientDuration * 1.1}s`, '--why-accent-duration': `${motion.ambientDuration * .75}s`,
    '--why-point-duration': `${motion.ambientDuration * .8}s`, '--why-draw-duration': `${motion.introDuration * 1.4}s`,
    '--why-metrics-delay': `${motion.introDuration * .18}s`, '--why-route-delay-one': `${-motion.ambientDuration / 3}s`,
    '--why-route-delay-two': `${-motion.ambientDuration * 2 / 3}s`,
  } as React.CSSProperties
  const ambientConfigured = motion.enabled && motion.ambientEnabled && !reducedMotion
  const ambientRunning = ambientConfigured && relevant
  const floatConfigured = ambientConfigured && floating.enabled
  const introPending = !revealedPanels.has(active) && !introRunning && motion.enabled && motion.introEnabled && !reducedMotion
  return <div ref={stageRef} className={`mr-feature-stage mr-feature-stage--${active}${introPending ? ' is-intro-pending' : ''}${introRunning ? ' is-intro-active' : ''}${ambientConfigured ? ' is-ambient-active' : ''}${ambientRunning ? ' is-ambient-running' : ''}${floatConfigured ? ' has-float-motion' : ''}${floatConfigured && relevant ? ' is-float-running' : ''}${interacting ? ' is-interacting' : ''}`} role="group" aria-label={`Illustration: ${label}`} style={style} onPointerDown={reactToPress} onAnimationEnd={event => { if (event.animationName === 'why-premium-scene' && introRunning) { revealedPanels.add(active); setIntroRunning(false) } }}>
    {active === 0 && <OnePartner />}{active === 1 && <BuiltAroundYou />}{active === 2 && <LaunchImprove />}
    {active === 3 && <Results graphPhase={graphPhase} onGraphIntroEnd={() => setGraphPhase('done')} />}{active === 4 && <WhyTestimonialsVisual playing={testimonialsPlaying && inView && !reducedMotion && motion.enabled && five.autoplay && (!five.pauseOnInteraction || !interacting)} />}
  </div>
}
