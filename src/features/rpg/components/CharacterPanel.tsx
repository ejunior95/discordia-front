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
import type { Character } from '../types';

interface CharacterPanelProps {
  characters: Character[];
}

export function CharacterPanel({ characters }: CharacterPanelProps) {
  if (characters.length === 0) {
    return (
      <p className="text-xs text-muted-foreground italic px-2">
        Nenhum personagem na mesa.
      </p>
    );
  }

  return (
    <Accordion type="multiple" defaultValue={characters.map((c) => c.name)} className="w-full">
      {characters.map((char) => {
        const isUser = char.owner === 'user';
        const cfg = isUser ? null : IA_CONFIG[char.owner as AgentIA];
        const Icon = isUser ? UserIcon : cfg!.Icon;
        const iconClass = isUser ? 'bg-primary text-primary-foreground' : cfg!.iconClass;
        const ownerLabel = isUser ? 'Jogador' : cfg!.label;
        const hpPct = Math.round((char.hp / char.maxHp) * 100);

        return (
          <AccordionItem key={char.name} value={char.name} className="border rounded-lg mb-2 px-3">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={cn('rounded-full p-1.5 shrink-0', iconClass)}>
                  <Icon size={14} />
                </div>
                <div className="text-left min-w-0">
                  <p className="text-sm font-semibold truncate">{char.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {char.classe} · {ownerLabel}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 space-y-3">
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Heart size={11} className="text-rose-500" />
                    HP
                  </span>
                  <span className="font-semibold tabular-nums">
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
              <div className="grid grid-cols-3 gap-1.5 text-center">
                <AttrBlock label="FOR" value={char.attributes.for} />
                <AttrBlock label="DES" value={char.attributes.des} />
                <AttrBlock label="CON" value={char.attributes.con} />
                <AttrBlock label="INT" value={char.attributes.int} />
                <AttrBlock label="SAB" value={char.attributes.sab} />
                <AttrBlock label="CAR" value={char.attributes.car} />
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

function AttrBlock({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border bg-background/50 px-2 py-1.5">
      <p className="text-[10px] text-muted-foreground tracking-wide">{label}</p>
      <p className="text-sm font-bold tabular-nums">{value}</p>
    </div>
  );
}
