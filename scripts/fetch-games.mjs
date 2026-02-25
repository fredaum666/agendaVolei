/**
 * Busca jogos de vôlei do SofaScore para os próximos 60 dias + 30 dias passados
 * e salva em public/data/games-YYYY-MM.json (um arquivo por mês).
 *
 * Rodado pelo GitHub Actions a cada hora.
 * Também pode ser rodado localmente: node scripts/fetch-games.mjs
 */

import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DATA_DIR = join(ROOT, 'public', 'data')

// uniqueTournament IDs do SofaScore que nos interessam
const TRACKED_IDS = new Set([
  1452, // Superliga Masc.
  1468, // Superliga Femn.
  11093, // VNL Masc.
  11094, // VNL Femn.
  33,   // Mundial Masc.
  34,   // Mundial Femn.
  327,  // Copa Pan-Americana Masc.
  328,  // Copa Pan-Americana Femn.
  41,   // Olímpicos Masc.
  42,   // Olímpicos Femn.
  307,  // Mundial Clubes Masc.
  308,  // Mundial Clubes Femn.
])

function dateStr(date) {
  return date.toISOString().slice(0, 10)
}

function monthKey(date) {
  return date.toISOString().slice(0, 7) // "YYYY-MM"
}

async function fetchDay(dateString) {
  const url = `https://www.sofascore.com/api/v1/sport/volleyball/scheduled-events/${dateString}`
  const res = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Referer': 'https://www.sofascore.com/',
    },
  })

  if (!res.ok) {
    console.warn(`  [${dateString}] HTTP ${res.status} — skipping`)
    return []
  }

  const data = await res.json()
  const events = data.events ?? []

  // Filtra apenas os torneios que nos interessam
  return events.filter(e => TRACKED_IDS.has(e.tournament?.uniqueTournament?.id))
}

async function main() {
  mkdirSync(DATA_DIR, { recursive: true })

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

  for (const [month, dayList] of Object.entries(byMonth)) {
    console.log(`Fetching ${month} (${dayList.length} days)...`)

    const allEvents = []

    // Busca em paralelo com limite de 5 simultâneos para não sobrecarregar
    const CHUNK = 5
    for (let i = 0; i < dayList.length; i += CHUNK) {
      const chunk = dayList.slice(i, i + CHUNK)
      const results = await Promise.allSettled(chunk.map(fetchDay))
      for (const r of results) {
        if (r.status === 'fulfilled') allEvents.push(...r.value)
      }
      // Pequena pausa entre chunks
      if (i + CHUNK < dayList.length) {
        await new Promise(r => setTimeout(r, 300))
      }
    }

    // Remove duplicatas por ID de evento
    const seen = new Set()
    const unique = allEvents.filter(e => {
      if (seen.has(e.id)) return false
      seen.add(e.id)
      return true
    })

    const outPath = join(DATA_DIR, `games-${month}.json`)
    writeFileSync(outPath, JSON.stringify({ updatedAt: new Date().toISOString(), events: unique }, null, 0))
    console.log(`  → ${unique.length} events saved to games-${month}.json`)
  }

  console.log('Done.')
}

main().catch(err => { console.error(err); process.exit(1) })
