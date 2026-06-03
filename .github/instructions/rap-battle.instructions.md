---
description: "Use when mexer na feature de batalha de rima: setup, arena, hook useRapBattle, polling de música, persistência em localStorage, voto e retomada de batalha."
applyTo: "discordia-front/src/features/rap-battle/**,discordia-front/src/services/audio.service.ts,discordia-front/src/pages/RapBattle.tsx"
---

# Rap Battle (frontend)

Complementa `copilot-instructions.md`. Foco no hook `useRapBattle` e no fluxo de áudio.

## Fluxo de um verso

1. Chama `askGameAction('rap-battle', agent, payload, signal?)` com payload contendo `battleId`, `agent`, `opponent`, `theme`, `roundIndex` e versos anteriores quando aplicável.
2. Resposta normaliza `{ response, audio: { musicTaskId?, musicStatus, musicError?, creditsCharged? } }`.
3. Se `audio.musicTaskId` existir, chama `startMusicPolling(roundIndex, agent, taskId)` que usa `pollRapMusic` (`src/services/audio.service.ts`).
4. UI mostra estado `loading | success | error` do verso e `pending | ready | failed` da música independentemente.

## Persistência

- Storage key única: `RAP_BATTLE_STORAGE_KEY = 'discordia-rap-battle'`.
- Ao restaurar do storage, sanitize estados: versos com `status: 'loading'` devem virar `error` (não retomar request abandonada).
- `musicTaskId` salvo deve disparar `startMusicPolling` ao montar — a tarefa Sunor continua viva no backend mesmo se o usuário recarregar.
- Não salve áudios (URL/blob) localmente além do que já é retornado pelo backend.

## Voto

- Voto usa `voteOnRound(roundId, agent)` (mesmo endpoint do chat). Não existe endpoint específico de rap-battle.
- O `roundId` vem da resposta de `askGameAction`. Persista-o por verso para permitir voto após reload.

## Aborto

- Sempre passe `AbortSignal` para `askGameAction` e abrte requests superados (troca de round, reset de batalha).
- Polling deve ser parado via função retornada por `pollRapMusic` quando o componente desmonta ou a batalha é resetada.

## Limites e UX

- `TOTAL_ROUNDS` em `rap.constants.ts` controla rounds por batalha; não hard-code o número fora dessa constante.
- Música é cobrada pelo backend (`MUSIC_GEN`). Mostre erro de crédito (`402 INSUFFICIENT_CREDITS`) com o toast padrão do Axios — não duplique tratamento.
- `FeatureGate` da rota `/rap-battle` exige capability `games`. Não relaxe localmente.

## Erros comuns

- Recomeçar versos `loading` ao montar a partir do storage.
- Esquecer `battleId` no payload — quebra a contagem de batalhas em `/stats/home`.
- Acoplar UI da música ao estado do verso (se música falhar, o verso continua válido para voto).
- Criar novo Axios para chamar `pollAndFinalize` — use `audio.service.ts`.
