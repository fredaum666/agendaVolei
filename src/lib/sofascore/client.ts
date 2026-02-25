import type { SofaEvent } from './types'

interface MonthDataFile {
  updatedAt: string
  events: SofaEvent[]
}

// Em dev: proxy Vite local (por dia). Em prod: JSON estático pré-gerado (por mês).
export async function fetchEventsForMonth(year: number, month: number): Promise<SofaEvent[]> {
  if (import.meta.env.DEV) {
    return fetchEventsForMonthDev(year, month)
  }

  // Prod: lê o JSON estático gerado pelo GitHub Actions
  const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`
  const base = import.meta.env.BASE_URL ?? '/'
  const url = `${base}data/games-${monthKey}.json`

  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Dados não disponíveis para ${monthKey} (HTTP ${res.status})`)
  }
  const data: MonthDataFile = await res.json()
  return data.events ?? []
}

// Dev: busca dia a dia via proxy Vite (sem CORS)
async function fetchEventsForMonthDev(year: number, month: number): Promise<SofaEvent[]> {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const dates: string[] = Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(year, month, i + 1)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  })

  const results = await Promise.allSettled(
    dates.map(date =>
      fetch(`/sofascore/api/v1/sport/volleyball/scheduled-events/${date}`, {
        headers: { Accept: 'application/json' },
      }).then(r => r.ok ? r.json() : { events: [] })
    )
  )

  const all: SofaEvent[] = results.flatMap(r =>
    r.status === 'fulfilled' ? (r.value.events ?? []) : []
  )

  // Remove duplicatas
  const seen = new Set<number>()
  return all.filter(e => { if (seen.has(e.id)) return false; seen.add(e.id); return true })
}
