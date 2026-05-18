import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { IA_CONFIG } from '@/features/chat/chat.constants';
import { AGENTS, type AgentIA } from '@/features/chat/types';
import { usePreferences } from '@/features/account/hooks/usePreferences';
import type { AIPreferences } from '@/features/account/types';
import { VoiceGenderSwitch } from '@/features/account/components/VoiceGenderSwitch';

export default function AIPreferencesTab() {
  const { preferences, update } = usePreferences();

  const setAI = (patch: Partial<AIPreferences>) =>
    update({ ai: { ...preferences.ai, ...patch } });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferências de IA</CardTitle>
        <CardDescription>
          Personalize como o chat se comporta com seus modelos favoritos.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>IA favorita</Label>
          <Select
            value={preferences.ai.favoriteAgent}
            onValueChange={(v) => setAI({ favoriteAgent: v as AgentIA | 'none' })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhuma preferência</SelectItem>
              {AGENTS.map((a) => (
                <SelectItem key={a} value={a}>
                  {IA_CONFIG[a].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-muted-foreground text-xs">
            {/* TODO(chat): destacar visualmente a IA favorita nas próximas rodadas. */}
            Sua IA favorita ganhará destaque visual nos próximos rounds.
          </p>
        </div>

        <div className="space-y-2">
          <Label>Modo de comparação</Label>
          <Select
            value={preferences.ai.comparisonMode}
            onValueChange={(v) =>
              setAI({ comparisonMode: v as AIPreferences['comparisonMode'] })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="parallel">Paralelo (todas ao mesmo tempo)</SelectItem>
              <SelectItem value="sequential">Sequencial (uma por vez)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
          <div className="min-w-0 space-y-0.5">
            <Label htmlFor="auto-vote" className="text-sm font-medium">
              Voto automático na favorita
            </Label>
            <p className="text-muted-foreground text-xs">
              Se a IA favorita responder primeiro, atribui um voto automaticamente.
            </p>
          </div>
          <Switch
            id="auto-vote"
            checked={preferences.ai.autoVoteFavorite}
            disabled={preferences.ai.favoriteAgent === 'none'}
            onCheckedChange={(v) => setAI({ autoVoteFavorite: v })}
            className="shrink-0"
          />
        </div>

        <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
          <div className="min-w-0 space-y-0.5">
            <Label htmlFor="voice-gender" className="text-sm font-medium">
              Voz padrão para músicas
            </Label>
            <p className="text-muted-foreground text-xs">
              Define se a voz cantada nas batalhas de rap será masculina (azul)
              ou feminina (rosa). Pode ser alterada antes de iniciar cada batalha.
            </p>
          </div>
          <VoiceGenderSwitch
            id="voice-gender"
            value={preferences.ai.voiceGender}
            onChange={(voiceGender) => setAI({ voiceGender })}
          />
        </div>

        <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
          <div className="min-w-0 space-y-0.5">
            <Label htmlFor="show-karaoke" className="text-sm font-medium">
              Karaokê nas batalhas de rap
            </Label>
            <p className="text-muted-foreground text-xs">
              Destaca cada palavra da letra em sincronia com o áudio enquanto a
              música toca. Desative para ver apenas o texto estático.
            </p>
          </div>
          <Switch
            id="show-karaoke"
            checked={preferences.ai.showKaraoke}
            onCheckedChange={(v) => setAI({ showKaraoke: v })}
            className="shrink-0"
          />
        </div>
      </CardContent>
    </Card>
  );
}
