import { api } from '@/server/api';

export type PlanSlug = 'free' | 'basic' | 'premium';
export type PlanCapability = 'chat' | 'games' | 'audio' | 'music';

export interface BillingPlan {
  id: string;
  slug: PlanSlug;
  name: string;
  description: string;
  pricing: { monthly: number; yearly: number };
  features: string[];
  capabilities: PlanCapability[];
  monthlyCredits: number;
  unlimitedSoftCap?: number | null;
  monthlyRoundsLimit: number | null;
  highlight: boolean;
  cta: string;
  order: number;
}

export interface BillingSubscription {
  id: string;
  planSlug: PlanSlug;
  planId: string;
  cycle: 'monthly' | 'yearly';
  status: 'active' | 'canceled' | 'past_due';
  startedAt: string;
  renewsAt: string;
  canceledAt: string | null;
}

export interface BillingInvoice {
  id: string;
  external_id: string;
  date: string;
  description: string;
  amount: number;
  currency: 'BRL' | 'USD';
  status: 'paid' | 'pending' | 'failed';
}

export interface BillingPaymentMethod {
  id: string;
  brand: string;
  last4: string;
  holder: string;
  exp_month: number;
  exp_year: number;
  is_default: boolean;
}

export async function fetchPlans() {
  const res = await api.request<BillingPlan[]>({
    method: 'GET',
    url: 'billing/plans',
  });
  return res.data;
}

export async function fetchMySubscription() {
  const res = await api.request<BillingSubscription>({
    method: 'GET',
    url: 'billing/subscription/me',
  });
  return res.data;
}

export async function fetchMyInvoices() {
  const res = await api.request<BillingInvoice[]>({
    method: 'GET',
    url: 'billing/invoices/me',
  });
  return res.data;
}

export async function fetchMyPaymentMethod() {
  const res = await api.request<BillingPaymentMethod | null>({
    method: 'GET',
    url: 'billing/payment-method/me',
  });
  return res.data;
}
