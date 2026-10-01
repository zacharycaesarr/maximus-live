import { WEB_MOCKS } from '@/work-mockups/mockMeta'
import { BUILD_CASE_COPY } from '@/work-mockups/build-case-copy'
import type { BuildCaseId } from '@/work-mockups/build-case-stages'

export type WorkProjectCopy = {
  navigation: string; title: string; description: string; services: string
  stat: string; statDescription: string; industry: string; focus: string
  browser: string; phone: string; beforeWebsite: string; afterWebsite: string
}
export type WorkSettings = {
  global: {
    brandTop: string; brandBottom: string; eyebrow: string; heading: string
    featured: string; industry: string; focus: string; before: string; after: string
    homepage: string; mobile: string; escape: string; clock: string
    close: string; selector: string; projectInfo: string; services: string
    websiteVersion: string; websiteViews: string; preview: string; showView: string
  }
  projects: Record<string, WorkProjectCopy>
  motion: { entrance: number; switching: number; stagger: number; dropdown: number; browserFloat: number; phoneFloat: number; browserPeriod: number; phonePeriod: number; float: boolean }
}
export const STORAGE = 'mr-v3-selected-work-v1'
const details: Record<string, {services: string; focus: string}> = {
  'summit-hvac': { services: 'Web Development, UI/UX, SEO', focus: 'Mobile dispatch, click-to-call, and local service search.' },
  'northline-dental': { services: 'Web Development, UI/UX, CRO', focus: 'Consultation booking, smile gallery, and insurance trust badges.' },
  'ridge-plumbing': { services: 'Web Development, UI/UX, CRO', focus: 'Project lookbooks, pricing guides, and design-intake booking.' },
}
export const DEFAULT_WORK_SETTINGS: WorkSettings = {
  global: {
    brandTop: 'Maximus', brandBottom: 'Reach', eyebrow: 'Web Development', heading: 'Selected Work',
    featured: 'Featured project', industry: 'Industry', focus: 'Focus', before: 'Before', after: 'After',
    homepage: 'Homepage', mobile: 'Mobile', escape: 'ESC', clock: '9:41', close: 'Close selected work',
    selector: 'Select a project', projectInfo: 'Project information', services: 'Project services',
    websiteVersion: 'Website version', websiteViews: 'Website views', preview: 'website previews', showView: 'Show view',
  },
  projects: Object.fromEntries(WEB_MOCKS.map(project => {
    const metric = project.metric.match(/^([+\d.]+(?:%|x))\s+(.*)$/)
    return [project.slug, {
      navigation: project.title, title: project.title, description: project.blurb,
      services: details[project.slug].services, stat: metric?.[1] ?? project.metric,
      statDescription: metric?.[2] ?? '', industry: project.subtext, focus: details[project.slug].focus,
      browser: project.title, phone: project.title,
      beforeWebsite: JSON.stringify(BUILD_CASE_COPY[project.slug as BuildCaseId].before, null, 2),
      afterWebsite: JSON.stringify(BUILD_CASE_COPY[project.slug as BuildCaseId].after, null, 2),
    }]
  })),
  motion: { entrance: 380, switching: 320, stagger: 55, dropdown: 300, browserFloat: 4, phoneFloat: 8, browserPeriod: 7.2, phonePeriod: 6.1, float: true },
}

function normalizeSettings(input: Partial<WorkSettings>): WorkSettings {
  const defaults = DEFAULT_WORK_SETTINGS
  return {
    global: { ...defaults.global, ...input.global },
    projects: Object.fromEntries(Object.entries(defaults.projects).map(([id,copy]) => [id,{ ...copy, ...input.projects?.[id] }])),
    motion: { ...defaults.motion, ...input.motion },
  }
}
export function loadWorkSettings(key = STORAGE): WorkSettings {
  try { return normalizeSettings(JSON.parse(localStorage.getItem(key) || '{}')) }
  catch { return DEFAULT_WORK_SETTINGS }
}

/** Invalid intermediate JSON while typing keeps the approved source copy usable. */
export function readWebsiteCopy(value: string): Record<string, string> {
  try {
    const data: unknown = JSON.parse(value)
    if (!data || typeof data !== 'object' || Array.isArray(data)) return {}
    return Object.fromEntries(Object.entries(data).filter((entry): entry is [string, string] => typeof entry[1] === 'string'))
  } catch { return {} }
}

