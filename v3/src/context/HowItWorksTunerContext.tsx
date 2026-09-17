import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { useControls, folder, button } from 'leva'
import type { LevaStore } from '@/lib/levaStore'
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
          canopyBg: { value: initial.canopyBg, label: 'canopy bg' },
          cardBg: { value: initial.cardBg, label: 'card bg' },
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
              card1Emoji: { value: initial.card1Emoji, label: '01 emoji' },
              card2Tag: { value: initial.card2Tag, label: '02 tag' },
              card2Title: { value: initial.card2Title, label: '02 title' },
              card2Body: { value: initial.card2Body, label: '02 body' },
              card2Emoji: { value: initial.card2Emoji, label: '02 emoji' },
              card3Tag: { value: initial.card3Tag, label: '03 tag' },
              card3Title: { value: initial.card3Title, label: '03 title' },
              card3Body: { value: initial.card3Body, label: '03 body' },
              card3Emoji: { value: initial.card3Emoji, label: '03 emoji' },
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
