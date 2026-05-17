import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getAllAgents, type AgentRecord } from '@/services/agents.service';
import type { AgentIA } from '@/features/chat/types';

type AgentsContextValue = {
  agents: AgentRecord[];
  byName: Record<AgentIA, AgentRecord | undefined>;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

const AgentsContext = createContext<AgentsContextValue>({
  agents: [],
  byName: {} as Record<AgentIA, AgentRecord | undefined>,
  isLoading: false,
  error: null,
  refetch: async () => {},
});

export function AgentsProvider({ children }: { children: React.ReactNode }) {
  const [agents, setAgents] = useState<AgentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getAllAgents(signal);
      setAgents(res.data ?? []);
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? 'Falha ao carregar agentes';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void fetchAgents(controller.signal);
    return () => controller.abort();
  }, [fetchAgents]);

  const byName = useMemo(() => {
    return agents.reduce((acc, a) => {
      acc[a.name] = a;
      return acc;
    }, {} as Record<AgentIA, AgentRecord | undefined>);
  }, [agents]);

  const value = useMemo<AgentsContextValue>(() => ({
    agents,
    byName,
    isLoading,
    error,
    refetch: () => fetchAgents(),
  }), [agents, byName, isLoading, error, fetchAgents]);

  return <AgentsContext.Provider value={value}>{children}</AgentsContext.Provider>;
}

export const useAgents = () => useContext(AgentsContext);
