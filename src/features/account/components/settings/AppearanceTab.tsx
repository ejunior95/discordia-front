import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTheme } from '@/components/theme-provider';
import { usePreferences } from '@/features/account/hooks/usePreferences';
import { LANGUAGE_OPTIONS } from '@/features/account/account.constants';
import type { DensityMode, LanguageCode } from '@/features/account/types';
import { cn } from '@/lib/utils';
import { Laptop, Moon, Sun } from 'lucide-react';

const THEME_OPTIONS = [
  { value: 'light', label: 'Claro', icon: Sun },
  { value: 'dark', label: 'Escuro', icon: Moon },
  { value: 'system', label: 'Sistema', icon: Laptop },
] as const;

export default function AppearanceTab() {
  const { theme, setTheme } = useTheme();
  const { preferences, update } = usePreferences();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tema</CardTitle>
          <CardDescription>
            Escolha como o discordIA aparece pra você.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={theme}
            onValueChange={(v) => setTheme(v as typeof theme)}
            className="grid gap-3 sm:grid-cols-3"
          >
            {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
              <Label
                key={value}
                htmlFor={`theme-${value}`}
                className={cn(
                  'flex cursor-pointer flex-col items-center gap-2 rounded-lg border p-4 transition-colors',
                  theme === value
                    ? 'border-primary bg-primary/5'
                    : 'hover:bg-accent',
                )}
              >
                <Icon className="h-6 w-6" />
                <span className="text-sm font-medium">{label}</span>
                <RadioGroupItem id={`theme-${value}`} value={value} className="sr-only" />
              </Label>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Idioma e densidade</CardTitle>
          <CardDescription>
            Preferências visuais e regionais da interface.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Idioma</Label>
            {/* TODO(i18n): aplicar a seleção via react-i18next. */}
            <Select
              value={preferences.language}
              onValueChange={(v) => update({ language: v as LanguageCode })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Densidade</Label>
            {/* TODO(ui): aplicar densidade via classe no <body>. */}
            <Select
              value={preferences.density}
              onValueChange={(v) => update({ density: v as DensityMode })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comfortable">Confortável</SelectItem>
                <SelectItem value="compact">Compacta</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
