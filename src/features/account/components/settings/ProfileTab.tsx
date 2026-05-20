import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { updateUser } from '@/services/user.service';
import { formatFallbackAvatarStr } from '@/utils/globalFunctions';
import { Loader2, Upload } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ProfileTab() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState(user?.avatar ?? '');
  const [saving, setSaving] = useState(false);

  const hasChanges =
    name !== (user?.name ?? '') ||
    email !== (user?.email ?? '') ||
    previewAvatar !== (user?.avatar ?? '');

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setPreviewAvatar(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      toast.error('Usuário não autenticado.');
      return;
    }
    setSaving(true);
    const formData = new FormData();
    if (name !== user.name) formData.append('name', name);
    if (email !== user.email) formData.append('email', email);
    if (avatarFile) formData.append('avatar', avatarFile);

    try {
      await updateUser(user.id, formData);
      setUser({ ...user, name, email, avatar: previewAvatar });
      setAvatarFile(null);
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar alterações', {
        description: String(
          (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
            'Erro desconhecido',
        ),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil público</CardTitle>
        <CardDescription>
          Estas informações aparecem para você e em recursos sociais futuros.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="flex gap-4 items-center">
            <Avatar className="h-24 w-24 rounded-full">
              <AvatarImage
                src={previewAvatar}
                alt={user?.name}
                className="object-cover object-center"
              />
              <AvatarFallback className="text-3xl">
                {user ? formatFallbackAvatarStr(user) : '?'}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Label
                htmlFor="avatar"
                className="inline-flex cursor-pointer items-center gap-2 rounded-md border bg-secondary px-4 py-2 text-sm font-medium hover:bg-secondary/80"
              >
                <Upload className="h-4 w-4" />
                Alterar foto
              </Label>
              <input
                id="avatar"
                name="avatar"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatar}
              />
              <p className="text-muted-foreground text-xs">PNG, JPG ou GIF até 2MB.</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Como devemos te chamar?"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@exemplo.com"
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="submit" disabled={!hasChanges || saving} className="w-full mt-6 md:w-auto">
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando…
              </>
            ) : (
              'Salvar alterações'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
