'use client'

import { AnimatePresence, motion, useInView } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Lottie } from 'lottie-react'
import { cn } from '@/lib/utils'
import { parseProofProjects, type ProofProject } from '@/lib/proofDefaults'
import { useProofTuner } from '@/context/ProofTunerContext'
import ProofShowcaseModal from '@/components/ui/proof-showcase-modal'
import { BuildCaseHoverCard } from '@/work-mockups/build-case-stages'
import { BrickworkPreview } from '@/components/ui/brickwork-preview'
import { useDocumentVisible } from '@/hooks/useDocumentVisible'

const springTransition = {
  type: 'spring' as const,
  stiffness: 60,
  damping: 16,
  mass: 0.7,
}

const RADIUS_MIN = 140
const RADIUS_MAX = 380
const RADIUS_WIDTH_RATIO = 0.58
const PERSPECTIVE_MULTIPLIER = 2.4
const RING_TILT_DEG = 38
const CROSSFADE_DURATION_S = 0.45
const CROSSFADE_EASE = [0.22, 1, 0.36, 1] as const

const ImageLoader = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-black/5">
    <div className="aspect-square w-1/4 animate-spin rounded-full border-2 border-home-line/40 border-t-home-on-light/50" />
  </div>
)

const BUILD_CASE_W = 720
const BUILD_CASE_H = 460
/** Landscape face matching the homepage mock so the full page fits (no zoom crop). */
const FAN_THUMB =
  'aspect-[720/460] h-auto w-20 sm:w-24 md:w-32 lg:w-36'
const FAN_CENTER =
  'aspect-[720/460] h-auto w-[min(92vw,22rem)] sm:w-[26rem] md:w-[32rem] lg:w-[36rem]'

function LottieFanFace({
  src,
  sizeClass,
  onReady,
  filter,
  opacity,
}: {
  src?: string
  sizeClass: string
  onReady?: () => void
  filter?: string
  opacity?: number
}) {
  useEffect(() => {
    onReady?.()
  }, [onReady])

  return (
    <div
      className={cn('relative flex items-center justify-center overflow-hidden bg-[#121110]', sizeClass)}
      style={{ filter, opacity }}
    >
      {src ? (
        <Lottie src={src} loop autoplay className="h-[78%] w-[78%]" />
      ) : (
        <span className="font-nhg text-[8px] text-white/35">Lottie</span>
      )}
    </div>
  )
}

function BuildCaseFanFace({
  buildCaseId,
  sizeClass,
  onReady,
  filter,
  opacity,
}: {
  buildCaseId: ProofProject['buildCaseId']
  sizeClass: string
  onReady?: () => void
  filter?: string
  opacity?: number
}) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [layout, setLayout] = useState({ scale: 0.25, x: 0, y: 0 })

  useEffect(() => {
    onReady?.()
  }, [onReady])

  useEffect(() => {
    const el = hostRef.current
    if (!el) return
    const measure = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      if (w < 1 || h < 1) return
      // Box aspect matches the mock (see FAN_FACE_ASPECT), so contain = exact fit.
      const scale = Math.min(w / BUILD_CASE_W, h / BUILD_CASE_H)
      setLayout({
        scale,
        x: (w - BUILD_CASE_W * scale) / 2,
        y: (h - BUILD_CASE_H * scale) / 2,
      })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div
      ref={hostRef}
      className={cn('relative overflow-hidden bg-[#111110]', sizeClass)}
      style={{ filter, opacity }}
    >
      <div
        className="pointer-events-none absolute left-0 top-0 origin-top-left"
        style={{
          width: BUILD_CASE_W,
          height: BUILD_CASE_H,
          transform: `translate(${layout.x}px, ${layout.y}px) scale(${layout.scale})`,
        }}
      >
        <BuildCaseHoverCard id={buildCaseId!} className="h-full w-full" />
      </div>
    </div>
  )
}

/** Fan face: build case cover-fill, ads mini widget, else photo */
function ProofFace({
  project,
  sizeClass,
  onReady,
  filter,
  opacity,
}: {
  project: ProofProject
  sizeClass: string
  onReady?: () => void
  filter?: string
  opacity?: number
}) {
  if (project.buildCaseId) {
    return (
      <BuildCaseFanFace
        buildCaseId={project.buildCaseId}
        sizeClass={sizeClass}
        onReady={onReady}
        filter={filter}
        opacity={opacity}
      />
    )
  }

  if (project.visualType === 'brickwork-dashboard') {
    return (
      <BrickworkPreview
        sizeClass={sizeClass}
        onReady={onReady}
        filter={filter}
        opacity={opacity}
      />
    )
  }

  if (project.visualType === 'lottie' || project.mediaUrl?.endsWith('.json')) {
    return (
      <LottieFanFace
        src={project.mediaUrl}
        sizeClass={sizeClass}
        onReady={onReady}
        filter={filter}
        opacity={opacity}
      />
    )
  }

  return (
    <img
      src={project.image}
      alt=""
      width={720}
      height={460}
      loading="lazy"
      decoding="async"
      onLoad={onReady}
      className={cn('object-cover transition-[filter,opacity] duration-300', sizeClass)}
      style={{ filter, opacity }}
    />
  )
}

