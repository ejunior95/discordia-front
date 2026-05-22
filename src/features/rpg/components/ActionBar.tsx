import { useState } from 'react';
import { Crown, Loader2, Send, SkipForward, Sparkles, Square, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { IA_CONFIG } from '@/features/chat/chat.constants';
import type { AgentIA } from '@/features/chat/types';
import type { ActorRef, RpgCampaign } from '../types';

interface ActionBarProps {
  campaign: RpgCampaign;
  currentActor: ActorRef;
  isGenerating: boolean;
  onSubmitUser: (content: string) => Promise<void>;
  onGenerateAI: () => void;
  onAbort: () => void;
  onSkip: () => void;
}

export function ActionBar({
  campaign,
  currentActor,
  isGenerating,
  onSubmitUser,
  onGenerateAI,
  onAbort,
  onSkip,
}: ActionBarProps) {
  const [draft, setDraft] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const isUserTurn = currentActor === 'user';
  const isMasterTurn = currentActor === campaign.master;

  // Gerencia o envio e captura possíveis erros de validação da API
  const handleSubmit = async () => {
    const trimmed = draft.trim();
    if (!trimmed || isValidating) return;

    setValidationError(null);
    setIsValidating(true);

    try {
      await onSubmitUser(trimmed);
      setDraft('');
    } catch (err) {
      setValidationError(err instanceof Error ? err.message : 'Texto inadequado para a ação.');
    } finally {
      setIsValidating(false);
    }
  };

  if (isUserTurn) {
    return (
      <div
        className={cn(
          'rounded-xl border p-3 md:p-4 flex flex-col gap-2',
          isMasterTurn ? 'border-amber-500/40 bg-amber-500/5' : 'border-primary/40 bg-primary/5',
        )}
      >
        <div className="flex items-center gap-2 text-xs">
          {isMasterTurn ? (
            <>
              <Crown size={14} className="text-amber-500" />
              <span className="font-semibold text-amber-700 dark:text-amber-400">
                Sua vez como Mestre — narre a cena
              </span>
            </>
          ) : (
            <>
              <UserIcon size={14} className="text-primary" />
              <span className="font-semibold text-primary">
                Sua vez como jogador — descreva sua ação
              </span>
            </>
          )}
        </div>
        <Textarea
          value={draft}
          disabled={isValidating}
          onChange={(e) => {
            setDraft(e.target.value);
            if (validationError) setValidationError(null);
          }}
          placeholder={
            isMasterTurn
              ? 'Descreva a cena, o ambiente e o que os jogadores percebem…'
              : 'Em primeira pessoa: o que você diz ou faz?'
          }
          rows={3}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              void handleSubmit();
            }
          }}
          className={cn(validationError && 'border-destructive focus-visible:ring-destructive')}
        />
        
        {/* Exibição da mensagem de erro de validação */}
        {validationError && (
          <p className="text-xs text-destructive font-medium mt-1">{validationError}</p>
        )}

        <div className="flex items-center justify-between gap-2 mt-1">
          <p className="text-[11px] text-muted-foreground">
            <kbd className="px-1.5 py-0.5 rounded border bg-background text-[10px]">Ctrl</kbd>
            {' + '}
            <kbd className="px-1.5 py-0.5 rounded border bg-background text-[10px]">Enter</kbd>
            {' para enviar'}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onSkip}
              disabled={isValidating}
              className="cursor-pointer gap-1.5"
              title="Pular sua vez"
            >
              <SkipForward size={14} />
              Pular
            </Button>
            <Button 
              onClick={() => void handleSubmit()} 
              disabled={!draft.trim() || isValidating} 
              className="cursor-pointer gap-1.5"
            >
              {isValidating ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              {isValidating ? 'Validando...' : 'Enviar'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // turno de IA
  const cfg = IA_CONFIG[currentActor as AgentIA];
  const Icon = cfg.Icon;

  return (
    <div
      className={cn(
        'rounded-xl border p-3 md:p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3',
        isMasterTurn ? 'border-amber-500/40 bg-amber-500/5' : 'bg-muted/30',
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className={cn('rounded-full p-2 shrink-0', cfg.iconClass)}>
          <Icon size={18} />
        </div>
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-1">
            {isMasterTurn ? (
              <>
                <Crown size={11} className="text-amber-500" />
                Vez do Mestre
              </>
            ) : (
              <>
                <Sparkles size={11} />
                Vez do jogador
              </>
            )}
          </p>
          <p className="font-semibold truncate">{cfg.label}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 justify-end">
        <Button variant="ghost" size="sm" onClick={onSkip} className="cursor-pointer gap-1.5">
          <SkipForward size={14} />
          Pular
        </Button>
        {isGenerating ? (
          <Button variant="outline" size="sm" onClick={onAbort} className="cursor-pointer gap-1.5">
            <Square className="h-4 w-4 fill-current" />
            <span className="hidden sm:inline">Cancelar</span>
          </Button>
        ) : (
          <Button onClick={onGenerateAI} className="cursor-pointer gap-1.5">
            {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            {isMasterTurn ? 'Gerar narração' : 'Gerar resposta'}
          </Button>
        )}
      </div>
    </div>
  );
}