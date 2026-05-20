import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { LyricsWordTiming } from '../types';

interface KaraokeLyricsProps {
  content: string;
  timings: LyricsWordTiming[];
  currentTime: number;
  className?: string;
}

interface Token {
  text: string;
  isWord: boolean;
  /** Índice no array de timings (apenas se isWord) */
  timingIndex?: number;
}

interface Line {
  tokens: Token[];
}

/**
 * Quebra o conteúdo (já sanitizado) em linhas e tokens, associando cada
 * palavra reconhecida ao seu índice em `timings` na ordem em que aparece.
 *
 * As palavras são identificadas por uma regex Unicode (letras/dígitos/apóstrofo).
 * Pontuação fica como token "não palavra" e não recebe highlight.
 */
function parseLines(content: string, timingsLength: number): Line[] {
  const wordRegex = /[\p{L}\p{N}'’]+/gu;
  let timingCursor = 0;
  return content
    .split('\n')
    .map((line) => line.trim())
    .filter((l) => l.length > 0)
    .map((line): Line => {
      const tokens: Token[] = [];
      let lastIndex = 0;
      let match: RegExpExecArray | null;
      const re = new RegExp(wordRegex.source, 'gu');
      while ((match = re.exec(line)) !== null) {
        if (match.index > lastIndex) {
          tokens.push({ text: line.slice(lastIndex, match.index), isWord: false });
        }
        const wordToken: Token = { text: match[0], isWord: true };
        if (timingCursor < timingsLength) {
          wordToken.timingIndex = timingCursor;
          timingCursor += 1;
        }
        tokens.push(wordToken);
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < line.length) {
        tokens.push({ text: line.slice(lastIndex), isWord: false });
      }
      return { tokens };
    });
}

/**
 * Busca binária para encontrar o índice da palavra ativa no tempo atual.
 * Retorna -1 se nenhuma palavra começou ainda.
 *
 * Considera ativa a palavra cujo intervalo [start, end] contém currentTime,
 * ou a última palavra que terminou antes de currentTime (gap entre palavras).
 */
function findActiveIndex(timings: LyricsWordTiming[], currentTime: number): number {
  if (timings.length === 0) return -1;
  if (currentTime < timings[0].start) return -1;
  let lo = 0;
  let hi = timings.length - 1;
  let ans = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (timings[mid].start <= currentTime) {
      ans = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  // Pequena tolerância: se passamos do `end` por mais que ~600ms e
  // a próxima palavra ainda não começou, mantemos a anterior destacada.
  return ans;
}

export function KaraokeLyrics({ content, timings, currentTime, className }: KaraokeLyricsProps) {
  const lines = useMemo(() => parseLines(content, timings.length), [content, timings.length]);
  const activeIndex = useMemo(() => findActiveIndex(timings, currentTime), [timings, currentTime]);

  return (
    <div
      className={cn(
        'text-md leading-relaxed space-y-1 max-h-[40vh] overflow-y-auto overflow-x-hidden pr-1',
        className,
      )}
    >
      {lines.map((line, lineIdx) => (
        <p key={lineIdx} className="leading-relaxed">
          {line.tokens.map((token, tokenIdx) => {
            if (!token.isWord) {
              return (
                <span key={tokenIdx} style={{ whiteSpace: 'pre-wrap' }}>
                  {token.text}
                </span>
              );
            }
            const tIdx = token.timingIndex;
            const hasTiming = typeof tIdx === 'number';
            const isActive = hasTiming && tIdx === activeIndex;
            const isPast = hasTiming && activeIndex !== -1 && tIdx < activeIndex;
            const isFuture = hasTiming && (activeIndex === -1 || tIdx > activeIndex);
            return (
              <span
                key={tokenIdx}
                className={cn(
                  'inline-block transition-all duration-100 ease-out',
                  isActive &&
                    'bg-linear-to-r from-fuchsia-500 to-cyan-500 bg-clip-text underline text-transparent font-bold scale-140 drop-shadow-[0_0_8px_rgba(217,70,239,0.5)] px-3',
                  isPast && 'opacity-100',
                  isFuture && 'opacity-60',
                  !hasTiming && 'opacity-80',
                )}
              >
                {token.text}
              </span>
            );
          })}
        </p>
      ))}
    </div>
  );
}
