import { Trophy, Medal, Flame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { IA_CONFIG } from '@/features/chat/chat.constants';
import { IA_STATS } from '../home.mocks';

export function LeaderboardCard() {
  const ranked = [...IA_STATS].sort((a, b) => b.wins - a.wins);
  const maxWins = ranked[0]?.wins ?? 1;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-4 text-xl">
          <Trophy size={28} className="text-amber-500" />
          Ranking das IAs
        </CardTitle>
        <CardDescription>Vitórias acumuladas na temporada</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {ranked.map((stat, index) => {
          const config = IA_CONFIG[stat.agent];
          const Icon = config.Icon;
          const winRate = stat.rounds ? Math.round((stat.wins / stat.rounds) * 100) : 0;
          const barWidth = Math.max(8, Math.round((stat.wins / maxWins) * 100));
          const position = index + 1;

          return (
            <div
              key={stat.agent}
              className={cn(
                'flex items-center gap-3 rounded-lg border p-3 transition-colors',
                position === 1 && 'border-amber-500/40 bg-amber-500/5',
              )}
            >
              <div className="flex items-center justify-center size-7 shrink-0">
                {position === 1 ? (
                  <Medal size={18} className="text-amber-500" />
                ) : position === 2 ? (
                  <Medal size={18} className="text-zinc-400" />
                ) : position === 3 ? (
                  <Medal size={18} className="text-orange-500" />
                ) : (
                  <span className="text-lg font-semibold text-muted-foreground tabular-nums">#{position}</span>
                )}
              </div>
              <div className={cn('rounded-full p-2 shrink-0', config.iconClass)}>
                <Icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 shrink-0">
                  <p className="font-semibold truncate">{config.label}</p>
                    {stat.streak >= 3 && (
                      <span 
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400"
                        title={`Sequência de ${stat.streak} vitórias!`}
                      >
                        <Flame size={12} /> {stat.streak}
                      </span>
                    )}
                  </div>
                    <span className="text-sm font-bold tabular-nums">{stat.wins}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
                <p className="text-[11px] text-muted-foreground mt-1 tabular-nums">
                  {winRate}% de vitórias · {stat.rounds} rounds
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
