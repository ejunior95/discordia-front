import { useEffect, useLayoutEffect, useRef } from 'react';
import { Loader2, Paperclip, SendHorizontal, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MAX_QUESTION_LENGTH } from '../chat.constants';

interface QuestionInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onAbort: () => void;
  isAsking: boolean;
  autoFocus?: boolean;
}

export function QuestionInput({
  value,
  onChange,
  onSubmit,
  onAbort,
  isAsking,
  autoFocus,
}: QuestionInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const remaining = MAX_QUESTION_LENGTH - value.length;
  const atLimit = remaining <= 0;
  const canSubmit = !isAsking && value.trim().length > 0;

  // auto-resize
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const max = 6 * 24; // ~6 linhas
    el.style.height = `${Math.min(el.scrollHeight, max)}px`;
  }, [value]);

  useEffect(() => {
    if (autoFocus) textareaRef.current?.focus();
  }, [autoFocus]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (canSubmit) onSubmit();
    }
  };

  return (
    <div className="w-full bg-input/60 border rounded-xl p-3 flex flex-col gap-2 shadow-sm">
      <label htmlFor="chat-question" className="sr-only">
        Faça sua pergunta
      </label>
      <textarea
        id="chat-question"
        ref={textareaRef}
        rows={1}
        placeholder="O que você quer saber? (Enter envia, Shift+Enter quebra linha)"
        value={value}
        maxLength={MAX_QUESTION_LENGTH}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full resize-none bg-transparent px-1 py-1 text-base outline-none placeholder:text-muted-foreground/70"
      />

      <div className="flex items-center justify-between gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled
          className="cursor-not-allowed select-none gap-2"
        >
          <Paperclip className="h-4 w-4" />
          <span className="hidden sm:inline text-xs">Anexar (em breve)</span>
        </Button>

        <div className="flex items-center gap-3">
          <span
            className={cn(
              'text-xs tabular-nums select-none',
              atLimit ? 'text-destructive font-medium' : 'text-muted-foreground/70',
            )}
          >
            {atLimit ? 'Limite atingido!' : `${remaining} restantes`}
          </span>

          {isAsking ? (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={onAbort}
              className="cursor-pointer gap-2"
            >
              <Square className="h-4 w-4 fill-current" />
              <span className="hidden sm:inline">Cancelar</span>
            </Button>
          ) : (
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={onSubmit}
              disabled={!canSubmit}
              className="cursor-pointer gap-2"
            >
              {isAsking ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span className="hidden sm:inline">Enviar</span>
                  <SendHorizontal className="h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
