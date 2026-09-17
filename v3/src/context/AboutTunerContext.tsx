import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { folder, useControls, button } from 'leva'
import type { LevaStore } from '@/lib/levaStore'
import { ABOUT_STORAGE_KEY, defaultAboutTuner, loadAboutTuner, type AboutTuner } from '@/lib/aboutDefaults'

const Ctx = createContext<AboutTuner>(defaultAboutTuner)

export function AboutTunerProvider({ store, children }: { store: LevaStore; children: ReactNode }) {
  const [remembered] = useState(() => loadAboutTuner())

  const values = useControls(
    {
      Hero: folder(
        {
          heroEyebrow: { value: remembered.heroEyebrow, label: 'eyebrow' },
          heroLine1: { value: remembered.heroLine1, label: 'line 1' },
          heroLine2: { value: remembered.heroLine2, label: 'line 2' },
          heroTagline: { value: remembered.heroTagline, label: 'tagline' },
        },
        { collapsed: true },
      ),
      Story: folder(
        {
          storyLabel: { value: remembered.storyLabel, label: 'label' },
          storyTitle: { value: remembered.storyTitle, label: 'title' },
          storyP1: { value: remembered.storyP1, label: 'paragraph 1' },
          storyP2: { value: remembered.storyP2, label: 'paragraph 2' },
        },
        { collapsed: true },
      ),
      'What I do': folder(
        {
          doLabel: { value: remembered.doLabel, label: 'label' },
          doTitle: { value: remembered.doTitle, label: 'title' },
          do1Title: { value: remembered.do1Title, label: '1 title' },
          do1Body: { value: remembered.do1Body, label: '1 body' },
          do2Title: { value: remembered.do2Title, label: '2 title' },
          do2Body: { value: remembered.do2Body, label: '2 body' },
          do3Title: { value: remembered.do3Title, label: '3 title' },
          do3Body: { value: remembered.do3Body, label: '3 body' },
          do4Title: { value: remembered.do4Title, label: '4 title' },
          do4Body: { value: remembered.do4Body, label: '4 body' },
        },
        { collapsed: true },
      ),
      Process: folder(
        {
          processLabel: { value: remembered.processLabel, label: 'label' },
          processTitle: { value: remembered.processTitle, label: 'title' },
          step1Title: { value: remembered.step1Title, label: '1 title' },
          step1Body: { value: remembered.step1Body, label: '1 body' },
          step2Title: { value: remembered.step2Title, label: '2 title' },
          step2Body: { value: remembered.step2Body, label: '2 body' },
          step3Title: { value: remembered.step3Title, label: '3 title' },
          step3Body: { value: remembered.step3Body, label: '3 body' },
          step4Title: { value: remembered.step4Title, label: '4 title' },
          step4Body: { value: remembered.step4Body, label: '4 body' },
        },
        { collapsed: true },
      ),
      CTA: folder(
        {
          ctaLabel: { value: remembered.ctaLabel, label: 'label' },
          ctaTitle: { value: remembered.ctaTitle, label: 'title' },
          ctaSub: { value: remembered.ctaSub, label: 'sub' },
          ctaEmail: { value: remembered.ctaEmail, label: 'email' },
          ctaButton: { value: remembered.ctaButton, label: 'button' },
        },
        { collapsed: true },
      ),
      Persist: folder(
        {
          Remember: button(() => {
            /* values saved continuously below; button confirms */
          }),
          Revert: button(() => {
            localStorage.removeItem(ABOUT_STORAGE_KEY)
            window.location.reload()
          }),
        },
        { collapsed: false },
      ),
    },
    { store },
  )

  useEffect(() => {
    localStorage.setItem(ABOUT_STORAGE_KEY, JSON.stringify(values))
  }, [values])

  const t = useMemo(() => ({ ...defaultAboutTuner, ...values }) as AboutTuner, [values])

  return <Ctx.Provider value={t}>{children}</Ctx.Provider>
}

export function useAboutTuner() {
  return useContext(Ctx)
}
