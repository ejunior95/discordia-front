import { Heart, User as UserIcon } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { IA_CONFIG } from '@/features/chat/chat.constants';
import type { AgentIA } from '@/features/chat/types';
import {
  ATTRIBUTE_LABELS,
  type AttributeKey,
  getClassPrimaryAttribute,
} from '../rpg.constants';
import type { Character } from '../types';

interface CharacterPanelProps {
  characters: Character[];
}

export function CharacterPanel({ characters }: CharacterPanelProps) {
  if (characters.length === 0) {
    return (
      <p className="min-w-0 max-w-full px-2 text-xs italic text-muted-foreground">
        Nenhum personagem na mesa.
      </p>
    );
  }

  return (
    <Accordion type="multiple" defaultValue={characters.map((c) => c.name)} className="w-full min-w-0 max-w-full">
      {characters.map((char) => {
        const isUser = char.owner === 'user';
        const cfg = isUser ? null : IA_CONFIG[char.owner as AgentIA];
        const Icon = isUser ? UserIcon : cfg!.Icon;
        const iconClass = isUser ? 'bg-primary text-primary-foreground' : cfg!.iconClass;
        const ownerLabel = isUser ? 'Jogador' : cfg!.label;
        const hpPct = Math.round((char.hp / char.maxHp) * 100);
        const primaryAttr = getClassPrimaryAttribute(char.classe);

        return (
          <AccordionItem key={char.name} value={char.name} className="mb-2 w-full min-w-0 max-w-full overflow-hidden rounded-lg border px-2 sm:px-3">
            <AccordionTrigger className="min-w-0 gap-2 py-3 hover:no-underline sm:gap-4 sm:py-4">
              <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                <div className={cn('rounded-full p-1.5 shrink-0', iconClass)}>
                  <Icon size={14} />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <p className="text-sm font-semibold truncate">{char.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {char.classe} · {ownerLabel}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="min-w-0 space-y-3 pt-2">
              <div className="min-w-0">
                <div className="mb-1 flex min-w-0 items-center justify-between gap-2 text-[11px]">
                  <span className="flex min-w-0 items-center gap-1 text-muted-foreground">
                    <Heart size={11} className="text-rose-500" />
                    HP
                  </span>
                  <span className="min-w-14 shrink-0 text-right font-semibold tabular-nums">
                    {char.hp}/{char.maxHp}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      hpPct > 60 ? 'bg-emerald-500' : hpPct > 30 ? 'bg-amber-500' : 'bg-rose-500',
                    )}
                    style={{ width: `${hpPct}%` }}
                  />
                </div>
              </div>
              <div className="grid min-w-0 grid-cols-3 gap-1 text-center sm:gap-1.5">
                {(Object.keys(ATTRIBUTE_LABELS) as AttributeKey[]).map((key) => (
                  <AttrBlock
                    key={key}
                    label={ATTRIBUTE_LABELS[key]}
                    value={char.attributes[key]}
                    highlight={key === primaryAttr}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

function AttrBlock({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        'min-w-0 rounded-md border bg-background/50 px-1.5 py-1.5 sm:px-2',
        highlight && 'border-primary/60 bg-primary/5',
      )}
    >
      <p className="truncate text-[10px] tracking-wide text-muted-foreground">
        {label}
        {highlight && ' ★'}
      </p>
      <p className="text-sm font-bold tabular-nums">{value}</p>
    </div>
  );
}
