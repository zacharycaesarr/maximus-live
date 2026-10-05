import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type RefObject } from 'react'
import { m, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import PortraitHandoff from './PortraitHandoff'
import PortraitDisciplineMarks from './PortraitDisciplineMarks'
import type { SignalSettings } from './signalSettings'
import { aboutBrand } from './aboutBrand'
import { getAboutMetrics, type AboutMetric } from './aboutMetrics'
import { metricLayout, portraitPanel, type AboutStageSize } from './aboutLayout'

const ease = (v: number) => v * v * (3 - 2 * v)
type StageSize = AboutStageSize

function useStageSize(ref: RefObject<HTMLDivElement>) {
  const [size, setSize] = useState<StageSize>(() => ({ width: window.innerWidth, height: window.innerHeight, mobile: window.innerWidth < 768 }))
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      const width = el.clientWidth, height = Math.min(el.clientHeight, window.innerHeight)
      setSize(old => old.width === width && old.height === height ? old : { width, height, mobile: width < 768 })
    }
    const observer = new ResizeObserver(measure)
    observer.observe(el); measure()
    return () => observer.disconnect()
  }, [ref])
  return size
}

function NarrativeHeadline({ progress, size, reduced, settings }: { progress: MotionValue<number>; size: StageSize; reduced: boolean; settings: SignalSettings }) {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const [widths, setWidths] = useState([0, 0, 0])
  useLayoutEffect(() => {
    const title = titleRef.current
    if (!title) return
    let disposed = false
    const measure = () => {
      if (disposed) return
      const next = Array.from(title.querySelectorAll<HTMLElement>('.ab-line-position'), el => el.offsetWidth)
      setWidths(old => next.every((value, i) => value === old[i]) ? old : next)
    }
    const observer = new ResizeObserver(measure)
    observer.observe(title); title.querySelectorAll('.ab-line-position').forEach(el => observer.observe(el))
    document.fonts.ready.then(measure)
    measure()
    return () => { disposed = true; observer.disconnect() }
  }, [])
  const mobile = size.mobile
  const fontSize = (mobile ? size.width * .138 : Math.min(164, Math.max(72, Math.min(size.width * .094, size.height * .16)))) * settings.typeScale
  const lineHeight = fontSize * (mobile ? 1.05 : .99)
  const gap = fontSize * .22
  const wideScale = mobile ? 1.45 : settings.horizontalScale
  const rowWidth = widths.reduce((a, b) => a + b, 0) + 2 * gap
  const x = useTransform(progress, [0, .085, .18, .54], [0, 0, -size.width * .05, -(rowWidth * wideScale + size.width * .24)])
  const scale = useTransform(progress, [0, .085, .18], [1, 1, wideScale], { ease })
  const y = useTransform(progress, [0, .085, .18], [0, 0, size.height * .43 - (size.height * .5 - lineHeight * 1.44)], { ease })
  const opacity = useTransform(progress, [.20, .37, .5, .55], [1, .78, .54, 0])
  const line2X = useTransform(progress, [.085, .18], [0, widths[0] + gap], { ease })
  const line3X = useTransform(progress, [.085, .18], [0, widths[0] + widths[1] + gap * 2], { ease })
  const line2Y = useTransform(progress, [.085, .18], [lineHeight, 0], { ease })
  const line3Y = useTransform(progress, [.085, .18], [lineHeight * 2, 0], { ease })
  const lineMotion = [{}, { x: line2X, y: line2Y }, { x: line3X, y: line3Y }]
  const lines = ['Built while', 'the world was', 'sleeping.']
  return (
    <m.h1 ref={titleRef} className="ab-headline" aria-label="Built while the world was sleeping." style={{ fontSize, '--ab-title-leading': `${lineHeight}px`, ...(reduced ? {} : { x, y, scale, opacity }) } as CSSProperties}>
      {lines.map((line, index) => (
        <m.span key={line} className={`ab-line-position ab-line-${index}`} style={reduced ? {} : lineMotion[index]} aria-hidden="true">
          <m.span className={`ab-line-reveal${index === 2 ? ' ab-sleeping' : ''}`}
            initial={reduced ? false : { clipPath: 'inset(0 100% 0 -3%)', color: aboutBrand.green, y: 12 }}
            animate={{ clipPath: 'inset(-10% -5% -16% -3%)', color: aboutBrand.bgLight, y: 0 }}
            transition={{ duration: 1.25, delay: .68 + index * .24, ease: [.22, 1, .36, 1] }}>{line}</m.span>
        </m.span>
      ))}
    </m.h1>
  )
}

