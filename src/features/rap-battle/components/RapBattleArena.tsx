import { ArrowRight, Flag, Loader2, Mic, Square, Volume2, Wand2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { IA_CONFIG } from '@/features/chat/chat.constants';
import type { AgentIA } from '@/features/chat/types';
import { TOTAL_ROUNDS } from '../rap.constants';
import type { RapBattle, RapVerse } from '../types';
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

  const [playingAgent, setPlayingAgent] = useState<AgentIA | null>(null);

  useEffect(() => {
    setPlayingAgent(null);
  }, [battle.currentRound]);

  const handlePlayingChange = (agent: AgentIA, isPlaying: boolean) => {
    setPlayingAgent((current) => {
      if (isPlaying) return agent;
      if (current === agent) return null;
      return current;
    });
  };

  const isAudioPending = (v?: RapVerse) => v?.audioStatus === 'pending';
  const musicDone = roundGenerated && !isAudioPending(verseA) && !isAudioPending(verseB);
  const hasVote = (verseA?.votes ?? 0) > 0 || (verseB?.votes ?? 0) > 0;
  const canAdvance = roundGenerated && musicDone && hasVote && !isGenerating;

  let advanceHint: string | null = null;
  if (roundGenerated && !isGenerating) {
    if (!musicDone) advanceHint = 'Aguardando a música terminar de gerar…';
    else if (!hasVote) advanceHint = 'Vote em um MC para continuar.';
  }

  // placar por rounds vencidos
  const wonByA = battle.rounds.filter((r) => (r.verses[a]?.votes ?? 0) > (r.verses[b]?.votes ?? 0)).length;
  const wonByB = battle.rounds.filter((r) => (r.verses[b]?.votes ?? 0) > (r.verses[a]?.votes ?? 0)).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header VS */}
      <Card className="relative overflow-hidden py-5 md:py-8">
        <div className="absolute inset-0 bg-linear-to-r from-fuchsia-500/10 via-transparent to-cyan-500/10" aria-hidden />
        <div className="relative grid grid-cols-2 items-start gap-4 px-3 sm:px-4 md:grid-cols-[1fr_auto_1fr] md:items-center md:px-8">
          <ContenderHeader side="left" Icon={IconA} cfg={cfgA} score={wonByA} />
          <div className="order-first col-span-2 flex flex-col items-center gap-2 rounded-2xl border border-border/50 bg-background/60 px-4 py-3 text-center backdrop-blur-xs md:order-0 md:col-span-1 md:border-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none">
            <span className="text-xs sm:text-sm md:text-md uppercase tracking-[0.3em] text-muted-foreground">
              Round {battle.currentRound}/{TOTAL_ROUNDS}
            </span>
            <span className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight bg-linear-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent leading-none">
              VS
            </span>
            <RoundPips current={battle.currentRound} />
          </div>
          <ContenderHeader side="right" Icon={IconB} cfg={cfgB} score={wonByB} />
        </div>
        {battle.theme.trim() && (
          <div className="relative mt-4 px-4 text-center md:px-6">
            <p className="text-xs text-muted-foreground">Tema</p>
            <p className="text-sm md:text-lg font-medium italic wrap-break-word">"{battle.theme.trim()}"</p>
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
          audioDisabled={playingAgent !== null && playingAgent !== a}
          onAudioPlayingChange={(isPlaying) => handlePlayingChange(a, isPlaying)}
          onVote={() => onVote(a)}
          onRetry={() => onRetry(a)}
        />
        <VerseCard
          agent={b}
          verse={verseB}
          side="right"
          canVote={roundGenerated && !isGenerating}
          audioDisabled={playingAgent !== null && playingAgent !== b}
          onAudioPlayingChange={(isPlaying) => handlePlayingChange(b, isPlaying)}
          onVote={() => onVote(b)}
          onRetry={() => onRetry(b)}
        />
      </div>

      {/* Action bar */}
      <Card className="py-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 px-4 md:px-6">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {advanceHint ? (
              <>
                {!musicDone ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Volume2 size={14} />
                )}
                <span>{advanceHint}</span>
              </>
            ) : (
              <>
                <Volume2 size={14} />
                <span>Após a geração dos versos, aguarde o término da reprodução do áudio.</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 justify-end">
            <Button variant="destructive" onClick={onReset} className="cursor-pointer">
              Cancelar batalha
            </Button>
            {isGenerating ? (
               <Button
              type="button"
              variant="destructive"
              onClick={onAbort}
              className="cursor-pointer gap-2"
            >
              <Square className="h-4 w-4 fill-current" />
              <span className="hidden sm:inline">Cancelar</span>
            </Button>
            ) : !roundGenerated && !anyLoading ? (
              <Button onClick={onGenerateRound} className="cursor-pointer gap-2">
                <Wand2 size={16} />
                Gerar round {battle.currentRound}
              </Button>
            ) : roundGenerated && !isFinalRound ? (
              <Button
                onClick={onNextRound}
                disabled={!canAdvance}
                className="cursor-pointer gap-2"
              >
                Próximo round
                <ArrowRight size={16} />
              </Button>
            ) : roundGenerated && isFinalRound ? (
              <Button
                onClick={onFinish}
                disabled={!canAdvance}
                className="cursor-pointer gap-2"
              >
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
    <div
      className={cn(
        'flex min-w-0 flex-col items-center gap-3 rounded-2xl border border-border/50 bg-background/70 px-3 py-4 text-center shadow-sm backdrop-blur-xs sm:px-4 md:rounded-none md:border-0 md:bg-transparent md:px-0 md:py-0 md:text-left md:shadow-none md:backdrop-blur-none',
        side === 'right' && 'md:flex-row-reverse md:text-right',
        side === 'left' && 'md:flex-row',
      )}
    >
      <div className={cn('rounded-2xl p-3 md:p-4 shadow-lg', cfg.iconClass)}>
        <Icon size={28} className="md:size-8" />
      </div>
      <div className="min-w-0 space-y-1">
        {side === 'left' ? (
          <p className="flex items-center justify-center gap-1 text-xs uppercase tracking-[0.25em] text-muted-foreground md:justify-start md:text-sm md:tracking-wider">
            <Mic size={14} className="md:size-4" />
            MC
          </p>
        ) : (
          <p className="flex items-center justify-center gap-1 text-xs uppercase tracking-[0.25em] text-muted-foreground md:w-full md:justify-end md:text-right md:text-sm md:tracking-wider">
            MC
            <Mic size={14} className="md:size-4" />
          </p>
        )}
        <p className="text-base leading-tight font-extrabold tracking-tight sm:text-lg md:text-3xl truncate">{cfg.label}</p>
        <p className="text-xs text-muted-foreground tabular-nums sm:text-sm md:text-base">
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
            'size-3 rounded-full transition-colors',
            n < current && 'bg-primary',
            n === current && 'bg-primary scale-125',
            n > current && 'bg-muted',
          )}
        />
      ))}
    </div>
  );
}
