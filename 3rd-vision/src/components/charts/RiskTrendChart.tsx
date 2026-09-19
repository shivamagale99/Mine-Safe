import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

interface RiskTrendChartProps {
  data?: any[];
}

const DEFAULT_RISK_DATA = [
  { time: '06:00', siteRisk: 12, vehicleRisk: 15, fogLevel: 10 },
  { time: '07:00', siteRisk: 22, vehicleRisk: 28, fogLevel: 25 },
  { time: '08:00', siteRisk: 45, vehicleRisk: 54, fogLevel: 55 },
  { time: '09:00', siteRisk: 88, vehicleRisk: 91, fogLevel: 78 },
  { time: '10:00', siteRisk: 62, vehicleRisk: 48, fogLevel: 45 },
  { time: '11:00', siteRisk: 34, vehicleRisk: 25, fogLevel: 20 },
  { time: '12:00', siteRisk: 18, vehicleRisk: 14, fogLevel: 10 },
];

export const RiskTrendChart: React.FC<RiskTrendChartProps> = ({ data = DEFAULT_RISK_DATA }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 font-sans">
      <div>
        <h4 className="font-bold text-slate-900 text-sm tracking-tight">Collision & Weather Risk Correlation Trend</h4>
        <p className="text-[11px] text-slate-500 font-mono">ML predictive probability vs atmospheric fog density</p>
      </div>

      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="time" stroke="#94a3b8" tick={{ fontSize: 11, fill: '#64748b' }} />
            <YAxis stroke="#94a3b8" tick={{ fontSize: 11, fill: '#64748b' }} domain={[0, 100]} />
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
            />
            <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
            <Line type="monotone" dataKey="vehicleRisk" name="D-104 Risk Score (%)" stroke="#dc2626" strokeWidth={2.5} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="siteRisk" name="Zone B-4 Avg Risk (%)" stroke="#f59e0b" strokeWidth={2} />
            <Line type="monotone" dataKey="fogLevel" name="Fog Density (%)" stroke="#2563eb" strokeWidth={2} strokeDasharray="4 4" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
