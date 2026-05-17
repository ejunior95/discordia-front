import { useAgents } from '@/contexts/AgentsContext';
import { IA_CONFIG, type IAConfig } from '@/features/chat/chat.constants';
import type { AgentIA } from '@/features/chat/types';

export interface AgentDisplay extends IAConfig {
  name: AgentIA;
  /** Model name from DB (e.g. "gpt-4.1-mini"). Falls back to '—' enquanto carrega. */
  model: string;
}

/** Lê metadados estáticos (Icon/cores) + model dinâmico vindo do backend. */
export function useAgentDisplay(name: AgentIA): AgentDisplay {
  const { byName } = useAgents();
  const dbAgent = byName[name];
  const cfg = IA_CONFIG[name];
  return {
    ...cfg,
    name,
    label: dbAgent?.label ?? cfg.label,
    model: dbAgent?.model ?? '—',
  };
}

export function useAgentsDisplay(): Record<AgentIA, AgentDisplay> {
  const { byName } = useAgents();
  const result = {} as Record<AgentIA, AgentDisplay>;
  (Object.keys(IA_CONFIG) as AgentIA[]).forEach((name) => {
    const cfg = IA_CONFIG[name];
    const db = byName[name];
    result[name] = {
      ...cfg,
      name,
      label: db?.label ?? cfg.label,
      model: db?.model ?? '—',
    };
  });
  return result;
}
