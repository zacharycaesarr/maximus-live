export const PROOF_STORAGE_KEY = 'mr-v3-proof-fan-v3'

export type ProofCategory = 'web' | 'ads' | 'creative'
export type ProofVisualType = 'autoscroll' | 'ads-cockpit' | 'lottie'

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
  image: string
  mediaUrl?: string
}

export const defaultProofProjects: ProofProject[] = [
  {
    id: '1',
    title: 'Client One',
    category: 'web',
    categoryIcon: 'Web Architecture',
    tag: 'Local services',
    bullets: ['Website redesign', 'Lead gen funnel', 'Ongoing ads'],
    metricHighlight: '+140% Qualified Leads',
    techStack: ['Next.js', 'Meta Ads', 'Twilio'],
    visualType: 'autoscroll',
    image:
      'https://cdn.21st.dev/assets/mirror/bf/bfc82fd647c38dffaf3692024acb366ee99ca95b1338490cfec2c2340d3674a1.jpg',
  },
  {
    id: '2',
    title: 'Client Two',
    category: 'ads',
    categoryIcon: 'Paid Acquisition',
    tag: 'Home services',
    bullets: ['Brand refresh', 'Landing pages', 'Email automation'],
    metricHighlight: '4.2x ROAS',
    techStack: ['Meta Ads Manager', 'Google Ads', 'Klaviyo'],
    visualType: 'ads-cockpit',
    image:
      'https://cdn.21st.dev/assets/mirror/d6/d64315e93e25068a473e2afaf4651506238618b8589384249fc1ebfce90308cb.jpg',
  },
  {
    id: '3',
    title: 'Client Three',
    category: 'creative',
    categoryIcon: 'Video Motion',
    tag: 'Creator brand',
    bullets: ['CRM setup', 'Creative system', 'SEO foundation'],
    metricHighlight: '2.8x Watch Time',
    techStack: ['After Effects', 'Lottie', 'Notion'],
    visualType: 'lottie',
    image:
      'https://cdn.21st.dev/assets/mirror/72/72043d7a404d9d51139f262eea3c282cba95f83c19e8d89c62fc7def551b7f28.jpg',
    mediaUrl: '/lottie/hand-sketch-reach.json',
  },
  {
    id: '4',
    title: 'Client Four',
    category: 'web',
    categoryIcon: 'Web Architecture',
    tag: 'Professional firm',
    bullets: ['Full site build', 'Ad creative', 'Retention flows'],
    metricHighlight: '+90% Form Completes',
    techStack: ['Vite', 'Framer Motion', 'Resend'],
    visualType: 'autoscroll',
    image:
      'https://cdn.21st.dev/assets/mirror/44/441003ea453f17deb37d9a2353c175aee9e7f0d324b22cc6e5913cbe991266ba.jpg',
  },
]

export const defaultProofTuner = {
  enabled: true,
  flipPhraseA: 'See it in action?',
  flipPhraseB: 'Proof comes next.',
  flipColor: '#FCFAF2',
  autoplayMs: 2800,
  backBlurPx: 8,
  backOpacity: 0.55,
  centerScale: 1.15,
  thumbScale: 1.2,
  expandEnabled: true,
  detailTitleSize: 28,
  detailAnimMs: 420,
  /** Which client Leva is editing (1-based index into projects) */
  editClientIndex: 1,
  /** Force open that client showcase while tuning */
  previewExpanded: false,
  projectsJson: JSON.stringify(defaultProofProjects),
}

export type ProofTuner = typeof defaultProofTuner

export function loadProofTuner(): ProofTuner {
  try {
    const raw = localStorage.getItem(PROOF_STORAGE_KEY)
    if (!raw) {
      // migrate from v1 if present
      const legacy = localStorage.getItem('mr-v3-proof-fan-v1')
      if (legacy) {
        const old = JSON.parse(legacy) as Partial<ProofTuner>
        return { ...defaultProofTuner, ...old, projectsJson: migrateProjectsJson(old.projectsJson) }
      }
      return { ...defaultProofTuner }
    }
    const parsed = JSON.parse(raw) as Partial<ProofTuner>
    return {
      ...defaultProofTuner,
      ...parsed,
      projectsJson: migrateProjectsJson(parsed.projectsJson),
      previewExpanded: false,
    }
  } catch {
    return { ...defaultProofTuner }
  }
}

function migrateProjectsJson(raw?: string): string {
  if (!raw) return defaultProofTuner.projectsJson
  try {
    const data = JSON.parse(raw) as Partial<ProofProject>[]
    if (!Array.isArray(data) || !data.length) return defaultProofTuner.projectsJson
    const merged = data.map((p, i) => {
      const fallback = defaultProofProjects[i % defaultProofProjects.length]
      return {
        ...fallback,
        ...p,
        id: String(p.id ?? fallback.id),
        bullets: Array.isArray(p.bullets) ? p.bullets : fallback.bullets,
        techStack: Array.isArray(p.techStack) ? p.techStack : fallback.techStack,
        category: (p.category as ProofCategory) || fallback.category,
        visualType: (p.visualType as ProofVisualType) || fallback.visualType,
        categoryIcon: p.categoryIcon || fallback.categoryIcon,
        tag: p.tag || fallback.tag,
        metricHighlight: p.metricHighlight || fallback.metricHighlight,
        image: p.image || fallback.image,
      } satisfies ProofProject
    })
    return JSON.stringify(merged)
  } catch {
    return defaultProofTuner.projectsJson
  }
}

export function parseProofProjects(raw: string): ProofProject[] {
  try {
    const data = JSON.parse(migrateProjectsJson(raw)) as ProofProject[]
    if (!Array.isArray(data) || !data.length) return defaultProofProjects
    return data
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
