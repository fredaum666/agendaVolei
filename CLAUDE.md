# Agenda Vôlei — Guia para Claude

## Visão Geral

Calendário de jogos de vôlei servido como SPA estática no GitHub Pages.
URL produção: `https://fredaum666.github.io/agendaVolei/`

**Stack:** React 18 + Vite 6 + TypeScript + Tailwind CSS 4 + PWA (vite-plugin-pwa)
**Gerenciador de pacotes:** npm

## Comandos Úteis

```bash
npm run dev        # dev server em localhost:5173/
npm run build      # tsc -b && vite build
npm run preview    # pré-visualizar build
node scripts/fetch-games.mjs  # buscar dados do SofaScore localmente
```

## Arquitetura de Dados

### Produção (estática)
1. GitHub Actions roda `scripts/fetch-games.mjs` a cada hora
2. Script busca dados do SofaScore: 30 dias passados + 60 dias futuros
3. Salva em `public/data/games-YYYY-MM.json` (um arquivo por mês)
4. Baixa logos dos times em `public/logos/{teamId}.png`
5. Deploy: `npm run build` → GitHub Pages

### Desenvolvimento
- `src/lib/sofascore/client.ts` busca dia a dia via proxy Vite (`/sofascore → https://www.sofascore.com`)
- Sem necessidade de variável de ambiente para rodar localmente

### Fluxo de dados
```
GitHub Actions → SofaScore API → public/data/*.json
                                         ↓
                               fetchEventsForMonth()
                                         ↓
                               transformSofaEvent()
                                         ↓
                               sessionStorage cache (1h TTL)
                                         ↓
                               filteredGames (client-side, zero requests)
```

## Regra de Cache (sessionStorage)

**Arquivo:** `src/lib/cache/session-cache.ts`

```ts
const CACHE_VERSION = 'av3' // ← bumpar quando dados mudarem estrutura
```

### Quando bumpar o CACHE_VERSION:
- Adicionou novas ligas ao app (usuários com cache antigo não veriam os novos jogos)
- Mudou o formato/estrutura dos dados do JSON
- Corrigiu dados errados que estão cacheados na sessão dos usuários

### Quando NÃO bumpar:
- Mudanças visuais (CSS, layout, cores)
- Refatorações que não afetam estrutura de dados
- Novos componentes React que não mudam os dados de jogos

TTL atual: 1 hora para jogos (`sofagames`), 24 horas para ligas (`leagues`).

## Ligas Rastreadas

**Arquivo principal:** `src/lib/utils/leagues.ts`
**IDs espelhados em:** `scripts/fetch-games.mjs` (TRACKED_IDS — manter sincronizado!)

| Constante | ID SofaScore | Competição | Categoria | Meses |
|---|---|---|---|---|
| SUPERLIGA_M | 1452 | Superliga Masc. | superliga-m | out–mai |
| SUPERLIGA_F | 1468 | Superliga Femn. | superliga-f | out–mai |
| COPA_BRASIL_M | 16600 | Copa do Brasil Masc. | nacional | jan–mar |
| COPA_BRASIL_F | 21916 | Copa do Brasil Femn. | nacional | jan–fev |
| CAMPEONATO_MINEIRO_M | 23389 | Campeonato Mineiro Masc. | estadual | set–nov |
| CAMPEONATO_MINEIRO_F | 29828 | Campeonato Mineiro Femn. | estadual | set–nov |
| VNL_M | 11093 | Liga das Nações Masc. | internacional | jun–ago |
| VNL_F | 11094 | Liga das Nações Femn. | internacional | jun–ago |
| WORLD_CHAMPIONSHIP_M | 33 | Campeonato Mundial Masc. | internacional | a cada 4 anos |
| WORLD_CHAMPIONSHIP_F | 34 | Campeonato Mundial Femn. | internacional | a cada 4 anos |
| PAN_AMERICAN_CUP_M | 327 | Copa Pan-Americana Masc. | internacional | jun–jul |
| PAN_AMERICAN_CUP_F | 328 | Copa Pan-Americana Femn. | internacional | jun–jul |
| OLYMPIC_GAMES_M | 41 | Jogos Olímpicos Masc. | internacional | a cada 4 anos |
| OLYMPIC_GAMES_F | 42 | Jogos Olímpicos Femn. | internacional | a cada 4 anos |
| CLUB_WORLD_M | 307 | Mundial de Clubes Masc. | internacional | nov–dez |
| CLUB_WORLD_F | 308 | Mundial de Clubes Femn. | internacional | nov–dez |

