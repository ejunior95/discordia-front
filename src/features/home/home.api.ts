import { api } from '@/server/api';
import type { HomeSnapshot } from './home.types';

export async function getHomeSnapshot(signal?: AbortSignal): Promise<HomeSnapshot> {
  const res = await api.request<HomeSnapshot>({
    method: 'GET',
    url: 'stats/home',
    signal,
  });
  return res.data;
}
