import { useEffect, useState } from 'react';
import { socketService } from '../services/socket.service';
import { useAlertStore } from '../store/alertStore';
import { useSiteStore } from '../store/siteStore';
import { Alert, Vehicle, Sensor } from '../types';

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState<boolean>(() => socketService.getIsConnected());
  const { addAlert, acknowledgeAlert } = useAlertStore();
  const { updateSiteCondition } = useSiteStore();

  useEffect(() => {
    const socket = socketService.connect();

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    // Event 1: sensor:update
    socket.on('sensor:update', (sensorData: Sensor) => {
      console.log('⚡ Event received: sensor:update', sensorData.id);
      if (sensorData.type === 'VISIBILITY' && sensorData.telemetry.visibility) {
        updateSiteCondition(sensorData.siteId, {
          visibilityMeters: sensorData.telemetry.visibility.visibilityMeters,
          fogLevelPercent: sensorData.telemetry.visibility.fogLevelPercent,
          status: sensorData.telemetry.visibility.status === 'DENSE_FOG' ? 'DENSE_FOG' : 'CLEAR',
        });
      }
    });

    // Event 2: vehicle:update
    socket.on('vehicle:update', (vehicleData: Vehicle) => {
      console.log('⚡ Event received: vehicle:update', vehicleData.code);
    });

    // Event 3: alert:created
    socket.on('alert:created', (newAlert: Alert) => {
      console.log('🚨 Event received: alert:created', newAlert.title);
      addAlert(newAlert);
    });

    // Event 4: alert:updated
    socket.on('alert:updated', (updatedAlert: Alert) => {
      console.log('🚨 Event received: alert:updated', updatedAlert.id);
      if (updatedAlert.status === 'ACKNOWLEDGED' && updatedAlert.acknowledgedBy) {
        acknowledgeAlert(updatedAlert.id, updatedAlert.acknowledgedBy);
      }
    });

    // Event 5: risk:update
    socket.on('risk:update', (data: { vehicleId: string; riskScore: number; recommendedSpeed: number }) => {
      console.log('⚡ Event received: risk:update', data);
    });

    // Event 6: device:status
    socket.on('device:status', (device: { id: string; status: string }) => {
      console.log('⚡ Event received: device:status', device);
    });

    // Event 7: incident:created
    socket.on('incident:created', (incident: any) => {
      console.log('⚡ Event received: incident:created', incident.id);
    });

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('sensor:update');
      socket.off('vehicle:update');
      socket.off('alert:created');
      socket.off('alert:updated');
      socket.off('risk:update');
      socket.off('device:status');
      socket.off('incident:created');
    };
  }, [addAlert, acknowledgeAlert, updateSiteCondition]);

  return { isConnected };
};
