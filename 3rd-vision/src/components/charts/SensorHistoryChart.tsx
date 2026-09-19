import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface SensorHistoryChartProps {
  data?: { time: string; value: number; benchmark?: number }[];
  title?: string;
  unit?: string;
  color?: string;
}

const DEFAULT_DATA = [
  { time: '08:00', value: 24.5, benchmark: 20 },
  { time: '08:15', value: 22.1, benchmark: 20 },
  { time: '08:30', value: 18.4, benchmark: 20 },
  { time: '08:45', value: 12.0, benchmark: 20 },
  { time: '09:00', value: 4.2, benchmark: 20 },
  { time: '09:15', value: 3.8, benchmark: 20 },
  { time: '09:30', value: 8.5, benchmark: 20 },
  { time: '09:45', value: 14.2, benchmark: 20 },
];

export const SensorHistoryChart: React.FC<SensorHistoryChartProps> = ({
  data = DEFAULT_DATA,
  title = 'Telemetry History (Visibility)',
  unit = 'm',
  color = '#2563eb',
}) => {
  const [timeRange, setTimeRange] = useState<'1H' | '6H' | '24H'>('1H');

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-bold text-slate-900 text-sm tracking-tight">{title}</h4>
          <p className="text-[11px] text-slate-500 font-mono">Real-time IoT time series stream</p>
        </div>

        {/* Range Selector */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-[10px] font-mono">
          {(['1H', '6H', '24H'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-2 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                timeRange === range ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="time" stroke="#94a3b8" tick={{ fontSize: 11, fill: '#64748b' }} />
            <YAxis stroke="#94a3b8" tick={{ fontSize: 11, fill: '#64748b' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#e2e8f0',
                borderRadius: '8px',
                color: '#0f172a',
                fontSize: '12px',
                fontFamily: 'monospace',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(val: any) => [`${val} ${unit}`, 'Reading']}
            />
            <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fillOpacity={1} fill="url(#chartGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
