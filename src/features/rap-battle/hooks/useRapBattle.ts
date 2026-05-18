import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { askGameAction, type IResponseApiOneIa } from '@/services/main.service';
import { pollRapMusic } from '@/services/audio.service';
import type { AgentIA } from '@/features/chat/types';
import type { VoiceGender } from '@/features/account/types';
import { RAP_BATTLE_STORAGE_KEY, TOTAL_ROUNDS } from '../rap.constants';
import type { RapBattle, RapRound, RapVerse } from '../types';

interface VerseResult {
  content: string;
  audio: Omit<IResponseApiOneIa, 'response'>;
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function extractErrorMessage(err: unknown): string {
  if (axios.isCancel(err) || (err instanceof Error && err.name === 'CanceledError')) {
    return 'Cancelado pelo usuário';
  }
  return (
    (err as { response?: { data?: { message?: string } } })?.response?.data?.message
    ?? (err instanceof Error ? err.message : 'Falha ao gerar verso')
  );
}

function sanitizeLoadedBattle(battle: RapBattle | null): RapBattle | null {
  if (!battle) return null;
  // turns any 'loading' verses left from a previous session into errors
  const rounds = battle.rounds.map<RapRound>((r) => {
    const verses = { ...r.verses };
    for (const key of Object.keys(verses) as AgentIA[]) {
      const v = verses[key];
      if (v?.status === 'loading') {
        verses[key] = { ...v, status: 'error', error: 'Sessão encerrada antes da resposta.' };
      }
    }
    return { ...r, verses };
  });
  // Compat: batalhas antigas no localStorage podem não ter voiceGender.
  const voiceGender: VoiceGender = battle.voiceGender ?? 'male';
  return { ...battle, voiceGender, rounds };
}

function loadFromStorage(): RapBattle | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(RAP_BATTLE_STORAGE_KEY);
    if (!raw) return null;
    return sanitizeLoadedBattle(JSON.parse(raw) as RapBattle);
  } catch {
    return null;
  }
}

function computeWinner(battle: RapBattle): AgentIA | undefined {
  const [a, b] = battle.contenders;
  let aWins = 0;
  let bWins = 0;
  for (const round of battle.rounds) {
    const aVotes = round.verses[a]?.votes ?? 0;
    const bVotes = round.verses[b]?.votes ?? 0;
    if (aVotes > bVotes) aWins += 1;
    else if (bVotes > aVotes) bWins += 1;
  }
  if (aWins === bWins) return undefined;
  return aWins > bWins ? a : b;
}

function createEmptyRound(index: 1 | 2 | 3): RapRound {
  return { index, verses: {} };
}

interface StartParams {
  contenders: [AgentIA, AgentIA];
  theme: string;
  voiceGender: VoiceGender;
}

