// Tipos brutos da API do SofaScore (endpoint: /api/v1/sport/volleyball/scheduled-events/{date})

export interface SofaTeam {
  id: number
  name: string
  slug: string
  shortName?: string
  country?: {
    alpha2: string
    alpha3: string
    name: string
    slug: string
  }
  teamColors?: {
    primary: string
    secondary: string
    text: string
  }
}

export interface SofaTournament {
  id: number
  name: string
  slug: string
  category: {
    id: number
    name: string
    slug: string
    sport: { id: number; name: string; slug: string }
    country?: { alpha2: string; name: string }
    flag?: string
    alpha2?: string
  }
  uniqueTournament: {
    id: number
    name: string
    slug: string
  }
}

export interface SofaScore {
  current?: number
  display?: number
  period1?: number
  period2?: number
  period3?: number
  period4?: number
  period5?: number
  normaltime?: number
}

export interface SofaEvent {
  id: number
  slug: string
  tournament: SofaTournament
  homeTeam: SofaTeam
  awayTeam: SofaTeam
  homeScore: SofaScore
  awayScore: SofaScore
  status: {
    code: number
    description: string
    type: string // "notstarted" | "inprogress" | "finished" | "postponed" | "canceled"
  }
  startTimestamp: number
  roundInfo?: {
    round: number
    name?: string
  }
}

export interface SofaScheduledEventsResponse {
  events: SofaEvent[]
}
