import { getDate } from 'date-fns'

interface CalendarDayProps {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  matchCount: number
  onClick: () => void
}

export function CalendarDay({
  date,
  isCurrentMonth,
  isToday,
  isSelected,
  matchCount,
  onClick,
}: CalendarDayProps) {
  const dayNumber = getDate(date)

  let cellClass = 'relative flex flex-col items-center justify-start pt-1.5 pb-2 min-h-[44px] rounded-lg cursor-pointer transition-all duration-150 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4A9CC7] focus-visible:ring-offset-1 touch-manipulation'

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

      {matchCount > 0 && (
        <div className="flex items-center gap-0.5 mt-1">
          {matchCount <= 4 ? (
            Array.from({ length: Math.min(matchCount, 4) }).map((_, i) => (
              <span
                key={i}
                className={`block w-1 h-1 rounded-full ${
                  isSelected ? 'bg-[#FFD700]' : 'bg-[#F4843D]'
                }`}
                aria-hidden
              />
            ))
          ) : (
            <span
              className={`text-[9px] font-bold leading-none px-1 rounded ${
                isSelected ? 'text-[#FFD700]' : 'text-[#F4843D]'
              }`}
            >
              {matchCount}
            </span>
          )}
        </div>
      )}
    </button>
  )
}
