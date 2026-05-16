import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { askGameAction } from "@/services/main.service";
import type { ScoreboardAgent } from "@/custom-components/GameScoreboard";
import {
  JOKENPO_STORAGE_KEY,
  WIN_SCORE,
  decideWinner,
  parseAIChoice,
  randomChoice,
  type JokenpoChoice,
} from "../jokenpo.constants";
import type { JokenpoGame, JokenpoRound } from "../types";

function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function loadFromStorage(): JokenpoGame | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(JOKENPO_STORAGE_KEY);
    if (!raw) return null;
    const g = JSON.parse(raw) as JokenpoGame;
    // Sanitiza estado "revealing" pendente.
    if (g.status === "revealing") g.status = "playing";
    return g;
  } catch {
    return null;
  }
}

const REVEAL_DELAY_MS = 1200;

export function useJokenpoGame() {
  const [game, setGame] = useState<JokenpoGame | null>(() => loadFromStorage());
  const abortRef = useRef<AbortController | null>(null);
  const playingRef = useRef(false);

  useEffect(() => {
    try {
      if (game) localStorage.setItem(JOKENPO_STORAGE_KEY, JSON.stringify(game));
      else localStorage.removeItem(JOKENPO_STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, [game]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const start = useCallback((ia: ScoreboardAgent) => {
    abortRef.current?.abort();
    playingRef.current = false;
    setGame({
      id: generateId(),
      ia,
      userScore: 0,
      iaScore: 0,
      rounds: [],
      status: "playing",
      createdAt: new Date().toISOString(),
    });
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    playingRef.current = false;
    setGame(null);
  }, []);

  const playRound = useCallback(
    async (choice: JokenpoChoice) => {
      if (!game || playingRef.current) return;
      if (game.status !== "playing") return;
      playingRef.current = true;

      const controller = new AbortController();
      abortRef.current = controller;

      // Fase 1: reveal animation (sem ai ainda)
      setGame((prev) =>
        prev
          ? {
              ...prev,
              status: "revealing",
              lastUserChoice: choice,
              lastAiChoice: undefined,
            }
          : prev,
      );

      let aiChoice: JokenpoChoice;
      try {
        const res = await askGameAction('jokenpo', game.ia, {
          history: game.rounds.map((r) => ({ user: r.user, ai: r.ai })),
        }, controller.signal);
        aiChoice = parseAIChoice(res?.data?.response ?? "") ?? randomChoice();
      } catch (err) {
        if (axios.isCancel(err)) {
          playingRef.current = false;
          return;
        }
        aiChoice = randomChoice();
      }

      // Pequeno atraso visual para a animação
      await new Promise((r) => setTimeout(r, REVEAL_DELAY_MS));

      const outcome = decideWinner(choice, aiChoice);
      setGame((prev) => {
        if (!prev) return prev;
        const nextRound: JokenpoRound = {
          index: prev.rounds.length + 1,
          user: choice,
          ai: aiChoice,
          outcome,
        };
        const userScore = prev.userScore + (outcome === "user" ? 1 : 0);
        const iaScore = prev.iaScore + (outcome === "ai" ? 1 : 0);
        const reachedWin = userScore >= WIN_SCORE || iaScore >= WIN_SCORE;
        return {
          ...prev,
          rounds: [...prev.rounds, nextRound],
          userScore,
          iaScore,
          lastAiChoice: aiChoice,
          status: reachedWin ? "finished" : "playing",
        };
      });

      playingRef.current = false;
      abortRef.current = null;
    },
    [game],
  );

  return {
    game,
    start,
    reset,
    playRound,
    isPlaying: playingRef.current,
  };
}
