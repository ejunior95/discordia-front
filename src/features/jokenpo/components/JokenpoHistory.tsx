import { cn } from "@/lib/utils";
import { getChoiceMeta } from "../jokenpo.constants";
import type { JokenpoGame } from "../types";

interface JokenpoHistoryProps {
  game: JokenpoGame;
}

export function JokenpoHistory({ game }: JokenpoHistoryProps) {
  if (game.rounds.length === 0) return null;
  return (
    <div className="border rounded-lg p-3">
      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
        Histórico
      </p>
      <ul className="space-y-1">
        {game.rounds.map((r) => {
          const u = getChoiceMeta(r.user);
          const a = getChoiceMeta(r.ai);
          return (
            <li
              key={r.index}
              className="flex items-center justify-between text-sm gap-2"
            >
              <span className="text-xs text-muted-foreground w-12">Round {r.index}</span>
              <span className="flex-1 flex items-center gap-2 justify-center">
                <span className="text-xl">{u.emoji}</span>
                <span className="text-muted-foreground text-xs">vs</span>
                <span className="text-xl">{a.emoji}</span>
              </span>
              <span
                className={cn(
                  "text-xs font-semibold w-16 text-right",
                  r.outcome === "user" && "text-emerald-600 dark:text-emerald-400",
                  r.outcome === "ai" && "text-destructive",
                  r.outcome === "draw" && "text-muted-foreground",
                )}
              >
                {r.outcome === "user" ? "Você" : r.outcome === "ai" ? "IA" : "Empate"}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
