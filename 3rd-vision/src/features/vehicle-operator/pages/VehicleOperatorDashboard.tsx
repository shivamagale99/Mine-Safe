import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useSiteStore } from '../../../store/siteStore';
import { useVehicles } from '../../../hooks/useVehicles';
import { useAlertStore } from '../../../store/alertStore';
import { MOCK_VEHICLES } from '../../../services/mockData';
import {
  Truck,
  Gauge,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Radio,
} from 'lucide-react';

export const VehicleOperatorDashboard: React.FC = () => {
  const { user, selectedSiteId } = useAuth();
  const { selectedSite } = useSiteStore();
  const { vehicles } = useVehicles(selectedSite.id || selectedSiteId);
  const { acknowledgeAlert, alerts } = useAlertStore();

  const [acknowledged, setAcknowledged] = useState(false);

  // Find operator's assigned vehicle or fallback to D-104 or MOCK_VEHICLES[0]
  const operatorVehicle =
    vehicles.find((v) => v.code === 'D-104') || vehicles[0] || MOCK_VEHICLES[0];

  const currentSpeed = operatorVehicle.telemetry.speedKmh || 18;
  const recommendedSpeed = operatorVehicle.telemetry.recommendedSpeedKmh || 10;
  const visibility = selectedSite.currentCondition?.visibilityMeters || 4.2;
  const nearestVehicleDistance =
    operatorVehicle.telemetry.nearestVehicleDistanceMeters !== undefined
      ? operatorVehicle.telemetry.nearestVehicleDistanceMeters
      : 27;

  // Active warning banner determination
  const isOverSpeed = currentSpeed > recommendedSpeed;
  const isLowVisibility = visibility < 10;
  const isCollisionRisk = nearestVehicleDistance < 20;

  let warningTitle = 'ALL SYSTEMS NORMAL';
  let warningInstruction = 'Maintain safe headway & standard speed';
  let warningSeverity: 'SAFE' | 'WARNING' | 'CRITICAL' = 'SAFE';

  if (isCollisionRisk) {
    warningTitle = 'CRITICAL PROXIMITY ALERT';
    warningInstruction = 'Vehicle Ahead in Blind Spot • Brake Immediately';
    warningSeverity = 'CRITICAL';
  } else if (isLowVisibility || isOverSpeed) {
    warningTitle = 'LOW VISIBILITY';
    warningInstruction = 'Reduce Speed';
    warningSeverity = 'WARNING';
  }

  const handleAcknowledge = () => {
    setAcknowledged(true);
    const activeAlert = alerts.find(
      (a) => a.vehicleCode === operatorVehicle.code && a.status === 'ACTIVE'
    );
    if (activeAlert) {
      acknowledgeAlert(activeAlert.id, user?.displayName || 'Driver D-104');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4 px-2 sm:px-4 space-y-6 font-sans select-none">
      
      {/* ─── Vehicle Header Identifier ─── */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black shadow-sm">
            <Truck className="w-8 h-8 stroke-[2.5]" />
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-slate-500">
              In-Cab Driver Interface
            </div>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-mono">
              Vehicle {operatorVehicle.code}
            </div>
          </div>
        </div>

        <div className="text-right font-mono">
          <div className="text-xs text-slate-500">Zone</div>
          <div className="text-lg font-bold text-amber-700">Pit Bench B-4</div>
          <div className="text-[10px] text-slate-500">{selectedSite.name}</div>
        </div>
      </div>

      {/* ─── Warning Banner ─── */}
      <div
        className={`rounded-3xl p-6 sm:p-8 border-2 transition-all shadow-sm ${
          warningSeverity === 'CRITICAL'
            ? 'bg-red-50 border-red-500 text-slate-900'
            : warningSeverity === 'WARNING'
            ? 'bg-amber-50 border-amber-500 text-slate-900'
            : 'bg-emerald-50 border-emerald-500 text-slate-900'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <AlertTriangle
                className={`w-7 h-7 ${
                  warningSeverity === 'CRITICAL'
                    ? 'text-red-600 animate-bounce'
                    : warningSeverity === 'WARNING'
                    ? 'text-amber-600'
                    : 'text-emerald-600'
                }`}
              />
              <span className="text-2xl sm:text-3xl font-black uppercase tracking-wider font-mono">
                {warningTitle}
              </span>
            </div>
            <p className="text-lg sm:text-xl font-bold text-slate-700">
              {warningInstruction}
            </p>
          </div>

          <button
            onClick={handleAcknowledge}
            disabled={acknowledged}
            className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-base sm:text-lg uppercase tracking-wider transition-transform active:scale-95 shadow-sm cursor-pointer ${
              acknowledged
                ? 'bg-slate-100 text-slate-400 cursor-default border border-slate-200'
                : warningSeverity === 'CRITICAL'
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-amber-500 hover:bg-amber-600 text-white'
            }`}
          >
            {acknowledged ? '✓ Acknowledged' : 'Acknowledge'}
          </button>
        </div>
      </div>

      {/* ─── 4 Large Metrics Display ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 font-mono">
        {/* Speed */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-base font-bold uppercase tracking-wider">Speed</span>
            <Gauge className="w-6 h-6 text-slate-400" />
          </div>
          <div className="text-6xl sm:text-7xl font-black text-slate-900 tracking-tight">
            {currentSpeed}{' '}
            <span className="text-xl sm:text-2xl font-normal text-slate-400">km/h</span>
          </div>
          <div className="text-xs text-slate-500">Current road speed</div>
        </div>

        {/* Recommended Speed */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-amber-700">
            <span className="text-base font-bold uppercase tracking-wider">Recommended</span>
            <CheckCircle2 className="w-6 h-6 text-amber-600" />
          </div>
          <div className="text-6xl sm:text-7xl font-black text-amber-600 tracking-tight">
            {recommendedSpeed}{' '}
            <span className="text-xl sm:text-2xl font-normal text-amber-600/70">km/h</span>
          </div>
          <div className="text-xs text-amber-700">Computed safe speed limit</div>
        </div>

        {/* Visibility */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-base font-bold uppercase tracking-wider">Visibility</span>
            <Eye className="w-6 h-6 text-slate-400" />
          </div>
          <div className="text-6xl sm:text-7xl font-black text-slate-900 tracking-tight">
            {visibility}{' '}
            <span className="text-xl sm:text-2xl font-normal text-slate-400">m</span>
          </div>
          <div className="text-xs text-slate-500">Optical sensor measurement</div>
        </div>

        {/* Nearest Vehicle */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-base font-bold uppercase tracking-wider">Nearest Vehicle</span>
            <Truck className="w-6 h-6 text-slate-400" />
          </div>
          <div
            className={`text-6xl sm:text-7xl font-black tracking-tight ${
              nearestVehicleDistance < 15 ? 'text-red-600' : 'text-slate-900'
            }`}
          >
            {nearestVehicleDistance}{' '}
            <span className="text-xl sm:text-2xl font-normal text-slate-400">m</span>
          </div>
          <div className="text-xs text-slate-500">
            Target: D-108 (Komatsu HD785)
          </div>
        </div>
      </div>

      {/* ─── Minimal Telemetry Bar ─── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between text-xs font-mono text-slate-500 shadow-sm">
        <span className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          V2X Radar Proximity & RTK GPS Active
        </span>
        <span>Last update: Just now</span>
      </div>

    </div>
  );
};
