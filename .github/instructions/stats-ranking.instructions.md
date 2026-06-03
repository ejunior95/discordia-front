---
description: "Use when mexer na home dashboard, leaderboard das IAs, IA da semana, gráfico de performance, atividade recente ou no service stats do frontend."
applyTo: "discordia-front/src/features/home/**,discordia-front/src/services/stats.service.ts,discordia-front/src/pages/Home.tsx"
---

# Stats e Ranking (frontend)

Complementa `copilot-instructions.md`. Foco no consumo de `GET /stats/home` e nos componentes da home.

## Fonte de dados

- `useHomeSnapshot(scope)` em `src/features/home/hooks/useHomeSnapshot.ts` chama `getHomeSnapshot(scope)` (`GET /stats/home?scope=user|global`).
- O switch `Globais / Minhas` em `pages/Home.tsx` só troca o `scope`; toda a UI consome a mesma forma `HomeSnapshot`.
- Não chame `stats/me` na home; ele é específico do perfil/account.

## O que o ranking exibe hoje

`LeaderboardCard` ordena por `wins` desc e mostra, por IA:

- posição (medalha para top 3);
- ícone + label do agente (`IA_CONFIG`);
- `wins` absolutos;
- barra proporcional ao maior `wins` da lista;
- `wins/rounds` em %;
- total de `rounds`;
- chama de streak quando `streak >= 3`.

`votes` e `lastWinAt` existem em `LeaderboardEntry` mas não são exibidos. Se for usar, lembre que vêm do backend já calculados (não recalcule no front).

## Contrato

`HomeSnapshot` deve refletir 1:1 o retorno do backend. Antes de alterar campos:

1. Atualize `discordia/src/modules/stats/stats.service.ts` (`getHomeSnapshot` + `recompute`).
2. Atualize `home.types.ts` e os componentes que consomem o campo.
3. Rode lint nos dois projetos.

## Regras de leitura

- Vitória só existe quando o backend marca `winner_agent` + `voted_at` no round. Não estime vitória pelo `RecentActivityItem.winner` ausente — `null` significa "round sem voto".
- `rapBattles` e `rpgCampaigns` em `totals` são contagens por **partida/campanha** (`game_id`), não por turno. Não multiplique por `roundIndex`.
- `miniGames` em `totals` é contagem por round/ação dos contextos `chess` / `jokenpo` / `hangman-*`.
- `iaOfWeek` usa janela móvel de 7 dias e pode ser `null` quando não houve voto no período — sempre trate o estado vazio (`IAOfTheWeekCard` já faz isso).

## Erros comuns

- Calcular winRate no front a partir de `votes` em vez de `wins` (`votes` pode divergir em snapshots antigos).
- Renderizar leaderboard antes de checar `data` — usar Loader/error states que já existem em `Home.tsx`.
- Persistir snapshot em `localStorage` (não é cacheável — invalida a cada voto/jogo).
