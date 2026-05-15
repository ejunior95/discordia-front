import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getChoiceMeta, type JokenpoChoice } from "../jokenpo.constants";
import type { JokenpoGame } from "../types";
import { Loader2 } from "lucide-react";

interface JokenpoArenaProps {
  game: JokenpoGame;
}

function SideCard({
  label,
  choice,
  revealing,
  align,
  highlight,
}: {
  label: string;
  choice?: JokenpoChoice;
  revealing: boolean;
  align: "left" | "right";
  highlight?: boolean;
}) {
  const meta = choice ? getChoiceMeta(choice) : undefined;
  return (
    <Card
      className={cn(
        "p-4 sm:p-6 flex flex-col items-center gap-3 transition-all",
        highlight && "ring-2 ring-primary",
      )}
    >
      <p
        className={cn(
          "text-xs uppercase tracking-widest text-muted-foreground w-full",
          align === "right" ? "text-right" : "text-left",
        )}
      >
        {label}
      </p>
      <div
        className={cn(
          "h-24 sm:h-32 md:h-36 flex items-center justify-center text-6xl sm:text-7xl md:text-8xl",
          revealing && "animate-jokenpo-shake",
        )}
      >
        {revealing && !meta ? (
          <Loader2 className="animate-spin text-muted-foreground" size={48} />
        ) : meta ? (
          <span>{meta.emoji}</span>
        ) : (
          <span className="text-muted-foreground/40">?</span>
        )}
      </div>
      <p className="text-sm sm:text-base font-semibold min-h-[1.5rem]">
        {meta?.label ?? "—"}
      </p>
    </Card>
  );
}

export function JokenpoArena({ game }: JokenpoArenaProps) {
  const lastRound = game.rounds[game.rounds.length - 1];
  const isRevealing = game.status === "revealing";

  const userHighlight = !isRevealing && lastRound?.outcome === "user";
  const aiHighlight = !isRevealing && lastRound?.outcome === "ai";

  const banner = isRevealing
    ? "Revelando..."
    : lastRound
      ? lastRound.outcome === "user"
        ? "Você venceu o round!"
        : lastRound.outcome === "ai"
          ? "A IA venceu o round."
          : "Empate no round."
      : "Escolha sua jogada para começar.";

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
        <SideCard
          label="Você"
          choice={game.lastUserChoice}
          revealing={isRevealing}
          align="left"
          highlight={userHighlight}
        />
        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl sm:text-4xl font-extrabold tracking-tight text-muted-foreground">
            VS
          </span>
        </div>
        <SideCard
          label="IA"
          choice={isRevealing ? undefined : game.lastAiChoice}
          revealing={isRevealing}
          align="right"
          highlight={aiHighlight}
        />
      </div>

      <p
        className={cn(
          "text-center text-sm sm:text-base font-semibold py-2 px-4 rounded-md",
          isRevealing
            ? "bg-muted text-muted-foreground"
            : lastRound?.outcome === "user"
              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
              : lastRound?.outcome === "ai"
                ? "bg-destructive/15 text-destructive"
                : lastRound?.outcome === "draw"
                  ? "bg-muted text-foreground"
                  : "bg-muted/50 text-muted-foreground",
        )}
      >
        {banner}
      </p>
    </div>
  );
}
