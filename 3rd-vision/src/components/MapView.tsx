import React from 'react';
import { MineMap } from './maps/MineMap';
import { Vehicle, Sensor, MiningZone } from '../types';

interface MapViewProps {
  vehicles?: Vehicle[];
  sensors?: Sensor[];
  zones?: MiningZone[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  selectedVehicleId?: string | null;
  onSelectVehicle?: (vehicle: Vehicle) => void;
  onSelectSensor?: (sensor: Sensor) => void;
}

export const MapView: React.FC<MapViewProps> = (props) => {
  return <MineMap {...props} />;
};
