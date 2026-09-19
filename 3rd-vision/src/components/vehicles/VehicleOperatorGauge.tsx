import React from 'react';
import { Vehicle } from '../../types';
import { AlertTriangle, ShieldCheck, Gauge, Eye, Truck, Flame } from 'lucide-react';
import { Button } from '../ui/Button';

interface VehicleOperatorGaugeProps {
  vehicle: Vehicle;
  visibilityMeters: number;
  onAcknowledgeAlert?: () => void;
}

export const VehicleOperatorGauge: React.FC<VehicleOperatorGaugeProps> = ({
  vehicle,
  visibilityMeters,
  onAcknowledgeAlert,
}) => {
  const { telemetry } = vehicle;
  const isCritical = vehicle.status === 'CRITICAL';
  const isWarning = vehicle.status === 'WARNING' || vehicle.status === 'HIGH_RISK';

  const speedExceeded = telemetry.speedKmh > telemetry.recommendedSpeedKmh;

  return (
    <div className="space-y-6">
      {/* Dynamic Caution Banner */}
      <div
        className={`p-6 rounded-3xl border text-center shadow-2xl transition-all duration-300 ${
          isCritical
            ? 'bg-red-950/80 border-red-600 animate-pulse'
            : isWarning
            ? 'bg-amber-950/80 border-amber-500'
            : 'bg-emerald-950/60 border-emerald-600'
        }`}
      >
        <div className="flex items-center justify-center gap-2 text-sm font-mono font-extrabold uppercase tracking-widest">
          {isCritical ? (
            <>
              <AlertTriangle className="w-6 h-6 text-red-400 stroke-[3]" />
              <span className="text-red-400">CRITICAL SAFETY ALERT</span>
            </>
          ) : isWarning ? (
            <>
              <AlertTriangle className="w-6 h-6 text-amber-400 stroke-[3]" />
              <span className="text-amber-400">CAUTION ADVISORY</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-6 h-6 text-emerald-400 stroke-[3]" />
              <span className="text-emerald-400">NORMAL SAFE SPEED</span>
            </>
          )}
        </div>

        <div className="mt-3 text-3xl sm:text-5xl font-black text-white font-mono tracking-tight uppercase">
          {telemetry.recommendedAction}
        </div>
      </div>

      {/* Speed & Proximity Large Gauge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Speedometer Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-xl relative overflow-hidden">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Gauge className="w-5 h-5 text-amber-400" /> Current Vehicle Speed
          </div>

          <div className="flex items-baseline justify-center gap-2 my-2">
            <span
              className={`text-6xl sm:text-8xl font-black font-mono tracking-tighter ${
                speedExceeded ? 'text-red-400 animate-pulse' : 'text-white'
              }`}
            >
              {telemetry.speedKmh}
            </span>
            <span className="text-xl font-mono text-slate-400 font-bold">KM/H</span>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 w-full flex items-center justify-around text-sm font-mono">
            <div>
              <div className="text-slate-400 text-xs">Recommended Speed</div>
              <div className="text-2xl font-black text-amber-400">{telemetry.recommendedSpeedKmh} KM/H</div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <div className="text-slate-400 text-xs">Speed Status</div>
              <div className={`text-sm font-bold ${speedExceeded ? 'text-red-400' : 'text-emerald-400'}`}>
                {speedExceeded ? 'OVERSPEED' : 'SAFE COMPLIANCE'}
              </div>
            </div>
          </div>
        </div>

        {/* Proximity & Visibility Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between shadow-xl space-y-6">
          
          {/* Nearest Vehicle Proximity */}
          <div>
            <div className="text-xs font-mono text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
              <Truck className="w-5 h-5 text-cyan-400" /> Nearest Vehicle Proximity
            </div>
            {telemetry.nearestVehicleDistanceMeters !== undefined ? (
              <div>
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-5xl font-black font-mono ${
                      telemetry.nearestVehicleDistanceMeters < 10 ? 'text-red-400' : 'text-amber-400'
                    }`}
                  >
                    {telemetry.nearestVehicleDistanceMeters}m
                  </span>
                  <span className="text-sm font-mono text-slate-300 font-bold">
                    ({telemetry.nearestVehicleName || 'D-108'})
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Relative Closing Velocity:{' '}
                  <span className="font-mono font-bold text-white">
                    {telemetry.relativeSpeedKmh} km/h
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-lg font-bold text-emerald-400">No Vehicle within 100m</div>
            )}
          </div>

          {/* Visibility & Risk Score */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-sm font-mono">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className="text-xs text-slate-400 flex items-center gap-1">
                <Eye className="w-4 h-4 text-amber-400" /> Optical Visibility
              </div>
              <div className="text-2xl font-black text-white mt-1">{visibilityMeters}m</div>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className="text-xs text-slate-400 flex items-center gap-1">
                <Flame className="w-4 h-4 text-red-400" /> Risk Score
              </div>
              <div className="text-2xl font-black text-red-400 mt-1">{telemetry.riskScorePercent}%</div>
            </div>
          </div>

        </div>

      </div>

      {/* Large Touch Acknowledge Button */}
      {isCritical && onAcknowledgeAlert && (
        <Button
          variant="primary"
          size="lg"
          className="w-full py-6 text-xl tracking-wider uppercase font-black shadow-2xl shadow-amber-500/30"
          onClick={onAcknowledgeAlert}
        >
          ✓ ACKNOWLEDGE & REDUCE SPEED NOW
        </Button>
      )}
    </div>
  );
};
