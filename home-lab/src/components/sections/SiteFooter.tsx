'use client'

import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Heart } from 'lucide-react'
import { buildFooterColumns } from '@/lib/footerDefaults'
import { useFooterTuner } from '@/context/FooterTunerContext'
import { cn } from '@/lib/utils'

/**
 * Brand + link columns with arrow hover. Flicker wordmark removed 2026-09-20,
 * it read as noise and padded the bottom of every page.
 */
export default function SiteFooter({ tone = 'onLight', seamless = false }: { tone?: 'onLight' | 'onDark'; seamless?: boolean }) {
  const t = useFooterTuner()
  const columns = useMemo(() => buildFooterColumns(t), [t])
  const dark = tone === 'onDark'

  if (!t.enabled) return null

  if (seamless) {
    return (
      <footer id="site-footer" className="mr-closing-footer">
        <div className="mr-closing-footer-main">
          <nav className="mr-closing-footer-grid" aria-label="Footer navigation">
            {columns.map((col) => (
              <ul key={col.title} data-home-reveal className="mr-closing-footer-list">
                <li>{col.title}</li>
                {col.links.map((link) => (
                  <li key={`${col.title}-${link.label}`}>
                    {link.href.startsWith('/') && !link.href.startsWith('/#') ? (
                      <Link to={link.href}>{link.label}</Link>
                    ) : (
                      <a href={link.href}>{link.label}</a>
                    )}
                  </li>
                ))}
              </ul>
            ))}
          </nav>
          <div data-home-reveal className="mr-closing-footer-bottom">
            <div className="mr-closing-footer-signoff">
              <p>{t.copyright}</p>
              <span>Made while the world was sleeping <Heart size={11} strokeWidth={1.7} aria-hidden="true" /></span>
            </div>
            <span>{t.brandBlurb}</span>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer
      id="site-footer"
      className={cn(
        'relative z-10 w-full overflow-hidden',
        seamless ? 'mr-closing-footer bg-transparent pb-24 md:pb-8' : dark
          ? 'border-t border-home-line/20 bg-home-bg-dark pb-24 md:pb-8'
          : 'border-t border-home-line/50 bg-home-bg-light pb-0',
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-7 pb-5 md:flex-row md:items-start md:justify-between md:px-8 md:py-9 md:pb-6">
        <div className="flex max-w-xs flex-col items-start gap-4">
          <Link to="/" className="inline-flex items-center gap-2 no-underline">
            <img
              src={dark ? '/assets/mrlogo-short-white.png' : '/assets/mrlogo-short-black.png'}
              alt=""
              className="h-8 w-8 object-contain"
              width={32}
              height={32}
            />
            <span className={cn('font-nhg text-xl font-semibold', dark ? 'text-home-on-dark' : 'text-home-on-light')}>
              {t.brandName}
            </span>
          </Link>
          <p
            className={cn(
              'm-0 font-nhg text-sm leading-relaxed',
              dark ? 'text-home-muted' : 'text-home-muted',
            )}
          >
            {t.brandBlurb}
          </p>
          <p
            className={cn(
              'm-0 font-nhg text-[11px] uppercase tracking-[0.12em]',
              'text-home-muted/70',
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
                  dark ? 'text-home-on-dark' : 'text-home-on-light',
                )}
              >
                {col.title}
              </li>
              {col.links.map((link) => (
                <li
                  key={`${col.title}-${link.label}`}
                  className="group inline-flex items-center gap-1 font-nhg text-[15px] text-home-muted"
                >
                  {link.href.startsWith('/') && !link.href.startsWith('/#') ? (
                    <Link
                      to={link.href}
                      className={cn(
                        'no-underline text-inherit',
                        dark ? 'hover:text-home-on-dark' : 'hover:text-home-on-light',
                      )}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className={cn(
                        'no-underline text-inherit',
                        dark ? 'hover:text-home-on-dark' : 'hover:text-home-on-light',
                      )}
                    >
                      {link.label}
                    </a>
                  )}
                  <span
                    className={cn(
                      'flex size-4 translate-x-0 items-center justify-center rounded opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100',
                      'border border-home-line/40',
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
