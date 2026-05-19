import { Coins, Infinity as InfinityIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

/**
 * Badge compacto que mostra o saldo atual de créditos do usuário.
 * Atualiza-se sozinho via header `X-Credits-Balance` capturado pelo
 * interceptor do Axios.
 */
export function CreditsBadge() {
  const { user } = useAuth();
  if (!user) return null;

  const credits = user.credits;
  const isExemptRole = user.role === 'admin' || user.role === 'beta_tester';
  const isUnlimited = isExemptRole || (credits?.isUnlimited ?? false);
  const balance = credits?.balance ?? 0;
  const isLow = !isUnlimited && balance > 0 && balance < 10;
  const isEmpty = !isUnlimited && balance <= 0;

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to="/subscription"
            aria-label={isUnlimited ? 'Créditos ilimitados' : `Saldo de créditos: ${balance}`}
            className={[
              'flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold tabular-nums transition-colors',
              isEmpty
                ? 'border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/15'
                : isLow
                  ? 'border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/15'
                  : 'border-border bg-muted/40 text-foreground hover:bg-muted/70',
            ].join(' ')}
          >
            {isUnlimited ? (
              <>
                <InfinityIcon className="h-5 w-5" />
                <span className='hidden md:flex'>ilimitado</span>
              </>
            ) : (
              <>
                <Coins className="h-5 w-5" />
                <span>{balance.toLocaleString('pt-BR')}</span>
              </>
            )}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {isUnlimited
            ? 'Plano Premium — uso justo aplicado.'
            : `Você tem ${balance} créditos. Clique para gerenciar seu plano.`}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
