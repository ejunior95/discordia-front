import {
  Gamepad2,
  MessagesSquare,
  MicVocal,
  Swords,
  ThumbsUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { HomeTotals } from "../home.types";

interface StatItem {
  label: string;
  value: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  iconClass: string;
  hint?: string;
}

interface StatsOverviewProps {
  totals: HomeTotals;
}

export function StatsOverview({ totals }: StatsOverviewProps) {
  const stats: StatItem[] = [
    {
      label: "Perguntas feitas",
      value: totals.questions.toLocaleString("pt-BR"),
      icon: MessagesSquare,
      iconClass: "bg-blue-500/10 text-blue-500",
    },
    {
      label: "Batalhas de rima",
      value: totals.rapBattles.toLocaleString("pt-BR"),
      icon: MicVocal,
      iconClass: "bg-fuchsia-500/10 text-fuchsia-500",
    },
    {
      label: "Campanhas de RPG",
      value: totals.rpgCampaigns.toLocaleString("pt-BR"),
      icon: Swords,
      iconClass: "bg-amber-500/10 text-amber-500",
    },
    {
      label: "Jogadas em jogos",
      value: totals.miniGames.toLocaleString("pt-BR"),
      icon: Gamepad2,
      iconClass: "bg-red-500/10 text-red-500",
    },
    {
      label: "Votos computados",
      value: totals.votes.toLocaleString("pt-BR"),
      icon: ThumbsUp,
      iconClass: "bg-emerald-500/10 text-emerald-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3 md:gap-4">
      {stats.map(({ label, value, icon: Icon, iconClass, hint }) => (
        <Card key={label} className="py-4 md:py-5" title={label}>
          <CardContent className="px-4 md:px-5 flex items-center gap-3 md:gap-4">
            <div
              className={`shrink-0 size-16 rounded-lg flex items-center justify-center ${iconClass}`}
            >
              <Icon size={40} />
            </div>
            <div className="min-w-0">
              <p className="text-md md:text-sm text-muted-foreground truncate">
                {label}
              </p>
              <p className="text-3xl font-bold tracking-tight tabular-nums truncate">
                {value}
              </p>
              {hint && (
                <p className="text-[11px] text-muted-foreground hidden md:block truncate">
                  {hint}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
