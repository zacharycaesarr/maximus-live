/**
 * Phone homepage before/after — local photos + logos, real text.
 * Fonts are mock-only (not Maximus Neue Haas). Same business both sides.
 */

import type { CSSProperties, ReactNode } from 'react'

export type PhoneMockId = 'ridge' | 'northline' | 'summit'

const PHOTO = {
  dental1: '/phone-mocks/dental-smile-1.jpg',
  dental2: '/phone-mocks/dental-smile-2.png',
  hvac: '/phone-mocks/hvac-crew.jpg',
  plumbing: '/phone-mocks/plumbing-team.jpg',
  logoSmile: '/phone-mocks/logo-smile.png',
  logoRounds: '/phone-mocks/logo-rounds.png',
  logoPrecise: '/phone-mocks/logo-precise.png',
}

/* Mock-only faces — deliberately not site NHG */
const F = {
  smileDisplay: '"Libre Baskerville", Georgia, serif',
  smileBody: '"DM Sans", "Helvetica Neue", sans-serif',
  roundsDisplay: '"Oswald", "Arial Narrow", sans-serif',
  roundsBody: '"Barlow", Arial, sans-serif',
  preciseDisplay: '"Rubik", "Trebuchet MS", sans-serif',
  preciseBody: '"Rubik", "Segoe UI", sans-serif',
  beforeUgly: 'Arial, Tahoma, sans-serif',
  beforeTimes: '"Times New Roman", Times, serif',
}

