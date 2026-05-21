import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"
import { Trash2 } from "lucide-react";
import { Round } from "./Round";
import type { AgentIA, Round as RoundType } from "../types";

interface RoundsHistoryProps {
  rounds: RoundType[];
  onVote: (roundId: string, agent: AgentIA) => void;
  onRetry: (roundId: string, agent: AgentIA) => void;
  onClear: () => void;
}

const NEAR_BOTTOM_THRESHOLD = 120;

export function RoundsHistory({
  rounds,
  onVote,
  onRetry,
  onClear,
}: RoundsHistoryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stickToBottom, setStickToBottom] = useState(true);
  const lastRoundIdRef = useRef<string | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
      setStickToBottom(distance < NEAR_BOTTOM_THRESHOLD);
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el || rounds.length === 0) return;
    const lastRound = rounds[rounds.length - 1];
    const isNewRound = lastRound.id !== lastRoundIdRef.current;
    lastRoundIdRef.current = lastRound.id;

    if (isNewRound || stickToBottom) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [rounds, stickToBottom]);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex items-center justify-between mb-2 px-1">
        <Badge className="bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300 text-sm">
          {rounds.length} {rounds.length === 1 ? "rodada" : "rodadas"}
        </Badge>
        <Button
          variant="destructive"
          onClick={onClear}
          className="text-xs gap-1 cursor-pointer hover:scale-105 transition-transform"
        >
          <Trash2 size={14} /> Limpar
        </Button>
      </div>
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto border rounded-lg p-3 sm:px-4"
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
