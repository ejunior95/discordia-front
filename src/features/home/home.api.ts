import { api } from '@/server/api';
import type { HomeSnapshot, StatsScope } from './home.types';

export async function getHomeSnapshot(
  scope: StatsScope = 'global',
  signal?: AbortSignal,
): Promise<HomeSnapshot> {
  const res = await api.request<HomeSnapshot>({
    method: 'GET',
    url: 'stats/home',
    params: scope === 'user' ? { scope: 'user' } : undefined,
    signal,
  });
  return res.data;
}
