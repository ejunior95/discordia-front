import {
  Handshake,
  Heart,
  MessageCircle,
  Trophy,
  SearchCheck,
  ThumbsUp,
  Lightbulb,
} from "lucide-react";
import type { BadgeDefinition, UserPreferences } from "./types";

export const PREFERENCES_STORAGE_KEY = "discordia-preferences";

export const DEFAULT_PREFERENCES: UserPreferences = {
  density: "comfortable",
  language: "pt-BR",
  anonymousTelemetry: true,
  notifications: {
    emailDigest: true,
    productUpdates: true,
    pushEnabled: false,
    soundEnabled: true,
  },
  ai: {
    favoriteAgent: "none",
    autoVoteFavorite: false,
    comparisonMode: "parallel",
    voiceGender: "male",
    showKaraoke: true,
  },
};

export const BADGES_CATALOG: BadgeDefinition[] = [
  {
    id: "first-round",
    name: "Primeira rodada",
    description: "Você fez sua primeira pergunta às IAs.",
    Icon: MessageCircle,
    color: "text-blue-500", // Azul para comunicação
    bgAndBorderColor: "bg-blue-500/20! border-blue-600! border-2", // Fundo azul clarinho e borda azul um pouco mais escura
    check: ({ totalRounds }) => totalRounds >= 1,
  },
  {
    id: "first-vote",
    name: "Primeiro voto",
    description: "Você elegeu sua primeira resposta vencedora.",
    Icon: ThumbsUp,
    color: "text-green-500", // Verde para aprovação/positividade
    bgAndBorderColor: "bg-green-500/20! border-green-600! border-2", // Fundo verde clarinho e borda verde um pouco mais escura
    check: ({ totalVotes }) => totalVotes >= 1,
  },
  {
    id: "ten-rounds",
    name: "Curiosidade afiada",
    description: "Completou 10 rodadas de comparação.",
    Icon: Lightbulb,
    color: "text-yellow-500", // Amarelo para ideia/luz
    bgAndBorderColor: "bg-yellow-500/20! border-yellow-600! border-2", // Fundo amarelo clarinho e borda amarelo um pouco mais escura
    check: ({ totalRounds }) => totalRounds >= 10,
  },
  {
    id: "fifty-rounds",
    name: "Veterano",
    description: "Completou 50 rodadas de comparação.",
    Icon: Trophy,
    color: "text-amber-600", // Dourado escuro/Bronze para troféu
    bgAndBorderColor: "bg-amber-500/20! border-amber-600! border-2", // Fundo dourado clarinho e borda dourado um pouco mais escura
    check: ({ totalRounds }) => totalRounds >= 50,
  },
  {
    id: "diplomat",
    name: "Diplomata",
    description: "Votou em pelo menos 3 IAs diferentes.",
    Icon: Handshake,
    color: "text-purple-500", // Roxo para diplomacia
    bgAndBorderColor: "bg-purple-500/20! border-purple-600! border-2", // Fundo roxo clarinho e borda roxo um pouco mais escura
    check: ({ uniqueAgentsVoted }) => uniqueAgentsVoted >= 3,
  },
  {
    id: "loyal-fan",
    name: "Fã leal",
    description: "Tem uma IA favorita clara com 10+ votos.",
    Icon: Heart,
    color: "text-red-500", // Vermelho para coração/fã
    bgAndBorderColor: "bg-red-500/20! border-red-600! border-2", // Fundo vermelho clarinho e borda vermelho um pouco mais escura
    check: ({ topAgentVotes }) => topAgentVotes >= 10,
  },
  {
    id: "critic",
    name: "Crítico nato",
    description: "Deu 25 votos no total.",
    Icon: SearchCheck,
    color: "text-orange-500", // Laranja para olhar crítico
    bgAndBorderColor: "bg-orange-500/20! border-orange-600! border-2", // Fundo laranja clarinho e borda laranja um pouco mais escura
    check: ({ totalVotes }) => totalVotes >= 25,
  },
];

export const LANGUAGE_OPTIONS: {
  value: UserPreferences["language"];
  label: string;
}[] = [
  { value: "pt-BR", label: "Português (Brasil)" },
  { value: "en-US", label: "English (US)" },
  { value: "es-ES", label: "Español" },
];
