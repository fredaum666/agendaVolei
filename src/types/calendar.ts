export interface CalendarState {
  currentMonth: Date
  selectedDay: Date | null
  selectedLeagueId: number | null
}

export interface DayMatchSummary {
  dateKey: string // "YYYY-MM-DD"
  count: number
}
