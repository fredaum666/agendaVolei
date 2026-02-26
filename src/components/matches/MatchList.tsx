import type { Match } from '@/types/match'
import { MatchCard } from './MatchCard'
import { MatchCardSkeleton } from './MatchCardSkeleton'
import { EmptyMatchState } from './EmptyMatchState'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { formatFullDate } from '@/lib/utils/date'

interface MatchListProps {
  selectedDay: Date | null
  matches: Match[]
  isLoading: boolean
  error: string | null
  hasFilter: boolean
}

export function MatchList({
  selectedDay,
  matches,
  isLoading,
  error,
  hasFilter,
}: MatchListProps) {
  if (!selectedDay) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 px-4 text-center">
        <p className="text-sm font-medium text-[#1A3A5C]/50">
          Selecione um dia no calendário para ver os jogos
        </p>
      </div>
    )
  }

  const fullDate = formatFullDate(selectedDay)

  return (
    <section aria-label={`Jogos de ${fullDate}`}>
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="text-base font-bold text-[#1A3A5C] capitalize">
          {fullDate}
        </h3>
        {!isLoading && !error && matches.length > 0 && (
          <span className="text-xs font-medium text-[#2C5F8A] bg-[#EBF4FA] px-2 py-0.5 rounded-full">
            {matches.length} jogo{matches.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {error ? (
        <ErrorMessage message={error} />
      ) : isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <MatchCardSkeleton key={i} />
          ))}
        </div>
      ) : matches.length === 0 ? (
        <EmptyMatchState hasFilter={hasFilter} />
      ) : (
        <div className="flex flex-col gap-3">
          {matches.map(match => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </section>
  )
}
