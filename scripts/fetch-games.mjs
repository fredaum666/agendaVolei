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

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DATA_DIR = join(ROOT, 'public', 'data')
const LOGOS_DIR = join(ROOT, 'public', 'logos')

const HEADERS = {
  'Accept': 'application/json',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Referer': 'https://www.sofascore.com/',
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
  34,    // Mundial Femn.
  327,   // Copa Pan-Americana Masc.
  328,   // Copa Pan-Americana Femn.
  41,    // Olímpicos Masc.
  42,    // Olímpicos Femn.
  307,   // Mundial Clubes Masc.
  308,   // Mundial Clubes Femn.
])

function dateStr(date) {
  return date.toISOString().slice(0, 10)
}

function monthKey(date) {
  return date.toISOString().slice(0, 7) // "YYYY-MM"
}

async function fetchDay(dateString) {
  const url = `https://www.sofascore.com/api/v1/sport/volleyball/scheduled-events/${dateString}`
  const res = await fetch(url, { headers: HEADERS })

  if (!res.ok) {
    console.warn(`  [${dateString}] HTTP ${res.status} — skipping`)
    return null // null = blocked, not just empty
  }

  const data = await res.json()
  const events = data.events ?? []

  return events.filter(e => TRACKED_IDS.has(e.tournament?.uniqueTournament?.id))
}

async function downloadLogo(teamId) {
  const outPath = join(LOGOS_DIR, `${teamId}.png`)
  if (existsSync(outPath)) return // já existe, não baixa de novo

  const url = `https://api.sofascore.com/api/v1/team/${teamId}/image`
  try {
    const res = await fetch(url, { headers: HEADERS })
    if (!res.ok) return
    const buffer = await res.arrayBuffer()
    writeFileSync(outPath, Buffer.from(buffer))
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
