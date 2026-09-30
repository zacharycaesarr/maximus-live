import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { useControls, folder, button } from 'leva'
import type { LevaStore } from '@/lib/levaStore'
import {
  defaultReachTuner,
  loadReachTuner,
  REACH_STORAGE_KEY,
  type ReachTuner,
} from '@/lib/reachDefaults'

const ReachCtx = createContext<ReachTuner>(defaultReachTuner)

export function ReachTunerProvider({ store, children }: { store: LevaStore; children: ReactNode }) {
  const initial = useMemo(() => loadReachTuner(), [])

  const values = useControls(
    {
      'Nav · REACH stretch': folder(
        {
          enabled: initial.enabled,
          fontFamily: {
            value: initial.fontFamily,
            options: { 'Neue Haas (default)': 'nhg', 'Druk Condensed': 'druk' },
            label: 'wordmark font',
          },
          fontSize: { value: initial.fontSize, min: 12, max: 36, step: 1, label: 'REACH size' },
          letterSpacingEm: { value: initial.letterSpacingEm, min: -0.05, max: 0.2, step: 0.005 },
          color: initial.color,
          Maximus: folder(
            {
              showMaximus: initial.showMaximus,
              maximusText: { value: initial.maximusText, label: 'text' },
              maximusSize: { value: initial.maximusSize, min: 5, max: 18, step: 0.5, label: 'size' },
              maximusWeight: {
                value: initial.maximusWeight,
                min: 300,
                max: 700,
                step: 100,
                label: 'weight',
              },
              maximusTracking: {
                value: initial.maximusTracking,
                min: 0,
                max: 0.3,
                step: 0.01,
                label: 'tracking',
              },
              maximusOpacity: {
                value: initial.maximusOpacity,
                min: 0.4,
                max: 1,
                step: 0.02,
                label: 'opacity',
              },
              stackGap: { value: initial.stackGap, min: 0, max: 16, step: 1, label: 'gap to REACH' },
              stretchMaximus: {
                value: initial.stretchMaximus,
                label: 'stretch Maximus (off by default)',
              },
            },
            { collapsed: true },
          ),
          'REACH letters': folder(
            {
              R: { value: initial.R, min: 1, max: 3, step: 0.05 },
              E: { value: initial.E, min: 1, max: 3, step: 0.05 },
              A: { value: initial.A, min: 1, max: 3, step: 0.05 },
              C: { value: initial.C, min: 1, max: 3, step: 0.05 },
              H: { value: initial.H, min: 1, max: 3, step: 0.05 },
            },
            { collapsed: true },
          ),
          'Maximus letters': folder(
            {
              Ma: { value: initial.Ma, min: 1, max: 3, step: 0.05, label: 'M' },
              Ax: { value: initial.Ax, min: 1, max: 3, step: 0.05, label: 'a' },
              Xx: { value: initial.Xx, min: 1, max: 3, step: 0.05, label: 'x' },
              Ii: { value: initial.Ii, min: 1, max: 3, step: 0.05, label: 'i' },
              Mm: { value: initial.Mm, min: 1, max: 3, step: 0.05, label: 'm' },
              Uu: { value: initial.Uu, min: 1, max: 3, step: 0.05, label: 'u' },
              Ss: { value: initial.Ss, min: 1, max: 3, step: 0.05, label: 's' },
            },
            { collapsed: true },
          ),
          Persist: folder(
            {
              'Remember REACH': button(() => {
                try {
                  localStorage.setItem(
                    `${REACH_STORAGE_KEY}:remember`,
                    localStorage.getItem(REACH_STORAGE_KEY) ?? '',
                  )
                } catch {
                  /* ignore */
                }
              }),
              'Revert to remembered': button(() => {
                try {
                  const raw = localStorage.getItem(`${REACH_STORAGE_KEY}:remember`)
                  if (!raw) return
                  localStorage.setItem(REACH_STORAGE_KEY, raw)
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

  const flat = { ...defaultReachTuner, ...(values as Partial<ReachTuner>) } as ReachTuner

  useEffect(() => {
    try {
      localStorage.setItem(REACH_STORAGE_KEY, JSON.stringify(flat))
    } catch {
      /* ignore */
    }
  }, [flat])

  return <ReachCtx.Provider value={flat}>{children}</ReachCtx.Provider>
}

export function useReachTuner() {
  return useContext(ReachCtx)
}
