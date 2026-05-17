import { cn } from '@/lib/utils';

export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  acceptable: boolean;
}

export function evaluatePasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return { score: 0, label: 'Muito fraca', acceptable: false };
  }
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;

  const clamped = Math.min(4, score) as 0 | 1 | 2 | 3 | 4;
  const labels = ['Muito fraca', 'Fraca', 'Razoável', 'Boa', 'Forte'];
  return {
    score: clamped,
    label: labels[clamped],
    acceptable: clamped >= 2 && password.length >= 8,
  };
}

interface Props {
  password: string;
  className?: string;
}

const COLORS = [
  'bg-muted',
  'bg-destructive',
  'bg-amber-500',
  'bg-emerald-500',
  'bg-emerald-600',
];

export default function PasswordStrengthMeter({ password, className }: Props) {
  const { score, label, acceptable } = evaluatePasswordStrength(password);

  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((idx) => (
          <span
            key={idx}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-colors',
              idx <= score ? COLORS[score] : 'bg-muted',
            )}
          />
        ))}
      </div>
      <p
        className={cn(
          'text-xs',
          acceptable ? 'text-muted-foreground' : 'text-destructive',
        )}
      >
        Força: <span className="font-medium">{label}</span>
        {!acceptable && password.length > 0
          ? ' — use pelo menos 8 caracteres, com letras maiúsculas e minúsculas.'
          : ''}
      </p>
    </div>
  );
}
