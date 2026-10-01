import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { useControls, folder, button } from '@home-leva'
import type { LevaStore } from '@/home/lib/levaStore'
import {
  defaultHeroTextTuner,
  HERO_TEXT_TUNER_STORAGE_KEY,
  loadHeroTextTuner,
  toFlatHeroTuner,
  type HeroTextTuner,
} from '@/components/hero/heroTextDefaults'

const HeroTextCtx = createContext<HeroTextTuner>(defaultHeroTextTuner)

export function HeroTextTunerProvider({
  store,
  children,
}: {
  store: LevaStore
  children: ReactNode
}) {
  const initial = useMemo(() => loadHeroTextTuner(), [])

  const values = useControls(
    {
      'Main (I want Max To..) Text': folder(
        {
          // Keep offsets at this level so Leva values stay flat (no nest miss)
          copyOffsetX: {
            value: initial.copyOffsetX,
            min: -200,
            max: 200,
            step: 1,
            label: '(moved → Hero layout · Copy block)',
          },
          copyOffsetY: {
            value: initial.copyOffsetY,
            min: -200,
            max: 200,
            step: 1,
            label: '(moved → Hero layout · Copy block)',
          },
          Content: folder(
            {
              stemText: { value: initial.stemText, label: 'Stem' },
              phrases: { value: initial.phrases, label: 'Phrases (|)' },
              scrollPhrase: initial.scrollPhrase,
              pauseCycle: initial.pauseCycle,
              showCursor: initial.showCursor,
            },
            { collapsed: true },
          ),
          Font: folder(
            {
              headlineFont: {
                value: initial.headlineFont,
                options: {
                  'Tiempos Headline (main + rotating)': 'tiempos',
                  'Neue Haas Grotesk': 'nhg',
                },
                label: 'headline font',
              },
            },
            { collapsed: false },
          ),
          'Phrase hover': folder(
            {
              phraseHoverEnabled: { value: initial.phraseHoverEnabled, label: 'enabled' },
              phraseHoverScale: {
                value: initial.phraseHoverScale,
                min: 1,
                max: 1.12,
                step: 0.005,
                label: 'scale',
              },
              phraseArrowSize: {
                value: initial.phraseArrowSize,
                min: 16,
                max: 48,
                step: 1,
                label: 'arrow size',
              },
              phraseArrowGap: {
                value: initial.phraseArrowGap,
                min: 0,
                max: 24,
                step: 1,
                label: 'arrow gap px',
              },
              phraseHoverResumeMs: {
                value: initial.phraseHoverResumeMs,
                min: 80,
                max: 1200,
                step: 20,
                label: 'resume next ms',
              },
              phraseHref: { value: initial.phraseHref, label: 'click href' },
            },
            { collapsed: true },
          ),
          'Phrase badges': folder(
            {
              badgeEnabled: { value: initial.badgeEnabled, label: 'show micro badge' },
              badgeSize: {
                value: initial.badgeSize,
                min: 28,
                max: 72,
                step: 1,
                label: 'badge size px',
              },
              badgeRadius: {
                value: initial.badgeRadius,
                min: 6,
                max: 24,
                step: 1,
                label: 'corner radius',
              },
              badgeBg: { value: initial.badgeBg, label: 'badge bg' },
              badgeBorder: { value: initial.badgeBorder, label: 'badge border' },
              badgeSlideMs: {
                value: initial.badgeSlideMs,
                min: 120,
                max: 800,
                step: 10,
                label: 'slide ms',
              },
              badgeGapBelow: {
                value: initial.badgeGapBelow,
                min: 4,
                max: 40,
                step: 1,
                label: 'gap above stem',
              },
              phraseBadges: {
                value: initial.phraseBadges,
                label: 'phrase||emoji ||| …',
              },
            },
            { collapsed: false },
          ),
          Type: folder(
            {
              fontSize: { value: initial.fontSize, min: 28, max: 120, step: 1 },
              maxWidth: { value: initial.maxWidth, min: 280, max: 1400, step: 10, label: 'line width' },
              singleLine: { value: initial.singleLine, label: 'one sentence' },
              spaceAfterTo: { value: initial.spaceAfterTo, min: 0, max: 0.8, step: 0.01, label: 'gap after to (em)' },
              stemWeight: { value: initial.stemWeight, min: 100, max: 900, step: 100 },
              phraseWeight: { value: initial.phraseWeight, min: 100, max: 900, step: 100 },
              letterSpacing: { value: initial.letterSpacing, min: -0.08, max: 0.08, step: 0.005 },
              lineHeight: { value: initial.lineHeight, min: 0.8, max: 1.4, step: 0.01 },
              stemColor: initial.stemColor,
              phraseColor: initial.phraseColor,
              glowStrength: { value: initial.glowStrength, min: 0, max: 0.3, step: 0.005 },
              glowColor: initial.glowColor,
            },
            { collapsed: true },
          ),
          Animation: folder(
            {
              typeSpeed: { value: initial.typeSpeed, min: 10, max: 120, step: 1, label: 'type speed (ms)' },
              showCursor: { value: initial.showCursor, label: 'blinking type bar' },
              cycleSeconds: { value: initial.cycleSeconds, min: 1, max: 6, step: 0.1, label: 'phrase cycle sec' },
              staggerDelay: { value: initial.staggerDelay, min: 0, max: 12, step: 1 },
              blurSpeed: { value: initial.blurSpeed, min: 0.2, max: 3, step: 0.05 },
              blurFps: { value: initial.blurFps, min: 15, max: 60, step: 1 },
              blurDurationFrames: { value: initial.blurDurationFrames, min: 30, max: 180, step: 1 },
            },
            { collapsed: true },
          ),
          Persist: folder(
            {
              'Remember hero text': button(() => {
                try {
                  localStorage.setItem(
                    `${HERO_TEXT_TUNER_STORAGE_KEY}:remember`,
                    localStorage.getItem(HERO_TEXT_TUNER_STORAGE_KEY) ?? '',
                  )
                } catch {
                  /* ignore */
                }
              }),
              'Revert to remembered': button(() => {
                try {
                  const raw = localStorage.getItem(`${HERO_TEXT_TUNER_STORAGE_KEY}:remember`)
                  if (!raw) return
                  localStorage.setItem(HERO_TEXT_TUNER_STORAGE_KEY, raw)
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

  const flat = toFlatHeroTuner(values as Partial<HeroTextTuner>)

  useEffect(() => {
    try {
      localStorage.setItem(HERO_TEXT_TUNER_STORAGE_KEY, JSON.stringify(flat))
    } catch {
      /* ignore */
    }
  }, [flat])

  // Body/nav stay Neue Haas; headline uses font-tiempos class only
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--ff-display',
      "'Neue Haas Grotesk Display', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    )
    document.documentElement.dataset.siteFont = 'nhg'
  }, [])

  return <HeroTextCtx.Provider value={flat}>{children}</HeroTextCtx.Provider>
}

export function useHeroTextTuner() {
  return useContext(HeroTextCtx)
}
