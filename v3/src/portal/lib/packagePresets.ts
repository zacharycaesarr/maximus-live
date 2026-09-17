export type PackageId = 'ads' | 'website' | 'video'

export type ServiceFocus = PackageId | 'mixed'

export type PackagePreset = {
  status_headline: string
  dashboard_blurb: string
  progress_pct: number
}

/** Tiny copy defaults when onboarding a package. Admin can edit later. */
export const PACKAGE_PRESETS: Record<PackageId, PackagePreset> = {
  ads: {
    status_headline: 'Ads live and optimizing',
    dashboard_blurb: 'I keep spend, leads, and cost per lead updating from your campaigns this cycle.',
    progress_pct: 70,
  },
  website: {
    status_headline: 'Website work this cycle',
    dashboard_blurb: 'I am building and polishing as we go. We walk through each stage together.',
    progress_pct: 25,
  },
  video: {
    status_headline: 'Ongoing video production',
    dashboard_blurb: 'I drop cuts and finals in History and Deliverables each cycle.',
    progress_pct: 30,
  },
}

export const PACKAGE_LABELS: Record<PackageId, string> = {
  ads: 'Ads',
  website: 'Website',
  video: 'Video',
}

export const ALL_PACKAGES: PackageId[] = ['ads', 'website', 'video']

export function isPackageId(v: string): v is PackageId {
  return v === 'ads' || v === 'website' || v === 'video'
}

/** Derive legacy service_focus from packages list. */
export function focusFromPackages(packages: PackageId[]): ServiceFocus {
  if (packages.length === 0) return 'mixed'
  if (packages.length === 1) return packages[0]
  return 'mixed'
}

/** When packages is empty, map a single old service_focus. Mixed/unknown → []. */
export function packagesFromFocus(focus: ServiceFocus | string | null | undefined): PackageId[] {
  if (focus === 'ads' || focus === 'website' || focus === 'video') return [focus]
  return []
}

/** Merge presets for multi-package onboard (first package wins headline weight). */
export function mergePresets(packages: PackageId[]): PackagePreset {
  if (packages.length === 0) {
    return {
      status_headline: 'Welcome to Maximus Reach',
      dashboard_blurb: 'I will lock in your packages for this cycle and fill this in.',
      progress_pct: 0,
    }
  }
  if (packages.length === 1) return { ...PACKAGE_PRESETS[packages[0]] }

  const headlines = packages.map((p) => PACKAGE_PRESETS[p].status_headline)
  const blurbs = packages.map((p) => PACKAGE_LABELS[p].toLowerCase())
  const avg =
    packages.reduce((sum, p) => sum + PACKAGE_PRESETS[p].progress_pct, 0) / packages.length

  return {
    status_headline: headlines[0],
    dashboard_blurb: `I have you on ${blurbs.join(', ')} this cycle.`,
    progress_pct: Math.round(avg),
  }
}

/** Ordered list for Overview sections. */
export function resolvePackageOrder(
  packages: PackageId[],
  packageOrder: string[] | null | undefined,
): PackageId[] {
  if (packages.length === 0) return []
  const order = (packageOrder ?? []).filter(isPackageId)
  if (order.length === 0) return packages

  const seen = new Set<PackageId>()
  const out: PackageId[] = []
  for (const id of order) {
    if (packages.includes(id) && !seen.has(id)) {
      out.push(id)
      seen.add(id)
    }
  }
  for (const id of packages) {
    if (!seen.has(id)) out.push(id)
  }
  return out
}

export function formatCycleDate(iso: string | null | undefined): string | null {
  if (!iso) return null
  try {
    const d = new Date(iso.includes('T') ? iso : `${iso}T12:00:00`)
    if (Number.isNaN(d.getTime())) return null
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return null
  }
}
