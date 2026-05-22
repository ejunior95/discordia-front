import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CONSENT_KEY = "cookieConsent";
const CONSENT_VERSION = "v1";

/**
 * Aviso simples e descartável de cookies (LGPD).
 *
 * O DiscordIA usa apenas cookies estritamente necessários (autenticação)
 * e armazenamento local funcional, então não há opt-in granular —
 * apenas informação clara e link para a Política de Cookies.
 */
export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (!stored || !stored.startsWith(`accepted:${CONSENT_VERSION}`)) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(
        CONSENT_KEY,
        `accepted:${CONSENT_VERSION}:${new Date().toISOString()}`,
      );
    } catch {
      // ignora falha de storage (modo privado etc.)
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Aviso de cookies"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-lg border bg-background/75 p-4 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:inset-x-auto sm:right-4 sm:left-4"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground text-sm leading-relaxed">
          Usamos apenas{" "}
          <strong className="text-foreground">cookies essenciais</strong> para
          autenticação e funcionalidades básicas — sem rastreamento de marketing
          ou analytics. Veja nossa{" "}
          <Link
            to="/cookies"
            className="text-foreground underline underline-offset-4"
          >
            Política de Cookies
          </Link>{" "}
          e a{" "}
          <Link
            to="/privacy"
            className="text-foreground underline underline-offset-4"
          >
            Política de Privacidade
          </Link>
          .
        </p>

        <div className="flex w-full mt-2 md:mt-0 md:w-fit shrink-0 items-center gap-2">
          <Button className="w-full" onClick={accept}>
            Entendi
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CookieConsentBanner;
