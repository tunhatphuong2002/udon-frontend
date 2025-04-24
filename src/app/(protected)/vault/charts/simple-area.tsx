import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
  Area,
  ReferenceLine,
} from 'recharts';

interface ChartProps {
  data: Array<{ date: string; value: number }>;
  tooltipFormatter?: (value: number) => React.ReactNode;
  className?: string;
  showAvg?: boolean;
  avgValue?: number;
}

export const SimpleAreaChart: React.FC<ChartProps> = ({
  data,
  tooltipFormatter,
  className,
  showAvg = true,
  avgValue = 4.55,
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <LineChart data={data} margin={{ left: 0, right: 0, top: 24, bottom: 0 }}>
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.22} />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.04} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          tick={{ fill: '#A1A1AA', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          orientation="left"
          tick={{ fill: '#A1A1AA', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value: number) => `${value}`}
        />
        <Tooltip
          wrapperClassName="rounded-lg overflow-hidden"
          contentStyle={{
            background: '#22232A',
            border: 'none',
            color: '#fff',
            fontSize: 14,
            borderRadius: '0.5rem',
          }}
          formatter={tooltipFormatter}
          labelFormatter={(v: number) => `Date: ${v}`}
        />
        {showAvg && (
          <>
            <ReferenceDot
              x={data[2].date}
              y={avgValue}
              r={20}
              isFront={true}
              fill="#393C43"
              stroke="rgba(30,174,219,0.22)"
              strokeWidth={2}
              label={{
                position: 'top',
                value: `Avg ${avgValue}%`,
                fill: '#8894ad',
                fontSize: 11,
                fontWeight: 500,
              }}
            />
            <ReferenceLine y={avgValue} stroke="#2d333b" strokeDasharray="3 3" />
          </>
        )}
        <Area type="monotone" dataKey="value" stroke="none" fill="url(#areaGradient)" />
        <Line
          type="monotone"
          dataKey="value"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 5, fill: 'hsl(var(--primary))' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
