import { Castle, Ghost, Rocket, Wand2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ActorRef, Attributes, Character, DiceRoll, DiceType, HpDelta, Scenario, TurnAction } from './types';

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

export const DICE_SIDES: Record<DiceType, number> = {
  d4: 4,
  d6: 6,
  d8: 8,
  d10: 10,
  d12: 12,
  d20: 20,
  d100: 100,
};

export const DICE_TYPES: DiceType[] = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'];

/** Rola um único dado do tipo informado. */
export function rollDie(type: DiceType): number {
  return Math.floor(Math.random() * DICE_SIDES[type]) + 1;
}

/** Modificador de atributo no estilo D&D 5e: floor((valor - 10) / 2). */
export function attributeModifier(value: number): number {
  return Math.floor((value - 10) / 2);
}

/** Rola um dado e aplica um modificador opcional, devolvendo o resultado estruturado. */
export function rollWithModifier(
  type: DiceType,
  modifier = 0,
  modifierLabel?: string,
): DiceRoll {
  const raw = rollDie(type);
  return {
    dice: type,
    raw,
    modifier,
    modifierLabel,
    total: raw + modifier,
  };
}

export type AttributeKey = keyof Attributes;

export const ATTRIBUTE_LABELS: Record<AttributeKey, string> = {
  for: 'FOR',
  des: 'DES',
  con: 'CON',
  int: 'INT',
  sab: 'SAB',
  car: 'CAR',
};

export const ATTRIBUTE_KEYS: AttributeKey[] = ['for', 'des', 'con', 'int', 'sab', 'car'];

/** Distribuição padrão estilo D&D 5e (standard array) para o jogador distribuir. */
export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

/** Atributo primário sugerido por classe (para combate e modificadores). */
export const CLASS_PRIMARY_ATTRIBUTE: Record<string, AttributeKey> = {
  // Fantasia
  Guerreiro: 'for',
  Bárbaro: 'for',
  Paladino: 'for',
  Mago: 'int',
  Clérigo: 'sab',
  Ranger: 'des',
  Ladino: 'des',
  Bardo: 'car',
  // Sci-fi
  Soldado: 'for',
  Hacker: 'int',
  Piloto: 'des',
  Médico: 'sab',
  Engenheiro: 'int',
  Diplomata: 'car',
  Mercenário: 'des',
  // Terror
  Detetive: 'int',
  Ocultista: 'sab',
  Sobrevivente: 'con',
  Cientista: 'int',
  Padre: 'sab',
  Repórter: 'car',
  // Personalizado
  Aventureiro: 'des',
  Estrategista: 'int',
  Místico: 'sab',
  Artesão: 'int',
  Andarilho: 'con',
  Erudito: 'int',
};

export function getClassPrimaryAttribute(classe: string): AttributeKey {
  return CLASS_PRIMARY_ATTRIBUTE[classe] ?? 'for';
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

/** HP máximo derivado da constituição. */
export function computeMaxHp(con: number): number {
  return 18 + Math.floor(con / 2);
}

export function generateCharacter(owner: ActorRef, scenario: Scenario): Character {
  const cfg = getScenarioConfig(scenario);
  const attrs = rollAttributes();
  const maxHp = computeMaxHp(attrs.con);
  return {
    owner,
    name: generateName(owner),
    classe: pickRandom(cfg.classes),
    hp: maxHp,
    maxHp,
    attributes: attrs,
  };
}

/** Cria o personagem do jogador humano a partir das escolhas da tela de criação. */
export function buildUserCharacter(
  name: string,
  classe: string,
  attributes: Attributes,
): Character {
  const maxHp = computeMaxHp(attributes.con);
  const trimmed = name.trim();
  return {
    owner: 'user',
    name: trimmed.length > 0 ? trimmed : 'Você',
    classe,
    hp: maxHp,
    maxHp,
    attributes,
  };
}

/** Rola 3d6 para cada atributo (modo "rolar"). Exportado para a tela de criação. */
export function rollAttributeSet(): Attributes {
  return rollAttributes();
}

export function parseHpTags(content: string, characters: Character[]): { stripped: string; deltas: HpDelta[] } {
  const deltas: HpDelta[] = [];
  const stripped = content
    .replace(/\[\s*HP\s+([^\]\n+-]+?)\s*([+-]\d+)\s*\]/gi, (_match, rawName: string, rawDelta: string) => {
      const normalizedName = rawName.trim().toLowerCase();
      const character = characters.find((item) => item.name.trim().toLowerCase() === normalizedName);
      const delta = Number(rawDelta);

      if (character && Number.isFinite(delta) && delta !== 0) {
        deltas.push({ owner: character.owner, name: character.name, delta });
      }

      return '';
    })
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return { stripped, deltas };
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
