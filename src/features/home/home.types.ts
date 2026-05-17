import type { AgentIA } from '@/features/chat/types';

export interface HomeTotals {
  rounds: number;
  questions: number;
  votes: number;
}

export interface LeaderboardEntry {
  agent: AgentIA;
  wins: number;
  rounds: number;
  votes: number;
  streak: number;
  lastWinAt?: string | null;
}

export interface IAOfWeek {
  agent: AgentIA;
  weeklyWins: number;
  streak: number;
}

export interface WeeklyBucket {
  weekStart: string;
  byAgent: Record<AgentIA, number>;
}

export interface RecentRound {
  id: string;
  question: string;
  winner: AgentIA;
  votedAt: string;
  createdAt: string;
}

export interface HomeSnapshot {
  totals: HomeTotals;
  leader: AgentIA | null;
  leaderboard: LeaderboardEntry[];
  iaOfWeek: IAOfWeek | null;
  weekly: WeeklyBucket[];
  recent: RecentRound[];
}
