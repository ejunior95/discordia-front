import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { askGameAction, OrchestratorTargetKind, syncGameStatus, validateOrchestratorInput } from '@/services/main.service';
import type { AgentIA } from '@/features/chat/types';
import {
  RPG_STORAGE_KEY,
  generateCharacter,
  getClassPrimaryAttribute,
  attributeModifier,
  makeTurn,
  parseHpTags,
  rollWithModifier,
} from '../rpg.constants';
import type { ActorRef, Character, DiceRoll, RpgCampaign, Scenario, TurnAction } from '../types';

function extractErrorMessage(err: unknown): string {
  if (axios.isCancel(err) || (err instanceof Error && err.name === 'CanceledError')) {
    return 'Cancelado pelo usuário';
  }
  return (
    (err as { response?: { data?: { message?: string } } })?.response?.data?.message
    ?? (err instanceof Error ? err.message : 'Falha ao gerar resposta')
  );
}

function sanitizeLoaded(campaign: RpgCampaign | null): RpgCampaign | null {
  if (!campaign) return null;
  const turns = campaign.turns.map<TurnAction>((t) =>
    t.status === 'loading'
      ? { ...t, status: 'error', error: 'Sessão encerrada antes da resposta.' }
      : t,
  );
  return { ...campaign, turns };
}

function loadFromStorage(): RpgCampaign | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(RPG_STORAGE_KEY);
    if (!raw) return null;
    return sanitizeLoaded(JSON.parse(raw) as RpgCampaign);
  } catch {
    return null;
  }
}

export interface RpgSetupParams {
  scenario: Scenario;
  customPrompt?: string;
  master: ActorRef;
  aiPlayers: AgentIA[];
  /** personagem criado pelo jogador humano (quando o mestre é uma IA) */
  userCharacter?: Character;
}

function buildTurnOrder(master: ActorRef, aiPlayers: AgentIA[]): {
  players: ActorRef[];
  turnOrder: ActorRef[];
} {
  const players: ActorRef[] =
    master === 'user'
      ? [...aiPlayers]
      : (['user', ...aiPlayers] as ActorRef[]);
  const turnOrder: ActorRef[] = [master, ...players];
  return { players, turnOrder };
}

function buildCharacters(
  turnOrder: ActorRef[],
  master: ActorRef,
  scenario: Scenario,
  userCharacter?: Character,
): Character[] {
  return turnOrder
    .filter((actor) => actor !== master)
    .map((actor) =>
      actor === 'user' && userCharacter
        ? userCharacter
        : generateCharacter(actor, scenario),
    );
}

function applyHpDeltas(
  characters: Character[],
  deltas: { owner: ActorRef; delta: number }[],
): Character[] {
  if (deltas.length === 0) return characters;
  return characters.map((character) => {
    const totalDelta = deltas
      .filter((delta) => delta.owner === character.owner)
      .reduce((sum, delta) => sum + delta.delta, 0);

    if (totalDelta === 0) return character;
    return {
      ...character,
      hp: Math.max(0, Math.min(character.maxHp, character.hp + totalDelta)),
    };
  });
}

function applyCharacterVoiceId(
  characters: Character[],
  owner: ActorRef,
  voiceId?: string,
): Character[] {
  if (!voiceId) return characters;
  return characters.map((character) =>
    character.owner === owner ? { ...character, voiceId } : character,
  );
}

