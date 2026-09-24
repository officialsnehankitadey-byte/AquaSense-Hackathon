import { useState, useEffect } from 'react';
import { telemetryWS, TelemetryData } from '../services/websocket';
import { apiService } from '../services/api';
import { KPIMetric } from '../types/dashboard';

export function useTelemetry() {
  const [telemetryHistory, setTelemetryHistory] = useState<TelemetryData[]>([]);
  const [latestTelemetry, setLatestTelemetry] = useState<TelemetryData | null>(null);
  const [kpis, setKpis] = useState<KPIMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshKPIs = async () => {
    const data = await apiService.getKPIs();
    if (data && data.length > 0) {
      setKpis(data);
    }
  };

  useEffect(() => {
    refreshKPIs().then(() => setIsLoading(false));

    // Subscribe to live telemetry stream
    const unsubscribe = telemetryWS.subscribe((data) => {
      setLatestTelemetry(data);
      setTelemetryHistory(prev => {
        const updated = [...prev, data];
        return updated.slice(-25); // Keep last 25 ticks for dynamic live chart
      });
    });

    // Periodically refresh KPIs every 3 seconds to capture live SCADA variations
    const intervalId = setInterval(() => {
      refreshKPIs();
    }, 3000);

    return () => {
      unsubscribe();
      clearInterval(intervalId);
    };
  }, []);

  return {
    telemetryHistory,
    latestTelemetry,
    kpis,
    isLoading,
    refreshKPIs
  };
}
