'use client'

import { createContext, lazy, Suspense, useContext, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useIsPresent } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { Lottie } from 'lottie-react'
import type { ProofProject } from '@/lib/proofDefaults'
import { ProofCategoryIcon } from '@/lib/proofCategoryIcons'
import { TechStackPill } from '@/components/ui/tech-stack-pill'
import { BuildCaseStage } from '@/home/work-mockups/build-case-stages'
import { BrickworkPreview } from '@/components/ui/brickwork-preview'

// Merely opening Proof or rotating the homepage fan never invokes this import.
const DogGuardComparison = lazy(() => import('@/components/ui/dogguard-comparison'))
const BrickworkDashboard = lazy(() => import('@/components/ui/brickwork-dashboard'))
const ActiveProofProject = createContext<string | null>(null)

function DogGuardPoster() {
  return (
    <div className="flex flex-col items-center gap-3">
      <img
        src="/proof/dogguard-poster.webp"
        alt="Dog Guard of the Valley short-form creative"
        className="aspect-[9/16] rounded-2xl object-contain"
        style={{ width: 'min(100%, calc(min(48dvh, 420px) * 9 / 16))' }}
      />
      <p className="m-0 text-center font-nhg text-xs text-home-muted">Raw footage → finished short-form creative</p>
    </div>
  )
}

function AutoscrollClean({ image, title }: { image: string; title: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-home-line/25 bg-home-surface-dark">
      <div className="flex items-center gap-1.5 border-b border-home-line/20 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-home-on-dark/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-home-on-dark/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-home-on-dark/20" />
        <span className="ml-2 truncate font-nhg text-[10px] text-home-muted">{title}</span>
      </div>
      <div className="relative h-[280px] overflow-hidden md:h-[360px]">
        <motion.img
          src={image}
          alt=""
          className="absolute inset-x-0 top-0 w-full object-cover object-top"
          style={{ height: '165%' }}
          animate={{ y: ['0%', '-42%', '0%'] }}
          transition={{ duration: 8, ease: 'easeInOut', repeat: Infinity }}
        />
      </div>
    </div>
  )
}

