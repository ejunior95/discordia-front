import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import PasswordInput from '@/features/account/components/PasswordInput';
import { useAuth } from '@/hooks/useAuth';
import { updateUser } from '@/services/user.service';
import { Loader2, Monitor, Smartphone, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

// TODO(backend): substituir por endpoint /auth/sessions.
const MOCK_SESSIONS = [
  {
    id: '1',
    device: 'Chrome — Linux',
    location: 'São Paulo, BR',
    lastActive: 'Agora',
    current: true,
    icon: Monitor,
  },
  {
    id: '2',
    device: 'Safari — iPhone',
    location: 'São Paulo, BR',
    lastActive: 'há 2 dias',
    current: false,
    icon: Smartphone,
  },
];

export default function AccountTab() {
  const { user, setUser } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const passwordValid =
    currentPassword.length > 0 &&
    newPassword.length >= 8 &&
    newPassword === confirmPassword;

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    if (!passwordValid) {
      toast.error('Verifique os campos de senha (mínimo 8 caracteres e confirmação).');
      return;
    }
    setSaving(true);
    const formData = new FormData();
    formData.append('currentPassword', currentPassword);
    formData.append('password', newPassword);
    try {
      await updateUser(user.id, formData);
      toast.success('Senha alterada com sucesso.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error('Não foi possível alterar a senha', {
        description: String(
          (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
            'Erro desconhecido',
        ),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRevoke = (id: string) => {
    // TODO(backend): chamar DELETE /auth/sessions/:id
    toast(`Sessão ${id} revogada (mock).`);
  };

  const handleRevokeAll = () => {
    // TODO(backend): chamar POST /auth/sessions/revoke-all
    toast('Todas as outras sessões foram encerradas (mock).');
  };

  const handleDeleteAccount = () => {
    // TODO(backend): chamar DELETE /users/:id e fazer logout
    toast.error('Exclusão de conta solicitada (mock).');
    setUser(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Alterar senha</CardTitle>
          <CardDescription>
            Use uma senha forte com pelo menos 8 caracteres, contendo letras e números.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleChangePassword}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Senha atual</Label>
              <PasswordInput
                id="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="new-password">Nova senha</Label>
                <PasswordInput
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar nova senha</Label>
                <PasswordInput
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={!passwordValid || saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Atualizando…
                </>
              ) : (
                'Atualizar senha'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-2">
          <div>
            <CardTitle>Sessões ativas</CardTitle>
            <CardDescription>
              Aparelhos atualmente conectados à sua conta.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleRevokeAll}>
            Encerrar outras
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {MOCK_SESSIONS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-muted rounded-md p-2">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {s.device}{' '}
                      {s.current ? (
                        <Badge variant="secondary" className="ml-1">
                          Esta sessão
                        </Badge>
                      ) : null}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {s.location} · {s.lastActive}
                    </p>
                  </div>
                </div>
                {!s.current ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRevoke(s.id)}
                  >
                    Revogar
                  </Button>
                ) : null}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-destructive">Zona de perigo</CardTitle>
          <CardDescription>
            A exclusão da conta é permanente e remove todos os seus dados.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir minha conta
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Sua conta, histórico e
                  preferências serão removidos permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Sim, excluir conta
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
}
