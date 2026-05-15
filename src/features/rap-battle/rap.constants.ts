import type { AgentIA } from '@/features/chat/types';
import { IA_CONFIG } from '@/features/chat/chat.constants';

export const RAP_BATTLE_STORAGE_KEY = 'discordia-rap-battle';
export const TOTAL_ROUNDS = 3 as const;

export const RAP_THEME_SUGGESTIONS = [
  'Qual é a IA mais inteligente?',
  'Qual IA tem o melhor senso de humor?',
  'Qual é a melhor IA para criar arte?',
  'Qual IA tem o melhor CEO?',
  'Quem é o mais rápido em responder?',
];

export interface RapPromptInput {
  agent: AgentIA;
  opponent: AgentIA;
  theme: string;
  roundIndex: 1 | 2 | 3;
  previousOpponentVerse?: string;
  previousOwnVerse?: string;
}

export function buildRapPrompt({
  agent,
  opponent,
  theme,
  roundIndex,
  previousOpponentVerse,
  previousOwnVerse,
}: RapPromptInput): string {
  const agentLabel = IA_CONFIG[agent].label;
  const opponentLabel = IA_CONFIG[opponent].label;
  const themeLine = theme.trim()
    ? `Tema da batalha: "${theme.trim()}".`
    : 'Tema livre: ataque o estilo, a precisão e a personalidade do oponente.';

  const history: string[] = [];
  if (previousOwnVerse) {
    history.push(`Seu verso anterior:\n"""${previousOwnVerse}"""`);
  }
  if (previousOpponentVerse) {
    history.push(`Último verso do oponente (responda diretamente a ele):\n"""${previousOpponentVerse}"""`);
  }

  return [
    `Você é a IA "${agentLabel}" em uma batalha de rap estilo 8 Mile contra a IA "${opponentLabel}".`,
    themeLine,
    `Este é o ROUND ${roundIndex} de ${TOTAL_ROUNDS}.`,
    history.join('\n\n'),
    'Regras:',
    '- Escreva EXATAMENTE 8 versos (linhas) em português brasileiro.',
    '- Rimas obrigatórias em pares (AABB ou ABAB).',
    '- Tom provocador, criativo, com punchlines; evite clichês e rimas fáceis.',
    '- Mencione qualidades suas e fraquezas do oponente.',
    '- Não inclua título, numeração, comentários nem explicações. Apenas os 8 versos, um por linha.',
  ]
    .filter(Boolean)
    .join('\n\n');
}
