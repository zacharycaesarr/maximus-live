'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { parseProofProjects, type ProofProject } from '@/lib/proofDefaults'
import { useProofTuner } from '@/context/ProofTunerContext'
import ProofShowcaseModal from '@/components/ui/proof-showcase-modal'

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
    <div className="aspect-square w-1/4 animate-spin rounded-full border-2 border-espresso/15 border-t-espresso/50" />
  </div>
)

/**
 * Fan carousel stays the same while scrolling.
 * Click opens dark morph showcase (ProofShowcaseModal).
 */
export function ImageFanCarousel({ className }: { className?: string }) {
  const proof = useProofTuner()
  const projects = useMemo(() => parseProofProjects(proof.projectsJson), [proof.projectsJson])
  const images = projects.map((p) => p.image)

  const containerRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState(0)
  const [radius, setRadius] = useState(240)
  const [loadedThumbs, setLoadedThumbs] = useState<boolean[]>(() => images.map(() => false))
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [paused, setPaused] = useState(false)

  const numImages = Math.max(images.length, 1)
  const angleStep = 360 / numImages
  const steps = Math.round(rotation / angleStep)
  const centerIndex = ((-steps % numImages) + numImages) % numImages
  const centerImage = images[centerIndex]
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
    if (paused || expanded) return undefined
    const interval = window.setInterval(() => {
      setRotation((prev) => prev + angleStep)
    }, proof.autoplayMs)
    return () => window.clearInterval(interval)
  }, [angleStep, proof.autoplayMs, paused, expanded])

  // Leva: open the client being edited
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
      setRotation((prev) => prev + (direction === 'left' ? -angleStep : angleStep))
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
    <div className={cn('relative w-full select-none py-6 sm:py-10', className)}>
      <div className="relative flex w-full flex-col items-center justify-center">
        <div
          ref={containerRef}
          className="relative flex aspect-[5/3] w-[96%] max-w-3xl items-center justify-center"
        >
          <div
            className="relative h-full w-full"
            style={{ perspective: radius * PERSPECTIVE_MULTIPLIER }}
          >
            {images.map((item, index) => {
              const targetAngle = rotation + angleStep * index
              const normalized = ((targetAngle % 360) + 360) % 360
              const distFromFront = Math.min(normalized, 360 - normalized)
              const depth = distFromFront / 180
              const blur = depth * proof.backBlurPx
              const opacity = 1 - depth * (1 - proof.backOpacity)

              return (
                <motion.div
                  key={`${item}-${index}`}
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
                    onClick={() => openDetail(projects[index])}
                    aria-label={`Open ${projects[index]?.title ?? 'project'}`}
                  >
                    {!loadedThumbs[index] && <ImageLoader />}
                    <img
                      src={item}
                      alt=""
                      onLoad={() => markThumbLoaded(index)}
                      className={cn(
                        'h-16 w-16 object-cover transition-[filter,opacity] duration-300 sm:h-20 sm:w-20 md:h-28 md:w-28 lg:h-32 lg:w-32',
                        loadedThumbs[index] ? 'opacity-90' : 'opacity-0',
                      )}
                      style={{
                        filter: blur > 0.2 ? `blur(${blur}px)` : undefined,
                        opacity: loadedThumbs[index] ? opacity : 0,
                      }}
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
                className="pointer-events-auto relative cursor-pointer overflow-hidden rounded-2xl border-0 bg-transparent p-0 shadow-[0_10px_35px_rgba(0,0,0,0.18)]"
                onClick={() => centerProject && openDetail(centerProject)}
                aria-label={centerProject ? `Open ${centerProject.title}` : 'Open project'}
              >
                {!centerLoaded && <ImageLoader />}
                <img
                  src={centerImage}
                  alt=""
                  loading="lazy"
                  onLoad={() => setCenterLoaded(true)}
                  className={cn(
                    'h-52 w-52 object-cover transition-opacity duration-300 sm:h-56 sm:w-56 md:h-72 md:w-72 lg:h-80 lg:w-80',
                    centerLoaded ? 'opacity-100' : 'opacity-0',
                  )}
                />
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
      <span className="absolute inset-0 rounded-full border border-espresso/15 bg-white/70 backdrop-blur-lg transition-all duration-200 group-hover:bg-white/90" />
      <span className="relative z-10 text-espresso/70 group-hover:text-espresso">{children}</span>
    </button>
  )
}

export default ImageFanCarousel
