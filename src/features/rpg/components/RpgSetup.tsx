import { useMemo, useState } from 'react';
import { Book, Crown, Loader2, Swords, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useAgentsDisplay } from '@/hooks/useAgentDisplay';
import { AGENTS, type AgentIA } from '@/features/chat/types';
import { SCENARIOS } from '../rpg.constants';
import type { ActorRef, Scenario } from '../types';
import type { RpgSetupParams } from '../hooks/useRpgCampaign';

interface RpgSetupProps {
  isGenerating: boolean;
  onStart: (params: RpgSetupParams) => Promise<void>;
}

export function RpgSetup({ isGenerating, onStart }: RpgSetupProps) {
  const agentsDisplay = useAgentsDisplay();
  const [master, setMaster] = useState<ActorRef>('user');
  const [aiPlayers, setAiPlayers] = useState<AgentIA[]>([]);
  const [scenario, setScenario] = useState<Scenario>('fantasy');
  const [customPrompt, setCustomPrompt] = useState('');
  const [setupError, setSetupError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableAIPlayers = useMemo(
    () => AGENTS.filter((a) => a !== master),
    [master],
  );

  const toggleAIPlayer = (agent: AgentIA) => {
    setAiPlayers((prev) =>
      prev.includes(agent) ? prev.filter((a) => a !== agent) : [...prev, agent],
    );
  };

  // garante que se o mestre virar uma IA, ela sai dos jogadores
  const effectiveAIPlayers = aiPlayers.filter((a) => a !== master);

  const canStart =
    effectiveAIPlayers.length >= 1 &&
    effectiveAIPlayers.length <= 3 &&
    (scenario !== 'custom' || customPrompt.trim().length > 0);

  const handleStart = async () => {
    if (!canStart) return;
    setSetupError(null);
    setIsSubmitting(true);
    try {
      await onStart({
        scenario,
        customPrompt: scenario === 'custom' ? customPrompt : undefined,
        master,
        aiPlayers: effectiveAIPlayers,
      });
    } catch (err) {
      setSetupError(err instanceof Error ? err.message : 'Erro ao validar o tema.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col gap-8">
      <header className="flex flex-col gap-3 text-center">
        <span className="inline-flex w-fit mx-auto items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs md:text-md font-medium text-muted-foreground">
          <Swords size={20} className="text-amber-500" />
          Mesa de D&amp;D · campanha solo ou cooperativa
        </span>
        <h1 className="font-extrabold tracking-tight text-3xl md:text-5xl">
          Monte sua campanha
        </h1>
        <p className="text-muted-foreground text-base md:text-lg">
          Escolha o Mestre, quem joga e o universo da aventura.
        </p>
      </header>

      {/* Mestre */}
      <Card>
        <CardContent className="px-5 md:px-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Crown size={18} className="text-amber-500" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Mestre da mesa
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <MasterCard
              isSelected={master === 'user'}
              onSelect={() => setMaster('user')}
              label="Você"
              subtitle="Narre a história"
              icon={<UserIcon size={24} />}
              iconClass="bg-primary text-primary-foreground"
            />
            {AGENTS.map((agent) => {
              const cfg = agentsDisplay[agent];
              const Icon = cfg.Icon;
              return (
                <MasterCard
                  key={agent}
                  isSelected={master === agent}
                  onSelect={() => setMaster(agent)}
                  label={cfg.label}
                  subtitle={cfg.model}
                  icon={<Icon size={24} />}
                  iconClass={cfg.iconClass}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Jogadores IA */}
      <Card>
        <CardContent className="px-5 md:px-6 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <UserIcon size={18} className="text-primary" />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Jogadores IA
              </h2>
            </div>
            <span className="text-xs text-muted-foreground tabular-nums">
              {effectiveAIPlayers.length}/3
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {master === 'user'
              ? 'Você é o Mestre — selecione de 1 a 3 IAs como jogadores.'
              : 'Você jogará junto com as IAs selecionadas (1 a 3).'}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {availableAIPlayers.map((agent) => {
              const cfg = agentsDisplay[agent];
              const Icon = cfg.Icon;
              const isSelected = aiPlayers.includes(agent);
              return (
                <button
                  key={agent}
                  type="button"
                  onClick={() => toggleAIPlayer(agent)}
                  aria-pressed={isSelected}
                  className={cn(
                    'group flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all cursor-pointer',
                    'hover:border-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    isSelected && 'border-primary bg-primary/5 shadow-sm',
                  )}
                >
                  <div className={cn('rounded-full p-2.5', cfg.iconClass)}>
                    <Icon size={22} />
                  </div>
                  <p className="text-sm font-semibold truncate">{cfg.label}</p>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Cenário */}
      <Card>
        <CardContent className="px-5 md:px-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Book size={18} />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Cenário
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {SCENARIOS.map((s) => {
              const Icon = s.icon;
              const isSelected = scenario === s.id;
              const ColorSelected = scenario === s.id ? s.color : 'border-muted-foreground';
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setScenario(s.id)}
                  aria-pressed={isSelected}
                  className={cn(
                    'group text-left rounded-xl p-4 transition-all cursor-pointer relative overflow-hidden',
                    'hover:ring-2 hover:ring-ring',
                    ColorSelected,
                    isSelected && `border-2`,
                  )}
                >
                  <div className={cn('absolute inset-0 bg-gradient-to-br opacity-50', s.accent)} aria-hidden />
                  <div className="relative flex flex-col gap-2">
                    <div className={cn('size-12 rounded-lg flex items-center justify-center bg-background/70 backdrop-blur', s.accent.split(' ').pop())}>
                      <Icon size={24} />
                    </div>
                    <p className="font-semibold">{s.label}</p>
                    <p className="text-xs text-muted-foreground">{s.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
          {scenario === 'custom' && (
            <div className="flex flex-col gap-2">
              <label htmlFor="rpg-custom" className="text-xs font-medium text-muted-foreground">
                Descreva o universo da campanha
              </label>
              <Textarea
                id="rpg-custom"
                value={customPrompt}
                onChange={(e) => {
                  setCustomPrompt(e.target.value);
                  if (setupError) setSetupError(null);
                }}
                placeholder="Ex.: uma cidade flutuante steampunk onde o vapor virou moeda…"
                rows={3}
                maxLength={500}
                className={cn(setupError && 'border-destructive focus-visible:ring-destructive')}
              />
              <div className="flex items-center justify-between gap-2">
                {setupError ? (
                  <p className="text-xs text-destructive first-letter:capitalize">{setupError}</p>
                ) : (
                  <span />
                )}
                <p className="text-[11px] text-muted-foreground tabular-nums">
                  {customPrompt.length}/500
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col items-center gap-3">
        {setupError && scenario !== 'custom' && (
          <p className="text-sm text-destructive text-center">{setupError}</p>
        )}
        <Button
          size="lg"
          onClick={handleStart}
          disabled={!canStart || isSubmitting || isGenerating}
          className="gap-2 w-full md:w-auto px-8 text-md cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin mr-2" size={24} />
              Analisando tema...
            </>
          ) : (
            <>
              <Swords className="mr-2 fill-current" size={24} />
              Iniciar campanha
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

interface MasterCardProps {
  isSelected: boolean;
  onSelect: () => void;
  label: string;
  subtitle: string;
  icon: React.ReactNode;
  iconClass: string;
}

function MasterCard({ isSelected, onSelect, label, subtitle, icon, iconClass }: MasterCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
      className={cn(
        'flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all cursor-pointer',
        'hover:border-amber-400/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        isSelected && 'border-amber-400 bg-amber-400/15 shadow-md',
      )}
    >
      <div className={cn('rounded-full p-2.5', iconClass)}>{icon}</div>
      <div className="text-center min-w-0 w-full">
        <p className="text-sm font-semibold truncate">{label}</p>
        <p className="text-[11px] text-muted-foreground truncate">{subtitle}</p>
      </div>
    </button>
  );
}