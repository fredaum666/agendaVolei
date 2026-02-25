import { formatMonthYear } from '@/lib/utils/date'

interface CalendarHeaderProps {
  currentDate: Date
  onPreviousMonth: () => void
  onNextMonth: () => void
  onGoToToday: () => void
  isLoading: boolean
}

export function CalendarHeader({
  currentDate,
  onPreviousMonth,
  onNextMonth,
  onGoToToday,
  isLoading,
}: CalendarHeaderProps) {
  const monthYear = formatMonthYear(currentDate)

  return (
    <div className="flex items-center justify-between px-1 py-3">
      <button
        onClick={onPreviousMonth}
        aria-label="Mês anterior"
        className="flex items-center justify-center w-9 h-9 rounded-lg text-[#1A3A5C] hover:bg-[#1A3A5C]/10 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4A9CC7]"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <div className="flex flex-col items-center gap-1">
        <h2
          className="text-lg font-bold text-[#1A3A5C] tracking-tight"
          aria-live="polite"
          aria-atomic="true"
        >
          {monthYear}
          {isLoading && (
            <span className="ml-2 inline-block w-3 h-3 rounded-full border-2 border-[#4A9CC7] border-t-transparent animate-spin align-middle" aria-hidden />
          )}
        </h2>
        <button
          onClick={onGoToToday}
          className="text-xs text-[#2C5F8A] font-medium hover:underline focus:outline-none focus-visible:underline"
          aria-label="Ir para o mês atual"
        >
          Hoje
        </button>
      </div>

      <button
        onClick={onNextMonth}
        aria-label="Próximo mês"
        className="flex items-center justify-center w-9 h-9 rounded-lg text-[#1A3A5C] hover:bg-[#1A3A5C]/10 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4A9CC7]"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  )
}
