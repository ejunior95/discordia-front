import type { AgentIA } from "@/features/chat/types";

export type StatsScope = "global" | "user";

export interface HomeTotals {
  questions: number;
  rapBattles: number;
  rpgCampaigns: number;
  miniGames: number;
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

export type RecentActivityKind = "chat" | "rap" | "rpg" | "game";

export interface RecentActivityItem {
  id: string;
  kind: RecentActivityKind;
  title: string;
  subtitle: string;
  winner: AgentIA | null;
  at: string;
}

export interface HomeSnapshot {
  totals: HomeTotals;
  leader: AgentIA | null;
  leaderboard: LeaderboardEntry[];
  iaOfWeek: IAOfWeek | null;
  weekly: WeeklyBucket[];
  recent: RecentActivityItem[];
}
