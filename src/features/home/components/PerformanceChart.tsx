import { useMemo } from 'react';
import { BarChart3 } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { IA_CONFIG } from '@/features/chat/chat.constants';
import { AGENTS, type AgentIA } from '@/features/chat/types';
import { AGENT_CHART_COLORS } from '../home.constants';
import type { WeeklyBucket } from '../home.types';

const WEEK_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
});

interface PerformanceChartProps {
  weekly: WeeklyBucket[];
}

export function PerformanceChart({ weekly }: PerformanceChartProps) {
  const chartConfig = useMemo<ChartConfig>(
    () =>
      AGENTS.reduce<ChartConfig>((acc, agent) => {
        acc[agent] = {
          label: IA_CONFIG[agent].label,
          color: AGENT_CHART_COLORS[agent],
        };
        return acc;
      }, {}),
    [],
  );

  const data = useMemo(
    () =>
      weekly.map((bucket) => ({
        week: WEEK_FORMATTER.format(new Date(bucket.weekStart)),
        ...AGENTS.reduce(
          (acc, agent) => {
            acc[agent] = bucket.byAgent[agent] ?? 0;
            return acc;
          },
          {} as Record<AgentIA, number>,
        ),
      })),
    [weekly],
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-4 text-xl">
          <BarChart3 size={28} className="text-primary" />
          Desempenho ao longo do tempo
        </CardTitle>
        <CardDescription>Vitórias por semana de cada IA</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <BarChart data={data} margin={{ left: 4, right: 4, top: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 4" strokeOpacity={0.2} />
            <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={11} allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
            <ChartLegend content={<ChartLegendContent />} />
            {AGENTS.map((agent) => (
              <Bar
                key={agent}
                dataKey={agent}
                stackId="weekly"
                fill={AGENT_CHART_COLORS[agent]}
                radius={agent === AGENTS[AGENTS.length - 1] ? [4, 4, 0, 0] : 0}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
