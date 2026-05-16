import { Clock, Trophy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { IA_CONFIG } from '@/features/chat/chat.constants';
import { RECENT_BATTLES } from '../home.mocks';

function formatRelativeTime(minutes: number): string {
  if (minutes < 1) return 'agora';
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours}h`;
  const days = Math.floor(hours / 24);
  return `há ${days}d`;
}

export function RecentActivityCard() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-4 text-xl">
          <Clock size={28} className="text-primary" />
          Atividade recente
        </CardTitle>
        <CardDescription>Últimas batalhas e seus vencedores</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {RECENT_BATTLES.map((battle) => {
          const cfg = IA_CONFIG[battle.winner];
          const Icon = cfg.Icon;
          return (
            <div
              key={battle.id}
              className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent/40 transition-colors"
            >
              <div className={cn('rounded-full p-2 shrink-0 border', cfg.iconClass)}>
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate" title={battle.question}>
                  {battle.question}
                </p>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                  <Trophy size={11} className="text-amber-500" />
                  {cfg.label}
                  <span aria-hidden>·</span>
                  <span>{formatRelativeTime(battle.minutesAgo)}</span>
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
