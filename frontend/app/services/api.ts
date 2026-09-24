import { 
  KPIMetric, 
  Incident, 
  NetworkNode, 
  PipeSegment, 
  RepairPriorityItem, 
  DMAZone, 
  RepairVerification,
  IncidentStatus 
} from '../types/dashboard';
import { 
  mockKPIs, 
  mockIncidents, 
  mockNetworkNodes, 
  mockPipeSegments, 
  mockRepairPriorities, 
  mockDMAZones, 
  mockRepairVerifications 
} from '../data/mockData';

export function getApiBaseUrl(): string {
  let envUrl = process.env.NEXT_PUBLIC_API_URL;

  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host.includes('onrender.com')) {
      const backendHost = host.replace('aquasense-frontend', 'aquasense-backend');
      return `https://${backendHost}/api`;
    }
  }

  if (!envUrl) {
    return 'http://localhost:8000/api';
  }

  if (!envUrl.startsWith('http://') && !envUrl.startsWith('https://')) {
    envUrl = `https://${envUrl}`;
  }

  envUrl = envUrl.replace(/\/+$/, '');
  if (!envUrl.endsWith('/api')) {
    envUrl = `${envUrl}/api`;
  }
  return envUrl;
}

async function fetchWithFallback<T>(endpoint: string, fallbackData: T): Promise<T> {
  const baseUrl = getApiBaseUrl();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    
    const response = await fetch(`${baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return fallbackData;
  }
}

export const apiService = {
  async getKPIs(): Promise<KPIMetric[]> {
    return fetchWithFallback('/telemetry/kpis', mockKPIs);
  },

  async getIncidents(): Promise<Incident[]> {
    return fetchWithFallback('/incidents', mockIncidents);
  },

  async updateIncidentStatus(incidentId: string, status: IncidentStatus): Promise<{ success: boolean }> {
    const baseUrl = getApiBaseUrl();
    try {
      const response = await fetch(`${baseUrl}/incidents/${incidentId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      // Fallback
    }
    return { success: true };
  },

  async getNetworkNodes(): Promise<NetworkNode[]> {
    return fetchWithFallback('/telemetry/nodes', mockNetworkNodes);
  },

  async getPipeSegments(): Promise<PipeSegment[]> {
    return fetchWithFallback('/telemetry/pipes', mockPipeSegments);
  },

  async getRepairPriorities(): Promise<RepairPriorityItem[]> {
    return fetchWithFallback('/repairs/priorities', mockRepairPriorities);
  },

  async getDMAZones(): Promise<DMAZone[]> {
    return fetchWithFallback('/telemetry/dma-zones', mockDMAZones);
  },

  async getRepairVerifications(): Promise<RepairVerification[]> {
    return fetchWithFallback('/repairs/verifications', mockRepairVerifications);
  },

  async setPRVPressure(nodeId: string, pressurePsi: number): Promise<{ success: boolean; newPressure: number }> {
    const baseUrl = getApiBaseUrl();
    try {
      const response = await fetch(`${baseUrl}/sensors/prv/adjust`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodeId, targetPressurePsi: pressurePsi }),
      });
      if (response.ok) {
        const data = await response.json();
        return { success: true, newPressure: data.updatedNode?.pressurePsi || pressurePsi };
      }
    } catch (err) {
      // Fallback
    }
    return { success: true, newPressure: pressurePsi };
  },

  async dispatchCrew(incidentId: string, crewName: string): Promise<{ success: boolean; status: IncidentStatus }> {
    const baseUrl = getApiBaseUrl();
    try {
      const response = await fetch(`${baseUrl}/incidents/${incidentId}/dispatch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crewName }),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      // Fallback
    }
    return { success: true, status: 'DISPATCHED' };
  },

  async triggerDemoBurst(): Promise<any> {
    const baseUrl = getApiBaseUrl();
    try {
      const response = await fetch(`${baseUrl}/demo/trigger-burst`, { method: 'POST' });
      return await response.json();
    } catch (e) {
      return null;
    }
  },

  async resetDemo(): Promise<any> {
    const baseUrl = getApiBaseUrl();
    try {
      const response = await fetch(`${baseUrl}/demo/reset`, { method: 'POST' });
      return await response.json();
    } catch (e) {
      return null;
    }
  }
};
