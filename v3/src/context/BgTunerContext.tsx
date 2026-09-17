import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { useControls, folder, button } from 'leva'
import type { LevaStore } from '@/lib/levaStore'
import { defaultBgTuner, loadBgTuner, BG_STORAGE_KEY, type BgTuner } from '@/lib/bgDefaults'

const BgCtx = createContext<BgTuner>(defaultBgTuner)

export function BgTunerProvider({ store, children }: { store: LevaStore; children: ReactNode }) {
  const initial = useMemo(() => loadBgTuner(), [])

  const values = useControls(
    {
      Background: folder(
        {
          Mesh: folder(
            {
              color0: { value: initial.color0, label: 'wave 0' },
              color1: { value: initial.color1, label: 'wave 1' },
              color2: { value: initial.color2, label: 'wave 2' },
              color3: { value: initial.color3, label: 'wave 3' },
              color4: { value: initial.color4, label: 'wave 4' },
              speed: { value: initial.speed, min: 0.05, max: 1.2, step: 0.01 },
              wireOpacity: { value: initial.wireOpacity, min: 0, max: 1, step: 0.01, label: 'wire opacity' },
              vignetteStrength: {
                value: initial.vignetteStrength,
                min: 0,
                max: 1.5,
                step: 0.05,
                label: 'vignette',
              },
            },
            { collapsed: true },
          ),
          Persist: folder(
            {
              'Remember background': button(() => {
                try {
                  localStorage.setItem(
                    `${BG_STORAGE_KEY}:remember`,
                    localStorage.getItem(BG_STORAGE_KEY) ?? '',
                  )
                } catch {
                  /* ignore */
                }
              }),
              'Revert to remembered': button(() => {
                try {
                  const raw = localStorage.getItem(`${BG_STORAGE_KEY}:remember`)
                  if (!raw) return
                  localStorage.setItem(BG_STORAGE_KEY, raw)
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

  const flat = { ...defaultBgTuner, ...(values as Partial<BgTuner>) } as BgTuner

  useEffect(() => {
    try {
      localStorage.setItem(BG_STORAGE_KEY, JSON.stringify(flat))
    } catch {
      /* ignore */
    }
  }, [flat])

  return <BgCtx.Provider value={flat}>{children}</BgCtx.Provider>
}

export function useBgTuner() {
  return useContext(BgCtx)
}