export function useRpgCampaign() {
  const [campaign, setCampaign] = useState<RpgCampaign | null>(() => loadFromStorage());
  const [isGenerating, setIsGenerating] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    try {
      if (campaign) {
        localStorage.setItem(RPG_STORAGE_KEY, JSON.stringify(campaign));
      } else {
        localStorage.removeItem(RPG_STORAGE_KEY);
      }
    } catch {
      /* ignore quota */
    }
  }, [campaign]);

  useEffect(() => () => abortRef.current?.abort(), []);

  // Função interna de validação — não exportada
  const validateContent = useCallback(
    async (content: string, target: OrchestratorTargetKind, signal?: AbortSignal): Promise<void> => {
      try {
        await validateOrchestratorInput(target, content, undefined, signal);
      } catch (err) {
        if (axios.isCancel(err)) throw err;
        throw new Error(
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message
          ?? (err instanceof Error ? err.message : 'Conteúdo inadequado para o contexto atual.'),
        );
      }
    },
    [],
  );

  const start = useCallback(
    async ({ scenario, customPrompt, master, aiPlayers, userCharacter }: RpgSetupParams): Promise<void> => {
      if (customPrompt) {
        setIsGenerating(true);
        const controller = new AbortController();
        abortRef.current = controller;
        try {
          await validateContent(customPrompt, 'rpg-campaign-theme', controller.signal);
        } catch (err) {
          setIsGenerating(false);
          abortRef.current = null;
          if (axios.isCancel(err)) return;
          throw err;
        }
        setIsGenerating(false);
        abortRef.current = null;
      }

      const { players, turnOrder } = buildTurnOrder(master, aiPlayers);
      const characters = buildCharacters(turnOrder, master, scenario, userCharacter);
      const fresh: RpgCampaign = {
        id: (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
          ? crypto.randomUUID()
          : `${Date.now()}`,
        scenario,
        customPrompt: customPrompt?.trim() || undefined,
        master,
        players,
        turnOrder,
        currentTurnIndex: 0,
        characters,
        turns: [],
        status: 'playing',
        createdAt: new Date().toISOString(),
      };
      setCampaign(fresh);
    },
    [validateContent],
  );

  const advanceTurn = useCallback((current: RpgCampaign): RpgCampaign => {
    const nextIndex = (current.currentTurnIndex + 1) % current.turnOrder.length;
    return { ...current, currentTurnIndex: nextIndex };
  }, []);

  /**
   * Valida e submete o turno do usuário.
   * Lança erro se a validação falhar — o componente (ActionBar) deve capturar e exibir.
   */
  const submitUserTurn = useCallback(async (content: string, roll?: DiceRoll): Promise<void> => {
    const trimmed = content.trim();
    if (!trimmed) return;
    if (!campaign || campaign.status !== 'playing') return;

    const actor = campaign.turnOrder[campaign.currentTurnIndex];
    if (actor !== 'user') return;

    const isMaster = campaign.master === 'user';
    const target: OrchestratorTargetKind = isMaster ? 'rpg-master-narration' : 'rpg-player-action';

    setIsGenerating(true);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      await validateContent(trimmed, target, controller.signal);

      const role: TurnAction['role'] = isMaster ? 'master' : 'player';
      setCampaign((current) => {
        if (!current || current.status !== 'playing') return current;
        const parsedHp = role === 'master'
          ? parseHpTags(trimmed, current.characters)
          : { stripped: trimmed, deltas: [] };
        const turn = makeTurn('user', role, parsedHp.stripped, 'success');
        const turnWithRoll: TurnAction = roll ? { ...turn, roll } : turn;
        const turnWithHp: TurnAction = parsedHp.deltas.length > 0
          ? { ...turnWithRoll, hpDeltas: parsedHp.deltas }
          : turnWithRoll;
        return advanceTurn({
          ...current,
          characters: applyHpDeltas(current.characters, parsedHp.deltas),
          turns: [...current.turns, turnWithHp],
        });
      });
    } catch (err) {
      if (axios.isCancel(err)) return;
      throw err; // relança para o ActionBar exibir o erro
    } finally {
      setIsGenerating(false);
      abortRef.current = null;
    }
  }, [campaign, validateContent, advanceTurn]);

  const generateAITurn = useCallback(async () => {
    if (isGenerating) return;
    if (!campaign || campaign.status !== 'playing') return;

    const actor = campaign.turnOrder[campaign.currentTurnIndex];
    if (actor === 'user') return;

    const isMasterTurn = actor === campaign.master;
    const role: TurnAction['role'] = isMasterTurn ? 'master' : 'player';

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setIsGenerating(true);

    // jogadores IA rolam automaticamente um d20 + modificador do atributo principal
    let pendingRoll: DiceRoll | undefined;
    if (!isMasterTurn) {
      const character = campaign.characters.find((c) => c.owner === actor);
      if (character) {
        const attrKey = getClassPrimaryAttribute(character.classe);
        const mod = attributeModifier(character.attributes[attrKey]);
        pendingRoll = rollWithModifier('d20', mod, attrKey.toUpperCase());
      }
    }

    const loadingTurn = makeTurn(actor, role, '', 'loading');
    setCampaign((current) => {
      if (!current) return current;
      return { ...current, turns: [...current.turns, loadingTurn] };
    });

    try {
      const requestCampaign = pendingRoll
        ? { ...campaign, pendingRoll }
        : campaign;
      const response = await askGameAction(
        'rpg',
        actor as AgentIA,
        { campaign: requestCampaign as unknown as Record<string, unknown> },
        controller.signal,
      );
      const msg = response?.data?.response?.trim();
      if (!msg) throw new Error('Sem resposta');
      const audioUrl = response?.data?.audio_url;
      const voiceId = response?.data?.voice_id;

      setCampaign((current) => {
        if (!current) return current;
        const parsedHp = isMasterTurn
          ? parseHpTags(msg, current.characters)
          : { stripped: msg, deltas: [] };
        const turns = current.turns.map((t) =>
          t.id === loadingTurn.id
            ? {
                ...t,
                status: 'success' as const,
                content: parsedHp.stripped,
                audioUrl,
                ...(pendingRoll ? { roll: pendingRoll } : {}),
                ...(parsedHp.deltas.length > 0 ? { hpDeltas: parsedHp.deltas } : {}),
              }
            : t,
        );
        const charactersWithHp = applyHpDeltas(
          current.characters,
          parsedHp.deltas,
        );
        return advanceTurn({
          ...current,
          characters: applyCharacterVoiceId(charactersWithHp, actor, voiceId),
          turns,
        });
      });
    } catch (err) {
      const errorMsg = extractErrorMessage(err);
      setCampaign((current) => {
        if (!current) return current;
        const turns = current.turns.map((t) =>
          t.id === loadingTurn.id ? { ...t, status: 'error' as const, error: errorMsg } : t,
        );
        return { ...current, turns };
      });
    } finally {
      setIsGenerating(false);
      abortRef.current = null;
    }
  }, [campaign, isGenerating, advanceTurn]);

  const retryLastTurn = useCallback(async () => {
    if (!campaign) return;
    setCampaign((current) => {
      if (!current) return current;
      const last = current.turns[current.turns.length - 1];
      if (!last || last.status !== 'error') return current;
      return { ...current, turns: current.turns.slice(0, -1) };
    });
    setTimeout(() => {
      void generateAITurn();
    }, 0);
  }, [campaign, generateAITurn]);

  const skipTurn = useCallback(() => {
    setCampaign((current) => {
      if (!current || current.status !== 'playing') return current;
      return advanceTurn(current);
    });
  }, [advanceTurn]);

  const pause = useCallback(() => {
    abortRef.current?.abort();
    if (campaign) void syncGameStatus('rpg', campaign.id, 'paused').catch(() => undefined);
    setCampaign((current) => (current ? { ...current, status: 'paused' } : current));
  }, [campaign]);

  const resume = useCallback(() => {
    if (campaign) void syncGameStatus('rpg', campaign.id, 'playing').catch(() => undefined);
    setCampaign((current) => (current ? { ...current, status: 'playing' } : current));
  }, [campaign]);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setCampaign(null);
  }, []);

  const abort = useCallback(() => {
    abortRef.current?.abort();
    setIsGenerating(false);
  }, []);

  const currentActor: ActorRef | null = campaign
    ? campaign.turnOrder[campaign.currentTurnIndex]
    : null;

  return {
    campaign,
    isGenerating,
    currentActor,
    start,
    submitUserTurn,
    generateAITurn,
    retryLastTurn,
    skipTurn,
    pause,
    resume,
    reset,
    abort,
  };
}