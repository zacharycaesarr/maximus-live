'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { Lottie } from 'lottie-react'
import type { ProofProject } from '@/lib/proofDefaults'
import { ProofCategoryIcon } from '@/lib/proofCategoryIcons'
import { TechStackPill } from '@/components/ui/tech-stack-pill'

function AutoscrollClean({ image, title }: { image: string; title: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#1a1816]">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="ml-2 truncate font-nhg text-[10px] text-white/35">{title}</span>
      </div>
      <div className="relative h-[280px] overflow-hidden md:h-[360px]">
        <motion.img
          src={image}
          alt=""
          className="absolute inset-x-0 top-0 w-full"
          style={{ height: '165%' }}
          animate={{ y: ['0%', '-42%', '0%'] }}
          transition={{ duration: 8, ease: 'easeInOut', repeat: Infinity }}
        />
      </div>
    </div>
  )
}

function AdsCockpit() {
  const bars = [42, 68, 55, 80, 62, 90, 74]
  return (
    <div className="flex h-full min-h-[280px] flex-col rounded-2xl border border-white/10 bg-[#121110] p-5 md:min-h-[360px]">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 font-nhg text-[11px] font-medium text-emerald-400">
          ROAS 4.2x
        </span>
        <span className="rounded-full bg-white/10 px-2.5 py-1 font-nhg text-[11px] text-white/70">
          Live leads · 18
        </span>
      </div>
      <div className="mt-8 flex flex-1 items-end gap-2 px-1">
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-md bg-gradient-to-t from-mocha/40 to-[#c4a574]"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <p className="mt-4 m-0 font-nhg text-[11px] text-white/35">7-day paid acquisition</p>
    </div>
  )
}

function LottiePreview({ src }: { src?: string }) {
  return (
    <div className="flex h-[280px] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#121110] md:h-[360px]">
      {src ? (
        <Lottie src={src} loop autoplay className="h-[70%] w-[70%]" />
      ) : (
        <p className="font-nhg text-sm text-white/40">Add mediaUrl for Lottie</p>
      )}
    </div>
  )
}

function MediaPane({ project }: { project: ProofProject }) {
  if (project.visualType === 'ads-cockpit') return <AdsCockpit />
  if (project.visualType === 'lottie') return <LottiePreview src={project.mediaUrl} />
  return <AutoscrollClean image={project.image} title={project.title} />
}

type Props = {
  project: ProofProject
  projects: ProofProject[]
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  titleSize?: number
}

/** Shell stays open; Previous/Next swap content in place. */
export default function ProofShowcaseModal({
  project,
  projects,
  onClose,
  onPrev,
  onNext,
  titleSize = 28,
}: Props) {
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
        className="absolute inset-0 bg-[#0a0908]/72 backdrop-blur-[12px]"
        aria-label="Close showcase"
        onClick={onClose}
      />

      <motion.div
        className="relative z-10 flex max-h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#141210] shadow-[0_40px_100px_rgba(0,0,0,0.55)]"
        initial={{ opacity: 0, scale: 0.97, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 8 }}
        transition={{ duration: 0.38, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 md:px-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={`head-${project.id}`}
              className="flex min-w-0 items-center gap-2"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
            >
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#efeae2] px-2.5 py-1 font-nhg text-[11px] font-medium text-espresso">
                <ProofCategoryIcon category={project.category} className="text-espresso/70" />
                {project.categoryIcon}
              </span>
              <span className="truncate font-nhg text-sm font-semibold text-white">{project.title}</span>
            </motion.div>
          </AnimatePresence>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/70 transition hover:bg-white/5 hover:text-white"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={project.id}
            className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto md:grid-cols-5"
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="p-4 md:col-span-3 md:p-5">
              <MediaPane project={project} />
            </div>
            <div className="flex flex-col border-t border-white/10 p-4 md:col-span-2 md:border-l md:border-t-0 md:p-5">
              <p className="m-0 font-nhg text-[11px] uppercase tracking-[0.14em] text-white/35">{project.tag}</p>
              <h3
                className="mt-2 m-0 font-nhg font-semibold tracking-tight text-white"
                style={{ fontSize: titleSize }}
              >
                {project.title}
              </h3>
              <p className="mt-4 m-0 font-nhg text-2xl font-semibold tracking-tight text-[#c4a574] md:text-3xl">
                {project.metricHighlight}
              </p>
              <ul className="mt-5 space-y-2.5 p-0">
                {project.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 font-nhg text-sm text-white/70">
                    <Check size={14} className="mt-0.5 shrink-0 text-[#c4a574]" aria-hidden />
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

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-t border-white/10 px-4 py-3 md:px-5">
          <p className="m-0 font-nhg text-[11px] text-white/40">
            {Math.max(1, idx + 1)} / {projects.length}
          </p>
          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={onPrev}
              disabled={projects.length < 2}
              className="rounded-[10px] border border-white/12 px-3 py-2 font-nhg text-[12px] text-white/75 transition hover:bg-white/5 disabled:opacity-40"
            >
              ← Previous
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={projects.length < 2}
              className="rounded-[10px] border border-white/12 px-3 py-2 font-nhg text-[12px] text-white/75 transition hover:bg-white/5 disabled:opacity-40"
            >
              Next →
            </button>
          </div>
          <a
            href="#get-started"
            onClick={onClose}
            className="inline-flex items-center justify-self-end rounded-[10px] bg-[#efeae2] px-4 py-2.5 font-nhg text-[13px] font-medium text-espresso no-underline transition hover:bg-white"
          >
            Need something like this? →
          </a>
        </div>
      </motion.div>
    </motion.div>
  )

  return createPortal(ui, document.body)
}