export function useRapBattle() {
  const [battle, setBattle] = useState<RapBattle | null>(() => loadFromStorage());
  const [isGenerating, setIsGenerating] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const pollStopsRef = useRef<Map<string, () => void>>(new Map());

  useEffect(() => {
    try {
      if (battle) {
        localStorage.setItem(RAP_BATTLE_STORAGE_KEY, JSON.stringify(battle));
      } else {
        localStorage.removeItem(RAP_BATTLE_STORAGE_KEY);
      }
    } catch {
      /* ignore quota */
    }
  }, [battle]);

  useEffect(() => () => {
    abortRef.current?.abort();
    pollStopsRef.current.forEach((stop) => stop());
    pollStopsRef.current.clear();
  }, []);

  // Reativa polling de versos com áudio pendente carregados do storage
  useEffect(() => {
    if (!battle) return;
    for (const round of battle.rounds) {
      for (const agent of Object.keys(round.verses) as AgentIA[]) {
        const verse = round.verses[agent];
        if (
          verse?.audioStatus === 'pending'
          && verse.musicTaskId
          && !pollStopsRef.current.has(`${round.index}:${agent}`)
        ) {
          startMusicPolling(round.index, agent, verse.musicTaskId);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateVerseAudio = useCallback(
    (
      roundIndex: 1 | 2 | 3,
      agent: AgentIA,
      patch: Partial<Pick<RapVerse, 'audioStatus' | 'audioUrl' | 'audioError' | 'lyricsTimings' | 'karaokeStatus'>>,
    ) => {
      setBattle((current) => {
        if (!current) return current;
        return {
          ...current,
          rounds: current.rounds.map((r) => {
            if (r.index !== roundIndex) return r;
            const verse = r.verses[agent];
            if (!verse) return r;
            return {
              ...r,
              verses: { ...r.verses, [agent]: { ...verse, ...patch } },
            };
          }),
        };
      });
    },
    [],
  );

  const startMusicPolling = useCallback(
    (roundIndex: 1 | 2 | 3, agent: AgentIA, taskId: string) => {
      const key = `${roundIndex}:${agent}`;
      const existing = pollStopsRef.current.get(key);
      if (existing) existing();
      const stop = pollRapMusic(taskId, {
        onReady: ({ audioUrl, lyricsTimings, karaokeStatus }) => {
          updateVerseAudio(roundIndex, agent, {
            audioStatus: 'ready',
            audioUrl,
            lyricsTimings,
            karaokeStatus,
          });
          pollStopsRef.current.delete(key);
        },
        onError: (message) => {
          updateVerseAudio(roundIndex, agent, { audioStatus: 'failed', audioError: message });
          pollStopsRef.current.delete(key);
        },
      });
      pollStopsRef.current.set(key, stop);
    },
    [updateVerseAudio],
  );

  const start = useCallback(({ contenders, theme, voiceGender }: StartParams) => {
    abortRef.current?.abort();
    const fresh: RapBattle = {
      id: generateId(),
      contenders,
      theme,
      voiceGender,
      rounds: [createEmptyRound(1), createEmptyRound(2), createEmptyRound(3)],
      currentRound: 1,
      status: 'in-progress',
      createdAt: new Date().toISOString(),
    };
    setBattle(fresh);
  }, []);

  const generateRound = useCallback(async (targetIndex?: 1 | 2 | 3) => {
    if (isGenerating) return;
    if (!battle || battle.status === 'finished') return;

    const index = targetIndex ?? battle.currentRound;
    const round = battle.rounds.find((r) => r.index === index);
    if (!round) return;
    const [a, b] = battle.contenders;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setIsGenerating(true);

    // mark both verses as loading
    setBattle((current) => {
      if (!current) return current;
      return {
        ...current,
        currentRound: index,
        rounds: current.rounds.map((r) =>
          r.index === index
            ? {
                ...r,
                verses: {
                  [a]: { agent: a, content: '', status: 'loading', votes: r.verses[a]?.votes ?? 0 },
                  [b]: { agent: b, content: '', status: 'loading', votes: r.verses[b]?.votes ?? 0 },
                },
              }
            : r,
        ),
      };
    });

    const previousRound = battle.rounds.find((r) => r.index === ((index - 1) as 1 | 2 | 3));
    const prevA = previousRound?.verses[a]?.content;
    const prevB = previousRound?.verses[b]?.content;

    const payloadA = {
      agent: a,
      opponent: b,
      theme: battle.theme,
      roundIndex: index,
      previousOpponentVerse: prevB,
      previousOwnVerse: prevA,
      voiceGender: battle.voiceGender,
    };
    const payloadB = {
      agent: b,
      opponent: a,
      theme: battle.theme,
      roundIndex: index,
      previousOpponentVerse: prevA,
      previousOwnVerse: prevB,
      voiceGender: battle.voiceGender,
    };

    const settle = (agent: AgentIA, result: PromiseSettledResult<VerseResult>) => {
      setBattle((current) => {
        if (!current) return current;
        return {
          ...current,
          rounds: current.rounds.map((r) => {
            if (r.index !== index) return r;
            const previous = r.verses[agent];
            const updated: RapVerse =
              result.status === 'fulfilled'
                ? {
                    agent,
                    content: result.value.content,
                    status: 'success',
                    votes: previous?.votes ?? 0,
                    musicTaskId: result.value.audio.musicTaskId,
                    audioStatus:
                      result.value.audio.musicStatus === 'failed'
                        ? 'failed'
                        : result.value.audio.musicTaskId
                          ? 'pending'
                          : 'idle',
                    audioError: result.value.audio.musicError,
                  }
                : {
                    agent,
                    content: '',
                    status: 'error',
                    error: extractErrorMessage(result.reason),
                    votes: previous?.votes ?? 0,
                  };
            return { ...r, verses: { ...r.verses, [agent]: updated } };
          }),
        };
      });
      if (result.status === 'fulfilled' && result.value.audio.musicTaskId) {
        startMusicPolling(index, agent, result.value.audio.musicTaskId);
      }
    };

    const callOne = async (agent: AgentIA, payload: Record<string, unknown>): Promise<VerseResult> => {
      const response = await askGameAction('rap-battle', agent, payload, controller.signal);
      const msg = response?.data?.response;
      if (!msg) throw new Error('Sem resposta');
      const { response: _r, ...audio } = response.data;
      return { content: msg.trim(), audio };
    };

    const [resA, resB] = await Promise.allSettled([callOne(a, payloadA), callOne(b, payloadB)]);
    settle(a, resA);
    settle(b, resB);

    setIsGenerating(false);
    abortRef.current = null;
  }, [battle, isGenerating]);

  const retryVerse = useCallback(async (roundIndex: 1 | 2 | 3, agent: AgentIA) => {
    if (!battle) return;
    const round = battle.rounds.find((r) => r.index === roundIndex);
    if (!round) return;
    const [a, b] = battle.contenders;
    const opponent = agent === a ? b : a;

    const previousRound = battle.rounds.find((r) => r.index === ((roundIndex - 1) as 1 | 2 | 3));
    const prevOpponent = previousRound?.verses[opponent]?.content;
    const prevOwn = previousRound?.verses[agent]?.content;

    setBattle((current) => {
      if (!current) return current;
      return {
        ...current,
        rounds: current.rounds.map((r) =>
          r.index === roundIndex
            ? {
                ...r,
                verses: {
                  ...r.verses,
                  [agent]: {
                    agent,
                    content: '',
                    status: 'loading',
                    votes: r.verses[agent]?.votes ?? 0,
                  },
                },
              }
            : r,
        ),
      };
    });

    try {
      const payload = {
        agent,
        opponent,
        theme: battle.theme,
        roundIndex,
        previousOpponentVerse: prevOpponent,
        previousOwnVerse: prevOwn,
        voiceGender: battle.voiceGender,
      };
      const response = await askGameAction('rap-battle', agent, payload);
      const msg = response?.data?.response;
      if (!msg) throw new Error('Sem resposta');
      const { response: _r, ...audio } = response.data;
      setBattle((current) => {
        if (!current) return current;
        return {
          ...current,
          rounds: current.rounds.map((r) =>
            r.index === roundIndex
              ? {
                  ...r,
                  verses: {
                    ...r.verses,
                    [agent]: {
                      agent,
                      content: msg.trim(),
                      status: 'success',
                      votes: r.verses[agent]?.votes ?? 0,
                      musicTaskId: audio.musicTaskId,
                      audioStatus:
                        audio.musicStatus === 'failed'
                          ? 'failed'
                          : audio.musicTaskId
                            ? 'pending'
                            : 'idle',
                      audioError: audio.musicError,
                    },
                  },
                }
              : r,
          ),
        };
      });
      if (audio.musicTaskId) {
        startMusicPolling(roundIndex, agent, audio.musicTaskId);
      }
    } catch (err) {
      const errorMsg = extractErrorMessage(err);
      setBattle((current) => {
        if (!current) return current;
        return {
          ...current,
          rounds: current.rounds.map((r) =>
            r.index === roundIndex
              ? {
                  ...r,
                  verses: {
                    ...r.verses,
                    [agent]: {
                      agent,
                      content: '',
                      status: 'error',
                      error: errorMsg,
                      votes: r.verses[agent]?.votes ?? 0,
                    },
                  },
                }
              : r,
          ),
        };
      });
    }
  }, [battle]);

  const voteVerse = useCallback((roundIndex: 1 | 2 | 3, agent: AgentIA) => {
    setBattle((current) => {
      if (!current) return current;
      const [a, b] = current.contenders;
      const opponent = agent === a ? b : a;
      return {
        ...current,
        rounds: current.rounds.map((r) => {
          if (r.index !== roundIndex) return r;
          const target = r.verses[agent];
          if (!target || target.status !== 'success') return r;
          // toggle: clicar de novo zera. Apenas um voto por verso por round.
          const alreadyVoted = target.votes > 0;
          return {
            ...r,
            verses: {
              ...r.verses,
              [agent]: { ...target, votes: alreadyVoted ? 0 : 1 },
              ...(r.verses[opponent]
                ? { [opponent]: { ...r.verses[opponent]!, votes: 0 } }
                : {}),
            },
          };
        }),
      };
    });
  }, []);

  const nextRound = useCallback(() => {
    setBattle((current) => {
      if (!current || current.status === 'finished') return current;
      if (current.currentRound >= TOTAL_ROUNDS) return current;
      return { ...current, currentRound: (current.currentRound + 1) as 1 | 2 | 3 };
    });
  }, []);

  const finish = useCallback(() => {
    setBattle((current) => {
      if (!current) return current;
      const winner = computeWinner(current);
      return { ...current, status: 'finished', winner };
    });
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setBattle(null);
  }, []);

  const abort = useCallback(() => {
    abortRef.current?.abort();
    setIsGenerating(false);
  }, []);

  return {
    battle,
    isGenerating,
    start,
    generateRound,
    retryVerse,
    voteVerse,
    nextRound,
    finish,
    reset,
    abort,
  };
}
