/**
 * Full desktop homepage before/after stages for Selected Builds.
 * Real page sections (nav, hero, body, stats, footer) — not hero-only stubs.
 */

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type BuildCaseId = 'summit-hvac' | 'northline-dental' | 'ridge-plumbing'

const PHOTOS = {
  hvacCrew: '/phone-mocks/hvac-crew.jpg',
  dental1: '/phone-mocks/dental-smile-1.jpg',
  dental2: '/phone-mocks/dental-smile-2.png',
  plumbing: '/phone-mocks/plumbing-team.jpg',
  craftHero:
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=70&auto=format',
  craftJob:
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=70&auto=format',
  craftMill:
    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=70&auto=format',
}

export function BuildCaseStage({
  id,
  version,
  className,
}: {
  id: BuildCaseId
  version: 'before' | 'after'
  className?: string
}) {
  return (
    <BrowserChrome
      url={urls[id][version]}
      className={className}
      tone={version === 'after' ? 'dark' : 'light'}
    >
      {id === 'summit-hvac' && (version === 'before' ? <RoundsBefore /> : <RoundsAfter />)}
      {id === 'northline-dental' &&
        (version === 'before' ? <DentalBefore /> : <DentalAfter />)}
      {id === 'ridge-plumbing' && (version === 'before' ? <CraftBefore /> : <CraftAfter />)}
    </BrowserChrome>
  )
}

/** Compact card helper — after resting; swap via parent hover if needed */
export function BuildCaseHoverCard({
  id,
  className,
}: {
  id: BuildCaseId
  className?: string
}) {
  return (
    <div className={cn('relative h-full w-full overflow-hidden', className)}>
      <BuildCaseStage id={id} version="after" className="h-full rounded-none border-0" />
    </div>
  )
}

const urls: Record<BuildCaseId, { before: string; after: string }> = {
  'summit-hvac': { before: 'BCCU Temp · Before', after: 'BCCU Temp' },
  'northline-dental': {
    before: 'augusta-dental-arts.webs.com',
    after: 'augusta-dental-arts',
  },
  'ridge-plumbing': {
    before: 'west-and-clay.blogspot.com',
    after: 'west-and-clay',
  },
}

