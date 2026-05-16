export const CHESS_STORAGE_KEY = "discordia-chess-game";

export type ChessLevel = "beginner" | "casual" | "hard";

export const CHESS_LEVELS: Record<
  ChessLevel,
  { label: string; description: string }
> = {
  beginner: {
    label: "Iniciante",
    description: "A IA joga lances simples e às vezes comete erros.",
  },
  casual: {
    label: "Casual",
    description: "Equilibrado — bom para uma partida descontraída.",
  },
  hard: {
    label: "Difícil",
    description: "A IA tenta jogar com precisão máxima.",
  },
};
