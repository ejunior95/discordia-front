import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useNavigate } from 'react-router-dom';
import { getUserInfo, login } from '@/services/auth.service';
import { useState } from 'react';
import { toast } from 'sonner';
import { Eye, EyeClosed, Loader2 } from 'lucide-react';
import Logo from '../assets/discordia-logo-removebg2.png';
import { useAuth } from '@/hooks/useAuth';
import { isAxiosError } from 'axios';

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');

    try {
      await login(email, password);
      const user = await getUserInfo();
      setUser(user);
      navigate('/home');
    } catch (err) {
      console.error('Erro ao fazer login', err);
      toast.error('Erro ao fazer login', {
        description: isAxiosError<{ message?: string }>(err)
          ? err.response?.data?.message ?? 'Verifique suas credenciais e tente novamente.'
          : 'Verifique suas credenciais e tente novamente.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-8', className)} {...props}>
      {/* Logo - only visible on mobile (brand panel is hidden) */}
      <div className="flex items-center justify-center gap-2 lg:hidden">
        <img src={Logo} className="h-12 w-15" alt="DiscordIA" />
        <span className="text-2xl font-semibold tracking-tight select-none">DiscordIA</span>
      </div>

      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Bem-vindo de volta</h2>
        <p className="text-muted-foreground text-sm">
          Entre com seu e-mail e senha para acessar sua conta.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Senha</Label>
            <Link
              to="#"
              className="text-muted-foreground text-xs underline-offset-4 hover:underline"
            >
              Esqueceu sua senha?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete="current-password"
              className="pr-10"
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
              {showPassword ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeClosed className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Entrando…
            </>
          ) : (
            'Entrar'
          )}
        </Button>
      </form>

      <p className="text-muted-foreground text-center text-sm">
        Ainda não tem uma conta?{' '}
        <Link to="/register" className="text-foreground font-medium underline-offset-4 hover:underline">
          Cadastre-se grátis
        </Link>
      </p>
    </div>
  );
}
