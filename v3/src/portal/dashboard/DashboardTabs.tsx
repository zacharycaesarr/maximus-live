import { motion } from 'framer-motion'
import {
  CreditCard,
  FolderDown,
  Headphones,
  History,
  LayoutDashboard,
  type LucideIcon,
} from 'lucide-react'

export type PortalTabId = 'overview' | 'deliverables' | 'history' | 'support' | 'billing'

/** Underline colors (morph while the bar slides). No purple. */
export const TAB_COLORS: Record<PortalTabId, string> = {
  overview: '#f97316',
  deliverables: '#38bdf8',
  history: '#fbbf24',
  support: '#fb7185',
  billing: '#34d399',
}

const TABS: { id: PortalTabId; label: string; Icon: LucideIcon }[] = [
  { id: 'overview', label: 'Overview', Icon: LayoutDashboard },
  { id: 'deliverables', label: 'Deliverables', Icon: FolderDown },
  { id: 'history', label: 'History', Icon: History },
  { id: 'support', label: 'Support', Icon: Headphones },
  { id: 'billing', label: 'Billing', Icon: CreditCard },
]

type Props = {
  active: PortalTabId
  onChange: (id: PortalTabId) => void
}

export default function DashboardTabs({ active, onChange }: Props) {
  return (
    <div className="relative flex flex-wrap gap-1 border-b border-white/[0.08]">
      {TABS.map((tab) => {
        const isOn = tab.id === active
        const { Icon } = tab
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={[
              'relative inline-flex items-center gap-1.5 rounded-t-md px-3 py-2.5 font-mono text-[11px] tracking-wide transition-colors',
              isOn ? 'text-white' : 'text-white/35 hover:text-white/70',
            ].join(' ')}
          >
            <Icon
              size={14}
              strokeWidth={1.75}
              className="shrink-0 opacity-90"
              style={isOn ? { color: TAB_COLORS[tab.id] } : undefined}
            />
            {tab.label}
            {isOn ? (
              <motion.span
                layoutId="portal-tab-underline"
                className="absolute inset-x-2 -bottom-px h-[2px] rounded-full"
                initial={false}
                animate={{ backgroundColor: TAB_COLORS[tab.id] }}
                transition={{
                  layout: { type: 'spring', stiffness: 380, damping: 32 },
                  backgroundColor: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
                }}
              />
            ) : null}
          </button>
        )
      })}
    </div>
  )
}

export { TABS }
