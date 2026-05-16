import type {
  BadgeDefinition,
  CurrentSubscription,
  Invoice,
  PaymentMethod,
  Plan,
  UserPreferences,
} from './types';

export const PREFERENCES_STORAGE_KEY = 'discordia-preferences';

export const DEFAULT_PREFERENCES: UserPreferences = {
  density: 'comfortable',
  language: 'pt-BR',
  anonymousTelemetry: true,
  notifications: {
    emailDigest: true,
    productUpdates: true,
    pushEnabled: false,
    soundEnabled: true,
  },
  ai: {
    favoriteAgent: 'none',
    autoVoteFavorite: false,
    comparisonMode: 'parallel',
  },
  profile: {
    bio: '',
    socials: {
      twitter: '',
      github: '',
      linkedin: '',
    },
  },
};

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfeito para começar e comparar IAs no dia a dia.',
    pricing: { monthly: 0, yearly: 0 },
    features: [
      '50 rodadas de comparação por mês',
      'Acesso aos 4 modelos básicos',
      'Histórico local no navegador',
      'Suporte da comunidade',
    ],
    monthlyRoundsLimit: 50,
    cta: 'Plano atual',
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Para quem usa IA com frequência e quer mais poder.',
    pricing: { monthly: 29.9, yearly: 299 },
    highlight: true,
    features: [
      '1.000 rodadas por mês',
      'Modelos avançados (gpt-4.1, gemini-2.5-pro)',
      'Histórico sincronizado na nuvem',
      'Exportação em Markdown e PDF',
      'Suporte prioritário por e-mail',
    ],
    monthlyRoundsLimit: 1000,
    cta: 'Assinar Pro',
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Para times e usuários avançados que precisam do máximo.',
    pricing: { monthly: 79.9, yearly: 799 },
    features: [
      'Rodadas ilimitadas',
      'Todos os modelos topo de linha',
      'Modo equipe com até 5 membros',
      'Chaves de API próprias (BYOK)',
      'SLA e suporte dedicado',
    ],
    monthlyRoundsLimit: null,
    cta: 'Assinar Premium',
  },
];

// TODO(backend): substituir mocks por dados reais do endpoint de billing.
export const mockCurrentSubscription: CurrentSubscription = {
  planId: 'free',
  cycle: 'monthly',
  renewsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 18).toISOString(),
  status: 'active',
};

export const mockPaymentMethod: PaymentMethod = {
  brand: 'visa',
  last4: '4242',
  holder: 'Seu Nome',
  expMonth: 12,
  expYear: 2028,
};

export const mockInvoices: Invoice[] = [
  {
    id: 'INV-2026-005',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    description: 'Plano Free — uso mensal',
    amount: 0,
    currency: 'BRL',
    status: 'paid',
  },
  {
    id: 'INV-2026-004',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40).toISOString(),
    description: 'Plano Free — uso mensal',
    amount: 0,
    currency: 'BRL',
    status: 'paid',
  },
  {
    id: 'INV-2026-003',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 70).toISOString(),
    description: 'Plano Free — uso mensal',
    amount: 0,
    currency: 'BRL',
    status: 'paid',
  },
];

export const BADGES_CATALOG: BadgeDefinition[] = [
  {
    id: 'first-round',
    name: 'Primeira rodada',
    description: 'Você fez sua primeira pergunta às IAs.',
    check: ({ totalRounds }) => totalRounds >= 1,
  },
  {
    id: 'first-vote',
    name: 'Primeiro voto',
    description: 'Você elegeu sua primeira resposta vencedora.',
    check: ({ totalVotes }) => totalVotes >= 1,
  },
  {
    id: 'ten-rounds',
    name: 'Curiosidade afiada',
    description: 'Completou 10 rodadas de comparação.',
    check: ({ totalRounds }) => totalRounds >= 10,
  },
  {
    id: 'fifty-rounds',
    name: 'Veterano',
    description: 'Completou 50 rodadas de comparação.',
    check: ({ totalRounds }) => totalRounds >= 50,
  },
  {
    id: 'diplomat',
    name: 'Diplomata',
    description: 'Votou em pelo menos 3 IAs diferentes.',
    check: ({ uniqueAgentsVoted }) => uniqueAgentsVoted >= 3,
  },
  {
    id: 'loyal-fan',
    name: 'Fã leal',
    description: 'Tem uma IA favorita clara com 10+ votos.',
    check: ({ topAgentVotes }) => topAgentVotes >= 10,
  },
  {
    id: 'critic',
    name: 'Crítico nato',
    description: 'Deu 25 votos no total.',
    check: ({ totalVotes }) => totalVotes >= 25,
  },
];

export const LANGUAGE_OPTIONS: { value: UserPreferences['language']; label: string }[] = [
  { value: 'pt-BR', label: 'Português (Brasil)' },
  { value: 'en-US', label: 'English (US)' },
  { value: 'es-ES', label: 'Español' },
];
