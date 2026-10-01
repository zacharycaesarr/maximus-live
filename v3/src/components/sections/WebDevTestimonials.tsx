'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { MessageCircleHeart, Send, X } from 'lucide-react'
import { getSupabase, supabaseConfigured } from '@/lib/supabase'
import { Reveal } from '@/components/ui/reveal'
import { cn } from '@/lib/utils'

export type WebTestimonial = {
  id: string
  quote: string
  excerpt: string
  name: string
  role: string
  company: string
  category: string
  metric?: string
  image?: string
}

type Props = {
  eyebrow: string
  title: string
  items: WebTestimonial[]
  submitLabel: string
  /** corner radius in px, tunable from Leva */
  cardRadius?: number
}

const RAIL_BG = '#ebe4da'

/**
 * Blended proof rail:
 * - horizontal overview (efferd columns idea, sideways)
 * - featured panel on hover/tap (scroll-reel focus feel)
 * Cards use a light glass treatment. Radius comes from Leva.
 */
export default function WebDevTestimonials({
  eyebrow,
  title,
  items,
  submitLabel,
  cardRadius = 11,
}: Props) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '')
  const [paused, setPaused] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const reduced = useReducedMotion()
  const trackRef = useRef<HTMLDivElement>(null)
  const setRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef(0)
  const rafRef = useRef(0)

  const active = items.find((t) => t.id === activeId) ?? items[0]

  useEffect(() => {
    if (reduced || paused || items.length < 2) return
    const track = trackRef.current
    const setEl = setRef.current
    if (!track || !setEl) return

    const loop = () => {
      offsetRef.current -= 0.45
      const w = setEl.offsetWidth
      if (w > 0) {
        // catch up if a frame skipped so we never show the seam gap
        while (Math.abs(offsetRef.current) >= w) {
          offsetRef.current += w
        }
      }
      track.style.transform = `translate3d(${offsetRef.current}px,0,0)`
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [reduced, paused, items.length])

  useEffect(() => {
    if (reduced || paused || items.length < 2) return
    const id = window.setInterval(() => {
      setActiveId((cur) => {
        const i = items.findIndex((t) => t.id === cur)
        return items[(i + 1) % items.length].id
      })
    }, 5200)
    return () => window.clearInterval(id)
  }, [reduced, paused, items])

  return (
    <section className="overflow-x-clip border-t border-espresso/8 bg-[#ebe4da] py-14 md:py-24">
      <div className="mx-auto max-w-6xl px-5 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <p className="font-switzer text-[11px] font-medium uppercase tracking-[0.18em] text-espresso/40">
              {eyebrow}
            </p>
            <h2 className="mt-3 font-tiempos text-[clamp(1.85rem,3.5vw,2.75rem)] font-light tracking-tight text-espresso">
              {title}
            </h2>
          </Reveal>
          <button
            type="button"
            data-magnetic
            onClick={() => setFormOpen(true)}
            className="inline-flex items-center gap-2 rounded-[11px] border border-white/55 bg-white/35 px-4 py-2.5 font-switzer text-[13px] font-medium text-espresso shadow-[0_8px_24px_-12px_rgba(44,37,32,0.3)] backdrop-blur-[6px] transition hover:bg-white/50"
          >
            <MessageCircleHeart size={15} className="text-[#c4a574]" />
            {submitLabel}
          </button>
        </div>

        <div
          className="relative mt-10 border border-white/55 bg-[rgba(255,255,255,0.22)] p-6 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.35)] backdrop-blur-[11px] md:p-10"
          style={{ borderRadius: cardRadius, minHeight: 280 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {active && (
              <motion.div
                key={active.id}
                className="absolute inset-0 flex flex-col p-6 md:p-10"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="font-nhg text-[10px] uppercase tracking-[0.16em] text-espresso/35">
                  {active.category}
                </p>
                <blockquote className="mt-4 max-w-3xl flex-1 font-tiempos text-[clamp(1.25rem,2.4vw,1.85rem)] font-light leading-snug text-espresso">
                  “{active.quote}”
                </blockquote>
                <div className="mt-auto flex flex-wrap items-center gap-4 pt-6">
                  {active.image ? (
                    <img
                      src={active.image}
                      alt=""
                      className="h-11 w-11 rounded-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-espresso/10 font-nhg text-sm text-espresso/50">
                      {active.name.slice(0, 1)}
                    </div>
                  )}
                  <div>
                    <p className="m-0 font-nhg text-[14px] font-medium text-espresso">{active.name}</p>
                    <p className="m-0 font-nhg text-[12px] text-espresso/45">
                      {active.role}
                      {active.company ? ` · ${active.company}` : ''}
                    </p>
                  </div>
                  {active.metric && (
                    <p className="ml-auto font-nhg text-[13px] font-medium text-[#8b6950]">
                      {active.metric}
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div
        className="relative mt-8 overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16"
          style={{ background: `linear-gradient(to right, ${RAIL_BG}, transparent)` }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16"
          style={{ background: `linear-gradient(to left, ${RAIL_BG}, transparent)` }}
        />
        <div
          ref={trackRef}
          className="flex w-max will-change-transform"
          style={{ transform: 'translate3d(0,0,0)' }}
        >
          {[0, 1, 2].map((copy) => (
            <div
              key={copy}
              ref={copy === 0 ? setRef : undefined}
              className="flex gap-4 px-3"
              aria-hidden={copy > 0}
            >
              {items.map((t) => {
                const isActive = t.id === activeId
                return (
                  <button
                    key={`${copy}-${t.id}`}
                    type="button"
                    data-magnetic
                    tabIndex={copy === 0 ? 0 : -1}
                    onMouseEnter={() => setActiveId(t.id)}
                    onFocus={() => setActiveId(t.id)}
                    onClick={() => setActiveId(t.id)}
                    className={cn(
                      'w-[260px] shrink-0 border border-white/55 px-4 py-4 text-left shadow-[0_12px_32px_-12px_rgba(26,22,18,0.28)] backdrop-blur-[8px] transition',
                      isActive
                        ? 'bg-[rgba(255,255,255,0.42)]'
                        : 'bg-[rgba(255,255,255,0.18)] hover:bg-[rgba(255,255,255,0.32)]',
                    )}
                    style={{ borderRadius: cardRadius }}
                  >
                    <p className="font-nhg text-[10px] uppercase tracking-[0.12em] text-espresso/35">
                      {t.category}
                    </p>
                    <p className="mt-2 line-clamp-3 font-nhg text-[13px] leading-relaxed text-espresso/70">
                      “{t.excerpt}”
                    </p>
                    <p className="mt-3 font-nhg text-[12px] font-medium text-espresso">{t.name}</p>
                    <p className="font-nhg text-[11px] text-espresso/40">{t.company}</p>
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {formOpen && (
          <TestimonialSubmitModal onClose={() => setFormOpen(false)} />
        )}
      </AnimatePresence>
    </section>
  )
}

function TestimonialSubmitModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [quote, setQuote] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle')
  const [err, setErr] = useState('')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !quote.trim()) {
      setErr('Name and a short note are enough.')
      setStatus('err')
      return
    }
    if (!supabaseConfigured) {
      setErr('Submissions are not connected yet. Email Zachary directly for now.')
      setStatus('err')
      return
    }
    setStatus('sending')
    setErr('')
    try {
      const client = getSupabase()
      const { error } = await client.from('testimonial_submissions').insert({
        name: name.trim(),
        company: company.trim() || null,
        quote: quote.trim(),
        email: email.trim() || null,
        source_page: 'web-development',
        status: 'pending',
      })
      if (error) throw error
      setStatus('ok')
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : 'Could not send. Try again.')
      setStatus('err')
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/45 p-4 sm:items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal
        aria-label="Share a testimonial"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.28 }}
        className="w-full max-w-md rounded-[20px] border border-espresso/10 bg-[#f7f7f5] p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-nhg text-[11px] uppercase tracking-[0.14em] text-espresso/40">
              Have we worked together?
            </p>
            <h3 className="mt-1 font-tiempos text-xl font-light text-espresso">
              Drop a quick note.
            </h3>
            <p className="mt-1 font-nhg text-[12px] text-espresso/45">
              Name + a sentence is enough. Email is optional.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="rounded-full border border-espresso/12 p-2 text-espresso/50"
          >
            <X size={14} />
          </button>
        </div>

        {status === 'ok' ? (
          <p className="mt-6 font-nhg text-sm text-espresso/70">
            Got it. Thanks. It shows up in the portal for review.
          </p>
        ) : (
          <form className="mt-5 space-y-3" onSubmit={submit}>
            <label className="block">
              <span className="font-nhg text-[11px] text-espresso/45">Your name</span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-[10px] border border-espresso/12 bg-white px-3 py-2.5 font-nhg text-sm text-espresso outline-none focus:border-espresso/30"
              />
            </label>
            <label className="block">
              <span className="font-nhg text-[11px] text-espresso/45">Company (optional)</span>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="mt-1 w-full rounded-[10px] border border-espresso/12 bg-white px-3 py-2.5 font-nhg text-sm text-espresso outline-none focus:border-espresso/30"
              />
            </label>
            <label className="block">
              <span className="font-nhg text-[11px] text-espresso/45">What stood out?</span>
              <textarea
                required
                rows={3}
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                className="mt-1 w-full resize-none rounded-[10px] border border-espresso/12 bg-white px-3 py-2.5 font-nhg text-sm text-espresso outline-none focus:border-espresso/30"
              />
            </label>
            <label className="block">
              <span className="font-nhg text-[11px] text-espresso/45">Email (optional)</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-[10px] border border-espresso/12 bg-white px-3 py-2.5 font-nhg text-sm text-espresso outline-none focus:border-espresso/30"
              />
            </label>
            {status === 'err' && err && (
              <p className="font-nhg text-[12px] text-red-700/80">{err}</p>
            )}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-[10px] bg-espresso px-4 py-3 font-nhg text-[14px] font-medium text-[#FCFAF2] disabled:opacity-60"
            >
              {status === 'sending' ? 'Sending…' : 'Send note'}
              <Send size={14} />
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  )
}
