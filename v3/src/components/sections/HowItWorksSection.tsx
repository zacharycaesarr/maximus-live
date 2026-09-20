'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from 'framer-motion'
import { useHowItWorksTuner } from '@/context/HowItWorksTunerContext'
import { cn } from '@/lib/utils'

function AppleEmoji({ emoji, className }: { emoji: string; className?: string }) {
  const cps = [...emoji]
    .map((c) => c.codePointAt(0)?.toString(16))
    .filter(Boolean)
    .join('-')
  const src = `https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.1.2/img/apple/64/${cps}.png`
  return (
    <>
      <img
        src={src}
        alt=""
        className={className}
        draggable={false}
        onError={(e) => {
          e.currentTarget.style.display = 'none'
          const fallback = e.currentTarget.nextElementSibling as HTMLElement | null
          if (fallback) fallback.hidden = false
        }}
      />
      <span className={cn('text-7xl', className)} hidden>
        {emoji}
      </span>
    </>
  )
}

type CardData = { tag: string; title: string; body: string; emoji: string }

function StepCard({ card, bg }: { card: CardData; bg: string }) {
  return (
    <article
      className="group relative flex min-h-[380px] flex-col overflow-hidden rounded-2xl p-5 transition-[transform,box-shadow] duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-3.5 hover:shadow-[0_32px_56px_rgba(0,0,0,0.35)] md:min-h-[460px] md:p-6"
      style={{ background: bg }}
    >
      <p className="m-0 font-nhg text-[11px] font-medium tracking-[0.14em] text-espresso/40">{card.tag}</p>
      <h3 className="mt-3 m-0 font-nhg text-[1.15rem] font-semibold leading-snug tracking-tight text-espresso md:text-[1.35rem]">
        {card.title}
      </h3>
      <p className="mt-3 m-0 font-nhg text-sm leading-relaxed text-espresso/60 md:text-[15px]">{card.body}</p>
      <div
        className="pointer-events-none absolute bottom-[-2%] left-1/2 flex h-[46%] w-[70%] -translate-x-1/2 items-end justify-center opacity-[0.2] transition-transform duration-[380ms] group-hover:scale-110"
        aria-hidden
      >
        <AppleEmoji emoji={card.emoji} className="h-36 w-36 object-contain md:h-44 md:w-44" />
      </div>
    </article>
  )
}

function highlightSubtitle(text: string, highlight: string) {
  if (!highlight.trim()) return <span className="text-white/45">{text}</span>
  const idx = text.toLowerCase().indexOf(highlight.toLowerCase())
  if (idx < 0) return <span className="text-white/45">{text}</span>
  return (
    <>
      <span className="text-white/45">{text.slice(0, idx)}</span>
      <span className="font-medium text-white">{text.slice(idx, idx + highlight.length)}</span>
      <span className="text-white/45">{text.slice(idx + highlight.length)}</span>
    </>
  )
}

/**
 * Concave elbow. Position + rotate via Leva (How it works → Fillets).
 * Hit Remember after you dial it in.
 */
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

/**
 * Dessn canopy:
 * 1) full-width black header
 * 2) cream sides return
 * 3) narrower black well drops down with inverted fillets at the elbows
 * 4) convex rounded bottom on the well
 */
export default function HowItWorksSection() {
  const t = useHowItWorksTuner()
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 75%', 'center 38%'],
  })

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const apply = () => setIsMobile(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  const scrub = useSpring(scrollYProgress, {
    stiffness: t.scrubStiffness,
    damping: 28,
    mass: 0.45,
  })
  const p = reduce ? scrollYProgress : scrub

  const cardsScale = useTransform(p, [0, 1], [isMobile ? 1 : Math.min(0.96, t.idleScale + 0.06), 1])
  const cardsX = useTransform(p, [0, 1], [isMobile ? 0 : -14, 0])
  const card2Y = useTransform(p, [0, 1], [isMobile ? 0 : 6, 0])
  const card3Y = useTransform(p, [0, 1], [isMobile ? 0 : 12, 0])
  const titleInShellOpacity = useTransform(
    p,
    isMobile ? [0.12, 0.42] : [0.35, 0.85],
    [0, 1],
  )
  const approachTitleOpacity = useTransform(p, isMobile ? [0, 0.32] : [0, 0.5], [1, 0])

  if (!t.enabled) return null

  const fill = t.canopyBg
  const cards: CardData[] = [
    { tag: t.card1Tag, title: t.card1Title, body: t.card1Body, emoji: t.card1Emoji },
    { tag: t.card2Tag, title: t.card2Title, body: t.card2Body, emoji: t.card2Emoji },
    { tag: t.card3Tag, title: t.card3Title, body: t.card3Body, emoji: t.card3Emoji },
  ]

  return (
    <section
      id="how-it-works"
      ref={ref}
      data-parallax-pause
      className="relative w-full overflow-x-clip py-10 md:py-14"
      aria-label="How it works"
    >
      <motion.div
        className="relative z-10 mx-auto mb-5 w-full max-w-6xl px-5 md:mb-6 md:px-8"
        style={{ opacity: approachTitleOpacity }}
      >
        <p className="mb-2 font-nhg text-[11px] font-medium uppercase tracking-[0.16em] text-espresso/45">
          03
        </p>
        <h2 className="m-0 bg-gradient-to-br from-[#1a1612] via-[#2C2520] to-[#6b5a4a] bg-clip-text font-nhg text-[clamp(1.85rem,4vw,2.75rem)] font-semibold tracking-tight text-transparent">
          {t.title}
        </h2>
      </motion.div>

      {/* 1. Full-width black header only */}
      <div className="relative w-full" style={{ backgroundColor: fill }}>
        <motion.div
          className="mx-auto max-w-6xl px-5 pb-8 pt-10 text-center md:px-8 md:pb-10 md:pt-14"
          style={{ opacity: titleInShellOpacity }}
        >
          <h2 className="m-0 font-nhg text-[clamp(1.85rem,3.8vw,2.75rem)] font-semibold tracking-tight text-white">
            {t.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-nhg text-sm leading-relaxed md:text-[15px]">
            {highlightSubtitle(t.canopySubtitle, t.canopyHighlight)}
          </p>
        </motion.div>
      </div>

      {/* 2. Cream on sides; 3. narrower well with concave top elbows */}
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
              transformOrigin: isMobile ? 'center top' : 'left center',
            }}
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
              {cards.map((card, i) => (
                <motion.div key={card.tag} style={{ y: i === 1 ? card2Y : i === 2 ? card3Y : 0 }}>
                  <StepCard card={card} bg={t.cardBg} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
