import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { usePreferences } from '@/features/account/hooks/usePreferences';
import type { NotificationPreferences } from '@/features/account/types';

const ITEMS: {
  key: keyof NotificationPreferences;
  title: string;
  description: string;
}[] = [
  {
    key: 'emailDigest',
    title: 'Resumo semanal por e-mail',
    description: 'Receba um digest com os melhores rounds e novidades.',
  },
  {
    key: 'productUpdates',
    title: 'Novidades do produto',
    description: 'Avisos sobre novos modelos, recursos e melhorias.',
  },
  {
    key: 'pushEnabled',
    title: 'Notificações push',
    description: 'Receba notificações no navegador quando uma resposta chegar.',
  },
  {
    key: 'soundEnabled',
    title: 'Sons da interface',
    description: 'Tocar sons sutis ao receber respostas e votar.',
  },
];

export default function NotificationsTab() {
  const { preferences, update } = usePreferences();

  const toggle = (key: keyof NotificationPreferences) => (value: boolean) => {
    update({ notifications: { ...preferences.notifications, [key]: value } });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notificações</CardTitle>
        <CardDescription>
          Controle como e quando o discordIA fala com você.
        </CardDescription>
      </CardHeader>
      <CardContent className="divide-y">
        {ITEMS.map(({ key, title, description }) => (
          <div
            key={key}
            className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
          >
            <div className="space-y-0.5">
              <Label htmlFor={`notif-${key}`} className="text-sm font-medium">
                {title}
              </Label>
              <p className="text-muted-foreground text-xs">{description}</p>
            </div>
            <Switch
              id={`notif-${key}`}
              checked={preferences.notifications[key]}
              onCheckedChange={toggle(key)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
