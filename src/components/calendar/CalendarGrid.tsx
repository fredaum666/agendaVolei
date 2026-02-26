import { CalendarDay } from './CalendarDay'
import { WeekdayLabels } from './WeekdayLabels'
import { useCalendar } from '@/hooks/useCalendar'

interface CalendarGridProps {
  currentMonth: Date
  selectedDay: Date | null
  matchCountsByDay: Record<string, number>
  tournamentsByDay: Record<string, number[]>
  onDaySelect: (day: Date) => void
}

export function CalendarGrid({
  currentMonth,
  selectedDay,
  matchCountsByDay,
  tournamentsByDay,
  onDaySelect,
}: CalendarGridProps) {
  const { calendarDays } = useCalendar({ currentMonth, selectedDay, matchCountsByDay })

  return (
    <div role="grid" aria-label="Calendário de jogos">
      <WeekdayLabels />
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
        {calendarDays.map(day => (
          <CalendarDay
            key={day.dateKey}
            date={day.date}
            isCurrentMonth={day.isCurrentMonth}
            isToday={day.isToday}
            isSelected={day.isSelected}
            matchCount={day.matchCount}
            tournamentIds={tournamentsByDay[day.dateKey] ?? []}
            onClick={() => onDaySelect(day.date)}
          />
        ))}
      </div>
    </div>
  )
}
