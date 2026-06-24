import { Flag } from '@/components/ui/Flag'
import { isNationalTeamLeague } from '@/lib/utils/leagues'
import type { Team } from '@/types/match'

interface TeamDisplayProps {
  team: Team
  leagueId: number
  align: 'left' | 'right'
}

export function TeamDisplay({ team, leagueId, align }: TeamDisplayProps) {
  const isNational = isNationalTeamLeague(leagueId)
  const countryCode = team.country?.code ?? team.name.slice(0, 2)

  const flexDir = align === 'left' ? 'flex-row' : 'flex-row-reverse'
  const textAlign = align === 'left' ? 'text-left' : 'text-right'

  return (
    <div className={`flex items-center gap-2 min-w-0 ${flexDir}`}>
      {isNational ? (
        <Flag
          countryCodeOrName={team.country?.code ?? team.country?.name ?? team.name}
          size="md"
          alt={`Bandeira de ${team.name}`}
          className="flex-shrink-0"
        />
      ) : team.logo ? (
        <img
          src={team.logo}
          alt={`Logo de ${team.name}`}
          className="w-7 h-7 object-contain flex-shrink-0"
          loading="lazy"
          onError={e => {
            (e.target as HTMLImageElement).style.display = 'none'
          }}
        />
      ) : (
        <div
          className="w-7 h-7 rounded-full bg-[#1A3A5C]/10 flex items-center justify-center flex-shrink-0"
          aria-hidden
        >
          <span className="text-[10px] font-bold text-[#1A3A5C]/50">
            {team.name.slice(0, 2).toUpperCase()}
          </span>
        </div>
      )}
      <span
        className={`text-sm font-semibold text-[#1A3A5C] truncate leading-tight ${textAlign}`}
        title={team.name}
      >
        {team.name}
      </span>
      {isNational && (
        <span className="sr-only">{countryCode}</span>
      )}
    </div>
  )
}
