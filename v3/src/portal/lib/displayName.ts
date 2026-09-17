/** First name → company → email local-part (never blank “there”). */
export function portalDisplayName(opts: {
  fullName?: string | null
  companyName?: string | null
  email?: string | null
}) {
  const first = opts.fullName?.trim().split(/\s+/).filter(Boolean)[0]
  if (first) return first
  const company = opts.companyName?.trim()
  if (company) return company
  const email = opts.email?.trim()
  if (email) {
    const local = email.split('@')[0]
    return local || email
  }
  return 'client'
}
