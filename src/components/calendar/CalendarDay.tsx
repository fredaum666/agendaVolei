import { getDate } from 'date-fns'
import { getTournamentBadgeColors } from '@/lib/utils/leagues'

interface CalendarDayProps {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  matchCount: number
  tournamentIds: number[]
  onClick: () => void
}

export function CalendarDay({
  date,
  isCurrentMonth,
  isToday,
  isSelected,
  matchCount,
  tournamentIds,
  onClick,
}: CalendarDayProps) {
  const dayNumber = getDate(date)

  let cellClass = 'relative flex flex-col items-center justify-start pt-1.5 pb-2 min-h-[52px] rounded-lg cursor-pointer transition-all duration-150 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4A9CC7] focus-visible:ring-offset-1 touch-manipulation'

  if (isSelected) {
    cellClass += ' bg-[#1A3A5C] shadow-md'
  } else if (isToday) {
    cellClass += ' bg-white ring-2 ring-[#FFD700] shadow-sm hover:bg-[#EBF4FA]'
  } else if (isCurrentMonth) {
    cellClass += ' bg-white/60 hover:bg-white hover:shadow-sm'
  } else {
    cellClass += ' bg-white/20 opacity-50 hover:opacity-70'
  }

  const numberClass = isSelected
    ? 'text-sm font-bold text-white'
    : isToday
    ? 'text-sm font-bold text-[#1A3A5C]'
    : isCurrentMonth
    ? 'text-sm font-medium text-[#1A3A5C]'
    : 'text-sm font-normal text-[#1A3A5C]/50'

  return (
    <button
      onClick={onClick}
      className={cellClass}
      aria-label={`${dayNumber}${matchCount > 0 ? `, ${matchCount} jogo${matchCount > 1 ? 's' : ''}` : ''}`}
      aria-pressed={isSelected}
      tabIndex={isCurrentMonth ? 0 : -1}
    >
      <span className={numberClass}>{dayNumber}</span>

      {tournamentIds.length > 0 && (
        <div className="flex flex-col items-center gap-[2px] mt-1 w-full px-1">
          {tournamentIds.map(tid => {
            const colors = getTournamentBadgeColors(tid)
            if (!colors) return null
            return (
              <TournamentBadge
                key={tid}
                tournamentColor={colors.tournamentColor}
                genderColor={colors.genderColor}
                faded={isSelected}
              />
            )
          })}
        </div>
      )}
    </button>
  )
}

interface TournamentBadgeProps {
  tournamentColor: string
  genderColor: string
  faded: boolean
}

function TournamentBadge({ tournamentColor, genderColor, faded }: TournamentBadgeProps) {
  return (
    <span
      className="flex w-full rounded-full overflow-hidden"
      style={{ height: '4px', opacity: faded ? 0.7 : 1 }}
      aria-hidden
    >
      <span className="flex-1" style={{ background: tournamentColor }} />
      <span className="flex-1" style={{ background: genderColor }} />
    </span>
  )
}
