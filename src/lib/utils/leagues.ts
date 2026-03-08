import type { LeagueCategory } from '@/types/competition'

// uniqueTournament IDs do SofaScore
export const SOFA_IDS = {
  SUPERLIGA_M: 1452,
  SUPERLIGA_F: 1468,
  COPA_BRASIL_M: 16600,
  COPA_BRASIL_F: 21916,
  CAMPEONATO_MINEIRO_M: 23389,
  CAMPEONATO_MINEIRO_F: 29828,
  VNL_M: 11093,
  VNL_F: 11094,
  WORLD_CHAMPIONSHIP_M: 33,
  WORLD_CHAMPIONSHIP_F: 34,
  PAN_AMERICAN_CUP_M: 28473,
  PAN_AMERICAN_CUP_F: 28378,
  OLYMPIC_GAMES_M: 41,
  OLYMPIC_GAMES_F: 42,
  CLUB_WORLD_M: 307,
  CLUB_WORLD_F: 308,
  CHAMPIONS_LEAGUE_M: 586,
  CHAMPIONS_LEAGUE_F: 587,
  SOUTH_AMERICAN_CLUBS_M: 21983,
  SOUTH_AMERICAN_CLUBS_F: 21984,
} as const

export const TRACKED_SOFA_IDS: ReadonlySet<number> = new Set(Object.values(SOFA_IDS))

// Cor de gênero — azul para Masc, roxo para Femn
export const GENDER_COLOR: Record<'M' | 'F', string> = {
  M: '#1A6BE8',
  F: '#9B1AE8',
}

interface TournamentConfig {
  displayName: string
  shortName: string
  category: LeagueCategory
  seasonMonths: string // ex: "out – mai"
  color: string        // cor de identidade do torneio (Superliga = verde, VNL = laranja, etc.)
  gender: 'M' | 'F'
}

