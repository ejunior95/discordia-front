import { useEffect, useState } from 'react';
import { Copy, RotateCcw, ThumbsUp, Trophy, Check, Maximize2, Minimize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LOADER_MESSAGES } from '../chat.constants';
import { useAgentDisplay } from '@/hooks/useAgentDisplay';
import type { AgentIA, AIResponse } from '../types';

interface AIResponseCardProps {
  agent: AgentIA;
  response: AIResponse;
  isWinner: boolean;
  hasVoted: boolean;
  votingDisabled: boolean;
  onVote: () => void;
  onRetry: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export function AIResponseCard({ 
  agent, 
  response, 
  isWinner, 
  hasVoted, 
  votingDisabled, 
  onVote, 
  onRetry,
  isExpanded,
  onToggleExpand
}: AIResponseCardProps) {
  const { Icon, label, model, iconClass, accent } = useAgentDisplay(agent);

  return (
    <Card
      className={cn(
        'relative flex flex-col min-h-64 transition-all duration-300 outline-none',
        isWinner && `ring-3 ring-amber-500 ${accent}`,
        isExpanded && 'md:col-span-2 xl:col-span-4 shadow-lg'
      )}
      aria-live={response.status === 'loading' ? 'polite' : undefined}
    >
      <CardHeader className="flex-row items-center gap-3 space-y-0 pb-3">
        <div className={cn('rounded-full px-3 py-2 border shrink-0 flex items-center justify-center gap-3', iconClass)}>
          <Icon size={28} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold leading-tight truncate">{label}</p>
            <p className="text-xs truncate">{model}</p>
          </div>
        </div>
        <StatusBadge status={response.status} isWinner={isWinner} />
          {response.status === 'success' && response.message && (
            <Button
              size="icon"
              onClick={onToggleExpand}
              className="hidden md:flex h-8 w-8 rounded-full cursor-pointer absolute -top-2 -right-2"
              title={isExpanded ? "Recolher resposta" : "Expandir resposta"}
            >
              {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </Button>
          )}
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        {response.status === 'loading' && <LoadingState />}
        {response.status === 'error' && (
          <ErrorState message={response.error ?? 'Erro desconhecido'} />
        )}
        
        {/* Renderização do Markdown com Sucesso */}
        {response.status === 'success' && response.message && (
          <div 
            className={cn(
              "text-sm text-foreground break-words overflow-y-auto pr-1 space-y-3 transition-all",
              // Altera a altura máxima dinamicamente baseado no estado de expansão
              isExpanded ? "max-h-[70vh]" : "max-h-[40vh]"
            )}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="leading-relaxed mb-2 last:mb-0">{children}</p>,
                strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                ul: ({ children }) => <ul className="list-disc pl-5 my-2 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-5 my-2 space-y-1">{children}</ol>,
                li: ({ children }) => <li className="text-sm">{children}</li>,
                code: ({ children }) => (
                  <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono border">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-muted p-3 rounded-lg overflow-x-auto my-2 border font-mono text-xs">
                    {children}
                  </pre>
                ),
              }}
            >
              {response.message}
            </ReactMarkdown>
          </div>
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
          <span className="text-sm">{hasVoted ? 'Voto registrado' : 'Votar'}</span>
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

// O restante dos subcomponentes (StatusBadge, LoadingState, ErrorState, CopyButton) 
// permanecem exatamente iguais ao seu código original.
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
    <p className="text-sm text-destructive break-words">
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