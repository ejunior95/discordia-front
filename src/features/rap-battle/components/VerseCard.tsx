import { Copy, RotateCcw, ThumbsUp, Trophy } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { IA_CONFIG } from '@/features/chat/chat.constants';
import { AudioPlayer, type AudioPlayerStatus } from '@/custom-components/AudioPlayer';
import type { AgentIA } from '@/features/chat/types';
import type { RapVerse } from '../types';

interface VerseCardProps {
  agent: AgentIA;
  verse?: RapVerse;
  side: 'left' | 'right';
  canVote: boolean;
  isWinner?: boolean;
  onVote: () => void;
  onRetry: () => void;
}

export function VerseCard({ agent, verse, side, canVote, isWinner, onVote, onRetry }: VerseCardProps) {
  const cfg = IA_CONFIG[agent];
  const Icon = cfg.Icon;
  const status = verse?.status ?? 'idle';
  const voted = (verse?.votes ?? 0) > 0;

  return (
    <Card
      className={cn(
        'flex flex-col min-h-72 transition-all border-2',
        side === 'left' ? 'border-fuchsia-500/30' : 'border-cyan-500/30',
        voted && 'ring-2 ring-amber-500',
        isWinner && 'ring-4 ring-amber-500 shadow-lg shadow-amber-500/20',
      )}
    >
      <CardHeader className="flex w-full items-center justify-between gap-3 space-y-0 pb-3">
        <div className={cn('rounded-full px-4 py-2 border w-full flex items-center gap-3', cfg.iconClass)}>
          <Icon size={30} />
          <div className="min-w-0">
            <p className="text-md font-semibold leading-tight truncate">{cfg.label}</p>
            <p className="text-sm truncate opacity-80">{cfg.subtitle}</p>
          </div>
        </div>
        {isWinner && (
          <span className="flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400 shrink-0">
            <Trophy size={14} /> Vencedor
          </span>
        )}
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        {status === 'idle' && <IdleState side={side} />}
        {status === 'loading' && <LoadingState />}
        {status === 'error' && <ErrorState message={verse?.error ?? 'Erro desconhecido'} />}
        {status === 'success' && verse && (
          <>
            <VerseLines content={verse.content} />
            {verse.audioStatus && verse.audioStatus !== 'idle' && (
              <AudioPlayer
                status={verse.audioStatus as AudioPlayerStatus}
                audioUrl={verse.audioUrl}
                error={verse.audioError}
                label="Gerando música..."
              />
            )}
          </>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-3 border-t gap-2">
        <Button
          variant={voted ? 'default' : 'outline'}
          size="sm"
          onClick={onVote}
          disabled={!canVote || status !== 'success'}
          className="cursor-pointer gap-1"
          aria-label={`Votar em ${cfg.label}`}
          aria-pressed={voted}
        >
          {voted ? 'Voto registrado' : 'Votar'}
          <ThumbsUp size={14} />
        </Button>
        <div className="flex items-center gap-1">
          {status === 'success' && verse && <CopyButton text={verse.content} />}
          {(status === 'error') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRetry}
              className="cursor-pointer h-8 w-8 p-0"
              aria-label="Gerar novamente"
              title="Gerar novamente"
            >
              <RotateCcw size={14} />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

function IdleState({ side }: { side: 'left' | 'right' }) {
  return (
    <div className="h-full min-h-40 flex items-center justify-center text-center text-sm text-muted-foreground px-4">
      <p>
        {side === 'left' ? 'MC da esquerda esquentando as cordas vocais digitais' : 'MC da direita organizando as rimas afiadas'}…
        <br />
        Clique em "Gerar round" para começar.
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-2 py-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-3 rounded bg-muted animate-pulse"
          style={{ width: `${60 + ((i * 7) % 35)}%` }}
        />
      ))}
      <p className="text-sm italic text-muted-foreground pt-2">Compondo rimas…</p>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return <p className="text-sm text-destructive wrap-break-word">{message}</p>;
}

function VerseLines({ content }: { content: string }) {
  const lines = content.split('\n').map((l) => l.trim()).filter(Boolean);
  return (
    <div className="text-md leading-relaxed space-y-1 max-h-[40vh] overflow-y-auto pr-1">
      {lines.map((line, i) => (
        <p
          key={i}
          className="opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards]"
          style={{ animationDelay: `${i * 140}ms` }}
        >
          {line}
        </p>
      ))}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className="cursor-pointer h-8 w-8 p-0"
      aria-label="Copiar verso"
      title={copied ? 'Copiado!' : 'Copiar verso'}
    >
      <Copy size={14} className={copied ? 'text-green-600' : undefined} />
    </Button>
  );
}
