import { Castle, Ghost, Rocket, Wand2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ActorRef, Attributes, Character, Scenario, TurnAction } from './types';

export const RPG_STORAGE_KEY = 'discordia-rpg-campaign';

export interface ScenarioConfig {
  id: Scenario;
  label: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  classes: string[];
  toneLine: string;
  color: string;
}

export const SCENARIOS: ScenarioConfig[] = [
  {
    id: 'fantasy',
    label: 'Fantasia medieval',
    description: 'Reinos, magia, dragões e masmorras profundas.',
    icon: Castle,
    color: 'border-amber-400 ring-2 ring-amber-400',
    accent: 'from-amber-700/80 to-orange-700/40 text-amber-500',
    classes: ['Guerreiro', 'Mago', 'Ladino', 'Clérigo', 'Bárbaro', 'Bardo', 'Ranger', 'Paladino'],
    toneLine: 'Tom: épico, vívido, com ar de alta fantasia.',
  },
  {
    id: 'sci-fi',
    label: 'Ficção científica',
    description: 'Naves, IAs rebeldes, planetas inexplorados.',
    icon: Rocket,
    color: 'border-blue-400 ring-2 ring-blue-400',
    accent: 'from-cyan-700/80 to-blue-700/40 text-cyan-500',
    classes: ['Soldado', 'Hacker', 'Piloto', 'Médico', 'Engenheiro', 'Diplomata', 'Mercenário'],
    toneLine: 'Tom: tecnológico, com termos de space opera.',
  },
  {
    id: 'horror',
    label: 'Terror',
    description: 'Mistério, sobrenatural e atmosfera opressora.',
    icon: Ghost,
    color: 'border-violet-400 ring-2 ring-violet-400',
    accent: 'from-violet-700/80 to-fuchsia-700/40 text-violet-500',
    classes: ['Detetive', 'Ocultista', 'Sobrevivente', 'Cientista', 'Padre', 'Repórter'],
    toneLine: 'Tom: sombrio, descritivo, com tensão crescente.',
  },
  {
    id: 'custom',
    label: 'Personalizado',
    description: 'Você define o universo da campanha.',
    icon: Wand2,
    color: 'border-emerald-400 ring-2 ring-emerald-400',
    accent: 'from-emerald-700/80 to-teal-700/40 text-emerald-500',
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
