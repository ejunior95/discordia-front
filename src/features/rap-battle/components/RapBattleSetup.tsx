import { useState } from 'react';
import { Mic, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useAgentsDisplay } from '@/hooks/useAgentDisplay';
import { AGENTS, type AgentIA } from '@/features/chat/types';
import { usePreferences } from '@/features/account/hooks/usePreferences';
import { VoiceGenderSwitch } from '@/features/account/components/VoiceGenderSwitch';
import type { VoiceGender } from '@/features/account/types';
import { RAP_THEME_SUGGESTIONS } from '../rap.constants';

interface RapBattleSetupProps {
  onStart: (params: {
    contenders: [AgentIA, AgentIA];
    theme: string;
    voiceGender: VoiceGender;
  }) => void;
}

export function RapBattleSetup({ onStart }: RapBattleSetupProps) {
  const agentsDisplay = useAgentsDisplay();
  const { preferences } = usePreferences();
  const [selected, setSelected] = useState<AgentIA[]>([]);
  const [theme, setTheme] = useState('');
  const [voiceGender, setVoiceGender] = useState<VoiceGender>(
    preferences.ai.voiceGender,
  );

  const toggle = (agent: AgentIA) => {
    setSelected((prev) => {
      if (prev.includes(agent)) return prev.filter((a) => a !== agent);
      if (prev.length >= 2) return [prev[1], agent];
      return [...prev, agent];
    });
  };

  const canStart = selected.length === 2;

  const handleStart = () => {
    if (!canStart) return;
    onStart({ contenders: [selected[0], selected[1]], theme, voiceGender });
  };

  return (
    <div className="max-w-3xl mx-auto w-full flex flex-col gap-8">
      <header className="flex flex-col gap-3 text-center">
        <span className="inline-flex w-fit mx-auto items-center gap-2 rounded-full border bg-background px-3 py-1 text-md font-medium text-muted-foreground">
          <Mic size={18} className="text-fuchsia-500" />
          Modo 8 Mile · 3 rounds
        </span>
        <h1 className="font-extrabold tracking-tight text-3xl md:text-5xl">
          Monte a batalha
        </h1>
        <p className="text-muted-foreground text-base md:text-lg">
          Escolha 2 IAs para subirem no palco e, se quiser, defina o tema da disputa.
        </p>
      </header>

      <Card>
        <CardContent className="px-5 md:px-6 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Competidores
            </h2>
            <span className="text-xs text-muted-foreground tabular-nums">
              {selected.length}/2 selecionadas
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {AGENTS.map((agent) => {
              const cfg = agentsDisplay[agent];
              const Icon = cfg.Icon;
              const isSelected = selected.includes(agent);
              const slot = selected.indexOf(agent);
              return (
                <button
                  key={agent}
                  type="button"
                  onClick={() => toggle(agent)}
                  aria-pressed={isSelected}
                  className={cn(
                    'group relative flex flex-col items-center gap-2 rounded-xl border p-4 transition-all cursor-pointer',
                    'hover:border-primary/50 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    isSelected && 'border-fuchsia-500 bg-fuchsia-500/5 shadow-md',
                  )}
                >
                  {isSelected && (
                    <span className="absolute top-2 right-2 size-6 rounded-full bg-fuchsia-500 text-white text-xs font-bold flex items-center justify-center">
                      {slot + 1}
                    </span>
                  )}
                  <div className={cn('rounded-full p-3', cfg.iconClass)}>
                    <Icon size={28} />
                  </div>
                  <div className="text-center min-w-0 w-full">
                    <p className="font-semibold truncate">{cfg.label}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{cfg.model}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="px-5 md:px-6 flex flex-col gap-4">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Tema (opcional)
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Sem tema, as IAs vão se atacar livremente.
            </p>
          </div>
          <Input
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="Ex.: quem é a IA mais inteligente"
            maxLength={120}
          />
          <div className="flex flex-wrap gap-2">
            {RAP_THEME_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setTheme(suggestion)}
                className="cursor-pointer text-xs px-3 py-1.5 rounded-full border bg-background hover:bg-accent transition-colors inline-flex items-center gap-1"
              >
                <Sparkles size={11} className="text-muted-foreground" />
                {suggestion}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="px-5 md:px-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Voz da música
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Escolha entre voz masculina ou feminina para os versos cantados.
            </p>
          </div>
          <VoiceGenderSwitch value={voiceGender} onChange={setVoiceGender} />
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={handleStart}
          disabled={!canStart}
          className="gap-2 px-8 w-full md:w-auto text-md cursor-pointer"
        >
          <Mic size={24} />
          Iniciar batalha
        </Button>
      </div>
    </div>
  );
}
