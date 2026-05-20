import type { AgentIA } from '@/features/chat/types';

export type BillingCycle = 'monthly' | 'yearly';

export type PlanId = 'free' | 'basic' | 'premium';

export interface PlanPricing {
  monthly: number;
  yearly: number;
}

export interface Plan {
  id: PlanId;
  name: string;
  description: string;
  pricing: PlanPricing;
  highlight?: boolean;
  features: string[];
  monthlyRoundsLimit: number | null; // null = ilimitado
  cta: string;
}

export interface CurrentSubscription {
  planId: PlanId;
  cycle: BillingCycle;
  renewsAt: string; // ISO
  status: 'active' | 'canceled' | 'past_due';
}

export interface Invoice {
  id: string;
  date: string; // ISO
  description: string;
  amount: number;
  currency: 'BRL' | 'USD';
  status: 'paid' | 'pending' | 'failed';
}

export interface PaymentMethod {
  brand: 'visa' | 'mastercard' | 'amex' | 'elo';
  last4: string;
  holder: string;
  expMonth: number;
  expYear: number;
}

export type BadgeId =
  | 'first-round'
  | 'first-vote'
  | 'ten-rounds'
  | 'fifty-rounds'
  | 'diplomat'
  | 'loyal-fan'
  | 'critic';

export interface BadgeDefinition {
  id: BadgeId;
  name: string;
  description: string;
  Icon: React.ComponentType<{ size?: number | string; className?: string }>;
  color: string;
  bgAndBorderColor?: string;
  /** key of stats to check */
  check: (ctx: BadgeCheckContext) => boolean;
}

export interface BadgeCheckContext {
  totalRounds: number;
  totalVotes: number;
  uniqueAgentsVoted: number;
  topAgent?: AgentIA;
  topAgentVotes: number;
}

export type DensityMode = 'comfortable' | 'compact';

export type LanguageCode = 'pt-BR' | 'en-US' | 'es-ES';

export interface NotificationPreferences {
  emailDigest: boolean;
  productUpdates: boolean;
  pushEnabled: boolean;
  soundEnabled: boolean;
}

export type VoiceGender = 'male' | 'female';

export interface AIPreferences {
  favoriteAgent: AgentIA | 'none';
  autoVoteFavorite: boolean;
  comparisonMode: 'parallel' | 'sequential';
  voiceGender: VoiceGender;
  showKaraoke: boolean;
}

export interface UserPreferences {
  density: DensityMode;
  language: LanguageCode;
  anonymousTelemetry: boolean;
  notifications: NotificationPreferences;
  ai: AIPreferences;
}
