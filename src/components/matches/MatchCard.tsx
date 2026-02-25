import { useState } from 'react'
import type { Match } from '@/types/match'
import { Badge } from '@/components/ui/Badge'
import { TeamDisplay } from './TeamDisplay'
import { formatMatchTime } from '@/lib/utils/date'
import { SOFA_TOURNAMENT_CONFIG, CATEGORY_COLORS } from '@/lib/utils/leagues'

interface MatchCardProps {
  match: Match
}

function getFinishedScore(match: Match): string | null {
  const isFinished = match.status.short === 'FT' || match.status.short === 'AWD'
  if (isFinished && match.sets.home !== null && match.sets.away !== null) {
    return `${match.sets.home}–${match.sets.away}`
  }
  return null
}

export function MatchCard({ match }: MatchCardProps) {
  const config = SOFA_TOURNAMENT_CONFIG[match.league.id]
  const category = config?.category ?? 'internacional'
  const displayName = config?.displayName ?? match.league.name
  const colors = CATEGORY_COLORS[category]

  const time = formatMatchTime(match.date)
  const finishedScore = getFinishedScore(match)
  const isFinished = finishedScore !== null
  const isUpcoming = !isFinished

  const [revealed, setRevealed] = useState(false)

  return (
    <article
      className="bg-white rounded-xl shadow-sm border border-[#E8C99A]/50 overflow-hidden hover:shadow-md transition-shadow"
      aria-label={`${match.teams.home.name} contra ${match.teams.away.name}`}
    >
      {/* Header: badge da competição + horário/resultado */}
      <div className={`flex items-center justify-between px-3 py-2 ${colors.bg}/10 border-b border-[#E8C99A]/40`}>
        <Badge label={config?.shortName ?? displayName} category={category} />
        <div className="flex items-center gap-2">
          {isFinished ? (
            <button
              onClick={() => setRevealed(r => !r)}
              className="flex items-center gap-1 text-xs font-semibold text-[#1A3A5C]/60 hover:text-[#1A3A5C] transition-colors"
              aria-label={revealed ? 'Ocultar resultado' : 'Ver resultado'}
            >
              {revealed ? (
                <>
                  <EyeOffIcon />
                  <span>ocultar</span>
                </>
              ) : (
                <>
                  <EyeIcon />
                  <span>resultado</span>
                </>
              )}
            </button>
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
        <div className="flex items-center justify-center gap-3">
          {/* Time da casa */}
          <div className="flex-1 min-w-0 flex justify-end">
            <TeamDisplay
              team={match.teams.home}
              leagueId={match.league.id}
              align="right"
            />
          </div>

          {/* VS / Placar */}
          <div className="flex-shrink-0 flex items-center gap-1">
            {isFinished && revealed ? (
              <>
                <span className="text-xl font-black text-[#1A3A5C]">{match.sets.home}</span>
                <span className="text-xs font-bold text-[#1A3A5C]/40 uppercase">vs</span>
                <span className="text-xl font-black text-[#1A3A5C]">{match.sets.away}</span>
              </>
            ) : (
              <span className="text-xs font-bold text-[#1A3A5C]/40 uppercase">vs</span>
            )}
          </div>

          {/* Time visitante */}
          <div className="flex-1 min-w-0">
            <TeamDisplay
              team={match.teams.away}
              leagueId={match.league.id}
              align="left"
            />
          </div>
        </div>

        {/* Competição */}
        <p className="mt-2 text-[10px] text-[#1A3A5C]/50 text-center truncate">
          {displayName}
        </p>
      </div>
    </article>
  )
}

function EyeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}
