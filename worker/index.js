/**
 * Cloudflare Worker — proxy para api.sofascore.com
 * Remove o header Origin para evitar o bloqueio 403 do SofaScore.
 *
 * Deploy: https://workers.cloudflare.com (plano gratuito: 100k req/dia)
 */

const SOFASCORE_BASE = 'https://www.sofascore.com'

// Origens permitidas (adicione mais se necessário)
const ALLOWED_ORIGINS = [
  'https://fredaum666.github.io',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:4173',
]

export default {
  async fetch(request) {
    const origin = request.headers.get('Origin') || ''
    const isAllowed = ALLOWED_ORIGINS.some(o => origin.startsWith(o))

    // Responde OPTIONS (preflight CORS)
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(origin, isAllowed),
      })
    }

    const url = new URL(request.url)
    const target = `${SOFASCORE_BASE}${url.pathname}${url.search}`

    // Monta request para o SofaScore sem o header Origin
    const proxyRequest = new Request(target, {
      method: request.method,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
        'Referer': 'https://www.sofascore.com/',
      },
    })

    try {
      const response = await fetch(proxyRequest)
      const body = await response.arrayBuffer()

      return new Response(body, {
        status: response.status,
        headers: {
          'Content-Type': response.headers.get('Content-Type') || 'application/json',
          'Cache-Control': 'public, max-age=3600',
          ...corsHeaders(origin, isAllowed),
        },
      })
    } catch (err) {
      return new Response(JSON.stringify({ error: String(err) }), {
        status: 502,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(origin, isAllowed) },
      })
    }
  },
}

function corsHeaders(origin, isAllowed) {
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : 'null',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Accept, Content-Type',
    'Access-Control-Max-Age': '86400',
  }
}
