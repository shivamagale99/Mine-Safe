import React, { useState, useMemo } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  Circle,
  Polyline,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import { Vehicle, Sensor, MiningZone } from '../../types';
import {
  Truck,
  Cpu,
  AlertTriangle,
  Layers,
  MapPin,
  X,
  Gauge,
  ShieldCheck,
  Fuel,
  Thermometer,
  Radio,
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix standard Leaflet default marker icon path issue in Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom SVG Vehicle Marker Icon generator with heading rotation
const createVehicleIcon = (status: Vehicle['status'], heading: number, code: string, isSelected: boolean) => {
  const color =
    status === 'CRITICAL'
      ? '#DC2626'
      : status === 'HIGH_RISK'
      ? '#F59E0B'
      : status === 'WARNING'
      ? '#F59E0B'
      : '#16A34A';

  const html = `
    <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
      <div style="transform: rotate(${heading}deg); transition: transform 0.4s ease; width: 32px; height: 32px;">
        <svg viewBox="0 0 24 24" fill="${color}" stroke="#FFFFFF" stroke-width="1.8" style="width:100%; height:100%; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.25));">
          <path d="M12 2L19 21L12 17L5 21L12 2Z" />
        </svg>
      </div>
      <div style="position: absolute; bottom: -14px; left: 50%; transform: translateX(-50%); background: #FFFFFF; color: #0F172A; padding: 1px 5px; border-radius: 4px; border: 1px solid ${isSelected ? '#2563EB' : '#CBD5E1'}; font-size: 10px; font-weight: 800; font-family: monospace; white-space: nowrap; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">
        ${code}
      </div>
    </div>
  `;
  return L.divIcon({
    html,
    className: 'custom-vehicle-marker',
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
};

// Custom SVG Sensor Marker Icon
const createSensorIcon = (status: Sensor['status']) => {
  const color = status === 'ONLINE' ? '#2563EB' : status === 'DEGRADED' ? '#F59E0B' : '#DC2626';
  const html = `
    <div style="width: 22px; height: 22px; background: #FFFFFF; border: 2.5px solid ${color}; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 4px rgba(0,0,0,0.25);">
      <div style="width: 7px; height: 7px; background: ${color}; border-radius: 50%;"></div>
    </div>
  `;
  return L.divIcon({
    html,
    className: 'custom-sensor-marker',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
};

// Helper component to smoothly re-center map when center prop updates
const RecenterMap: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true });
  }, [center[0], center[1]]);
  return null;
};

interface MineMapProps {
  center?: [number, number];
  zoom?: number;
  vehicles?: Vehicle[];
  sensors?: Sensor[];
  zones?: MiningZone[];
  selectedVehicleId?: string | null;
  onSelectVehicle?: (vehicle: Vehicle) => void;
  onSelectSensor?: (sensor: Sensor) => void;
  height?: string;
}

