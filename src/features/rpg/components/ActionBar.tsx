import { useMemo, useState } from "react";
import {
  Crown,
  Dices,
  Loader2,
  Send,
  SkipForward,
  Sparkles,
  Square,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { IA_CONFIG } from "@/features/chat/chat.constants";
import type { AgentIA } from "@/features/chat/types";
import {
  ATTRIBUTE_KEYS,
  ATTRIBUTE_LABELS,
  type AttributeKey,
  attributeModifier,
  DICE_TYPES,
  getClassPrimaryAttribute,
  rollWithModifier,
} from "../rpg.constants";
import type { ActorRef, DiceRoll, DiceType, RpgCampaign } from "../types";
import { DiceRoller } from "./DiceRoller";

interface ActionBarProps {
  campaign: RpgCampaign;
  currentActor: ActorRef;
  isGenerating: boolean;
  onSubmitUser: (content: string, roll?: DiceRoll) => Promise<void>;
  onGenerateAI: () => void;
  onAbort: () => void;
  onSkip: () => void;
}

export function ActionBar({
  campaign,
  currentActor,
  isGenerating,
  onSubmitUser,
  onGenerateAI,
  onAbort,
  onSkip,
}: ActionBarProps) {
  const [draft, setDraft] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isUserTurn = currentActor === "user";
  const isMasterTurn = currentActor === campaign.master;
  const isBusy = isSubmitting || isGenerating;

  const userCharacter = useMemo(
    () => campaign.characters.find((c) => c.owner === "user"),
    [campaign.characters],
  );

  // estado dos dados (apenas quando o usuário é jogador)
  const [diceType, setDiceType] = useState<DiceType>("d20");
  const [modAttr, setModAttr] = useState<AttributeKey | "none">(
    userCharacter ? getClassPrimaryAttribute(userCharacter.classe) : "none",
  );
  const [spinning, setSpinning] = useState(false);
  const [roll, setRoll] = useState<DiceRoll | null>(null);

  const handleRoll = () => {
    if (spinning || isBusy) return;
    setSpinning(true);
    setRoll(null);
    window.setTimeout(() => {
      const mod =
        modAttr !== "none" && userCharacter
          ? attributeModifier(userCharacter.attributes[modAttr])
          : 0;
      const label = modAttr !== "none" ? ATTRIBUTE_LABELS[modAttr] : undefined;
      setRoll(rollWithModifier(diceType, mod, label));
      setSpinning(false);
    }, 850);
  };

  const handleSubmit = async () => {
    const trimmed = draft.trim();
    if (!trimmed || isBusy) return;

    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await onSubmitUser(trimmed, roll ?? undefined);
      setDraft("");
      setRoll(null);
    } catch (err) {
      const isCanceled = (err as { name?: string })?.name === "CanceledError";
      if (!isCanceled) {
        setSubmitError(
          err instanceof Error ? err.message : "Conteúdo não permitido.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isUserTurn) {
    return (
      <div
        className={cn(
          "rounded-xl border p-3 md:p-4 flex flex-col gap-2",
          isMasterTurn
            ? "border-amber-500/40 bg-amber-500/5"
            : "border-primary/40 bg-primary/5",
        )}
      >
        <div className="flex items-center gap-2 text-xs min-w-0">
          {isMasterTurn ? (
            <>
              <Crown size={14} className="text-amber-500" />
              <span className="font-semibold text-amber-700 dark:text-amber-400 truncate">
                Sua vez como Mestre — narre a cena
              </span>
            </>
          ) : (
            <>
              <UserIcon size={14} className="text-primary" />
              <span className="font-semibold text-primary truncate">
                Sua vez como jogador — descreva sua ação
              </span>
            </>
          )}
        </div>
        <Textarea
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            if (submitError) setSubmitError(null);
          }}
          placeholder={
            isMasterTurn
              ? "Descreva a cena, o ambiente e o que os jogadores percebem…"
              : "Em primeira pessoa: o que você diz ou faz?"
          }
          rows={3}
          className={cn(
            submitError && "border-destructive focus-visible:ring-destructive",
          )}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              void handleSubmit();
            }
          }}
        />
        {!isMasterTurn && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-lg border bg-muted/30 p-2.5">
            <div className="shrink-0 mx-auto sm:mx-0">
              <DiceRoller
                dice={diceType}
                spinning={spinning}
                value={roll?.raw ?? null}
                size={72}
                color="#6366f1"
              />
            </div>
            <div className="flex flex-1 flex-col gap-2 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Select
                  value={diceType}
                  onValueChange={(v) => {
                    setDiceType(v as DiceType);
                    setRoll(null);
                  }}
                  disabled={spinning}
                >
                  <SelectTrigger className="h-8 flex-1 sm:w-22">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DICE_TYPES.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={modAttr}
                  onValueChange={(v) => {
                    setModAttr(v as AttributeKey | "none");
                    setRoll(null);
                  }}
                  disabled={spinning}
                >
                  <SelectTrigger className="h-8 flex-1 sm:w-35">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sem modificador</SelectItem>
                    {ATTRIBUTE_KEYS.map((key) => {
                      const mod = userCharacter
                        ? attributeModifier(userCharacter.attributes[key])
                        : 0;
                      const sign = mod >= 0 ? `+${mod}` : `${mod}`;
                      return (
                        <SelectItem key={key} value={key}>
                          {ATTRIBUTE_LABELS[key]} ({sign})
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleRoll}
                  disabled={spinning || isBusy}
                  className="h-8 gap-1.5 cursor-pointer w-full sm:w-auto"
                >
                  <Dices size={14} />
                  Rolar
                </Button>
              </div>
              {roll && !spinning && (
                <p className="text-xs text-muted-foreground">
                  Resultado:{" "}
                  <span className="font-semibold text-foreground tabular-nums">
                    {roll.dice} {roll.raw}
                    {roll.modifier !== 0 &&
                      ` ${roll.modifier > 0 ? "+" : "−"}${Math.abs(roll.modifier)}`}
                    {" = "}
                    {roll.total}
                  </span>{" "}
                  — descreva sua ação usando esse resultado.
                </p>
              )}
            </div>
          </div>
        )}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div className="flex flex-col justify-center">
            {submitError ? (
              <p className="text-xs text-destructive first-letter:capitalize">{submitError}</p>
            ) : (
              <p className="text-[11px] text-muted-foreground">
                <kbd className="px-1.5 py-0.5 rounded border bg-background text-[10px]">
                  Ctrl
                </kbd>
                {" + "}
                <kbd className="px-1.5 py-0.5 rounded border bg-background text-[10px]">
                  Enter
                </kbd>
                {" para enviar"}
              </p>
            )}
          </div>
          <div className="flex items-center justify-end gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={onSkip}
              disabled={isBusy}
              className="cursor-pointer gap-1.5"
              title="Pular sua vez"
            >
              <SkipForward size={14} />
              Pular
            </Button>
            <Button
              onClick={() => void handleSubmit()}
              disabled={!draft.trim() || isBusy}
              className="cursor-pointer gap-1.5"
            >
              {isSubmitting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Send size={14} />
              )}
              Enviar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // turno de IA
  const cfg = IA_CONFIG[currentActor as AgentIA];
  const Icon = cfg.Icon;

  return (
    <div
      className={cn(
        "rounded-xl border p-3 md:p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2 md:gap-3",
        isMasterTurn ? "border-amber-500/40 bg-amber-500/5" : "bg-muted/30",
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className={cn("rounded-full p-2 shrink-0", cfg.iconClass)}>
          <Icon size={18} />
        </div>
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-1">
            {isMasterTurn ? (
              <>
                <Crown size={11} className="text-amber-500" />
                Vez do Mestre
              </>
            ) : (
              <>
                <Sparkles size={11} />
                Vez do jogador
              </>
            )}
          </p>
          <p className="font-semibold truncate">{cfg.label}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={onSkip}
          className="cursor-pointer gap-1.5"
        >
          <SkipForward size={14} />
          Pular
        </Button>
        {isGenerating ? (
          <Button
            variant="outline"
            size="sm"
            onClick={onAbort}
            className="cursor-pointer gap-1.5"
          >
            <Square className="h-4 w-4 fill-current" />
            <span className="hidden sm:inline">Cancelar</span>
          </Button>
        ) : (
          <Button onClick={onGenerateAI} className="cursor-pointer gap-1.5">
            {isGenerating ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Sparkles size={14} />
            )}
            {isMasterTurn ? "Gerar narração" : "Gerar resposta"}
          </Button>
        )}
      </div>
    </div>
  );
}
