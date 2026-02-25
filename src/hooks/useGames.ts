import { useState, useEffect, useMemo } from 'react'
import type { Match } from '@/types/match'
import { fetchEventsForMonth } from '@/lib/sofascore/client'
import { transformSofaEvent } from '@/lib/sofascore/transforms'
import { buildCacheKey, readCache, writeCache } from '@/lib/cache/session-cache'
import { formatDateKey, getYear, getMonth } from '@/lib/utils/date'

export function useGames(currentMonth: Date, selectedLeagueId: number | null) {
  const [allGames, setAllGames] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const year = getYear(currentMonth)
  const month = getMonth(currentMonth) // 0-11

  useEffect(() => {
    async function fetchGames() {
      const cacheKey = buildCacheKey('sofagames', { year, month })
      const cached = readCache<Match[]>(cacheKey, 'sofagames')
      if (cached) {
        setAllGames(cached)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const events = await fetchEventsForMonth(year, month)

        const games: Match[] = events
          .map(transformSofaEvent)
          .filter((m): m is Match => m !== null)

        // Remove duplicatas por id
        const seen = new Set<number>()
        const unique = games.filter(g => {
          if (seen.has(g.id)) return false
          seen.add(g.id)
          return true
        })

        setAllGames(unique)
        writeCache(cacheKey, unique)
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Erro desconhecido'
        setError(`Não foi possível carregar os jogos: ${msg}`)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGames()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month])

  // Filtro é client-side — zero requests adicionais ao trocar competição
  const filteredGames = useMemo(() => {
    if (selectedLeagueId === null) return allGames
    return allGames.filter(g => g.league.id === selectedLeagueId)
  }, [allGames, selectedLeagueId])

  // Contagem de jogos por dia para o grid do calendário
  const matchCountsByDay = useMemo<Record<string, number>>(() => {
    return filteredGames.reduce<Record<string, number>>((acc, game) => {
      try {
        const key = formatDateKey(new Date(game.timestamp * 1000))
        acc[key] = (acc[key] ?? 0) + 1
      } catch {
        // data inválida — ignora
      }
      return acc
    }, {})
  }, [filteredGames])

  // Jogos do dia selecionado
  function getGamesForDay(day: Date | null): Match[] {
    if (!day) return []
    const key = formatDateKey(day)
    return filteredGames
      .filter(g => {
        try {
          return formatDateKey(new Date(g.timestamp * 1000)) === key
        } catch {
          return false
        }
      })
      .sort((a, b) => a.timestamp - b.timestamp)
  }

  return { filteredGames, matchCountsByDay, isLoading, error, getGamesForDay }
}
