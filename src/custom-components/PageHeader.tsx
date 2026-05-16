import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

/**
 * Cabeçalho padrão das páginas internas, replicando o tamanho e largura
 * já usados em Settings/Profile/Subscription.
 */
export default function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <header
      className={cn(
        'w-full lg:w-[80%] 2xl:w-[60%] 2xl:max-w-300',
        'mb-5 md:mb-8 2xl:mb-10',
        'flex flex-col gap-3 md:flex-row md:items-end md:justify-between',
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <h1 className="wrap-break-word text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl xl:text-7xl">
          {title}
        </h1>
        {description ? (
          <p className="text-muted-foreground mt-2 max-w-2xl text-base md:text-lg">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </header>
  );
}
