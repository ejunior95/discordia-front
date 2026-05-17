import { api } from '@/server/api';
import type { AgentIA } from '@/features/chat/types';

export interface MyStatsResponse {
  totalRounds: number;
  totalVotes: number;
  uniqueAgentsVoted: number;
  votesByAgent: Record<AgentIA, number>;
  topAgent: AgentIA | null;
  topAgentVotes: number;
  topAgentShare: number;
  roundsThisMonth: number;
}

export interface MyRoundEntry {
  id: string;
  question: string;
  winner: AgentIA | null;
  askedAt: string;
  votedAt: string | null;
}

export async function fetchMyStats() {
  const res = await api.request<MyStatsResponse>({
    method: 'GET',
    url: 'stats/me',
  });
  return res.data;
}

export async function fetchMyRecentRounds(limit = 5) {
  const res = await api.request<MyRoundEntry[]>({
    method: 'GET',
    url: `stats/me/rounds?limit=${limit}`,
  });
  return res.data;
}
