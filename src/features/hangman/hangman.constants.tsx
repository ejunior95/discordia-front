import {
  BicepsFlexed,
  Bot,
  BriefcaseBusiness,
  Citrus,
  Clapperboard,
  Dog,
  Earth,
  Guitar,
  Leaf,
  Music4,
  Palette,
  PersonStanding,
  Sofa,
  Soup,
  Star,
  Tv,
  Volleyball,
} from "lucide-react";
import type { ReactNode } from "react";

export const HANGMAN_STORAGE_KEY = "discordia-hangman-game";
export const MAX_WRONG = 6;
export const TOTAL_WORDS = 3;

export interface HangmanCategory {
  label: string;
  value: string;
  icon: ReactNode;
}

const ICON_SIZE = 22;

export const CATEGORIES: HangmanCategory[] = [
  { label: "Animais", value: "animais", icon: <Dog size={ICON_SIZE} /> },
  { label: "Frutas", value: "frutas", icon: <Citrus size={ICON_SIZE} /> },
  { label: "Países", value: "paises", icon: <Earth size={ICON_SIZE} /> },
  { label: "Cores", value: "cores", icon: <Palette size={ICON_SIZE} /> },
  { label: "Partes do corpo", value: "partes-do-corpo", icon: <PersonStanding size={ICON_SIZE} /> },
  { label: "Profissões", value: "profissoes", icon: <BriefcaseBusiness size={ICON_SIZE} /> },
  { label: "Filmes famosos", value: "filmes-famosos", icon: <Clapperboard size={ICON_SIZE} /> },
  { label: "Desenhos animados", value: "desenhos-animados", icon: <Tv size={ICON_SIZE} /> },
  { label: "Esportes", value: "esportes", icon: <Volleyball size={ICON_SIZE} /> },
  { label: "Comidas", value: "comidas", icon: <Soup size={ICON_SIZE} /> },
  { label: "Objetos da casa", value: "objetos-da-casa", icon: <Sofa size={ICON_SIZE} /> },
  { label: "Personagens históricos", value: "personagens-historicos", icon: <Star size={ICON_SIZE} /> },
  { label: "Instrumentos musicais", value: "instrumentos-musicais", icon: <Guitar size={ICON_SIZE} /> },
  { label: "Super-heróis", value: "super-herois", icon: <BicepsFlexed size={ICON_SIZE} /> },
  { label: "Estilos musicais", value: "estilos-musicais", icon: <Music4 size={ICON_SIZE} /> },
  { label: "Plantas e flores", value: "plantas-e-flores", icon: <Leaf size={ICON_SIZE} /> },
  { label: "Tecnologia", value: "tecnologia", icon: <Bot size={ICON_SIZE} /> },
];

export const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function getCategoryLabel(value: string): string {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

/**
 * Normaliza palavra removendo acentos e mantendo só A-Z.
 */
export function normalizeWord(raw: string): string {
  return raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z ]/g, "")
    .trim();
}
