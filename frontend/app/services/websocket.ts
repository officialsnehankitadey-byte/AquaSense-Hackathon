import { NetworkNode } from '../types/dashboard';

export interface TelemetryData {
  timestamp: string;
  avgPressurePsi: number;
  flowRateGpm: number;
  acousticDb: number;
  activeLeaks: number;
  nrwPercentage: number;
  nodes?: NetworkNode[];
}

type TelemetryCallback = (data: TelemetryData) => void;

export function getWsBaseUrl(): string {
  let envUrl = process.env.NEXT_PUBLIC_WS_URL;

  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host.includes('onrender.com')) {
      const backendHost = host.replace('aquasense-frontend', 'aquasense-backend');
      return `wss://${backendHost}/ws/telemetry`;
    }
  }

  if (!envUrl) {
    return 'ws://localhost:8000/ws/telemetry';
  }

  if (!envUrl.startsWith('ws://') && !envUrl.startsWith('wss://')) {
    const proto = envUrl.startsWith('https://') ? 'wss://' : 'ws://';
    envUrl = envUrl.replace(/^https?:\/\//, proto);
    if (!envUrl.startsWith('ws://') && !envUrl.startsWith('wss://')) {
      envUrl = `wss://${envUrl}`;
    }
  }

  envUrl = envUrl.replace(/\/+$/, '');
  if (!envUrl.endsWith('/ws/telemetry')) {
    envUrl = `${envUrl}/ws/telemetry`;
  }
  return envUrl;
}

export class TelemetryWebSocketService {
  private ws: WebSocket | null = null;
  private listeners: TelemetryCallback[] = [];
  private fallbackInterval: NodeJS.Timeout | null = null;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 3;

  connect() {
    if (typeof window === 'undefined') return;

    try {
      const wsUrl = getWsBaseUrl();
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.stopFallback();
      };

      this.ws.onmessage = (event) => {
        try {
          const raw = JSON.parse(event.data);
          let telemetryData: TelemetryData;

          if (raw.type === 'TELEMETRY_UPDATE' && Array.isArray(raw.nodes)) {
            const nodes: NetworkNode[] = raw.nodes;
            const validPressures = nodes.map(n => n.pressurePsi).filter(p => p > 0);
            const validFlows = nodes.map(n => n.flowGpm).filter(f => f > 0);
            
            const avgP = validPressures.length > 0 
              ? roundVal(validPressures.reduce((a, b) => a + b, 0) / validPressures.length, 1)
              : 62.5;
              
            const totalFlow = validFlows.length > 0
              ? roundVal(validFlows.reduce((a, b) => a + b, 0), 1)
              : 1450;

            const now = new Date();
            const timeStr = now.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

            telemetryData = {
              timestamp: timeStr,
              avgPressurePsi: avgP,
              flowRateGpm: totalFlow,
              acousticDb: roundVal(42.0 + Math.sin(Date.now() / 1000) * 3.5, 1),
              activeLeaks: nodes.filter(n => n.status === 'CRITICAL').length || 4,
              nrwPercentage: 18.2,
              nodes
            };
          } else {
            telemetryData = raw as TelemetryData;
          }

          this.notifyListeners(telemetryData);
        } catch (e) {
          console.error('Failed to parse WebSocket telemetry data:', e);
        }
      };

      this.ws.onerror = () => {
        this.handleDisconnect();
      };

      this.ws.onclose = () => {
        this.handleDisconnect();
      };
    } catch (e) {
      this.startFallback();
    }
  }

  private handleDisconnect() {
    this.isConnected = false;
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => this.connect(), 2000 * this.reconnectAttempts);
    } else {
      this.startFallback();
    }
  }

  private startFallback() {
    if (this.fallbackInterval) return;
    
    this.fallbackInterval = setInterval(() => {
      const now = new Date();
      const timestamp = now.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const simulatedData: TelemetryData = {
        timestamp,
        avgPressurePsi: roundVal(62.5 + (Math.random() * 2.4 - 1.2), 1),
        flowRateGpm: Math.round(1450 + (Math.random() * 40 - 20)),
        acousticDb: roundVal(42 + (Math.random() * 4 - 2), 1),
        activeLeaks: 4,
        nrwPercentage: roundVal(18.2 + (Math.random() * 0.4 - 0.2), 1),
      };
      this.notifyListeners(simulatedData);
    }, 1500);
  }

  private stopFallback() {
    if (this.fallbackInterval) {
      clearInterval(this.fallbackInterval);
      this.fallbackInterval = null;
    }
  }

  subscribe(callback: TelemetryCallback): () => void {
    this.listeners.push(callback);
    if (this.listeners.length === 1 && !this.isConnected) {
      this.connect();
    }
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
      if (this.listeners.length === 0) {
        this.disconnect();
      }
    };
  }

  private notifyListeners(data: TelemetryData) {
    this.listeners.forEach(callback => callback(data));
  }

  disconnect() {
    this.stopFallback();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
  }
}

function roundVal(num: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}

export const telemetryWS = new TelemetryWebSocketService();
