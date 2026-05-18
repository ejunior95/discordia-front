import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-border/60 text-muted-foreground mt-12 border-t py-6 text-xs">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 sm:flex-row">
        <p>© {new Date().getFullYear()} DiscordIA. Todos os direitos reservados.</p>
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <Link to="/terms" className="hover:text-foreground underline-offset-4 hover:underline">
            Termos de Uso
          </Link>
          <Link to="/privacy" className="hover:text-foreground underline-offset-4 hover:underline">
            Privacidade
          </Link>
          <Link to="/cookies" className="hover:text-foreground underline-offset-4 hover:underline">
            Cookies
          </Link>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
