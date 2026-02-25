import type { LeagueCategory } from '@/types/competition'
import { CATEGORY_COLORS } from '@/lib/utils/leagues'

interface BadgeProps {
  label: string
  category?: LeagueCategory
  className?: string
}

export function Badge({ label, category = 'internacional', className = '' }: BadgeProps) {
  const colors = CATEGORY_COLORS[category]
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider leading-none ${colors.bg} ${colors.text} ${className}`}
    >
      {label}
    </span>
  )
}
