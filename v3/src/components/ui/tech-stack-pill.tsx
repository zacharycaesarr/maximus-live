import { useState } from 'react'
import { techLogoUrl } from '@/lib/techLogos'
import { AfterEffectsMark } from '@/components/ui/after-effects-mark'

export function TechStackPill({ name }: { name: string }) {
  const logo = techLogoUrl(name)
  const [broken, setBroken] = useState(false)
  const isAe = name === 'After Effects'
  const showFallback = isAe && (broken || !logo)
  const showImg = Boolean(logo) && !broken && !showFallback

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#efeae2]/90 px-2.5 py-1 font-nhg text-[11px] text-espresso">
      {showFallback ? (
        <AfterEffectsMark className="h-3.5 w-3.5 shrink-0 rounded-[3px]" />
      ) : showImg ? (
        <img
          src={logo!}
          alt=""
          className="h-3.5 w-3.5 shrink-0 rounded-[3px] object-contain"
          loading="lazy"
          draggable={false}
          onError={() => setBroken(true)}
        />
      ) : null}
      {name}
    </span>
  )
}
