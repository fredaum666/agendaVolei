import type { SofaEvent } from './types'
import type { Match } from '@/types/match'
import { SOFA_TOURNAMENT_CONFIG } from '@/lib/utils/leagues'

export function transformSofaEvent(raw: SofaEvent): Match | null {
  const config = SOFA_TOURNAMENT_CONFIG[raw.tournament.uniqueTournament.id]
  if (!config) return null

  const statusType = raw.status.type
  const statusShort = mapStatusShort(statusType, raw.status.code)

  return {
    id: raw.id,
    date: new Date(raw.startTimestamp * 1000).toISOString(),
    timestamp: raw.startTimestamp,
    league: {
      id: raw.tournament.uniqueTournament.id,
      name: config.displayName,
      season: 0,
      country: {
        name: raw.tournament.category.country?.name ?? raw.tournament.category.name,
        code: raw.tournament.category.country?.alpha2 ?? raw.tournament.category.alpha2 ?? '',
      },
    },
    teams: {
      home: {
        id: raw.homeTeam.id,
        name: raw.homeTeam.name,
        logo: `https://api.sofascore.com/api/v1/team/${raw.homeTeam.id}/image`,
        country: raw.homeTeam.country
          ? { name: raw.homeTeam.country.name, code: raw.homeTeam.country.alpha2 }
          : undefined,
      },
      away: {
        id: raw.awayTeam.id,
        name: raw.awayTeam.name,
        logo: `https://api.sofascore.com/api/v1/team/${raw.awayTeam.id}/image`,
        country: raw.awayTeam.country
          ? { name: raw.awayTeam.country.name, code: raw.awayTeam.country.alpha2 }
          : undefined,
      },
    },
    scores: {
      home: raw.homeScore?.current ?? null,
      away: raw.awayScore?.current ?? null,
    },
    sets: {
      home: raw.homeScore?.normaltime ?? null,
      away: raw.awayScore?.normaltime ?? null,
    },
    status: {
      short: statusShort,
      long: raw.status.description,
    },
  }
}

function mapStatusShort(type: string, code: number): string {
  if (type === 'notstarted') return 'NS'
  if (type === 'inprogress') {
    if (code === 70) return 'Q1'
    if (code === 71) return 'Q2'
    if (code === 72) return 'Q3'
    if (code === 73) return 'Q4'
    if (code === 74) return 'Q5'
    return 'LIVE'
  }
  if (type === 'finished') return 'FT'
  if (type === 'postponed') return 'PD'
  if (type === 'canceled') return 'CANC'
  return type.toUpperCase()
}
