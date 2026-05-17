import { api } from '@/server/api';
import type { AgentIA } from '@/features/chat/types';

export interface AgentRecord {
  _id: string;
  name: AgentIA;
  label: string;
  model: string;
  created_at?: string;
  updated_at?: string;
}

export async function getAllAgents(signal?: AbortSignal) {
  return api.request<AgentRecord[]>({
    method: 'GET',
    url: 'find-all-agents',
    signal,
  });
}
