import { Clapperboard, Globe, TrendingUp, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ProofCategory } from '@/lib/proofDefaults'

const BY_CATEGORY: Record<ProofCategory, LucideIcon> = {
  web: Globe,
  ads: TrendingUp,
  creative: Clapperboard,
}

export function ProofCategoryIcon({
  category,
  className,
}: {
  category: ProofCategory
  className?: string
}) {
  const Icon = BY_CATEGORY[category] ?? Globe
  return <Icon className={cn('h-3 w-3', className)} aria-hidden strokeWidth={2} />
}
