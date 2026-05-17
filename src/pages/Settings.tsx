import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { motion } from 'framer-motion';
import { useState } from 'react';
import { pageMotion } from '@/utils/pageMotion';

const TABS = [
  { value: 'profile', label: 'Perfil', icon: User, content: <ProfileTab /> },
  { value: 'account', label: 'Conta', icon: UserCog, content: <AccountTab /> },
  { value: 'appearance', label: 'Aparência', icon: Palette, content: <AppearanceTab /> },
  { value: 'notifications', label: 'Notificações', icon: Bell, content: <NotificationsTab /> },
  { value: 'ai', label: 'IA', icon: Bot, content: <AIPreferencesTab /> },
  { value: 'privacy', label: 'Privacidade', icon: Shield, content: <PrivacyTab /> },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <section className="w-full p-4 sm:p-6 md:p-10">
      <motion.div {...pageMotion} className="flex w-full flex-col items-center">
      <PageHeader
        title="Configurações"
        description="Gerencie sua conta, aparência, notificações e preferências de IA."
      />
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full lg:w-[80%] 2xl:w-[60%] 2xl:max-w-300"
      >
        <div className="md:hidden">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TABS.map(({ value, label, icon: Icon }) => (
                <SelectItem key={value} value={value}>
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="hidden md:block">
          <TabsList className="grid h-auto w-full grid-cols-3 gap-1 lg:grid-cols-6">
            {TABS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger key={value} value={value} className="gap-2">
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {TABS.map(({ value, content }) => (
          <TabsContent key={value} value={value} className="mt-6">
            {content}
          </TabsContent>
        ))}
      </Tabs>
      </motion.div>
    </section>
  );
}
