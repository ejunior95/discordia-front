export type AgentIA = 'chat-gpt' | 'gemini' | 'deepseek' | 'grok';

export type AIResponseStatus = 'loading' | 'success' | 'error';

export interface AIResponse {
  agent: AgentIA;
  status: AIResponseStatus;
  message?: string;
  error?: string;
  votes: number;
}

export interface Round {
  id: string;
  question: string;
  askedAt: string;
  responses: Record<AgentIA, AIResponse>;
  winner?: AgentIA;
}

export const AGENTS: AgentIA[] = ['chat-gpt', 'gemini', 'deepseek', 'grok'];
