import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { useControls, folder, button } from '@home-leva'
import type { LevaStore } from '@/home/lib/levaStore'
import {
  defaultHowItWorks,
  HOW_IT_WORKS_STORAGE_KEY,
  loadHowItWorks,
  type HowItWorksTuner,
} from '@/lib/howItWorksDefaults'

const Ctx = createContext<HowItWorksTuner>(defaultHowItWorks)

export function HowItWorksTunerProvider({
  store,
  children,
}: {
  store: LevaStore
  children: ReactNode
}) {
  const initial = useMemo(() => loadHowItWorks(), [])

  const values = useControls(
    {
      'How it works': folder(
        {
          enabled: initial.enabled,
          title: initial.title,
          canopySubtitle: { value: initial.canopySubtitle, label: 'canopy subtitle' },
          canopyHighlight: { value: initial.canopyHighlight, label: 'highlight words' },
          idleScale: { value: initial.idleScale, min: 0.7, max: 1, step: 0.01, label: 'approach scale' },
          scrubStiffness: {
            value: initial.scrubStiffness,
            min: 40,
            max: 200,
            step: 5,
            label: 'scrub stiffness',
          },
          Fillets: folder(
            {
              filletSize: { value: initial.filletSize, min: 24, max: 96, step: 1, label: 'size px' },
              filletLeftX: { value: initial.filletLeftX, min: -80, max: 80, step: 1, label: 'left X' },
              filletLeftY: { value: initial.filletLeftY, min: -80, max: 80, step: 1, label: 'left Y' },
              filletLeftRotate: {
                value: initial.filletLeftRotate,
                min: -180,
                max: 180,
                step: 1,
                label: 'left rotate°',
              },
              filletRightX: { value: initial.filletRightX, min: -80, max: 80, step: 1, label: 'right X' },
              filletRightY: { value: initial.filletRightY, min: -80, max: 80, step: 1, label: 'right Y' },
              filletRightRotate: {
                value: initial.filletRightRotate,
                min: -180,
                max: 180,
                step: 1,
                label: 'right rotate°',
              },
            },
            { collapsed: false },
          ),
          Cards: folder(
            {
              card1Tag: { value: initial.card1Tag, label: '01 tag' },
              card1Title: { value: initial.card1Title, label: '01 title' },
              card1Body: { value: initial.card1Body, label: '01 body' },
              card2Tag: { value: initial.card2Tag, label: '02 tag' },
              card2Title: { value: initial.card2Title, label: '02 title' },
              card2Body: { value: initial.card2Body, label: '02 body' },
              card3Tag: { value: initial.card3Tag, label: '03 tag' },
              card3Title: { value: initial.card3Title, label: '03 title' },
              card3Body: { value: initial.card3Body, label: '03 body' },
            },
            { collapsed: true },
          ),
          Art: folder(
            {
              card1Art: { value: initial.card1Art, label: '01 art path' },
              card1ArtScale: {
                value: initial.card1ArtScale,
                min: 0.4,
                max: 2,
                step: 0.02,
                label: '01 art scale',
              },
              card1ArtOpacity: {
                value: initial.card1ArtOpacity,
                min: 0.05,
                max: 1,
                step: 0.01,
                label: '01 art opacity',
              },
              card1ArtX: { value: initial.card1ArtX, min: -160, max: 160, step: 1, label: '01 art X' },
              card1ArtY: { value: initial.card1ArtY, min: -160, max: 160, step: 1, label: '01 art Y' },
              card2Art: { value: initial.card2Art, label: '02 art path' },
              card2ArtScale: {
                value: initial.card2ArtScale,
                min: 0.4,
                max: 2,
                step: 0.02,
                label: '02 art scale',
              },
              card2ArtOpacity: {
                value: initial.card2ArtOpacity,
                min: 0.05,
                max: 1,
                step: 0.01,
                label: '02 art opacity',
              },
              card2ArtX: { value: initial.card2ArtX, min: -160, max: 160, step: 1, label: '02 art X' },
              card2ArtY: { value: initial.card2ArtY, min: -160, max: 160, step: 1, label: '02 art Y' },
              card3Art: { value: initial.card3Art, label: '03 art path' },
              card3ArtScale: {
                value: initial.card3ArtScale,
                min: 0.4,
                max: 2,
                step: 0.02,
                label: '03 art scale',
              },
              card3ArtOpacity: {
                value: initial.card3ArtOpacity,
                min: 0.05,
                max: 1,
                step: 0.01,
                label: '03 art opacity',
              },
              card3ArtX: { value: initial.card3ArtX, min: -160, max: 160, step: 1, label: '03 art X' },
              card3ArtY: { value: initial.card3ArtY, min: -160, max: 160, step: 1, label: '03 art Y' },
            },
            { collapsed: true },
          ),
          Persist: folder(
            {
              'Remember how it works': button(() => {
                try {
                  localStorage.setItem(
                    `${HOW_IT_WORKS_STORAGE_KEY}:remember`,
                    localStorage.getItem(HOW_IT_WORKS_STORAGE_KEY) ?? '',
                  )
                } catch {
                  /* ignore */
                }
              }),
              'Revert to remembered': button(() => {
                try {
                  const raw = localStorage.getItem(`${HOW_IT_WORKS_STORAGE_KEY}:remember`)
                  if (!raw) return
                  localStorage.setItem(HOW_IT_WORKS_STORAGE_KEY, raw)
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

  const flat = { ...defaultHowItWorks, ...(values as Partial<HowItWorksTuner>) } as HowItWorksTuner

  useEffect(() => {
    try {
      localStorage.setItem(HOW_IT_WORKS_STORAGE_KEY, JSON.stringify(flat))
    } catch {
      /* ignore */
    }
  }, [flat])

  return <Ctx.Provider value={flat}>{children}</Ctx.Provider>
}

export function useHowItWorksTuner() {
  return useContext(Ctx)
}
