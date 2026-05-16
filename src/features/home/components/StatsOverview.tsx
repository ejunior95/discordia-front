import { Crown, MessageSquare, Swords, ThumbsUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { IA_CONFIG } from '@/features/chat/chat.constants';
import { GLOBAL_STATS } from '../home.mocks';

interface StatItem {
  label: string;
  value: string;
  icon: React.ElementType;
  iconClass: string;
  hint?: string;
}

export function StatsOverview() {
  const leader = IA_CONFIG[GLOBAL_STATS.leader];
  const stats: StatItem[] = [
    {
      label: 'Rounds disputados',
      value: GLOBAL_STATS.totalRounds.toLocaleString('pt-BR'),
      icon: Swords,
      iconClass: 'bg-primary/10 text-primary',
    },
    {
      label: 'Perguntas feitas',
      value: GLOBAL_STATS.totalQuestions.toLocaleString('pt-BR'),
      icon: MessageSquare,
      iconClass: 'bg-blue-500/10 text-blue-500',
    },
    {
      label: 'Votos computados',
      value: GLOBAL_STATS.totalVotes.toLocaleString('pt-BR'),
      icon: ThumbsUp,
      iconClass: 'bg-emerald-500/10 text-emerald-500',
    },
    {
      label: 'IA líder',
      value: leader.label,
      icon: Crown,
      iconClass: 'bg-amber-500/10 text-amber-500',
      hint: 'No topo do ranking geral',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {stats.map(({ label, value, icon: Icon, iconClass, hint }) => (
        <Card key={label} className="py-4 md:py-5">
          <CardContent className="px-4 md:px-5 flex items-center gap-3 md:gap-4">
            <div className={`shrink-0 size-16 rounded-lg flex items-center justify-center ${iconClass}`}>
              <Icon size={30} />
            </div>
            <div className="min-w-0">
              <p className="text-md md:text-sm text-muted-foreground truncate">{label}</p>
              <p className="text-3xl font-bold tracking-tight tabular-nums truncate">{value}</p>
              {hint && <p className="text-[11px] text-muted-foreground hidden md:block truncate">{hint}</p>}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
