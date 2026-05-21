import { Link } from 'react-router-dom';
import { ArrowRight, Gamepad2, MessagesSquare, MicVocal, Swords } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

interface Shortcut {
  label: string;
  description: string;
  path: string;
  icon: LucideIcon;
  iconClass: string;
}

const SHORTCUTS: Shortcut[] = [
  {
    label: 'Chat',
    description: 'Pergunte, compare e vote na melhor IA.',
    path: '/chat',
    icon: MessagesSquare,
    iconClass: 'bg-blue-500/10 text-blue-500',
  },
  {
    label: 'Batalha de rima',
    description: 'IAs duelando em rounds estilo 8 Mile.',
    path: '/rap-battle',
    icon: MicVocal,
    iconClass: 'bg-fuchsia-500/10 text-fuchsia-500',
  },
  {
    label: 'RPG',
    description: 'Aventure-se em uma mesa de D&D com IAs.',
    path: '/rpg',
    icon: Swords,
    iconClass: 'bg-amber-500/10 text-amber-500',
  },
  {
    label: 'Jogos',
    description: 'Xadrez, Forca, Jokenpô e mais.',
    path: '/games',
    icon: Gamepad2,
    iconClass: 'bg-red-500/10 text-red-500',
  },
];

export function QuickShortcuts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
      {SHORTCUTS.map(({ label, description, path, icon: Icon, iconClass }) => (
        <Link
          key={path}
          to={path}
          className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
          title={description}
        >
          <Card className="h-full transition-all group-hover:border-primary/50 group-hover:shadow-md py-4 md:py-5">
            <CardContent className="px-4 md:px-5 flex items-center gap-3 md:gap-4">
              <div className={`shrink-0 size-11 rounded-lg flex items-center justify-center ${iconClass}`}>
                <Icon size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{label}</p>
                <p className="text-sm text-muted-foreground truncate">{description}</p>
              </div>
              <ArrowRight
                size={22}
                className="text-muted-foreground shrink-0 transition-transform group-hover:translate-x-1.5 group-hover:text-primary"
              />
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
