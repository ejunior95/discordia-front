import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { askGameAction } from '@/services/main.service';
import type { AgentIA } from '@/features/chat/types';
import {
  RPG_STORAGE_KEY,
  generateCharacter,
  makeTurn,
} from '../rpg.constants';
import type { ActorRef, Character, RpgCampaign, Scenario, TurnAction } from '../types';

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
  // turns deixados em loading viram error ao recarregar
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
    const raw = sessionStorage.getItem(RPG_STORAGE_KEY);
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

function buildCharacters(turnOrder: ActorRef[], master: ActorRef, scenario: Scenario): Character[] {
  // todos os participantes (incluindo o mestre se ele jogar como NPC? não — mestre não tem ficha)
  return turnOrder
    .filter((actor) => actor !== master)
    .map((actor) => generateCharacter(actor, scenario));
}

export function useRpgCampaign() {
  const [campaign, setCampaign] = useState<RpgCampaign | null>(() => loadFromStorage());
  const [isGenerating, setIsGenerating] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    try {
      if (campaign) {
        sessionStorage.setItem(RPG_STORAGE_KEY, JSON.stringify(campaign));
      } else {
        sessionStorage.removeItem(RPG_STORAGE_KEY);
      }
    } catch {
      /* ignore quota */
    }
  }, [campaign]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const start = useCallback(({ scenario, customPrompt, master, aiPlayers }: RpgSetupParams) => {
    abortRef.current?.abort();
    const { players, turnOrder } = buildTurnOrder(master, aiPlayers);
    const characters = buildCharacters(turnOrder, master, scenario);
    const fresh: RpgCampaign = {
      id: (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
        ? crypto.randomUUID()
        : `${Date.now()}`,
      scenario,
      customPrompt: customPrompt?.trim() || undefined,
      master,
      players,
      turnOrder,
      currentTurnIndex: 0, // começa com o mestre
      characters,
      turns: [],
      status: 'playing',
      createdAt: new Date().toISOString(),
    };
    setCampaign(fresh);
  }, []);

  const advanceTurn = useCallback((current: RpgCampaign): RpgCampaign => {
    const nextIndex = (current.currentTurnIndex + 1) % current.turnOrder.length;
    return { ...current, currentTurnIndex: nextIndex };
  }, []);

  const submitUserTurn = useCallback((content: string) => {
    const trimmed = content.trim();
    if (!trimmed) return;
    setCampaign((current) => {
      if (!current || current.status !== 'playing') return current;
      const actor = current.turnOrder[current.currentTurnIndex];
      if (actor !== 'user') return current;
      const role: TurnAction['role'] = current.master === 'user' ? 'master' : 'player';
      const turn = makeTurn('user', role, trimmed, 'success');
      return advanceTurn({ ...current, turns: [...current.turns, turn] });
    });
  }, [advanceTurn]);

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

    // adiciona turno em loading
    const loadingTurn = makeTurn(actor, role, '', 'loading');
    setCampaign((current) => {
      if (!current) return current;
      return { ...current, turns: [...current.turns, loadingTurn] };
    });

    try {
      const response = await askGameAction(
        'rpg',
        actor as AgentIA,
        { campaign: campaign as unknown as Record<string, unknown> },
        controller.signal,
      );
      const msg = response?.data?.response?.trim();
      if (!msg) throw new Error('Sem resposta');
      const audioUrl = response?.data?.audio_url;

      setCampaign((current) => {
        if (!current) return current;
        const turns = current.turns.map((t) =>
          t.id === loadingTurn.id
            ? { ...t, status: 'success' as const, content: msg, audioUrl }
            : t,
        );
        return advanceTurn({ ...current, turns });
      });
    } catch (err) {
      const errorMsg = extractErrorMessage(err);
      setCampaign((current) => {
        if (!current) return current;
        const turns = current.turns.map((t) =>
          t.id === loadingTurn.id ? { ...t, status: 'error' as const, error: errorMsg } : t,
        );
        // não avança o turno em erro — usuário pode tentar de novo
        return { ...current, turns };
      });
    } finally {
      setIsGenerating(false);
      abortRef.current = null;
    }
  }, [campaign, isGenerating, advanceTurn]);

  const retryLastTurn = useCallback(async () => {
    if (!campaign) return;
    // remove o último turno com erro e re-dispara
    setCampaign((current) => {
      if (!current) return current;
      const last = current.turns[current.turns.length - 1];
      if (!last || last.status !== 'error') return current;
      return { ...current, turns: current.turns.slice(0, -1) };
    });
    // dispara de novo no próximo tick
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
    setCampaign((current) => (current ? { ...current, status: 'paused' } : current));
  }, []);

  const resume = useCallback(() => {
    setCampaign((current) => (current ? { ...current, status: 'playing' } : current));
  }, []);

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
