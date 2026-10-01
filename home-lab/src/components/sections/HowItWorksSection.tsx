'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring, useTransform, useReducedMotion } from 'framer-motion'
import { useHowItWorksTuner } from '@/context/HowItWorksTunerContext'
import { cn } from '@/lib/utils'

type CardCopy = { tag: string; title: string; body: string }

type StepCardData = CardCopy & {
  art: string
  artScale: number
  artOpacity: number
  artX: number
  artY: number
}

function StepCard({ card }: { card: StepCardData }) {
  return (
    <article className="group relative flex min-h-[380px] flex-col overflow-hidden rounded-2xl border border-[#080909]/12 bg-home-surface-light p-5 transition-[transform,box-shadow] duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-3.5 hover:shadow-[0_32px_56px_rgba(0,0,0,0.35)] md:min-h-[460px] md:p-6">
      {/* Decorative PNG — floats on card bg, clipped by overflow. No wrapper bg. */}
      <img
        src={card.art}
        alt=""
        aria-hidden
        loading="lazy"
        decoding="async"
        draggable={false}
        className="pointer-events-none absolute bottom-0 left-1/2 z-0 w-[clamp(11rem,72%,20rem)] max-w-none select-none object-contain object-bottom"
        style={{
          opacity: card.artOpacity,
          transform: `translate(calc(-50% + ${card.artX}px), ${card.artY}px) scale(${card.artScale})`,
          transformOrigin: 'center bottom',
        }}
      />
      <div className="relative z-[1]">
        <p className="m-0 font-nhg text-[11px] font-medium tracking-[0.14em] text-[#657064]">{card.tag}</p>
        <h3 className="mt-3 m-0 font-nhg text-[1.15rem] font-semibold leading-snug tracking-tight text-home-on-light md:text-[1.35rem]">
          {card.title}
        </h3>
        <p className="mt-3 m-0 font-nhg text-sm leading-relaxed text-[#58635a] md:text-[15px]">{card.body}</p>
      </div>
    </article>
  )
}

function highlightSubtitle(text: string, highlight: string) {
  if (!highlight.trim()) return <span className="text-[#aeb8ad]">{text}</span>
  const idx = text.toLowerCase().indexOf(highlight.toLowerCase())
  if (idx < 0) return <span className="text-[#aeb8ad]">{text}</span>
  return (
    <>
      <span className="text-[#aeb8ad]">{text.slice(0, idx)}</span>
      <span className="font-medium text-home-on-dark">{text.slice(idx, idx + highlight.length)}</span>
      <span className="text-[#aeb8ad]">{text.slice(idx + highlight.length)}</span>
    </>
  )
}

function InvertedFillet({
  side,
  fill,
  size,
  offsetX,
  offsetY,
  rotate,
}: {
  side: 'left' | 'right'
  fill: string
  size: number
  offsetX: number
  offsetY: number
  rotate: number
}) {
  const grad =
    side === 'left'
      ? `radial-gradient(circle at 100% 0%, transparent 70.7%, ${fill} 71%)`
      : `radial-gradient(circle at 0% 0%, transparent 70.7%, ${fill} 71%)`
  return (
    <div
      className={cn('pointer-events-none absolute top-0 z-20', side === 'left' ? 'right-full' : 'left-full')}
      style={{
        width: size,
        height: size,
        background: grad,
        transform: `translate(${offsetX}px, ${offsetY}px) rotate(${rotate}deg)`,
        transformOrigin: side === 'left' ? '100% 0%' : '0% 0%',
      }}
      aria-hidden
    />
  )
}

