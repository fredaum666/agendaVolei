export interface ApiSportsResponse<T> {
  get: string
  parameters: Record<string, string | number>
  errors: string[] | Record<string, string>
  results: number
  paging: {
    current: number
    total: number
  }
  response: T[]
}

export interface ApiCountry {
  name: string
  code: string
  flag: string
}

export interface ApiLeague {
  id: number
  name: string
  type: string
  logo: string
  country: ApiCountry
  seasons: Array<{
    season: number
    start: string
    end: string
    current: boolean
  }>
}

export interface ApiGame {
  id: number
  date: string
  time: string
  timestamp: number
  timezone: string
  week: string
  status: {
    long: string
    short: string
  }
  league: {
    id: number
    name: string
    season: number
    logo: string
    country: ApiCountry
  }
  country: ApiCountry & { id: number }
  teams: {
    home: {
      id: number
      name: string
      logo: string
    }
    away: {
      id: number
      name: string
      logo: string
    }
  }
  scores: {
    home: number | null
    away: number | null
  }
  sets: {
    home: number | null
    away: number | null
  }
}
