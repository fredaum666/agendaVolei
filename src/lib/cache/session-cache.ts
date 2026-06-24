const CACHE_VERSION = 'av6' // Incrementar para invalidar caches antigos

export function buildCacheKey(
  type: 'games' | 'leagues' | 'sofagames',
  params: Record<string, string | number>
): string {
  const sorted = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('&')
  return `${CACHE_VERSION}_${type}_${sorted}`
}

const ONE_HOUR = 60 * 60 * 1000
const ONE_DAY = 24 * ONE_HOUR

const TTL_BY_TYPE = {
  games: ONE_HOUR,
  leagues: ONE_DAY,
  sofagames: ONE_HOUR,
}

interface CacheEntry<T> {
  data: T
  timestamp: number
}

export function readCache<T>(
  key: string,
  type: 'games' | 'leagues' | 'sofagames' = 'games'
): T | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(key)
    if (!raw) return null

    const entry: CacheEntry<T> = JSON.parse(raw)
    const ttl = TTL_BY_TYPE[type]

    if (Date.now() - entry.timestamp > ttl) {
      sessionStorage.removeItem(key)
      return null
    }

    return entry.data
  } catch {
    return null
  }
}

export function writeCache<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return
  try {
    const entry: CacheEntry<T> = { data, timestamp: Date.now() }
    sessionStorage.setItem(key, JSON.stringify(entry))
  } catch {
    // sessionStorage cheio — falha silenciosa
  }
}

export function clearCache(): void {
  if (typeof window === 'undefined') return
  const keysToRemove: string[] = []
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i)
    if (key?.startsWith(CACHE_VERSION)) {
      keysToRemove.push(key)
    }
  }
  keysToRemove.forEach(k => sessionStorage.removeItem(k))
}
