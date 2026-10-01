import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import WhyFeatureStage from './WhyFeatureStage'
import './why-workspace.css'

const reasons = [
  { title: 'One partner', body: 'Web, ads and creative stay connected rather than being split across unrelated vendors.', label: 'Everything connected' },
  { title: 'Built around you', body: 'Custom direction rather than a reskinned template.', label: 'A distinctive foundation' },
  { title: 'Launch, then improve', body: 'Launch begins the refinement process rather than ending it.', label: 'Made to evolve' },
  { title: 'Know what’s working', body: 'Clear visibility into meaningful leads, performance and what changed.', label: 'Clarity in the numbers' },
  { title: 'Stay connected', body: 'Direct communication and a clear understanding of where the project stands.', label: 'A direct line' },
] as const

// The first panel settles in place before the two belts begin to scrub.
const FIRST_PANEL_HOLD = .095
const FIRST_PANEL_ASSEMBLY_END = FIRST_PANEL_HOLD * .72

function PanelCopy({ index }: { index: number }) {
  const reason = reasons[index]
  return <div className="mr-why-slide-copy" data-home-reveal>
    <span>0{index + 1} / 05</span>
    <h3>{reason.title}</h3>
    <p>{reason.body}</p>
  </div>
}

function VisualPanel({ index, label, scrollProgress, windowRange, testimonialsPlaying, isActive }: {
  index: number; label: string; scrollProgress: MotionValue<number>; windowRange: [number, number]; testimonialsPlaying: boolean; isActive: boolean
}) {
  const progress = useTransform(scrollProgress, windowRange, [0, 1])
  return <div className="mr-why-visual-panel" data-home-reveal>
    <WhyFeatureStage active={index} reducedMotion={false} label={label} progress={progress} isActive={isActive} testimonialsPlaying={testimonialsPlaying} />
  </div>
}

