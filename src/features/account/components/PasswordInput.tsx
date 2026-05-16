import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeClosed } from 'lucide-react';
import { useState, type ComponentProps } from 'react';

type PasswordInputProps = Omit<ComponentProps<typeof Input>, 'type'>;

export default function PasswordInput(props: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input {...props} type={visible ? 'text' : 'password'} className="pr-10" />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
      >
        {visible ? <EyeClosed className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
    </div>
  );
}
