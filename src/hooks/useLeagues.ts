import { useMemo } from 'react'
import type { League } from '@/types/competition'
import { SOFA_IDS, SOFA_TOURNAMENT_CONFIG } from '@/lib/utils/leagues'

// Ligas derivadas estaticamente do config — sem request extra
export function useLeagues() {
  const leagues = useMemo<League[]>(() => {
    return Object.entries(SOFA_TOURNAMENT_CONFIG).map(([id, config]) => ({
      id: Number(id),
      name: config.displayName,
      displayName: config.displayName,
      shortName: config.shortName,
      category: config.category,
      country: id === String(SOFA_IDS.SUPERLIGA_M) || id === String(SOFA_IDS.SUPERLIGA_F)
        ? 'Brazil'
        : 'World',
      season: 0,
    }))
  }, [])

  return { leagues, isLoading: false, error: null }
}
