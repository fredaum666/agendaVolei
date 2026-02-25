import type { Match } from '@/types/match'
import { Badge } from '@/components/ui/Badge'
import { TeamDisplay } from './TeamDisplay'
import { formatMatchTime, formatMatchStatus } from '@/lib/utils/date'
import { SOFA_TOURNAMENT_CONFIG, CATEGORY_COLORS } from '@/lib/utils/leagues'

interface MatchCardProps {
  match: Match
}

function getScoreDisplay(match: Match) {
  const isFinished = match.status.short === 'FT' || match.status.short === 'AWD'
  const isLive = match.status.short === 'LIVE' || match.status.short.startsWith('Q')

  if (isFinished && match.sets.home !== null && match.sets.away !== null) {
    return { text: `${match.sets.home}–${match.sets.away}`, isLive: false, isFinished: true }
  }
  if (isLive) {
    return { text: formatMatchStatus(match.status.short), isLive: true, isFinished: false }
  }
  return null
}

export function MatchCard({ match }: MatchCardProps) {
  const config = SOFA_TOURNAMENT_CONFIG[match.league.id]
  const category = config?.category ?? 'internacional'
  const displayName = config?.displayName ?? match.league.name
  const colors = CATEGORY_COLORS[category]

  const time = formatMatchTime(match.date)
  const score = getScoreDisplay(match)
  const isUpcoming = match.status.short === 'NS'

  return (
    <article
      className="bg-white rounded-xl shadow-sm border border-[#E8C99A]/50 overflow-hidden hover:shadow-md transition-shadow"
      aria-label={`${match.teams.home.name} contra ${match.teams.away.name}`}
    >
      {/* Header: badge da competição + horário */}
      <div className={`flex items-center justify-between px-3 py-2 ${colors.bg}/10 border-b border-[#E8C99A]/40`}>
        <Badge label={config?.shortName ?? displayName} category={category} />
        <div className="flex items-center gap-2">
          {score ? (
            <span
              className={`text-xs font-bold ${
                score.isLive ? 'text-red-600 animate-pulse' : 'text-[#1A3A5C]'
              }`}
            >
              {score.text}
            </span>
          ) : (
            isUpcoming && (
              <span className="text-xs font-semibold text-[#2C5F8A]">{time}</span>
            )
          )}
          {match.status.short === 'PD' && (
            <span className="text-xs font-medium text-amber-600">Adiado</span>
          )}
          {match.status.short === 'CANC' && (
            <span className="text-xs font-medium text-red-600">Cancelado</span>
          )}
        </div>
      </div>

      {/* Times */}
      <div className="px-3 py-3">
        <div className="flex items-center justify-between gap-2">
          {/* Time da casa */}
          <div className="flex-1 min-w-0">
            <TeamDisplay
              team={match.teams.home}
              leagueId={match.league.id}
              align="left"
            />
          </div>

          {/* VS / Placar */}
          <div className="flex-shrink-0 flex flex-col items-center">
            {score && !score.isLive ? (
              <span className="text-sm font-black text-[#1A3A5C]">
                {score.text}
              </span>
            ) : (
              <span className="text-xs font-bold text-[#1A3A5C]/40 uppercase">vs</span>
            )}
          </div>

          {/* Time visitante */}
          <div className="flex-1 min-w-0 flex justify-end">
            <TeamDisplay
              team={match.teams.away}
              leagueId={match.league.id}
              align="right"
            />
          </div>
        </div>

        {/* Competição e temporada */}
        <p className="mt-2 text-[10px] text-[#1A3A5C]/50 text-center truncate">
          {displayName} — {match.league.season}
        </p>
      </div>
    </article>
  )
}
