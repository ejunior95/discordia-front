import { useEffect, useMemo, useState } from 'react';
import { ROUNDS_STORAGE_KEY } from '@/features/chat/chat.constants';
import { AGENTS, type AgentIA, type Round } from '@/features/chat/types';

interface ChatStats {
  totalRounds: number;
  totalVotes: number;
  uniqueAgentsVoted: number;
  votesByAgent: Record<AgentIA, number>;
  topAgent?: AgentIA;
  topAgentVotes: number;
  topAgentShare: number;
  recentRounds: Round[];
  /** rodadas no mês corrente (útil pra limite mensal) */
  roundsThisMonth: number;
}

function loadRounds(): Round[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ROUNDS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Round[];
  } catch {
    return [];
  }
}

function computeStats(rounds: Round[]): ChatStats {
  const votesByAgent = AGENTS.reduce((acc, a) => {
    acc[a] = 0;
    return acc;
  }, {} as Record<AgentIA, number>);

  let totalVotes = 0;
  for (const round of rounds) {
    for (const agent of AGENTS) {
      const v = round.responses?.[agent]?.votes ?? 0;
      votesByAgent[agent] += v;
      totalVotes += v;
    }
  }

  let topAgent: AgentIA | undefined;
  let topAgentVotes = 0;
  for (const agent of AGENTS) {
    if (votesByAgent[agent] > topAgentVotes) {
      topAgentVotes = votesByAgent[agent];
      topAgent = agent;
    }
  }

  const uniqueAgentsVoted = AGENTS.filter((a) => votesByAgent[a] > 0).length;
  const topAgentShare = totalVotes > 0 ? topAgentVotes / totalVotes : 0;

  const now = new Date();
  const roundsThisMonth = rounds.filter((r) => {
    const d = new Date(r.askedAt);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;

  const recentRounds = [...rounds]
    .sort((a, b) => new Date(b.askedAt).getTime() - new Date(a.askedAt).getTime())
    .slice(0, 5);

  return {
    totalRounds: rounds.length,
    totalVotes,
    uniqueAgentsVoted,
    votesByAgent,
    topAgent,
    topAgentVotes,
    topAgentShare,
    recentRounds,
    roundsThisMonth,
  };
}

export function useChatStats() {
  const [rounds, setRounds] = useState<Round[]>(loadRounds);

  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (e.key === ROUNDS_STORAGE_KEY) {
        setRounds(loadRounds());
      }
    }
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return useMemo(() => computeStats(rounds), [rounds]);
}
