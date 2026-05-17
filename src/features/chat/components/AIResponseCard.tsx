import { useEffect, useState } from 'react';
import { Copy, RotateCcw, ThumbsUp, Trophy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { IA_CONFIG, LOADER_MESSAGES } from '../chat.constants';
import type { AgentIA, AIResponse } from '../types';

interface AIResponseCardProps {
  agent: AgentIA;
  response: AIResponse;
  isWinner: boolean;
  hasVoted: boolean;
  votingDisabled: boolean;
  onVote: () => void;
  onRetry: () => void;
}

export function AIResponseCard({ agent, response, isWinner, hasVoted, votingDisabled, onVote, onRetry }: AIResponseCardProps) {
  const config = IA_CONFIG[agent];
  const { Icon, label, subtitle, iconClass, accent } = config;

  return (
    <Card
      className={cn(
        'flex flex-col min-h-64 transition-all',
        isWinner && `ring-3 ring-amber-500 ${accent}`,
      )}
      aria-live={response.status === 'loading' ? 'polite' : undefined}
    >
      <CardHeader className="flex-row items-center gap-3 space-y-0 pb-3">
        <div className={cn('rounded-full px-4 py-2 border shrink-0 flex items-center justify-center gap-3', iconClass)}>
          <Icon size={24} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold leading-tight truncate">{label}</p>
            <p className="text-xs truncate">{subtitle}</p>
          </div>
        </div>
        <StatusBadge status={response.status} isWinner={isWinner} />
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        {response.status === 'loading' && <LoadingState />}
        {response.status === 'error' && (
          <ErrorState message={response.error ?? 'Erro desconhecido'} />
        )}
        {response.status === 'success' && response.message && (
          <p className="text-sm whitespace-pre-wrap wrap-break-word max-h-[40vh] overflow-y-auto pr-1">
            {response.message}
          </p>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-3 border-t gap-2">
        <Button
          variant={hasVoted ? 'default' : 'ghost'}
          size="sm"
          onClick={onVote}
          disabled={response.status !== 'success' || votingDisabled}
          className="cursor-pointer gap-1"
          aria-label={hasVoted ? `Voto registrado em ${label}` : `Votar em ${label}`}
          title={votingDisabled && !hasVoted ? 'Voto já registrado neste round' : undefined}
        >
          {hasVoted ? <Check size={16} /> : <ThumbsUp size={16} />}
          <span className="text-xs">{hasVoted ? 'Seu voto' : 'Votar'}</span>
        </Button>
        <div className="flex items-center gap-1">
          {response.status === 'success' && response.message && (
            <CopyButton text={response.message} />
          )}
          {(response.status === 'error') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRetry}
              className="cursor-pointer h-8 w-8 p-0"
              aria-label="Tentar novamente"
              title="Tentar novamente"
            >
              <RotateCcw size={14} />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

function StatusBadge({ status, isWinner }: { status: AIResponse['status']; isWinner: boolean }) {
  if (isWinner) {
    return (
      <span className="flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400 shrink-0">
        <Trophy size={14} /> Vencedor
      </span>
    );
  }
  if (status === 'loading') {
    return (
      <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
        <span className="size-2 rounded-full bg-blue-500 animate-pulse" /> Pensando
      </span>
    );
  }
  if (status === 'error') {
    return (
      <span className="text-xs text-destructive shrink-0">Erro</span>
    );
  }
  return null;
}

function LoadingState() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * LOADER_MESSAGES.length));
  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % LOADER_MESSAGES.length);
    }, 2200);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="space-y-2">
      <div className="h-3 rounded bg-muted animate-pulse w-[90%]" />
      <div className="h-3 rounded bg-muted animate-pulse w-[75%]" />
      <div className="h-3 rounded bg-muted animate-pulse w-[60%]" />
      <p className="text-xs italic text-muted-foreground pt-2">{LOADER_MESSAGES[index]}</p>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <p className="text-sm text-destructive wrap-break-word">
      {message}
    </p>
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
      aria-label="Copiar resposta"
      title="Copiar resposta"
    >
      {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
    </Button>
  );
}
