import { useEffect, useMemo, useRef, useState } from 'react';
import { Dices, Heart, Loader2, Shield, Swords } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  ATTRIBUTE_KEYS,
  ATTRIBUTE_LABELS,
  type AttributeKey,
  buildUserCharacter,
  computeMaxHp,
  getClassPrimaryAttribute,
  getScenarioConfig,
  rollAttributeSet,
  STANDARD_ARRAY,
} from '../rpg.constants';
import type { Attributes, Character, Scenario } from '../types';
import { DiceRoller } from './DiceRoller';

interface CharacterCreatorProps {
  scenario: Scenario;
  onConfirm: (character: Character) => void;
  onBack: () => void;
}

type Mode = 'roll' | 'standard';

const EMPTY_STANDARD: Record<AttributeKey, number | null> = {
  for: null,
  des: null,
  con: null,
  int: null,
  sab: null,
  car: null,
};

export function CharacterCreator({ scenario, onConfirm, onBack }: CharacterCreatorProps) {
  const cfg = getScenarioConfig(scenario);
  const [name, setName] = useState('');
  const [classe, setClasse] = useState(cfg.classes[0]);
  const [mode, setMode] = useState<Mode>('roll');

  // modo "rolar"
  const [rolled, setRolled] = useState<Attributes | null>(null);
  const [spinning, setSpinning] = useState(false);
  const spinTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // modo "distribuição padrão"
  const [standard, setStandard] = useState<Record<AttributeKey, number | null>>(EMPTY_STANDARD);

  useEffect(() => () => {
    if (spinTimeout.current) clearTimeout(spinTimeout.current);
  }, []);

  const handleRoll = () => {
    if (spinning) return;
    setSpinning(true);
    setRolled(null);
    spinTimeout.current = setTimeout(() => {
      setRolled(rollAttributeSet());
      setSpinning(false);
    }, 900);
  };

  const usedStandardValues = useMemo(
    () => Object.values(standard).filter((v): v is number => v != null),
    [standard],
  );

  const setStandardValue = (key: AttributeKey, value: number) => {
    setStandard((prev) => {
      const next = { ...prev };
      // remove o valor se já estava em outro atributo
      for (const k of ATTRIBUTE_KEYS) {
        if (next[k] === value) next[k] = null;
      }
      next[key] = value;
      return next;
    });
  };

  const standardComplete =
    ATTRIBUTE_KEYS.every((k) => standard[k] != null) &&
    usedStandardValues.length === STANDARD_ARRAY.length;

  const finalAttributes: Attributes | null = useMemo(() => {
    if (mode === 'roll') return rolled;
    if (!standardComplete) return null;
    return {
      for: standard.for ?? 10,
      des: standard.des ?? 10,
      con: standard.con ?? 10,
      int: standard.int ?? 10,
      sab: standard.sab ?? 10,
      car: standard.car ?? 10,
    };
  }, [mode, rolled, standard, standardComplete]);

  const primaryAttr = getClassPrimaryAttribute(classe);
  const canConfirm = name.trim().length > 0 && !!finalAttributes && !spinning;

  const handleConfirm = () => {
    if (!canConfirm || !finalAttributes) return;
    onConfirm(buildUserCharacter(name, classe, finalAttributes));
  };

  return (
    <div className="max-w-3xl mx-auto w-full flex flex-col gap-6">
      <header className="flex flex-col gap-2 text-center">
        <span className="inline-flex w-fit mx-auto items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs md:text-sm font-medium text-muted-foreground">
          <Swords size={16} className="text-amber-500" />
          Crie seu personagem
        </span>
        <h1 className="font-extrabold tracking-tight text-2xl md:text-4xl">
          Quem você será na mesa?
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Defina nome, classe e atributos antes de começar a aventura.
        </p>
      </header>

      {/* Identidade */}
      <Card>
        <CardContent className="px-5 md:px-6 py-5 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="char-name">Nome do personagem</Label>
              <Input
                id="char-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex.: Thalion, Kara, Vex…"
                maxLength={40}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="char-class">Classe</Label>
              <Select value={classe} onValueChange={setClasse}>
                <SelectTrigger id="char-class">
                  <SelectValue placeholder="Escolha a classe" />
                </SelectTrigger>
                <SelectContent>
                  {cfg.classes.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Atributo principal:{' '}
                <span className="font-semibold text-foreground">
                  {ATTRIBUTE_LABELS[primaryAttr]}
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Atributos */}
      <Card>
        <CardContent className="px-5 md:px-6 py-5 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Atributos
            </h2>
          </div>

          <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="roll" className="gap-1.5">
                <Dices size={15} />
                Rolar 3d6
              </TabsTrigger>
              <TabsTrigger value="standard">Distribuição padrão</TabsTrigger>
            </TabsList>

            {/* Modo rolar */}
            <TabsContent value="roll" className="flex flex-col gap-4 pt-4">
              <div className="flex flex-col items-center gap-3">
                <DiceRoller dice="d6" spinning={spinning} value={null} size={110} />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleRoll}
                  disabled={spinning}
                  className="gap-2 cursor-pointer"
                >
                  {spinning ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Dices size={16} />
                  )}
                  {rolled ? 'Rolar novamente' : 'Rolar atributos'}
                </Button>
              </div>
              <AttributeGrid attributes={rolled} primary={primaryAttr} />
              {!rolled && !spinning && (
                <p className="text-center text-xs text-muted-foreground">
                  Role 3d6 para cada atributo (valores de 3 a 18).
                </p>
              )}
            </TabsContent>

            {/* Modo distribuição padrão */}
            <TabsContent value="standard" className="flex flex-col gap-4 pt-4">
              <p className="text-xs text-muted-foreground">
                Distribua os valores {STANDARD_ARRAY.join(', ')} entre os atributos
                (cada valor usado uma vez).
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {ATTRIBUTE_KEYS.map((key) => (
                  <div key={key} className="flex flex-col gap-1.5">
                    <Label
                      className={cn(
                        'text-xs',
                        key === primaryAttr && 'text-primary font-semibold',
                      )}
                    >
                      {ATTRIBUTE_LABELS[key]}
                      {key === primaryAttr && ' ★'}
                    </Label>
                    <Select
                      value={standard[key] != null ? String(standard[key]) : undefined}
                      onValueChange={(v) => setStandardValue(key, Number(v))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="—" />
                      </SelectTrigger>
                      <SelectContent>
                        {STANDARD_ARRAY.map((value) => {
                          const usedElsewhere =
                            usedStandardValues.includes(value) && standard[key] !== value;
                          return (
                            <SelectItem
                              key={value}
                              value={String(value)}
                              disabled={usedElsewhere}
                            >
                              {value}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {finalAttributes && (
            <div className="flex items-center justify-center gap-2 rounded-lg border bg-muted/30 px-4 py-2 text-sm">
              <Heart size={16} className="text-rose-500" />
              <span className="text-muted-foreground">HP inicial:</span>
              <span className="font-bold tabular-nums">
                {computeMaxHp(finalAttributes.con)}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={onBack} className="cursor-pointer">
          Voltar
        </Button>
        <Button
          size="lg"
          onClick={handleConfirm}
          disabled={!canConfirm}
          className="gap-2 px-8 cursor-pointer"
        >
          <Swords size={18} className="fill-current" />
          Confirmar personagem
        </Button>
      </div>
    </div>
  );
}

function AttributeGrid({
  attributes,
  primary,
}: {
  attributes: Attributes | null;
  primary: AttributeKey;
}) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
      {ATTRIBUTE_KEYS.map((key) => {
        const value = attributes?.[key];
        return (
          <div
            key={key}
            className={cn(
              'flex flex-col items-center gap-0.5 rounded-lg border py-2',
              key === primary && 'border-primary/60 bg-primary/5',
            )}
          >
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {ATTRIBUTE_LABELS[key]}
            </span>
            <span className="text-lg font-bold tabular-nums">
              {value != null ? value : '—'}
            </span>
          </div>
        );
      })}
    </div>
  );
}