function MetricCard({ metric, index, progress, size, reduced }: { metric: AboutMetric; index: number; progress: MotionValue<number>; size: StageSize; reduced: boolean }) {
  const numberRef = useRef<SVGTextElement>(null)
  const numberMeasureRef = useRef<SVGTextElement>(null)
  const labelRef = useRef<HTMLHeadingElement>(null)
  const [numberBox, setNumberBox] = useState({ x: 0, y: -70, width: String(metric.value ?? 120).length * 60, height: 72 })
  const [labelWidth, setLabelWidth] = useState(80)
  const previousNumber = useRef(-1)
  const { width } = size
  const { cardWidth, cardHeight, railWidth, railHeight, cardFont, railFont, railLeft } = metricLayout(size)
  useLayoutEffect(() => {
    let disposed = false
    const measure = () => {
      if (disposed) return
      const box = numberMeasureRef.current?.getBBox()
      // SVG getBBox includes this font's full ascender/descender box. Fit the actual ink.
      const context = document.createElement('canvas').getContext('2d')
      if (box?.width && context) {
        context.font = '900 100px "Neue Haas Grotesk Display"'
        const ink = context.measureText(String(metric.value ?? '?'))
        const next = { x: box.x, y: -ink.actualBoundingBoxAscent, width: box.width, height: ink.actualBoundingBoxAscent + ink.actualBoundingBoxDescent }
        if (next.height) setNumberBox(old => Math.abs(old.width - next.width) < .01 && Math.abs(old.height - next.height) < .01 && old.y === next.y ? old : next)
      }
      if (labelRef.current) setLabelWidth(labelRef.current.offsetWidth)
    }
    document.fonts.ready.then(measure)
    measure()
    return () => { disposed = true }
  }, [metric.value, size.width])
  const start = .245 + index * .022
  const end = .485 + index * .022
  const railX = size.mobile ? 0 : railLeft - width * .08 + index * (railWidth + 6 - cardWidth - 12)
  const x = useTransform(progress, [start, end, .61, .88], [width * (1.02 + index * .06), 0, 0, railX], { ease })
  const y = useTransform(progress, [start, end], [18, 0], { ease })
  const opacity = useTransform(progress, [start, start + .035], [0, 1])
  const scale = useTransform(progress, [start, end], [.94, 1], { ease })
  const backgroundScale = useTransform(progress, [.61, .88], [1, railHeight / cardHeight], { ease })
  const backgroundWidth = useTransform(progress, [.61, .88], [1, railWidth / cardWidth], { ease })
  const valueScale = useTransform(progress, [.61, .88], [1, railFont / cardFont], { ease })
  const fitNumber = (cellWidth: number, font: number) => Math.min(.72, (cellWidth - 10 - (metric.suffix ? font * .18 + 2 : 0)) / (numberBox.width * font / 100))
  const numberFit = useTransform(progress, [.61, .88], [fitNumber(cardWidth, cardFont), fitNumber(railWidth, railFont)], { ease })
  const suffixX = useTransform(numberFit, fit => numberBox.width * cardFont / 100 * fit + 2)
  const labelY = useTransform(progress, [.61, .88], [0, railHeight - cardHeight], { ease })
  const count = useTransform(progress, [start + .035, end + .015], [0, metric.value ?? 0], { ease })
  const writeNumber = useCallback((value: number) => {
    if (metric.value === null) { if (numberRef.current) numberRef.current.textContent = '?'; return }
    const rounded = reduced ? metric.value : Math.min(metric.value, Math.max(0, Math.round(value)))
    if (numberRef.current && rounded !== previousNumber.current) { numberRef.current.textContent = String(rounded); previousNumber.current = rounded }
  }, [metric.value, reduced])
  useMotionValueEvent(count, 'change', writeNumber)
  useEffect(() => { writeNumber(count.get()) }, [count, writeNumber])
  return (
    <m.article className="ab-metric" style={{ height: cardHeight, ...(reduced ? {} : { x, y, opacity, scale }) }} aria-label={metric.value === null ? `${metric.label}, count pending` : `${metric.value}${metric.suffix} ${metric.label}`}>
      <m.div className="ab-metric-surface" style={reduced ? {} : { scaleY: backgroundScale, scaleX: backgroundWidth }} aria-hidden="true" />
      <div className="ab-metric-top" style={{ width: railWidth - (size.mobile ? 12 : 20) }} aria-hidden="true"><span className="ab-metric-pin" /></div>
      <m.p className="ab-metric-value" style={{ fontSize: cardFont, height: cardFont * .72, ...(reduced ? {} : { scale: valueScale }) }} aria-hidden="true">
        <m.svg className="ab-metric-numeral" viewBox={`${numberBox.x} ${numberBox.y} ${numberBox.width} ${numberBox.height}`} preserveAspectRatio="none" width={numberBox.width * cardFont / 100} height={cardFont * .72} style={{ scaleX: reduced ? fitNumber(cardWidth, cardFont) : numberFit }} focusable="false">
          <text ref={numberRef}>{metric.value === null ? '?' : reduced ? metric.value : 0}</text>
          <text ref={numberMeasureRef} className="ab-metric-measure">{metric.value ?? '?'}</text>
        </m.svg>
        <m.span className="ab-metric-suffix" style={{ x: reduced ? numberBox.width * cardFont / 100 * fitNumber(cardWidth, cardFont) + 2 : suffixX }}>{metric.suffix}</m.span>
      </m.p>
      <m.div className="ab-metric-copy" style={reduced ? {} : { y: labelY }}><h3 ref={labelRef} style={size.mobile ? { transform: `scaleX(${Math.min(1, (railWidth - 8) / labelWidth)})` } : undefined}>{metric.label.split(' ').map(word => <span key={word}>{word}</span>)}</h3></m.div>
    </m.article>
  )
}

