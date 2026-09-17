import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LevaPanel, useCreateStore, useControls, folder } from 'leva'
import Cal from '@calcom/embed-react'
import DirectNav from '@/components/nav/DirectNav'
import SmoothScroll from '@/components/SmoothScroll'
import SiteFooter from '@/components/sections/SiteFooter'
import { Reveal } from '@/components/ui/reveal'
import { NavTunerProvider } from '@/context/NavTunerContext'
import { LenisTunerProvider } from '@/context/LenisTunerContext'
import { FooterTunerProvider } from '@/context/FooterTunerContext'
import { CAL_BOOKING_LINK, CAL_UI_CONFIG } from '@/portal/lib/calConfig'
import { cn } from '@/lib/utils'
import { Mail, Phone, CalendarDays } from 'lucide-react'

const titleGradient =
  'bg-gradient-to-br from-[#1a1612] via-[#2C2520] to-[#6b5a4a] bg-clip-text text-transparent'

const START_KEY = 'mr-v3-start-v2'

const defaults = {
  eyebrow: 'Start here',
  title: "Let's build something that actually converts",
  sub: 'Book a call, email, or text. Tell me what you are working on and we will map the next step.',
  bookLabel: 'Book a call',
  bookHint: 'Pick a time that works. Calendar is right here on the page.',
  email: 'hello@maximusreach.com',
  phone: '(540) 416-2983',
  phoneHref: 'tel:+15404162983',
  contactLabel: 'Or reach out directly',
}

function loadStart() {
  try {
    const raw = localStorage.getItem(START_KEY)
    if (!raw) return { ...defaults }
    return { ...defaults, ...JSON.parse(raw) }
  } catch {
    return { ...defaults }
  }
}

function StartMain({ t }: { t: typeof defaults }) {
  useEffect(() => {
    document.title = 'Start · Maximus Reach'
  }, [])

  return (
    <div className="min-h-screen bg-[#f7f7f5]">
      <DirectNav />

      <section className="relative overflow-hidden px-6 pb-10 pt-28 md:pb-12 md:pt-36">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[50vh] bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(196,165,116,0.18),transparent_70%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="mb-3 font-nhg text-[11px] font-medium uppercase tracking-[0.16em] text-espresso/40">
              {t.eyebrow}
            </p>
            <h1 className={cn('m-0 font-nhg text-[clamp(2rem,6vw,3.5rem)] font-semibold tracking-tight', titleGradient)}>
              {t.title}
            </h1>
            <p className="mx-auto mt-5 max-w-xl font-nhg text-base leading-relaxed text-espresso/60 md:text-lg">
              {t.sub}
            </p>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto h-px w-full max-w-4xl bg-gradient-to-r from-transparent via-espresso/12 to-transparent" aria-hidden />

      <section className="mx-auto max-w-4xl px-6 py-8 md:py-10" aria-label="Book a call">
        <Reveal>
          <div className="rounded-3xl border border-espresso/10 bg-[#0e0d0c] px-5 py-7 text-center md:px-8 md:py-9">
            <CalendarDays className="mx-auto mb-2 text-[#c4a574]" size={24} strokeWidth={1.5} />
            <h2 className="m-0 font-nhg text-xl font-semibold text-[#FCFAF2] md:text-2xl">{t.bookLabel}</h2>
            <p className="mx-auto mt-2 max-w-md font-nhg text-sm text-[#FCFAF2]/55">{t.bookHint}</p>
            <div className="mt-5 w-full overflow-hidden rounded-2xl border border-white/10 bg-black/30 text-left">
              <Cal
                namespace="start-booking"
                calLink={CAL_BOOKING_LINK}
                style={{ width: '100%', height: '620px', maxWidth: '100%' }}
                config={CAL_UI_CONFIG}
              />
            </div>
          </div>
        </Reveal>
      </section>

      <div className="mx-auto h-px w-full max-w-4xl bg-gradient-to-r from-transparent via-espresso/12 to-transparent" aria-hidden />

      <section className="mx-auto max-w-3xl px-6 py-12 md:py-16" aria-label="Contact">
        <Reveal>
          <p className="mb-2 text-center font-nhg text-[11px] font-medium uppercase tracking-[0.16em] text-espresso/40">
            {t.contactLabel}
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <a
              href={`mailto:${t.email}`}
              className="group flex items-center gap-3 rounded-2xl border border-espresso/8 bg-white/80 px-5 py-4 no-underline shadow-[0_8px_24px_rgba(44,37,32,0.05)] transition hover:-translate-y-0.5 hover:border-espresso/15"
            >
              <Mail className="text-[#8b6950] transition group-hover:text-[#c4a574]" size={20} />
              <span className="font-nhg text-sm font-medium text-espresso">{t.email}</span>
            </a>
            <a
              href={t.phoneHref}
              className="group flex items-center gap-3 rounded-2xl border border-espresso/8 bg-white/80 px-5 py-4 no-underline shadow-[0_8px_24px_rgba(44,37,32,0.05)] transition hover:-translate-y-0.5 hover:border-espresso/15"
            >
              <Phone className="text-[#8b6950] transition group-hover:text-[#c4a574]" size={20} />
              <span className="font-nhg text-sm font-medium text-espresso">{t.phone}</span>
            </a>
          </div>
          <p className="mt-8 text-center font-nhg text-sm text-espresso/45">
            Already a client?{' '}
            <Link to="/portal" className="font-medium text-espresso underline decoration-[#c4a574]/50 underline-offset-2">
              Client Portal
            </Link>
          </p>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  )
}

