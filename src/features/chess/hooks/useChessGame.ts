import { useCallback, useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import axios from "axios";
import { askGameAction } from "@/services/main.service";
import type { ScoreboardAgent } from "@/custom-components/GameScoreboard";
import {
  CHESS_STORAGE_KEY,
  type ChessLevel,
} from "../chess.constants";
import type { ChessGame, ChessSide, ChessStatus } from "../types";

function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function loadFromStorage(): ChessGame | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CHESS_STORAGE_KEY);
    if (!raw) return null;
    const game = JSON.parse(raw) as ChessGame;
    // Sanitiza estado "ai-thinking" residual de sessão anterior.
    if (game.status === "ai-thinking") game.status = "user-turn";
    return game;
  } catch {
    return null;
  }
}

function computeStatus(chess: Chess, userSide: ChessSide): ChessStatus {
  if (chess.isCheckmate()) {
    return chess.turn() === userSide ? "lost" : "won";
  }
  if (chess.isDraw() || chess.isStalemate() || chess.isInsufficientMaterial() || chess.isThreefoldRepetition()) {
    return "draw";
  }
  return chess.turn() === userSide ? "user-turn" : "ai-thinking";
}

function gameFromChess(prev: ChessGame, chess: Chess, extras?: Partial<ChessGame>): ChessGame {
  return {
    ...prev,
    fen: chess.fen(),
    pgn: chess.pgn(),
    moves: chess.history(),
    status: computeStatus(chess, prev.userSide),
    ...extras,
  };
}

interface StartParams {
  ia: ScoreboardAgent;
  userSide: ChessSide;
  level: ChessLevel;
}

export function useChessGame() {
  const [game, setGame] = useState<ChessGame | null>(() => loadFromStorage());
  const chessRef = useRef<Chess>(new Chess(game?.fen));
  const abortRef = useRef<AbortController | null>(null);
  const requestingRef = useRef(false);

  // mantém chess.js em sincronia com o estado atual
  useEffect(() => {
    if (game) {
      try {
        chessRef.current = new Chess(game.fen);
      } catch {
        chessRef.current = new Chess();
      }
    } else {
      chessRef.current = new Chess();
    }
  }, [game?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    try {
      if (game) sessionStorage.setItem(CHESS_STORAGE_KEY, JSON.stringify(game));
      else sessionStorage.removeItem(CHESS_STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, [game]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const start = useCallback(({ ia, userSide, level }: StartParams) => {
    abortRef.current?.abort();
    requestingRef.current = false;
    const chess = new Chess();
    chessRef.current = chess;
    const initialStatus: ChessStatus = userSide === "w" ? "user-turn" : "ai-thinking";
    setGame({
      id: generateId(),
      ia,
      userSide,
      level,
      fen: chess.fen(),
      pgn: chess.pgn(),
      moves: [],
      status: initialStatus,
      createdAt: new Date().toISOString(),
    });
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    requestingRef.current = false;
    setGame(null);
  }, []);

  const requestAIMove = useCallback(
    async (lastInvalid?: string) => {
      if (requestingRef.current) return;
      const current = game;
      if (!current) return;
      const chess = chessRef.current;
      if (chess.turn() === current.userSide) return;
      if (chess.isGameOver()) return;

      requestingRef.current = true;
      const controller = new AbortController();
      abortRef.current = controller;

      setGame((prev) => (prev ? { ...prev, status: "ai-thinking", aiError: undefined } : prev));

      const aiSide: ChessSide = current.userSide === "w" ? "b" : "w";

      try {
        const res = await askGameAction('chess', current.ia, {
          fen: chess.fen(),
          pgn: chess.pgn(),
          side: aiSide,
          level: current.level,
          lastInvalid,
        }, controller.signal);
        const raw = (res?.data?.response ?? "").trim();
        // Pega o primeiro token que parece um SAN
        const token = raw.split(/\s+/).find((t) => /^[a-zA-Z][a-zA-Z0-9+#=x/-]*$/.test(t)) ?? raw;
        // Remove anotação típica (! ? +# já são aceitos por chess.js)
        const cleaned = token.replace(/[!?]/g, "");

        let move;
        try {
          move = chess.move(cleaned);
        } catch {
          move = null;
        }

        if (!move) {
          // tenta um fallback: lance legal aleatório
          const legal = chess.moves();
          if (legal.length === 0) {
            requestingRef.current = false;
            setGame((prev) => (prev ? gameFromChess(prev, chess) : prev));
            return;
          }
          if (!lastInvalid) {
            // Uma retentativa com aviso à IA
            requestingRef.current = false;
            await requestAIMove(cleaned);
            return;
          }
          const rand = legal[Math.floor(Math.random() * legal.length)];
          chess.move(rand);
          setGame((prev) =>
            prev
              ? gameFromChess(prev, chess, {
                  aiError: `Resposta inválida da IA ("${cleaned}"). Lance aleatório usado: ${rand}.`,
                })
              : prev,
          );
        } else {
          setGame((prev) => (prev ? gameFromChess(prev, chess) : prev));
        }
      } catch (err) {
        if (!axios.isCancel(err)) {
          setGame((prev) =>
            prev
              ? {
                  ...prev,
                  status: "user-turn",
                  aiError:
                    (err as { response?: { data?: { message?: string } } })?.response?.data
                      ?.message ??
                    (err instanceof Error ? err.message : "Falha ao consultar IA."),
                }
              : prev,
          );
        }
      } finally {
        requestingRef.current = false;
        abortRef.current = null;
      }
    },
    [game],
  );

  // Dispara automaticamente a jogada da IA quando for a vez dela
  useEffect(() => {
    if (!game) return;
    if (game.status === "ai-thinking" && !requestingRef.current) {
      void requestAIMove();
    }
  }, [game, requestAIMove]);

  const tryUserMove = useCallback(
    (from: string, to: string, promotion: string = "q"): boolean => {
      if (!game) return false;
      const chess = chessRef.current;
      if (chess.turn() !== game.userSide) return false;
      let move;
      try {
        move = chess.move({ from, to, promotion });
      } catch {
        return false;
      }
      if (!move) return false;
      setGame((prev) => (prev ? gameFromChess(prev, chess) : prev));
      return true;
    },
    [game],
  );

  const resign = useCallback(() => {
    if (!game) return;
    setGame((prev) => (prev ? { ...prev, status: "lost" } : prev));
  }, [game]);

  return {
    game,
    tryUserMove,
    reset,
    start,
    resign,
    retryAI: () => void requestAIMove(),
  };
}
