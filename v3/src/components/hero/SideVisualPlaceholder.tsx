import { useHeroLayoutTuner } from '@/context/HeroLayoutTunerContext'

/**
 * Strict portrait placeholder — height-driven, never width-fills a wide column.
 * Aspect 9:16 for upcoming Lottie (720×1280).
 */
export default function SideVisualPlaceholder() {
  const layout = useHeroLayoutTuner()

  if (layout.sideImageUrl) {
    return (
      <div className="flex h-full w-full items-start justify-center">
        <img
          src={layout.sideImageUrl}
          alt="Hero visual"
          className="max-h-[min(72vh,calc(100vh-5rem))] w-auto max-w-full object-cover"
          style={{
            borderRadius: layout.sideRadius,
            aspectRatio: '9 / 16',
          }}
        />
      </div>
    )
  }

  return (
    <div className="flex h-full w-full items-start justify-center">
      <div
        className="max-h-[min(72vh,calc(100vh-5rem))] w-auto max-w-full"
        style={{
          background: layout.sideBg,
          borderRadius: layout.sideRadius,
          aspectRatio: '9 / 16',
          height: 'min(72vh, calc(100vh - 5rem))',
          width: 'auto',
        }}
        aria-label="Hero art placeholder rectangle"
      />
    </div>
  )
}
