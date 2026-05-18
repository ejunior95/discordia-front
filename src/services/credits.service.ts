import { api } from '@/server/api';

export interface CreditsBalance {
  balance: number;
  monthlyAllowance: number;
  periodEnd: string;
  planSlug: 'free' | 'basic' | 'premium';
  isUnlimited: boolean;
}

export interface CreditTransaction {
  _id: string;
  user_id: string;
  type:
    | 'debit'
    | 'refund'
    | 'grant'
    | 'monthly_reset'
    | 'purchase'
    | 'role_exempt';
  amount: number;
  balance_after: number;
  reason: string;
  action_type?: string;
  action_id?: string;
  created_at: string;
}

export async function fetchMyCredits() {
  const res = await api.request<CreditsBalance>({
    method: 'GET',
    url: 'credits/me',
  });
  return res.data;
}

export async function fetchMyCreditTransactions(limit = 20, cursor?: string) {
  const res = await api.request<CreditTransaction[]>({
    method: 'GET',
    url: 'credits/me/transactions',
    params: { limit, cursor },
  });
  return res.data;
}