/** Five full panels scrub with vertical page scrolling. The visual and copy belts share one x value. */
export default function WhyComparisonMatrix() {
  const sectionRef = useRef<HTMLElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const visualViewportRef = useRef<HTMLDivElement>(null)
  const visualTrackRef = useRef<HTMLDivElement>(null)
  const [mobileActive, setMobileActive] = useState(0)
  const [desktopActive, setDesktopActive] = useState(0)
  const [testimonialsActive, setTestimonialsActive] = useState(false)
  const desktopActiveRef = useRef(0)
  const testimonialsActiveRef = useRef(false)
  const [panelWindows, setPanelWindows] = useState<[number, number][]>([])
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 767px)').matches)
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const reelProgress = useTransform(scrollYProgress, [0, FIRST_PANEL_HOLD, 1], [0, 0, 1])
  const horizontalDistance = useMotionValue(0)
  const x = useTransform(() => -reelProgress.get() * horizontalDistance.get())

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)')
    const update = () => setIsMobile(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useLayoutEffect(() => {
    const viewport = visualViewportRef.current
    const track = visualTrackRef.current
    if (!viewport || !track || isMobile || reducedMotion) return undefined
    const measure = () => {
      const distance = Math.max(0, track.scrollWidth - viewport.clientWidth)
      horizontalDistance.set(distance)
      if (!distance) return
      const next = Array.from(track.children).map((child, index): [number, number] => {
        const left = (child as HTMLElement).offsetLeft
        const start = index === 0 ? 0 : Math.max(0, (left - viewport.clientWidth * .9) / distance)
        const end = index === 0 ? viewport.clientWidth * .65 / distance : (left - viewport.clientWidth * .1) / distance
        return [Math.min(1, start), Math.min(1, Math.max(start + .001, end))]
      })
      setPanelWindows(current => JSON.stringify(current) === JSON.stringify(next) ? current : next)
    }
    const observer = new ResizeObserver(measure)
    observer.observe(viewport)
    observer.observe(track)
    window.addEventListener('resize', measure)
    document.fonts.ready.then(measure).catch(() => undefined)
    measure()
    return () => { observer.disconnect(); window.removeEventListener('resize', measure) }
  }, [isMobile, reducedMotion, horizontalDistance])

  useMotionValueEvent(reelProgress, 'change', progress => {
    const nextActive = Math.max(0, Math.min(4, Math.round(progress * 4)))
    if (nextActive !== desktopActiveRef.current) {
      desktopActiveRef.current = nextActive
      setDesktopActive(nextActive)
    }
    const nextTestimonialsActive = progress >= .97 && progress <= 1
    if (nextTestimonialsActive !== testimonialsActiveRef.current) {
      testimonialsActiveRef.current = nextTestimonialsActive
      setTestimonialsActive(nextTestimonialsActive)
    }
  })

  const selectMobile = (index: number) => {
    const carousel = carouselRef.current
    if (carousel) carousel.scrollTo({ left: index * carousel.clientWidth, behavior: 'smooth' })
    setMobileActive(index)
  }

  const updateMobile = () => {
    const carousel = carouselRef.current
    if (carousel) setMobileActive(Math.max(0, Math.min(4, Math.round(carousel.scrollLeft / Math.max(1, carousel.clientWidth)))))
  }

  return <section id="why-maximus" ref={sectionRef} data-parallax-pause className={`mr-why-section ${reducedMotion ? 'mr-why-reduced' : ''}`} aria-label="Why Maximus Reach">
    <span data-beacon-anchor="why-maximus" className="pointer-events-none absolute left-[8%] top-6 h-px w-px" aria-hidden="true" />
    <div className="mr-why-pin">
      <div className="mr-why-heading">
        <p data-home-reveal className="mr-why-eyebrow">04</p>
        <div><h2 data-home-reveal>Why Maximus Reach</h2><p data-home-reveal>What working with Maximus Reach actually feels like.</p></div>
        <span className="mr-why-current" aria-hidden="true">0{desktopActive + 1} / 05</span>
      </div>

      {!isMobile && !reducedMotion && <div className="mr-why-desktop-viewport">
        <div ref={visualViewportRef} className="mr-why-visual-viewport">
          <motion.div ref={visualTrackRef} className="mr-why-track" style={{ x }}>
            {reasons.map((reason, index) => <VisualPanel key={reason.title} index={index} label={reason.label} scrollProgress={index === 0 ? scrollYProgress : reelProgress} windowRange={index === 0 ? [0, FIRST_PANEL_ASSEMBLY_END] : panelWindows[index] ?? [index / 4, Math.min(1, (index + .7) / 4)]} isActive={index === desktopActive} testimonialsPlaying={index === 4 && index === desktopActive && testimonialsActive} />)}
          </motion.div>
        </div>
        <div className="mr-why-copy-viewport">
          <motion.div className="mr-why-track" style={{ x }}>
            {reasons.map((reason, index) => <div className="mr-why-copy-panel" key={reason.title}><PanelCopy index={index} /></div>)}
          </motion.div>
        </div>
      </div>}

      {!isMobile && reducedMotion && <div className="mr-why-reduced-list">
        {reasons.map((reason, index) => <article key={reason.title}>
          <WhyFeatureStage active={index} reducedMotion label={reason.label} isActive />
          <PanelCopy index={index} />
        </article>)}
      </div>}

      {isMobile && <div className="mr-why-mobile">
        <div ref={carouselRef} className="mr-why-mobile-carousel" onScroll={updateMobile} aria-label="Five reasons to work with Maximus Reach">
          {reasons.map((reason, index) => <article className="mr-why-mobile-panel" key={reason.title}>
            <div className="mr-why-mobile-visual" data-home-reveal><WhyFeatureStage active={index} reducedMotion={Boolean(reducedMotion)} label={reason.label} isActive={mobileActive === index} testimonialsPlaying={mobileActive === index && index === 4} /></div>
            <PanelCopy index={index} />
          </article>)}
        </div>
        <div className="mr-why-tabs" role="group" aria-label="Choose a reason">
          {reasons.map((reason, index) => <button key={reason.title} type="button" aria-label={`${index + 1}: ${reason.title}`} aria-current={mobileActive === index ? 'step' : undefined} onClick={() => selectMobile(index)}>0{index + 1}</button>)}
        </div>
      </div>}
    </div>
  </section>
}
