import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { LevaInputs, LevaPanel, button, folder, useControls, useCreateStore } from 'leva'
import { WEB_MOCKS } from '@/work-mockups/mockMeta'
import { DEFAULT_WORK_SETTINGS, STORAGE, loadWorkSettings, readWebsiteCopy, type WorkSettings } from './selected-work-settings'
import { BUILD_CASE_COPY } from '@/work-mockups/build-case-copy'
import type { BuildCaseId } from '@/work-mockups/build-case-stages'

const versions = ['before', 'after'] as const
const websiteFields = (id: string, version: 'before' | 'after') => Object.entries(BUILD_CASE_COPY[id as BuildCaseId][version])

const flatSettings = (settings: WorkSettings) => Object.fromEntries([
  ...Object.entries(settings.global).map(([key,value]) => [`global_${key}`,value]),
  ...Object.entries(settings.motion).map(([key,value]) => [`motion_${key}`,value]),
  ...WEB_MOCKS.flatMap((project,i) => [
    ...Object.entries(settings.projects[project.slug]).filter(([key]) => !key.endsWith('Website')).map(([key,value]) => [`p${i}_${key}`,value]),
    ...versions.flatMap(version => {
      const copy = readWebsiteCopy(settings.projects[project.slug][`${version}Website`])
      return websiteFields(project.slug, version).map(([key,value],n) => [`p${i}_${version}_${n}`,copy[key] ?? value])
    }),
  ]),
])

/** Own store and subscription: editing this panel never updates page-level tuners. */
export function SelectedWorkControls({ initial, onChange }: { initial: WorkSettings; onChange: (settings: WorkSettings) => void }) {
  const [expanded, setExpanded] = useState(false)
  const panelId = useId()
  const store = useCreateStore()
  const first = useRef(initial)
  const current = useRef(initial)
  const apply = useRef<(values: Record<string, unknown>) => void>(() => {})
  const [values, set] = useControls('Web Development', () => ({
    'Selected Work': folder({
      'Global Copy': folder(Object.fromEntries(Object.entries(first.current.global).map(([key,value]) => [`global_${key}`, { value, type: LevaInputs.STRING, label: key.replace(/([A-Z])/g,' $1').toLowerCase() }])), { collapsed: true }),
      ...Object.fromEntries(WEB_MOCKS.map((project,i) => [`Project ${String(i+1).padStart(2,'0')}`, folder({
        ...Object.fromEntries(Object.entries(first.current.projects[project.slug]).filter(([key]) => !key.endsWith('Website')).map(([key,value]) => [`p${i}_${key}`, { value, type: LevaInputs.STRING, label: key.replace(/([A-Z])/g,' $1').toLowerCase(), ...(key === 'description' || key === 'focus' ? { rows: 3 } : {}) }])),
        ...Object.fromEntries(versions.map(version => {
          const copy = readWebsiteCopy(first.current.projects[project.slug][`${version}Website`])
          return [`${version === 'before' ? 'Before' : 'After'} website copy`, folder(Object.fromEntries(websiteFields(project.slug, version).map(([key,value],n) => [`p${i}_${version}_${n}`, { value: copy[key] ?? value, type: LevaInputs.STRING, label: key.trim().slice(0, 32), hint: key, ...(key.length > 75 ? { rows: 3 } : {}) }])), { collapsed: true })]
        })),
      }, { collapsed: true })])),
      Motion: folder({
        motion_entrance: { value: first.current.motion.entrance, label: 'entrance ms', min: 320, max: 420, step: 10 },
        motion_switching: { value: first.current.motion.switching, label: 'project switch ms', min: 260, max: 380, step: 10 },
        motion_stagger: { value: first.current.motion.stagger, label: 'stagger ms', min: 40, max: 80, step: 5 },
        motion_dropdown: { value: first.current.motion.dropdown, label: 'dropdown ms', min: 260, max: 340, step: 10 },
        motion_float: { value: first.current.motion.float, label: 'device float' },
        motion_browserFloat: { value: first.current.motion.browserFloat, label: 'browser float px', min: 0, max: 6, step: .5 },
        motion_phoneFloat: { value: first.current.motion.phoneFloat, label: 'phone float px', min: 0, max: 9, step: .5 },
        motion_browserPeriod: { value: first.current.motion.browserPeriod, label: 'browser seconds', min: 6, max: 8, step: .1 },
        motion_phonePeriod: { value: first.current.motion.phonePeriod, label: 'phone seconds', min: 5, max: 7, step: .1 },
      }, { collapsed: true }),
      'Remember copy and motion': button(() => { try { localStorage.setItem(`${STORAGE}:remember`, JSON.stringify(current.current)) } catch { /* storage unavailable */ } }),
      'Revert to remembered': button(() => apply.current(flatSettings(loadWorkSettings(`${STORAGE}:remember`)))),
      'Restore source defaults': button(() => apply.current(flatSettings(DEFAULT_WORK_SETTINGS))),
    }, { collapsed: false }),
  }), { store }, [])
  apply.current = set as (values: Record<string, unknown>) => void

  const settings = useMemo(() => {
    const flat = values as Record<string, unknown>
    return {
      global: Object.fromEntries(Object.keys(first.current.global).map(key => [key,flat[`global_${key}`]])),
      projects: Object.fromEntries(WEB_MOCKS.map((project,i) => [project.slug,{
        ...Object.fromEntries(Object.keys(first.current.projects[project.slug]).filter(key => !key.endsWith('Website')).map(key => [key,flat[`p${i}_${key}`]])),
        ...Object.fromEntries(versions.map(version => [`${version}Website`, JSON.stringify(Object.fromEntries(websiteFields(project.slug, version).map(([key],n) => [key,flat[`p${i}_${version}_${n}`]])), null, 2)])),
      }])),
      motion: Object.fromEntries(Object.keys(first.current.motion).map(key => [key,flat[`motion_${key}`]])),
    } as WorkSettings
  }, [values])
  const json = JSON.stringify(settings)
  const saved = useRef(JSON.stringify(initial))
  useEffect(() => {
    current.current = settings
    if (saved.current === json) return
    saved.current = json
    onChange(settings)
    try { localStorage.setItem(STORAGE,json) } catch { /* storage unavailable */ }
  }, [json, settings, onChange])
  return <div className="mr-case-tuner" data-lenis-prevent>
    <button type="button" aria-expanded={expanded} aria-controls={panelId} onClick={() => setExpanded(value => !value)}>Selected Work · Copy / Motion {expanded ? '−' : '+'}</button>
    <div id={panelId}>{expanded && <LevaPanel store={store} titleBar={false} fill />}</div>
  </div>
}
