import type { ApiSportsResponse } from './types'

// Em dev: usa o proxy do Vite (/api-sports) para evitar CORS
// Em prod: chama diretamente com a key no header
const BASE_URL = import.meta.env.DEV
  ? '/api-sports'
  : 'https://v1.volleyball.api-sports.io'

function getHeaders(): HeadersInit {
  // No proxy do Vite (dev), o header é injetado pelo servidor
  // Em prod, precisamos enviar a key do browser
  if (import.meta.env.DEV) return {}
  const key = import.meta.env.VITE_API_SPORTS_KEY
  if (!key) {
    throw new Error(
      'VITE_API_SPORTS_KEY não configurada. Crie um arquivo .env com sua chave da API-Sports.'
    )
  }
  return { 'x-apisports-key': key }
}

export async function apiSportsFetch<T>(
  path: string,
  params: Record<string, string | number> = {}
): Promise<ApiSportsResponse<T>> {
  const baseAndPath = `${BASE_URL}${path}`
  const url = new URL(baseAndPath, window.location.origin)

  Object.entries(params).forEach(([k, v]) =>
    url.searchParams.set(k, String(v))
  )

  const res = await fetch(url.toString(), {
    headers: getHeaders(),
  })

  if (!res.ok) {
    throw new Error(`API-Sports retornou erro ${res.status}: ${res.statusText}`)
  }

  const data: ApiSportsResponse<T> = await res.json()

  // API-Sports retorna erros dentro do campo "errors"
  if (Array.isArray(data.errors) && data.errors.length > 0) {
    throw new Error(`API-Sports: ${data.errors.join(', ')}`)
  }
  if (!Array.isArray(data.errors) && Object.keys(data.errors).length > 0) {
    throw new Error(`API-Sports: ${JSON.stringify(data.errors)}`)
  }

  return data
}
