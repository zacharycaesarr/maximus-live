import { useSiteChrome } from '../../context/SiteChromeContext'
import './brand-mark.css'

export default function BrandMark({ className = '', size }) {
  const { settings } = useSiteChrome()
  const px = size ?? settings.logoSize

  return (
    <img
      className={`brand-mark ${className}`.trim()}
      src={settings.logoSrc}
      alt="Maximus Reach"
      width={px}
      height={px}
      style={{
        width: px,
        height: px,
        filter: settings.logoInvert ? 'brightness(0) invert(1)' : undefined,
      }}
    />
  )
}
