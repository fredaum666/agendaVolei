export interface Team {
  id: number
  name: string
  logo: string | null
  country?: {
    name: string
    code: string
  }
}

export interface Match {
  id: number
  date: string // ISO 8601: "2026-02-15T20:00:00+00:00"
  timestamp: number
  league: {
    id: number
    name: string
    season: number
    country: {
      name: string
      code: string
    }
  }
  teams: {
    home: Team
    away: Team
  }
  scores: {
    home: number | null
    away: number | null
  }
  sets: {
    home: number | null
    away: number | null
  }
  status: {
    short: string // "NS" | "LIVE" | "FT" | "PD"
    long: string
  }
}
