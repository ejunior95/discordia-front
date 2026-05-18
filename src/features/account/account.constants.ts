import type {
  BadgeDefinition,
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
    voiceGender: 'male',
  },
};

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
