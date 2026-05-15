import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Round } from './Round';
import type { AgentIA, Round as RoundType } from '../types';

interface RoundsHistoryProps {
  rounds: RoundType[];
  onVote: (roundId: string, agent: AgentIA) => void;
  onRetry: (roundId: string, agent: AgentIA) => void;
  onClear: () => void;
}

const NEAR_BOTTOM_THRESHOLD = 120; // px

export function RoundsHistory({ rounds, onVote, onRetry, onClear }: RoundsHistoryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stickToBottom, setStickToBottom] = useState(true);
  const lastRoundIdRef = useRef<string | null>(null);

  // detecta se o usuário está perto do bottom para decidir auto-scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
      setStickToBottom(distance < NEAR_BOTTOM_THRESHOLD);
    };
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  // auto-scroll só quando colado no fim OU quando um novo round chega
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el || rounds.length === 0) return;
    const lastRound = rounds[rounds.length - 1];
    const isNewRound = lastRound.id !== lastRoundIdRef.current;
    lastRoundIdRef.current = lastRound.id;

    if (isNewRound || stickToBottom) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  }, [rounds, stickToBottom]);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex items-center justify-between mb-2 px-1">
        <p className="text-xs text-muted-foreground">
          {rounds.length} {rounds.length === 1 ? 'rodada' : 'rodadas'}
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-xs gap-1 cursor-pointer text-muted-foreground hover:text-destructive"
        >
          <Trash2 size={14} /> Limpar
        </Button>
      </div>
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto border rounded-lg px-3 sm:px-4 divide-y"
      >
        {rounds.map((round) => (
          <Round
            key={round.id}
            round={round}
            onVote={(agent) => onVote(round.id, agent)}
            onRetry={(agent) => onRetry(round.id, agent)}
          />
        ))}
      </div>
    </div>
  );
}
