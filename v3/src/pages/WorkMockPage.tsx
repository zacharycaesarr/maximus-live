import type { ComponentType } from 'react'
import { Link, useParams } from 'react-router-dom'
import { WEB_MOCKS, type MockVersion } from '@/work-mockups/mockMeta'
import RidgeBefore from '@/work-mockups/ridge/RidgeBefore'
import RidgeAfter from '@/work-mockups/ridge/RidgeAfter'
import NorthlineBefore from '@/work-mockups/northline/NorthlineBefore'
import NorthlineAfter from '@/work-mockups/northline/NorthlineAfter'
import { cn } from '@/lib/utils'

const MAP: Record<string, { before: ComponentType; after: ComponentType }> = {
  'ridge-plumbing': { before: RidgeBefore, after: RidgeAfter },
  'northline-dental': { before: NorthlineBefore, after: NorthlineAfter },
}

/**
 * Full-bleed mock site with a thin Maximus chrome: back + before/after toggle.
 */
export default function WorkMockPage() {
  const { slug = '', version = 'after' } = useParams<{ slug: string; version: string }>()
  const v: MockVersion = version === 'before' ? 'before' : 'after'
  const meta = WEB_MOCKS.find((m) => m.slug === slug)
  const pair = MAP[slug]

  if (!meta || !pair) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#f7f7f5] font-nhg">
        <p className="m-0 text-espresso">Mock not found.</p>
          <Link to="/capabilities/web-development" className="text-sm text-espresso underline">
          Back to Web Development
        </Link>
      </div>
    )
  }

  const View = v === 'before' ? pair.before : pair.after

  return (
    <div className="min-h-screen bg-[#0e0d0c]">
      <div className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#0e0d0c]/95 px-4 py-2.5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link to="/capabilities/web-development" className="font-nhg text-[12px] text-white/55 no-underline hover:text-white">
            ← Web Development
          </Link>
          <span className="hidden font-nhg text-[12px] text-white/35 sm:inline">{meta.title}</span>
        </div>
        <div className="flex items-center gap-1 rounded-full border border-white/15 bg-white/5 p-1">
          <Link
            to={`/work/mock/${slug}/before`}
            className={cn(
              'rounded-full px-3.5 py-1.5 font-nhg text-[12px] font-medium no-underline transition',
              v === 'before' ? 'bg-white text-[#1a1612]' : 'text-white/60 hover:text-white',
            )}
          >
            Before
          </Link>
          <Link
            to={`/work/mock/${slug}/after`}
            className={cn(
              'rounded-full px-3.5 py-1.5 font-nhg text-[12px] font-medium no-underline transition',
              v === 'after' ? 'bg-[#c4a574] text-[#1a1612]' : 'text-white/60 hover:text-white',
            )}
          >
            After
          </Link>
        </div>
        <p className="m-0 hidden font-nhg text-[11px] text-white/35 md:block">Mock · not a live client site</p>
      </div>
      <View />
    </div>
  )
}
