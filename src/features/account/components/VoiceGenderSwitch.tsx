import { Mars, Venus } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import type { VoiceGender } from '@/features/account/types';

interface VoiceGenderSwitchProps {
  value: VoiceGender;
  onChange: (value: VoiceGender) => void;
  disabled?: boolean;
  id?: string;
}

/**
 * Toggle azul (masculino) / rosa (feminino) usado tanto nas Configurações
 * quanto na tela de Rap Battle para definir o gênero da voz cantada.
 */
export function VoiceGenderSwitch({
  value,
  onChange,
  disabled,
  id,
}: VoiceGenderSwitchProps) {
  const isFemale = value === 'female';

  return (
    <div className="inline-flex items-center gap-3">
      <span
        className={cn(
          'inline-flex items-center gap-1 text-md font-medium transition-colors',
          isFemale ? 'text-muted-foreground' : 'text-sky-500',
        )}
      >
        <Mars size={20} />
        Masculina
      </span>
      <Switch
        id={id}
        checked={isFemale}
        disabled={disabled}
        onCheckedChange={(checked) => onChange(checked ? 'female' : 'male')}
        className={cn(
          'cursor-pointer',
          'data-[state=checked]:bg-pink-500 data-[state=unchecked]:bg-sky-500',
        )}
        aria-label="Alternar voz masculina ou feminina"
      />
      <span
        className={cn(
          'inline-flex items-center gap-1 text-md font-medium transition-colors',
          isFemale ? 'text-pink-500' : 'text-muted-foreground',
        )}
      >
        <Venus size={20} />
        Feminina
      </span>
    </div>
  );
}
