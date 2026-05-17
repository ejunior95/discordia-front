import { Clock, Trophy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { IA_CONFIG } from '@/features/chat/chat.constants';
import type { RecentRound } from '../home.types';

function formatRelativeTime(iso: string): string {
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
  if (minutes < 1) return 'agora';
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours}h`;
  const days = Math.floor(hours / 24);
  return `há ${days}d`;
}

interface RecentActivityCardProps {
  rounds: RecentRound[];
}

export function RecentActivityCard({ rounds }: RecentActivityCardProps) {
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
        {rounds.length === 0 && (
          <p className="text-sm text-muted-foreground italic">Nenhuma batalha registrada ainda.</p>
        )}
        {rounds.map((battle) => {
          const cfg = IA_CONFIG[battle.winner];
          const Icon = cfg.Icon;
          const when = battle.votedAt ?? battle.createdAt;
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
                  <span>{formatRelativeTime(when)}</span>
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
