import { createContext, useContext, useEffect, useMemo, useRef } from 'react'
import { useControls, button, folder } from 'leva'
import {
  defaultCardsTuner,
  defaultServiceCards,
  loadCardsTuner,
  CARDS_TUNER_STORAGE_KEY,
  toFlatCardsTuner,
} from '../components/cards/serviceCardsDefaults'

const CardsTunerContext = createContext(null)
const isDev = import.meta.env.DEV

function cardFolder(initial, index) {
  const c = defaultServiceCards[index]
  const n = index + 1
  return folder(
    {
      [`card${n}Badge`]: { value: initial[`card${n}Badge`] ?? c.badgeText, label: 'Badge' },
      [`card${n}Title`]: { value: initial[`card${n}Title`] ?? c.title, label: 'Title' },
      [`card${n}Desc`]: { value: initial[`card${n}Desc`] ?? c.description, label: 'Description', rows: 3 },
      [`card${n}Cta`]: { value: initial[`card${n}Cta`] ?? c.ctaText, label: 'CTA label' },
      [`card${n}Href`]: { value: initial[`card${n}Href`] ?? c.ctaHref, label: 'CTA link' },
      [`card${n}Accent`]: { value: initial[`card${n}Accent`] ?? c.accent, label: 'Accent' },
      [`card${n}Image`]: { value: initial[`card${n}Image`] ?? c.imageUrl, label: 'Image URL', rows: 2 },
    },
    { collapsed: true },
  )
}

function CardsTunerProviderInner({ children, store }) {
  const initial = useMemo(() => loadCardsTuner(), [])
  const settingsRef = useRef(defaultCardsTuner)

  const tuner = useControls(
    'Service Cards (Hero Section)',
    {
      Layout: folder(
        {
          rightPercent: { value: initial.rightPercent, min: 0, max: 30, step: 0.5, label: 'Right %' },
          bottomPercent: { value: initial.bottomPercent, min: 0, max: 40, step: 0.5, label: 'Bottom %' },
          cardWidth: { value: initial.cardWidth, min: 220, max: 320, step: 2 },
          cardMinHeight: { value: initial.cardMinHeight, min: 280, max: 440, step: 4, label: 'Card height' },
        },
        { collapsed: true },
      ),
      Style: folder(
        {
          cardBg: { value: initial.cardBg, label: 'Card background' },
          titleColor: { value: initial.titleColor },
          bodyColor: { value: initial.bodyColor },
          ctaColor: { value: initial.ctaColor },
          badgeBg: { value: initial.badgeBg },
          badgeColor: { value: initial.badgeColor },
          borderColor: { value: initial.borderColor },
          cardShadow: { value: initial.cardShadow, label: 'Shadow', rows: 2 },
        },
        { collapsed: true },
      ),
      DealAnimation: folder(
        {
          dealStartDelay: { value: initial.dealStartDelay, min: 0, max: 6, step: 0.1, label: 'Start delay (s)' },
          dealStagger: { value: initial.dealStagger, min: 0.15, max: 1.2, step: 0.05, label: 'Stagger (s)' },
          stackOffsetY: { value: initial.stackOffsetY, min: 4, max: 32, step: 1 },
          stackOffsetX: { value: initial.stackOffsetX, min: -24, max: 24, step: 1 },
          stackRotate: { value: initial.stackRotate, min: 0, max: 6, step: 0.1 },
          spreadGap: { value: initial.spreadGap, min: 200, max: 360, step: 5, label: 'Spread gap (px)' },
          springStiffness: { value: initial.springStiffness, min: 120, max: 600, step: 10, label: 'Deal stiffness' },
          springDamping: { value: initial.springDamping, min: 10, max: 40, step: 1, label: 'Deal damping' },
          spreadStiffness: { value: initial.spreadStiffness, min: 80, max: 400, step: 10, label: 'Spread stiffness' },
          spreadDamping: { value: initial.spreadDamping, min: 20, max: 50, step: 1, label: 'Spread damping' },
        },
        { collapsed: true },
      ),
      'Card 1': cardFolder(initial, 0),
      'Card 2': cardFolder(initial, 1),
      'Card 3': cardFolder(initial, 2),
      Actions: folder(
        {
          'Reset defaults': button(() => {
            localStorage.removeItem(CARDS_TUNER_STORAGE_KEY)
            window.location.reload()
          }),
          'Copy JSON': button(() => {
            navigator.clipboard?.writeText(JSON.stringify(settingsRef.current, null, 2))
          }),
        },
        { collapsed: true },
      ),
    },
    { collapsed: true },
    { store },
  )

  const settings = useMemo(() => toFlatCardsTuner(tuner), [tuner])
  settingsRef.current = settings

  useEffect(() => {
    localStorage.setItem(CARDS_TUNER_STORAGE_KEY, JSON.stringify({ ...tuner }))
  }, [settings, tuner])

  return (
    <CardsTunerContext.Provider value={{ settings }}>
      {children}
    </CardsTunerContext.Provider>
  )
}

export function CardsTunerProvider({ children, store }) {
  if (!isDev || !store) {
    return (
      <CardsTunerContext.Provider value={{ settings: defaultCardsTuner }}>
        {children}
      </CardsTunerContext.Provider>
    )
  }

  return <CardsTunerProviderInner store={store}>{children}</CardsTunerProviderInner>
}

export function useCardsTuner() {
  const ctx = useContext(CardsTunerContext)
  if (!ctx) return { settings: defaultCardsTuner }
  return ctx
}
