import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { askToOne } from "@/services/main.service";
import type { ScoreboardAgent } from "@/custom-components/GameScoreboard";
import {
  HANGMAN_STORAGE_KEY,
  MAX_WRONG,
  TOTAL_WORDS,
  buildIAGuessPrompt,
  buildIAWordPrompt,
  getCategoryLabel,
  normalizeWord,
} from "../hangman.constants";
import type {
  HangmanGame,
  HangmanMode,
  HangmanRound,
} from "../types";

function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function buildPattern(word: string, tried: string[]): string {
  return word
    .split("")
    .map((ch) => (ch === " " ? " " : tried.includes(ch) ? ch : "_"))
    .join("");
}

function isWordRevealed(word: string, tried: string[]): boolean {
  return word
    .split("")
    .every((ch) => ch === " " || tried.includes(ch));
}

function loadFromStorage(): HangmanGame | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(HANGMAN_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as HangmanGame;
  } catch {
    return null;
  }
}

interface StartParams {
  ia: ScoreboardAgent;
  mode: HangmanMode;
  category: string;
  /** Apenas para modo "chooser". */
  word?: string;
}

export function useHangmanGame() {
  const [game, setGame] = useState<HangmanGame | null>(() => loadFromStorage());
  const [isBusy, setIsBusy] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    try {
      if (game) localStorage.setItem(HANGMAN_STORAGE_KEY, JSON.stringify(game));
      else localStorage.removeItem(HANGMAN_STORAGE_KEY);
    } catch {
      /* ignore quota */
    }
  }, [game]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsBusy(false);
  }, []);

  const fetchIAWord = useCallback(
    async (ia: ScoreboardAgent, category: string, usedWords: string[]): Promise<string> => {
      const controller = new AbortController();
      abortRef.current = controller;
      const prompt = buildIAWordPrompt(getCategoryLabel(category), usedWords);
      const res = await askToOne(prompt, ia, controller.signal);
      const raw = res?.data?.response ?? "";
      const word = normalizeWord(raw);
      if (word.length < 3 || word.length > 16 || /\s/.test(word)) {
        throw new Error("A IA não retornou uma palavra válida.");
      }
      return word;
    },
    [],
  );

  const start = useCallback(
    async ({ ia, mode, category, word }: StartParams) => {
      cancel();
      let firstWord = "";

      if (mode === "chooser") {
        firstWord = normalizeWord(word ?? "");
        if (!firstWord) throw new Error("Digite uma palavra válida.");
      } else {
        setIsBusy(true);
        try {
          firstWord = await fetchIAWord(ia, category, []);
        } catch (err) {
          setIsBusy(false);
          if (axios.isCancel(err)) return;
          throw err;
        }
        setIsBusy(false);
      }

      const firstRound: HangmanRound = {
        index: 1,
        word: firstWord,
        triedLetters: [],
        wrongLetters: [],
        status: "playing",
      };

      setGame({
        id: generateId(),
        ia,
        mode,
        category,
        status: "playing",
        userScore: 0,
        iaScore: 0,
        rounds: [firstRound],
        currentRound: 1,
        createdAt: new Date().toISOString(),
      });
    },
    [cancel, fetchIAWord],
  );

  const reset = useCallback(() => {
    cancel();
    setGame(null);
  }, [cancel]);

  const updateCurrentRound = useCallback(
    (updater: (round: HangmanRound, game: HangmanGame) => HangmanRound) => {
      setGame((current) => {
        if (!current) return current;
        return {
          ...current,
          rounds: current.rounds.map((r) =>
            r.index === current.currentRound ? updater(r, current) : r,
          ),
        };
      });
    },
    [],
  );

  /** Para o modo "guesser": usuário chuta uma letra. */
  const guessLetter = useCallback(
    (letterRaw: string) => {
      const letter = letterRaw.toUpperCase();
      if (!/^[A-Z]$/.test(letter)) return;
      setGame((current) => {
        if (!current || current.status !== "playing") return current;
        const round = current.rounds.find((r) => r.index === current.currentRound);
        if (!round || round.status !== "playing") return current;
        if (round.triedLetters.includes(letter)) return current;

        const tried = [...round.triedLetters, letter];
        const isWrong = !round.word.includes(letter);
        const wrong = isWrong ? [...round.wrongLetters, letter] : round.wrongLetters;

        let status: HangmanRound["status"] = "playing";
        let userScoreDelta = 0;
        let iaScoreDelta = 0;
        if (wrong.length >= MAX_WRONG) {
          status = "lost";
          iaScoreDelta = 1;
        } else if (isWordRevealed(round.word, tried)) {
          status = "won";
          userScoreDelta = 1;
        }

        const finished = status !== "playing" && current.currentRound >= TOTAL_WORDS;

        return {
          ...current,
          userScore: current.userScore + userScoreDelta,
          iaScore: current.iaScore + iaScoreDelta,
          status: finished ? "finished" : current.status,
          rounds: current.rounds.map((r) =>
            r.index === current.currentRound
              ? { ...r, triedLetters: tried, wrongLetters: wrong, status }
              : r,
          ),
        };
      });
    },
    [],
  );

  /** Para o modo "chooser": IA chuta uma letra. */
  const requestIAGuess = useCallback(async () => {
    if (!game || game.status !== "playing" || game.mode !== "chooser" || isBusy) return;
    const round = game.rounds.find((r) => r.index === game.currentRound);
    if (!round || round.status !== "playing") return;

    setIsBusy(true);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const prompt = buildIAGuessPrompt({
        categoryLabel: getCategoryLabel(game.category),
        pattern: buildPattern(round.word, round.triedLetters),
        wrongLetters: round.wrongLetters,
        triedLetters: round.triedLetters,
      });
      const res = await askToOne(prompt, game.ia, controller.signal);
      const raw = (res?.data?.response ?? "").toUpperCase();
      const match = raw.match(/[A-Z]/);
      let letter = match?.[0] ?? "";
      // se a IA repetir letra já tentada, escolhemos uma alternativa heurística
      if (!letter || round.triedLetters.includes(letter)) {
        const fallback = "EAOSRINTLMCDUPGBVFHJQXZYWK"
          .split("")
          .find((l) => !round.triedLetters.includes(l));
        letter = fallback ?? "A";
      }

      const tried = [...round.triedLetters, letter];
      const isWrong = !round.word.includes(letter);
      const wrong = isWrong ? [...round.wrongLetters, letter] : round.wrongLetters;

      let status: HangmanRound["status"] = "playing";
      let userScoreDelta = 0;
      let iaScoreDelta = 0;
      if (wrong.length >= MAX_WRONG) {
        // No modo chooser, se a IA esgota tentativas: usuário (que escolheu palavra) vence o round
        status = "lost"; // do ponto de vista da IA: perdeu
        userScoreDelta = 1;
      } else if (isWordRevealed(round.word, tried)) {
        status = "won"; // IA descobriu
        iaScoreDelta = 1;
      }

      setGame((current) => {
        if (!current) return current;
        const finished = status !== "playing" && current.currentRound >= TOTAL_WORDS;
        return {
          ...current,
          userScore: current.userScore + userScoreDelta,
          iaScore: current.iaScore + iaScoreDelta,
          status: finished ? "finished" : current.status,
          rounds: current.rounds.map((r) =>
            r.index === current.currentRound
              ? {
                  ...r,
                  triedLetters: tried,
                  wrongLetters: wrong,
                  status,
                  pendingAIGuess: letter,
                  aiError: undefined,
                }
              : r,
          ),
        };
      });
    } catch (err) {
      if (axios.isCancel(err)) {
        // ignora
      } else {
        updateCurrentRound((r) => ({
          ...r,
          aiError:
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
            (err instanceof Error ? err.message : "Falha ao consultar IA."),
        }));
      }
    } finally {
      setIsBusy(false);
      abortRef.current = null;
    }
  }, [game, isBusy, updateCurrentRound]);

  /** Avança para a próxima palavra (ambos os modos). */
  const nextWord = useCallback(async () => {
    if (!game || game.status === "finished") return;
    const round = game.rounds.find((r) => r.index === game.currentRound);
    if (!round || round.status === "playing") return;
    if (game.currentRound >= TOTAL_WORDS) return;

    const nextIndex = game.currentRound + 1;
    let nextWordStr = "";

    if (game.mode === "guesser") {
      setIsBusy(true);
      try {
        const used = game.rounds.map((r) => r.word);
        nextWordStr = await fetchIAWord(game.ia, game.category, used);
      } catch (err) {
        setIsBusy(false);
        if (axios.isCancel(err)) return;
        throw err;
      }
      setIsBusy(false);
    }
    // No modo chooser, o usuário precisará fornecer a próxima palavra antes;
    // nextWord no chooser é tratado por `setChooserNextWord` abaixo.

    if (game.mode === "guesser" && nextWordStr) {
      setGame((current) => {
        if (!current) return current;
        return {
          ...current,
          currentRound: nextIndex,
          rounds: [
            ...current.rounds,
            {
              index: nextIndex,
              word: nextWordStr,
              triedLetters: [],
              wrongLetters: [],
              status: "playing",
            },
          ],
        };
      });
    }
  }, [game, fetchIAWord]);

  /** Modo chooser: usuário informa a próxima palavra para o round seguinte. */
  const setChooserNextWord = useCallback((word: string) => {
    const normalized = normalizeWord(word);
    if (!normalized) return;
    setGame((current) => {
      if (!current || current.mode !== "chooser") return current;
      if (current.currentRound >= TOTAL_WORDS) return current;
      const last = current.rounds[current.rounds.length - 1];
      if (last && last.status === "playing") return current;
      const nextIndex = current.currentRound + 1;
      return {
        ...current,
        currentRound: nextIndex,
        rounds: [
          ...current.rounds,
          {
            index: nextIndex,
            word: normalized,
            triedLetters: [],
            wrongLetters: [],
            status: "playing",
          },
        ],
      };
    });
  }, []);

  const currentRound = game?.rounds.find((r) => r.index === game.currentRound);
  const pattern = currentRound ? buildPattern(currentRound.word, currentRound.triedLetters) : "";

  return {
    game,
    isBusy,
    currentRound,
    pattern,
    actions: {
      start,
      reset,
      cancel,
      guessLetter,
      requestIAGuess,
      nextWord,
      setChooserNextWord,
    },
  };
}
