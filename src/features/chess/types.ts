import type { ScoreboardAgent } from "@/custom-components/GameScoreboard";
import type { ChessLevel } from "./chess.constants";

export type ChessSide = "w" | "b";
export type ChessStatus =
  | "idle"
  | "user-turn"
  | "ai-thinking"
  | "won"
  | "lost"
  | "draw";

export interface ChessGame {
  id: string;
  ia: ScoreboardAgent;
  userSide: ChessSide;
  level: ChessLevel;
  fen: string;
  pgn: string;
  status: ChessStatus;
  /** Mensagem opcional do último erro da IA. */
  aiError?: string;
  /** Lances no histórico (SAN). */
  moves: string[];
  createdAt: string;
}
