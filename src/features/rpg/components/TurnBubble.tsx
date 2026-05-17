import { Crown, RotateCcw, Sparkles, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { IA_CONFIG } from '@/features/chat/chat.constants';
import { AudioPlayer } from '@/custom-components/AudioPlayer';
import type { AgentIA } from '@/features/chat/types';
import type { Character, TurnAction } from '../types';

interface TurnBubbleProps {
  turn: TurnAction;
  characters: Character[];
  onRetry?: () => void;
  isLast: boolean;
}

export function TurnBubble({ turn, characters, onRetry, isLast }: TurnBubbleProps) {
  const isMaster = turn.role === 'master';
  const character = turn.actor !== 'user'
    ? characters.find((c) => c.owner === turn.actor)
    : characters.find((c) => c.owner === 'user');

  const { Icon, label, bubbleClass, ringClass } = getActorVisuals(turn);

  return (
    <article
      className={cn(
        'rounded-xl border px-4 py-3 transition-all',
        bubbleClass,
        turn.status === 'error' && 'border-destructive/50',
      )}
    >
      <header className="flex items-center gap-2 mb-1.5">
        <div className={cn('size-7 rounded-full flex items-center justify-center shrink-0', ringClass)}>
          <Icon size={14} />
        </div>
        <p className="text-xs font-semibold uppercase tracking-wide truncate">
          {isMaster ? 'Mestre' : character?.name ?? label}
        </p>
        {!isMaster && character && (
          <p className="text-[11px] text-muted-foreground truncate">
            · {character.classe}
          </p>
        )}
        {turn.actor !== 'user' && (
          <span className="ml-auto text-[10px] text-muted-foreground/70 truncate">
            via {label}
          </span>
        )}
      </header>

      {turn.status === 'loading' && <LoadingLines />}
      {turn.status === 'error' && (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-destructive">{turn.error ?? 'Erro ao gerar resposta.'}</p>
          {isLast && onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry} className="self-start gap-1.5 cursor-pointer">
              <RotateCcw size={13} />
              Tentar novamente
            </Button>
          )}
        </div>
      )}
      {turn.status === 'success' && (
        <>
          <p
            className={cn(
              'whitespace-pre-wrap wrap-break-word',
              isMaster ? 'text-[15px] leading-relaxed' : 'text-sm leading-relaxed',
            )}
          >
            {turn.content}
          </p>
          {isMaster && turn.audioUrl && (
            <AudioPlayer status="ready" audioUrl={turn.audioUrl} />
          )}
        </>
      )}
    </article>
  );
}

function getActorVisuals(turn: TurnAction) {
  if (turn.role === 'master') {
    return {
      Icon: Crown,
      label: turn.actor === 'user' ? 'Você' : IA_CONFIG[turn.actor as AgentIA].label,
      bubbleClass: 'bg-amber-500/[0.06] border-amber-500/30',
      ringClass: 'bg-amber-500/15 text-amber-500',
    };
  }
  if (turn.actor === 'user') {
    return {
      Icon: UserIcon,
      label: 'Você',
      bubbleClass: 'bg-primary/[0.06] border-primary/30',
      ringClass: 'bg-primary/15 text-primary',
    };
  }
  const cfg = IA_CONFIG[turn.actor as AgentIA];
  return {
    Icon: cfg.Icon,
    label: cfg.label,
    bubbleClass: 'bg-card border-border',
    ringClass: cfg.iconClass,
  };
}

function LoadingLines() {
  return (
    <div className="space-y-1.5 py-1">
      <div className="h-3 rounded bg-muted animate-pulse w-[88%]" />
      <div className="h-3 rounded bg-muted animate-pulse w-[72%]" />
      <div className="h-3 rounded bg-muted animate-pulse w-[55%]" />
      <p className="text-[11px] italic text-muted-foreground flex items-center gap-1 pt-1">
        <Sparkles size={11} /> Pensando…
      </p>
    </div>
  );
}