type Point = { x: number; y: number }
function cubic(a: Point, b: Point, c: Point, d: Point, t: number): Point {
  const s = 1 - t
  return { x: s*s*s*a.x + 3*s*s*t*b.x + 3*s*t*t*c.x + t*t*t*d.x, y: s*s*s*a.y + 3*s*s*t*b.y + 3*s*t*t*c.y + t*t*t*d.y }
}
function makeRoute({ width: w, height: h, mobile }: StageSize) {
  const start = { x: w * (mobile ? .12 : .105), y: h * (mobile ? .30 : .38) }
  const panel = portraitPanel({ width: w, height: h, mobile })
  const end = { x: w * .5, y: mobile ? h * .17 : panel.top + panel.height * .04 }
  const points: Point[] = []
  // Arrive at the portrait axis first, then follow a straight vertical connection.
  const axis = { x: w * .5, y: h * .43 }
  for (let i = 0; i <= 48; i++) points.push(cubic(start, { x: w * .22, y: start.y }, { x: w * .5, y: axis.y }, axis, i / 48))
  for (let i = 1; i <= 48; i++) points.push(cubic(axis, { x: w * .5, y: h * .35 }, { x: w * .5, y: h * .25 }, end, i / 48))
  let total = 0
  const distances = points.map((point, i) => { if (i) total += Math.hypot(point.x - points[i-1].x, point.y - points[i-1].y); return total })
  return { points, distances, total, d: points.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ') }
}
function SignalBeacon({ progress, size, reduced, settings }: { progress: MotionValue<number>; size: StageSize; reduced: boolean; settings: SignalSettings }) {
  const route = makeRoute(size)
  const axisFraction = route.distances[48] / route.total
  const journey = useTransform(progress, [0, .1, .56, .92], [0, 0, axisFraction, 1], { ease })
  const pointAt = (fraction: number) => {
    const distance = fraction * route.total
    let i = 1
    while (i < route.distances.length - 1 && route.distances[i] < distance) i++
    const from = route.points[i-1], to = route.points[i]
    const t = Math.max(0, Math.min(1, (distance - route.distances[i-1]) / (route.distances[i] - route.distances[i-1])))
    return { x: from.x + (to.x-from.x)*t, y: from.y + (to.y-from.y)*t }
  }
  const x = useTransform(journey, p => pointAt(p).x)
  const y = useTransform(journey, p => pointAt(p).y)
  const traceOpacity = useTransform(progress, [0, .12, .45, .72, .94], [0, .25, .38, .23, 0])
  const introLineOpacity = useTransform(progress, [.08, .19], [1, 0])
  const endLineOpacity = useTransform(progress, [.77, .94], [0, 1])
  return (
    <div className="ab-signal-system" aria-hidden="true">
      {!reduced && <svg className="ab-signal-route" viewBox={`0 0 ${size.width} ${size.height}`}><m.path d={route.d} fill="none" stroke="#c8ff3d" strokeWidth=".7" style={{ pathLength: journey, opacity: traceOpacity }} /></svg>}
      <m.div className="ab-signal" style={reduced ? {} : { x, y }}>
        <m.div className="ab-signal-bloom" initial={reduced ? false : { opacity: 0, scale: .2 }} animate={{ opacity: settings.beaconBloom, scale: 1 }} transition={{ duration: 1.7, delay: .22, ease: [.16, 1, .3, 1] }} />
        <m.div className="ab-beacon" initial={reduced ? false : { opacity: 0, scale: .2 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .72, delay: .15, ease: [.16, 1, .3, 1] }}><span className="ab-idle-light" /></m.div>
        <m.div className="ab-intro-line-travel" style={reduced ? {} : { opacity: introLineOpacity }}><m.div className="ab-signal-line" initial={reduced ? false : { scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 1.15, delay: .45, ease: [.22, 1, .36, 1] }}><span className="ab-line-shimmer" /></m.div></m.div>
        <m.div className="ab-portrait-signal-line" style={reduced ? {} : { opacity: endLineOpacity }} />
      </m.div>
    </div>
  )
}

export default function SignalIntro({ settings }: { settings: SignalSettings }) {
  const sequenceRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const metricsRef = useRef<HTMLDivElement>(null)
  const size = useStageSize(stageRef)
  const reduced = Boolean(useReducedMotion())
  const metrics = getAboutMetrics(settings.clientsServed)
  const { scrollYProgress } = useScroll({ target: sequenceRef, offset: ['start start', 'end end'] })
  const progress = useSpring(scrollYProgress, { stiffness: settings.stiffness, damping: settings.damping, mass: .35, restDelta: .0001, restSpeed: .0001, skipInitialAnimation: true })
  const supportOpacity = useTransform(progress, [.065, .16], [1, 0])
  const nextCueOpacity = useTransform(progress, [.86, .96], [0, 1])
  const cardsOpacity = useTransform(progress, [.24, .28], [0, 1])
  const { railTop } = metricLayout(size)
  const cardTop = size.height * (size.mobile ? .46 : .35)
  const wideSideSpace = !size.mobile && (size.width - portraitPanel(size).width) / 2 >= 230
  // Raise only the settled mobile portrait rail; preserve the opening cards and existing transform timing.
  const mobilePortraitRailOffset = size.mobile ? -48 : 0
  const cardsY = useTransform(progress, [.61, .88], [0, railTop - cardTop + mobilePortraitRailOffset], { ease })
  const metricsCaptionOpacity = useTransform(progress, [.36, .49, .6, .7], [0, 1, 1, 0])
  const footerHero = useTransform(progress, [.065, .18], [1, 0])
  const followPointer = useTransform(progress, p => p > .18 ? 'none' : 'auto')
  const chapterRef = useRef<HTMLSpanElement>(null)
  const followRef = useRef<HTMLButtonElement>(null)
  const [idlePhase, setIdlePhase] = useState(true)
  const idlePhaseRef = useRef(true)
  const [idleVisible, setIdleVisible] = useState(true)
  const [portraitResting, setPortraitResting] = useState(false)
  const portraitRestingRef = useRef(false)
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    let visible = true
    const update = () => setIdleVisible(visible && !document.hidden)
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update() }, { threshold: .01 })
    observer.observe(stage); document.addEventListener('visibilitychange', update); update()
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update) }
  }, [])
  useMotionValueEvent(progress, 'change', p => {
    // One state change per resting-state boundary, never a React animation clock.
    const resting = p > .96
    if (portraitRestingRef.current !== resting) { portraitRestingRef.current = resting; setPortraitResting(resting) }
    const idle = p < .085 || p > .94
    if (idlePhaseRef.current !== idle) { idlePhaseRef.current = idle; setIdlePhase(idle) }
    const chapter = p < .28 ? '01 / THE SIGNAL' : p < .68 ? '01 / THE REACH' : '02 / THE PERSON'
    if (chapterRef.current && chapterRef.current.textContent !== chapter) chapterRef.current.textContent = chapter
    const disabled = !reduced && p > .18
    if (followRef.current && followRef.current.disabled !== disabled) followRef.current.disabled = disabled
  })
  const followSignal = () => {
    if (reduced) { metricsRef.current?.scrollIntoView(); return }
    const section = sequenceRef.current
    if (section) window.scrollTo({ top: section.offsetTop + (section.offsetHeight - window.innerHeight) * .55, behavior: 'smooth' })
  }
  const style = { '--ab-distance': `${size.mobile ? settings.mobileDistance : settings.desktopDistance}svh`, '--ab-portrait-scale': settings.portraitScale, '--ab-side-width': `calc(${(size.width - portraitPanel(size).width) / 2}px - var(--ab-gutter) - 24px)` } as CSSProperties
  return (
    <section ref={sequenceRef} id="about-signal" className={`ab-sequence${reduced ? ' ab-reduced' : ''}`} style={style} aria-label="The Maximus Reach story">
      <div ref={stageRef} className="ab-stage" data-side-space={wideSideSpace ? 'wide' : 'compact'} data-idle={!reduced && idleVisible && idlePhase ? 'on' : 'off'} data-portrait-rest={!reduced && idleVisible && portraitResting ? 'on' : 'off'}>
        <div className="ab-grain" aria-hidden="true" />
        <div className="ab-chapter ab-micro"><span ref={chapterRef}>01 / THE SIGNAL</span></div>
        <SignalBeacon progress={progress} size={size} reduced={reduced} settings={settings} />
        <div className="ab-opening" aria-label="Signal in the Dark">
          {size.mobile && <m.p className="ab-hero-eyebrow ab-micro" style={reduced ? {} : { opacity: supportOpacity }}>A quiet beginning. A lasting reach.</m.p>}
          <NarrativeHeadline progress={progress} size={size} reduced={reduced} settings={settings} />
          {size.mobile && <m.p className="ab-support" style={reduced ? {} : { opacity: supportOpacity }}>Ideas worth losing sleep over.<br />Built to reach further.</m.p>}
        </div>
        {size.mobile && <m.div className="ab-metrics-caption ab-micro" style={reduced ? {} : { opacity: metricsCaptionOpacity }}>Small beginnings. Wider reach.<span>Built to reach further</span></m.div>}
        {!size.mobile && <m.div className="ab-person-info ab-micro" style={reduced ? { opacity: 1 } : { opacity: nextCueOpacity }}><strong>ZACHARY</strong><span>FOUNDER / MAXIMUS REACH</span><span>VIRGINIA</span></m.div>}
        {!size.mobile && <m.aside className="ab-next-cue ab-micro" style={reduced ? { opacity: 1 } : { opacity: nextCueOpacity }} aria-label="Disciplines"><PortraitDisciplineMarks /></m.aside>}
        <div className="ab-metrics-anchor" ref={metricsRef} style={{ top: cardTop }}>
          <m.div className="ab-metrics" style={reduced ? {} : { y: cardsY, opacity: cardsOpacity }}>
            {metrics.map((metric, index) => <MetricCard key={metric.label} metric={metric} index={index} progress={progress} size={size} reduced={reduced} />)}
          </m.div>
        </div>
        <PortraitHandoff progress={progress} size={size} reduced={reduced} />
        <div className="ab-stage-footer">
          <m.button ref={followRef} className="ab-follow" onClick={followSignal} style={reduced ? {} : { opacity: footerHero, pointerEvents: followPointer }}><span className="ab-follow-arrow" aria-hidden="true">↓</span>Follow the signal</m.button>
          {size.mobile && <span className="ab-footer-location ab-micro">Virginia · Reaching further</span>}
        </div>
      </div>
    </section>
  )
}

