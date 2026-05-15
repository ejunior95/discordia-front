import { Castle, Ghost, Rocket, Wand2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { IA_CONFIG } from '@/features/chat/chat.constants';
import type { AgentIA } from '@/features/chat/types';
import type { ActorRef, Attributes, Character, RpgCampaign, Scenario, TurnAction } from './types';

export const RPG_STORAGE_KEY = 'discordia-rpg-campaign';

export interface ScenarioConfig {
  id: Scenario;
  label: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  classes: string[];
  toneLine: string;
}

export const SCENARIOS: ScenarioConfig[] = [
  {
    id: 'fantasy',
    label: 'Fantasia medieval',
    description: 'Reinos, magia, dragões e masmorras profundas.',
    icon: Castle,
    accent: 'from-amber-500/20 to-orange-500/10 text-amber-500',
    classes: ['Guerreiro', 'Mago', 'Ladino', 'Clérigo', 'Bárbaro', 'Bardo', 'Ranger', 'Paladino'],
    toneLine: 'Tom: épico, vívido, com ar de alta fantasia.',
  },
  {
    id: 'sci-fi',
    label: 'Ficção científica',
    description: 'Naves, IAs rebeldes, planetas inexplorados.',
    icon: Rocket,
    accent: 'from-cyan-500/20 to-blue-500/10 text-cyan-500',
    classes: ['Soldado', 'Hacker', 'Piloto', 'Médico', 'Engenheiro', 'Diplomata', 'Mercenário'],
    toneLine: 'Tom: tecnológico, com termos de space opera.',
  },
  {
    id: 'horror',
    label: 'Terror',
    description: 'Mistério, sobrenatural e atmosfera opressora.',
    icon: Ghost,
    accent: 'from-violet-500/20 to-fuchsia-500/10 text-violet-500',
    classes: ['Detetive', 'Ocultista', 'Sobrevivente', 'Cientista', 'Padre', 'Repórter'],
    toneLine: 'Tom: sombrio, descritivo, com tensão crescente.',
  },
  {
    id: 'custom',
    label: 'Personalizado',
    description: 'Você define o universo da campanha.',
    icon: Wand2,
    accent: 'from-emerald-500/20 to-teal-500/10 text-emerald-500',
    classes: ['Aventureiro', 'Estrategista', 'Místico', 'Artesão', 'Andarilho', 'Erudito'],
    toneLine: 'Tom: defina conforme o universo informado.',
  },
];

export function getScenarioConfig(scenario: Scenario): ScenarioConfig {
  return SCENARIOS.find((s) => s.id === scenario) ?? SCENARIOS[0];
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function rollD6(): number {
  return Math.floor(Math.random() * 6) + 1;
}

function roll3d6(): number {
  return rollD6() + rollD6() + rollD6();
}

function rollAttributes(): Attributes {
  return {
    for: roll3d6(),
    des: roll3d6(),
    con: roll3d6(),
    int: roll3d6(),
    sab: roll3d6(),
    car: roll3d6(),
  };
}

const FANTASY_NAMES_PREFIX = ['Aer', 'Bran', 'Cael', 'Dorn', 'El', 'Fen', 'Gor', 'Hael', 'Isen', 'Kar', 'Lyr', 'Mor', 'Nyx', 'Ori', 'Rhy', 'Syl', 'Thal', 'Vex', 'Wyl', 'Zar'];
const FANTASY_NAMES_SUFFIX = ['adin', 'enor', 'iel', 'amir', 'orin', 'eth', 'wyn', 'aro', 'ion', 'aria', 'arak', 'ondir'];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateName(owner: ActorRef): string {
  if (owner === 'user') return 'Você';
  // nome temático aleatório
  return `${pickRandom(FANTASY_NAMES_PREFIX)}${pickRandom(FANTASY_NAMES_SUFFIX)}`;
}

export function generateCharacter(owner: ActorRef, scenario: Scenario): Character {
  const cfg = getScenarioConfig(scenario);
  const attrs = rollAttributes();
  const maxHp = 18 + Math.floor(attrs.con / 2);
  return {
    owner,
    name: generateName(owner),
    classe: pickRandom(cfg.classes),
    hp: maxHp,
    maxHp,
    attributes: attrs,
  };
}

export function getActorLabel(actor: ActorRef, characters?: Character[]): string {
  if (actor === 'user') {
    const char = characters?.find((c) => c.owner === 'user');
    return char ? char.name : 'Você';
  }
  return IA_CONFIG[actor].label;
}

// === Prompts ===

const MAX_HISTORY_TURNS = 8;

function formatHistory(turns: TurnAction[], characters: Character[]): string {
  if (turns.length === 0) return '(sem histórico ainda — é o início da campanha)';
  const recent = turns.slice(-MAX_HISTORY_TURNS);
  return recent
    .filter((t) => t.status === 'success' && t.content.trim())
    .map((t) => {
      const who = t.role === 'master' ? 'MESTRE' : getActorLabel(t.actor, characters);
      return `[${who}]: ${t.content.trim()}`;
    })
    .join('\n');
}

function formatRoster(characters: Character[]): string {
  return characters
    .map((c) => {
      const ownerLabel = c.owner === 'user' ? 'Jogador humano' : IA_CONFIG[c.owner as AgentIA].label;
      return `- ${c.name} (${c.classe}, HP ${c.hp}/${c.maxHp}) — ${ownerLabel}`;
    })
    .join('\n');
}

interface MasterPromptInput {
  campaign: RpgCampaign;
}

export function buildMasterPrompt({ campaign }: MasterPromptInput): string {
  const scenarioCfg = getScenarioConfig(campaign.scenario);
  const customLine = campaign.scenario === 'custom' && campaign.customPrompt?.trim()
    ? `Universo definido pelo jogador: """${campaign.customPrompt.trim()}"""`
    : `Cenário: ${scenarioCfg.label} — ${scenarioCfg.description}`;

  return [
    `Você é o MESTRE de uma campanha de RPG estilo Dungeons & Dragons em português brasileiro.`,
    customLine,
    scenarioCfg.toneLine,
    `Personagens na mesa:\n${formatRoster(campaign.characters)}`,
    `Histórico recente:\n${formatHistory(campaign.turns, campaign.characters)}`,
    'Sua tarefa:',
    '- Descreva a próxima cena em 3 a 5 frases vívidas.',
    '- NÃO fale ou aja pelos personagens dos jogadores.',
    '- Termine com uma situação, pergunta ou desafio que exija ação dos jogadores.',
    '- Responda APENAS com a narração, sem rótulos, sem aspas externas, sem comentários.',
  ].join('\n\n');
}

interface PlayerPromptInput {
  campaign: RpgCampaign;
  agent: AgentIA;
}

export function buildPlayerPrompt({ campaign, agent }: PlayerPromptInput): string {
  const scenarioCfg = getScenarioConfig(campaign.scenario);
  const character = campaign.characters.find((c) => c.owner === agent);
  if (!character) throw new Error(`Personagem não encontrado para ${agent}`);

  const lastMasterTurn = [...campaign.turns].reverse().find(
    (t) => t.role === 'master' && t.status === 'success',
  );

  const customLine = campaign.scenario === 'custom' && campaign.customPrompt?.trim()
    ? `Universo: """${campaign.customPrompt.trim()}"""`
    : `Cenário: ${scenarioCfg.label}.`;

  const attrs = character.attributes;
  const attrsLine = `FOR ${attrs.for} · DES ${attrs.des} · CON ${attrs.con} · INT ${attrs.int} · SAB ${attrs.sab} · CAR ${attrs.car}`;

  return [
    `Você é "${character.name}", um(a) ${character.classe} em uma campanha de RPG estilo Dungeons & Dragons.`,
    customLine,
    `Seus atributos: ${attrsLine}. HP atual: ${character.hp}/${character.maxHp}.`,
    `Histórico recente:\n${formatHistory(campaign.turns, campaign.characters)}`,
    lastMasterTurn
      ? `O Mestre acabou de narrar:\n"""${lastMasterTurn.content.trim()}"""`
      : 'A aventura está começando.',
    'Sua tarefa:',
    `- Responda em primeira pessoa como ${character.name}, em 2 a 4 frases.`,
    '- Pode misturar fala ("entre aspas") e descrição de ação.',
    '- Seja coerente com sua classe, atributos e o histórico.',
    '- Responda APENAS com a fala/ação, sem rótulos como "Personagem:" e sem comentários.',
  ].join('\n\n');
}

export function makeTurn(
  actor: ActorRef,
  role: 'master' | 'player',
  content: string,
  status: TurnAction['status'] = 'success',
  error?: string,
): TurnAction {
  return {
    id: generateId(),
    actor,
    role,
    content,
    status,
    error,
    createdAt: new Date().toISOString(),
  };
}

export const RPG_HELPERS = { generateId };
