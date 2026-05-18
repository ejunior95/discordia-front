import { Gamepad2, House, MessagesSquare, MicVocal, Swords } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { PlanCapability } from '@/services/billing.service';

export interface NavigationItem {
  label: string;
  path: string;
  icon: LucideIcon;
  /** Capability mínima exigida no plano. undefined = sempre visível. */
  requiresCapability?: PlanCapability;
}

export const navigationItems: NavigationItem[] = [
  { label: 'Início', path: '/home', icon: House },
  { label: 'Chat', path: '/chat', icon: MessagesSquare, requiresCapability: 'chat' },
  { label: 'Jogos', path: '/games', icon: Gamepad2, requiresCapability: 'games' },
  { label: 'Batalha de rima', path: '/rap-battle', icon: MicVocal, requiresCapability: 'games' },
  { label: 'RPG', path: '/rpg', icon: Swords, requiresCapability: 'audio' },
];

/**
 * Filtra os itens de navegação com base nas capabilities do plano vigente.
 * Itens sem `requiresCapability` aparecem sempre.
 */
export function filterNavigationByCapabilities(
  items: NavigationItem[],
  capabilities: PlanCapability[],
): NavigationItem[] {
  return items.filter(
    (i) => !i.requiresCapability || capabilities.includes(i.requiresCapability),
  );
}
