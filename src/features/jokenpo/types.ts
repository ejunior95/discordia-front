import type { ScoreboardAgent } from "@/custom-components/GameScoreboard";
import type { JokenpoChoice } from "./jokenpo.constants";

export type JokenpoRoundOutcome = "user" | "ai" | "draw";

export interface JokenpoRound {
  index: number;
  user: JokenpoChoice;
  ai: JokenpoChoice;
  outcome: JokenpoRoundOutcome;
}

export type JokenpoStatus = "idle" | "playing" | "revealing" | "finished";

export interface JokenpoGame {
  id: string;
  ia: ScoreboardAgent;
  userScore: number;
  iaScore: number;
  rounds: JokenpoRound[];
  status: JokenpoStatus;
  lastUserChoice?: JokenpoChoice;
  lastAiChoice?: JokenpoChoice;
  createdAt: string;
}
