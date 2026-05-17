import { Crown, MessageSquare, Swords, ThumbsUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { IA_CONFIG } from '@/features/chat/chat.constants';
import type { AgentIA } from '@/features/chat/types';
import type { HomeTotals } from '../home.types';

interface StatItem {
  label: string;
  value: string;
  icon: React.ElementType;
  iconClass: string;
  hint?: string;
}

interface StatsOverviewProps {
  totals: HomeTotals;
  leader: AgentIA | null;
}

export function StatsOverview({ totals, leader }: StatsOverviewProps) {
  const leaderConfig = leader ? IA_CONFIG[leader] : null;
  const stats: StatItem[] = [
    {
      label: 'Rounds disputados',
      value: totals.rounds.toLocaleString('pt-BR'),
      icon: Swords,
      iconClass: 'bg-primary/10 text-primary',
    },
    {
      label: 'Perguntas feitas',
      value: totals.questions.toLocaleString('pt-BR'),
      icon: MessageSquare,
      iconClass: 'bg-blue-500/10 text-blue-500',
    },
    {
      label: 'Votos computados',
      value: totals.votes.toLocaleString('pt-BR'),
      icon: ThumbsUp,
      iconClass: 'bg-emerald-500/10 text-emerald-500',
    },
    {
      label: 'IA líder',
      value: leaderConfig?.label ?? '—',
      icon: Crown,
      iconClass: 'bg-amber-500/10 text-amber-500',
      hint: leaderConfig ? 'No topo do ranking geral' : 'Sem votos ainda',
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
