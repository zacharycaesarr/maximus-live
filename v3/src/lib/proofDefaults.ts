export const PROOF_STORAGE_KEY = 'mr-v3-proof-fan-v8'

import { brickworkResults } from '@/lib/brickworkProof'

export type ProofCategory = 'web' | 'ads' | 'creative'
export type ProofVisualType = 'autoscroll' | 'brickwork-dashboard' | 'lottie' | 'build-case' | 'video-comparison'
export type ProofBuildCaseId = 'summit-hvac' | 'northline-dental' | 'ridge-plumbing'

export type ProofProject = {
  id: string
  title: string
  category: ProofCategory
  categoryIcon: string
  tag: string
  bullets: string[]
  metricHighlight: string
  techStack: string[]
  visualType: ProofVisualType
  /** Fan thumbnail on the homepage */
  image: string
  /** Optional larger image inside the modal (falls back to image) */
  detailImage?: string
  mediaUrl?: string
  logoUrl?: string
  /** Web Dev Selected Builds case (after homepage) */
  buildCaseId?: ProofBuildCaseId
}

export const defaultProofProjects: ProofProject[] = [
  {
    id: '1',
    title: 'Augusta Dental Arts',
    category: 'web',
    categoryIcon: 'Web Architecture',
    tag: 'Cosmetic & restorative',
    bullets: ['Website redesign', 'Lead gen funnel', 'Ongoing ads'],
    metricHighlight: '+140% Qualified Leads',
    techStack: ['Next.js', 'Meta Ads', 'Twilio'],
    visualType: 'build-case',
    buildCaseId: 'northline-dental',
    image: '/proof/augusta-dental-thumb.jpg',
    detailImage: '/proof/augusta-dental-thumb.jpg',
    logoUrl: '/proof/augusta-dental-logo.png',
  },
  {
    id: '2',
    title: 'Brickwork',
    category: 'ads',
    categoryIcon: 'Ad Management',
    tag: 'Home services',
    bullets: [
      `Cut cost per lead from ${brickworkResults.cpl.before} to ${brickworkResults.cpl.after}`,
      `Generated ${brickworkResults.leads.after} qualified leads in 30 days`,
      'Scaled monthly ad budget from $2.5K to $7K after proving performance',
    ],
    metricHighlight: `${brickworkResults.roas.after} ROAS`,
    techStack: ['Meta Ads Manager', 'Google Ads', 'Klaviyo'],
    visualType: 'brickwork-dashboard',
    image: '',
    logoUrl: '/proof/brickwork-logo.png',
  },
  {
    id: '3',
    title: 'Dog Guard of the Valley',
    category: 'creative',
    categoryIcon: 'Video Motion',
    tag: 'SHORT-FORM SOCIAL CREATIVE',
    bullets: ['Hook-first edit', 'Motion graphics', 'Branded social creative'],
    metricHighlight: 'Short-Form Video Creative',
    techStack: ['After Effects', 'Premiere Pro'],
    visualType: 'video-comparison',
    image: '/proof/dogguard-cover.webp',
    logoUrl: '/proof/dogguard-logo.png',
  },
  {
    id: '4',
    title: 'West & Clay',
    category: 'web',
    categoryIcon: 'Web Architecture',
    tag: 'Custom carpentry',
    bullets: ['Full site build', 'Ad creative', 'Retention flows'],
    metricHighlight: '+90% Form Completes',
    techStack: ['Vite', 'Framer Motion', 'Resend'],
    visualType: 'build-case',
    buildCaseId: 'ridge-plumbing',
    image: '/proof/shenandoah-craft-thumb.jpg',
    detailImage: '/proof/shenandoah-craft-thumb.jpg',
    logoUrl: '/proof/shenandoah-craft-logo.png',
  },
]

export const defaultProofTuner = {
  enabled: true,
  flipPhraseA: 'See it in action?',
  flipPhraseB: 'Proof comes next.',
  flipColor: 'var(--home-text-dark)',
  autoplayMs: 2800,
  backBlurPx: 8,
  backOpacity: 0.55,
  centerScale: 1.15,
  thumbScale: 1.2,
  expandEnabled: true,
  detailTitleSize: 28,
  detailAnimMs: 420,
  editClientIndex: 1,
  previewExpanded: false,
  projectsJson: JSON.stringify(defaultProofProjects),
}

export type ProofTuner = typeof defaultProofTuner

export function loadProofTuner(): ProofTuner {
  try {
    const raw = localStorage.getItem(PROOF_STORAGE_KEY)
    if (!raw) return { ...defaultProofTuner }
    const parsed = JSON.parse(raw) as Partial<ProofTuner>
    return {
      ...defaultProofTuner,
      ...parsed,
      // Always ship the live project map (Augusta / Brickwork / Craft)
      projectsJson: defaultProofTuner.projectsJson,
      previewExpanded: false,
    }
  } catch {
    return { ...defaultProofTuner }
  }
}

export function parseProofProjects(raw: string): ProofProject[] {
  try {
    const data = JSON.parse(raw || defaultProofTuner.projectsJson) as ProofProject[]
    if (!Array.isArray(data) || !data.length) return defaultProofProjects
    return data.map((p, i) => ({
      ...defaultProofProjects[i % defaultProofProjects.length],
      ...p,
    }))
  } catch {
    return defaultProofProjects
  }
}

export function updateProjectField(
  projectsJson: string,
  index: number,
  patch: Partial<ProofProject>,
): string {
  const projects = parseProofProjects(projectsJson)
  const i = Math.max(0, Math.min(projects.length - 1, index))
  projects[i] = { ...projects[i], ...patch }
  return JSON.stringify(projects)
}
