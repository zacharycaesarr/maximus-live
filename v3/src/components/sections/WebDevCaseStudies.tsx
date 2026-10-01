import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight, LockKeyhole, Signal, Wifi, BatteryFull, X } from 'lucide-react'
import { WEB_MOCKS, type WorkMockMeta } from '@/work-mockups/mockMeta'
import { BuildCaseStage, type BuildCaseId } from '@/work-mockups/build-case-stages'
import './web-dev-case-studies.css'

type Version = 'before' | 'after'
type View = 'homepage' | 'mobile' | 'details'

// Outcomes come from WEB_MOCKS. Services and focus come from the former
// WebDevShowcase detail panel; these are not claims taken from the reference.
const PROJECT_DETAILS: Record<string, { tags: string[]; focus: string }> = {
  'summit-hvac': {
    tags: ['Web Development', 'UI/UX', 'SEO'],
    focus: 'Mobile dispatch, click-to-call, and local service search.',
  },
  'northline-dental': {
    tags: ['Web Development', 'UI/UX', 'CRO'],
    focus: 'Consultation booking, smile gallery, and insurance trust badges.',
  },
  'ridge-plumbing': {
    tags: ['Web Development', 'UI/UX', 'CRO'],
    focus: 'Project lookbooks, pricing guides, and design-intake booking.',
  },
}

const VIEWS: { id: View; label: string }[] = [
  { id: 'homepage', label: 'Homepage' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'details', label: 'Page details' },
]

const SCREEN_BACKGROUNDS: Record<string, Record<Version, string>> = {
  'summit-hvac': { before: '#c8c8c8', after: '#1a120e' },
  'northline-dental': { before: '#e8eef4', after: '#faf6f0' },
  'ridge-plumbing': { before: '#f0f0f0', after: '#111110' },
}

/** Render the existing website at a stable design width inside a device.
 * ResizeObserver runs on resize/content changes, never on an animation loop.
 * Details pans to the actual lower page content rather than inventing assets.
 */
function WebsitePreview({
  project, version, phone = false, details = false,
}: { project: WorkMockMeta; version: Version; phone?: boolean; details?: boolean }) {
  const viewport = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = viewport.current
    const content = canvas.current
    if (!host || !content) return
    host.inert = true
    const designWidth = phone ? 280 : 760
    const fit = () => {
      const scale = host.clientWidth / designWidth
      if (!scale) return
      const offset = details ? Math.max(0, content.scrollHeight - host.clientHeight / scale) : 0
      content.style.transform = `scale(${scale}) translateY(${-offset}px)`
    }
    const observer = new ResizeObserver(fit)
    observer.observe(host)
    observer.observe(content)
    fit()
    return () => observer.disconnect()
  }, [phone, details, project.slug, version])

  return (
    <div ref={viewport} className={`mr-case-preview${phone ? ' mr-case-preview-phone' : ''}`} style={{ background: SCREEN_BACKGROUNDS[project.slug][version] }} aria-hidden="true">
      <div ref={canvas} className="mr-case-canvas" style={{ width: phone ? 280 : 760 }}>
        <BuildCaseStage id={project.slug as BuildCaseId} version={version} className={`mr-case-site mr-case-site-${project.slug} mr-case-site-${version}`} />
      </div>
    </div>
  )
}

function DesktopDevice({ project, version, details }: { project: WorkMockMeta; version: Version; details: boolean }) {
  return (
    <div className="mr-case-desktop">
      <div className="mr-case-browser">
        <div className="mr-case-browser-bar" aria-hidden="true">
          <span className="mr-case-browser-dots"><i /><i /><i /></span>
          <span className="mr-case-address"><LockKeyhole size={10} />{project.title}<span className="mr-case-address-end">↻</span></span>
        </div>
        <WebsitePreview project={project} version={version} details={details} />
      </div>
    </div>
  )
}

function PhoneDevice({ project, version, details }: { project: WorkMockMeta; version: Version; details: boolean }) {
  return (
    <div className="mr-case-phone">
      <div className="mr-case-phone-screen">
        <div className="mr-case-phone-status" aria-hidden="true">
          <span>9:41</span><span className="mr-case-phone-island" /><span><Signal size={10} /><Wifi size={10} /><BatteryFull size={12} /></span>
        </div>
        <div className="mr-case-phone-address" aria-hidden="true"><LockKeyhole size={7} />{project.title}</div>
        <WebsitePreview project={project} version={version} phone details={details} />
      </div>
    </div>
  )
}

