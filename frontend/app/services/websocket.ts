type TelemetryCallback = (data: TelemetryData) => void;

export interface TelemetryData {
  timestamp: string;
  avgPressurePsi: number;
  flowRateGpm: number;
  acousticDb: number;
  activeLeaks: number;
  nrwPercentage: number;
}

const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws/telemetry';

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
      this.ws = new WebSocket(WS_BASE_URL);

      this.ws.onopen = () => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.stopFallback();
      };

      this.ws.onmessage = (event) => {
        try {
          const data: TelemetryData = JSON.parse(event.data);
          this.notifyListeners(data);
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
    
    // Simulate real-time 1Hz telemetry tick fallback
    this.fallbackInterval = setInterval(() => {
      const now = new Date();
      const timestamp = now.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const simulatedData: TelemetryData = {
        timestamp,
        avgPressurePsi: +(62.5 + (Math.random() * 2.4 - 1.2)).toFixed(1),
        flowRateGpm: Math.round(1450 + (Math.random() * 40 - 20)),
        acousticDb: +(42 + (Math.random() * 4 - 2)).toFixed(1),
        activeLeaks: 4,
        nrwPercentage: +(18.2 + (Math.random() * 0.4 - 0.2)).toFixed(1),
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

export const telemetryWS = new TelemetryWebSocketService();
