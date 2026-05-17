import { Link } from 'react-router-dom';
import { Flame, Sparkles, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAgentDisplay } from '@/hooks/useAgentDisplay';
import type { IAOfWeek } from '../home.types';

interface IAOfTheWeekCardProps {
  data: IAOfWeek | null;
}

export function IAOfTheWeekCard({ data }: IAOfTheWeekCardProps) {
  const config = useAgentDisplay(data?.agent ?? 'chat-gpt');
  if (!data) {
    return (
      <Card className="h-full overflow-hidden relative">
        <div className="absolute inset-0 bg-linear-to-br from-amber-500/10 via-transparent to-primary/10" aria-hidden />
        <CardContent className="relative flex flex-col gap-4 px-5 md:px-6 h-full items-center justify-center text-center py-8">
          <div className="flex items-center gap-2 text-xs font-medium text-amber-600 dark:text-amber-400">
            <Sparkles size={14} />
            IA DA SEMANA
          </div>
          <p className="text-muted-foreground text-sm">
            Ainda não há vitórias nos últimos 7 dias. Faça uma pergunta e vote no melhor!
          </p>
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link to="/chat">
              Começar agora
              <ArrowRight size={14} />
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const Icon = config.Icon;

  return (
    <Card className="h-full overflow-hidden relative">
      <div className="absolute inset-0 bg-linear-to-br from-amber-500/10 via-transparent to-primary/10" aria-hidden />
      <div className="absolute -top-8 -right-8 size-32 rounded-full bg-amber-500/20 blur-2xl" aria-hidden />
      <CardContent className="relative flex flex-col gap-4 px-5 md:px-6 h-full">
        <div className="flex items-center gap-2 text-xs font-medium text-amber-600 dark:text-amber-400">
          <Sparkles size={14} />
          IA DA SEMANA
        </div>
        <div className="flex items-center gap-4">
          <div className={`rounded-2xl p-4 ${config.iconClass} shadow-lg`}>
            <Icon size={48} />
          </div>
          <div className="min-w-0">
            <p className="text-2xl md:text-5xl font-extrabold tracking-tight truncate">{config.label}</p>
            <p className="text-lg text-muted-foreground truncate">{config.model}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-full">
          <div className="md:flex flex-col items-center justify-between rounded-lg border bg-background/60 p-3">
            <p className="text-md uppercase tracking-wide text-muted-foreground">Vitórias na semana</p>
            <p className="text-2xl md:text-[7rem] font-bold tabular-nums">{data.weeklyWins}</p>
            <div className='hidden md:flex' />
          </div>
          <div className="md:flex flex-col items-center justify-between rounded-lg border bg-background/60 p-3">
            <p className="text-md uppercase tracking-wide text-muted-foreground flex items-center gap-1">
              <Flame size={22} className="text-amber-500" /> Vitórias consecutivas
            </p>
            <p className="text-2xl md:text-[7rem] font-bold tabular-nums">{data.streak}</p>
            <div className='hidden md:flex' />
          </div>
        </div>
        <div className="mt-auto pt-2">
          <Button asChild variant="outline" size="sm" className="w-full gap-2">
            <Link to="/chat">
              Desafiar agora
              <ArrowRight size={14} />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