export const SOFA_TOURNAMENT_CONFIG: Record<number, TournamentConfig> = {
  [SOFA_IDS.SUPERLIGA_M]: {
    displayName: 'Superliga Masc.',
    shortName: 'Superliga Masc.',
    category: 'superliga-m',
    seasonMonths: 'out – mai',
    color: '#00C45A', // verde Superliga
    gender: 'M',
  },
  [SOFA_IDS.SUPERLIGA_F]: {
    displayName: 'Superliga Femn.',
    shortName: 'Superliga Femn.',
    category: 'superliga-f',
    seasonMonths: 'out – mai',
    color: '#00C45A', // verde Superliga
    gender: 'F',
  },
  [SOFA_IDS.COPA_BRASIL_M]: {
    displayName: 'Copa do Brasil Masc.',
    shortName: 'Copa Brasil Masc.',
    category: 'nacional',
    seasonMonths: 'jan – mar',
    color: '#F7C200', // amarelo Copa Brasil
    gender: 'M',
  },
  [SOFA_IDS.COPA_BRASIL_F]: {
    displayName: 'Copa do Brasil Femn.',
    shortName: 'Copa Brasil Femn.',
    category: 'nacional',
    seasonMonths: 'jan – fev',
    color: '#F7C200', // amarelo Copa Brasil
    gender: 'F',
  },
  [SOFA_IDS.CAMPEONATO_MINEIRO_M]: {
    displayName: 'Campeonato Mineiro Masc.',
    shortName: 'Mineiro Masc.',
    category: 'estadual',
    seasonMonths: 'set – nov',
    color: '#E8001E', // vermelho Minas
    gender: 'M',
  },
  [SOFA_IDS.CAMPEONATO_MINEIRO_F]: {
    displayName: 'Campeonato Mineiro Femn.',
    shortName: 'Mineiro Femn.',
    category: 'estadual',
    seasonMonths: 'set – nov',
    color: '#E8001E', // vermelho Minas
    gender: 'F',
  },
  [SOFA_IDS.VNL_M]: {
    displayName: 'Liga das Nações Masc.',
    shortName: 'Liga das Nações Masc.',
    category: 'internacional',
    seasonMonths: 'jun – ago',
    color: '#FF6B00', // laranja VNL
    gender: 'M',
  },
  [SOFA_IDS.VNL_F]: {
    displayName: 'Liga das Nações Femn.',
    shortName: 'Liga das Nações Femn.',
    category: 'internacional',
    seasonMonths: 'jun – ago',
    color: '#FF6B00', // laranja VNL
    gender: 'F',
  },
  [SOFA_IDS.WORLD_CHAMPIONSHIP_M]: {
    displayName: 'Campeonato Mundial Masc.',
    shortName: 'Campeonato Mundial Masc.',
    category: 'internacional',
    seasonMonths: 'a cada 4 anos',
    color: '#0077B6', // azul FIVB Mundial
    gender: 'M',
  },
  [SOFA_IDS.WORLD_CHAMPIONSHIP_F]: {
    displayName: 'Campeonato Mundial Femn.',
    shortName: 'Campeonato Mundial Femn.',
    category: 'internacional',
    seasonMonths: 'a cada 4 anos',
    color: '#0077B6', // azul FIVB Mundial
    gender: 'F',
  },
  [SOFA_IDS.PAN_AMERICAN_CUP_M]: {
    displayName: 'Copa Pan-Americana Masc.',
    shortName: 'Copa Pan-Americana Masc.',
    category: 'internacional',
    seasonMonths: 'jun – jul',
    color: '#00A3E0', // azul claro Pan-Am
    gender: 'M',
  },
  [SOFA_IDS.PAN_AMERICAN_CUP_F]: {
    displayName: 'Copa Pan-Americana Femn.',
    shortName: 'Copa Pan-Americana Femn.',
    category: 'internacional',
    seasonMonths: 'jun – jul',
    color: '#00A3E0', // azul claro Pan-Am
    gender: 'F',
  },
  [SOFA_IDS.OLYMPIC_GAMES_M]: {
    displayName: 'Jogos Olímpicos Masc.',
    shortName: 'Jogos Olímpicos Masc.',
    category: 'internacional',
    seasonMonths: 'a cada 4 anos',
    color: '#C8961A', // dourado olímpico
    gender: 'M',
  },
  [SOFA_IDS.OLYMPIC_GAMES_F]: {
    displayName: 'Jogos Olímpicos Femn.',
    shortName: 'Jogos Olímpicos Femn.',
    category: 'internacional',
    seasonMonths: 'a cada 4 anos',
    color: '#C8961A', // dourado olímpico
    gender: 'F',
  },
  [SOFA_IDS.CLUB_WORLD_M]: {
    displayName: 'Mundial de Clubes Masc.',
    shortName: 'Mundial de Clubes Masc.',
    category: 'internacional',
    seasonMonths: 'nov – dez',
    color: '#455A64', // cinza azulado escuro Mundial Clubes
    gender: 'M',
  },
  [SOFA_IDS.CLUB_WORLD_F]: {
    displayName: 'Mundial de Clubes Femn.',
    shortName: 'Mundial de Clubes Femn.',
    category: 'internacional',
    seasonMonths: 'nov – dez',
    color: '#455A64', // cinza azulado escuro Mundial Clubes
    gender: 'F',
  },
  [SOFA_IDS.CHAMPIONS_LEAGUE_M]: {
    displayName: 'Champions League Masc.',
    shortName: 'Champions League Masc.',
    category: 'internacional',
    seasonMonths: 'out – mai',
    color: '#0D1B6E', // azul escuro Champions League
    gender: 'M',
  },
  [SOFA_IDS.CHAMPIONS_LEAGUE_F]: {
    displayName: 'Champions League Femn.',
    shortName: 'Champions League Femn.',
    category: 'internacional',
    seasonMonths: 'out – mai',
    color: '#0D1B6E', // azul escuro Champions League
    gender: 'F',
  },
  [SOFA_IDS.SOUTH_AMERICAN_CLUBS_M]: {
    displayName: 'Sul-Americano de Clubes Masc.',
    shortName: 'Sul-Am. Clubes Masc.',
    category: 'internacional',
    seasonMonths: 'jan – mar',
    color: '#006847', // verde sul-americano
    gender: 'M',
  },
  [SOFA_IDS.SOUTH_AMERICAN_CLUBS_F]: {
    displayName: 'Sul-Americano de Clubes Femn.',
    shortName: 'Sul-Am. Clubes Femn.',
    category: 'internacional',
    seasonMonths: 'jan – fev',
    color: '#006847', // verde sul-americano
    gender: 'F',
  },
}

// Cores por categoria para badges de texto (MatchCard)
export const CATEGORY_COLORS: Record<LeagueCategory, { bg: string; text: string; border: string }> = {
  'superliga-m': {
    bg: 'bg-[#00A651]',
    text: 'text-white',
    border: 'border-[#00A651]',
  },
  'superliga-f': {
    bg: 'bg-[#00A651]',
    text: 'text-white',
    border: 'border-[#00A651]',
  },
  'nacional': {
    bg: 'bg-[#F5D000]',
    text: 'text-[#1A3A5C]',
    border: 'border-[#F5D000]',
  },
  'internacional': {
    bg: 'bg-[#FF6B00]',
    text: 'text-white',
    border: 'border-[#FF6B00]',
  },
  'estadual': {
    bg: 'bg-[#C8102E]',
    text: 'text-white',
    border: 'border-[#C8102E]',
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

// Helper: retorna as duas cores do badge bicolor de um torneio
export function getTournamentBadgeColors(leagueId: number): { tournamentColor: string; genderColor: string } | null {
  const config = SOFA_TOURNAMENT_CONFIG[leagueId]
  if (!config) return null
  return {
    tournamentColor: config.color,
    genderColor: GENDER_COLOR[config.gender],
  }
}
