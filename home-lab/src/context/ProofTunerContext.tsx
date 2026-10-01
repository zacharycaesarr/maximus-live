import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useControls, folder, button } from 'leva'
import type { LevaStore } from '@/lib/levaStore'
import {
  defaultProofTuner,
  loadProofTuner,
  parseProofProjects,
  updateProjectField,
  PROOF_STORAGE_KEY,
  type ProofTuner,
  type ProofProject,
} from '@/lib/proofDefaults'

const ProofCtx = createContext<ProofTuner>(defaultProofTuner)

export function ProofTunerProvider({ store, children }: { store: LevaStore; children: ReactNode }) {
  const initial = useMemo(() => loadProofTuner(), [])
  const [projectsJson, setProjectsJson] = useState(initial.projectsJson)

  const values = useControls(
    {
      'Proof of work': folder(
        {
          enabled: initial.enabled,
          Title: folder(
            {
              flipPhraseA: { value: initial.flipPhraseA, label: 'flip line A' },
              flipPhraseB: { value: initial.flipPhraseB, label: 'flip line B' },
              flipColor: { value: initial.flipColor, label: 'flip color' },
            },
            { collapsed: true },
          ),
          Fan: folder(
            {
              autoplayMs: {
                value: initial.autoplayMs,
                min: 1200,
                max: 6000,
                step: 100,
                label: 'autoplay ms',
              },
              backBlurPx: { value: initial.backBlurPx, min: 0, max: 24, step: 1, label: 'back blur px' },
              backOpacity: {
                value: initial.backOpacity,
                min: 0.2,
                max: 1,
                step: 0.02,
                label: 'back opacity',
              },
              centerScale: {
                value: initial.centerScale,
                min: 0.9,
                max: 1.6,
                step: 0.02,
                label: 'center scale',
              },
              thumbScale: {
                value: initial.thumbScale,
                min: 0.8,
                max: 1.8,
                step: 0.05,
                label: 'ring scale',
              },
            },
            { collapsed: true },
          ),
          Showcase: folder(
            {
              expandEnabled: { value: initial.expandEnabled, label: 'click expand' },
              detailTitleSize: {
                value: initial.detailTitleSize,
                min: 18,
                max: 48,
                step: 1,
                label: 'title size',
              },
              detailAnimMs: {
                value: initial.detailAnimMs,
                min: 200,
                max: 900,
                step: 20,
                label: 'detail anim ms',
              },
              editClientIndex: {
                value: initial.editClientIndex,
                min: 1,
                max: 4,
                step: 1,
                label: 'edit client #',
              },
              previewExpanded: { value: false, label: 'open that client now' },
            },
            { collapsed: false },
          ),
          'Client fields': folder(
            {
              clientTitle: { value: '', label: 'title' },
              clientTag: { value: '', label: 'industry tag' },
              clientMetric: { value: '', label: 'metric' },
              clientCategory: {
                value: 'web',
                options: { Web: 'web', Ads: 'ads', Creative: 'creative' },
                label: 'category',
              },
              clientCategoryIcon: { value: '', label: 'category label' },
              clientVisual: {
                value: 'autoscroll',
                options: {
                  Autoscroll: 'autoscroll',
                  'Brickwork dashboard': 'brickwork-dashboard',
                  Lottie: 'lottie',
                },
                label: 'visual type',
              },
              clientImage: { value: '', label: 'image URL' },
              clientMediaUrl: { value: '', label: 'lottie URL' },
              clientBullets: { value: '', label: 'bullets ( | )' },
              clientTech: { value: '', label: 'tech ( | )' },
              'Apply fields to client #': button(() => {
                /* applied live via effect below; button is a nudge for Remember */
              }),
            },
            { collapsed: false },
          ),
          Persist: folder(
            {
              'Remember proof': button(() => {
                try {
                  localStorage.setItem(
                    `${PROOF_STORAGE_KEY}:remember`,
                    localStorage.getItem(PROOF_STORAGE_KEY) ?? '',
                  )
                } catch {
                  /* ignore */
                }
              }),
              'Revert to remembered': button(() => {
                try {
                  const raw = localStorage.getItem(`${PROOF_STORAGE_KEY}:remember`)
                  if (!raw) return
                  localStorage.setItem(PROOF_STORAGE_KEY, raw)
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

  const v = values as Record<string, unknown>
  const editIndex = Math.max(0, Math.min(3, Number(v.editClientIndex ?? 1) - 1))

  // Live-apply client fields whenever they change
  useEffect(() => {
    const title = String(v.clientTitle ?? '').trim()
    const tag = String(v.clientTag ?? '').trim()
    const metric = String(v.clientMetric ?? '').trim()
    // Skip until user types something (avoid wiping on mount with empty strings)
    if (!title && !tag && !metric && !String(v.clientImage ?? '').trim()) return

    setProjectsJson((prev) =>
      updateProjectField(prev, editIndex, {
        title: title || parseProofProjects(prev)[editIndex]?.title,
        tag: tag || parseProofProjects(prev)[editIndex]?.tag,
        metricHighlight: metric || parseProofProjects(prev)[editIndex]?.metricHighlight,
        category: (v.clientCategory as ProofProject['category']) || 'web',
        categoryIcon:
          String(v.clientCategoryIcon ?? '').trim() ||
          parseProofProjects(prev)[editIndex]?.categoryIcon,
        visualType: (v.clientVisual as ProofProject['visualType']) || 'autoscroll',
        image:
          String(v.clientImage ?? '').trim() || parseProofProjects(prev)[editIndex]?.image || '',
        mediaUrl: String(v.clientMediaUrl ?? '').trim() || undefined,
        bullets: String(v.clientBullets ?? '')
          .split('|')
          .map((s) => s.trim())
          .filter(Boolean),
        techStack: String(v.clientTech ?? '')
          .split('|')
          .map((s) => s.trim())
          .filter(Boolean),
      }),
    )
  }, [
    editIndex,
    v.clientTitle,
    v.clientTag,
    v.clientMetric,
    v.clientCategory,
    v.clientCategoryIcon,
    v.clientVisual,
    v.clientImage,
    v.clientMediaUrl,
    v.clientBullets,
    v.clientTech,
  ])

  const flat: ProofTuner = {
    ...defaultProofTuner,
    enabled: Boolean(v.enabled ?? true),
    flipPhraseA: String(v.flipPhraseA ?? defaultProofTuner.flipPhraseA),
    flipPhraseB: String(v.flipPhraseB ?? defaultProofTuner.flipPhraseB),
    flipColor: String(v.flipColor ?? defaultProofTuner.flipColor),
    autoplayMs: Number(v.autoplayMs ?? defaultProofTuner.autoplayMs),
    backBlurPx: Number(v.backBlurPx ?? defaultProofTuner.backBlurPx),
    backOpacity: Number(v.backOpacity ?? defaultProofTuner.backOpacity),
    centerScale: Number(v.centerScale ?? defaultProofTuner.centerScale),
    thumbScale: Number(v.thumbScale ?? defaultProofTuner.thumbScale),
    expandEnabled: Boolean(v.expandEnabled ?? true),
    detailTitleSize: Number(v.detailTitleSize ?? defaultProofTuner.detailTitleSize),
    detailAnimMs: Number(v.detailAnimMs ?? defaultProofTuner.detailAnimMs),
    editClientIndex: Number(v.editClientIndex ?? 1),
    previewExpanded: Boolean(v.previewExpanded),
    projectsJson,
  }

  useEffect(() => {
    try {
      localStorage.setItem(PROOF_STORAGE_KEY, JSON.stringify({ ...flat, previewExpanded: false }))
    } catch {
      /* ignore */
    }
  }, [flat])

  return <ProofCtx.Provider value={flat}>{children}</ProofCtx.Provider>
}

export function useProofTuner() {
  return useContext(ProofCtx)
}
