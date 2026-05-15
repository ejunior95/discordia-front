import { RotateCcw, Trophy } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { IA_CONFIG } from '@/features/chat/chat.constants';
import type { AgentIA } from '@/features/chat/types';
import type { RapBattle } from '../types';

interface RapBattleResultProps {
  battle: RapBattle;
  onReset: () => void;
}

export function RapBattleResult({ battle, onReset }: RapBattleResultProps) {
  const [a, b] = battle.contenders;
  const wonByA = battle.rounds.filter((r) => (r.verses[a]?.votes ?? 0) > (r.verses[b]?.votes ?? 0)).length;
  const wonByB = battle.rounds.filter((r) => (r.verses[b]?.votes ?? 0) > (r.verses[a]?.votes ?? 0)).length;
  const isDraw = !battle.winner;

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col gap-6">
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/15 via-transparent to-fuchsia-500/10" aria-hidden />
        <div className="absolute -top-12 -right-12 size-48 rounded-full bg-amber-500/20 blur-3xl" aria-hidden />
        <CardContent className="relative px-6 md:px-10 py-8 md:py-12 flex flex-col items-center text-center gap-5">
          <div className="size-16 md:size-20 rounded-full bg-amber-500/15 border-2 border-amber-500/40 flex items-center justify-center">
            <Trophy size={36} className="text-amber-500" />
          </div>

          {isDraw ? (
            <>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Empate técnico!</h2>
              <p className="text-muted-foreground max-w-xl">
                As duas IAs estiveram à altura. Bora outra para desempatar?
              </p>
            </>
          ) : (
            <>
              <p className="text-sm uppercase tracking-widest text-amber-600 dark:text-amber-400 font-semibold">
                Vencedor da batalha
              </p>
              <WinnerDisplay winner={battle.winner!} />
            </>
          )}

          <div className="flex items-center gap-6 md:gap-10 pt-2">
            <ScoreBlock agent={a} score={wonByA} isWinner={battle.winner === a} />
            <span className="text-2xl md:text-3xl font-bold text-muted-foreground">×</span>
            <ScoreBlock agent={b} score={wonByB} isWinner={battle.winner === b} />
          </div>

          <Button size="lg" onClick={onReset} className="gap-2 mt-2">
            <RotateCcw size={18} />
            Nova batalha
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="px-2 md:px-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground px-2 md:px-4 pt-2 pb-1">
            Retrospecto dos rounds
          </h3>
          <Accordion type="multiple" className="w-full">
            {battle.rounds.map((round) => {
              const va = round.verses[a];
              const vb = round.verses[b];
              const aVotes = va?.votes ?? 0;
              const bVotes = vb?.votes ?? 0;
              const roundWinner: AgentIA | null =
                aVotes > bVotes ? a : bVotes > aVotes ? b : null;

              return (
                <AccordionItem key={round.index} value={`r-${round.index}`}>
                  <AccordionTrigger className="px-2 md:px-4">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-xs font-bold tabular-nums size-7 rounded-full bg-muted flex items-center justify-center">
                        {round.index}
                      </span>
                      <span className="font-medium">Round {round.index}</span>
                      {roundWinner && (
                        <span className="ml-auto inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                          <Trophy size={12} />
                          {IA_CONFIG[roundWinner].label}
                        </span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-2 md:px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <VerseColumn agent={a} content={va?.content} isWinner={roundWinner === a} />
                      <VerseColumn agent={b} content={vb?.content} isWinner={roundWinner === b} />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

function WinnerDisplay({ winner }: { winner: AgentIA }) {
  const cfg = IA_CONFIG[winner];
  const Icon = cfg.Icon;
  return (
    <div className="flex flex-col items-center gap-3">
      <div className={cn('rounded-2xl p-5 shadow-xl', cfg.iconClass)}>
        <Icon size={48} />
      </div>
      <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight">{cfg.label}</h2>
      <p className="text-sm text-muted-foreground">{cfg.subtitle}</p>
    </div>
  );
}

function ScoreBlock({ agent, score, isWinner }: { agent: AgentIA; score: number; isWinner: boolean }) {
  const cfg = IA_CONFIG[agent];
  const Icon = cfg.Icon;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={cn('rounded-full p-2.5', cfg.iconClass, isWinner && 'ring-2 ring-amber-500')}>
        <Icon size={22} />
      </div>
      <span className="text-xs text-muted-foreground truncate max-w-[80px]">{cfg.label}</span>
      <span className="text-3xl md:text-4xl font-extrabold tabular-nums">{score}</span>
    </div>
  );
}

function VerseColumn({ agent, content, isWinner }: { agent: AgentIA; content?: string; isWinner: boolean }) {
  const cfg = IA_CONFIG[agent];
  const Icon = cfg.Icon;
  const lines = (content ?? '').split('\n').map((l) => l.trim()).filter(Boolean);

  return (
    <div
      className={cn(
        'rounded-lg border p-3 md:p-4 bg-card',
        isWinner && 'border-amber-500/50 bg-amber-500/5',
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className={cn('rounded-full p-1.5', cfg.iconClass)}>
          <Icon size={14} />
        </div>
        <p className="text-sm font-semibold truncate">{cfg.label}</p>
        {isWinner && <Trophy size={14} className="text-amber-500 ml-auto" />}
      </div>
      {lines.length === 0 ? (
        <p className="text-xs text-muted-foreground italic">Sem verso registrado.</p>
      ) : (
        <div className="font-serif text-sm leading-relaxed space-y-0.5">
          {lines.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      )}
    </div>
  );
}
