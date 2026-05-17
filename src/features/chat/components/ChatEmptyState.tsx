import { motion } from 'framer-motion';
import { MessageCircleQuestion, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { IA_CONFIG, SUGGESTION_CHIPS } from '../chat.constants';
import { AGENTS } from '../types';
import { pageMotion } from '@/utils/pageMotion';

interface ChatEmptyStateProps {
  onSelectSuggestion: (text: string) => void;
}

export function ChatEmptyState({ onSelectSuggestion }: ChatEmptyStateProps) {
  return (
    <motion.div
      {...pageMotion}
      className="flex-1 flex flex-col justify-center items-center gap-8 py-8"
    >
      <div className="text-center max-w-2xl space-y-2">
        <h1 className="text-4xl mb-2 md:text-5xl xl:text-6xl font-extrabold tracking-tight">
          Faça sua pergunta
        </h1>
        <p className="text-sm md:text-lg text-muted-foreground">
          Veja 4 IAs disputarem pelo seu voto em tempo real.
        </p>
      </div>

      <div className="w-full max-w-4xl">
        <div className="relative text-center text-xs uppercase tracking-wider text-muted-foreground mb-4 after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-3 select-none">Competidoras</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {AGENTS.map((agent) => {
            const { Icon, label, subtitle, iconClass } = IA_CONFIG[agent];
            return (
              <Card
                key={agent}
                className="flex flex-row items-center gap-3 p-3 select-none"
              >
                <div className={`rounded-full p-2 border shrink-0 ${iconClass}`}>
                  <Icon size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-none truncate">{label}</p>
                  <p className="text-xs text-muted-foreground truncate mt-1">{subtitle}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="w-full max-w-3xl">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2 justify-center">
          <Sparkles size={14} /> Sugestões para começar
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SUGGESTION_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => onSelectSuggestion(chip)}
              className="text-sm flex items-center justify-between text-left px-4 py-3 rounded-lg border bg-card hover:bg-accent hover:border-primary/50 transition-colors cursor-pointer"
            >
              {chip}
              <MessageCircleQuestion size={22} />
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
