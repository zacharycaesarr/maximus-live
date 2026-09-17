import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { useControls, folder } from 'leva'
import type { LevaStore } from '@/lib/levaStore'
import {
  defaultDemoCanvasTuner,
  DEMO_CANVAS_STORAGE_KEY,
  loadDemoCanvasTuner,
  type DemoCanvasTuner,
} from '@/lib/demoCanvasDefaults'

const DemoCtx = createContext<DemoCanvasTuner>(defaultDemoCanvasTuner)

export function DemoCanvasTunerProvider({
  store,
  children,
}: {
  store: LevaStore
  children: ReactNode
}) {
  const initial = useMemo(() => loadDemoCanvasTuner(), [])

  const values = useControls(
    {
      'Demo canvas (hero)': folder(
        {
          enabled: initial.enabled,
          peekHeight: {
            value: initial.peekHeight,
            min: 160,
            max: 520,
            step: 10,
            label: 'peek height px',
          },
          offsetX: { value: initial.offsetX, min: -200, max: 200, step: 1 },
          offsetY: { value: initial.offsetY, min: -200, max: 200, step: 1 },
          scale: { value: initial.scale, min: 0.6, max: 1.4, step: 0.02 },
          delayAfterIntroMs: {
            value: initial.delayAfterIntroMs,
            min: 0,
            max: 6000,
            step: 100,
            label: 'delay after intro ms',
          },
          slideUpMs: {
            value: initial.slideUpMs,
            min: 400,
            max: 4000,
            step: 100,
            label: 'slide up ms',
          },
          label: initial.label,
          hint: initial.hint,
        },
        { collapsed: true },
      ),
    },
    { store },
  )

  const flat = { ...defaultDemoCanvasTuner, ...(values as Partial<DemoCanvasTuner>) } as DemoCanvasTuner

  useEffect(() => {
    try {
      localStorage.setItem(DEMO_CANVAS_STORAGE_KEY, JSON.stringify(flat))
    } catch {
      /* ignore */
    }
  }, [flat])

  return <DemoCtx.Provider value={flat}>{children}</DemoCtx.Provider>
}

export function useDemoCanvasTuner() {
  return useContext(DemoCtx)
}
