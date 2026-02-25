import { createContext, useContext, useState, useMemo, type ReactNode } from 'react'
import { addMonths, subMonths, startOfMonth } from 'date-fns'

interface CalendarContextValue {
  currentMonth: Date
  selectedDay: Date | null
  selectedLeagueId: number | null
  goToPreviousMonth: () => void
  goToNextMonth: () => void
  goToToday: () => void
  selectDay: (day: Date | null) => void
  selectLeague: (id: number | null) => void
}

const CalendarContext = createContext<CalendarContextValue | null>(null)

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [currentMonth, setCurrentMonth] = useState<Date>(() =>
    startOfMonth(new Date())
  )
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [selectedLeagueId, setSelectedLeagueId] = useState<number | null>(null)

  const value = useMemo<CalendarContextValue>(
    () => ({
      currentMonth,
      selectedDay,
      selectedLeagueId,
      goToPreviousMonth: () => {
        setCurrentMonth(prev => subMonths(prev, 1))
        setSelectedDay(null)
      },
      goToNextMonth: () => {
        setCurrentMonth(prev => addMonths(prev, 1))
        setSelectedDay(null)
      },
      goToToday: () => {
        setCurrentMonth(startOfMonth(new Date()))
        setSelectedDay(new Date())
      },
      selectDay: (day) => {
        setSelectedDay(prev =>
          prev && day && prev.toDateString() === day.toDateString() ? null : day
        )
      },
      selectLeague: (id) => setSelectedLeagueId(id),
    }),
    [currentMonth, selectedDay, selectedLeagueId]
  )

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  )
}

export function useCalendarContext(): CalendarContextValue {
  const ctx = useContext(CalendarContext)
  if (!ctx) {
    throw new Error('useCalendarContext deve ser usado dentro de CalendarProvider')
  }
  return ctx
}
