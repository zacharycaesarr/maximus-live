import type { LucideIcon } from 'lucide-react'

type Props = {
  title: string
  blurb: string
  icon: LucideIcon
  accent: string
  children: React.ReactNode
}

/** Shared admin block: colored title, icon, clear divider from the section above. */
export default function AdminSection({ title, blurb, icon: Icon, accent, children }: Props) {
  return (
    <section className="mt-8 border-t border-white/[0.1] pt-6">
      <div className="mb-4 flex items-start gap-3">
        <span
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border"
          style={{
            borderColor: `${accent}55`,
            background: `${accent}18`,
            color: accent,
          }}
        >
          <Icon size={18} strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <h3
            className="m-0 font-mono text-[11px] uppercase tracking-[0.16em]"
            style={{ color: accent }}
          >
            {title}
          </h3>
          <p className="mt-1 font-nhg text-sm text-white/70">{blurb}</p>
        </div>
      </div>
      {children}
    </section>
  )
}
