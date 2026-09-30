'use client'

import { ChevronDown, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import * as React from 'react'
import { cn } from '@/lib/utils'
import { faqRichAnswer } from '@/lib/faqRichAnswers'

/** Homepage FAQ — light surfaces + text-on-light from Homepage Colors. */
const themeClassName =
  '[--ic-background:var(--home-surface-light)] [--ic-foreground:var(--home-text-light)] [--ic-primary:var(--home-text-light)] [--ic-secondary:var(--home-muted)] [--ic-border:var(--home-line)] [--ic-card:var(--home-bg-light)] [--ic-card-foreground:var(--home-text-light)] [--ic-muted:var(--home-surface-light)] [--ic-muted-foreground:var(--home-muted)] [--ic-accent:var(--home-surface-light)] [--ic-accent-foreground:var(--home-text-light)] [--ic-ring:var(--home-line)] [--color-foreground:var(--ic-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-card:var(--ic-card)] [--color-border:var(--ic-border)] [--color-accent:var(--ic-accent)] [--color-ring:var(--ic-ring)]'

const PANEL_EASE = [0.16, 1, 0.3, 1] as const
const HEIGHT_TWEEN = { duration: 0.34, ease: PANEL_EASE }

export type FaqProItem = {
  id: string
  question: string
  answer: string
}

export type FaqProProps = {
  className?: string
  defaultOpenFirst?: boolean
  items: FaqProItem[]
  searchPlaceholder?: string
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function highlightText(text: string, query: string) {
  const normalizedQuery = query.trim()
  if (!normalizedQuery) return text
  const parts = text.split(new RegExp(`(${escapeRegExp(normalizedQuery)})`, 'gi'))
  return parts.map((part, index) => {
    if (part.toLowerCase() === normalizedQuery.toLowerCase()) {
      return (
        <mark className="rounded-sm bg-home-acid/35 px-0.5 text-home-on-light" key={index}>
          {part}
        </mark>
      )
    }
    return <React.Fragment key={index}>{part}</React.Fragment>
  })
}

function itemMatchesQuery(item: FaqProItem, query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q)
}

function getDefaultOpenId(items: FaqProItem[], defaultOpenFirst: boolean) {
  if (defaultOpenFirst && items[0]) return items[0].id
  return null
}

function FaqProRow({
  isOpen,
  item,
  onToggle,
  panelId,
  query,
  triggerId,
}: {
  isOpen: boolean
  item: FaqProItem
  onToggle: () => void
  panelId: string
  query: string
  triggerId: string
}) {
  return (
    <div className="rounded-2xl bg-[var(--ic-muted)]">
      <button
        aria-controls={panelId}
        aria-expanded={isOpen}
        className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--ic-ring)] focus-visible:ring-inset"
        id={triggerId}
        onClick={onToggle}
        type="button"
      >
        <span className="font-nhg text-[15px] font-medium leading-6 tracking-[-0.02em] text-[var(--ic-foreground)]">
          {highlightText(item.question, query)}
        </span>
        <ChevronDown
          aria-hidden
          className={cn(
            'mt-0.5 size-4 shrink-0 text-[var(--ic-muted-foreground)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
            isOpen && 'rotate-180',
          )}
        />
      </button>

      <motion.div
        animate={{ height: isOpen ? 'auto' : 0 }}
        aria-labelledby={triggerId}
        className="overflow-hidden"
        id={panelId}
        initial={false}
        role="region"
        transition={HEIGHT_TWEEN}
      >
        <div className="px-5 pb-5 font-nhg text-[14px] leading-6 text-[var(--ic-muted-foreground)]">
          {query.trim() ? highlightText(item.answer, query) : faqRichAnswer(item.id, item.answer)}
        </div>
      </motion.div>
    </div>
  )
}

/**
 * 21st FAQ Pro (edwinvakayil / preview under lyanchouss) — adapted to framer-motion + Maximus theme.
 */
export function FaqPro({
  className,
  defaultOpenFirst = false,
  items,
  searchPlaceholder = 'Search FAQs...',
}: FaqProProps) {
  const listId = React.useId()
  const wasSearchingRef = React.useRef(false)
  const [query, setQuery] = React.useState('')
  const [openId, setOpenId] = React.useState<string | null>(() =>
    getDefaultOpenId(items, defaultOpenFirst),
  )

  const isSearching = query.trim().length > 0
  const visibleItems = React.useMemo(
    () => items.filter((item) => itemMatchesQuery(item, query)),
    [items, query],
  )

  React.useEffect(() => {
    if (isSearching) {
      wasSearchingRef.current = true
      setOpenId((current) => {
        if (current && visibleItems.some((item) => item.id === current)) return current
        // Only auto-open when the open item disappeared from results
        if (current && !visibleItems.some((item) => item.id === current)) {
          return visibleItems[0]?.id ?? null
        }
        return current
      })
      return
    }
    if (wasSearchingRef.current) {
      wasSearchingRef.current = false
      setOpenId(getDefaultOpenId(items, defaultOpenFirst))
    }
  }, [defaultOpenFirst, isSearching, items, visibleItems])

  React.useEffect(() => {
    setOpenId((current) => {
      if (!current) return current
      return items.some((item) => item.id === current) ? current : null
    })
  }, [items])

  const toggleItem = React.useCallback((id: string) => {
    setOpenId((current) => (current === id ? null : id))
  }, [])

  return (
    <div className={cn(themeClassName, 'mx-auto flex w-full max-w-2xl flex-col gap-3', className)}>
      <div className="relative">
        <input
          aria-label={searchPlaceholder}
          className={cn(
            'h-12 w-full appearance-none rounded-full border border-[var(--ic-border)] bg-[var(--ic-card)] px-5 pr-11 font-nhg text-[15px] text-[var(--ic-foreground)]',
            'outline-none focus-visible:ring-2 focus-visible:ring-[var(--ic-ring)]',
            'placeholder:text-[var(--ic-muted-foreground)]',
            '[&::-webkit-search-cancel-button]:appearance-none',
          )}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
          type="search"
          value={query}
        />
        {query ? (
          <button
            aria-label="Clear search"
            className="absolute right-3 top-1/2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-[var(--ic-muted-foreground)] hover:bg-[var(--ic-accent)] hover:text-[var(--ic-foreground)]"
            onClick={() => setQuery('')}
            type="button"
          >
            <X aria-hidden className="size-4" />
          </button>
        ) : null}
      </div>

      <div className="flex flex-col gap-2.5">
        <AnimatePresence initial={false} mode="popLayout">
          {visibleItems.length > 0 ? (
            visibleItems.map((item) => (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                initial={{ opacity: 0, y: 4 }}
                key={item.id}
                layout="position"
                transition={{ duration: 0.2, ease: PANEL_EASE }}
              >
                <FaqProRow
                  isOpen={openId === item.id}
                  item={item}
                  onToggle={() => toggleItem(item.id)}
                  panelId={`${listId}-${item.id}-panel`}
                  query={query}
                  triggerId={`${listId}-${item.id}-trigger`}
                />
              </motion.div>
            ))
          ) : (
            <motion.p
              animate={{ opacity: 1 }}
              className="px-2 py-8 text-center font-nhg text-[14px] text-[var(--ic-muted-foreground)]"
              initial={{ opacity: 0 }}
              key="empty"
            >
              No FAQs match your search.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

FaqPro.displayName = 'FaqPro'
