import { useState, type FormEvent } from 'react'
import Cal from '@calcom/embed-react'
import { motion } from 'framer-motion'
import BentoCard from '@/portal/dashboard/BentoCard'
import { CAL_BOOKING_LINK, CAL_UI_CONFIG } from '@/portal/lib/calConfig'
import RippleButton from '@/portal/ui/RippleButton'

const SERVICES = [
  { id: 'ads', label: 'Google / Meta ads' },
  { id: 'web', label: 'Website' },
  { id: 'crm', label: 'CRM / automation' },
  { id: 'video', label: 'Video / creative' },
  { id: 'seo', label: 'SEO / brand' },
] as const

const SUPPORT_EMAIL = 'hello@maximusreach.com'

/** Support request + one Cal.com booking block. */
export default function SupportTab() {
  const [picked, setPicked] = useState<string[]>([])
  const [note, setNote] = useState('')
  const [sent, setSent] = useState(false)

  function toggle(id: string) {
    setPicked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const topics = SERVICES.filter((s) => picked.includes(s.id))
      .map((s) => s.label)
      .join(', ')
    const body = [
      topics ? `Topics: ${topics}` : '',
      note.trim() ? `Message:\n${note.trim()}` : '',
    ]
      .filter(Boolean)
      .join('\n\n')
    const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('Portal support request')}&body=${encodeURIComponent(body || 'I need help with…')}`
    window.location.href = mailto
    setSent(true)
  }

  return (
    <div data-portal-slot="support-panel" className="space-y-4">
      <BentoCard label="quick request" delay={0.04} slot="support-form">
        <form onSubmit={onSubmit} className="space-y-4">
          <p className="m-0 font-nhg text-sm text-white/45">
            Pick a topic, leave a short note, and we will follow up. This opens your email app with
            the message ready to send.
          </p>

          <div className="flex flex-wrap gap-2">
            {SERVICES.map((s) => {
              const on = picked.includes(s.id)
              return (
                <RippleButton
                  key={s.id}
                  type="button"
                  onClick={() => toggle(s.id)}
                  className={[
                    'rounded-lg border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide',
                    on
                      ? 'border-[var(--portal-accent,#f97316)]/50 bg-[var(--portal-accent,#f97316)]/15 text-white'
                      : 'border-white/10 text-white/40 hover:border-white/25 hover:text-white/70',
                  ].join(' ')}
                  rippleClassName="bg-white/25"
                >
                  {s.label}
                </RippleButton>
              )
            })}
          </div>

          <label className="block font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">
            message
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              placeholder="What do you need help with?"
              className="mt-1.5 w-full resize-y rounded-lg border border-white/10 bg-black/40 px-3 py-2 font-nhg text-sm text-white outline-none placeholder:text-white/25"
            />
          </label>

          <RippleButton
            type="submit"
            className="rounded-lg bg-white px-4 py-2 font-nhg text-sm font-medium text-[#0c0c0d]"
            rippleClassName="bg-[#0c0c0d]/20"
          >
            Email support
          </RippleButton>

          {sent ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-nhg text-sm text-emerald-300/80"
            >
              Your mail app should open with the request ready to send.
            </motion.p>
          ) : null}
        </form>
      </BentoCard>

      <BentoCard label="book a call" delay={0.08}>
        <div>
          <p className="m-0 font-nhg text-lg text-white">Pick a date and time</p>
          <p className="mt-1 font-nhg text-sm leading-relaxed text-white/45">
            Choose a slot that works for you. Availability follows the calendar below.
          </p>
          <div className="mt-4 w-full overflow-hidden rounded-xl border border-white/10 bg-black/20">
            <Cal
              namespace="booking-inline"
              calLink={CAL_BOOKING_LINK}
              style={{ width: '100%', height: '640px', maxWidth: '100%' }}
              config={CAL_UI_CONFIG}
            />
          </div>
        </div>
      </BentoCard>
    </div>
  )
}
