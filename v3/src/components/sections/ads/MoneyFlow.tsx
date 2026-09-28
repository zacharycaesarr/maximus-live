'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

type Props = {
  eyebrow: string
  title: string
  body: string
}

const PLATFORMS = [
  { id: 'meta', label: 'Meta', share: 0.45, out: [0.5, 0.35, 0.15] },
  { id: 'google', label: 'Google', share: 0.4, out: [0.6, 0.2, 0.2] },
  { id: 'tiktok', label: 'TikTok', share: 0.15, out: [0.2, 0.3, 0.5] },
]
const OUTCOMES = ['Calls', 'Forms', 'Bookings']

// SVG stage coords
const W = 640
const H = 360
const X0 = 40
const X1 = 320
const X2 = 600

function y(i: number, n: number) {
  const pad = 48
  return pad + (i / (n - 1)) * (H - pad * 2)
}

function curve(x1: number, y1: number, x2: number, y2: number) {
  const cx = (x1 + x2) / 2
  return `M${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`
}

/**
 * Budget → platforms → outcomes. Tap a platform and its paths light up,
 * the others fade. Dashes keep drifting so money looks like it moves.
 */
export default function MoneyFlow({ eyebrow, title, body }: Props) {
  const [hot, setHot] = useState<string | null>(null)

  return (
    <section className="border-t border-espresso/8 bg-[#f3f1ec] px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="font-nhg text-[11px] font-medium uppercase tracking-[0.18em] text-espresso/40">{eyebrow}</p>
          <h2 className="mt-3 font-tiempos text-[clamp(1.85rem,3.5vw,2.75rem)] font-light tracking-tight text-espresso">
            {title}
          </h2>
          <p className="mt-4 max-w-md font-nhg text-[15px] leading-relaxed text-espresso/55">{body}</p>
        </div>

        <div className="mt-10 overflow-hidden rounded-[24px] border border-espresso/10 bg-white/60 p-3 md:p-6">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Budget flowing to platforms and outcomes">
            <defs>
              <linearGradient id="mf-g" x1="0" x2="1">
                <stop offset="0" stopColor="#2C2520" />
                <stop offset="1" stopColor="#c4a574" />
              </linearGradient>
            </defs>

            {/* budget → platforms */}
            {PLATFORMS.map((p, i) => {
              const active = hot === null || hot === p.id
              return (
                <motion.path
                  key={`b-${p.id}`}
                  d={curve(X0 + 8, H / 2, X1 - 8, y(i, PLATFORMS.length))}
                  fill="none"
                  stroke="#2C2520"
                  strokeLinecap="round"
                  animate={{ opacity: active ? 0.85 : 0.12, strokeWidth: 2 + p.share * 18 }}
                  transition={{ duration: 0.4 }}
                  strokeDasharray="6 10"
                  className="mf-dash"
                />
              )
            })}

            {/* platforms → outcomes */}
            {PLATFORMS.map((p, i) =>
              p.out.map((share, j) => {
                const active = hot === null || hot === p.id
                return (
                  <motion.path
                    key={`o-${p.id}-${j}`}
                    d={curve(X1 + 8, y(i, PLATFORMS.length), X2 - 8, y(j, OUTCOMES.length))}
                    fill="none"
                    stroke="url(#mf-g)"
                    strokeLinecap="round"
                    animate={{ opacity: active ? 0.7 : 0.08, strokeWidth: 1.5 + share * p.share * 26 }}
                    transition={{ duration: 0.4 }}
                    strokeDasharray="6 10"
                    className="mf-dash"
                  />
                )
              }),
            )}

            {/* nodes */}
            <g>
              <circle cx={X0} cy={H / 2} r="14" fill="#2C2520" />
              <text x={X0} y={H / 2 + 34} textAnchor="middle" className="fill-espresso/60 font-nhg" fontSize="15">
                Budget
              </text>
            </g>
            {PLATFORMS.map((p, i) => (
              <g
                key={p.id}
                className="cursor-pointer"
                onPointerEnter={() => setHot(p.id)}
                onPointerLeave={() => setHot(null)}
                onClick={() => setHot((h) => (h === p.id ? null : p.id))}
              >
                <motion.rect
                  x={X1 - 52}
                  y={y(i, PLATFORMS.length) - 19}
                  width="104"
                  height="38"
                  rx="19"
                  animate={{
                    fill: hot === p.id ? '#2C2520' : '#ffffff',
                    stroke: hot === p.id ? '#2C2520' : 'rgba(44,37,32,0.18)',
                  }}
                  strokeWidth="1"
                />
                <motion.text
                  x={X1}
                  y={y(i, PLATFORMS.length) + 5}
                  textAnchor="middle"
                  fontSize="16"
                  className="font-nhg font-medium"
                  animate={{ fill: hot === p.id ? '#FCFAF2' : '#2C2520' }}
                >
                  {p.label}
                </motion.text>
              </g>
            ))}
            {OUTCOMES.map((o, j) => (
              <g key={o}>
                <circle cx={X2} cy={y(j, OUTCOMES.length)} r="6" fill="#c4a574" />
                <text
                  x={X2 - 14}
                  y={y(j, OUTCOMES.length) + 4}
                  textAnchor="end"
                  fontSize="16"
                  className="fill-espresso font-nhg"
                >
                  {o}
                </text>
              </g>
            ))}
          </svg>
          <p className="mt-2 px-2 font-nhg text-[11px] text-espresso/35 md:px-0">
            {hot ? `Showing ${PLATFORMS.find((p) => p.id === hot)?.label}. Tap again to clear.` : 'Tap a platform to follow its money.'}
          </p>
        </div>
      </div>
      <style>{`
        .mf-dash { animation: mf-flow 2.4s linear infinite; }
        @keyframes mf-flow { to { stroke-dashoffset: -32; } }
        @media (prefers-reduced-motion: reduce) { .mf-dash { animation: none; } }
      `}</style>
    </section>
  )
}
