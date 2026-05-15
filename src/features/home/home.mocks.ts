import type { AgentIA } from '@/features/chat/types';

export interface IAStat {
  agent: AgentIA;
  wins: number;
  rounds: number;
  votes: number;
  streak: number;
}

export interface GlobalStats {
  totalRounds: number;
  totalQuestions: number;
  totalVotes: number;
  leader: AgentIA;
}

export interface HeadToHeadCell {
  a: AgentIA;
  b: AgentIA;
  winsOfA: number;
}

export interface RecentBattle {
  id: string;
  question: string;
  winner: AgentIA;
  minutesAgo: number;
}

export interface WeeklyPoint {
  weekLabel: string;
  values: Record<AgentIA, number>;
}

export interface IAOfTheWeek {
  agent: AgentIA;
  weeklyWins: number;
  streak: number;
  highlight: string;
}

export const IA_STATS: IAStat[] = [
  { agent: 'chat-gpt', wins: 184, rounds: 312, votes: 540, streak: 4 },
  { agent: 'gemini', wins: 162, rounds: 312, votes: 487, streak: 2 },
  { agent: 'deepseek', wins: 121, rounds: 312, votes: 392, streak: 0 },
  { agent: 'grok', wins: 97, rounds: 312, votes: 318, streak: 1 },
];

export const GLOBAL_STATS: GlobalStats = {
  totalRounds: 312,
  totalQuestions: 312,
  totalVotes: 1737,
  leader: 'chat-gpt',
};

export const IA_OF_THE_WEEK: IAOfTheWeek = {
  agent: 'chat-gpt',
  weeklyWins: 23,
  streak: 4,
  highlight: 'Dominou perguntas sobre ciência e história com respostas concisas.',
};

export const RECENT_BATTLES: RecentBattle[] = [
  { id: 'r1', question: 'Qual a maior contribuição de Alan Turing para a computação?', winner: 'chat-gpt', minutesAgo: 3 },
  { id: 'r2', question: 'Como funciona um buraco negro supermassivo?', winner: 'gemini', minutesAgo: 14 },
  { id: 'r3', question: 'Escreva um haicai sobre código limpo.', winner: 'deepseek', minutesAgo: 42 },
  { id: 'r4', question: 'Qual o melhor framework para web em 2026?', winner: 'grok', minutesAgo: 71 },
  { id: 'r5', question: 'Explique computação quântica como se eu tivesse 10 anos.', winner: 'chat-gpt', minutesAgo: 128 },
];

export const WEEKLY_PERFORMANCE: WeeklyPoint[] = [
  { weekLabel: 'S1', values: { 'chat-gpt': 12, gemini: 9, deepseek: 6, grok: 4 } },
  { weekLabel: 'S2', values: { 'chat-gpt': 15, gemini: 11, deepseek: 8, grok: 6 } },
  { weekLabel: 'S3', values: { 'chat-gpt': 14, gemini: 13, deepseek: 9, grok: 7 } },
  { weekLabel: 'S4', values: { 'chat-gpt': 18, gemini: 12, deepseek: 11, grok: 9 } },
  { weekLabel: 'S5', values: { 'chat-gpt': 20, gemini: 15, deepseek: 12, grok: 8 } },
  { weekLabel: 'S6', values: { 'chat-gpt': 22, gemini: 17, deepseek: 13, grok: 10 } },
  { weekLabel: 'S7', values: { 'chat-gpt': 23, gemini: 18, deepseek: 14, grok: 11 } },
  { weekLabel: 'S8', values: { 'chat-gpt': 26, gemini: 19, deepseek: 15, grok: 12 } },
];

export const AGENT_CHART_COLORS: Record<AgentIA, string> = {
  'chat-gpt': '#10a37f',
  gemini: '#4285f4',
  deepseek: '#6366f1',
  grok: '#f59e0b',
};
