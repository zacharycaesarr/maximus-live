import { memo, useEffect, useId, useMemo, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useAnimationControls, useIsPresent, useReducedMotion } from 'framer-motion'
import { ArrowRight, ChevronDown, LockKeyhole, RotateCw, Signal, Wifi, BatteryFull, X } from 'lucide-react'
import { WEB_MOCKS } from '@/work-mockups/mockMeta'
import { BuildCaseStage, type BuildCaseId } from '@/work-mockups/build-case-stages'
import { SelectedWorkControls } from './selected-work-controls'
import { loadWorkSettings, readWebsiteCopy, type WorkSettings } from './selected-work-settings'
import './web-dev-case-studies.css'

type Version = 'before' | 'after'
type View = 'homepage' | 'mobile'
const EASE = [.22, 1, .36, 1] as const
const BACKGROUNDS: Record<string, Record<Version, string>> = {
  'summit-hvac': { before: '#c8c8c8', after: '#1a120e' },
  'northline-dental': { before: '#e8eef4', after: '#faf6f0' },
  'ridge-plumbing': { before: '#f0f0f0', after: '#111110' },
}

const WebsitePreview = memo(function WebsitePreview({ id, version, phone = false, copy }: {
  id: string; version: Version; phone?: boolean; copy: Record<string, string>
}) {
  const viewport = useRef<HTMLDivElement>(null)
  const page = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const host = viewport.current
    const content = page.current
    if (!host || !content) return
    host.inert = true
    const width = phone ? 280 : 760
    const fit = () => { content.style.transform = `scale(${host.clientWidth / width})` }
    const observer = new ResizeObserver(fit)
    observer.observe(host)
    fit()
    return () => observer.disconnect()
  }, [phone])
  return <div ref={viewport} className={`mr-case-preview${phone ? ' mr-case-preview-phone' : ''}`} style={{ background: BACKGROUNDS[id][version] }} aria-hidden="true">
    <div ref={page} className="mr-case-page-content" style={{ width: phone ? 280 : 760 }}>
      <BuildCaseStage id={id as BuildCaseId} version={version} copy={copy} className={`mr-case-site mr-case-site-${id} mr-case-site-${version}`} />
    </div>
  </div>
})

function Devices({ id, version, copy, settings, reduced }: {
  id: string; version: Version; copy: Record<string, string>; settings: WorkSettings; reduced: boolean
}) {
  const project = settings.projects[id]
  const phoneDelay = reduced ? 0 : settings.motion.stagger / 1000
  return <div className="mr-case-device-position">
    <div className="mr-case-desktop-slot"><motion.div className="mr-case-device-entry" initial={{ opacity: 0, y: reduced ? 0 : 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? .1 : .24, ease: EASE }}>
      <div className="mr-case-browser-float"><div className="mr-case-desktop">
        <div className="mr-case-browser">
          <div className="mr-case-browser-bar" aria-hidden="true">
            <span className="mr-case-browser-dots"><i /><i /><i /></span>
            <span className="mr-case-address"><LockKeyhole size={10} /><span className="mr-case-address-label">{project.browser}</span><RotateCw className="mr-case-refresh" size={12} /></span>
          </div>
          <WebsitePreview id={id} version={version} copy={copy} />
        </div>
      </div></div>
    </motion.div></div>
    <div className="mr-case-phone-slot"><motion.div className="mr-case-device-entry" initial={{ opacity: 0, y: reduced ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? .1 : .26, delay: phoneDelay, ease: EASE }}>
      <div className="mr-case-phone-float"><div className="mr-case-phone"><div className="mr-case-phone-screen">
        <div className="mr-case-phone-status" aria-hidden="true"><span>{settings.global.clock}</span><span className="mr-case-phone-island" /><span><Signal size={10} /><Wifi size={10} /><BatteryFull size={12} /></span></div>
        <div className="mr-case-phone-address" aria-hidden="true"><LockKeyhole size={7} />{project.phone}</div>
        <WebsitePreview id={id} version={version} copy={copy} phone />
      </div></div></div>
    </motion.div></div>
  </div>
}

