export const FAQ_STORAGE_KEY = 'mr-v3-faq-tuner-v1'

export type FaqEntry = {
  id: string
  question: string
  answer: string
}

export const defaultFaqItems: FaqEntry[] = [
  {
    id: 'what-is-maximus',
    question: 'What does Maximus Reach actually do?',
    answer:
      'I build websites, run ads, and set up automation so your business looks sharper and converts better. One partner who can ship the full digital growth stack.',
  },
  {
    id: 'how-fast',
    question: 'How fast can we get started?',
    answer:
      'Most projects kick off within a week of the audit call. Sprint timelines depend on scope, but you will always know the plan before we build.',
  },
  {
    id: 'who-for',
    question: 'Who is this for?',
    answer:
      'Owners and operators who want results without agency bloat. If you need a website that converts, ads that do not bleed budget, and systems that follow up for you, we are a fit.',
  },
  {
    id: 'pricing',
    question: 'How does pricing work?',
    answer:
      'Scoped projects and ongoing growth retainers. We map the blueprint first so pricing matches the work, not a vague monthly mystery fee.',
  },
]

export const defaultFaqTuner = {
  enabled: true,
  searchPlaceholder: 'Search FAQs...',
  defaultOpenFirst: true,
  /** Pipe rows: id||question||answer  — separate items with ||| */
  itemsRaw: defaultFaqItems.map((i) => `${i.id}||${i.question}||${i.answer}`).join('|||'),
}

export type FaqTuner = typeof defaultFaqTuner

export function parseFaqItems(raw: string): FaqEntry[] {
  try {
    const chunks = raw
      .split('|||')
      .map((c) => c.trim())
      .filter(Boolean)
    const items = chunks
      .map((chunk, idx) => {
        const [id, question, ...rest] = chunk.split('||').map((s) => s.trim())
        const answer = rest.join('||').trim()
        if (!question || !answer) return null
        return {
          id: id || `faq-${idx + 1}`,
          question,
          answer,
        }
      })
      .filter(Boolean) as FaqEntry[]
    return items.length ? items : [...defaultFaqItems]
  } catch {
    return [...defaultFaqItems]
  }
}

export function loadFaqTuner(): FaqTuner {
  try {
    const raw = localStorage.getItem(FAQ_STORAGE_KEY)
    if (!raw) return { ...defaultFaqTuner }
    return { ...defaultFaqTuner, ...JSON.parse(raw) }
  } catch {
    return { ...defaultFaqTuner }
  }
}
