import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { CurrentUser } from "@/contexts/AuthContext";
import { formatFallbackAvatarStr } from "@/utils/globalFunctions";
import { Crown, Minus, Swords, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAgentDisplay } from "@/hooks/useAgentDisplay";

export type ScoreboardAgent = "gemini" | "grok" | "deepseek" | "chat-gpt";
export type ScoreboardStatus = "idle" | "playing" | "finished";
export type ScoreboardResult = "win" | "lose" | "draw";

const IA_ACCENT: Record<ScoreboardAgent, string> = {
  gemini: "from-blue-500/30 to-blue-500/0",
  grok: "from-amber-500/30 to-amber-500/0",
  deepseek: "from-indigo-500/30 to-indigo-500/0",
  "chat-gpt": "from-emerald-500/30 to-emerald-500/0",
};

export interface GameScoreboardProps {
  user: CurrentUser;
  ia: ScoreboardAgent;
  userScore: number;
  iaScore: number;
  /** Round atual (1-based). Em 'finished', use o último round jogado. */
  round: number;
  /** Total de rounds da partida. Use 1 para jogos como xadrez. */
  totalRounds: number;
  status?: ScoreboardStatus;
  /** Quando status === 'finished', define o badge central. */
  result?: ScoreboardResult;
  /** Subtítulo opcional do jogo (ex.: "Forca · Melhor de 3"). */
  gameLabel?: string;
  className?: string;
}

export function GameScoreboard({
  user,
  ia,
  userScore,
  iaScore,
  round,
  totalRounds,
  status = "playing",
  result,
  gameLabel,
  className,
}: GameScoreboardProps) {
  const meta = useAgentDisplay(ia);
  const IAIcon = meta.Icon;
  const accent = IA_ACCENT[ia];

  const safeTotal = Math.max(totalRounds, 1);
  const safeRound = Math.min(Math.max(round, 1), safeTotal);

  const userLeads = userScore > iaScore;
  const iaLeads = iaScore > userScore;

  return (
    <div className={cn("w-full flex justify-center px-2 sm:px-4", className)}>
      <div
        className={cn(
          "relative w-full max-w-3xl rounded-2xl border bg-card text-card-foreground shadow-md",
          "overflow-hidden",
        )}
      >
        {/* Faixas de acento laterais */}
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-linear-to-r opacity-60",
            userLeads ? "from-primary/25 to-transparent" : "from-muted/40 to-transparent",
          )}
          aria-hidden
        />
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-linear-to-l opacity-60",
            iaLeads ? accent : "from-muted/40 to-transparent",
          )}
          aria-hidden
        />

        {gameLabel && (
          <div className="relative pt-2 pb-0 text-center">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
              {gameLabel}
            </span>
          </div>
        )}

        <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-1 sm:gap-4 px-2 sm:px-6 py-3 sm:py-4">
          {/* Lado do usuário */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 justify-center sm:justify-start min-w-0">
            <Avatar className="h-9 w-9 sm:h-11 sm:w-11 ring-2 ring-primary/30 shrink-0">
              <AvatarImage
                src={user?.avatar}
                alt={user?.name}
                className="object-cover object-center"
              />
              <AvatarFallback>{formatFallbackAvatarStr(user)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 items-center sm:items-start text-center sm:text-left">
              <span className="truncate text-xs sm:text-sm font-semibold leading-tight flex items-center gap-1 justify-center sm:justify-start">
                {userLeads && status === "playing" && (
                  <Crown size={12} className="text-amber-500 shrink-0" />
                )}
                {user?.name?.split(" ")[0] ?? "Você"}
              </span>
              <span className="text-[10px] sm:text-xs text-muted-foreground truncate hidden sm:block">
                Você
              </span>
            </div>
            <div className="mt-1 sm:mt-0 sm:ml-auto">
              <ScoreNumber value={userScore} highlight={userLeads} />
            </div>
          </div>

          {/* Centro: VS / Round / Pips */}
          <div className="flex flex-col items-center gap-1 px-1 sm:px-2 min-w-16 sm:min-w-30">
            {status === "finished" ? (
              <FinishedBadge result={result ?? "draw"} />
            ) : (
              <>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Swords size={14} className="hidden sm:block" />
                  <span className="text-[10px] sm:text-xs uppercase tracking-widest font-semibold">
                    {safeTotal > 1 ? `Round ${safeRound}/${safeTotal}` : "Partida"}
                  </span>
                </div>
                <RoundPips current={safeRound} total={safeTotal} status={status} />
              </>
            )}
          </div>

          {/* Lado da IA */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 justify-center sm:justify-end min-w-0">
            {/* Pontuação da IA: última na estrutura do desktop, mas ganha order-3 no mobile */}
            <div className="mt-1 sm:mt-0 order-3 sm:order-1 sm:mr-auto">
              <ScoreNumber value={iaScore} highlight={iaLeads} side="right" />
            </div>
            
            {/* Nome da IA */}
            <div className="flex flex-col min-w-0 items-center sm:items-end text-center sm:text-right order-2 sm:order-2">
              <span className="truncate text-xs sm:text-sm font-semibold leading-tight flex items-center gap-1 justify-center sm:justify-end">
                {iaLeads && status === "playing" && (
                  <Crown size={12} className="text-amber-500 shrink-0" />
                )}
                {meta.label}
              </span>
              <span className="text-[10px] sm:text-xs text-muted-foreground truncate hidden sm:block">
                {meta.model}
              </span>
            </div>

            {/* Avatar da IA: primeiro no mobile (order-1), último no desktop (sm:order-3) */}
            <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-full bg-muted flex items-center justify-center ring-2 ring-muted-foreground/20 shrink-0 order-1 sm:order-3">
              <IAIcon size={22} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreNumber({
  value,
  highlight,
  side = "left",
}: {
  value: number;
  highlight: boolean;
  side?: "left" | "right";
}) {
  return (
    <span
      className={cn(
        "tabular-nums font-extrabold leading-none select-none",
        "text-2xl sm:text-3xl md:text-4xl",
        highlight ? "text-foreground" : "text-muted-foreground/70",
        "text-center",
        side === "right" ? "sm:text-left" : "sm:text-right",
      )}
    >
      {value}
    </span>
  );
}

function RoundPips({
  current,
  total,
  status,
}: {
  current: number;
  total: number;
  status: ScoreboardStatus;
}) {
  if (total <= 1) return null;
  const pips = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <div className="flex items-center gap-1">
      {pips.map((i) => {
        const isPast = i < current;
        const isActive = i === current && status === "playing";
        return (
          <span
            key={i}
            className={cn(
              "h-1.5 rounded-full transition-all",
              isActive
                ? "w-4 bg-primary"
                : isPast
                  ? "w-2 bg-muted-foreground/60"
                  : "w-2 bg-muted-foreground/20",
            )}
            aria-hidden
          />
        );
      })}
    </div>
  );
}

function FinishedBadge({ result }: { result: ScoreboardResult }) {
  if (result === "draw") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-muted text-muted-foreground px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
        <Minus size={12} />
        Empate
      </span>
    );
  }
  if (result === "win") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 text-amber-950 px-2.5 py-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
        <Trophy size={12} />
        Vitória
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-destructive text-destructive-foreground px-2.5 py-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
      Derrota
    </span>
  );
}