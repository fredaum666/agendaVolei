/**
 * Busca jogos de vôlei do SofaScore para os próximos 60 dias + 30 dias passados
 * e salva em public/data/games-YYYY-MM.json (um arquivo por mês).
 * Também baixa logos dos times em public/logos/{id}.png.
 *
 * Rodado pelo GitHub Actions a cada hora.
 * Também pode ser rodado localmente: node scripts/fetch-games.mjs
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { execFileSync } from 'child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DATA_DIR = join(ROOT, 'public', 'data')
const LOGOS_DIR = join(ROOT, 'public', 'logos')

// Node.js fetch is blocked by SofaScore's bot protection (TLS fingerprinting).
// curl uses a different TLS stack that bypasses it.
const CURL_ARGS = [
  '-s', '--fail', '--max-time', '15',
  '-H', 'Accept: application/json, text/plain, */*',
  '-H', 'Accept-Language: pt-BR,pt;q=0.9',
  '-H', 'sec-ch-ua: "Chromium";v="124", "Google Chrome";v="124"',
  '-H', 'sec-ch-ua-mobile: ?0',
  '-H', 'Sec-Fetch-Dest: empty',
  '-H', 'Sec-Fetch-Mode: cors',
  '-H', 'Sec-Fetch-Site: same-origin',
  '-H', 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  '-H', 'Referer: https://www.sofascore.com/volleyball',
  '-H', 'Origin: https://www.sofascore.com',
  '-H', 'x-requested-with: 1fcf55',
]

function curlGet(url) {
  try {
    const out = execFileSync('curl', [...CURL_ARGS, url], { encoding: 'utf8' })
    return JSON.parse(out)
  } catch {
    return null
  }
}

// uniqueTournament IDs do SofaScore que nos interessam
const TRACKED_IDS = new Set([
  1452,  // Superliga Masc.
  1468,  // Superliga Femn.
  16600, // Copa do Brasil Masc.
  21916, // Copa do Brasil Femn.
  23389, // Campeonato Mineiro Masc.
  29828, // Campeonato Mineiro Femn.
  11093, // VNL Masc.
  11094, // VNL Femn.
  33,    // Mundial Masc.
  32,    // Mundial Femn. (corrigido de 34)
  28473, // Copa Pan-Americana Masc. (corrigido de 327)
  28378, // Copa Pan-Americana Femn. (corrigido de 328)
  859,   // Mundial Clubes Masc. (corrigido de 307)
  860,   // Mundial Clubes Femn. (corrigido de 308)
  586,   // Champions League Masc.
  587,   // Champions League Femn.
  21983, // Sul-Americano de Clubes Masc.
  21984, // Sul-Americano de Clubes Femn.
])

function dateStr(date) {
  return date.toISOString().slice(0, 10)
}

function monthKey(date) {
  return date.toISOString().slice(0, 7) // "YYYY-MM"
}

async function fetchDay(dateString) {
  const ids = [...TRACKED_IDS]
  const allEvents = []
  let blockedCount = 0

  // Fetch per-tournament — the all-sports endpoint is blocked (403)
  const CHUNK = 5
  for (let i = 0; i < ids.length; i += CHUNK) {
    const chunk = ids.slice(i, i + CHUNK)
    for (const id of chunk) {
      const url = `https://www.sofascore.com/api/v1/unique-tournament/${id}/scheduled-events/${dateString}`
      const data = curlGet(url)
      if (data === null) blockedCount++
      else allEvents.push(...(data.events ?? []))
    }
    if (i + CHUNK < ids.length) await new Promise(r => setTimeout(r, 150))
  }

  // If all tournaments were blocked, signal as null (triggers anti-wipe protection)
  if (blockedCount === ids.length) {
    console.warn(`  [${dateString}] all requests blocked — skipping`)
    return null
  }

  return allEvents
}

async function downloadLogo(teamId) {
  const outPath = join(LOGOS_DIR, `${teamId}.png`)
  if (existsSync(outPath)) return // já existe, não baixa de novo

  const url = `https://api.sofascore.com/api/v1/team/${teamId}/image`
  try {
    execFileSync('curl', ['-s', '--max-time', '10', '-o', outPath, url])
  } catch {
    // ignora falhas de logo
  }
}

async function main() {
  mkdirSync(DATA_DIR, { recursive: true })
  mkdirSync(LOGOS_DIR, { recursive: true })

  const today = new Date()
  const dates = []

  // 30 dias atrás até 60 dias à frente
  for (let i = -30; i <= 60; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    dates.push(d)
  }

  // Agrupa por mês
  const byMonth = {}
  for (const d of dates) {
    const key = monthKey(d)
    if (!byMonth[key]) byMonth[key] = []
    byMonth[key].push(dateStr(d))
  }

  const allTeamIds = new Set()

  for (const [month, dayList] of Object.entries(byMonth)) {
    console.log(`Fetching ${month} (${dayList.length} days)...`)

    const allEvents = []
    let blockedCount = 0

    // Busca em paralelo com limite de 5 simultâneos para não sobrecarregar
    const CHUNK = 5
    for (let i = 0; i < dayList.length; i += CHUNK) {
      const chunk = dayList.slice(i, i + CHUNK)
      const results = await Promise.allSettled(chunk.map(fetchDay))
      for (const r of results) {
        if (r.status === 'fulfilled') {
          if (r.value === null) blockedCount++
          else allEvents.push(...r.value)
        }
      }
      if (i + CHUNK < dayList.length) {
        await new Promise(r => setTimeout(r, 300))
      }
    }

    // Se a maioria dos dias foi bloqueada, não sobrescreve o arquivo existente
    if (blockedCount > dayList.length / 2) {
      console.warn(`  ⚠ ${blockedCount}/${dayList.length} days blocked — skipping write for ${month}`)
      continue
    }

    // Remove duplicatas por ID de evento
    const seen = new Set()
    const unique = allEvents.filter(e => {
      if (seen.has(e.id)) return false
      seen.add(e.id)
      return true
    })

    // Coleta IDs de todos os times
    for (const e of unique) {
      if (e.homeTeam?.id) allTeamIds.add(e.homeTeam.id)
      if (e.awayTeam?.id) allTeamIds.add(e.awayTeam.id)
    }

    const outPath = join(DATA_DIR, `games-${month}.json`)
    writeFileSync(outPath, JSON.stringify({ updatedAt: new Date().toISOString(), events: unique }, null, 0))
    console.log(`  → ${unique.length} events saved to games-${month}.json`)
  }

  // Baixa logos dos times (pula as que já existem)
  console.log(`\nDownloading logos for ${allTeamIds.size} teams...`)
  const teamIdList = [...allTeamIds]
  const LOGO_CHUNK = 5
  for (let i = 0; i < teamIdList.length; i += LOGO_CHUNK) {
    const chunk = teamIdList.slice(i, i + LOGO_CHUNK)
    await Promise.allSettled(chunk.map(downloadLogo))
    if (i + LOGO_CHUNK < teamIdList.length) {
      await new Promise(r => setTimeout(r, 200))
    }
  }
  console.log(`  → logos saved to public/logos/`)

  console.log('Done.')
}

main().catch(err => { console.error(err); process.exit(1) })
