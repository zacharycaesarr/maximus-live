/** Soft divider so each scroll block reads as its own section. */
export default function SectionBreak() {
  return (
    <div className="relative py-2 md:py-3" aria-hidden>
      <div className="mx-auto h-px w-full max-w-6xl bg-gradient-to-r from-transparent via-espresso/15 to-transparent" />
    </div>
  )
}
