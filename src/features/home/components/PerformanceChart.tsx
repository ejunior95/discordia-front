import { useMemo } from 'react';
import { LineChart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IA_CONFIG } from '@/features/chat/chat.constants';
import { AGENTS, type AgentIA } from '@/features/chat/types';
import { AGENT_CHART_COLORS, WEEKLY_PERFORMANCE } from '../home.mocks';

const WIDTH = 640;
const HEIGHT = 240;
const PADDING_X = 40;
const PADDING_Y = 24;

export function PerformanceChart() {
  const { polylines, ySteps, xLabels } = useMemo(() => {
    const allValues = WEEKLY_PERFORMANCE.flatMap((p) => AGENTS.map((a) => p.values[a]));
    const maxY = Math.ceil(Math.max(...allValues, 1) / 5) * 5;
    const minY = 0;
    const innerW = WIDTH - PADDING_X * 2;
    const innerH = HEIGHT - PADDING_Y * 2;
    const stepX = WEEKLY_PERFORMANCE.length > 1 ? innerW / (WEEKLY_PERFORMANCE.length - 1) : innerW;

    const toY = (v: number) => PADDING_Y + innerH - ((v - minY) / (maxY - minY || 1)) * innerH;

    const polylines = AGENTS.map((agent) => {
      const points = WEEKLY_PERFORMANCE.map((p, i) => {
        const x = PADDING_X + stepX * i;
        const y = toY(p.values[agent]);
        return `${x},${y}`;
      }).join(' ');
      return { agent, points };
    });

    const ySteps = [0, 0.25, 0.5, 0.75, 1].map((t) => ({
      y: PADDING_Y + innerH * (1 - t),
      label: Math.round(minY + (maxY - minY) * t).toString(),
    }));

    const xLabels = WEEKLY_PERFORMANCE.map((p, i) => ({
      x: PADDING_X + stepX * i,
      label: p.weekLabel,
    }));

    return { polylines, ySteps, xLabels };
  }, []);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <LineChart size={18} className="text-primary" />
          Desempenho ao longo do tempo
        </CardTitle>
        <CardDescription>Vitórias por semana de cada IA</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="w-full h-auto min-w-[480px]"
            role="img"
            aria-label="Gráfico de vitórias por semana de cada IA"
          >
            {ySteps.map((s, i) => (
              <g key={i}>
                <line
                  x1={PADDING_X}
                  x2={WIDTH - PADDING_X}
                  y1={s.y}
                  y2={s.y}
                  stroke="currentColor"
                  strokeOpacity={0.1}
                  strokeDasharray="3 4"
                />
                <text
                  x={PADDING_X - 8}
                  y={s.y}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fontSize="10"
                  fill="currentColor"
                  fillOpacity={0.5}
                >
                  {s.label}
                </text>
              </g>
            ))}
            {xLabels.map((l, i) => (
              <text
                key={i}
                x={l.x}
                y={HEIGHT - 4}
                textAnchor="middle"
                fontSize="10"
                fill="currentColor"
                fillOpacity={0.6}
              >
                {l.label}
              </text>
            ))}
            {polylines.map(({ agent, points }) => (
              <polyline
                key={agent}
                points={points}
                fill="none"
                stroke={AGENT_CHART_COLORS[agent]}
                strokeWidth={2.5}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            ))}
            {polylines.map(({ agent, points }) =>
              points.split(' ').map((pt, idx) => {
                const [x, y] = pt.split(',').map(Number);
                return (
                  <circle
                    key={`${agent}-${idx}`}
                    cx={x}
                    cy={y}
                    r={3}
                    fill={AGENT_CHART_COLORS[agent as AgentIA]}
                  />
                );
              }),
            )}
          </svg>
        </div>
        <div className="flex flex-wrap gap-3">
          {AGENTS.map((agent) => (
            <div key={agent} className="flex items-center gap-2 text-xs">
              <span
                className="inline-block size-3 rounded-sm"
                style={{ backgroundColor: AGENT_CHART_COLORS[agent] }}
              />
              <span className="font-medium">{IA_CONFIG[agent].label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
