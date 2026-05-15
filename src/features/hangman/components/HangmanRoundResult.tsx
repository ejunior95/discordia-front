import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Trophy, Skull, Frown, Smile } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HangmanGame, HangmanRound } from "../types";

interface HangmanRoundResultProps {
  game: HangmanGame;
  round: HangmanRound;
  isLastWord: boolean;
  isBusy: boolean;
  onNextWord: () => void;
  onAskChooserNextWord: () => void; // abre input para próxima palavra (modo chooser)
}

export function HangmanRoundResult({
  game,
  round,
  isLastWord,
  isBusy,
  onNextWord,
  onAskChooserNextWord,
}: HangmanRoundResultProps) {
  // No modo guesser:  status "won" = usuário acertou.
  // No modo chooser:  status "won" = IA descobriu a palavra (usuário perde o round).
  const userWon =
    (game.mode === "guesser" && round.status === "won") ||
    (game.mode === "chooser" && round.status === "lost");

  const isDraw = round.status === "playing";
  if (isDraw) return null;

  return (
    <Card
      className={cn(
        "p-5 sm:p-6 border-2",
        userWon ? "border-emerald-500/60" : "border-destructive/60",
      )}
    >
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div
          className={cn(
            "h-14 w-14 sm:h-16 sm:w-16 rounded-full flex items-center justify-center shrink-0",
            userWon ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-destructive/15 text-destructive",
          )}
        >
          {userWon ? (
            game.mode === "guesser" ? <Trophy size={28} /> : <Smile size={28} />
          ) : (
            game.mode === "guesser" ? <Skull size={28} /> : <Frown size={28} />
          )}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-lg sm:text-xl font-bold">
            {userWon
              ? game.mode === "guesser"
                ? "Boa! Você descobriu a palavra."
                : "Quase! A IA não descobriu sua palavra."
              : game.mode === "guesser"
                ? "Que pena, a palavra venceu."
                : "A IA descobriu sua palavra!"}
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            A palavra era: <strong className="text-foreground">{round.word}</strong>
          </p>
        </div>
        {!isLastWord && (
          <Button
            onClick={game.mode === "guesser" ? onNextWord : onAskChooserNextWord}
            disabled={isBusy}
            className="cursor-pointer gap-2 w-full sm:w-auto"
          >
            Próxima palavra
            <ArrowRight size={16} />
          </Button>
        )}
      </div>
    </Card>
  );
}
