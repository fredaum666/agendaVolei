import { useMemo } from 'react'
import { generateCalendarDays, formatDateKey, isSameMonth, isSameDay, isToday } from '@/lib/utils/date'

interface UseCalendarOptions {
  currentMonth: Date
  selectedDay: Date | null
  matchCountsByDay: Record<string, number>
}

interface CalendarDay {
  date: Date
  dateKey: string
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  matchCount: number
}

export function useCalendar({ currentMonth, selectedDay, matchCountsByDay }: UseCalendarOptions) {
  const calendarDays = useMemo<CalendarDay[]>(() => {
    const days = generateCalendarDays(currentMonth)
    return days.map(date => {
      const dateKey = formatDateKey(date)
      return {
        date,
        dateKey,
        isCurrentMonth: isSameMonth(date, currentMonth),
        isToday: isToday(date),
        isSelected: selectedDay ? isSameDay(date, selectedDay) : false,
        matchCount: matchCountsByDay[dateKey] ?? 0,
      }
    })
  }, [currentMonth, selectedDay, matchCountsByDay])

  return { calendarDays }
}
