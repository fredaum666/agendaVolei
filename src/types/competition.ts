export type LeagueCategory =
  | 'superliga-m'
  | 'superliga-f'
  | 'nacional'
  | 'internacional'
  | 'estadual'

export interface League {
  id: number
  name: string
  displayName: string
  shortName: string
  category: LeagueCategory
  country: string
  season: number
  seasonMonths?: string
  logo?: string
}