function MobileHowAccordion({ cards }: { cards: CardCopy[] }) {
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(0)
  const baseId = useId()
  const dur = reduce ? 0.01 : 0.42

  return (
    <div className="mx-auto w-full max-w-lg px-1">
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {cards.map((card, i) => {
          const isOpen = open === i
          const panelId = `${baseId}-panel-${i}`
          const btnId = `${baseId}-btn-${i}`
          return (
            <li
              key={card.tag}
              className={cn(
                'relative overflow-hidden rounded-2xl border transition-[border-color,box-shadow,background] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
                isOpen
                  ? 'border-home-acid/55 bg-[#FAF8F2] shadow-[0_0_0_1px_color-mix(in_srgb,var(--home-acid)_16%,transparent),0_12px_28px_-16px_rgba(0,0,0,0.25)]'
                  : 'border-[#080909]/15 bg-[#F3F0E8]',
              )}
            >
              {isOpen && !reduce ? (
                <span
                  className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-2xl"
                  aria-hidden
                >
                  <span className="mr-how-sweep absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-[#C8FF3D]/10 to-transparent" />
                </span>
              ) : null}

              <button
                type="button"
                id={btnId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="relative z-[1] flex w-full items-center gap-3 px-3.5 py-3.5 text-left"
                onClick={() => setOpen((prev) => (prev === i ? -1 : i))}
              >
                <motion.span
                  className="shrink-0 font-nhg text-[11px] font-medium tracking-[0.16em] text-[#465645]"
                  animate={
                    reduce
                      ? undefined
                      : { x: isOpen ? 2 : 0, y: isOpen ? -1 : 0 }
                  }
                  transition={{ duration: dur, ease: [0.22, 1, 0.36, 1] }}
                >
                  {card.tag}
                </motion.span>
                <motion.span
                  className="min-w-0 flex-1 font-nhg text-[14px] font-semibold leading-snug tracking-tight text-[#080909]"
                  animate={reduce ? undefined : { x: isOpen ? 3 : 0 }}
                  transition={{ duration: dur, ease: [0.22, 1, 0.36, 1] }}
                >
                  {card.title}
                </motion.span>
                <motion.span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#080909]/25 text-[#080909]"
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: dur, ease: [0.22, 1, 0.36, 1] }}
                  aria-hidden
                >
                  <span className="relative block h-3 w-3">
                    <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
                    <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
                  </span>
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-labelledby={btnId}
                    key="body"
                    initial={reduce ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={reduce ? { height: 0, opacity: 0 } : { height: 0, opacity: 0 }}
                    transition={{ duration: dur, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-[1] overflow-hidden"
                  >
                    <motion.p
                      className="m-0 px-3.5 pb-3.5 pt-0 font-nhg text-[13px] leading-relaxed text-[#4d554d]"
                      initial={reduce ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduce ? undefined : { opacity: 0, y: 4 }}
                      transition={{ duration: dur * 0.9, ease: [0.22, 1, 0.36, 1], delay: reduce ? 0 : 0.04 }}
                    >
                      {card.body}
                    </motion.p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </li>
          )
        })}
      </ul>
      <style>{`
        @keyframes mr-how-sweep {
          from { transform: translateX(-120%); }
          to { transform: translateX(320%); }
        }
        .mr-how-sweep {
          animation: mr-how-sweep 0.48s ease-out 1;
        }
        @media (prefers-reduced-motion: reduce) {
          .mr-how-sweep { animation: none; }
        }
      `}</style>
    </div>
  )
}

/**
 * Dessn canopy (desktop) + compact mobile accordion.
 */
export default function HowItWorksSection() {
  const t = useHowItWorksTuner()
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 767px)').matches)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const apply = () => setIsMobile(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  if (!t.enabled) return null
  const fill = '#080909'
  const mobileCards: CardCopy[] = [
    { tag: t.card1Tag, title: t.card1Title, body: t.card1Body },
    { tag: t.card2Tag, title: t.card2Title, body: t.card2Body },
    { tag: t.card3Tag, title: t.card3Title, body: t.card3Body },
  ]

  // Mobile: compact accordion (no tall cream cards)
  if (isMobile) {
    return (
      <section
        id="how-it-works"
        data-parallax-pause
        className="relative w-full overflow-x-clip py-6"
        aria-label="How it works"
      >
        <div className="relative w-full px-5 pb-2 pt-2" style={{ backgroundColor: fill }}>
          <p data-home-reveal className="mb-2 font-nhg text-[11px] font-medium uppercase tracking-[0.16em] text-[#aeb8ad]">
            03
          </p>
          <h2 data-home-reveal className="m-0 font-nhg text-[clamp(1.85rem,7vw,2.35rem)] font-semibold tracking-tight text-home-on-dark">
            {t.title}
          </h2>
          <p data-home-reveal className="mt-3 max-w-xl font-nhg text-[13px] leading-relaxed">
            {highlightSubtitle(t.canopySubtitle, t.canopyHighlight)}
          </p>
          <div data-home-reveal className="mt-5 pb-2">
            <MobileHowAccordion cards={mobileCards} />
          </div>
        </div>
      </section>
    )
  }

  return <DesktopHowItWorks t={t} />
}

function DesktopHowItWorks({ t }: { t: ReturnType<typeof useHowItWorksTuner> }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 75%', 'center 38%'],
  })

  const scrub = useSpring(scrollYProgress, {
    stiffness: t.scrubStiffness,
    damping: 28,
    mass: 0.45,
  })
  const p = reduce ? scrollYProgress : scrub

  const cardsScale = useTransform(p, [0, 1], [Math.min(0.96, t.idleScale + 0.06), 1])
  const cardsX = useTransform(p, [0, 1], [-14, 0])
  const card2Y = useTransform(p, [0, 1], [6, 0])
  const card3Y = useTransform(p, [0, 1], [12, 0])
  const titleInShellOpacity = useTransform(
    p,
    [0.35, 0.85],
    [0, 1],
  )
  const approachTitleOpacity = useTransform(p, [0, 0.5], [1, 0])

  const fill = '#080909'
  const desktopCards: StepCardData[] = [
    {
      tag: t.card1Tag,
      title: t.card1Title,
      body: t.card1Body,
      art: t.card1Art,
      artScale: t.card1ArtScale,
      artOpacity: t.card1ArtOpacity,
      artX: t.card1ArtX,
      artY: t.card1ArtY,
    },
    {
      tag: t.card2Tag,
      title: t.card2Title,
      body: t.card2Body,
      art: t.card2Art,
      artScale: t.card2ArtScale,
      artOpacity: t.card2ArtOpacity,
      artX: t.card2ArtX,
      artY: t.card2ArtY,
    },
    {
      tag: t.card3Tag,
      title: t.card3Title,
      body: t.card3Body,
      art: t.card3Art,
      artScale: t.card3ArtScale,
      artOpacity: t.card3ArtOpacity,
      artX: t.card3ArtX,
      artY: t.card3ArtY,
    },
  ]

  return (
    <section
      id="how-it-works"
      ref={ref}
      data-parallax-pause
      className="relative w-full overflow-x-clip py-6 md:py-8"
      aria-label="How it works"
    >
      <motion.div
        className="relative z-10 mx-auto mb-5 w-full max-w-6xl px-5 md:mb-6 md:px-8"
        style={{ opacity: approachTitleOpacity }}
      >
        <p data-home-reveal className="mb-2 font-nhg text-[11px] font-medium uppercase tracking-[0.16em] text-[#aeb8ad]">
          03
        </p>
        <h2 data-home-reveal className="m-0 font-nhg text-[clamp(1.85rem,4vw,2.75rem)] font-semibold tracking-tight text-home-on-dark">
          {t.title}
        </h2>
      </motion.div>

      <div className="relative w-full" style={{ backgroundColor: fill }}>
        <motion.div
          className="mx-auto max-w-6xl px-5 pb-8 pt-10 text-center md:px-8 md:pb-10 md:pt-14"
          style={{ opacity: titleInShellOpacity }}
        >
          <h2 data-home-reveal className="m-0 font-nhg text-[clamp(1.85rem,3.8vw,2.75rem)] font-semibold tracking-tight text-home-on-dark">
            {t.title}
          </h2>
          <p data-home-reveal className="mx-auto mt-4 max-w-2xl font-nhg text-sm leading-relaxed md:text-[15px]">
            {highlightSubtitle(t.canopySubtitle, t.canopyHighlight)}
          </p>
        </motion.div>
      </div>

      <div className="relative mx-auto max-w-6xl px-0">
        <div
          className="relative -mt-px overflow-visible rounded-b-3xl px-3 pb-4 pt-0 md:px-5 md:pb-5"
          style={{ backgroundColor: fill }}
        >
          <InvertedFillet
            side="left"
            fill={fill}
            size={t.filletSize}
            offsetX={t.filletLeftX}
            offsetY={t.filletLeftY}
            rotate={t.filletLeftRotate}
          />
          <InvertedFillet
            side="right"
            fill={fill}
            size={t.filletSize}
            offsetX={t.filletRightX}
            offsetY={t.filletRightY}
            rotate={t.filletRightRotate}
          />

          <motion.div
            className="pt-3 md:pt-4"
            style={{
              scale: cardsScale,
              x: cardsX,
              transformOrigin: 'left center',
            }}
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
              {desktopCards.map((card, i) => (
                <motion.div key={card.tag} style={{ y: i === 1 ? card2Y : i === 2 ? card3Y : 0 }}>
                  <StepCard card={card} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