function BrowserChrome({
  children,
  url,
  className,
  tone = 'dark',
}: {
  children: ReactNode
  url: string
  className?: string
  tone?: 'dark' | 'light'
}) {
  return (
    <div
      className={cn(
        'flex h-full min-h-[320px] w-full flex-col overflow-hidden rounded-t-xl border',
        tone === 'dark' ? 'border-neutral-800 bg-neutral-950' : 'border-neutral-700 bg-neutral-900',
        className,
      )}
    >
      <div className="flex shrink-0 items-center gap-2 border-b border-neutral-800 bg-neutral-900 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-red-900/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-900/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-900/70" />
        <span className="ml-2 flex-1 truncate rounded-md bg-neutral-800 px-2 py-1 font-nhg text-[10px] text-neutral-400">
          {url}
        </span>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden bg-white [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {children}
      </div>
    </div>
  )
}

/* ─── BCCU Temp ─── */

function RoundsBefore() {
  return (
    <div className="min-h-full bg-[#c8c8c8] font-[Arial,Tahoma,sans-serif] text-[#222]">
      <div className="flex items-center justify-between bg-[#003366] px-3 py-2 text-white">
        <p className="m-0 text-[12px] font-bold">BCCU Temp</p>
        <p className="m-0 text-[8px] text-[#99ccff]">Home · Services · About · Contact</p>
      </div>
      <div className="bg-[#cc0000] py-1 text-center text-[9px] font-bold text-white">
        CALL NOW FOR A FREE ESTIMATE — (540) 555-0199
      </div>
      <div className="grid grid-cols-[1.1fr_1fr] gap-2 p-3">
        <img
          src={PHOTOS.hvacCrew}
          alt=""
          className="h-36 w-full object-cover object-[40%_20%] brightness-90"
        />
        <div>
          <p className="m-0 text-[13px] font-bold text-[#003366] underline">Welcome to Our Website!</p>
          <p className="m-0 mt-2 text-[9px] leading-relaxed">
            We have been your local HVAC experts since 2011. Air conditioning, furnaces, heat pumps,
            and maintenance plans for Staunton and Augusta County.
          </p>
          <button
            type="button"
            className="mt-3 border-2 border-black bg-[#ff6600] px-3 py-1.5 text-[10px] font-bold"
          >
            Request a Quote
          </button>
        </div>
      </div>
      <table className="mx-3 mb-3 w-[calc(100%-1.5rem)] border-collapse border border-[#666] text-[9px]">
        <tbody>
          <tr className="bg-[#003366] text-white">
            <td className="border border-[#666] p-1.5">Service</td>
            <td className="border border-[#666] p-1.5">Click</td>
          </tr>
          {['AC Repair', 'Furnace Tune-Up', 'Heat Pumps', 'Duct Cleaning'].map((r) => (
            <tr key={r} className="bg-white odd:bg-[#eee]">
              <td className="border border-[#666] p-1.5">{r}</td>
              <td className="border border-[#666] p-1.5 text-[#00c] underline">More info</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="bg-[#003366] px-3 py-2 text-center text-[8px] text-white">
        © 2015 BCCU Temp · Best viewed in Internet Explorer
      </div>
    </div>
  )
}

function RoundsAfter() {
  return (
    <div className="min-h-full bg-[#1a120e] font-nhg text-[#FBF6EF]">
      <header className="flex items-center justify-between border-b border-[#f07828]/25 px-4 py-2.5">
        <p className="m-0 text-[13px] font-semibold tracking-wide">
          <span className="text-[#f07828]">BCCU</span> Temp
        </p>
        <div className="flex items-center gap-3">
          <span className="hidden text-[9px] text-[#FBF6EF]/45 sm:inline">Services</span>
          <span className="hidden text-[9px] text-[#FBF6EF]/45 sm:inline">Rebates</span>
          <span className="relative inline-flex items-center gap-1.5 rounded-full bg-[#e06720] px-3 py-1.5 text-[10px] font-semibold">
            <span className="absolute left-2.5 h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            <span className="pl-2.5">(540) 555-0199</span>
          </span>
        </div>
      </header>

      <div className="relative">
        <img
          src={PHOTOS.hvacCrew}
          alt=""
          className="h-44 w-full object-cover object-[45%_25%] sm:h-52"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a120e] via-[#1a120e]/40 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4 max-w-md rounded-lg bg-[#1a120e]/90 p-3 ring-1 ring-[#f07828]/30 backdrop-blur-sm">
          <p className="m-0 text-[9px] uppercase tracking-[0.14em] text-[#f0a030]">
            Staunton &amp; Augusta County
          </p>
          <p className="m-0 mt-1 text-[18px] font-semibold leading-tight sm:text-[20px]">
            Fast heat &amp; air repairs in your driveway today.
          </p>
          <p className="m-0 mt-2 inline-flex rounded-full border border-[#f0a030]/40 px-2.5 py-1 text-[9px] text-[#f0a030]">
            4.9 Stars · 184 Google Reviews
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-lg bg-[#e06720] px-3 py-2 text-[11px] font-semibold">
              Request Service
            </span>
            <span className="rounded-lg border border-[#f0a030]/50 px-3 py-2 text-[11px] text-[#f0a030]">
              View Seasonal Rebates
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-3 px-4 py-4 sm:grid-cols-2">
        <div>
          <p className="m-0 text-[12px] font-semibold">Same-day dispatch</p>
          <p className="m-0 mt-1 text-[10px] leading-relaxed text-[#FBF6EF]/55">
            NATE techs for AC, furnaces, and heat pumps. Financing on qualifying installs.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { t: 'Emergency', d: '24/7 line' },
            { t: 'Maintenance', d: 'Priority slots' },
            { t: 'Installs', d: 'Rebate help' },
            { t: 'Area', d: 'Valley-wide' },
          ].map((x) => (
            <div
              key={x.t}
              className="rounded-md border border-[#f07828]/20 bg-[#120c09] px-2 py-2"
            >
              <p className="m-0 text-[10px] font-semibold text-[#f07828]">{x.t}</p>
              <p className="m-0 text-[9px] text-[#FBF6EF]/45">{x.d}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-[#f07828]/20 bg-[#120c09] px-4 py-3">
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { n: '14yr', l: 'Local crew' },
            { n: '184', l: 'Reviews' },
            { n: 'Same', l: 'Day slots' },
            { n: 'NATE', l: 'Certified' },
          ].map((s) => (
            <div key={s.l}>
              <p className="m-0 font-tiempos text-[16px] text-[#f0a030]">{s.n}</p>
              <p className="m-0 text-[8px] text-[#FBF6EF]/40">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Augusta Dental Arts ─── */

function DentalBefore() {
  return (
    <div className="flex min-h-full bg-[#e8eef4] font-[Arial,sans-serif] text-[#223]">
      <aside className="w-[34%] shrink-0 border-r border-[#9bb] bg-[#c5d4e0] p-2 text-[8px] leading-snug text-[#234]">
        <p className="m-0 mb-1 font-bold text-[#036]">Procedures</p>
        {[
          'Cleanings',
          'Fillings',
          'Crowns',
          'Bridges',
          'Root Canal',
          'Whitening',
          'Implants',
          'Dentures',
          'Invisalign',
          'Veneers',
          'Sealants',
          'Extractions',
          'Night Guards',
          'TMJ',
          'Pediatrics',
          'Emergencies',
          'X-Rays',
          'Consults',
          'Insurance',
          'Forms',
        ].map((l) => (
          <p key={l} className="m-0 border-b border-[#abc]/50 py-0.5 text-[#00c] underline">
            {l}
          </p>
        ))}
      </aside>
      <div className="min-w-0 flex-1 p-3">
        <p className="m-0 text-[14px] font-bold text-[#036]">Augusta Dental Arts</p>
        <p className="m-0 mt-1 text-[9px] text-[#456]">Request an appointment (12 fields)</p>
        <div className="mt-2 space-y-1.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-4 rounded border border-[#99a] bg-white" />
          ))}
        </div>
        <button type="button" className="mt-3 bg-[#036] px-3 py-1.5 text-[10px] text-white">
          Submit Form
        </button>
        <p className="m-0 mt-4 text-[8px] text-[#678]">
          Office hours Mon–Fri. Call for emergencies. Powered by GenericDentistTheme.
        </p>
      </div>
    </div>
  )
}

function DentalAfter() {
  return (
    <div className="min-h-full bg-[#faf6f0] font-nhg text-[#2a2420]">
      <header className="flex items-center justify-between px-4 py-3">
        <p className="m-0 text-[11px] font-medium tracking-[0.14em]">AUGUSTA DENTAL ARTS</p>
        <span className="rounded-full bg-[#2c4a3e] px-3 py-1.5 text-[10px] text-white">
          Book Consultation
        </span>
      </header>

      <div className="px-4 pb-2">
        <p className="m-0 font-tiempos text-[22px] font-light leading-[1.1] sm:text-[26px]">
          Modern cosmetic care.
          <br />
          Confident smiles.
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="rounded-full border border-[#2c4a3e]/25 px-2.5 py-1 text-[9px] text-[#2c4a3e]">
            Invisalign Preferred Provider
          </span>
          <span className="rounded-full border border-[#2c4a3e]/25 px-2.5 py-1 text-[9px] text-[#2c4a3e]">
            Delta Dental / MetLife accepted
          </span>
        </div>
      </div>

      <div className="mx-4 mt-2 grid grid-cols-2 gap-2">
        <div className="overflow-hidden rounded-t-[999px] rounded-b-xl bg-[#f0c8d4]">
          <img src={PHOTOS.dental1} alt="" className="h-36 w-full object-cover object-top" />
        </div>
        <div className="overflow-hidden rounded-t-[999px] rounded-b-xl bg-[#c8e4f0]">
          <img
            src={PHOTOS.dental2}
            alt=""
            className="h-36 w-full object-cover object-[50%_15%]"
          />
        </div>
      </div>
      <p className="m-0 px-4 pt-1.5 text-[9px] text-[#2a2420]/45">
        Smile gallery · before / after transformations
      </p>

      <div className="mt-4 grid gap-3 border-t border-[#2a2420]/10 px-4 py-4 sm:grid-cols-3">
        {[
          { t: 'Cleanings', d: 'Gentle exams that stay on schedule' },
          { t: 'Whitening', d: 'In-office and take-home options' },
          { t: 'Implants', d: 'Restorative plans with clear pricing' },
        ].map((s) => (
          <div key={s.t}>
            <p className="m-0 text-[12px] font-semibold">{s.t}</p>
            <p className="m-0 mt-1 text-[10px] text-[#2a2420]/50">{s.d}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#2c4a3e] px-4 py-3 text-[#FCFAF2]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="m-0 text-[11px]">New patients welcome · Staunton · Mon–Fri 8–5</p>
          <span className="rounded-full bg-[#FCFAF2] px-3 py-1.5 text-[10px] font-medium text-[#2c4a3e]">
            Reserve a chair
          </span>
        </div>
      </div>
    </div>
  )
}

/* ─── West & Clay ─── */

function CraftBefore() {
  return (
    <div className="min-h-full bg-[#f0f0f0] font-['Times_New_Roman',Times,serif] text-[#222]">
      <p className="m-0 bg-[#333] py-2 text-center text-[14px] font-bold text-[#ffcc00]">
        West &amp; Clay
      </p>
      <p className="m-0 bg-[#555] py-1 text-center text-[8px] text-white">
        Custom Carpentry · Additions · Decks · Since forever
      </p>
      <div className="space-y-3 p-3 text-[10px] leading-relaxed">
        <p className="m-0">
          We do custom carpentry additions decks kitchens and more for homes around town. Our team
          has years of experience building things the right way. Please email us for information
          about your project. We can send pictures of past jobs if you ask. Pricing varies depending
          on materials and scope. Contact info@westandclay.example for a quote whenever you are
          ready.
        </p>
        <div className="grid grid-cols-2 gap-2">
          <img
            src={PHOTOS.craftJob}
            alt=""
            className="h-24 w-full object-cover brightness-90 contrast-75"
          />
          <div className="flex h-24 items-center justify-center bg-[#bbb] text-[8px] text-[#666]">
            blurry jobsite.png
          </div>
        </div>
        <p className="m-0 text-[9px] text-[#00c] underline">email us for pricing</p>
        <p className="m-0 text-[8px] text-[#666]">
          No forms. No gallery. Just a wall of text like it is 2009.
        </p>
      </div>
      <div className="bg-[#222] py-2 text-center text-[8px] text-[#aaa]">
        Copyright West &amp; Clay · Site by Canva Website Builder
      </div>
    </div>
  )
}

function CraftAfter() {
  return (
    <div className="min-h-full bg-[#111110] font-nhg text-white">
      <header className="flex items-center justify-between px-4 py-3">
        <div>
          <p className="m-0 text-[10px] uppercase tracking-[0.18em] text-neutral-400">
            Custom carpentry
          </p>
          <p className="m-0 text-[13px] font-semibold">West &amp; Clay</p>
        </div>
        <div className="flex gap-2">
          <span className="rounded-md border border-neutral-600 px-2.5 py-1.5 text-[10px]">
            Lookbook
          </span>
          <span className="rounded-md bg-amber-500/90 px-2.5 py-1.5 text-[10px] font-semibold text-neutral-950">
            Pricing Guide
          </span>
        </div>
      </header>

      <div className="relative mx-4 overflow-hidden rounded-xl">
        <img src={PHOTOS.craftHero} alt="" className="h-40 w-full object-cover sm:h-48" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111110] via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 max-w-sm rounded-lg bg-white/95 p-3 text-neutral-950">
          <p className="m-0 text-[18px] font-semibold leading-tight">Built for generations.</p>
          <p className="m-0 mt-1 text-[10px] text-neutral-600">
            Custom additions, millwork, and remodels with upfront pricing.
          </p>
          <div className="mt-2 flex gap-2">
            <span className="rounded-md bg-neutral-950 px-2.5 py-1.5 text-[10px] text-white">
              Schedule Design Intake
            </span>
            <span className="rounded-md border border-neutral-300 px-2.5 py-1.5 text-[10px]">
              Download 2026 Guide
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 px-4">
        {[
          { src: PHOTOS.craftHero, t: 'Lookbook' },
          { src: PHOTOS.craftJob, t: 'Additions' },
          { src: PHOTOS.craftMill, t: 'Millwork' },
        ].map((c) => (
          <div key={c.t} className="overflow-hidden rounded-md border border-neutral-700">
            <img src={c.src} alt="" className="h-16 w-full object-cover" />
            <p className="m-0 bg-neutral-900 px-1.5 py-1 text-[9px] text-neutral-300">{c.t}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 border-t border-neutral-800 px-4 py-3">
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { n: '2.8x', l: 'Qualified leads' },
            { n: '18', l: 'Active builds' },
            { n: '100%', l: 'Written estimates' },
            { n: 'VA', l: 'Licensed' },
          ].map((s) => (
            <div key={s.l}>
              <p className="m-0 font-tiempos text-[15px] text-amber-400">{s.n}</p>
              <p className="m-0 text-[8px] text-neutral-500">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
