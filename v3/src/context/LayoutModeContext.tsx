import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useControls, folder, button } from 'leva'
import type { LevaStore } from '@/lib/levaStore'

export type LayoutEditMode = 'auto' | 'desktop' | 'mobile'
export type LayoutBucket = 'desktop' | 'mobile'

type Ctx = {
  mode: LayoutEditMode
  bucket: LayoutBucket
  isMobileBucket: boolean
  /** Append to storage keys so phone/desktop prefs stay separate */
  keyFor: (base: string) => string
}

const LayoutModeCtx = createContext<Ctx>({
  mode: 'auto',
  bucket: 'desktop',
  isMobileBucket: false,
  keyFor: (b) => b,
})

function detectBucket(): LayoutBucket {
  if (typeof window === 'undefined') return 'desktop'
  const q = new URLSearchParams(window.location.search)
  const edit = q.get('edit')
  if (edit === 'mobile' || edit === 'm') return 'mobile'
  if (edit === 'desktop' || edit === 'd') return 'desktop'
  return window.matchMedia('(max-width: 768px)').matches ? 'mobile' : 'desktop'
}

/**
 * Lets Zachary edit mobile vs desktop layouts separately.
 * Phone: open http://YOUR-PC-IP:5175/?edit=mobile
 * Desktop: ?edit=desktop or leave auto.
 */
export function LayoutModeProvider({ store, children }: { store: LevaStore; children: ReactNode }) {
  const [bucket, setBucket] = useState<LayoutBucket>(() => detectBucket())

  const values = useControls(
    {
      'Device edit': folder(
        {
          mode: {
            value: 'auto' as LayoutEditMode,
            options: {
              'Auto (screen size)': 'auto',
              'Force desktop keys': 'desktop',
              'Force mobile keys': 'mobile',
            },
            label: 'editing as',
          },
          'Copy phone URL tip': button(() => {
            const url = `${window.location.origin}${window.location.pathname}?edit=mobile`
            void navigator.clipboard?.writeText(url)
            window.alert(
              `On your phone (same Wi‑Fi), open:\n\n${url}\n\n(Copied if clipboard allowed.)\nLeva saves mobile settings separately from desktop.`,
            )
          }),
        },
        { collapsed: false },
      ),
    },
    { store },
  )

  const mode = (values.mode as LayoutEditMode) || 'auto'

  useEffect(() => {
    const apply = () => {
      if (mode === 'desktop') setBucket('desktop')
      else if (mode === 'mobile') setBucket('mobile')
      else setBucket(detectBucket())
    }
    apply()
    const mq = window.matchMedia('(max-width: 768px)')
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [mode])

  const ctx = useMemo<Ctx>(
    () => ({
      mode,
      bucket,
      isMobileBucket: bucket === 'mobile',
      keyFor: (base) => `${base}:${bucket}`,
    }),
    [mode, bucket],
  )

  useEffect(() => {
    document.documentElement.dataset.layoutBucket = bucket
  }, [bucket])

  return <LayoutModeCtx.Provider value={ctx}>{children}</LayoutModeCtx.Provider>
}

export function useLayoutMode() {
  return useContext(LayoutModeCtx)
}
