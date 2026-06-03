import { Clock, MessagesSquare, MicVocal, Swords, Gamepad2, Trophy } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { IA_CONFIG } from '@/features/chat/chat.constants';
import type { RecentActivityItem, RecentActivityKind } from '../home.types';

function formatRelativeTime(iso: string): string {
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
  if (minutes < 1) return 'agora';
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours}h`;
  const days = Math.floor(hours / 24);
  return `há ${days}d`;
}

const KIND_CONFIG: Record<
  RecentActivityKind,
  {
    Icon: React.ComponentType<{ size?: number | string; className?: string }>;
    iconClass: string;
    label: string;
    empty: string;
  }
> = {
  chat: {
    Icon: MessagesSquare,
    iconClass: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    label: 'Perguntas no chat',
    empty: 'Nenhuma pergunta recente.',
  },
  rap: {
    Icon: MicVocal,
    iconClass: 'bg-fuchsia-500/10 text-fuchsia-500 border-fuchsia-500/20',
    label: 'Batalhas de rima',
    empty: 'Nenhuma batalha recente.',
  },
  rpg: {
    Icon: Swords,
    iconClass: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    label: 'Campanhas RPG',
    empty: 'Nenhuma campanha recente.',
  },
  game: {
    Icon: Gamepad2,
    iconClass: 'bg-red-500/10 text-red-500 border-red-500/20',
    label: 'Jogos',
    empty: 'Nenhum jogo recente.',
  },
};

const GROUP_ORDER: RecentActivityKind[] = ['chat', 'rap', 'rpg', 'game'];

interface RecentActivityCardProps {
  items: RecentActivityItem[];
}

export function RecentActivityCard({ items }: RecentActivityCardProps) {
  const grouped = GROUP_ORDER.map((kind) => ({
    kind,
    items: items.filter((item) => item.kind === kind),
  }));
  const defaultOpen = grouped.filter((group) => group.items.length > 0).map((group) => group.kind);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-4 text-xl">
          <Clock size={28} className="text-primary" />
          Atividade recente
        </CardTitle>
        <CardDescription>Perguntas, batalhas de rima, RPG e jogos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground italic">Nenhuma atividade registrada ainda.</p>
        )}
        {items.length > 0 && (
          <Accordion type="multiple" defaultValue={defaultOpen} className="w-full">
            {grouped.map(({ kind, items: groupItems }) => {
              const kindCfg = KIND_CONFIG[kind];
              const Icon = kindCfg.Icon;

              return (
                <AccordionItem key={kind} value={kind}>
                  <AccordionTrigger className="py-3 hover:no-underline">
                    <span className="flex min-w-0 items-center gap-2">
                      <span className={cn('rounded-full p-1.5 shrink-0 border', kindCfg.iconClass)}>
                        <Icon size={14} />
                      </span>
                      <span className="truncate">{kindCfg.label}</span>
                      <span className="text-xs text-muted-foreground shrink-0">({groupItems.length})</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-2 pb-3">
                    {groupItems.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic px-1">{kindCfg.empty}</p>
                    ) : (
                      groupItems.map((item) => {
                        const winnerCfg = item.winner ? IA_CONFIG[item.winner] : null;
                        return (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent/40 transition-colors"
                          >
                            <div className={cn('rounded-full p-2 shrink-0 border', kindCfg.iconClass)}>
                              <Icon size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm truncate" title={item.title}>
                                {item.title}
                              </p>
                              <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5 min-w-0">
                                <span className="truncate">{item.subtitle}</span>
                                {winnerCfg && (
                                  <>
                                    <span aria-hidden>·</span>
                                    <Trophy size={12} className="text-amber-500 shrink-0" />
                                    <span className="truncate">{winnerCfg.label}</span>
                                  </>
                                )}
                                <span aria-hidden>·</span>
                                <span className="shrink-0">{formatRelativeTime(item.at)}</span>
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