export default function StartPage() {
  const store = useCreateStore()
  const isDev = import.meta.env.DEV
  const [collapsed, setCollapsed] = useState(true)
  const [mountKey, setMountKey] = useState(0)
  const initial = loadStart()

  const values = useControls(
    {
      Copy: folder(
        {
          eyebrow: { value: initial.eyebrow, label: 'eyebrow' },
          title: { value: initial.title, label: 'title' },
          sub: { value: initial.sub, label: 'sub' },
          bookLabel: { value: initial.bookLabel, label: 'book title' },
          bookHint: { value: initial.bookHint, label: 'book hint' },
          contactLabel: { value: initial.contactLabel, label: 'contact label' },
          email: { value: initial.email, label: 'email' },
          phone: { value: initial.phone, label: 'phone' },
          phoneHref: { value: initial.phoneHref, label: 'phone href' },
        },
        { collapsed: false },
      ),
      Persist: folder(
        {
          remember: { value: false, label: 'Remember' },
          revert: { value: false, label: 'Revert' },
        },
        { collapsed: false },
      ),
    },
    { store },
  )

  useEffect(() => {
    if ((values as { remember?: boolean }).remember) {
      const { remember: _a, revert: _b, ...rest } = values as typeof defaults & {
        remember: boolean
        revert: boolean
      }
      localStorage.setItem(START_KEY, JSON.stringify(rest))
    }
    if ((values as { revert?: boolean }).revert) {
      localStorage.removeItem(START_KEY)
      window.location.reload()
    }
  }, [values])

  const t = {
    eyebrow: String(values.eyebrow),
    title: String(values.title),
    sub: String(values.sub),
    bookLabel: String(values.bookLabel),
    bookHint: String(values.bookHint),
    contactLabel: String(values.contactLabel),
    email: String(values.email),
    phone: String(values.phone),
    phoneHref: String(values.phoneHref),
  }

  return (
    <LenisTunerProvider store={store}>
      <NavTunerProvider store={store}>
        <FooterTunerProvider store={store}>
          <SmoothScroll>
            <StartMain t={t} />
          </SmoothScroll>
          {isDev && (
            <div data-lenis-prevent className="mr-v3-leva-host" onWheel={(e) => e.stopPropagation()}>
              <LevaPanel
                key={mountKey}
                store={store}
                collapsed={{
                  collapsed,
                  onChange: (c) => {
                    setCollapsed(c)
                    if (!c) setMountKey((k) => k + 1)
                  },
                }}
                titleBar={{ title: 'Maximus · Start', filter: false }}
                oneLineLabels
              />
            </div>
          )}
        </FooterTunerProvider>
      </NavTunerProvider>
    </LenisTunerProvider>
  )
}
