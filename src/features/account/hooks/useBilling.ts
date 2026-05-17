import { useEffect, useState } from 'react';
import {
  fetchMyInvoices,
  fetchMyPaymentMethod,
  fetchMySubscription,
  fetchPlans,
  type BillingInvoice,
  type BillingPaymentMethod,
  type BillingPlan,
  type BillingSubscription,
} from '@/services/billing.service';

export interface BillingState {
  plans: BillingPlan[];
  subscription: BillingSubscription | null;
  invoices: BillingInvoice[];
  paymentMethod: BillingPaymentMethod | null;
  loading: boolean;
  error: string | null;
}

const INITIAL: BillingState = {
  plans: [],
  subscription: null,
  invoices: [],
  paymentMethod: null,
  loading: true,
  error: null,
};

export function useBilling(): BillingState {
  const [state, setState] = useState<BillingState>(INITIAL);

  useEffect(() => {
    let cancelled = false;
    setState((prev) => ({ ...prev, loading: true, error: null }));

    Promise.all([
      fetchPlans(),
      fetchMySubscription(),
      fetchMyInvoices(),
      fetchMyPaymentMethod(),
    ])
      .then(([plans, subscription, invoices, paymentMethod]) => {
        if (cancelled) return;
        setState({
          plans,
          subscription,
          invoices,
          paymentMethod,
          loading: false,
          error: null,
        });
      })
      .catch((err) => {
        if (cancelled) return;
        setState((prev) => ({
          ...prev,
          loading: false,
          error: (err as Error)?.message ?? 'Erro ao carregar billing',
        }));
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
