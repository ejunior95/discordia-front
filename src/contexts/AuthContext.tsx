import { getUserInfo } from "@/services/auth.service";
import { createContext, useCallback, useEffect, useState } from "react";
import type { PlanCapability, PlanSlug } from "@/services/billing.service";
import { fetchMyCredits } from "@/services/credits.service";
import { registerCreditsListener } from "@/server/api";

export type UserSocials = {
  twitter?: string;
  github?: string;
  linkedin?: string;
};

export type UserRole = "user" | "admin" | "beta_tester";

export type UserPlan = {
  slug: PlanSlug;
  name: string;
  capabilities: PlanCapability[];
  monthlyCredits: number;
  unlimitedSoftCap: number | null;
};

export type UserCredits = {
  balance: number;
  monthlyAllowance: number;
  isUnlimited: boolean;
  periodEnd: string | Date | null;
};

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  socials?: UserSocials;
  role: UserRole;
  plan?: UserPlan;
  credits?: UserCredits;
  termsAcceptedAt?: Date | string | null;
  createdAt: Date;
};

type AuthContextType = {
  user: CurrentUser | null;
  setUser: (user: CurrentUser | null) => void;
  isLoading: boolean;
  setCreditsBalance: (balance: number | "unlimited") => void;
  refreshCredits: () => Promise<void>;
  hasCapability: (cap: PlanCapability) => boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isLoading: true,
  setCreditsBalance: () => {},
  refreshCredits: async () => {},
  hasCapability: () => false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getUserInfo().then((data) => {
      if (data) setUser(data as CurrentUser);
      setIsLoading(false);
    });
  }, []);

  const setCreditsBalance = useCallback((balance: number | "unlimited") => {
    setUser((prev) => {
      if (!prev) return prev;
      const isUnlimited = balance === "unlimited";
      return {
        ...prev,
        credits: {
          balance: isUnlimited ? prev.credits?.balance ?? 0 : balance,
          monthlyAllowance: prev.credits?.monthlyAllowance ?? 0,
          isUnlimited,
          periodEnd: prev.credits?.periodEnd ?? null,
        },
      };
    });
  }, []);

  useEffect(() => {
    registerCreditsListener(setCreditsBalance);
    return () => registerCreditsListener(null);
  }, [setCreditsBalance]);

  const refreshCredits = useCallback(async () => {
    try {
      const c = await fetchMyCredits();
      setUser((prev) =>
        prev
          ? {
              ...prev,
              credits: {
                balance: c.balance,
                monthlyAllowance: c.monthlyAllowance,
                isUnlimited: c.isUnlimited,
                periodEnd: c.periodEnd,
              },
            }
          : prev,
      );
    } catch {
      // silencioso
    }
  }, []);

  const hasCapability = useCallback(
    (cap: PlanCapability) => {
      if (!user) return false;
      // admin e beta_tester têm acesso total, independente do plano.
      if (user.role === 'admin' || user.role === 'beta_tester') return true;
      return Boolean(user.plan?.capabilities?.includes(cap));
    },
    [user],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        setCreditsBalance,
        refreshCredits,
        hasCapability,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
