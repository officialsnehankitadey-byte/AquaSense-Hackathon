import { useState, useEffect } from 'react';
import { telemetryWS, TelemetryData } from '../services/websocket';
import { apiService } from '../services/api';
import { KPIMetric } from '../types/dashboard';

export function useTelemetry() {
  const [telemetryHistory, setTelemetryHistory] = useState<TelemetryData[]>([]);
  const [latestTelemetry, setLatestTelemetry] = useState<TelemetryData | null>(null);
  const [kpis, setKpis] = useState<KPIMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load initial KPIs from API / Fallback
    apiService.getKPIs().then(data => {
      setKpis(data);
      setIsLoading(false);
    });

    // Subscribe to live telemetry stream
    const unsubscribe = telemetryWS.subscribe((data) => {
      setLatestTelemetry(data);
      setTelemetryHistory(prev => {
        const updated = [...prev, data];
        return updated.slice(-20); // Keep last 20 ticks for telemetry charts
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    telemetryHistory,
    latestTelemetry,
    kpis,
    isLoading,
    refreshKPIs: async () => {
      const data = await apiService.getKPIs();
      setKpis(data);
    }
  };
}
