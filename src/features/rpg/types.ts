import type { AgentIA } from '@/features/chat/types';

export type Scenario = 'fantasy' | 'sci-fi' | 'horror' | 'custom';

export type ActorRef = 'user' | AgentIA;

export interface Attributes {
  for: number;
  des: number;
  con: number;
  int: number;
  sab: number;
  car: number;
}

export interface Character {
  owner: ActorRef;
  name: string;
  classe: string;
  hp: number;
  maxHp: number;
  attributes: Attributes;
}

export type TurnRole = 'master' | 'player';
export type TurnStatus = 'loading' | 'success' | 'error';

export interface TurnAction {
  id: string;
  actor: ActorRef;
  role: TurnRole;
  content: string;
  status: TurnStatus;
  error?: string;
  createdAt: string;
  audioUrl?: string;
}

export type CampaignStatus = 'setup' | 'playing' | 'paused';

export interface RpgCampaign {
  id: string;
  scenario: Scenario;
  customPrompt?: string;
  master: ActorRef;
  /** ordem dos jogadores (não inclui o mestre) */
  players: ActorRef[];
  /** ordem completa do round: [master, ...players] */
  turnOrder: ActorRef[];
  currentTurnIndex: number;
  characters: Character[];
  turns: TurnAction[];
  status: CampaignStatus;
  createdAt: string;
}