export const MineMap: React.FC<MineMapProps> = ({
  center = [18.6312, 81.2485], // Kirandul coordinates
  zoom = 15,
  vehicles = [],
  sensors = [],
  zones = [],
  selectedVehicleId,
  onSelectVehicle,
  onSelectSensor,
  height = 'h-[540px]',
}) => {
  const [showVehicles, setShowVehicles] = useState(true);
  const [showSensors, setShowSensors] = useState(true);
  const [showZones, setShowZones] = useState(true);
  const [showTrails, setShowTrails] = useState(true);
  const [showHaulRoads, setShowHaulRoads] = useState(true);

  // Active drawer vehicle
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null);

  const effectiveVehicleId = selectedVehicleId !== undefined ? selectedVehicleId : internalSelectedId;
  const activeVehicle = useMemo(() => {
    if (!effectiveVehicleId) return null;
    return vehicles.find((v) => v.id === effectiveVehicleId) || null;
  }, [effectiveVehicleId, vehicles]);

  // Generate realistic haul roads network anchored around the current center
  const haulRoads = useMemo(() => {
    const lat = center[0];
    const lng = center[1];
    return [
      {
        id: 'road-primary-ramp',
        name: 'Main Haul Ramp #1',
        coords: [
          [lat + 0.005, lng - 0.006],
          [lat + 0.002, lng - 0.002],
          [lat - 0.001, lng + 0.001],
          [lat - 0.004, lng + 0.003],
        ] as [number, number][],
      },
      {
        id: 'road-crusher-feeder',
        name: 'Crusher Loop & Feeder Road',
        coords: [
          [lat - 0.001, lng + 0.001],
          [lat - 0.003, lng - 0.002],
          [lat - 0.006, lng + 0.001],
          [lat - 0.005, lng + 0.004],
        ] as [number, number][],
      },
      {
        id: 'road-pit-bench-b4',
        name: 'Pit Bench B-4 Cutting',
        coords: [
          [lat + 0.004, lng + 0.002],
          [lat + 0.001, lng + 0.003],
          [lat - 0.001, lng + 0.001],
        ] as [number, number][],
      },
    ];
  }, [center]);

  // Generate realistic trailing path behind each vehicle
  const vehicleTrails = useMemo(() => {
    return vehicles.map((v) => {
      const lat = v.telemetry.latitude;
      const lng = v.telemetry.longitude;
      const headingRad = ((v.telemetry.heading - 180) * Math.PI) / 180;
      const d = 0.0006;
      return {
        id: `trail-${v.id}`,
        vehicleId: v.id,
        color: v.status === 'CRITICAL' ? '#DC2626' : v.status === 'HIGH_RISK' ? '#F59E0B' : '#2563EB',
        coords: [
          [lat, lng] as [number, number],
          [lat + Math.cos(headingRad) * d * 0.6, lng + Math.sin(headingRad) * d * 0.6] as [number, number],
          [lat + Math.cos(headingRad) * d * 1.3, lng + Math.sin(headingRad) * d * 1.3] as [number, number],
          [lat + Math.cos(headingRad) * d * 2.0, lng + Math.sin(headingRad) * d * 2.0] as [number, number],
        ],
      };
    });
  }, [vehicles]);

  const handleVehicleClick = (v: Vehicle) => {
    setInternalSelectedId(v.id);
    onSelectVehicle?.(v);
  };

  return (
    <div className={`relative w-full ${height} rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50`}>
      {/* ─── Floating Layer Control Toolbar ─── */}
      <div className="absolute top-4 right-4 z-[999] bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl p-3 shadow-md space-y-2 text-xs font-mono select-none">
        <div className="flex items-center gap-2 text-slate-800 font-bold uppercase border-b border-slate-100 pb-1.5 mb-1">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <span>Map Overlays</span>
        </div>

        <label className="flex items-center gap-2 text-slate-700 cursor-pointer hover:text-slate-950">
          <input
            type="checkbox"
            checked={showHaulRoads}
            onChange={(e) => setShowHaulRoads(e.target.checked)}
            className="rounded accent-blue-600"
          />
          <span className="w-2.5 h-1 bg-amber-500 rounded-full" /> Haul Roads
        </label>

        <label className="flex items-center gap-2 text-slate-700 cursor-pointer hover:text-slate-950">
          <input
            type="checkbox"
            checked={showVehicles}
            onChange={(e) => setShowVehicles(e.target.checked)}
            className="rounded accent-blue-600"
          />
          <Truck className="w-3.5 h-3.5 text-emerald-600" /> Fleet Vehicles ({vehicles.length})
        </label>

        <label className="flex items-center gap-2 text-slate-700 cursor-pointer hover:text-slate-950">
          <input
            type="checkbox"
            checked={showTrails}
            onChange={(e) => setShowTrails(e.target.checked)}
            className="rounded accent-blue-600"
          />
          <span className="w-2 h-2 rounded-full border border-dashed border-blue-600" /> Vehicle Trails
        </label>

        <label className="flex items-center gap-2 text-slate-700 cursor-pointer hover:text-slate-950">
          <input
            type="checkbox"
            checked={showSensors}
            onChange={(e) => setShowSensors(e.target.checked)}
            className="rounded accent-blue-600"
          />
          <Cpu className="w-3.5 h-3.5 text-blue-600" /> IoT Sensors ({sensors.length})
        </label>

        <label className="flex items-center gap-2 text-slate-700 cursor-pointer hover:text-slate-950">
          <input
            type="checkbox"
            checked={showZones}
            onChange={(e) => setShowZones(e.target.checked)}
            className="rounded accent-blue-600"
          />
          <MapPin className="w-3.5 h-3.5 text-purple-600" /> Risk Zones ({zones.length})
        </label>
      </div>

      {/* ─── Leaflet Map Container ─── */}
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        <RecenterMap center={center} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 1. Haul Road Polylines */}
        {showHaulRoads &&
          haulRoads.map((road) => (
            <Polyline
              key={road.id}
              positions={road.coords}
              pathOptions={{
                color: '#F59E0B',
                weight: 4,
                opacity: 0.8,
                dashArray: '8, 6',
              }}
            >
              <Popup>
                <div className="font-mono text-xs p-1 text-slate-800">
                  <div className="font-bold text-amber-700">{road.name}</div>
                  <div>Primary Heavy Haul Gradient Road</div>
                </div>
              </Popup>
            </Polyline>
          ))}

        {/* 2. Vehicle Historical Trails */}
        {showTrails &&
          vehicleTrails.map((trail) => (
            <Polyline
              key={trail.id}
              positions={trail.coords}
              pathOptions={{
                color: trail.color,
                weight: 3,
                opacity: 0.65,
                dashArray: '4, 4',
              }}
            />
          ))}

        {/* 3. Mining Zones Polygons */}
        {showZones &&
          zones.map((zone) => {
            const color =
              zone.riskLevel === 'EXTREME'
                ? '#DC2626'
                : zone.riskLevel === 'HIGH'
                ? '#EA580C'
                : zone.riskLevel === 'MEDIUM'
                ? '#F59E0B'
                : '#16A34A';

            return (
              <Polygon
                key={zone.id}
                positions={zone.polygonCoordinates}
                pathOptions={{
                  color,
                  fillColor: color,
                  fillOpacity: zone.isRestricted ? 0.25 : 0.12,
                  weight: zone.isRestricted ? 3 : 2,
                  dashArray: zone.isRestricted ? '6, 6' : undefined,
                }}
              >
                <Popup>
                  <div className="p-1 font-mono text-xs text-slate-800 space-y-1">
                    <div className="font-bold text-slate-900 text-sm">{zone.name}</div>
                    <div>Risk Level: <span className="font-bold" style={{ color }}>{zone.riskLevel}</span></div>
                    <div>Max Speed: {zone.maxSpeedLimit} km/h</div>
                    <div>Restricted Area: {zone.isRestricted ? 'YES' : 'NO'}</div>
                  </div>
                </Popup>
              </Polygon>
            );
          })}

        {/* 4. Sensor Markers & Radar Range Circles */}
        {showSensors &&
          sensors.map((sns) => {
            const lat = sns.telemetry.gps?.latitude || center[0] + 0.001;
            const lng = sns.telemetry.gps?.longitude || center[1] + 0.001;

            return (
              <React.Fragment key={sns.id}>
                <Circle
                  center={[lat, lng]}
                  radius={sns.detectionRangeMeters}
                  pathOptions={{
                    color: sns.type === 'RADAR' ? '#2563EB' : '#9333EA',
                    fillColor: sns.type === 'RADAR' ? '#2563EB' : '#9333EA',
                    fillOpacity: 0.08,
                    weight: 1,
                  }}
                />
                <Marker
                  position={[lat, lng]}
                  icon={createSensorIcon(sns.status)}
                  eventHandlers={{ click: () => onSelectSensor?.(sns) }}
                >
                  <Popup>
                    <div className="p-1 font-mono text-xs text-slate-800 space-y-1">
                      <div className="font-bold text-blue-600">{sns.name}</div>
                      <div>Type: {sns.type}</div>
                      <div>Status: {sns.status}</div>
                      <div>Range: {sns.detectionRangeMeters}m</div>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            );
          })}

        {/* 5. Vehicle Markers Layer with Rotation */}
        {showVehicles &&
          vehicles.map((veh) => {
            const isSelected = activeVehicle?.id === veh.id;
            const icon = createVehicleIcon(
              veh.status,
              veh.telemetry.heading,
              veh.code,
              isSelected
            );

            return (
              <Marker
                key={veh.id}
                position={[veh.telemetry.latitude, veh.telemetry.longitude]}
                icon={icon}
                eventHandlers={{
                  click: () => handleVehicleClick(veh),
                }}
              />
            );
          })}
      </MapContainer>

      {/* ─── Vehicle Detail Side Drawer ─── */}
      {activeVehicle && (
        <aside
          className="absolute inset-y-0 right-0 w-80 sm:w-96 bg-white/95 backdrop-blur-md border-l border-slate-200 shadow-xl z-[1001] p-5 flex flex-col justify-between overflow-y-auto font-sans animate-in slide-in-from-right duration-200"
          aria-label="Vehicle Telemetry Drawer"
        >
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${
                    activeVehicle.status === 'CRITICAL'
                      ? 'bg-red-600'
                      : activeVehicle.status === 'WARNING'
                      ? 'bg-amber-500'
                      : 'bg-emerald-600'
                  }`}
                >
                  <Truck className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-slate-900 font-mono">
                      {activeVehicle.code}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                        activeVehicle.status === 'CRITICAL'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {activeVehicle.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">{activeVehicle.name}</div>
                </div>
              </div>

              <button
                onClick={() => setInternalSelectedId(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Operator & Zone */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <div className="text-slate-500">Assigned Operator</div>
                <div className="font-bold text-slate-800 mt-0.5">
                  {activeVehicle.operatorName || 'Operator Shift A'}
                </div>
                <div className="text-[10px] text-slate-500">{activeVehicle.operatorPhone || '+91 98765 43210'}</div>
              </div>
              <div>
                <div className="text-slate-500">Current Zone</div>
                <div className="font-bold text-amber-700 mt-0.5">Pit Bench B-4</div>
                <div className="text-[10px] text-slate-500">Speed Limit: 20 km/h</div>
              </div>
            </div>

            {/* Telemetry Metrics */}
            <div className="space-y-2 font-mono">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Speed & Navigation
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5 text-blue-600" /> Current Speed
                  </div>
                  <div className="text-2xl font-black text-slate-900 mt-1">
                    {activeVehicle.telemetry.speedKmh}{' '}
                    <span className="text-xs text-slate-500">km/h</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-500 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Recommended
                  </div>
                  <div className="text-2xl font-black text-blue-600 mt-1">
                    {activeVehicle.telemetry.recommendedSpeedKmh}{' '}
                    <span className="text-xs text-slate-500">km/h</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Nearest Vehicle Proximity */}
            {activeVehicle.telemetry.nearestVehicleDistanceMeters !== undefined && (
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Proximity Target:</span>
                  <span className="font-bold text-slate-900">
                    {activeVehicle.telemetry.nearestVehicleName || 'Vehicle Ahead'}
                  </span>
                </div>
                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-slate-600">Separation Distance:</span>
                  <span
                    className={`text-lg font-black ${
                      activeVehicle.telemetry.nearestVehicleDistanceMeters < 10
                        ? 'text-red-600'
                        : 'text-amber-600'
                    }`}
                  >
                    {activeVehicle.telemetry.nearestVehicleDistanceMeters}m
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Relative Velocity:</span>
                  <span className="text-slate-800 font-bold">
                    {activeVehicle.telemetry.relativeSpeedKmh} km/h
                  </span>
                </div>
              </div>
            )}

            {/* Recommended Advisory Action */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
              <div className="text-[10px] font-mono font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Active Driver Advisory
              </div>
              <div className="text-xs font-semibold text-slate-800">
                {activeVehicle.telemetry.recommendedAction || 'Maintain regular haulage speed.'}
              </div>
            </div>

            {/* Hardware Telemetry */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center gap-2">
                <Fuel className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-500">Fuel Level</div>
                  <div className="font-bold text-slate-900">{activeVehicle.telemetry.fuelLevelPercent}%</div>
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-500">Engine Temp</div>
                  <div className="font-bold text-slate-900">{activeVehicle.telemetry.engineTempCelsius}°C</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 text-[11px] font-mono text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Radio className="w-3 h-3 text-emerald-600" /> RTK GPS Heading: {activeVehicle.telemetry.heading}°
            </span>
            <span>{new Date(activeVehicle.telemetry.lastUpdate).toLocaleTimeString()}</span>
          </div>
        </aside>
      )}
    </div>
  );
};
