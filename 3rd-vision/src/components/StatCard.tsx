import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  statusColor?: 'emerald' | 'amber' | 'orange' | 'red' | 'blue' | 'purple';
  subtext?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  unit,
  icon,
  trend,
  statusColor = 'blue',
  subtext,
}) => {
  const iconStyleMap = {
    emerald: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    amber: 'text-amber-800 bg-amber-50 border-amber-200',
    orange: 'text-orange-800 bg-orange-50 border-orange-200',
    red: 'text-red-700 bg-red-50 border-red-200',
    blue: 'text-blue-700 bg-blue-50 border-blue-200',
    purple: 'text-purple-700 bg-purple-50 border-purple-200',
  }[statusColor];

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:border-slate-300">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold">{label}</span>
        {icon && (
          <div className={`w-8 h-8 rounded-xl border flex items-center justify-center ${iconStyleMap}`}>
            {icon}
          </div>
        )}
      </div>

      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">{value}</span>
        {unit && <span className="text-xs font-mono text-slate-500 font-semibold">{unit}</span>}
      </div>

      {(trend || subtext) && (
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
          {trend && (
            <span className={`font-mono font-semibold ${trend.isPositive ? 'text-emerald-700' : 'text-red-600'}`}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </span>
          )}
          {subtext && <span className="text-slate-500">{subtext}</span>}
        </div>
      )}
    </div>
  );
};
