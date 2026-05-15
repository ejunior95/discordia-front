import { Gamepad2, House, MessagesSquare, MicVocal, Swords } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavigationItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

export const navigationItems: NavigationItem[] = [
  { label: 'Início', path: '/home', icon: House },
  { label: 'Chat', path: '/chat', icon: MessagesSquare },
  { label: 'Jogos', path: '/games', icon: Gamepad2 },
  { label: 'Batalha de rima', path: '/rap-battle', icon: MicVocal },
  { label: 'RPG', path: '/rpg', icon: Swords },
];
