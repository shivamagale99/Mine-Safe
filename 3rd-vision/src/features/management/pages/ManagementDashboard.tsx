import React from 'react';
import { useAppStore } from '../../../store/appStore';
import { useAuth } from '../../../hooks/useAuth';
import { StatCard } from '../../../components/StatCard';
import { MapView } from '../../../components/MapView';
import { AlertCard } from '../../../components/AlertCard';
import { SensorHistoryChart } from '../../../components/charts/SensorHistoryChart';
import { RiskTrendChart } from '../../../components/charts/RiskTrendChart';
import { SimulationScenario } from '../../../types';
import {
  ShieldCheck,
  AlertTriangle,
  Flame,
  CloudFog,
  FileSpreadsheet,
  Globe,
  Radio,
} from 'lucide-react';
import { Button } from '../../../components/Button';

export const ManagementDashboard: React.FC = () => {
  const { user } = useAuth();
  const {
    sites,
    vehicles,
    sensors,
    zones,
    alerts,
    activeScenario,
    setScenario,
  } = useAppStore();

  const site = sites[0];
  const isPublicUser = !user || user.role === 'MANAGEMENT';

  const criticalAlertsCount = alerts.filter((a) => a.severity === 'CRITICAL' && a.status === 'ACTIVE').length;
  const warningAlertsCount = alerts.filter((a) => a.severity === 'WARNING' || a.severity === 'HIGH').length;
  const safetyScore = Math.max(60, 95 - criticalAlertsCount * 12 - warningAlertsCount * 3);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 font-sans">
      {/* Executive Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold shadow-sm">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Public Mine Safety & Operations Overview
              </h1>
              {isPublicUser && (
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  Public Mode
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Live IoT Telemetry • Kirandul Iron Ore Mine (NMDC & SECL Region)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            icon={<FileSpreadsheet className="w-4 h-4" />}
            onClick={() => alert('📄 Exporting Mine Safety Compliance Report...')}
          >
            Export Public Safety Audit
          </Button>
        </div>
      </div>

      {/* Scenario Control Quick Buttons */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-amber-600 animate-pulse" />
          <span className="text-xs font-mono font-bold text-slate-800">
            Interactive Scenario Simulation:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setScenario('NORMAL_OPERATION')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeScenario === 'NORMAL_OPERATION' || activeScenario === 'NORMAL'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            Clear Weather (Normal)
          </button>
          <button
            onClick={() => setScenario('FOG_EVENT')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeScenario === 'FOG_EVENT' || activeScenario === 'LOW_VISIBILITY'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            Dense Fog (Visibility &lt; 4m)
          </button>
          <button
            onClick={() => setScenario('COLLISION_RISK')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeScenario === 'COLLISION_RISK' || activeScenario === 'UNSAFE_DISTANCE'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            Collision Trajectory
          </button>
          <button
            onClick={() => setScenario('OVERSPEED')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeScenario === 'OVERSPEED'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            Zone Overspeed
          </button>
        </div>
      </div>

      {/* Strategic Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Mine Safety Index"
          value={safetyScore}
          unit="/ 100"
          icon={<ShieldCheck className="w-5 h-5 text-emerald-600" />}
          statusColor="emerald"
          trend={{ value: '+4.2% this month', isPositive: true }}
          subtext="Target: >90"
        />

        <StatCard
          label="Near Misses Logged"
          value={Math.max(3, warningAlertsCount + criticalAlertsCount)}
          unit="Events"
          icon={<AlertTriangle className="w-5 h-5 text-amber-600" />}
          statusColor="amber"
          trend={{ value: '-20% reduction', isPositive: true }}
          subtext="Proactive Collision Avoidance"
        />

        <StatCard
          label="Active Hazards"
          value={criticalAlertsCount}
          unit="Critical"
          icon={<Flame className="w-5 h-5 text-red-600" />}
          statusColor="red"
          subtext="0 Zero Fatalities"
        />

        <StatCard
          label="Atmospheric Visibility"
          value={site?.currentCondition?.visibilityMeters?.toFixed(1) || '25.0'}
          unit="Meters"
          icon={<CloudFog className="w-5 h-5 text-blue-600" />}
          statusColor="blue"
          subtext={`Status: ${site?.currentCondition?.status || 'CLEAR'}`}
        />
      </div>

      {/* Interactive Mine Map View */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-lg tracking-tight">
            Live Fleet & IoT Telemetry Map
          </h3>
          <span className="text-xs font-mono text-slate-500">
            Real-time positioning & radar coverage
          </span>
        </div>
        <MapView vehicles={vehicles} sensors={sensors} zones={zones} height="h-[480px]" />
      </div>

      {/* Active Public Safety Alerts Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="font-extrabold text-slate-900 text-lg tracking-tight">
              Live Mine Safety Alerts Feed
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {alerts.length} Total Alerts Logged
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.slice(0, 4).map((alert) => (
            <AlertCard key={alert.id} alert={alert} readOnly={isPublicUser} />
          ))}
        </div>
      </div>

      {/* Analytical Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskTrendChart />
        <SensorHistoryChart title="Pit Bench B-4 Atmospheric Visibility (m)" color="#2563EB" />
      </div>
    </div>
  );
};
