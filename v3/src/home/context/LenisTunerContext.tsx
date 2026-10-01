import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { useControls, folder, button } from '@home-leva'
import type { LevaStore } from '@/home/lib/levaStore'
import { defaultLenisTuner, loadLenisTuner, LENIS_STORAGE_KEY, type LenisTuner } from '@/home/lib/lenisDefaults'

const LenisCtx = createContext<LenisTuner>(defaultLenisTuner)

export function LenisTunerProvider({ store, children }: { store: LevaStore; children: ReactNode }) {
  const initial = useMemo(() => loadLenisTuner(), [])

  const values = useControls(
    {
      'Smooth scroll (Lenis)': folder(
        {
          enabled: initial.enabled,
          duration: { value: initial.duration, min: 0.4, max: 2.5, step: 0.05 },
          lerp: { value: initial.lerp, min: 0.02, max: 0.3, step: 0.01, label: 'drift (lerp)' },
          wheelMultiplier: { value: initial.wheelMultiplier, min: 0.3, max: 2, step: 0.05 },
          touchMultiplier: { value: initial.touchMultiplier, min: 0.5, max: 3, step: 0.1 },
          Persist: folder(
            {
              'Remember Lenis': button(() => {
                try {
                  localStorage.setItem(
                    `${LENIS_STORAGE_KEY}:remember`,
                    localStorage.getItem(LENIS_STORAGE_KEY) ?? '',
                  )
                } catch {
                  /* ignore */
                }
              }),
              'Revert to remembered': button(() => {
                try {
                  const raw = localStorage.getItem(`${LENIS_STORAGE_KEY}:remember`)
                  if (!raw) return
                  localStorage.setItem(LENIS_STORAGE_KEY, raw)
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

  const flat = { ...defaultLenisTuner, ...(values as Partial<LenisTuner>) } as LenisTuner

  useEffect(() => {
    try {
      localStorage.setItem(LENIS_STORAGE_KEY, JSON.stringify(flat))
    } catch {
      /* ignore */
    }
  }, [flat])

  return <LenisCtx.Provider value={flat}>{children}</LenisCtx.Provider>
}

export function useLenisTuner() {
  return useContext(LenisCtx)
}
