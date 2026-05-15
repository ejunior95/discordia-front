import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CHESS_LEVELS,
  type ChessLevel,
} from "../chess.constants";
import type { ChessSide } from "../types";

interface ChessSetupProps {
  onStart: (params: { userSide: ChessSide; level: ChessLevel }) => void;
}

type SideChoice = "w" | "b" | "random";

export function ChessSetup({ onStart }: ChessSetupProps) {
  const [side, setSide] = useState<SideChoice>("w");
  const [level, setLevel] = useState<ChessLevel>("casual");

  const handleStart = () => {
    const resolved: ChessSide = side === "random" ? (Math.random() < 0.5 ? "w" : "b") : side;
    onStart({ userSide: resolved, level });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Label className="mb-2 block text-sm font-medium">Você joga com</Label>
        <div className="grid grid-cols-3 gap-2">
          {([
            { value: "w", label: "Brancas", emoji: "♔" },
            { value: "random", label: "Aleatório", emoji: "🎲" },
            { value: "b", label: "Pretas", emoji: "♚" },
          ] as { value: SideChoice; label: string; emoji: string }[]).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSide(opt.value)}
              className={cn(
                "py-4 rounded-lg border-2 transition cursor-pointer flex flex-col items-center gap-1",
                side === opt.value
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50",
              )}
            >
              <span className="text-3xl">{opt.emoji}</span>
              <span className="text-xs sm:text-sm font-medium">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label className="mb-2 block text-sm font-medium">Dificuldade da IA</Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {(Object.entries(CHESS_LEVELS) as [ChessLevel, (typeof CHESS_LEVELS)[ChessLevel]][]).map(
            ([key, val]) => (
              <button
                key={key}
                type="button"
                onClick={() => setLevel(key)}
                className={cn(
                  "p-3 rounded-lg border-2 transition cursor-pointer text-left",
                  level === key
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50",
                )}
              >
                <p className="font-semibold text-sm">{val.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{val.description}</p>
              </button>
            ),
          )}
        </div>
      </div>

      <Button
        onClick={handleStart}
        className="py-6 text-base sm:text-lg font-semibold bg-green-600! text-white! hover:bg-green-700! cursor-pointer gap-2"
      >
        <Play className="fill-current" size={18} />
        Iniciar partida
      </Button>
    </div>
  );
}
