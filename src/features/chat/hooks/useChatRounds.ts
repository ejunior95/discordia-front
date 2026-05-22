import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { askToAll, askToOne, voteOnRound } from '@/services/main.service';
import { ROUNDS_STORAGE_KEY } from '../chat.constants';
import { AGENTS, type AgentIA, type AIResponse, type Round } from '../types';

function createInitialResponses(): Record<AgentIA, AIResponse> {
  return AGENTS.reduce((acc, agent) => {
    acc[agent] = { agent, status: 'loading' };
    return acc;
  }, {} as Record<AgentIA, AIResponse>);
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function loadRoundsFromStorage(): Round[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ROUNDS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Round[];
    // garantir que cards "loading" salvos viram erro ao reabrir (não vamos reiniciar request)
    return parsed.map((r) => ({
      ...r,
      responses: AGENTS.reduce((acc, agent) => {
        const existing = r.responses?.[agent];
        if (existing?.status === 'loading') {
          acc[agent] = { ...existing, status: 'error', error: 'Sessão encerrada antes da resposta.' };
        } else {
          acc[agent] = existing ?? { agent, status: 'error', error: 'Resposta não encontrada' };
        }
        return acc;
      }, {} as Record<AgentIA, AIResponse>),
    }));
  } catch {
    return [];
  }
}

export function useChatRounds() {
  const [rounds, setRounds] = useState<Round[]>(() => loadRoundsFromStorage());
  const [isAsking, setIsAsking] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // persistência
  useEffect(() => {
    try {
      localStorage.setItem(ROUNDS_STORAGE_KEY, JSON.stringify(rounds));
    } catch {
      /* ignore quota */
    }
  }, [rounds]);

  // cleanup no unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const updateRound = useCallback((id: string, updater: (r: Round) => Round) => {
    setRounds((prev) => prev.map((r) => (r.id === id ? updater(r) : r)));
  }, []);

  const ask = useCallback(async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || isAsking) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const newRound: Round = {
      id: generateId(),
      question: trimmed,
      askedAt: new Date().toISOString(),
      responses: createInitialResponses(),
    };

    setRounds((prev) => [...prev, newRound]);
    setIsAsking(true);

    try {
      const response = await askToAll(trimmed, controller.signal);
      const data = response?.data;
      if (!data) throw new Error('Resposta vazia da API');

      updateRound(newRound.id, (r) => ({
        ...r,
        roundId: data.roundId,
        responses: AGENTS.reduce((acc, agent) => {
          const msg = data.responses?.[agent]?.response;
          acc[agent] = msg
            ? { agent, status: 'success', message: msg }
            : { agent, status: 'error', error: 'Sem resposta' };
          return acc;
        }, {} as Record<AgentIA, AIResponse>),
      }));
    } catch (err) {
      const isCanceled = axios.isCancel(err) || (err instanceof Error && err.name === 'CanceledError');
      const errorMsg = isCanceled
        ? 'Cancelado pelo usuário'
        : (err as { response?: { data?: { message?: string } } })?.response?.data?.message
          ?? 'Falha ao consultar IAs';

      updateRound(newRound.id, (r) => ({
        ...r,
        responses: AGENTS.reduce((acc, agent) => {
          acc[agent] = { agent, status: 'error', error: errorMsg };
          return acc;
        }, {} as Record<AgentIA, AIResponse>),
      }));
    } finally {
      setIsAsking(false);
      abortRef.current = null;
    }
  }, [isAsking, updateRound]);

  const retry = useCallback(async (roundId: string, agent: AgentIA) => {
    const round = rounds.find((r) => r.id === roundId);
    if (!round) return;

    updateRound(roundId, (r) => ({
      ...r,
      responses: { ...r.responses, [agent]: { ...r.responses[agent], status: 'loading', error: undefined } },
    }));

    try {
      const response = await askToOne(round.question, agent);
      const msg = response?.data?.response;
      if (!msg) throw new Error('Sem resposta');

      updateRound(roundId, (r) => ({
        ...r,
        responses: {
          ...r.responses,
          [agent]: { agent, status: 'success', message: msg },
        },
      }));
    } catch (err) {
      const errorMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? 'Falha ao consultar IA';
      updateRound(roundId, (r) => ({
        ...r,
        responses: {
          ...r.responses,
          [agent]: { ...r.responses[agent], status: 'error', error: errorMsg },
        },
      }));
    }
  }, [rounds, updateRound]);

  const vote = useCallback(async (roundId: string, agent: AgentIA) => {
    const round = rounds.find((r) => r.id === roundId);
    if (!round || round.votedAgent || !round.roundId) return;

    // optimistic
    setRounds((prev) => prev.map((r) =>
      r.id === roundId ? { ...r, votedAgent: agent, winner: agent } : r,
    ));

    try {
      await voteOnRound(round.roundId, agent);
    } catch (err) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 409) {
        // alguém já votou: mantém o estado local apenas se 409 indica voto duplicado
        return;
      }
      // reverte
      setRounds((prev) => prev.map((r) =>
        r.id === roundId ? { ...r, votedAgent: undefined, winner: undefined } : r,
      ));
    }
  }, [rounds]);

  const abort = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const clear = useCallback(() => {
    abortRef.current?.abort();
    setRounds([]);
  }, []);

  return { rounds, isAsking, ask, retry, vote, abort, clear };
}
