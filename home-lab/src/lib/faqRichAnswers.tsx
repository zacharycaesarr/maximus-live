import type { ReactNode } from 'react'
/** Static emphasis in FAQ answers, without interactive previews. */
export function faqRichAnswer(id: string, plain: string): ReactNode {
  switch (id) {
    case 'what-is-maximus':
      return (
        <>
          I build{' '}
          <strong className="font-medium text-home-on-light">websites</strong>, run{' '}
          <strong className="font-medium text-home-on-light">ads</strong>, and set up automation so your
          business looks sharper and converts better. One partner who can ship the full digital growth
          stack.
        </>
      )
    case 'how-fast':
      return (
        <>
          Most projects kick off within a week of the audit call. Sprint timelines depend on scope, but
          you will always know the <strong className="font-medium text-home-on-light">blueprint</strong> before we
          build.
        </>
      )
    case 'who-for':
      return (
        <>
          Owners and operators who want results without agency bloat. If you need a site that converts,{' '}
          <strong className="font-medium text-home-on-light">ads</strong> that do not bleed budget, and
          systems that follow up for you, we are a fit.
        </>
      )
    case 'pricing':
      return (
        <>
          Scoped projects and ongoing growth retainers. We map the blueprint first so pricing matches
          the work, not a vague monthly mystery fee. Later you can swap these previews for Lottie on
          hover.
        </>
      )
    default:
      return plain
  }
}