export default function WebDevCaseStudies({ initialProjectId, onClose }: { initialProjectId: string; onClose: () => void }) {
  const [projectId, setProjectId] = useState(initialProjectId)
  const [version, setVersion] = useState<Version>('after')
  const [view, setView] = useState<View>('homepage')
  const dialog = useRef<HTMLDivElement>(null)
  const close = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const reduced = useReducedMotion()
  const project = WEB_MOCKS.find(p => p.slug === projectId) ?? WEB_MOCKS[0]
  const index = WEB_MOCKS.indexOf(project)
  const data = PROJECT_DETAILS[project.slug]
  const metric = project.metric.match(/^([+\d.]+(?:%|x))\s+(.*)$/)

  const selectProject = (id: string) => {
    setProjectId(id)
    setVersion('after')
    setView('homepage')
  }
  const stepView = (direction: number) => {
    const next = (VIEWS.findIndex(v => v.id === view) + direction + VIEWS.length) % VIEWS.length
    setView(VIEWS[next].id)
  }

  useEffect(() => {
    const openedBy = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const body = document.body
    const html = document.documentElement
    const scrollY = window.scrollY
    const previous = { overflow: body.style.overflow, position: body.style.position, top: body.style.top, width: body.style.width, paddingRight: body.style.paddingRight, htmlOverflow: html.style.overflow, hideNav: html.dataset.mrHideNav }
    const scrollbar = window.innerWidth - html.clientWidth
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis
    close.current?.focus({ preventScroll: true })
    const siblings = Array.from(body.children).filter((element): element is HTMLElement => element instanceof HTMLElement && !element.contains(dialog.current))
    const inertStates = siblings.map(element => ({ element, inert: element.inert }))
    siblings.forEach(element => { element.inert = true })
    html.dataset.mrHideNav = '1'
    lenis?.stop()
    body.style.overflow = 'hidden'
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.width = '100%'
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`
    html.style.overflow = 'hidden'

    const focusable = () => Array.from(dialog.current?.querySelectorAll<HTMLElement>('button:not(:disabled), select, [tabindex="0"]') ?? []).filter(element => !element.closest('[inert]') && element.getClientRects().length > 0)
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        onClose()
      }
      if (event.key !== 'Tab') return
      const items = focusable()
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && (document.activeElement === first || !dialog.current?.contains(document.activeElement))) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && (document.activeElement === last || !dialog.current?.contains(document.activeElement))) {
        event.preventDefault()
        first?.focus()
      }
    }
    const onFocus = (event: FocusEvent) => {
      if (event.target instanceof Node && !dialog.current?.contains(event.target)) close.current?.focus({ preventScroll: true })
    }
    document.addEventListener('keydown', onKey, true)
    document.addEventListener('focusin', onFocus)
    return () => {
      document.removeEventListener('keydown', onKey, true)
      document.removeEventListener('focusin', onFocus)
      inertStates.forEach(({ element, inert }) => { element.inert = inert })
      body.style.overflow = previous.overflow
      body.style.position = previous.position
      body.style.top = previous.top
      body.style.width = previous.width
      body.style.paddingRight = previous.paddingRight
      html.style.overflow = previous.htmlOverflow
      if (previous.hideNav === undefined) delete html.dataset.mrHideNav
      else html.dataset.mrHideNav = previous.hideNav
      window.scrollTo({ top: scrollY, behavior: 'instant' })
      lenis?.start()
      openedBy?.focus({ preventScroll: true })
    }
  }, [onClose])

  return createPortal(
    <motion.div className="mr-case-backdrop" data-lenis-prevent initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.22 }} onPointerDown={event => { if (event.target === event.currentTarget) onClose() }}>
      <motion.div ref={dialog} className="mr-case-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} initial={{ scale: reduced ? 1 : 0.98, y: reduced ? 0 : 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: reduced ? 1 : 0.99 }} transition={{ duration: reduced ? 0 : 0.25 }}>
        <div className="mr-case-close-wrap"><span>ESC</span><button ref={close} type="button" className="mr-case-close" onClick={onClose} aria-label="Close case studies"><X size={17} /></button></div>
        <div className="mr-case-panel" data-showcase-scroll>
          <aside className="mr-case-rail" tabIndex={0} aria-label="Project information">
            <header className="mr-case-header">
              <div className="mr-case-brand"><img src="/assets/mrlogo-short-white.png" alt="" width={29} height={29} /><span>Maximus<br />Reach</span></div>
              <div className="mr-case-heading"><p className="mr-case-eyebrow">Web Development</p><h2 id={titleId}>Case Studies</h2></div>
            </header>
            <nav className="mr-case-selector" aria-label="Select a case study">
              <div className="mr-case-project-list">
                {WEB_MOCKS.map((item, i) => <button key={item.slug} type="button" aria-pressed={projectId === item.slug} onClick={() => selectProject(item.slug)}><span>{String(i + 1).padStart(2, '0')}</span><span>{item.title}</span><ArrowRight size={17} /></button>)}
              </div>
              <label className="mr-case-project-select"><span>{String(index + 1).padStart(2, '0')} / 03</span><select aria-label="Select case study" value={project.slug} onChange={event => selectProject(event.target.value)}>{WEB_MOCKS.map(item => <option key={item.slug} value={item.slug}>{item.title}</option>)}</select></label>
            </nav>
            <div className="mr-case-identity" key={`identity-${project.slug}`}>
              <p className="mr-case-eyebrow">Featured project</p><h3>{project.title}</h3>
              <ul className="mr-case-tags" aria-label="Project services">{data.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
            </div>
            <p className="mr-case-description">{project.blurb}</p>
            <div className="mr-case-outcome"><p>{metric?.[1] ?? project.metric}</p>{metric && <span>{metric[2]}</span>}</div>
            <dl className="mr-case-meta"><div><dt>Industry</dt><dd>{project.subtext}</dd></div><div><dt>Focus</dt><dd>{data.focus}</dd></div></dl>
          </aside>
          <section className="mr-case-stage" aria-label={`${project.title} website previews`}>
            <div className={`mr-case-scene mr-case-view-${view}`}>
              <div className="mr-case-material" aria-hidden="true" /><div className="mr-case-plinth" aria-hidden="true" />
              <div className="mr-case-devices" key={`${project.slug}-${version}`}>
                <DesktopDevice project={project} version={version} details={view === 'details'} />
                <PhoneDevice project={project} version={version} details={view === 'details'} />
              </div>
              <div className="mr-case-note" aria-hidden="true">Designed for<br />every screen.<svg viewBox="0 0 65 55" fill="none"><path d="M60 3C34 12 17 26 9 47m0 0-3-12m3 12 12-4" stroke="currentColor" strokeWidth="1" /></svg></div>
            </div>
            <div className="mr-case-compare-row">
              <div className="mr-case-compare" role="group" aria-label="Website version">{(['before', 'after'] as const).map(item => <button key={item} type="button" aria-pressed={version === item} onClick={() => setVersion(item)}>{item === 'before' ? 'Before' : 'After'}</button>)}</div>
              <span className="mr-case-difference" aria-hidden="true"><svg viewBox="0 0 45 35" fill="none"><path d="M42 32C39 14 24 8 7 6m0 0 8-4M7 6l6 8" stroke="currentColor" /></svg>See the difference.</span>
            </div>
            <div className="mr-case-gallery" role="group" aria-label="Case study views">
              <button type="button" className="mr-case-gallery-arrow" aria-label="Previous preview" onClick={() => stepView(-1)}><ChevronLeft size={18} /></button>
              <div className="mr-case-thumbnails">{VIEWS.map(item => <button key={item.id} type="button" className="mr-case-thumbnail" aria-label={`Show ${item.label.toLowerCase()} view`} aria-pressed={view === item.id} onClick={() => setView(item.id)}><div className={`mr-case-thumb-image mr-case-thumb-${item.id}`}><WebsitePreview project={project} version={version} phone={item.id === 'mobile'} details={item.id === 'details'} /></div><span>{item.label}</span></button>)}</div>
              <button type="button" className="mr-case-gallery-arrow" aria-label="Next preview" onClick={() => stepView(1)}><ChevronRight size={18} /></button>
            </div>
          </section>
          <p className="mr-case-sr-only" role="status" aria-live="polite" aria-atomic="true">{project.title}. {version === 'before' ? 'Before' : 'After'} redesign. {VIEWS.find(item => item.id === view)?.label} view.</p>
        </div>
      </motion.div>
    </motion.div>, document.body,
  )
}
