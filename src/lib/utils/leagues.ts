import type { LeagueCategory } from '@/types/competition'

// uniqueTournament IDs do SofaScore
export const SOFA_IDS = {
  SUPERLIGA_M: 1452,
  SUPERLIGA_F: 1468,
  VNL_M: 11093,
  VNL_F: 11094,
  WORLD_CHAMPIONSHIP_M: 33,
  WORLD_CHAMPIONSHIP_F: 34,
  PAN_AMERICAN_CUP_M: 327,
  PAN_AMERICAN_CUP_F: 328,
  OLYMPIC_GAMES_M: 41,
  OLYMPIC_GAMES_F: 42,
  CLUB_WORLD_M: 307,
  CLUB_WORLD_F: 308,
} as const

export const TRACKED_SOFA_IDS: ReadonlySet<number> = new Set(Object.values(SOFA_IDS))

interface TournamentConfig {
  displayName: string
  shortName: string
  category: LeagueCategory
}

export const SOFA_TOURNAMENT_CONFIG: Record<number, TournamentConfig> = {
  [SOFA_IDS.SUPERLIGA_M]: {
    displayName: 'Superliga Masc.',
    shortName: 'Superliga Masc.',
    category: 'superliga-m',
  },
  [SOFA_IDS.SUPERLIGA_F]: {
    displayName: 'Superliga Femn.',
    shortName: 'Superliga Femn.',
    category: 'superliga-f',
  },
  [SOFA_IDS.VNL_M]: {
    displayName: 'Liga das Nações Masc.',
    shortName: 'Liga das Nações Masc.',
    category: 'internacional',
  },
  [SOFA_IDS.VNL_F]: {
    displayName: 'Liga das Nações Femn.',
    shortName: 'Liga das Nações Femn.',
    category: 'internacional',
  },
  [SOFA_IDS.WORLD_CHAMPIONSHIP_M]: {
    displayName: 'Campeonato Mundial Masc.',
    shortName: 'Campeonato Mundial Masc.',
    category: 'internacional',
  },
  [SOFA_IDS.WORLD_CHAMPIONSHIP_F]: {
    displayName: 'Campeonato Mundial Femn.',
    shortName: 'Campeonato Mundial Femn.',
    category: 'internacional',
  },
  [SOFA_IDS.PAN_AMERICAN_CUP_M]: {
    displayName: 'Copa Pan-Americana Masc.',
    shortName: 'Copa Pan-Americana Masc.',
    category: 'internacional',
  },
  [SOFA_IDS.PAN_AMERICAN_CUP_F]: {
    displayName: 'Copa Pan-Americana Femn.',
    shortName: 'Copa Pan-Americana Femn.',
    category: 'internacional',
  },
  [SOFA_IDS.OLYMPIC_GAMES_M]: {
    displayName: 'Jogos Olímpicos Masc.',
    shortName: 'Jogos Olímpicos Masc.',
    category: 'internacional',
  },
  [SOFA_IDS.OLYMPIC_GAMES_F]: {
    displayName: 'Jogos Olímpicos Femn.',
    shortName: 'Jogos Olímpicos Femn.',
    category: 'internacional',
  },
  [SOFA_IDS.CLUB_WORLD_M]: {
    displayName: 'Mundial de Clubes Masc.',
    shortName: 'Mundial de Clubes Masc.',
    category: 'internacional',
  },
  [SOFA_IDS.CLUB_WORLD_F]: {
    displayName: 'Mundial de Clubes Femn.',
    shortName: 'Mundial de Clubes Femn.',
    category: 'internacional',
  },
}

// Cores por categoria para badges e indicadores visuais
export const CATEGORY_COLORS: Record<LeagueCategory, { bg: string; text: string; border: string }> = {
  'superliga-m': {
    bg: 'bg-[#1A3A5C]',
    text: 'text-white',
    border: 'border-[#1A3A5C]',
  },
  'superliga-f': {
    bg: 'bg-[#8B1A6B]',
    text: 'text-white',
    border: 'border-[#8B1A6B]',
  },
  'nacional': {
    bg: 'bg-[#1A6B1A]',
    text: 'text-white',
    border: 'border-[#1A6B1A]',
  },
  'internacional': {
    bg: 'bg-[#B8860B]',
    text: 'text-white',
    border: 'border-[#B8860B]',
  },
  'estadual': {
    bg: 'bg-[#6B3A1A]',
    text: 'text-white',
    border: 'border-[#6B3A1A]',
  },
}

// Torneios de seleções nacionais (usam bandeiras em vez de logos de clubes)
export const NATIONAL_TEAM_TOURNAMENT_IDS: ReadonlySet<number> = new Set<number>([
  SOFA_IDS.VNL_M,
  SOFA_IDS.VNL_F,
  SOFA_IDS.WORLD_CHAMPIONSHIP_M,
  SOFA_IDS.WORLD_CHAMPIONSHIP_F,
  SOFA_IDS.PAN_AMERICAN_CUP_M,
  SOFA_IDS.PAN_AMERICAN_CUP_F,
  SOFA_IDS.OLYMPIC_GAMES_M,
  SOFA_IDS.OLYMPIC_GAMES_F,
])

export function isNationalTeamLeague(leagueId: number): boolean {
  return NATIONAL_TEAM_TOURNAMENT_IDS.has(leagueId)
}
