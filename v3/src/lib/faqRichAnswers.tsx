import type { ReactNode } from 'react'
import { LinkPreview } from '@/components/ui/link-preview'
import { AdsLineHoverMock, WebsiteHoverMock } from '@/components/ui/faq-hover-previews'

const PLACEHOLDER =
  'https://cdn.21st.dev/assets/mirror/bf/bfc82fd647c38dffaf3692024acb366ee99ca95b1338490cfec2c2340d3674a1.jpg'

/** Rich FAQ answers with ~4 link-preview words across multiple questions. */
export function faqRichAnswer(id: string, plain: string): ReactNode {
  switch (id) {
    case 'what-is-maximus':
      return (
        <>
          I build{' '}
          <LinkPreview preview={<WebsiteHoverMock />}>websites</LinkPreview>, run{' '}
          <LinkPreview preview={<AdsLineHoverMock />}>ads</LinkPreview>, and set up automation so your
          business looks sharper and converts better. One partner who can ship the full digital growth
          stack.
        </>
      )
    case 'how-fast':
      return (
        <>
          Most projects kick off within a week of the audit call. Sprint timelines depend on scope, but
          you will always know the <LinkPreview imageSrc={PLACEHOLDER}>blueprint</LinkPreview> before we
          build.
        </>
      )
    case 'who-for':
      return (
        <>
          Owners and operators who want results without agency bloat. If you need a site that converts,{' '}
          <LinkPreview preview={<AdsLineHoverMock />}>ads</LinkPreview> that do not bleed budget, and
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
