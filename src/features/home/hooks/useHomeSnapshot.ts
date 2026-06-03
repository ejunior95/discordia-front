import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { getHomeSnapshot } from '../home.api';
import type { HomeSnapshot, StatsScope } from '../home.types';

interface UseHomeSnapshotState {
  data: HomeSnapshot | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useHomeSnapshot(scope: StatsScope = 'global'): UseHomeSnapshotState {
  const [data, setData] = useState<HomeSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchSnapshot = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setIsLoading(true);
    setError(null);
    try {
      const snapshot = await getHomeSnapshot(scope, controller.signal);
      setData(snapshot);
    } catch (err) {
      if (axios.isCancel(err) || (err instanceof Error && err.name === 'CanceledError')) return;
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? 'Falha ao carregar dados da home';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [scope]);

  useEffect(() => {
    void fetchSnapshot();
    return () => abortRef.current?.abort();
  }, [fetchSnapshot]);

  return { data, isLoading, error, refetch: fetchSnapshot };
}
