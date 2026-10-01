import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { useControls, folder, button } from '@home-leva'
import type { LevaStore } from '@/home/lib/levaStore'
import { defaultFooterTuner, loadFooterTuner, FOOTER_STORAGE_KEY, type FooterTuner } from '@/home/lib/footerDefaults'

const FooterCtx = createContext<FooterTuner>(defaultFooterTuner)

export function FooterTunerProvider({ store, children }: { store: LevaStore; children: ReactNode }) {
  const initial = useMemo(() => loadFooterTuner(), [])

  const values = useControls(
    {
      Footer: folder(
        {
          enabled: initial.enabled,
          CTA: folder(
            {
              headline: { value: initial.headline, label: 'headline' },
              primaryLabel: { value: initial.primaryLabel, label: 'left button' },
              primaryHref: { value: initial.primaryHref, label: 'left href' },
              secondaryLabel: { value: initial.secondaryLabel, label: 'right button' },
              secondaryHref: { value: initial.secondaryHref, label: 'right href' },
            },
            { collapsed: false },
          ),
          'Site footer': folder(
            {
              brandName: { value: initial.brandName, label: 'brand' },
              brandBlurb: { value: initial.brandBlurb, label: 'blurb' },
              col1Title: { value: initial.col1Title, label: 'col 1 title' },
              col1Links: { value: initial.col1Links, label: 'col 1 links' },
              col2Title: { value: initial.col2Title, label: 'col 2 title' },
              col2Links: { value: initial.col2Links, label: 'col 2 links' },
              col3Title: { value: initial.col3Title, label: 'col 3 title' },
              col3Links: { value: initial.col3Links, label: 'col 3 links' },
              copyright: { value: initial.copyright, label: 'copyright' },
            },
            { collapsed: true },
          ),
          Persist: folder(
            {
              'Remember footer': button(() => {
                try {
                  localStorage.setItem(
                    `${FOOTER_STORAGE_KEY}:remember`,
                    localStorage.getItem(FOOTER_STORAGE_KEY) ?? '',
                  )
                } catch {
                  /* ignore */
                }
              }),
              'Revert footer': button(() => {
                try {
                  const raw = localStorage.getItem(`${FOOTER_STORAGE_KEY}:remember`)
                  if (!raw) return
                  localStorage.setItem(FOOTER_STORAGE_KEY, raw)
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

  const flat = { ...defaultFooterTuner, ...(values as Partial<FooterTuner>) } as FooterTuner

  useEffect(() => {
    try {
      localStorage.setItem(FOOTER_STORAGE_KEY, JSON.stringify(flat))
    } catch {
      /* ignore */
    }
  }, [flat])

  return <FooterCtx.Provider value={flat}>{children}</FooterCtx.Provider>
}

export function useFooterTuner() {
  return useContext(FooterCtx)
}
