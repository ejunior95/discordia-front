import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LETTERS } from "../hangman.constants";

interface HangmanKeyboardProps {
  word: string;
  tried: string[];
  disabled?: boolean;
  onGuess: (letter: string) => void;
}

export function HangmanKeyboard({ word, tried, disabled, onGuess }: HangmanKeyboardProps) {
  useEffect(() => {
    if (disabled) return;
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      const k = e.key.toUpperCase();
      if (/^[A-Z]$/.test(k) && !tried.includes(k)) {
        onGuess(k);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [disabled, tried, onGuess]);

  return (
    <div
      className={cn(
        "grid gap-1 w-full",
        "grid-cols-7 sm:grid-cols-9 md:grid-cols-13",
      )}
    >
      {LETTERS.map((l) => {
        const isTried = tried.includes(l);
        const isCorrect = isTried && word.includes(l);
        const isWrong = isTried && !word.includes(l);
        return (
          <Button
            key={l}
            variant="outline"
            disabled={disabled || isTried}
            onClick={() => onGuess(l)}
            className={cn(
              "h-10 sm:h-11 md:h-12 p-0 text-md font-extrabold cursor-pointer select-none",
              "transition-colors!",
              isCorrect && "bg-emerald-500/20! border-emerald-400! text-emerald-600 dark:text-emerald-400",
              isWrong && "bg-destructive/20! border-destructive! text-destructive",
            )}
          >
            {l}
          </Button>
        );
      })}
    </div>
  );
}