/** Web Dev after-homepage, same chrome as Selected Builds */
function BuildCaseHomepage({ project }: { project: ProofProject }) {
  if (!project.buildCaseId) {
    return (
      <AutoscrollClean
        image={project.detailImage || project.image}
        title={project.title}
      />
    )
  }
  return (
    <div className="overflow-hidden rounded-2xl border border-home-line/25 bg-home-surface-dark [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="relative h-[280px] overflow-hidden md:h-[360px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <motion.div
          className="absolute inset-x-0 top-0 w-full overflow-hidden"
          style={{ height: '165%' }}
          animate={{ y: ['0%', '-28%', '0%'] }}
          transition={{ duration: 10, ease: 'easeInOut', repeat: Infinity }}
        >
          <BuildCaseStage
            id={project.buildCaseId}
            version="after"
            className="h-full rounded-none border-0 overflow-hidden"
          />
        </motion.div>
      </div>
    </div>
  )
}

function LottiePreview({ src }: { src?: string }) {
  return (
    <div className="flex h-[280px] items-center justify-center overflow-hidden rounded-2xl border border-home-line/25 bg-home-surface-dark md:h-[360px]">
      {src ? (
        <Lottie src={src} loop autoplay className="h-[70%] w-[70%]" />
      ) : (
        <p className="font-nhg text-sm text-home-muted">Add mediaUrl for Lottie</p>
      )}
    </div>
  )
}

function MediaPane({ project }: { project: ProofProject }) {
  const activeId = useContext(ActiveProofProject)
  if (project.visualType === 'video-comparison') {
    // Exiting animated projects retain their old props, but see the live context.
    if (activeId !== project.id) return <DogGuardPoster />
    return <Suspense fallback={<DogGuardPoster />}><DogGuardComparison /></Suspense>
  }
  if (project.visualType === 'brickwork-dashboard') {
    const preview = <BrickworkPreview sizeClass="aspect-[720/460] w-full rounded-2xl" />
    if (activeId !== project.id) return preview
    return <Suspense fallback={preview}><BrickworkDashboard /></Suspense>
  }
  if (project.visualType === 'lottie') return <LottiePreview src={project.mediaUrl} />
  if (project.visualType === 'build-case' || project.buildCaseId) {
    return <BuildCaseHomepage project={project} />
  }
  return (
    <AutoscrollClean
      image={project.detailImage || project.image}
      title={project.title}
    />
  )
}

type Props = {
  project: ProofProject
  projects: ProofProject[]
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  titleSize?: number
}

export default function ProofShowcaseModal({
  project,
  projects,
  onClose,
  onPrev,
  onNext,
  titleSize = 28,
}: Props) {
  const isPresent = useIsPresent()
  const tallMedia = project.visualType === 'video-comparison' || project.visualType === 'brickwork-dashboard'
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose, onPrev, onNext])

  const idx = projects.findIndex((p) => p.id === project.id)

  const ui = (
    <motion.div
      className="fixed inset-0 z-[80] flex items-center justify-center p-3 md:p-6"
      role="dialog"
      aria-modal
      aria-label="Project showcase"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <button
        type="button"
        className="absolute inset-0 bg-home-bg-dark/70 backdrop-blur-[12px]"
        aria-label="Close showcase"
        onClick={onClose}
      />

      <motion.div
        className="relative z-10 flex max-h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-home-line/25 bg-home-surface-dark shadow-[0_40px_100px_rgba(0,0,0,0.55)]"
        initial={{ opacity: 0, scale: 0.97, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 8 }}
        transition={{ duration: 0.38, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center justify-between gap-3 border-b border-home-line/20 px-4 py-3 md:px-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={`head-${project.id}`}
              className="flex min-w-0 items-center gap-2"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
            >
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-home-surface-light px-2.5 py-1 font-nhg text-[11px] font-medium text-home-on-light">
                <ProofCategoryIcon category={project.category} className="text-home-muted" />
                {project.categoryIcon}
              </span>
              <span className="truncate font-nhg text-sm font-semibold text-home-on-dark">{project.title}</span>
            </motion.div>
          </AnimatePresence>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-home-line/25 text-home-muted transition hover:bg-home-on-dark/5 hover:text-home-on-dark"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <ActiveProofProject.Provider value={isPresent ? project.id : null}>
        <AnimatePresence mode="wait">
          <motion.div
            key={project.id}
            className={`grid min-h-0 flex-1 grid-cols-1 overflow-y-auto md:grid-cols-5 md:overflow-hidden${tallMedia ? ' auto-rows-max md:auto-rows-auto' : ''}`}
            data-lenis-prevent={tallMedia ? '' : undefined}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={project.visualType === 'brickwork-dashboard' ? 'min-w-0 p-4 md:col-span-3 md:min-h-0 md:overflow-y-auto md:p-5' : project.visualType === 'video-comparison' ? 'p-4 md:col-span-3 md:min-h-0 md:overflow-hidden md:p-5' : 'min-h-0 overflow-hidden p-4 md:col-span-3 md:p-5'}>
              <MediaPane project={project} />
            </div>
            <div className="flex flex-col border-t border-home-line/20 p-4 md:col-span-2 md:border-l md:border-t-0 md:p-5">
              <p className="m-0 font-nhg text-[11px] uppercase tracking-[0.14em] text-home-muted">
                {project.tag}
              </p>
              <div className="mt-2 flex items-center gap-3">
                <h3
                  className="m-0 font-nhg font-semibold tracking-tight text-home-on-dark"
                  style={{ fontSize: titleSize }}
                >
                  {project.title}
                </h3>
                {project.logoUrl ? (
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-home-surface-light p-1.5 shadow-sm">
                    <img src={project.logoUrl} alt="" className="h-full w-full object-contain" />
                  </span>
                ) : null}
              </div>
              <p className="mt-4 m-0 font-nhg text-2xl font-semibold tracking-tight text-home-acid md:text-3xl">
                {project.metricHighlight}
              </p>
              <ul className="mt-5 space-y-2.5 p-0">
                {project.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 font-nhg text-sm text-home-muted">
                    <Check size={14} className="mt-0.5 shrink-0 text-home-acid" aria-hidden />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {project.techStack.map((tech) => (
                  <TechStackPill key={tech} name={tech} />
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        </ActiveProofProject.Provider>

        <div className="flex flex-col gap-3 border-t border-home-line/20 px-4 py-3 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:px-5">
          <p className="m-0 order-1 font-nhg text-[11px] text-home-muted md:order-none">
            {Math.max(1, idx + 1)} / {projects.length}
          </p>
          <div className="order-3 flex justify-center gap-2 md:order-none">
            <button
              type="button"
              onClick={onPrev}
              disabled={projects.length < 2}
              className="rounded-[10px] border border-home-line/30 px-3 py-2 font-nhg text-[12px] text-home-on-dark/80 transition hover:bg-home-on-dark/5 disabled:opacity-40"
            >
              ← Previous
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={projects.length < 2}
              className="rounded-[10px] border border-home-line/30 px-3 py-2 font-nhg text-[12px] text-home-on-dark/80 transition hover:bg-home-on-dark/5 disabled:opacity-40"
            >
              Next →
            </button>
          </div>
          <a
            href="#get-started"
            onClick={onClose}
            className="order-2 inline-flex w-full items-center justify-center rounded-[10px] bg-home-acid px-3 py-2 font-nhg text-[12px] font-medium text-home-on-light no-underline transition hover:opacity-90 md:order-none md:w-auto md:justify-self-end md:px-4 md:py-2.5 md:text-[13px]"
          >
            Need something like this? →
          </a>
        </div>
      </motion.div>
    </motion.div>
  )

  const mount = document.getElementById('home-page') ?? document.body
  return createPortal(ui, mount)
}
