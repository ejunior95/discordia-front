import { useEffect, useState } from 'react';
import { AGENTS, type AgentIA } from '@/features/chat/types';
import {
  fetchMyRecentRounds,
  fetchMyStats,
  type MyRoundEntry,
} from '@/services/stats.service';

export interface RecentRoundEntry {
  id: string;
  question: string;
  askedAt: string;
  winner: AgentIA | null;
  votedAt: string | null;
}

export interface ChatStats {
  totalRounds: number;
  totalVotes: number;
  uniqueAgentsVoted: number;
  votesByAgent: Record<AgentIA, number>;
  topAgent?: AgentIA;
  topAgentVotes: number;
  topAgentShare: number;
  recentRounds: RecentRoundEntry[];
  roundsThisMonth: number;
  loading: boolean;
  error: string | null;
}

function emptyVotesByAgent(): Record<AgentIA, number> {
  return AGENTS.reduce(
    (acc, a) => {
      acc[a] = 0;
      return acc;
    },
    {} as Record<AgentIA, number>,
  );
}

const INITIAL_STATS: ChatStats = {
  totalRounds: 0,
  totalVotes: 0,
  uniqueAgentsVoted: 0,
  votesByAgent: emptyVotesByAgent(),
  topAgent: undefined,
  topAgentVotes: 0,
  topAgentShare: 0,
  recentRounds: [],
  roundsThisMonth: 0,
  loading: true,
  error: null,
};

function normalizeRound(r: MyRoundEntry): RecentRoundEntry {
  return {
    id: r.id,
    question: r.question,
    askedAt: r.askedAt,
    winner: r.winner,
    votedAt: r.votedAt,
  };
}

export function useChatStats(): ChatStats {
  const [state, setState] = useState<ChatStats>(INITIAL_STATS);

  useEffect(() => {
    let cancelled = false;
    setState((prev) => ({ ...prev, loading: true, error: null }));

    Promise.all([fetchMyStats(), fetchMyRecentRounds(5)])
      .then(([stats, rounds]) => {
        if (cancelled) return;
        setState({
          totalRounds: stats.totalRounds,
          totalVotes: stats.totalVotes,
          uniqueAgentsVoted: stats.uniqueAgentsVoted,
          votesByAgent: { ...emptyVotesByAgent(), ...stats.votesByAgent },
          topAgent: stats.topAgent ?? undefined,
          topAgentVotes: stats.topAgentVotes,
          topAgentShare: stats.topAgentShare,
          recentRounds: rounds.map(normalizeRound),
          roundsThisMonth: stats.roundsThisMonth,
          loading: false,
          error: null,
        });
      })
      .catch((err) => {
        if (cancelled) return;
        setState((prev) => ({
          ...prev,
          loading: false,
          error: (err as Error)?.message ?? 'Erro ao carregar estatísticas',
        }));
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
