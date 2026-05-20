import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flag, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChessGame } from "../types";

interface ChessSidePanelProps {
  game: ChessGame;
  onResign: () => void;
}

function pairMoves(moves: string[]): { num: number; w?: string; b?: string }[] {
  const pairs: { num: number; w?: string; b?: string }[] = [];
  for (let i = 0; i < moves.length; i += 2) {
    pairs.push({ num: i / 2 + 1, w: moves[i], b: moves[i + 1] });
  }
  return pairs;
}

export function ChessSidePanel({ game, onResign }: ChessSidePanelProps) {
  const pairs = pairMoves(game.moves);
  const canResign = game.status === "user-turn" || game.status === "ai-thinking";

  return (
    <Card className="p-4 flex flex-col gap-3 w-full lg:max-w-xs">
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Status</p>
        <p className="text-sm font-semibold flex items-center gap-2">
          {game.status === "ai-thinking" && (
            <>
              <Loader2 className="animate-spin" size={14} /> IA pensando...
            </>
          )}
          {game.status === "user-turn" && "Sua vez de jogar"}
          {game.status === "won" && "Xeque-mate! Você venceu."}
          {game.status === "lost" && "Xeque-mate! Você perdeu."}
          {game.status === "draw" && "Empate."}
        </p>
        {game.aiError && (
          <p className="text-xs text-destructive mt-1">{game.aiError}</p>
        )}
      </div>

      <div className="flex-1 min-h-0">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
          Lances ({game.moves.length})
        </p>
        <div className="border rounded-md max-h-[260px] overflow-auto">
          {pairs.length === 0 ? (
            <p className="text-xs text-muted-foreground italic p-3">
              Nenhum lance ainda.
            </p>
          ) : (
            <table className="w-full text-sm">
              <tbody>
                {pairs.map((p) => (
                  <tr key={p.num} className={cn("border-b last:border-0")}>
                    <td className="px-2 py-1 text-xs text-muted-foreground w-8">{p.num}.</td>
                    <td className="px-2 py-1 font-mono">{p.w ?? ""}</td>
                    <td className="px-2 py-1 font-mono">{p.b ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {canResign && (
        <Button variant="destructive" onClick={onResign} className="cursor-pointer gap-2">
          <Flag size={14} />
          Desistir
        </Button>
      )}
    </Card>
  );
}
