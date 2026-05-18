import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/discordia-logo-removebg2.png';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Eye, EyeClosed, ImagePlus, Loader2 } from 'lucide-react';
import { createUser } from '@/services/user.service';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { isAxiosError } from 'axios';
import PasswordStrengthMeter, {
  evaluatePasswordStrength,
} from './PasswordStrengthMeter';
import { LEGAL_CONFIG } from '@/config/legal';

export function RegisterForm({ className, ...props }: React.ComponentProps<'div'>) {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const strength = evaluatePasswordStrength(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const canSubmit = strength.acceptable && passwordsMatch && acceptTerms && !loading;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!strength.acceptable) {
      toast.error('Senha muito fraca', {
        description: 'Use pelo menos 8 caracteres com letras maiúsculas e minúsculas.',
      });
      return;
    }
    if (!passwordsMatch) {
      toast.error('As senhas não conferem');
      return;
    }
    if (!acceptTerms) {
      toast.error('É necessário aceitar os termos para continuar');
      return;
    }

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get('name') ?? '');
    const email = String(formData.get('email') ?? '');

    const payload = new FormData();
    payload.append('name', name);
    payload.append('email', email);
    payload.append('password', password);
    payload.append('acceptTerms', 'true');
    payload.append('termsVersion', LEGAL_CONFIG.TERMS_VERSION);
    if (avatarFile && avatarFile.size > 0) {
      payload.append('avatar', avatarFile);
    }

    try {
      await createUser(payload);
      toast.success('Conta criada com sucesso!', {
        description: 'Enviamos um código de confirmação para o seu e-mail.',
      });
      navigate('/auth/verify-email', { state: { email }, replace: true });
    } catch (error: unknown) {
      console.error('Erro ao fazer cadastro', error);
      toast.error('Não foi possível criar a conta', {
        description: isAxiosError<{ message?: string }>(error)
          ? error.response?.data?.message ?? 'Tente novamente em instantes.'
          : 'Tente novamente em instantes.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setPreviewAvatar(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (!previewAvatar) return;
    return () => URL.revokeObjectURL(previewAvatar);
  }, [previewAvatar]);

  return (
    <div className={cn('flex flex-col gap-8', className)} {...props}>
      {/* Logo - only on mobile */}
      <div className="flex items-center justify-center gap-2 lg:hidden">
        <img src={Logo} className="h-12 w-15" alt="DiscordIA" />
        <span className="text-2xl font-semibold tracking-tight select-none">DiscordIA</span>
      </div>

      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Crie sua conta</h2>
        <p className="text-muted-foreground text-sm">
          Comece grátis. Sem cartão de crédito.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name">Seu nome</Label>
          <Input
            id="name"
            type="text"
            name="name"
            placeholder="Como você quer ser chamado"
            autoComplete="name"
            required
            disabled={loading}
          />
        </div>

        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 rounded-full">
            <AvatarImage src={previewAvatar} className="object-cover object-center" />
            <AvatarFallback>?</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Label
              htmlFor="avatar"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors"
            >
              <ImagePlus className="h-4 w-4" />
              {avatarFile ? 'Alterar foto' : 'Adicionar foto (opcional)'}
            </Label>
            <input
              id="avatar"
              name="avatar"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleAvatarChange}
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="voce@exemplo.com"
            autoComplete="email"
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className="pr-10"
              minLength={8}
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 p-1"
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              tabIndex={-1}
            >
              {showPassword ? <Eye className="h-4 w-4" /> : <EyeClosed className="h-4 w-4" />}
            </button>
          </div>
          <PasswordStrengthMeter password={password} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirmar senha</Label>
          <div className="relative">
            <Input
              id="confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              className="pr-10"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((s) => !s)}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 p-1"
              aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
              tabIndex={-1}
            >
              {showConfirmPassword ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeClosed className="h-4 w-4" />
              )}
            </button>
          </div>
          {confirmPassword.length > 0 && !passwordsMatch ? (
            <p className="text-destructive text-xs">As senhas não conferem.</p>
          ) : null}
        </div>

        <label className="flex cursor-pointer items-start gap-3 text-sm">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="border-input text-primary focus:ring-primary mt-0.5 h-4 w-4 cursor-pointer rounded border"
            required
            disabled={loading}
          />
          <span className="text-muted-foreground leading-snug">
            Eu li e aceito os{' '}
            <Link to="/terms" className="text-foreground underline underline-offset-4" target="_blank">
              termos de uso
            </Link>{' '}
            e a{' '}
            <Link to="/privacy" className="text-foreground underline underline-offset-4" target="_blank">
              política de privacidade
            </Link>
            .
          </span>
        </label>

        <Button type="submit" className="w-full" size="lg" disabled={!canSubmit}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando conta…
            </>
          ) : (
            'Criar conta'
          )}
        </Button>
      </form>

      <p className="text-muted-foreground text-center text-sm">
        Já tem uma conta?{' '}
        <Link to="/login" className="text-foreground font-medium underline-offset-4 hover:underline">
          Faça o login
        </Link>
      </p>
    </div>
  );
}
