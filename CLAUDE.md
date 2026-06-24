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
1. Workflow `fetch-data.yml` roda manualmente via GitHub Actions (`workflow_dispatch`)
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

## SofaScore API — Notas Importantes

### Endpoint correto (por torneio)
O endpoint global `/api/v1/sport/volleyball/scheduled-events/{date}` retorna **403**. Usar o endpoint por torneio:

```
GET https://www.sofascore.com/api/v1/unique-tournament/{id}/scheduled-events/{date}
```

**Header obrigatório:** `x-requested-with: 1fcf55` (token embutido no JS do SofaScore — se começar a dar 403, o token mudou e precisa ser atualizado via DevTools/Network).

### Script local bloqueado
O `fetch-games.mjs` pode ser bloqueado localmente (403 em todos os dias). Nesse caso, disparar o workflow manualmente no GitHub Actions — IPs do GitHub não são bloqueados.

Para buscar dados localmente quando o script está bloqueado, usar Playwright (browser real com cookies do SofaScore):
```js
// No contexto de sofascore.com/volleyball:
fetch('/api/v1/unique-tournament/{id}/scheduled-events/{date}', {
  headers: { 'x-requested-with': '1fcf55', 'referer': 'https://www.sofascore.com/pt/volleyball' }
})
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
| WORLD_CHAMPIONSHIP_F | 32 | Campeonato Mundial Femn. | internacional | a cada 4 anos |
| PAN_AMERICAN_CUP_M | 28473 | Copa Pan-Americana Masc. | internacional | jun–jul |
| PAN_AMERICAN_CUP_F | 28378 | Copa Pan-Americana Femn. | internacional | jun–jul |
| CLUB_WORLD_M | 859 | Mundial de Clubes Masc. | internacional | nov–dez |
| CLUB_WORLD_F | 860 | Mundial de Clubes Femn. | internacional | nov–dez |
| CHAMPIONS_LEAGUE_M | 586 | Champions League Masc. | internacional | out–mai |
| CHAMPIONS_LEAGUE_F | 587 | Champions League Femn. | internacional | out–mai |
| SOUTH_AMERICAN_CLUBS_M | 21983 | Sul-Americano de Clubes Masc. | internacional | out–nov |
| SOUTH_AMERICAN_CLUBS_F | 21984 | Sul-Americano de Clubes Femn. | internacional | out–nov |

> **Olímpicos removidos:** IDs 41 e 42 eram torneios de futebol (Veikkausliiga e Regionalliga Nord). Os Olímpicos de vôlei não têm IDs fixos úteis no SofaScore fora do ciclo olímpico.

> **IDs corrigidos:** 34→32 (Mundial Femn.), 307→859 (Mundial Clubes Masc.), 308→860 (Mundial Clubes Femn.) — os IDs antigos apontavam para ligas de futebol.

### Para adicionar uma nova liga:
1. Descobrir o `uniqueTournament.id` via `https://www.sofascore.com/api/v1/search/unique-tournaments?q={nome}&sport=volleyball`
2. Confirmar que o ID é de vôlei: `GET /api/v1/unique-tournament/{id}` → verificar `category.sport.name === 'Volleyball'`
3. Adicionar em `SOFA_IDS` e `SOFA_TOURNAMENT_CONFIG` em `src/lib/utils/leagues.ts`
4. Adicionar o mesmo ID em `TRACKED_IDS` em `scripts/fetch-games.mjs`
5. Se for torneio de seleções nacionais (não clubes), adicionar em `NATIONAL_TEAM_TOURNAMENT_IDS`
6. Bumpar `CACHE_VERSION` em `src/lib/cache/session-cache.ts`
7. Rodar `node scripts/fetch-games.mjs` para buscar os dados imediatamente
8. Commitar `src/`, `scripts/`, `public/data/`, `public/logos/`

## Botão de Atualizar Dados

O header tem um botão ↻ ("Atualizar") que dispara o workflow `fetch-data.yml` via GitHub API.

**Fluxo:** clique → modal pede senha → senha correta → POST para GitHub API → workflow roda.

**Token GitHub:** `VITE_GITHUB_TOKEN` no `.env` (não commitado) + secret `VITE_GITHUB_TOKEN` no repositório GitHub para o workflow de deploy embuti-lo no bundle.

**Arquivos:**
- `src/hooks/useWorkflowDispatch.ts` — lógica da chamada à API
- `src/components/ui/RefreshButton.tsx` — UI do botão e modal

## Variáveis de Ambiente

- `import.meta.env.BASE_URL` → `/` (dev) ou `/agendaVolei/` (prod) — usar para caminhos de assets
- `VITE_GITHUB_TOKEN` — token GitHub com Actions: Write, embutido no bundle pelo Vite
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
| `src/lib/sofascore/client.ts` | Fetch de dados (dev: proxy, prod: JSON estático); 404 retorna array vazio |
| `src/lib/sofascore/transforms.ts` | SofaEvent → Match |
| `src/lib/cache/session-cache.ts` | Cache sessionStorage com TTL |
| `src/hooks/useGames.ts` | Orquestra fetch + cache + filtro |
| `src/hooks/useWorkflowDispatch.ts` | Disparo do workflow via GitHub API |
| `src/contexts/CalendarContext.tsx` | Estado global (mês, dia, liga selecionada) |
| `scripts/fetch-games.mjs` | Script GitHub Actions de busca de dados |
| `.github/workflows/fetch-data.yml` | Workflow manual de busca (workflow_dispatch) |
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

- O SofaScore bloqueia IPs locais com 403 no script. GitHub Actions funciona normalmente.
- O endpoint global de vôlei (`/sport/volleyball/scheduled-events/{date}`) está bloqueado — usar endpoint por torneio com header `x-requested-with: 1fcf55`.
- Logos de times são baixadas server-side pelo script e servidas localmente (sem CORS).
- Filtro de liga é 100% client-side (zero requests adicionais ao trocar competição).
- Fetch em produção retorna array vazio (não erro) em caso de 404 — meses sem dados mostram "sem jogos".
