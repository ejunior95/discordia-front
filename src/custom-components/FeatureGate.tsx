import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { PlanCapability } from '@/services/billing.service';

interface FeatureGateProps {
  capability: PlanCapability;
  children: ReactNode;
  /** Para onde redirecionar quando o plano não inclui a capability. */
  redirectTo?: string;
  /** Conteúdo alternativo (em vez de redirect). Se ausente, redireciona. */
  fallback?: ReactNode;
}

/**
 * Bloqueia render do `children` se o plano do usuário não inclui a capability.
 * Por padrão redireciona para /subscription — o usuário "não vê" a feature
 * indisponível, conforme requisito de segurança.
 */
export function FeatureGate({
  capability,
  children,
  redirectTo = '/subscription',
  fallback,
}: FeatureGateProps) {
  const { user, isLoading, hasCapability } = useAuth();

  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;

  if (!hasCapability(capability)) {
    if (fallback !== undefined) return <>{fallback}</>;
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
