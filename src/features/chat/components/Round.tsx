import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { formatFallbackAvatarStr } from '@/utils/globalFunctions';
import { AGENTS, type AgentIA, type Round as RoundType } from '../types';
import { AIResponseCard } from './AIResponseCard';

interface RoundProps {
  round: RoundType;
  onVote: (agent: AgentIA) => void;
  onRetry: (agent: AgentIA) => void;
}

export function Round({ round, onVote, onRetry }: RoundProps) {
  const { user } = useAuth();
  const askedAt = new Date(round.askedAt);
  const timeLabel = askedAt.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <article className="w-full py-6 first:pt-2">
      <header className="flex items-start justify-end gap-3 mb-4">
        <div className="flex flex-col items-end gap-1 max-w-[80%] sm:max-w-[70%]">
          <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2 shadow-sm">
            <p className="whitespace-pre-wrap break-words">{round.question}</p>
          </div>
          <span className="text-xs text-muted-foreground">{timeLabel}</span>
        </div>
        <Avatar className="w-9 h-9 hidden sm:block shrink-0">
          <AvatarImage src={user?.avatar} className="object-cover object-center" />
          <AvatarFallback>{user ? formatFallbackAvatarStr(user) : '?'}</AvatarFallback>
        </Avatar>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {AGENTS.map((agent) => (
          <AIResponseCard
            key={agent}
            agent={agent}
            response={round.responses[agent]}
            isWinner={round.winner === agent}
            onVote={() => onVote(agent)}
            onRetry={() => onRetry(agent)}
          />
        ))}
      </div>
    </article>
  );
}
