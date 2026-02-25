import type { SofaScheduledEventsResponse } from './types'

const BASE_URL = import.meta.env.DEV ? '/sofascore' : 'https://api.sofascore.com'

export async function fetchEventsByDate(dateStr: string): Promise<SofaScheduledEventsResponse> {
  const url = `${BASE_URL}/api/v1/sport/volleyball/scheduled-events/${dateStr}`
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) {
    throw new Error(`SofaScore erro ${res.status}: ${res.statusText}`)
  }
  return res.json()
}
