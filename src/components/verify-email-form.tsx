import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import Logo from '../assets/discordia-logo-removebg2.png';
import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { cn } from '@/lib/utils';
import {
  getUserInfo,
  resendVerification,
  verifyEmail,
} from '@/services/auth.service';
import { useAuth } from '@/hooks/useAuth';

const RESEND_COOLDOWN_SECONDS = 60;

type LocationState = { email?: string } | null;

export function VerifyEmailForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  const stateEmail = (location.state as LocationState)?.email ?? '';
  const queryEmail = new URLSearchParams(location.search).get('email') ?? '';
  const email = stateEmail || queryEmail;

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<number | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    cooldownRef.current = window.setTimeout(
      () => setCooldown((c) => c - 1),
      1000,
    );
    return () => {
      if (cooldownRef.current) window.clearTimeout(cooldownRef.current);
    };
  }, [cooldown]);

  useEffect(() => {
    if (!email) {
      toast.error('Email não informado', {
        description: 'Volte para o cadastro ou login para continuar.',
      });
    }
  }, [email]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || code.length !== 6 || loading) return;

    setLoading(true);
    try {
      await verifyEmail(email, code);
      // Backend já setou o cookie. Carregamos o perfil completo para o contexto.
      const user = await getUserInfo();
      setUser(user);
      toast.success('Email confirmado!', {
        description: 'Bem-vindo(a) ao DiscordIA.',
      });
      navigate('/home', { replace: true });
    } catch (err) {
      console.error('Erro ao verificar email', err);
      setCode('');
      toast.error('Não foi possível confirmar o email', {
        description: isAxiosError<{ message?: string }>(err)
          ? err.response?.data?.message ?? 'Verifique o código e tente novamente.'
          : 'Verifique o código e tente novamente.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email || resending || cooldown > 0) return;
    setResending(true);
    try {
      await resendVerification(email);
      setCooldown(RESEND_COOLDOWN_SECONDS);
      toast.success('Código reenviado', {
        description: 'Confira sua caixa de entrada e o spam.',
      });
    } catch (err) {
      console.error('Erro ao reenviar código', err);
      toast.error('Não foi possível reenviar o código', {
        description: isAxiosError<{ message?: string }>(err)
          ? err.response?.data?.message ?? 'Tente novamente em instantes.'
          : 'Tente novamente em instantes.',
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-8', className)} {...props}>
      {/* Logo - mobile only */}
      <div className="flex items-center justify-center gap-2 lg:hidden">
        <img src={Logo} className="h-12 w-15" alt="DiscordIA" />
        <span className="text-2xl font-semibold tracking-tight select-none">
          DiscordIA
        </span>
      </div>

      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Confirme seu email</h2>
        <p className="text-muted-foreground text-sm">
          Enviamos um código de 6 dígitos para{' '}
          <span className="text-foreground font-medium">
            {email || 'seu email'}
          </span>
          . Insira-o abaixo para ativar sua conta.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={code}
            onChange={setCode}
            disabled={loading || !email}
            autoFocus
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={loading || code.length !== 6 || !email}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Confirmando…
            </>
          ) : (
            'Confirmar email'
          )}
        </Button>
      </form>

      <div className="text-muted-foreground space-y-2 text-center text-sm">
        <p>Não recebeu o código?</p>
        <button
          type="button"
          onClick={handleResend}
          disabled={!email || resending || cooldown > 0}
          className="text-foreground font-medium underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-60 disabled:no-underline"
        >
          {resending
            ? 'Enviando…'
            : cooldown > 0
              ? `Reenviar em ${cooldown}s`
              : 'Reenviar código'}
        </button>
        <p className="text-xs">
          <Link
            to="/login"
            className="text-foreground underline-offset-4 hover:underline"
          >
            Voltar para o login
          </Link>
        </p>
      </div>
    </div>
  );
}
