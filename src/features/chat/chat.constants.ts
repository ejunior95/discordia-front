import { DeepSeek, Gemini, Grok, OpenAI } from '@lobehub/icons';
import type { AgentIA } from './types';

export interface IAConfig {
  Icon: React.ElementType;
  label: string;
  subtitle: string;
  iconClass: string;
  accent: string;
}

export const IA_CONFIG: Record<AgentIA, IAConfig> = {
  'chat-gpt': {
    Icon: OpenAI,
    label: 'ChatGPT',
    subtitle: 'gpt-4.1-mini',
    iconClass: 'bg-black text-white',
    accent: 'border-zinc-500',
  },
  gemini: {
    Icon: Gemini,
    label: 'Gemini',
    subtitle: 'gemini-2.5-flash',
    iconClass: 'bg-white text-blue-600',
    accent: 'border-blue-500',
  },
  deepseek: {
    Icon: DeepSeek,
    label: 'DeepSeek',
    subtitle: 'deepseek-v4-flash',
    iconClass: 'bg-blue-600 text-white',
    accent: 'border-indigo-500',
  },
  grok: {
    Icon: Grok,
    label: 'Grok',
    subtitle: 'grok-4.3',
    iconClass: 'bg-gray-600 text-white',
    accent: 'border-amber-500',
  },
};

export const LOADER_MESSAGES = [
  'Pensando...',
  'Consultando o oráculo digital...',
  'Aquecendo motores...',
  'Calculando resposta...',
  'Comparando sinapses...',
  'Inteligência em ebulição...',
  'Decifrando padrões...',
  'Recarregando neurônios...',
  'Sincronizando mente...',
  'Esquentando algoritmos...',
  'Colocando bits em ordem...',
  'Destilando conhecimento...',
  'Raciocinando...',
];

export const SUGGESTION_CHIPS = [
  'Qual invenção mudou mais a história humana?',
  'Qual animal tem a habilidade mais surpreendente?',
  'Qual mistério do espaço é mais intrigante?',
  'Qual fato histórico parece mentira, mas é real?',
];

export const MAX_QUESTION_LENGTH = 150;
export const ROUNDS_STORAGE_KEY = 'discordia-chat-rounds';
