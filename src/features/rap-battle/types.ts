import type { AgentIA } from '@/features/chat/types';

export type RapVerseStatus = 'loading' | 'success' | 'error';
export type RapAudioStatus = 'idle' | 'pending' | 'ready' | 'failed';

export interface RapVerse {
  agent: AgentIA;
  content: string;
  status: RapVerseStatus;
  error?: string;
  votes: number;
  musicTaskId?: string;
  audioStatus?: RapAudioStatus;
  audioUrl?: string;
  audioError?: string;
}

export interface RapRound {
  index: 1 | 2 | 3;
  verses: Partial<Record<AgentIA, RapVerse>>;
}

export type RapBattleStatus = 'setup' | 'in-progress' | 'finished';

export interface RapBattle {
  id: string;
  contenders: [AgentIA, AgentIA];
  theme: string;
  rounds: RapRound[];
  currentRound: 1 | 2 | 3;
  status: RapBattleStatus;
  winner?: AgentIA;
  createdAt: string;
}