function Screen({
  children,
  className = '',
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <div
      className={`flex h-full flex-col overflow-hidden pt-[40px] ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}

function TinyLogo({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      width={14}
      height={14}
      className="h-[14px] w-[14px] object-contain"
      decoding="async"
    />
  )
}

/** Dated, uncropped, a little painful on purpose */
export function PhoneMockBefore({ id }: { id: PhoneMockId }) {
  if (id === 'northline') {
    return (
      <Screen
        className="text-[#111]"
        style={{
          fontFamily: F.beforeUgly,
          background: '#4a7a9b',
        }}
      >
        <div
          className="flex items-center justify-between px-2 py-1.5"
          style={{ background: '#003d66', fontFamily: F.beforeUgly }}
        >
          <span className="text-[8px] font-bold text-[#ffee55]">SmileDesign Dental LLC</span>
          <span className="text-[9px] text-white">Menu</span>
        </div>
        <div className="bg-[#ffcc00] px-2 py-0.5 text-center text-[6px] font-bold uppercase text-[#333]">
          *** New patients get $50 off cleaning — call today!!! ***
        </div>
        {/* Uncropped hero — photo runs off the frame */}
        <div className="relative h-[32%] overflow-hidden bg-[#99aabb]">
          <img
            src={PHOTO.dental2}
            alt=""
            className="absolute -left-[18%] -top-[22%] h-[145%] w-[145%] max-w-none object-cover"
          />
        </div>
        <div className="bg-[#c8dff0] px-2.5 pt-2" style={{ fontFamily: F.beforeTimes }}>
          <p className="m-0 text-[11px] font-bold text-[#003d66] underline">
            Welcome to Our Website!
          </p>
          <p className="m-0 mt-1.5 text-[7px] leading-relaxed text-[#222]">
            SmileDesign Dental has been serving families in Staunton VA since forever. We do
            cleanings whitening implants and emergencies. Click below to learn more about our
            practice and staff bios.
          </p>
          <a
            href="#schedule"
            className="mt-2 inline-block text-[8px] font-bold text-[#0000ee] underline"
          >
            &gt;&gt; Schedule Appointment &lt;&lt;
          </a>
        </div>
        <div className="border-t-2 border-[#003d66] bg-[#e8f0f8] px-2.5 pt-1.5">
          <p
            className="m-0 text-[8px] font-bold text-[#990000]"
            style={{ fontFamily: F.beforeUgly }}
          >
            Our Services:
          </p>
          <p className="m-0 mt-1 text-[6.5px] leading-snug text-[#333]" style={{ fontFamily: F.beforeUgly }}>
            • Exams &amp; Cleanings &nbsp;• Whitening &nbsp;• Implants
            <br />
            • Crowns &nbsp;• Root Canals &nbsp;• Emergency Care
          </p>
        </div>
        <div className="mt-auto bg-[#333] px-2 py-1.5 text-center">
          <p className="m-0 text-[7px] text-[#ffee55]" style={{ fontFamily: F.beforeUgly }}>
            Call: (540) 555-0142
          </p>
          <p className="m-0 text-[5.5px] text-[#aaa]" style={{ fontFamily: F.beforeUgly }}>
            Best viewed in Internet Explorer · © SmileDesign
          </p>
        </div>
      </Screen>
    )
  }

  if (id === 'summit') {
    return (
      <Screen
        className="text-[#222]"
        style={{
          fontFamily: F.beforeUgly,
          background: '#c8c8c8 url("data:image/svg+xml,%3Csvg width=\'8\' height=\'8\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h4v4H0zm4 4h4v4H4z\' fill=\'%23b0b0b0\' fill-opacity=\'.35\'/%3E%3C/svg%3E")',
        }}
      >
        <table className="w-full border-collapse" style={{ fontFamily: F.beforeUgly }}>
          <tbody>
            <tr>
              <td className="bg-[#003366] px-2 py-1.5">
                <p className="m-0 text-[9px] font-bold text-white">BCCU Temp</p>
                <p className="m-0 text-[5px] text-[#99ccff]">Heating Cooling &amp; More!</p>
              </td>
              <td className="bg-[#cc0000] px-1.5 text-center text-[7px] font-bold text-white">
                CALL
                <br />
                NOW
              </td>
            </tr>
          </tbody>
        </table>
        <div className="relative h-[28%] overflow-hidden border-b-4 border-[#003366] bg-[#777]">
          <img
            src={PHOTO.hvac}
            alt=""
            className="absolute -left-[25%] top-[-30%] h-[160%] w-[160%] max-w-none object-cover brightness-90"
          />
        </div>
        <div className="bg-[#ffffcc] px-2 py-1 text-center text-[6.5px] font-bold text-[#990000]">
          !! SAME DAY SERVICE WHEN AVAILABLE !!
        </div>
        <div className="px-2 pt-2">
          <p className="m-0 text-center text-[10px] font-bold uppercase text-[#003366]">
            Your Local HVAC Experts
          </p>
          <p className="m-0 mt-1.5 text-[7px] leading-relaxed text-[#333]">
            Welcome to BCCU Temp website. We fix AC units furnaces heat pumps and do installs in
            Staunton Augusta County and surrounding areas. Family owned.
          </p>
          <button
            type="button"
            className="mt-2 w-full border-2 border-[#000] bg-[#ff6600] py-1.5 text-[8px] font-bold text-black"
          >
            Request a Quote
          </button>
        </div>
        <div className="mt-2 px-2">
          <table className="w-full border border-[#666] text-[6.5px]" cellPadding={3}>
            <tbody>
              <tr className="bg-[#003366] text-white">
                <td>Service</td>
                <td>Info</td>
              </tr>
              <tr className="bg-white">
                <td>AC Repair</td>
                <td>Click here</td>
              </tr>
              <tr className="bg-[#eee]">
                <td>Furnaces</td>
                <td>Click here</td>
              </tr>
              <tr className="bg-white">
                <td>Heat Pumps</td>
                <td>Click here</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-auto bg-[#003366] py-1.5 text-center text-[7px] text-white">
          (540) 555-0199 · BCCU Temp
        </p>
      </Screen>
    )
  }

  // Precise Plumbing before
  return (
    <Screen
      className="text-[#111]"
      style={{
        fontFamily: F.beforeUgly,
        background: 'linear-gradient(180deg, #2a5a3a 0%, #e8e8e8 18%, #e8e8e8 100%)',
      }}
    >
      <div className="bg-[#1a3d28] px-2 py-2 text-center">
        <p className="m-0 text-[10px] font-bold tracking-wide text-[#ffcc00]">
          PRECISE PLUMBING CO.
        </p>
        <p className="m-0 text-[5.5px] text-[#8fbc8f]">Family Owned Since 1987 · Licensed</p>
      </div>
      <div className="relative h-[30%] overflow-hidden bg-[#555]">
        <img
          src={PHOTO.plumbing}
          alt=""
          className="absolute left-[-12%] top-[-40%] h-[170%] w-[130%] max-w-none object-cover contrast-90"
        />
        <span className="absolute bottom-1 left-1 bg-[#ffff00] px-1 text-[5.5px] font-bold text-black">
          HOME
        </span>
      </div>
      <div className="overflow-hidden bg-[#990000] py-0.5">
        <p className="m-0 whitespace-nowrap px-1 text-[6px] text-white">
          Emergency? Call (540) 555-0177 — drains · water heaters · remodels — Staunton &amp;
          Waynesboro —
        </p>
      </div>
      <div className="px-2.5 pt-2 text-center">
        <p className="m-0 text-[9px] font-bold uppercase text-[#1a3d28]">Plumbers Near You!!!</p>
        <p className="m-0 mt-1.5 text-left text-[7px] leading-relaxed text-[#333]">
          Looking for a plumber? You came to the right place. We do drains water heaters bathroom
          remodels and emergency calls. Fill out the form or call us today.
        </p>
        <div className="mt-2 flex justify-center gap-1">
          <button
            type="button"
            className="rounded-sm bg-[#1a3d28] px-3 py-1.5 text-[7px] font-bold text-white"
          >
            Call Now
          </button>
          <button
            type="button"
            className="rounded-sm border border-[#666] bg-[#ddd] px-3 py-1.5 text-[7px] text-[#333]"
          >
            Email Us
          </button>
        </div>
      </div>
      <div className="mt-2 border-t border-[#999] px-2.5 pt-1.5">
        <p className="m-0 text-[7.5px] font-bold text-[#990000]">Quick Links:</p>
        <p className="m-0 mt-0.5 text-[6.5px] leading-relaxed text-[#0000cc] underline">
          About Us | Services | Coupons | Contact | Sitemap
        </p>
      </div>
      <div className="mt-auto bg-[#222] py-1.5 text-center text-[6px] text-[#aaa]">
        Copyright 2012 Precise Plumbing · Site by Canva Website Builder
      </div>
    </Screen>
  )
}

/** Premium redesign — same business, filled layout, unique bg + fonts */
export function PhoneMockAfter({ id }: { id: PhoneMockId }) {
  if (id === 'northline') {
    return (
      <Screen
        className="text-[#2a2420]"
        style={{
          fontFamily: F.smileBody,
          background:
            'radial-gradient(120% 80% at 50% -10%, #fce8ef 0%, #faf6f0 45%, #f3ebe3 100%)',
        }}
      >
        <div className="flex items-center justify-between px-3 pb-1.5">
          <div className="flex items-center gap-1.5">
            <TinyLogo src={PHOTO.logoSmile} alt="" />
            <span
              className="text-[7px] font-semibold tracking-[0.12em]"
              style={{ fontFamily: F.smileDisplay }}
            >
              SMILEDESIGN
            </span>
          </div>
          <span className="rounded-full bg-[#2c4a3e] px-2.5 py-1 text-[6.5px] text-[#FCFAF2]">
            Menu
          </span>
        </div>
        <div className="px-3 text-center">
          <p
            className="m-0 text-[15px] font-normal leading-[1.05]"
            style={{ fontFamily: F.smileDisplay }}
          >
            Calm care.
            <br />
            Easy booking.
          </p>
          <p className="m-0 mt-1.5 text-[8px] leading-snug text-[#2a2420]/55">
            Cleanings, whitening, implants. New patients welcome.
          </p>
          <div className="mt-2.5 flex justify-center gap-1.5">
            <span className="rounded-full bg-[#2c4a3e] px-3.5 py-1.5 text-[8px] font-medium text-white">
              Reserve a chair
            </span>
            <span className="rounded-full border border-[#2a2420]/20 px-2.5 py-1.5 text-[7.5px] text-[#2a2420]/70">
              (540) 555-0142
            </span>
          </div>
        </div>
        <div className="mt-3 flex flex-1 gap-2 px-3 pb-1">
          <div className="min-h-0 flex-1 overflow-hidden rounded-t-[999px] rounded-b-[10px] bg-[#f0c8d4]">
            <img
              src={PHOTO.dental1}
              alt=""
              className="h-full w-full object-cover object-top"
              decoding="async"
            />
          </div>
          <div className="min-h-0 flex-1 overflow-hidden rounded-t-[999px] rounded-b-[10px] bg-[#c8e4f0]">
            <img
              src={PHOTO.dental2}
              alt=""
              className="h-full w-full object-cover object-[50%_15%]"
              decoding="async"
            />
          </div>
        </div>
        <div className="px-3 pb-2.5 pt-2">
          <div className="flex items-center gap-1.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#c4a574]/35 text-[9px]">
              ‹
            </span>
            <div className="flex-1 rounded-full bg-[#2c4a3e] py-1.5 text-center text-[8px] font-medium text-white">
              Cleanings
            </div>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#c4a574]/35 text-[9px]">
              ›
            </span>
          </div>
          <p className="m-0 mt-1.5 text-center text-[6.5px] text-[#2a2420]/40">
            Staunton · Mon–Fri 8–5
          </p>
        </div>
      </Screen>
    )
  }

  if (id === 'summit') {
    /* Ember / charcoal theme — not blue (plumbing keeps blue) */
    return (
      <Screen
        className="text-[#FBF6EF]"
        style={{
          fontFamily: F.roundsBody,
          background:
            'repeating-linear-gradient(-28deg, #1a120e 0px, #1a120e 11px, #221710 11px, #221710 22px)',
        }}
      >
        <div className="flex items-center justify-between border-b border-[#c45c26]/25 px-3 py-1">
          <span className="text-[6px] uppercase tracking-wide text-[#FBF6EF]/45">
            Family-owned since 2011
          </span>
          <span className="text-[7px] font-medium text-[#f0a030]">(540) 555-0199</span>
        </div>
        <div className="flex items-center justify-between px-3 py-1.5">
          <div className="flex items-center gap-1.5">
            <TinyLogo src={PHOTO.logoRounds} alt="" />
            <p
              className="m-0 text-[11px] font-semibold uppercase tracking-wide"
              style={{ fontFamily: F.roundsDisplay }}
            >
              <span className="text-[#f07828]">BCCU</span>
              <span className="ml-1 text-[8px] font-medium text-[#FBF6EF]/55">Temp</span>
            </p>
          </div>
          <span className="text-[11px] text-[#FBF6EF]/45">☰</span>
        </div>
        <div className="relative mx-3 h-[22%] overflow-hidden rounded-[12px]">
          <img
            src={PHOTO.hvac}
            alt=""
            className="h-full w-full object-cover object-[45%_25%]"
            decoding="async"
            loading="lazy"
          />
          <div className="absolute bottom-1.5 right-2 rounded-md bg-black/75 px-2 py-0.5 text-[6px] text-white">
            A+ rated crew
          </div>
        </div>
        <div className="mt-1.5 px-3">
          <p
            className="m-0 text-[6px] uppercase tracking-[0.12em] text-[#f0a030]"
            style={{ fontFamily: F.roundsDisplay }}
          >
            Staunton &amp; Augusta County
          </p>
          <p
            className="m-0 mt-0.5 text-[12px] font-semibold leading-[1.1]"
            style={{ fontFamily: F.roundsDisplay }}
          >
            <span className="text-[#f07828]">One crew</span>
            <span> for heat &amp; cool.</span>
          </p>
          <p className="m-0 mt-1 text-[7px] leading-snug text-[#FBF6EF]/55">
            AC repair, furnaces, heat pumps, and maintenance that shows up.
          </p>
        </div>

        <div className="mx-3 mt-2 border-t border-[#c45c26]/30" />
        <div className="px-3 pt-1.5">
          <div className="flex flex-wrap gap-1">
            {['Same-day slots', 'Financing', 'NATE techs'].map((t) => (
              <span
                key={t}
                className="rounded border border-[#f07828]/30 bg-[#f07828]/10 px-1.5 py-0.5 text-[5.5px] text-[#FBF6EF]/75"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="mt-1.5 grid grid-cols-2 gap-x-2 gap-y-0.5 text-[6px] text-[#FBF6EF]/55">
            <p className="m-0">
              <span className="text-[#FBF6EF]/35">Hours </span>Mon–Sat 7–6
            </p>
            <p className="m-0">
              <span className="text-[#FBF6EF]/35">Emergency </span>24/7 line
            </p>
            <p className="m-0 col-span-2">
              <span className="text-[#FBF6EF]/35">Area </span>
              Staunton · Waynesboro · Augusta
            </p>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            <span className="rounded-lg bg-[#e06720] py-1.5 text-center text-[8px] font-semibold text-white">
              Call now
            </span>
            <span className="rounded-lg border border-[#f0a030]/50 bg-[#2a1a12] py-1.5 text-center text-[8px] font-semibold text-[#f0a030]">
              Request service
            </span>
          </div>
        </div>

        {/* Desktop: reviews fill the rest. Mobile: tiny next-section peek */}
        <div className="mx-3 mt-2 hidden min-h-0 flex-1 flex-col overflow-hidden border-t border-[#c45c26]/25 pt-1.5 md:flex">
          <p
            className="m-0 shrink-0 text-[5.5px] uppercase tracking-[0.14em] text-[#f0a030]"
            style={{ fontFamily: F.roundsDisplay }}
          >
            Neighbors say
          </p>
          <div className="mt-1 flex min-h-0 flex-1 flex-col justify-between gap-1 overflow-hidden">
            <div className="flex min-h-0 flex-1 flex-col justify-evenly gap-1 overflow-hidden">
              {[
                { q: 'On time, fair price, AC blowing cold again.', who: 'Google · Staunton' },
                { q: 'Furnace out on a Sunday. They answered.', who: 'Angi · Waynesboro' },
                { q: 'Honest quote. No upsell nonsense.', who: 'Facebook · Augusta' },
              ].map((r) => (
                <div
                  key={r.who}
                  className="min-h-0 flex-1 rounded-md border border-[#f07828]/20 bg-[#120c09]/80 px-2 py-1"
                >
                  <p className="m-0 text-[5.5px] text-[#f0a030]">★★★★★</p>
                  <p className="m-0 mt-0.5 line-clamp-2 text-[6.5px] italic leading-snug text-[#FBF6EF]/80">
                    “{r.q}”
                  </p>
                  <p className="m-0 mt-0.5 text-[5.5px] text-[#FBF6EF]/40">{r.who}</p>
                </div>
              ))}
            </div>
            <div className="shrink-0 overflow-hidden rounded-t-md border border-b-0 border-[#f07828]/25 bg-[#2a1a12] px-2 pb-3 pt-1.5">
              <p className="m-0 text-[6px] font-semibold text-[#FBF6EF]/70">Maintenance plans →</p>
              <p className="m-0 mt-0.5 text-[5.5px] text-[#FBF6EF]/35">
                Spring tune-ups · Filter reminders · Priority scheduling
              </p>
            </div>
          </div>
        </div>
        <div className="mx-3 mt-auto border-t border-[#c45c26]/20 pb-1 pt-1 md:hidden">
          <p className="m-0 text-[6px] font-semibold text-[#f07828]/80">Maintenance plans →</p>
          <p className="m-0 truncate text-[5px] text-[#FBF6EF]/35">
            Spring tune-ups · Filter reminders…
          </p>
        </div>
      </Screen>
    )
  }

  // Precise Plumbing after — teal/blue stays here
  return (
    <Screen
      className="text-[#FCFAF2]"
      style={{
        fontFamily: F.preciseBody,
        background:
          'radial-gradient(90% 70% at 80% 0%, #1a4a5c 0%, #0e1a22 55%, #0a1218 100%)',
      }}
    >
      <div className="flex items-center justify-between px-3 pb-1">
        <div className="flex items-center gap-1.5">
          <TinyLogo src={PHOTO.logoPrecise} alt="" />
          <span
            className="text-[7.5px] font-semibold tracking-wide"
            style={{ fontFamily: F.preciseDisplay }}
          >
            Precise Plumbing
          </span>
        </div>
        <span className="text-[10px] text-white/35">☰</span>
      </div>
      <div className="relative mx-3 h-[22%] overflow-hidden rounded-[12px]">
        <img
          src={PHOTO.plumbing}
          alt=""
          className="h-full w-full object-cover object-[50%_40%]"
          decoding="async"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1218] via-transparent to-transparent" />
        <p className="absolute bottom-1.5 left-2.5 m-0 text-[6px] uppercase tracking-[0.12em] text-[#7ec8e3]">
          Staunton · Waynesboro
        </p>
      </div>
      <div className="mt-1.5 px-3">
        <p
          className="m-0 text-[13px] font-medium leading-[1.05]"
          style={{ fontFamily: F.preciseDisplay }}
        >
          Plumbing that
          <br />
          shows up.
        </p>
        <p className="m-0 mt-1 text-[7px] leading-snug text-white/50">
          Drains, water heaters, remodeled bathrooms. Same-day answers.
        </p>
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          <span className="rounded-full bg-[#3d9bb8] py-1.5 text-center text-[8px] font-medium text-white">
            Call Precise
          </span>
          <span className="rounded-full border border-white/20 py-1.5 text-center text-[8px] text-white/85">
            Request job
          </span>
        </div>
      </div>

      <div className="mx-3 mt-2 border-t border-white/12" />
      <div className="px-3 pt-1.5">
        <p className="m-0 text-[5.5px] uppercase tracking-[0.14em] text-[#7ec8e3]/80">
          What we handle
        </p>
        <div className="mt-1 grid grid-cols-2 gap-1">
          {['Leak repair', 'Water heaters', 'Drain cleaning', 'Bath remodels'].map((s) => (
            <p
              key={s}
              className="m-0 rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-1 text-[6px] text-white/70"
            >
              {s}
            </p>
          ))}
        </div>
        <div className="mt-1.5 flex items-start justify-between gap-2 text-[6px] text-white/50">
          <p className="m-0">
            <span className="text-white/30">Hours </span>
            Mon–Fri 7–6 · Sat 8–2
          </p>
          <p className="m-0 text-right">
            <span className="text-white/30">Licensed </span>
            VA #48291
          </p>
        </div>
      </div>

      {/* Desktop: different review layout than HVAC. Mobile: next-section peek */}
      <div className="mx-3 mt-2 hidden min-h-0 flex-1 flex-col overflow-hidden border-t border-white/12 pt-1.5 md:flex">
        <div className="flex shrink-0 items-center justify-between">
          <p className="m-0 text-[5.5px] uppercase tracking-[0.14em] text-[#7ec8e3]/80">
            Recent jobs
          </p>
          <p className="m-0 text-[5.5px] text-white/30">Local work</p>
        </div>
        <div className="mt-1 flex min-h-0 flex-1 flex-col justify-between gap-1 overflow-hidden">
          <div className="grid min-h-0 flex-1 grid-cols-2 gap-1 content-stretch">
            {[
              { title: 'Water heater', note: 'Same-day swap · Waynesboro' },
              { title: 'Main line clear', note: 'Camera + hydro jet · Staunton' },
              { title: 'Bath rough-in', note: 'Addition · Augusta Co.' },
              { title: 'Slab leak find', note: 'Pinpoint · Fishersville' },
            ].map((j) => (
              <div
                key={j.title}
                className="flex min-h-0 flex-col justify-center rounded-md border border-[#3d9bb8]/25 bg-[#0c181f] p-1.5"
              >
                <p className="m-0 text-[7px] font-semibold text-white/85">{j.title}</p>
                <p className="m-0 text-[5.5px] leading-snug text-white/40">{j.note}</p>
              </div>
            ))}
          </div>
          <div className="shrink-0 overflow-hidden rounded-t-md border border-b-0 border-white/10 bg-[#123040] px-2 pb-4 pt-1.5">
            <p className="m-0 text-[6px] font-semibold text-[#7ec8e3]">Service area map →</p>
            <p className="m-0 mt-0.5 text-[5.5px] text-white/35">
              Staunton · Waynesboro · Fishersville · Craigsville
            </p>
          </div>
        </div>
      </div>
      <div className="mx-3 mt-auto border-t border-white/10 pb-1 pt-1 md:hidden">
        <p className="m-0 text-[6px] font-semibold text-[#7ec8e3]/85">Service area map →</p>
        <p className="m-0 truncate text-[5px] text-white/35">
          Staunton · Waynesboro · Fishersville…
        </p>
      </div>
    </Screen>
  )
}
