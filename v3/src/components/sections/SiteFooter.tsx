'use client'

import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { buildFooterColumns } from '@/lib/footerDefaults'
import { useFooterTuner } from '@/context/FooterTunerContext'
import { cn } from '@/lib/utils'

/**
 * Brand + link columns with arrow hover. Flicker wordmark removed 2026-09-20,
 * it read as noise and padded the bottom of every page.
 */
export default function SiteFooter({ tone = 'onLight' }: { tone?: 'onLight' | 'onDark' }) {
  const t = useFooterTuner()
  const columns = useMemo(() => buildFooterColumns(t), [t])
  const dark = tone === 'onDark'

  if (!t.enabled) return null

  return (
    <footer
      id="site-footer"
      className={cn(
        'w-full pb-0',
        dark ? 'border-t border-white/10 bg-transparent' : 'border-t border-espresso/10 bg-[#f7f7f5]',
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-7 pb-5 md:flex-row md:items-start md:justify-between md:px-8 md:py-9 md:pb-6">
        <div className="flex max-w-xs flex-col items-start gap-4">
          <Link to="/" className="inline-flex items-center gap-2 no-underline">
            <img
              src="/assets/mrlogo-short.jpg"
              alt=""
              className={cn('h-8 w-8 object-contain', dark ? 'brightness-0 invert' : 'brightness-0')}
              width={32}
              height={32}
            />
            <span className={cn('font-nhg text-xl font-semibold', dark ? 'text-white' : 'text-espresso')}>
              {t.brandName}
            </span>
          </Link>
          <p
            className={cn(
              'm-0 font-nhg text-sm leading-relaxed',
              dark ? 'text-white/55' : 'text-espresso/55',
            )}
          >
            {t.brandBlurb}
          </p>
          <p
            className={cn(
              'm-0 font-nhg text-[11px] uppercase tracking-[0.12em]',
              dark ? 'text-white/35' : 'text-espresso/35',
            )}
          >
            {t.copyright}
          </p>
        </div>

        <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-3 md:max-w-xl">
          {columns.map((col) => (
            <ul key={col.title} className="m-0 flex list-none flex-col gap-2 p-0">
              <li
                className={cn(
                  'mb-1 font-nhg text-sm font-semibold',
                  dark ? 'text-white' : 'text-espresso',
                )}
              >
                {col.title}
              </li>
              {col.links.map((link) => (
                <li
                  key={`${col.title}-${link.label}`}
                  className={cn(
                    'group inline-flex items-center gap-1 font-nhg text-[15px]',
                    dark ? 'text-white/55' : 'text-espresso/55',
                  )}
                >
                  {link.href.startsWith('/') && !link.href.startsWith('/#') ? (
                    <Link
                      to={link.href}
                      className={cn(
                        'no-underline text-inherit',
                        dark ? 'hover:text-white' : 'hover:text-espresso',
                      )}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className={cn(
                        'no-underline text-inherit',
                        dark ? 'hover:text-white' : 'hover:text-espresso',
                      )}
                    >
                      {link.label}
                    </a>
                  )}
                  <span
                    className={cn(
                      'flex size-4 translate-x-0 items-center justify-center rounded opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100',
                      dark ? 'border border-white/20' : 'border border-espresso/15',
                    )}
                  >
                    <ChevronRight className="h-3 w-3" aria-hidden />
                  </span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

    </footer>
  )
}
