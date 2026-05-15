import type { ScoreboardAgent } from "@/custom-components/GameScoreboard";

export type HangmanMode = "chooser" | "guesser";
// chooser  -> usuário escolhe a palavra, IA tenta adivinhar
// guesser  -> IA escolhe a palavra, usuário tenta adivinhar

export type HangmanRoundStatus = "playing" | "won" | "lost";
export type HangmanGameStatus = "idle" | "playing" | "finished";

export interface HangmanRound {
  index: number; // 1-based
  word: string; // sempre A-Z em maiúsculas
  triedLetters: string[];
  wrongLetters: string[];
  status: HangmanRoundStatus;
  /** Letra que a IA acabou de chutar (no modo chooser). */
  pendingAIGuess?: string;
  /** Erro na chamada de IA do round atual (se houver). */
  aiError?: string;
}

export interface HangmanGame {
  id: string;
  ia: ScoreboardAgent;
  mode: HangmanMode;
  category: string;
  status: HangmanGameStatus;
  userScore: number;
  iaScore: number;
  rounds: HangmanRound[];
  currentRound: number; // 1-based
  createdAt: string;
}
