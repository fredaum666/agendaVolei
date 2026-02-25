import type { ApiGame, ApiLeague } from './types'
import type { Match } from '@/types/match'
import type { League } from '@/types/competition'
import { SOFA_TOURNAMENT_CONFIG as LEAGUE_DISPLAY_CONFIG } from '@/lib/utils/leagues'

export function transformApiGame(raw: ApiGame): Match {
  return {
    id: raw.id,
    date: `${raw.date}T${raw.time}:00`,
    timestamp: raw.timestamp,
    league: {
      id: raw.league.id,
      name: raw.league.name,
      season: raw.league.season,
      country: {
        name: raw.league.country.name,
        code: raw.league.country.code,
      },
    },
    teams: {
      home: {
        id: raw.teams.home.id,
        name: raw.teams.home.name,
        logo: raw.teams.home.logo || null,
        country: {
          name: raw.league.country.name,
          code: raw.league.country.code,
        },
      },
      away: {
        id: raw.teams.away.id,
        name: raw.teams.away.name,
        logo: raw.teams.away.logo || null,
        country: {
          name: raw.league.country.name,
          code: raw.league.country.code,
        },
      },
    },
    scores: {
      home: raw.scores?.home ?? null,
      away: raw.scores?.away ?? null,
    },
    sets: {
      home: raw.sets?.home ?? null,
      away: raw.sets?.away ?? null,
    },
    status: {
      short: raw.status.short,
      long: raw.status.long,
    },
  }
}

export function transformApiLeague(raw: ApiLeague): League | null {
  const currentSeason = raw.seasons.find(s => s.current) ?? raw.seasons[raw.seasons.length - 1]
  if (!currentSeason) return null

  const config = LEAGUE_DISPLAY_CONFIG[raw.id]
  if (!config) return null

  return {
    id: raw.id,
    name: raw.name,
    displayName: config.displayName,
    shortName: config.shortName,
    category: config.category,
    country: raw.country.name,
    season: currentSeason.season,
    logo: raw.logo,
  }
}
