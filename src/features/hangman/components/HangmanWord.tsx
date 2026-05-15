import { cn } from "@/lib/utils";

interface HangmanWordProps {
  word: string;
  tried: string[];
  /** Quando true, mostra todas as letras (fim de round). */
  reveal?: boolean;
  className?: string;
}

export function HangmanWord({ word, tried, reveal = false, className }: HangmanWordProps) {
  const words = word.split(" ");
  return (
    <div className={cn("flex flex-wrap justify-center gap-x-4 gap-y-3", className)}>
      {words.map((w, wi) => (
        <div key={wi} className="flex gap-1 sm:gap-2">
          {w.split("").map((ch, i) => {
            const revealed = reveal || tried.includes(ch);
            return (
              <div
                key={`${wi}-${i}`}
                className={cn(
                  "h-10 w-7 sm:h-12 sm:w-9 md:h-14 md:w-11",
                  "flex items-end justify-center pb-1",
                  "border-b-2 border-foreground/80",
                  "text-xl sm:text-2xl md:text-3xl font-extrabold tracking-wider",
                  revealed
                    ? reveal && !tried.includes(ch)
                      ? "text-destructive"
                      : "text-foreground"
                    : "text-transparent",
                )}
              >
                {revealed ? ch : "_"}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
