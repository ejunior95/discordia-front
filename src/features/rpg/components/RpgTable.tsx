import { useEffect, useRef } from 'react';
import { Crown, MoreVertical, Pause, Play, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { IA_CONFIG } from '@/features/chat/chat.constants';
import type { AgentIA } from '@/features/chat/types';
import { getScenarioConfig } from '../rpg.constants';
import type { ActorRef, DiceRoll, RpgCampaign } from '../types';
import { ActionBar } from './ActionBar';
import { CharacterPanel } from './CharacterPanel';
import { TurnBubble } from './TurnBubble';

interface RpgTableProps {
  campaign: RpgCampaign;
  currentActor: ActorRef;
  isGenerating: boolean;
  onSubmitUser: (content: string, roll?: DiceRoll) => Promise<void>;
  onGenerateAI: () => void;
  onRetryLast: () => void;
  onSkip: () => void;
  onAbort: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
}

export function RpgTable({
  campaign,
  currentActor,
  isGenerating,
  onSubmitUser,
  onGenerateAI,
  onRetryLast,
  onSkip,
  onAbort,
  onPause,
  onResume,
  onReset,
}: RpgTableProps) {
  const scenarioCfg = getScenarioConfig(campaign.scenario);
  const ScenarioIcon = scenarioCfg.icon;
  const isPaused = campaign.status === 'paused';
  const timelineRef = useRef<HTMLDivElement>(null);
  const lastTurn = campaign.turns[campaign.turns.length - 1];

  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    });
  }, [campaign.turns.length, lastTurn?.status]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 lg:h-[calc(100dvh-7rem)] lg:min-h-144">
      {/* Coluna principal: header + timeline + action bar */}
      <div className="lg:col-span-3 flex flex-col gap-3 md:gap-4 lg:min-h-0">
        {/* Header */}
        <Card className="py-4">
          <CardContent className="px-4 md:px-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className={cn('size-10 rounded-lg flex items-center justify-center bg-linear-to-br', scenarioCfg.accent)}>
                <ScenarioIcon size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Campanha em {scenarioCfg.label.toLowerCase()}
                </p>
                <h2 className="font-bold truncate flex items-center gap-2">
                  <Crown size={14} className="text-amber-500 shrink-0" />
                  Mestre:{' '}
                  {campaign.master === 'user' ? 'Você' : IA_CONFIG[campaign.master as AgentIA].label}
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {isPaused ? (
                <Button variant="outline" size="sm" onClick={onResume} className="cursor-pointer gap-1.5">
                  <Play size={14} />
                  Continuar
                </Button>
              ) : (
                <Button variant="ghost" size="sm" onClick={onPause} className="cursor-pointer gap-1.5">
                  <Pause size={14} />
                  Pausar
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="cursor-pointer h-8 w-8 p-0">
                    <MoreVertical size={16} />
                    <span className="sr-only">Mais opções</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onReset} className="cursor-pointer text-destructive focus:text-destructive">
                    <Trash2 size={14} />
                    Encerrar campanha
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="flex-1 min-h-[55vh] lg:min-h-0 py-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div ref={timelineRef} className="h-full overflow-y-auto px-4 md:px-6 py-4">
              {campaign.turns.length === 0 ? (
                <EmptyTimeline isMasterAI={campaign.master !== 'user'} />
              ) : (
                <div className="flex flex-col gap-3">
                  {campaign.turns.map((turn, i) => (
                    <TurnBubble
                      key={turn.id}
                      turn={turn}
                      characters={campaign.characters}
                      isLast={i === campaign.turns.length - 1}
                      onRetry={
                        i === campaign.turns.length - 1 && turn.status === 'error'
                          ? onRetryLast
                          : undefined
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </Card>

        {/* Action bar */}
        {isPaused ? (
          <div className="rounded-xl border bg-muted/40 p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Campanha pausada. Clique em "Continuar" para retomar.
            </p>
          </div>
        ) : (
          <ActionBar
            campaign={campaign}
            currentActor={currentActor}
            isGenerating={isGenerating}
            onSubmitUser={onSubmitUser}
            onGenerateAI={onGenerateAI}
            onAbort={onAbort}
            onSkip={onSkip}
          />
        )}
      </div>

      {/* Coluna lateral: fichas */}
      <div className="lg:col-span-1 lg:min-h-0">
        <Card className="h-auto lg:h-full max-h-[55vh] lg:max-h-none py-4 overflow-hidden flex flex-col">
          <CardContent className="px-3 md:px-4 flex flex-col gap-3 min-h-0">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground px-1">
              Personagens
            </h3>
            <ScrollArea className="flex-1 min-h-0">
              <div className="pr-2">
                <CharacterPanel characters={campaign.characters} />
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function EmptyTimeline({ isMasterAI }: { isMasterAI: boolean }) {
  return (
    <div className="h-full min-h-72 flex flex-col items-center justify-center text-center gap-3 px-4">
      <div className="size-12 rounded-full bg-amber-500/15 border-2 border-amber-500/30 flex items-center justify-center">
        <Crown size={22} className="text-amber-500" />
      </div>
      <h3 className="text-lg font-semibold">A mesa está montada</h3>
      <p className="text-sm text-muted-foreground max-w-md">
        {isMasterAI
          ? 'Clique em "Gerar narração" abaixo para o Mestre abrir a cena.'
          : 'Comece narrando a cena de abertura para os jogadores.'}
      </p>
    </div>
  );
}