/**
 * Script para descobrir os IDs reais das ligas de vôlei na API-Sports.
 *
 * Uso:
 *   1. Configure a variável de ambiente API_SPORTS_KEY (sem o prefixo VITE_)
 *      export API_SPORTS_KEY=sua_chave_aqui
 *
 *   2. Execute:
 *      npm run discover-leagues
 *
 *   3. Copie os IDs relevantes para src/lib/utils/leagues.ts
 */

const API_KEY = process.env.API_SPORTS_KEY ?? process.env.VITE_API_SPORTS_KEY

if (!API_KEY) {
  console.error('❌ Variável de ambiente API_SPORTS_KEY não encontrada.')
  console.error('   Configure com: export API_SPORTS_KEY=sua_chave_aqui')
  process.exit(1)
}

interface ApiLeague {
  id: number
  name: string
  type: string
  logo: string
  country: {
    name: string
    code: string
    flag: string
  }
  seasons: Array<{
    season: number
    start: string
    end: string
    current: boolean
  }>
}

async function main() {
  console.log('🏐 Buscando ligas de vôlei na API-Sports...\n')

  const res = await fetch('https://v1.volleyball.api-sports.io/leagues', {
    headers: {
      'x-apisports-key': API_KEY!,
    },
  })

  if (!res.ok) {
    console.error(`❌ Erro na API: ${res.status} ${res.statusText}`)
    process.exit(1)
  }

  const data = await res.json()

  if (data.errors && Object.keys(data.errors).length > 0) {
    console.error('❌ Erro retornado pela API:', data.errors)
    process.exit(1)
  }

  const leagues: ApiLeague[] = data.response
  console.log(`✅ Total de ligas encontradas: ${leagues.length}\n`)

  // Filtrar ligas relevantes para o Brasil e internacionais de seleções
  const brazilLeagues = leagues.filter(
    l =>
      l.country?.name === 'Brazil' ||
      l.country?.code === 'BR' ||
      l.name.toLowerCase().includes('brazil') ||
      l.name.toLowerCase().includes('brasil') ||
      l.name.toLowerCase().includes('superliga')
  )

  const internationalLeagues = leagues.filter(
    l =>
      l.name.toLowerCase().includes('nations league') ||
      l.name.toLowerCase().includes('world championship') ||
      l.name.toLowerCase().includes('olympic') ||
      l.name.toLowerCase().includes('south american') ||
      l.name.toLowerCase().includes('pan american') ||
      l.country?.code === 'World' ||
      l.country?.name === 'World'
  )

  console.log('🇧🇷 LIGAS DO BRASIL:')
  console.log('─'.repeat(80))
  printTable(brazilLeagues)

  console.log('\n🌍 COMPETIÇÕES INTERNACIONAIS DE SELEÇÕES:')
  console.log('─'.repeat(80))
  printTable(internationalLeagues)

  console.log('\n📋 TODAS AS LIGAS (para referência completa):')
  console.log('─'.repeat(80))
  printTable(leagues.slice(0, 50))

  if (leagues.length > 50) {
    console.log(`... e mais ${leagues.length - 50} ligas. Total: ${leagues.length}`)
  }

  console.log('\n📌 Copie os IDs relevantes para src/lib/utils/leagues.ts')
}

function printTable(leagues: ApiLeague[]) {
  if (leagues.length === 0) {
    console.log('  (nenhuma encontrada)')
    return
  }

  leagues.forEach(l => {
    const current = l.seasons.find(s => s.current)
    const season = current?.season ?? l.seasons[l.seasons.length - 1]?.season ?? 'N/A'
    console.log(
      `  ID: ${String(l.id).padEnd(6)} | País: ${(l.country?.name ?? 'N/A').padEnd(20)} | Temporada: ${String(season).padEnd(6)} | ${l.name}`
    )
  })
}

main().catch(err => {
  console.error('❌ Erro inesperado:', err)
  process.exit(1)
})
