import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion'
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

function PanelCopy({ index }: { index: number }) {
  const reason = reasons[index]
  return <div className="mr-why-slide-copy" data-home-reveal>
    <span>0{index + 1} / 05</span>
    <h3>{reason.title}</h3>
    <p>{reason.body}</p>
  </div>
}

function VisualPanel({ index, label, testimonialsPlaying, isActive }: {
  index: number; label: string; testimonialsPlaying: boolean; isActive: boolean
}) {
  return <div className="mr-why-visual-panel" data-home-reveal>
    <WhyFeatureStage active={index} reducedMotion={false} label={label} isActive={isActive} testimonialsPlaying={testimonialsPlaying} />
  </div>
}

/** Desktop-only subscription. Mobile never initializes the unused scroll reel. */
function DesktopReel({ sectionRef, onActiveChange }: { sectionRef: RefObject<HTMLElement>; onActiveChange: (index: number) => void }) {
  const visualViewportRef = useRef<HTMLDivElement>(null)
  const visualTrackRef = useRef<HTMLDivElement>(null)
  const [desktopActive, setDesktopActive] = useState(0)
  const [testimonialsActive, setTestimonialsActive] = useState(false)
  const desktopActiveRef = useRef(0)
  const testimonialsActiveRef = useRef(false)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const reelProgress = useTransform(scrollYProgress, [0, FIRST_PANEL_HOLD, 1], [0, 0, 1])
  const horizontalDistance = useMotionValue(0)
  const x = useTransform(() => -reelProgress.get() * horizontalDistance.get())

  useLayoutEffect(() => {
    const viewport = visualViewportRef.current
    const track = visualTrackRef.current
    if (!viewport || !track) return undefined
    let disposed = false
    const measure = () => {
      if (disposed) return
      const distance = Math.max(0, track.scrollWidth - viewport.clientWidth)
      horizontalDistance.set(distance)
    }
    const observer = new ResizeObserver(measure)
    observer.observe(viewport)
    observer.observe(track)
    window.addEventListener('resize', measure)
    document.fonts.ready.then(measure).catch(() => undefined)
    measure()
    return () => { disposed = true; observer.disconnect(); window.removeEventListener('resize', measure) }
  }, [horizontalDistance])

  useMotionValueEvent(reelProgress, 'change', progress => {
    const nextActive = Math.max(0, Math.min(4, Math.round(progress * 4)))
    if (nextActive !== desktopActiveRef.current) {
      desktopActiveRef.current = nextActive
      setDesktopActive(nextActive)
      onActiveChange(nextActive)
    }
    const nextTestimonialsActive = progress >= .97 && progress <= 1
    if (nextTestimonialsActive !== testimonialsActiveRef.current) {
      testimonialsActiveRef.current = nextTestimonialsActive
      setTestimonialsActive(nextTestimonialsActive)
    }
  })

  return <div className="mr-why-desktop-viewport">
    <div ref={visualViewportRef} className="mr-why-visual-viewport">
      <motion.div ref={visualTrackRef} className="mr-why-track" style={{ x }}>
        {reasons.map((reason, index) => <VisualPanel key={reason.title} index={index} label={reason.label} isActive={index === desktopActive} testimonialsPlaying={index === 4 && index === desktopActive && testimonialsActive} />)}
      </motion.div>
    </div>
    <div className="mr-why-copy-viewport">
      <motion.div className="mr-why-track" style={{ x }}>
        {reasons.map((reason, index) => <div className="mr-why-copy-panel" key={reason.title}><PanelCopy index={index} /></div>)}
      </motion.div>
    </div>
  </div>
}

/** Five full panels scrub with vertical page scrolling. Both belts share one x value. */
export default function WhyComparisonMatrix() {
  const sectionRef = useRef<HTMLElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [mobileActive, setMobileActive] = useState(0)
  const [desktopActive, setDesktopActive] = useState(0)
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 767px)').matches)
  const reducedMotion = useReducedMotion()
  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)')
    const update = () => setIsMobile(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

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

      {!isMobile && !reducedMotion && <DesktopReel sectionRef={sectionRef} onActiveChange={setDesktopActive} />}

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