### Para adicionar uma nova liga:
1. Descobrir o `uniqueTournament.id` no SofaScore (buscar em `https://www.sofascore.com/api/v1/category/373/unique-tournaments` para ligas brasileiras)
2. Adicionar em `SOFA_IDS` e `SOFA_TOURNAMENT_CONFIG` em `src/lib/utils/leagues.ts`
3. Adicionar o mesmo ID em `TRACKED_IDS` em `scripts/fetch-games.mjs`
4. Se for torneio de seleções nacionais (não clubes), adicionar em `NATIONAL_TEAM_TOURNAMENT_IDS`
5. Bumpar `CACHE_VERSION` em `src/lib/cache/session-cache.ts`
6. Rodar `node scripts/fetch-games.mjs` para buscar os dados imediatamente
7. Commitar `src/`, `scripts/`, `public/data/`, `public/logos/`

## Variáveis de Ambiente

- `import.meta.env.BASE_URL` → `/` (dev) ou `/agendaVolei/` (prod) — usar para caminhos de assets
- `VITE_PROXY_URL` — secret opcional no GitHub Actions, não obrigatório
- `VITE_API_SPORTS_KEY` — chave da API-Sports, atualmente não usada no app

## Assets Estáticos

- `public/volleyballIcon.png` — ícone do app (512×512)
- `public/data/games-YYYY-MM.json` — dados dos jogos por mês
- `public/logos/{teamId}.png` — logos dos times (baixados pelo script)
- `public/clear-sw.html` — página de emergência para limpar Service Worker corrompido

## Paths Importantes

| Arquivo | Função |
|---|---|
| `src/lib/utils/leagues.ts` | IDs das ligas + config visual + meses de temporada |
| `src/lib/sofascore/client.ts` | Fetch de dados (dev: proxy, prod: JSON estático) |
| `src/lib/sofascore/transforms.ts` | SofaEvent → Match |
| `src/lib/cache/session-cache.ts` | Cache sessionStorage com TTL |
| `src/hooks/useGames.ts` | Orquestra fetch + cache + filtro |
| `src/contexts/CalendarContext.tsx` | Estado global (mês, dia, liga selecionada) |
| `scripts/fetch-games.mjs` | Script GitHub Actions de busca de dados |
| `.github/workflows/fetch-data.yml` | Cron hourly de busca |
| `.github/workflows/deploy.yml` | Deploy para GitHub Pages |

## Design Visual

- Fundo: areia `#F5E6C8`
- Header/primário: azul marinho `#1A3A5C`
- Superliga Masc: `#1A3A5C` (navy)
- Superliga Femn: `#8B1A6B` (magenta)
- Nacional: `#1A6B1A` (verde)
- Internacional: `#B8860B` (dourado)
- Estadual: `#6B3A1A` (marrom)

## PWA / Service Worker

O app é uma PWA instalável. Configurado em `vite.config.ts` via `VitePWA`:
- `registerType: 'autoUpdate'` — atualiza SW automaticamente
- `cleanupOutdatedCaches: true` — remove caches antigos
- HTML **não** é cacheado pelo Workbox (evita loop de cache corrompido)
- Em emergência (tela branca no mobile): acessar `/agendaVolei/clear-sw.html`

## Observações

- O SofaScore pode bloquear IPs do GitHub Actions. O script tem proteção anti-wipe: se >50% dos dias retornar erro, ele não sobrescreve o arquivo existente.
- Logos de times são baixadas server-side pelo script e servidas localmente (sem CORS).
- Filtro de liga é 100% client-side (zero requests adicionais ao trocar competição).
- Categorias `estadual` e `internacional` existem no código mas com poucos jogos ativos no momento.