/**
 * Fan carousel stays the same while scrolling.
 * Click opens dark morph showcase (ProofShowcaseModal).
 */
export function ImageFanCarousel({ className }: { className?: string }) {
  const proof = useProofTuner()
  const projects = useMemo(() => parseProofProjects(proof.projectsJson), [proof.projectsJson])

  const containerRef = useRef<HTMLDivElement>(null)
  const visible = useInView(containerRef, { margin: '10% 0px' })
  const documentVisible = useDocumentVisible()
  const [rotation, setRotation] = useState(0)
  const [radius, setRadius] = useState(240)
  const [loadedThumbs, setLoadedThumbs] = useState<boolean[]>(() => projects.map(() => false))
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [paused, setPaused] = useState(false)
  const [autoplayEpoch, setAutoplayEpoch] = useState(0)

  const numImages = Math.max(projects.length, 1)
  const angleStep = 360 / numImages
  const steps = Math.round(rotation / angleStep)
  const centerIndex = ((-steps % numImages) + numImages) % numImages
  const centerProject = projects[centerIndex]

  const [prevCenterIndex, setPrevCenterIndex] = useState(centerIndex)
  const [centerLoaded, setCenterLoaded] = useState(false)
  if (centerIndex !== prevCenterIndex) {
    setPrevCenterIndex(centerIndex)
    setCenterLoaded(false)
  }

  const expanded = expandedId ? projects.find((p) => p.id === expandedId) ?? null : null

  useEffect(() => {
    const updateRadius = () => {
      if (!containerRef.current) return
      const width = containerRef.current.offsetWidth
      setRadius(Math.max(RADIUS_MIN, Math.min(RADIUS_MAX, width * RADIUS_WIDTH_RATIO)))
    }
    updateRadius()
    window.addEventListener('resize', updateRadius)
    return () => window.removeEventListener('resize', updateRadius)
  }, [])

  useEffect(() => {
    if (paused || expanded || !visible || !documentVisible) return undefined
    const interval = window.setInterval(() => {
      // Negative step = next project (matches ArrowRight)
      setRotation((prev) => prev - angleStep)
    }, proof.autoplayMs)
    return () => window.clearInterval(interval)
  }, [angleStep, proof.autoplayMs, paused, expanded, autoplayEpoch, visible, documentVisible])

  useEffect(() => {
    if (!proof.previewExpanded || !proof.expandEnabled) return
    const i = Math.max(0, Math.min(projects.length - 1, (proof.editClientIndex || 1) - 1))
    const p = projects[i]
    if (p) {
      setExpandedId(p.id)
      setPaused(true)
    }
  }, [proof.previewExpanded, proof.editClientIndex, proof.expandEnabled, projects])

  const rotateCarousel = useCallback(
    (direction: 'left' | 'right') => {
      // Fan math: decreasing rotation brings the next project to center.
      setRotation((prev) => prev + (direction === 'left' ? angleStep : -angleStep))
      // Restart autoplay clock so a quick back-click does not get stomped.
      setAutoplayEpoch((n) => n + 1)
    },
    [angleStep],
  )

  const markThumbLoaded = useCallback((index: number) => {
    setLoadedThumbs((prev) => {
      if (prev[index]) return prev
      const next = [...prev]
      next[index] = true
      return next
    })
  }, [])

  const openDetail = (project: ProofProject) => {
    if (!proof.expandEnabled) return
    setExpandedId(project.id)
    setPaused(true)
  }

  const closeDetail = () => {
    setExpandedId(null)
    setPaused(false)
  }

  const cycle = (dir: -1 | 1) => {
    if (!expanded || projects.length < 2) return
    const i = projects.findIndex((p) => p.id === expanded.id)
    const next = projects[(i + dir + projects.length) % projects.length]
    setExpandedId(next.id)
  }

  const thumbScale = proof.thumbScale
  const centerScale = proof.centerScale

  return (
    <div className={cn('proof-fan relative w-full select-none py-6 sm:py-10', className)}>
      <div className="relative flex w-full flex-col items-center justify-center">
        <div
          ref={containerRef}
          className="proof-fan-stage relative flex aspect-[5/3] w-[96%] max-w-3xl items-center justify-center"
        >
          <div
            className="proof-fan-orbit relative h-full w-full"
            style={{ perspective: radius * PERSPECTIVE_MULTIPLIER }}
          >
            {projects.map((project, index) => {
              const targetAngle = rotation + angleStep * index
              const normalized = ((targetAngle % 360) + 360) % 360
              const distFromFront = Math.min(normalized, 360 - normalized)
              const depth = distFromFront / 180
              const blur = depth * proof.backBlurPx
              const opacity = 1 - depth * (1 - proof.backOpacity)

              return (
                <motion.div
                  key={project.id}
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ transformStyle: 'preserve-3d' }}
                  animate={{ rotateY: targetAngle }}
                  transition={springTransition}
                >
                  <motion.button
                    type="button"
                    className="relative cursor-pointer overflow-hidden rounded-lg shadow-[0_6px_20px_rgba(0,0,0,0.15)] sm:rounded-xl"
                    style={{
                      transformStyle: 'preserve-3d',
                      border: 'none',
                      padding: 0,
                      background: 'transparent',
                    }}
                    animate={{
                      rotateY: -targetAngle,
                      rotateX: RING_TILT_DEG,
                      z: radius,
                      scale: thumbScale,
                    }}
                    transition={springTransition}
                    onClick={() => openDetail(project)}
                    aria-label={`Open ${project.title}`}
                  >
                    {!loadedThumbs[index] && <ImageLoader />}
                    <ProofFace
                      project={project}
                      sizeClass={cn(
                        FAN_THUMB,
                        loadedThumbs[index] ? 'opacity-90' : 'opacity-0',
                      )}
                      onReady={() => markThumbLoaded(index)}
                      filter={blur > 0.2 ? `blur(${blur}px)` : undefined}
                      opacity={loadedThumbs[index] ? opacity : 0}
                    />
                  </motion.button>
                </motion.div>
              )
            })}
          </div>

          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.button
                key={centerIndex}
                layoutId={centerProject ? `proof-card-${centerProject.id}` : undefined}
                type="button"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: centerScale }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: CROSSFADE_DURATION_S, ease: CROSSFADE_EASE }}
                className="proof-fan-center pointer-events-auto relative cursor-pointer overflow-hidden rounded-2xl border-0 bg-transparent p-0 shadow-[0_10px_35px_rgba(0,0,0,0.18)]"
                onClick={() => centerProject && openDetail(centerProject)}
                aria-label={centerProject ? `Open ${centerProject.title}` : 'Open project'}
              >
                {!centerLoaded && <ImageLoader />}
                {centerProject ? (
                  <ProofFace
                    project={centerProject}
                    sizeClass={cn(
                      'proof-fan-face',
                      FAN_CENTER,
                      centerLoaded ? 'opacity-100' : 'opacity-0',
                    )}
                    onReady={() => setCenterLoaded(true)}
                  />
                ) : null}
              </motion.button>
            </AnimatePresence>
          </div>
        </div>

        <div className="z-30 mt-6 flex items-center gap-3 sm:mt-8">
          <NavBtn label="Previous image" onClick={() => rotateCarousel('left')}>
            <ArrowLeft className="relative z-10 h-3 w-3" />
          </NavBtn>
          <NavBtn label="Next image" onClick={() => rotateCarousel('right')}>
            <ArrowRight className="relative z-10 h-3 w-3" />
          </NavBtn>
        </div>
      </div>

      <AnimatePresence>
        {expanded ? (
          <ProofShowcaseModal
            project={expanded}
            projects={projects}
            onClose={closeDetail}
            onPrev={() => cycle(-1)}
            onNext={() => cycle(1)}
            titleSize={proof.detailTitleSize}
          />
        ) : null}
      </AnimatePresence>
    </div>
  )
}

function NavBtn({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="group relative flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full shadow-sm shadow-black/10 transition-transform duration-200 active:scale-90 sm:h-11 sm:w-11"
    >
      <span className="absolute inset-0 rounded-full border border-home-line/50 bg-home-surface-light/80 backdrop-blur-lg transition-all duration-200 group-hover:bg-home-surface-light" />
      <span className="relative z-10 text-home-on-light/70 group-hover:text-home-on-light">{children}</span>
    </button>
  )
}

export default ImageFanCarousel
