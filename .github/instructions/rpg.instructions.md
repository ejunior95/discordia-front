---
description: "Use when mexer na feature de RPG no frontend: setup, mesa, hook useRpgCampaign, turnos master/jogador, áudio do mestre/personagem, persistência da campanha e sincronização de status."
applyTo: "discordia-front/src/features/rpg/**,discordia-front/src/pages/RolePlaying.tsx,discordia-front/src/services/main.service.ts"
---

# RPG (frontend)

Complementa `copilot-instructions.md`. Foco no hook `useRpgCampaign` e na interação com TTS/áudio.

## Estado e persistência

- Storage key: `RPG_STORAGE_KEY = 'discordia-rpg-campaign'`. Não compartilhe com outras features.
- Ao restaurar do storage, `sanitizeLoaded` converte qualquer turno em `status: 'loading'` para `'error'` — nunca retome request abandonada.
- `RpgCampaign` é fonte da verdade: `id`, `scenario`, `customPrompt`, `master`, `players`, `turnOrder`, `currentTurnIndex`, `characters`, `turns`, `status`.

## Setup

- `start({ scenario, customPrompt, master, aiPlayers, userCharacter })`:
  - Se `scenario === 'custom'`, valide `customPrompt` via `validateContent(customPrompt, 'rpg-campaign-theme', signal)` antes de criar a campanha.
  - Atribua `characters` iniciais e `turnOrder` aqui; backend não recalcula nada disso.

## Turno de IA

`generateAITurn(actor)`:

1. Aborta turno anterior (`AbortController`).
2. Se jogador IA (não mestre), role automaticamente `d20 + modificador` do atributo principal e injete em `payload.campaign` (`roll`).
3. Chama `askGameAction('rpg', actor, { campaign }, signal)`.
4. Resposta normalizada: `{ response, audio_url?, voice_id? }`.
5. Atualize o turno com `content`, `audioUrl`, `voiceId`, e aplique `parseHpTags(response, characters)` quando o ator é mestre.
6. Se `voice_id` chegou e o personagem ainda não tinha, persista em `characters[actor].voiceId` — coerência vocal nos próximos turnos.

## Turno do usuário

`submitUserTurn(content, roll?)`:

- Valida com `validateContent(trimmed, target)`:
  - mestre humano → `rpg-master-narration`;
  - jogador humano → `rpg-player-action`.
- Cria turno local imediato (sem chamada à IA), avança `turnOrder`.
- Mestre humano: também roda `parseHpTags` para refletir HP no estado.

## Áudio

- Renderize `<AudioPlayer audioUrl={turn.audioUrl} />` **apenas** quando `turn.audioUrl` existir.
- Falha de TTS → turno com `status: 'error'`. A UI deve permitir retry sem resetar a campanha.
- Não baixe nem cacheie o áudio localmente além do que o `<audio>` faz por padrão.

## Status da campanha

- `pause()` / `resume()` chamam `syncGameStatus('rpg', campaign.id, 'paused' | 'playing')` (`POST /stats/game-status`).
- Só sincronize em transições de estado relevantes (pause/resume/finish). Não chame em cada turno.
- Estado local não depende da resposta — trate falha de sincronização silenciosamente (já faz `.catch(() => undefined)`).

## Abort e ciclos de vida

- `generateAITurn` é cancelável; `submitUserTurn` é local e não.
- Ao desmontar a página ou resetar a campanha, aborte o controller atual e remova o storage.
- Não duplique controllers — use o `abortRef` do hook.

## Capability e rota

- `/rpg` está atrás de `FeatureGate` com capability `audio` (TTS é parte do produto). Não relaxe localmente.
- `CurrentIAContext` não é usado em RPG; campanha define os atores via `master`/`players`.

## Erros comuns

- Reiniciar requests `loading` após reload (deixe `sanitizeLoaded` virar `error`).
- Esquecer de persistir `voice_id` no `character` → cada turno gera voz nova, perde coerência.
- Renderizar `<AudioPlayer />` com URL `undefined`.
- Chamar `syncGameStatus` dentro de `generateAITurn` (poluiu o feed de status e ofusca o real motivo da mudança).
- Aplicar `parseHpTags` em turno de jogador (só mestre altera HP).
