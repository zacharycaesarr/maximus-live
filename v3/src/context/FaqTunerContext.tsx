import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { useControls, folder, button } from '@home-leva'
import type { LevaStore } from '@/home/lib/levaStore'
import {
  defaultFaqTuner,
  FAQ_STORAGE_KEY,
  loadFaqTuner,
  parseFaqItems,
  type FaqEntry,
  type FaqTuner,
} from '@/lib/faqDefaults'

type FaqCtx = FaqTuner & { items: FaqEntry[] }

const Ctx = createContext<FaqCtx>({ ...defaultFaqTuner, items: parseFaqItems(defaultFaqTuner.itemsRaw) })

export function FaqTunerProvider({ store, children }: { store: LevaStore; children: ReactNode }) {
  const initial = useMemo(() => loadFaqTuner(), [])

  const values = useControls(
    {
      FAQ: folder(
        {
          enabled: initial.enabled,
          defaultOpenFirst: { value: initial.defaultOpenFirst, label: 'open first by default' },
          searchPlaceholder: { value: initial.searchPlaceholder, label: 'search placeholder' },
          itemsRaw: {
            value: initial.itemsRaw,
            label: 'items (id||Q||A ||| …)',
          },
          Persist: folder(
            {
              'Remember FAQ': button(() => {
                try {
                  localStorage.setItem(
                    `${FAQ_STORAGE_KEY}:remember`,
                    localStorage.getItem(FAQ_STORAGE_KEY) ?? '',
                  )
                } catch {
                  /* ignore */
                }
              }),
              'Revert to remembered': button(() => {
                try {
                  const raw = localStorage.getItem(`${FAQ_STORAGE_KEY}:remember`)
                  if (!raw) return
                  localStorage.setItem(FAQ_STORAGE_KEY, raw)
                  window.location.reload()
                } catch {
                  /* ignore */
                }
              }),
            },
            { collapsed: true },
          ),
        },
        { collapsed: true },
      ),
    },
    { store },
  )

  const flat = { ...defaultFaqTuner, ...(values as Partial<FaqTuner>) } as FaqTuner
  const items = useMemo(() => parseFaqItems(flat.itemsRaw), [flat.itemsRaw])

  useEffect(() => {
    try {
      localStorage.setItem(FAQ_STORAGE_KEY, JSON.stringify(flat))
    } catch {
      /* ignore */
    }
  }, [flat])

  const ctx = useMemo(() => ({ ...flat, items }), [flat, items])

  return <Ctx.Provider value={ctx}>{children}</Ctx.Provider>
}

export function useFaqTuner() {
  return useContext(Ctx)
}
