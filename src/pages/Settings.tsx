import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageHeader from '@/custom-components/PageHeader';
import AccountTab from '@/features/account/components/settings/AccountTab';
import AIPreferencesTab from '@/features/account/components/settings/AIPreferencesTab';
import AppearanceTab from '@/features/account/components/settings/AppearanceTab';
import NotificationsTab from '@/features/account/components/settings/NotificationsTab';
import PrivacyTab from '@/features/account/components/settings/PrivacyTab';
import ProfileTab from '@/features/account/components/settings/ProfileTab';
import {
  Bell,
  Bot,
  Palette,
  Shield,
  User,
  UserCog,
} from 'lucide-react';

const TABS = [
  { value: 'profile', label: 'Perfil', icon: User, content: <ProfileTab /> },
  { value: 'account', label: 'Conta', icon: UserCog, content: <AccountTab /> },
  { value: 'appearance', label: 'Aparência', icon: Palette, content: <AppearanceTab /> },
  { value: 'notifications', label: 'Notificações', icon: Bell, content: <NotificationsTab /> },
  { value: 'ai', label: 'IA', icon: Bot, content: <AIPreferencesTab /> },
  { value: 'privacy', label: 'Privacidade', icon: Shield, content: <PrivacyTab /> },
];

export default function Settings() {
  return (
    <section className="flex w-full flex-col items-center p-6 md:p-10">
      <PageHeader
        title="Configurações"
        description="Gerencie sua conta, aparência, notificações e preferências de IA."
      />
      <Tabs
        defaultValue="profile"
        className="w-full lg:w-[80%] 2xl:w-[60%] 2xl:max-w-[1200px]"
      >
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1">
          {TABS.map(({ value, label, icon: Icon }) => (
            <TabsTrigger key={value} value={value} className="gap-2">
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        {TABS.map(({ value, content }) => (
          <TabsContent key={value} value={value} className="mt-6">
            {content}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
