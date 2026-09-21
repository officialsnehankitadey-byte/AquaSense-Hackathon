export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type IncidentStatus = 'UNASSIGNED' | 'INVESTIGATING' | 'DISPATCHED' | 'REPAIRED';

export interface KPIMetric {
  id: string;
  title: string;
  value: string;
  unit?: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  secondaryInfo: string;
  icon: string;
}

export interface Incident {
  id: string;
  code: string;
  location: string;
  dmaZone: string;
  severity: SeverityLevel;
  confidence: number; // percentage e.g. 96
  estimatedLossGpm: number; // gallons per minute / liters per min
  estimatedDailyCost: number; // USD saved/lost per day
  detectedTime: string;
  status: IncidentStatus;
  pipeType: string;
  pipeDiameter: string;
  acousticFreq: number; // Hz
  pressureDropPsi: number; // PSI drop
  assignedCrew?: string;
  summary: string;
}

export interface NetworkNode {
  id: string;
  name: string;
  type: 'PUMP_STATION' | 'VALVE' | 'ACOUSTIC_SENSOR' | 'PRESSURE_SENSOR' | 'RESERVOIR' | 'LEAK_SPOT';
  x: number; // percentage position 0-100
  y: number; // percentage position 0-100
  status: 'OPTIMAL' | 'WARNING' | 'CRITICAL' | 'OFFLINE';
  pressurePsi: number;
  flowGpm: number;
  zone: string;
  batteryLevel?: number;
  lastPing?: string;
}

export interface PipeSegment {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  status: 'NORMAL' | 'HIGH_PRESSURE' | 'LEAK_DETECTED' | 'MAINTENANCE';
  flowDirection: 'FORWARD' | 'REVERSE';
  diameterInches: number;
  lengthMeters: number;
  flowRateGpm: number;
}

export interface RepairPriorityItem {
  id: string;
  incidentId: string;
  rank: number;
  location: string;
  severity: SeverityLevel;
  economicLossPerDay: number;
  aiRecommendation: string;
  structuralRiskScore: number; // 0-100
  estimatedRepairHours: number;
  roiDays: number;
  targetValveToIsolate: string;
}

export interface DMAZone {
  id: string;
  name: string;
  totalSensors: number;
  activeLeaks: number;
  avgPressurePsi: number;
  waterLossRate: number; // percentage
}
