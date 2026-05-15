import { ArrowRight, Flag, Loader2, Mic, Square, Volume2, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { IA_CONFIG } from '@/features/chat/chat.constants';
import type { AgentIA } from '@/features/chat/types';
import { TOTAL_ROUNDS } from '../rap.constants';
import type { RapBattle } from '../types';
import { VerseCard } from './VerseCard';

interface RapBattleArenaProps {
  battle: RapBattle;
  isGenerating: boolean;
  onGenerateRound: () => void;
  onVote: (agent: AgentIA) => void;
  onRetry: (agent: AgentIA) => void;
  onNextRound: () => void;
  onFinish: () => void;
  onAbort: () => void;
  onReset: () => void;
}

export function RapBattleArena({
  battle,
  isGenerating,
  onGenerateRound,
  onVote,
  onRetry,
  onNextRound,
  onFinish,
  onAbort,
  onReset,
}: RapBattleArenaProps) {
  const [a, b] = battle.contenders;
  const cfgA = IA_CONFIG[a];
  const cfgB = IA_CONFIG[b];
  const IconA = cfgA.Icon;
  const IconB = cfgB.Icon;

  const currentRound = battle.rounds.find((r) => r.index === battle.currentRound);
  const verseA = currentRound?.verses[a];
  const verseB = currentRound?.verses[b];
  const roundGenerated = verseA?.status === 'success' && verseB?.status === 'success';
  const anyLoading = verseA?.status === 'loading' || verseB?.status === 'loading';
  const isFinalRound = battle.currentRound === TOTAL_ROUNDS;

  // placar por rounds vencidos
  const wonByA = battle.rounds.filter((r) => (r.verses[a]?.votes ?? 0) > (r.verses[b]?.votes ?? 0)).length;
  const wonByB = battle.rounds.filter((r) => (r.verses[b]?.votes ?? 0) > (r.verses[a]?.votes ?? 0)).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header VS */}
      <Card className="relative overflow-hidden py-6 md:py-8">
        <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/10 via-transparent to-cyan-500/10" aria-hidden />
        <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 md:px-8">
          <ContenderHeader side="left" Icon={IconA} cfg={cfgA} score={wonByA} />
          <div className="flex flex-col items-center gap-2">
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
              Round {battle.currentRound}/{TOTAL_ROUNDS}
            </span>
            <span className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
              VS
            </span>
            <RoundPips current={battle.currentRound} />
          </div>
          <ContenderHeader side="right" Icon={IconB} cfg={cfgB} score={wonByB} />
        </div>
        {battle.theme.trim() && (
          <div className="relative mt-4 px-6 text-center">
            <p className="text-xs text-muted-foreground">Tema</p>
            <p className="text-sm md:text-base font-medium italic">"{battle.theme.trim()}"</p>
          </div>
        )}
      </Card>

      {/* Verses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <VerseCard
          agent={a}
          verse={verseA}
          side="left"
          canVote={roundGenerated && !isGenerating}
          onVote={() => onVote(a)}
          onRetry={() => onRetry(a)}
        />
        <VerseCard
          agent={b}
          verse={verseB}
          side="right"
          canVote={roundGenerated && !isGenerating}
          onVote={() => onVote(b)}
          onRetry={() => onRetry(b)}
        />
      </div>

      {/* Action bar */}
      <Card className="py-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 px-4 md:px-6">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Volume2 size={14} />
            <span>Em breve: vozes geradas + batida de fundo.</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 justify-end">
            <Button variant="ghost" size="sm" onClick={onReset} className="cursor-pointer">
              Nova batalha
            </Button>
            {isGenerating ? (
              <Button variant="outline" size="sm" onClick={onAbort} className="cursor-pointer gap-2">
                <Square size={14} />
                Cancelar
              </Button>
            ) : !roundGenerated && !anyLoading ? (
              <Button onClick={onGenerateRound} className="cursor-pointer gap-2">
                <Wand2 size={16} />
                Gerar round {battle.currentRound}
              </Button>
            ) : roundGenerated && !isFinalRound ? (
              <Button onClick={onNextRound} className="cursor-pointer gap-2">
                Próximo round
                <ArrowRight size={16} />
              </Button>
            ) : roundGenerated && isFinalRound ? (
              <Button onClick={onFinish} className="cursor-pointer gap-2">
                <Flag size={16} />
                Finalizar batalha
              </Button>
            ) : (
              <Button disabled className="gap-2">
                <Loader2 size={16} className="animate-spin" />
                Gerando…
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

function ContenderHeader({
  side,
  Icon,
  cfg,
  score,
}: {
  side: 'left' | 'right';
  Icon: React.ElementType;
  cfg: (typeof IA_CONFIG)[AgentIA];
  score: number;
}) {
  return (
    <div className={cn('flex items-center gap-3', side === 'right' && 'flex-row-reverse text-right')}>
      <div className={cn('rounded-2xl p-3 md:p-4 shadow-lg', cfg.iconClass)}>
        <Icon size={32} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
          <Mic size={11} />
          MC
        </p>
        <p className="text-lg md:text-xl font-extrabold tracking-tight truncate">{cfg.label}</p>
        <p className="text-xs text-muted-foreground tabular-nums">
          {score} {score === 1 ? 'round vencido' : 'rounds vencidos'}
        </p>
      </div>
    </div>
  );
}

function RoundPips({ current }: { current: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center gap-1.5 pt-1">
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          className={cn(
            'size-2 rounded-full transition-colors',
            n < current && 'bg-primary',
            n === current && 'bg-primary scale-125',
            n > current && 'bg-muted',
          )}
        />
      ))}
    </div>
  );
}
