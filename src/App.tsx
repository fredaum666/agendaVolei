import { useRef, useEffect } from 'react'
import { CalendarProvider, useCalendarContext } from '@/contexts/CalendarContext'
import { AppHeader } from '@/components/layout/AppHeader'
import { PageContainer } from '@/components/layout/PageContainer'
import { CompetitionFilter } from '@/components/filters/CompetitionFilter'
import { CalendarHeader } from '@/components/calendar/CalendarHeader'
import { CalendarGrid } from '@/components/calendar/CalendarGrid'
import { MatchList } from '@/components/matches/MatchList'
import { useLeagues } from '@/hooks/useLeagues'
import { useGames } from '@/hooks/useGames'

function CalendarApp() {
  const {
    currentMonth,
    selectedDay,
    selectedLeagueId,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
    selectDay,
    selectLeague,
  } = useCalendarContext()

  const { leagues, isLoading: leaguesLoading } = useLeagues()
  const { matchCountsByDay, isLoading: gamesLoading, error, getGamesForDay } = useGames(
    currentMonth,
    selectedLeagueId
  )

  const selectedDayMatches = getGamesForDay(selectedDay)
  const matchListRef = useRef<HTMLDivElement>(null)

  // Scroll suave para a lista de jogos ao selecionar um dia
  useEffect(() => {
    if (selectedDay && matchListRef.current) {
      const el = matchListRef.current
      const top = el.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }, [selectedDay])

  return (
    <>
      <AppHeader />

      <CompetitionFilter
        leagues={leagues}
        selectedLeagueId={selectedLeagueId}
        onLeagueSelect={selectLeague}
        isLoading={leaguesLoading}
      />

      <PageContainer>
        {/* Card do calendário */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-[#E8C99A]/60 p-3 mb-3">
          <CalendarHeader
            currentDate={currentMonth}
            onPreviousMonth={goToPreviousMonth}
            onNextMonth={goToNextMonth}
            onGoToToday={goToToday}
            isLoading={gamesLoading}
          />
          <CalendarGrid
            currentMonth={currentMonth}
            selectedDay={selectedDay}
            matchCountsByDay={matchCountsByDay}
            onDaySelect={selectDay}
          />

        </div>

        {/* Lista de jogos do dia */}
        <div
          ref={matchListRef}
          className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-[#E8C99A]/60 p-3 min-h-[180px]"
        >
          <MatchList
            selectedDay={selectedDay}
            matches={selectedDayMatches}
            isLoading={gamesLoading}
            error={error}
            hasFilter={selectedLeagueId !== null}
          />
        </div>

        {/* Rodapé */}
        <footer className="mt-5 text-center">
          <p className="text-[11px] text-[#1A3A5C]/35">
            Dados via{' '}
            <a
              href="https://www.sofascore.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              SofaScore
            </a>
          </p>
        </footer>
      </PageContainer>
    </>
  )
}


export default function App() {
  return (
    <CalendarProvider>
      <CalendarApp />
    </CalendarProvider>
  )
}
