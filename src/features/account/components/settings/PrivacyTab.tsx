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
import { Switch } from '@/components/ui/switch';
import {
  PREFERENCES_STORAGE_KEY,
} from '@/features/account/account.constants';
import { usePreferences } from '@/features/account/hooks/usePreferences';
import { ROUNDS_STORAGE_KEY } from '@/features/chat/chat.constants';
import { Download, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function PrivacyTab() {
  const { preferences, update } = usePreferences();

  const handleExport = () => {
    try {
      const payload = {
        exportedAt: new Date().toISOString(),
        preferences,
        rounds: JSON.parse(localStorage.getItem(ROUNDS_STORAGE_KEY) ?? '[]'),
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `discordia-data-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Seus dados foram exportados.');
    } catch {
      toast.error('Não foi possível exportar os dados.');
    }
  };

  const handleClearHistory = () => {
    localStorage.removeItem(ROUNDS_STORAGE_KEY);
    window.dispatchEvent(
      new StorageEvent('storage', { key: ROUNDS_STORAGE_KEY }),
    );
    toast.success('Histórico de chat removido.');
  };

  const handleResetPreferences = () => {
    localStorage.removeItem(PREFERENCES_STORAGE_KEY);
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Coleta de dados</CardTitle>
          <CardDescription>
            Ajude a melhorar o discordIA enviando métricas anônimas de uso.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="telemetry" className="text-sm font-medium">
                Telemetria anônima
              </Label>
              <p className="text-muted-foreground text-xs">
                Nenhuma informação pessoal é enviada — apenas eventos agregados.
              </p>
            </div>
            <Switch
              id="telemetry"
              checked={preferences.anonymousTelemetry}
              onCheckedChange={(v) => update({ anonymousTelemetry: v })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Meus dados</CardTitle>
          <CardDescription>
            Exporte ou apague os dados que o discordIA mantém localmente neste
            dispositivo.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Exportar meus dados (JSON)
          </Button>
          <Button variant="outline" onClick={handleResetPreferences}>
            Restaurar preferências
          </Button>
        </CardContent>
        <CardFooter>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Limpar histórico do chat
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Apagar histórico?</AlertDialogTitle>
                <AlertDialogDescription>
                  Todas as rodadas salvas neste navegador serão removidas. Esta
                  ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClearHistory}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Sim, apagar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
}
