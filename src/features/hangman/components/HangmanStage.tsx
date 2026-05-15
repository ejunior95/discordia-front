import { cn } from "@/lib/utils";
import { MAX_WRONG } from "../hangman.constants";

interface HangmanStageProps {
  wrongCount: number;
  className?: string;
}

/**
 * SVG progressivo da forca. Cada erro revela uma parte:
 *  1: cabeça | 2: tronco | 3: braço esq | 4: braço dir | 5: perna esq | 6: perna dir
 */
export function HangmanStage({ wrongCount, className }: HangmanStageProps) {
  const c = Math.min(wrongCount, MAX_WRONG);
  return (
    <svg
      viewBox="0 0 200 240"
      className={cn("w-full h-full text-foreground", className)}
      xmlns="http://www.w3.org/2000/svg"
      aria-label={`Forca: ${c} de ${MAX_WRONG} erros`}
      role="img"
    >
      {/* base / poste / trave / corda — sempre visíveis */}
      <g stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none">
        <line x1="20" y1="225" x2="160" y2="225" />
        <line x1="50" y1="225" x2="50" y2="20" />
        <line x1="50" y1="20" x2="140" y2="20" />
        <line x1="140" y1="20" x2="140" y2="45" />
      </g>

      {/* boneco */}
      <g
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        className="text-destructive"
      >
        {/* cabeça */}
        {c >= 1 && <circle cx="140" cy="62" r="18" />}
        {/* tronco */}
        {c >= 2 && <line x1="140" y1="80" x2="140" y2="140" />}
        {/* braço esquerdo */}
        {c >= 3 && <line x1="140" y1="95" x2="118" y2="120" />}
        {/* braço direito */}
        {c >= 4 && <line x1="140" y1="95" x2="162" y2="120" />}
        {/* perna esquerda */}
        {c >= 5 && <line x1="140" y1="140" x2="120" y2="175" />}
        {/* perna direita */}
        {c >= 6 && <line x1="140" y1="140" x2="160" y2="175" />}

        {/* X nos olhos quando morto */}
        {c >= MAX_WRONG && (
          <g strokeWidth="3">
            <line x1="132" y1="56" x2="138" y2="62" />
            <line x1="138" y1="56" x2="132" y2="62" />
            <line x1="142" y1="56" x2="148" y2="62" />
            <line x1="148" y1="56" x2="142" y2="62" />
          </g>
        )}
      </g>
    </svg>
  );
}
