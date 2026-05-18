import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import DiscordiaLogo from '../assets/discordia-logo-removebg2.png';

const legalLinks = [
  { path: '/terms', label: 'Termos de Uso' },
  { path: '/privacy', label: 'Privacidade' },
  { path: '/cookies', label: 'Cookies' },
];

export function LegalNavbar() {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <header className="sticky inset-x-0 top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <nav className="mx-auto flex min-h-16 w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 md:h-16 md:flex-row md:items-center md:justify-between md:py-0 lg:px-8">
        <Link to="/" className="flex items-center gap-2 self-start md:self-auto">
          <img src={DiscordiaLogo} alt="DiscordIA" className="size-10 object-contain" />
          <span className="text-xl font-extrabold tracking-tight md:text-2xl">
            Discord
            <span className="text-blue-500">I</span>
            <span className="text-amber-500">A</span>
          </span>
        </Link>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground md:justify-center">
          {legalLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'font-medium underline-offset-4 transition-colors hover:text-foreground hover:underline',
                location.pathname === link.path && 'text-foreground',
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 md:justify-end">
          {user ? (
            <Link to="/home">
              <Button size="sm" className="cursor-pointer gap-2">
                Entrar no app
                <ArrowRight size={14} />
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="cursor-pointer">
                  Entrar
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="cursor-pointer">
                  Criar conta
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}