export default function WebDevCaseStudies({ initialProjectId, onClose }: { initialProjectId: string; onClose: () => void }) {
  const [settings, setSettings] = useState(loadWorkSettings)
  const [projectId, setProjectId] = useState(initialProjectId)
  const [displayId, setDisplayId] = useState(initialProjectId)
  const [version, setVersion] = useState<Version>('after')
  const [view, setView] = useState<View>('homepage')
  const [menuOpen, setMenuOpen] = useState(false)
  const [optionIndex, setOptionIndex] = useState(0)
  const [hidden, setHidden] = useState(document.hidden)
  const [sceneVisible, setSceneVisible] = useState(true)
  const dialog = useRef<HTMLDivElement>(null)
  const close = useRef<HTMLButtonElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const selector = useRef<HTMLDivElement>(null)
  const menu = useRef<HTMLUListElement>(null)
  const options = useRef<(HTMLButtonElement | null)[]>([])
  const scene = useRef<HTMLDivElement>(null)
  const switchTimer = useRef<number>()
  const isMenuOpen = useRef(false)
  isMenuOpen.current = menuOpen
  const entered = useRef(false)
  const content = useAnimationControls()
  const present = useIsPresent()
  const reduced = !!useReducedMotion()
  const titleId = useId()
  const menuId = useId()
  const selected = settings.projects[projectId] ?? settings.projects[WEB_MOCKS[0].slug]
  const project = settings.projects[displayId] ?? selected
  const index = WEB_MOCKS.findIndex(p => p.slug === projectId)
  const labels = settings.global
  const motionSettings = settings.motion
  const website = version === 'before' ? project.beforeWebsite : project.afterWebsite
  const websiteCopy = useMemo(() => readWebsiteCopy(website), [website])
  const contentVariants = {
    hidden: { opacity: 0, x: reduced ? 0 : 8 },
    leaving: { opacity: 0, x: reduced ? 0 : -8, transition: { duration: reduced ? .08 : motionSettings.switching * .38 / 1000, ease: EASE } },
    visible: (group: number) => ({ opacity: 1, x: 0, transition: { duration: reduced ? .12 : motionSettings.switching * .62 / 1000, delay: entered.current || reduced ? 0 : group * motionSettings.stagger / 1000, ease: EASE } }),
  }

  useEffect(() => {
    void content.start('visible')
    entered.current = true
  }, [displayId, content])
  useEffect(() => () => window.clearTimeout(switchTimer.current), [])
  useEffect(() => {
    const visibility = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', visibility)
    const observer = new IntersectionObserver(([entry]) => setSceneVisible(entry.isIntersecting), { threshold: .01 })
    if (scene.current) observer.observe(scene.current)
    return () => { document.removeEventListener('visibilitychange', visibility); observer.disconnect() }
  }, [])

  const closeMenu = (restoreFocus = true) => {
    if (menu.current) menu.current.inert = true
    setMenuOpen(false)
    if (restoreFocus) trigger.current?.focus({ preventScroll: true })
  }
  const selectProject = (id: string) => {
    closeMenu(isMenuOpen.current)
    setProjectId(id)
    window.clearTimeout(switchTimer.current)
    if (id === displayId) { void content.start('visible'); return }
    void content.start('leaving')
    switchTimer.current = window.setTimeout(() => {
      setVersion('after')
      setView('homepage')
      setDisplayId(id)
    }, reduced ? 80 : motionSettings.switching * .38)
  }

  useEffect(() => {
    if (menu.current) menu.current.inert = !menuOpen
    if (menuOpen) options.current[optionIndex]?.focus({ preventScroll: true })
  }, [menuOpen, optionIndex])
  useEffect(() => {
    if (!menuOpen) return
    const outside = (event: PointerEvent) => { if (event.target instanceof Node && !selector.current?.contains(event.target)) closeMenu(false) }
    document.addEventListener('pointerdown', outside)
    return () => document.removeEventListener('pointerdown', outside)
  }, [menuOpen])

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
    const focusable = () => Array.from(dialog.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select, [tabindex="0"]') ?? []).filter(element => !element.closest('[inert]') && element.getClientRects().length > 0 && getComputedStyle(element).visibility !== 'hidden')
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        if (isMenuOpen.current) { setMenuOpen(false); trigger.current?.focus({ preventScroll: true }) }
        else onClose()
      }
      if (event.key !== 'Tab') return
      const items = focusable()
      const first = items[0], last = items[items.length - 1]
      if (event.shiftKey && (document.activeElement === first || !dialog.current?.contains(document.activeElement))) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && (document.activeElement === last || !dialog.current?.contains(document.activeElement))) { event.preventDefault(); first?.focus() }
    }
    const onFocus = (event: FocusEvent) => { if (event.target instanceof Node && !dialog.current?.contains(event.target)) close.current?.focus({ preventScroll: true }) }
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

  const style = {
    '--case-browser-travel': `${motionSettings.browserFloat}px`, '--case-phone-travel': `${motionSettings.phoneFloat}px`,
    '--case-browser-period': `${motionSettings.browserPeriod}s`, '--case-phone-period': `${motionSettings.phonePeriod}s`,
  } as CSSProperties
  const entry = { duration: reduced ? .12 : motionSettings.entrance / 1000, ease: EASE }
  const infoMotion = { variants: contentVariants, initial: 'hidden', animate: content, custom: 1 }
  return createPortal(
    <motion.div className="mr-case-backdrop" data-lenis-prevent initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: .2 } }} transition={entry} onPointerDown={event => { if (event.target === event.currentTarget) onClose() }}>
      <motion.div ref={dialog} className="mr-case-dialog" style={style} data-floating={present && motionSettings.float && !reduced && !hidden && sceneVisible ? 'true' : 'false'} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} initial={{ opacity: 0, scale: reduced ? 1 : .985, y: reduced ? 0 : 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: reduced ? 1 : .99, y: reduced ? 0 : 8, transition: { duration: .2, ease: EASE } }} transition={entry}>
        <div className="mr-case-close-wrap"><span>{labels.escape}</span><motion.button ref={close} type="button" className="mr-case-close" onClick={onClose} aria-label={labels.close} whileHover={reduced ? undefined : { y: -1 }} whileTap={reduced ? undefined : { scale: .985 }}><X size={17} /></motion.button></div>
        <div className="mr-case-panel" data-showcase-scroll>
          <aside className="mr-case-rail" tabIndex={0} aria-label={labels.projectInfo}>
            <motion.header className="mr-case-header" initial={{ opacity: 0, y: reduced ? 0 : 5 }} animate={{ opacity: 1, y: 0 }} transition={{ ...entry, delay: reduced ? 0 : .05 }}>
              <div className="mr-case-brand"><img src="/assets/mrlogo-short-white.png" alt="" width={29} height={29} /><span>{labels.brandTop}<br />{labels.brandBottom}</span></div>
              <div className="mr-case-heading"><p className="mr-case-eyebrow">{labels.eyebrow}</p><h2 id={titleId}>{labels.heading}</h2></div>
            </motion.header>
            <motion.nav className="mr-case-selector" aria-label={labels.selector} initial={{ opacity: 0, y: reduced ? 0 : 5 }} animate={{ opacity: 1, y: 0 }} transition={{ ...entry, delay: reduced ? 0 : .08 }}>
              <div className="mr-case-project-list">{WEB_MOCKS.map((item,i) => <motion.button key={item.slug} type="button" aria-pressed={projectId === item.slug} onClick={() => selectProject(item.slug)} whileTap={reduced ? undefined : { scale: .985 }}><span>{String(i+1).padStart(2,'0')}</span><span>{settings.projects[item.slug].navigation}</span><ArrowRight size={17} /></motion.button>)}</div>
              <div ref={selector} className="mr-case-project-select">
                <motion.button ref={trigger} className="mr-case-mobile-trigger" type="button" aria-label={labels.selector} aria-haspopup="listbox" aria-expanded={menuOpen} aria-controls={menuOpen ? menuId : undefined} onClick={() => { if (menuOpen) closeMenu(); else { setOptionIndex(index); setMenuOpen(true) } }} onKeyDown={event => { if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); setOptionIndex(index); setMenuOpen(true) } }} whileTap={reduced ? undefined : { scale: .985 }}>
                  <span>{String(index+1).padStart(2,'0')} / 03</span><span>{selected.navigation}</span><motion.span animate={{ rotate: menuOpen ? 180 : 0 }} transition={{ duration: reduced ? 0 : .22 }}><ChevronDown size={15} /></motion.span>
                </motion.button>
                <AnimatePresence>{menuOpen && <motion.ul ref={menu} id={menuId} className="mr-case-project-menu" role="listbox" aria-label={labels.selector} initial={{ opacity: 0, y: reduced ? 0 : -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : -4, transition: { duration: .2 } }} transition={{ duration: reduced ? .1 : motionSettings.dropdown / 1000, ease: EASE }} onKeyDown={event => {
                  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); setOptionIndex(i => (i + (event.key === 'ArrowDown' ? 1 : -1) + WEB_MOCKS.length) % WEB_MOCKS.length) }
                  else if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); setOptionIndex(event.key === 'Home' ? 0 : WEB_MOCKS.length-1) }
                  else if (event.key === 'Tab') closeMenu()
                }}>{WEB_MOCKS.map((item,i) => <motion.li key={item.slug} role="presentation" initial={{ opacity: 0, y: reduced ? 0 : -3 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .18, delay: reduced ? 0 : i * .03, ease: EASE }}><button ref={element => { options.current[i] = element }} type="button" role="option" tabIndex={optionIndex === i ? 0 : -1} aria-selected={projectId === item.slug} onClick={() => selectProject(item.slug)}><span>{String(i+1).padStart(2,'0')}</span>{settings.projects[item.slug].navigation}<ArrowRight size={14} /></button></motion.li>)}</motion.ul>}</AnimatePresence>
              </div>
            </motion.nav>
            <motion.div className="mr-case-identity" {...infoMotion}><p className="mr-case-eyebrow">{labels.featured}</p><h3>{project.title}</h3><ul className="mr-case-tags" aria-label={labels.services}>{project.services.split(',').map(tag => tag.trim()).filter(Boolean).map((tag,i) => <li key={`${i}-${tag}`}>{tag}</li>)}</ul></motion.div>
            <motion.p className="mr-case-description" {...infoMotion}>{project.description}</motion.p>
            <motion.div className="mr-case-outcome" {...infoMotion}><p>{project.stat}</p><span>{project.statDescription}</span></motion.div>
            <motion.dl className="mr-case-meta" {...infoMotion}><div><dt>{labels.industry}</dt><dd>{project.industry}</dd></div><div><dt>{labels.focus}</dt><dd>{project.focus}</dd></div></motion.dl>
          </aside>
          <section className="mr-case-stage" aria-label={`${project.title} ${labels.preview}`}>
            <div ref={scene} className="mr-case-scene">
              <div className="mr-case-material" aria-hidden="true"><i /><i /><i /><i /></div>
              <motion.div key={displayId} className="mr-case-visual-transition" variants={contentVariants} initial="hidden" animate={content} custom={2}>
                <AnimatePresence mode="wait" initial={false}><motion.div key={`${version}-${view}`} className={`mr-case-devices mr-case-view-${view}`} initial={{ opacity: 0, y: reduced ? 0 : 6, scale: reduced ? 1 : .992 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: reduced ? 0 : -4 }} transition={{ duration: reduced ? .1 : .13, ease: EASE }}>
                  <Devices id={displayId} version={version} copy={websiteCopy} settings={settings} reduced={reduced} />
                </motion.div></AnimatePresence>
              </motion.div>
            </div>
            <motion.div className="mr-case-compare-row" initial={{ opacity: 0, y: reduced ? 0 : 4 }} animate={{ opacity: 1, y: 0 }} transition={{ ...entry, delay: reduced ? 0 : motionSettings.stagger * 3 / 1000 }}><div className="mr-case-compare" role="group" aria-label={labels.websiteVersion}>{(['before','after'] as const).map(item => <motion.button key={item} type="button" aria-pressed={version === item} onClick={() => setVersion(item)} whileHover={reduced ? undefined : { y: -1 }} whileTap={reduced ? undefined : { scale: .985 }}>{labels[item]}</motion.button>)}</div></motion.div>
            <motion.div className="mr-case-gallery" role="group" aria-label={labels.websiteViews} initial={{ opacity: 0, y: reduced ? 0 : 4 }} animate={{ opacity: 1, y: 0 }} transition={{ ...entry, delay: reduced ? 0 : motionSettings.stagger * 4 / 1000 }}>
              <motion.div className="mr-case-thumbnails" variants={contentVariants} initial="hidden" animate={content} custom={4}>{(['homepage','mobile'] as const).map(item => <motion.button key={item} type="button" className="mr-case-thumbnail" aria-label={`${labels.showView}: ${labels[item]}`} aria-pressed={view === item} onClick={() => setView(item)} whileHover={reduced ? undefined : { y: -1 }} whileTap={reduced ? undefined : { scale: .985 }}><div className={`mr-case-thumb-image mr-case-thumb-${item}`}><WebsitePreview id={displayId} version={version} copy={websiteCopy} phone={item === 'mobile'} /></div><span>{labels[item]}</span>{view === item && <motion.i className="mr-case-active-indicator" layoutId={`view-${titleId}`} transition={{ duration: reduced ? 0 : .24, ease: EASE }} />}</motion.button>)}</motion.div>
            </motion.div>
          </section>
          <p className="mr-case-sr-only" role="status" aria-live="polite" aria-atomic="true">{project.title}. {labels[version]}. {labels[view]}.</p>
        </div>
        {import.meta.env.DEV && <SelectedWorkControls initial={settings} onChange={setSettings} />}
      </motion.div>
    </motion.div>, document.body,
  )
}
